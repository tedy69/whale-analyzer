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
    console.log(
      `🔍 Requested chainId: ${chainId}, Available chains:`,
      Object.keys(supportedChains),
    );

    let targetChainId = chainId;
    let chainConfig = supportedChains[chainId];

    // If the requested chain is not supported, fall back to Ethereum
    if (!chainConfig?.covalentSupported) {
      console.warn(`Chain ${chainId} not supported, falling back to Ethereum (1)`);
      targetChainId = 1;
      chainConfig = supportedChains[1];
    }

    // Final check - if even Ethereum isn't available, throw error
    if (!chainConfig?.covalentSupported) {
      throw new Error(`No supported chains available via Covalent`);
    }

    const url = `${BASE_URL}/${chainConfig.name}/address/${address}/balances_v2/`;
    console.log(`🌐 Fetching from: ${url}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${COVALENT_API_KEY}`,
      },
    });

    return response.data.data.items.map((item: CovalentTokenItem) => ({
      symbol: item.contract_ticker_symbol ?? 'UNKNOWN',
      name: item.contract_name ?? 'Unknown Token',
      balance: parseFloat(item.balance) / Math.pow(10, item.contract_decimals),
      value: item.quote ?? 0,
      price: item.quote_rate ?? 0,
      logo: item.logo_url,
      contractAddress: item.contract_address,
      chainId: targetChainId, // Return the actual chain used
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
    console.log(`🔍 Requested chainId: ${chainId} for transactions`);

    let targetChainId = chainId;
    let chainConfig = supportedChains[chainId];

    // If the requested chain is not supported, fall back to Ethereum
    if (!chainConfig?.covalentSupported) {
      console.warn(`Chain ${chainId} not supported for transactions, falling back to Ethereum (1)`);
      targetChainId = 1;
      chainConfig = supportedChains[1];
    }

    // Final check - if even Ethereum isn't available, throw error
    if (!chainConfig?.covalentSupported) {
      throw new Error(`No supported chains available via Covalent for transactions`);
    }

    const url = `${BASE_URL}/${chainConfig.name}/address/${address}/transactions_v2/?page-size=${pageSize}`;
    console.log(`🌐 Fetching transactions from: ${url}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${COVALENT_API_KEY}`,
      },
    });

    return response.data.data.items.map((tx: CovalentTransaction) => ({
      hash: tx.tx_hash,
      from: tx.from_address,
      to: tx.to_address,
      value: parseFloat(tx.value),
      timestamp: tx.block_signed_at,
      type: 'transfer' as const,
      gasUsed: tx.gas_spent,
      chainId: targetChainId, // Return the actual chain used
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
    console.log(`🔍 Requested chainId: ${chainId} for portfolio value`);

    let chainConfig = supportedChains[chainId];

    // If the requested chain is not supported, fall back to Ethereum
    if (!chainConfig?.covalentSupported) {
      console.warn(`Chain ${chainId} not supported for portfolio, falling back to Ethereum (1)`);
      chainConfig = supportedChains[1];
    }

    // Final check - if even Ethereum isn't available, return 0
    if (!chainConfig?.covalentSupported) {
      console.warn(`No supported chains available via Covalent for portfolio, returning 0`);
      return 0;
    }

    const url = `${BASE_URL}/${chainConfig.name}/address/${address}/portfolio_v2/`;
    console.log(`🌐 Fetching portfolio from: ${url}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${COVALENT_API_KEY}`,
      },
    });

    return response.data.data.total_quote ?? 0;
  } catch (error) {
    console.error(`Error fetching portfolio value for ${address} on chain ${chainId}:`, error);
    return 0;
  }
};

// Multi-chain aggregated token balances
export const getMultiChainTokenBalances = async (address: string): Promise<TokenBalance[]> => {
  const supportedChains = await getSupportedChains();
  const chainPromises = Object.values(supportedChains)
    .filter((chain) => chain.covalentSupported)
    .map((chain) => getTokenBalances(address, chain.chainId));

  const results = await Promise.allSettled(chainPromises);
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
};

// Multi-chain aggregated transaction history
export const getMultiChainTransactionHistory = async (
  address: string,
  limit: number = 50,
): Promise<Transaction[]> => {
  const supportedChains = await getSupportedChains();
  const chainPromises = Object.values(supportedChains)
    .filter((chain) => chain.covalentSupported)
    .map((chain) => getTransactionHistory(address, chain.chainId, Math.ceil(limit / 3)));

  const results = await Promise.allSettled(chainPromises);
  const allTransactions: Transaction[] = [];

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allTransactions.push(...result.value);
    }
  });

  // Sort transactions by timestamp (descending) - converting string timestamp to number for comparison
  const sortedTransactions = allTransactions.toSorted((a, b) => {
    const timestampA = new Date(a.timestamp).getTime();
    const timestampB = new Date(b.timestamp).getTime();
    return timestampB - timestampA;
  });
  return sortedTransactions.slice(0, limit);
};

// Multi-chain aggregated portfolio value
export const getMultiChainPortfolioValue = async (address: string): Promise<number> => {
  const supportedChains = await getSupportedChains();
  const chainPromises = Object.values(supportedChains)
    .filter((chain) => chain.covalentSupported)
    .map((chain) => getPortfolioValue(address, chain.chainId));

  const results = await Promise.allSettled(chainPromises);
  let totalValue = 0;

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      totalValue += result.value;
    }
  });

  return totalValue;
};
