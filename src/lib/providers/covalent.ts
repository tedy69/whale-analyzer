import axios from 'axios';
import { TokenBalance, Transaction } from '@/types';

const COVALENT_API_KEY = process.env.COVALENT_API_KEY;
const BASE_URL = 'https://api.covalenthq.com/v1';

// Covalent chain configurations
const COVALENT_CHAINS = {
  1: 'eth-mainnet',
  137: 'matic-mainnet',
  56: 'bsc-mainnet',
  43114: 'avalanche-mainnet',
  42161: 'arbitrum-mainnet',
  10: 'optimism-mainnet',
  8453: 'base-mainnet',
  250: 'fantom-mainnet',
  25: 'cronos-mainnet',
  100: 'gnosis-mainnet',
} as const;

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

// Rate limiting for Covalent API
class CovalentRateLimiter {
  private static requests: number[] = [];
  private static readonly MAX_REQUESTS_PER_MINUTE = 100;
  private static readonly RETRY_DELAYS = [2000, 4000, 8000, 16000];

  static async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    this.requests = this.requests.filter((time) => time > oneMinuteAgo);

    if (this.requests.length >= this.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = 60000 - (now - oldestRequest) + 100;
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    this.requests.push(now);
  }

  static async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    for (let attempt = 0; attempt < this.RETRY_DELAYS.length; attempt++) {
      try {
        await this.waitForRateLimit();
        return await operation();
      } catch (error: unknown) {
        const errorObj = error as Error & { response?: { status: number }; code?: string };
        const isLastAttempt = attempt === this.RETRY_DELAYS.length - 1;
        const isRateLimit =
          errorObj.response?.status === 429 ||
          errorObj.response?.status === 500 ||
          errorObj.code === 'RATE_LIMITED';

        if (isLastAttempt || !isRateLimit) {
          throw error;
        }

        const delay = this.RETRY_DELAYS[attempt];
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error(`Failed after ${this.RETRY_DELAYS.length} attempts`);
  }
}

export class CovalentProvider {
  private static getChainName(chainId: number): string {
    const chainName = COVALENT_CHAINS[chainId as keyof typeof COVALENT_CHAINS];
    if (!chainName) {
      throw new Error(`Unsupported chain ID for Covalent: ${chainId}`);
    }
    return chainName;
  }

  static isAvailable(): boolean {
    if (!COVALENT_API_KEY) {
      return false;
    }
    return true;
  }

  static isChainSupported(chainId: number): boolean {
    return chainId in COVALENT_CHAINS;
  }

  static async getTokenBalances(address: string, chainId: number): Promise<TokenBalance[]> {
    if (!this.isAvailable()) {
      throw new Error('Covalent API key not configured');
    }

    if (!this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} not supported by Covalent`);
    }

    return CovalentRateLimiter.withRetry(async () => {
      const chainName = this.getChainName(chainId);
      const url = `${BASE_URL}/${chainName}/address/${address}/balances_v2/`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${COVALENT_API_KEY}`,
        },
      });

      const items = response.data.data?.items ?? [];
      return items.map((item: CovalentTokenItem) => ({
        symbol: item.contract_ticker_symbol ?? 'UNKNOWN',
        name: item.contract_name ?? 'Unknown Token',
        balance: parseFloat(item.balance) / Math.pow(10, item.contract_decimals),
        value: item.quote ?? 0,
        price: item.quote_rate ?? 0,
        logo: item.logo_url,
        contractAddress: item.contract_address,
        chainId,
      }));
    });
  }

  static async getTransactionHistory(
    address: string,
    chainId: number,
    pageSize: number = 100,
  ): Promise<Transaction[]> {
    if (!this.isAvailable()) {
      throw new Error('Covalent API key not configured');
    }

    if (!this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} not supported by Covalent`);
    }

    return CovalentRateLimiter.withRetry(async () => {
      const chainName = this.getChainName(chainId);
      const url = `${BASE_URL}/${chainName}/address/${address}/transactions_v2/?page-size=${pageSize}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${COVALENT_API_KEY}`,
        },
      });

      const items = response.data.data?.items ?? [];
      return items.map((tx: CovalentTransaction) => ({
        hash: tx.tx_hash,
        from: tx.from_address,
        to: tx.to_address,
        value: parseFloat(tx.value),
        timestamp: tx.block_signed_at,
        type: 'transfer' as const,
        gasUsed: tx.gas_spent,
        chainId,
        chainName: this.getChainName(chainId),
      }));
    });
  }

  static async getPortfolioValue(address: string, chainId: number): Promise<number> {
    if (!this.isAvailable()) {
      return 0;
    }

    if (!this.isChainSupported(chainId)) {
      return 0;
    }

    return CovalentRateLimiter.withRetry(async () => {
      const chainName = this.getChainName(chainId);
      const url = `${BASE_URL}/${chainName}/address/${address}/portfolio_v2/`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${COVALENT_API_KEY}`,
        },
      });

      return response.data.data?.total_quote ?? 0;
    });
  }

  // Multi-chain aggregated token balances
  static async getMultiChainTokenBalances(address: string): Promise<TokenBalance[]> {
    const supportedChainIds = Object.keys(COVALENT_CHAINS).map(Number);
    const balancePromises = supportedChainIds.map((chainId) =>
      this.getTokenBalances(address, chainId).catch(() => {
        return [];
      }),
    );

    const results = await Promise.allSettled(balancePromises);
    const allBalances: TokenBalance[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allBalances.push(...result.value);
      }
    });

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
  }

  // Multi-chain aggregated transaction history
  static async getMultiChainTransactionHistory(
    address: string,
    limit: number = 50,
  ): Promise<Transaction[]> {
    const supportedChainIds = Object.keys(COVALENT_CHAINS).map(Number);
    const transactionPromises = supportedChainIds.map((chainId) =>
      this.getTransactionHistory(
        address,
        chainId,
        Math.ceil(limit / supportedChainIds.length),
      ).catch(() => {
        return [];
      }),
    );

    const results = await Promise.allSettled(transactionPromises);
    const allTransactions: Transaction[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allTransactions.push(...result.value);
      }
    });

    // Sort transactions by timestamp (descending)
    const sortedTransactions = allTransactions.toSorted((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return timestampB - timestampA;
    });

    return sortedTransactions.slice(0, limit);
  }

  // Multi-chain aggregated portfolio value
  static async getMultiChainPortfolioValue(address: string): Promise<number> {
    const supportedChainIds = Object.keys(COVALENT_CHAINS).map(Number);
    const portfolioPromises = supportedChainIds.map((chainId) =>
      this.getPortfolioValue(address, chainId).catch(() => {
        return 0;
      }),
    );

    const results = await Promise.allSettled(portfolioPromises);
    let totalValue = 0;

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        totalValue += result.value;
      }
    });

    return totalValue;
  }
}
