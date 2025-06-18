import axios from 'axios';
import { TokenBalance, Transaction } from '@/types';

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
const BASE_URL = 'https://deep-index.moralis.io/api/v2.2';

// Moralis chain configurations
const MORALIS_CHAIN_IDS = {
  1: 'eth',
  137: 'polygon',
  56: 'bsc',
  43114: 'avalanche',
  42161: 'arbitrum',
  10: 'optimism',
  8453: 'base',
  250: 'fantom',
  25: 'cronos',
} as const;

interface MoralisTokenBalance {
  token_address: string;
  symbol: string;
  name: string;
  logo?: string;
  thumbnail?: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_contract: boolean;
  usd_price?: number;
  usd_value?: number;
}

interface MoralisTransaction {
  hash: string;
  nonce: string;
  transaction_index: string;
  from_address: string;
  to_address: string;
  value: string;
  gas: string;
  gas_price: string;
  gas_used: string;
  cumulative_gas_used: string;
  input: string;
  receipt_cumulative_gas_used: string;
  receipt_gas_used: string;
  receipt_contract_address?: string;
  receipt_root?: string;
  receipt_status: string;
  block_timestamp: string;
  block_number: string;
  block_hash: string;
  logs: unknown[];
}

// Rate limiting for Moralis API
class MoralisRateLimiter {
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
        console.log(`⏳ Moralis rate limit reached, waiting ${waitTime}ms`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    this.requests.push(now);
  }

  static async withRetry<T>(operation: () => Promise<T>, context = 'operation'): Promise<T> {
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

        console.warn(`🔄 Moralis ${context} attempt ${attempt + 1} failed:`, errorObj.message);

        if (isLastAttempt || !isRateLimit) {
          throw error;
        }

        const delay = this.RETRY_DELAYS[attempt];
        console.log(`⏳ Retrying Moralis ${context} in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error(`Failed after ${this.RETRY_DELAYS.length} attempts`);
  }
}

export class MoralisProvider {
  static isAvailable(): boolean {
    return !!MORALIS_API_KEY;
  }

  static isChainSupported(chainId: number): boolean {
    return chainId in MORALIS_CHAIN_IDS;
  }

  private static getChainIdentifier(chainId: number): string {
    const identifier = MORALIS_CHAIN_IDS[chainId as keyof typeof MORALIS_CHAIN_IDS];
    if (!identifier) {
      throw new Error(`Unsupported chain ID for Moralis: ${chainId}`);
    }
    return identifier;
  }

  static async getTokenBalances(address: string, chainId: number): Promise<TokenBalance[]> {
    if (!this.isAvailable()) {
      throw new Error('Moralis API key not configured');
    }

    if (!this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} not supported by Moralis`);
    }

    return MoralisRateLimiter.withRetry(async () => {
      const chain = this.getChainIdentifier(chainId);

      const response = await axios.get(`${BASE_URL}/${address}/erc20`, {
        params: {
          chain,
          exclude_spam: true,
          exclude_unverified_contracts: false,
        },
        headers: {
          'X-API-Key': MORALIS_API_KEY,
          accept: 'application/json',
        },
        timeout: 30000,
      });

      const tokens: MoralisTokenBalance[] = response.data;

      if (!Array.isArray(tokens)) {
        console.warn(`Invalid response format from Moralis for ${address} on chain ${chainId}`);
        return [];
      }

      return tokens
        .filter((token) => !token.possible_spam && parseFloat(token.balance) > 0)
        .map((token): TokenBalance => {
          const balance = parseFloat(token.balance) / Math.pow(10, token.decimals);
          return {
            contractAddress: token.token_address,
            symbol: token.symbol,
            name: token.name,
            decimals: token.decimals,
            balance,
            value: token.usd_value ?? 0,
            price: token.usd_price ?? 0,
            logo: token.logo ?? token.thumbnail ?? '',
            chainId,
            chainName: chain,
          };
        });
    }, `token balances for ${address} on chain ${chainId}`);
  }

  static async getTransactionHistory(address: string, chainId: number): Promise<Transaction[]> {
    if (!this.isAvailable()) {
      throw new Error('Moralis API key not configured');
    }

    if (!this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} not supported by Moralis`);
    }

    return MoralisRateLimiter.withRetry(async () => {
      const chain = this.getChainIdentifier(chainId);

      const response = await axios.get(`${BASE_URL}/${address}`, {
        params: {
          chain,
          limit: 100,
          order: 'DESC',
        },
        headers: {
          'X-API-Key': MORALIS_API_KEY,
          accept: 'application/json',
        },
        timeout: 30000,
      });

      const transactions: MoralisTransaction[] = response.data.result ?? [];

      if (!Array.isArray(transactions)) {
        console.warn(`Invalid response format from Moralis for ${address} on chain ${chainId}`);
        return [];
      }

      return transactions.map(
        (tx): Transaction => ({
          hash: tx.hash,
          from: tx.from_address,
          to: tx.to_address,
          value: parseFloat(tx.value) / Math.pow(10, 18),
          timestamp: tx.block_timestamp,
          type: 'transfer',
          gasUsed: parseInt(tx.gas_used) || 0,
          gasPrice: parseFloat(tx.gas_price) / Math.pow(10, 9),
          chainId,
          chainName: `Chain ${chainId}`,
        }),
      );
    }, `transaction history for ${address} on chain ${chainId}`);
  }

  static async getNativeBalance(address: string, chainId: number): Promise<number> {
    if (!this.isAvailable()) {
      throw new Error('Moralis API key not configured');
    }

    if (!this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} not supported by Moralis`);
    }

    return MoralisRateLimiter.withRetry(async () => {
      const chain = this.getChainIdentifier(chainId);

      const response = await axios.get(`${BASE_URL}/${address}/balance`, {
        params: { chain },
        headers: {
          'X-API-Key': MORALIS_API_KEY,
          accept: 'application/json',
        },
        timeout: 15000,
      });

      const balance = response.data.balance;
      return parseFloat(balance) / Math.pow(10, 18);
    }, `native balance for ${address} on chain ${chainId}`);
  }

  static async getWalletPortfolio(
    address: string,
    chainId: number,
  ): Promise<{ totalValue: number; tokens: TokenBalance[] }> {
    if (!this.isAvailable()) {
      throw new Error('Moralis API key not configured');
    }

    if (!this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} not supported by Moralis`);
    }

    return MoralisRateLimiter.withRetry(async () => {
      const tokens = await this.getTokenBalances(address, chainId);
      const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);

      return {
        totalValue,
        tokens,
      };
    }, `portfolio for ${address} on chain ${chainId}`);
  }
}
