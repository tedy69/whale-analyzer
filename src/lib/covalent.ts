import axios from 'axios';
import { TokenBalance, Transaction } from '@/types';
import { getSupportedChains } from './chains';

const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
const BASE_URL = 'https://api.covalenthq.com/v1';

// Validate API key on module initialization
if (!COVALENT_API_KEY) {
  console.error('⚠️  COVALENT_API_KEY is not set in environment variables');
  console.error('Please ensure your .env.local file contains: COVALENT_API_KEY=your_api_key_here');
}

interface CovalentTokenItem {
  contract_ticker_symbol: string | null;
  contract_name: string | null;
  balance: string;
  quote: number;
  quote_rate: number;
  logo_url: string;
  contract_address: string;
  contract_decimals: number;
}

interface CovalentTransaction {
  tx_hash: string;
  from_address: string;
  to_address: string;
  value: string;
  block_signed_at: string;
  gas_spent: number;
}

// Rate limiting and retry utilities
class RateLimiter {
  private static requests: number[] = [];
  private static readonly MAX_REQUESTS_PER_MINUTE = 30; // Very conservative limit for Covalent
  private static readonly RETRY_DELAYS = [2000, 5000, 10000, 20000]; // Longer delays

  static async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Remove requests older than 1 minute
    this.requests = this.requests.filter((time) => time > oneMinuteAgo);

    // If we're at the limit, wait
    if (this.requests.length >= this.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = 60000 - (now - oldestRequest) + 100; // Add small buffer
      console.log(`⏳ Rate limit reached, waiting ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.waitForRateLimit(); // Recursive call after waiting
    }

    // Track this request
    this.requests.push(now);
  }

  static async withRetry<T>(operation: () => Promise<T>, context: string): Promise<T> {
    for (let attempt = 0; attempt < this.RETRY_DELAYS.length; attempt++) {
      try {
        await this.waitForRateLimit();
        return await operation();
      } catch (error: unknown) {
        const axiosError = error as {
          response?: { status?: number };
          code?: string;
          message?: string;
        };
        const isRateLimit =
          axiosError?.response?.status === 429 ||
          axiosError?.code === 'ECONNRESET' ||
          axiosError?.message?.includes('timeout');

        if (isRateLimit && attempt < this.RETRY_DELAYS.length - 1) {
          const delay = this.RETRY_DELAYS[attempt];
          console.log(
            `⚠️ ${context} - Rate limited, retrying in ${delay}ms (attempt ${attempt + 1})`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw error;
      }
    }
    throw new Error(`Failed after ${this.RETRY_DELAYS.length} attempts`);
  }
}

// Circuit breaker for API failures
class CircuitBreaker {
  private static readonly failures = new Map<string, number>();
  private static readonly lastFailure = new Map<string, number>();
  private static readonly FAILURE_THRESHOLD = 3;
  private static readonly RESET_TIMEOUT = 300000; // 5 minutes

  static shouldAllowRequest(endpoint: string): boolean {
    const failures = this.failures.get(endpoint) ?? 0;
    const lastFailure = this.lastFailure.get(endpoint) ?? 0;
    const now = Date.now();

    // Reset if enough time has passed
    if (now - lastFailure > this.RESET_TIMEOUT) {
      this.failures.set(endpoint, 0);
      return true;
    }

    // Block if too many failures
    return failures < this.FAILURE_THRESHOLD;
  }

  static recordFailure(endpoint: string): void {
    const failures = (this.failures.get(endpoint) ?? 0) + 1;
    this.failures.set(endpoint, failures);
    this.lastFailure.set(endpoint, Date.now());

    if (failures >= this.FAILURE_THRESHOLD) {
      console.warn(`🚨 Circuit breaker OPEN for ${endpoint} (${failures} failures)`);
    }
  }

  static recordSuccess(endpoint: string): void {
    this.failures.set(endpoint, 0);
  }
}

// Multi-chain token balances
export const getTokenBalances = async (
  address: string,
  chainId: number = 1,
): Promise<TokenBalance[]> => {
  try {
    // Check if API key is available
    if (!COVALENT_API_KEY) {
      throw new Error('COVALENT_API_KEY is not configured');
    }

    const supportedChains = await getSupportedChains();
    const chainConfig = supportedChains[chainId];
    if (!chainConfig?.covalentSupported) {
      throw new Error(`Chain ${chainId} not supported or not available via Covalent`);
    }

    const url = `${BASE_URL}/${chainConfig.name}/address/${address}/balances_v2/`;

    // Circuit breaker check
    if (!CircuitBreaker.shouldAllowRequest(url)) {
      console.warn(`⛔ Circuit breaker active, skipping request to ${url}`);
      return [];
    }

    const response = await RateLimiter.withRetry(
      () =>
        axios.get(url, {
          headers: {
            Authorization: `Bearer ${COVALENT_API_KEY}`,
          },
        }),
      'Fetching token balances',
    );

    // Record successful request
    CircuitBreaker.recordSuccess(url);

    return response.data.data.items.map((item: CovalentTokenItem) => ({
      symbol: item.contract_ticker_symbol ?? 'UNKNOWN',
      name: item.contract_name ?? 'Unknown Token',
      balance: parseFloat(item.balance) / Math.pow(10, item.contract_decimals),
      value: item.quote ?? 0,
      price: item.quote_rate ?? 0,
      logo: item.logo_url,
      contractAddress: item.contract_address,
      chainId,
    }));
  } catch (error) {
    console.error(`Error fetching token balances for ${address} on chain ${chainId}:`, error);
    return [];
  }
};

// Multi-chain transaction history
export const getTransactionHistory = async (
  address: string,
  chainId: number = 1,
  pageSize: number = 100,
): Promise<Transaction[]> => {
  try {
    // Check if API key is available
    if (!COVALENT_API_KEY) {
      throw new Error('COVALENT_API_KEY is not configured');
    }

    const supportedChains = await getSupportedChains();
    const chainConfig = supportedChains[chainId];
    if (!chainConfig?.covalentSupported) {
      throw new Error(`Chain ${chainId} not supported or not available via Covalent`);
    }

    const url = `${BASE_URL}/${chainConfig.name}/address/${address}/transactions_v2/?page-size=${pageSize}`;

    // Circuit breaker check
    if (!CircuitBreaker.shouldAllowRequest(url)) {
      console.warn(`⛔ Circuit breaker active, skipping request to ${url}`);
      return [];
    }

    const response = await RateLimiter.withRetry(
      () =>
        axios.get(url, {
          headers: {
            Authorization: `Bearer ${COVALENT_API_KEY}`,
          },
        }),
      'Fetching transaction history',
    );

    // Record successful request
    CircuitBreaker.recordSuccess(url);

    return response.data.data.items.map((tx: CovalentTransaction) => ({
      hash: tx.tx_hash,
      from: tx.from_address,
      to: tx.to_address,
      value: parseFloat(tx.value),
      timestamp: tx.block_signed_at,
      type: 'transfer' as const,
      gasUsed: tx.gas_spent,
      chainId,
      chainName: chainConfig.displayName,
    }));
  } catch (error) {
    console.error(`Error fetching transaction history for ${address} on chain ${chainId}:`, error);
    return [];
  }
};

// Multi-chain portfolio value
export const getPortfolioValue = async (address: string, chainId: number = 1): Promise<number> => {
  try {
    // Check if API key is available
    if (!COVALENT_API_KEY) {
      console.warn('COVALENT_API_KEY is not configured, returning portfolio value 0');
      return 0;
    }

    const supportedChains = await getSupportedChains();
    const chainConfig = supportedChains[chainId];
    if (!chainConfig?.covalentSupported) {
      console.warn(`Chain ${chainId} not supported via Covalent, returning 0`);
      return 0;
    }

    const url = `${BASE_URL}/${chainConfig.name}/address/${address}/portfolio_v2/`;

    // Circuit breaker check
    if (!CircuitBreaker.shouldAllowRequest(url)) {
      console.warn(`⛔ Circuit breaker active, skipping request to ${url}`);
      return 0;
    }

    const response = await RateLimiter.withRetry(
      () =>
        axios.get(url, {
          headers: {
            Authorization: `Bearer ${COVALENT_API_KEY}`,
          },
        }),
      'Fetching portfolio value',
    );

    // Record successful request
    CircuitBreaker.recordSuccess(url);

    return response.data.data.total_quote ?? 0;
  } catch (error) {
    console.error(`Error fetching portfolio value for ${address} on chain ${chainId}:`, error);
    return 0;
  }
};

// Multi-chain aggregated token balances - Sequential processing to avoid rate limits
export const getMultiChainTokenBalances = async (address: string): Promise<TokenBalance[]> => {
  // Use only the most stable chains to minimize API calls and avoid rate limits
  const PRIORITY_CHAINS = [1, 137, 56]; // ETH, Polygon, BSC - most stable and well-supported

  const supportedChains = await getSupportedChains();
  const validChains = PRIORITY_CHAINS.filter(
    (chainId) => supportedChains[chainId]?.covalentSupported,
  );

  const allBalances: TokenBalance[] = [];

  // Process chains sequentially to avoid overwhelming the API
  for (const chainId of validChains) {
    try {
      console.log(`🔍 Fetching balances for chain ${chainId}...`);
      const balances = await getTokenBalances(address, chainId);
      allBalances.push(...balances);

      // Add a small delay between requests to be extra careful with rate limits
      if (chainId !== validChains[validChains.length - 1]) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.warn(`⚠️ Failed to fetch token balances for chain ${chainId}:`, error);
      // Continue with other chains even if one fails
    }
  }

  // Aggregate balances by token symbol across chains
  const aggregatedBalances = new Map<string, TokenBalance>();
  allBalances.forEach((balance) => {
    const key = `${balance.symbol}-${balance.contractAddress}`;
    if (aggregatedBalances.has(key)) {
      const existing = aggregatedBalances.get(key)!;
      existing.balance += balance.balance;
      existing.value += balance.value;
    } else {
      aggregatedBalances.set(key, { ...balance });
    }
  });

  return Array.from(aggregatedBalances.values()).sort((a, b) => b.value - a.value);
};

// Multi-chain aggregated transaction history - Sequential processing to avoid rate limits
export const getMultiChainTransactionHistory = async (
  address: string,
  limit: number = 50,
): Promise<Transaction[]> => {
  // Use the same priority chains for consistency
  const PRIORITY_CHAINS = [1, 137, 56]; // ETH, Polygon, BSC

  const supportedChains = await getSupportedChains();
  const validChains = PRIORITY_CHAINS.filter(
    (chainId) => supportedChains[chainId]?.covalentSupported,
  );

  const allTransactions: Transaction[] = [];
  const txPerChain = Math.ceil(limit / validChains.length);

  // Process chains sequentially to avoid rate limits
  for (const chainId of validChains) {
    try {
      console.log(`🔍 Fetching transactions for chain ${chainId}...`);
      const transactions = await getTransactionHistory(address, chainId, txPerChain);
      allTransactions.push(...transactions);

      // Add delay between requests
      if (chainId !== validChains[validChains.length - 1]) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.warn(`⚠️ Failed to fetch transactions for chain ${chainId}:`, error);
      // Continue with other chains
    }
  }

  // Sort transactions by timestamp (descending) - converting string timestamp to number for comparison
  const sortedTransactions = allTransactions.toSorted((a, b) => {
    const timestampA = new Date(a.timestamp).getTime();
    const timestampB = new Date(b.timestamp).getTime();
    return timestampB - timestampA;
  });
  return sortedTransactions.slice(0, limit);
};

// Multi-chain aggregated portfolio value - Sequential processing to avoid rate limits
export const getMultiChainPortfolioValue = async (address: string): Promise<number> => {
  // Use the same priority chains for consistency
  const PRIORITY_CHAINS = [1, 137, 56]; // ETH, Polygon, BSC

  const supportedChains = await getSupportedChains();
  const validChains = PRIORITY_CHAINS.filter(
    (chainId) => supportedChains[chainId]?.covalentSupported,
  );

  let totalValue = 0;

  // Process chains sequentially to avoid rate limits
  for (const chainId of validChains) {
    try {
      console.log(`🔍 Fetching portfolio value for chain ${chainId}...`);
      const value = await getPortfolioValue(address, chainId);
      totalValue += value;

      // Add delay between requests
      if (chainId !== validChains[validChains.length - 1]) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.warn(`⚠️ Failed to fetch portfolio value for chain ${chainId}:`, error);
      // Continue with other chains
    }
  }

  return totalValue;
};
