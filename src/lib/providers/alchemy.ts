import axios from 'axios';
import { TokenBalance, Transaction } from '@/types';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Alchemy network configurations
const ALCHEMY_NETWORKS = {
  1: 'eth-mainnet',
  137: 'polygon-mainnet',
  56: 'bnb-mainnet',
  42161: 'arb-mainnet',
  10: 'opt-mainnet',
  8453: 'base-mainnet',
} as const;

interface AlchemyTokenBalance {
  contractAddress: string;
  tokenBalance: string;
  metadata?: {
    name?: string;
    symbol?: string;
    decimals?: number;
    logo?: string;
  };
}

interface AlchemyTokenBalanceResponse {
  address: string;
  tokenBalances: AlchemyTokenBalance[];
}

// Rate limiting for Alchemy API
class AlchemyRateLimiter {
  private static requests: number[] = [];
  private static readonly MAX_REQUESTS_PER_SECOND = 5;
  private static readonly RETRY_DELAYS = [1000, 2000, 4000, 8000];

  static async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const oneSecondAgo = now - 1000;

    this.requests = this.requests.filter((time) => time > oneSecondAgo);

    if (this.requests.length >= this.MAX_REQUESTS_PER_SECOND) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = 1000 - (now - oldestRequest) + 50;
      if (waitTime > 0) {
        console.log(`⏳ Alchemy rate limit reached, waiting ${waitTime}ms`);
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
        const isRateLimit = errorObj.response?.status === 429 || errorObj.code === 'RATE_LIMITED';

        console.warn(`🔄 Alchemy ${context} attempt ${attempt + 1} failed:`, errorObj.message);

        if (isLastAttempt || !isRateLimit) {
          throw error;
        }

        const delay = this.RETRY_DELAYS[attempt];
        console.log(`⏳ Retrying Alchemy ${context} in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error(`Failed after ${this.RETRY_DELAYS.length} attempts`);
  }
}

export class AlchemyProvider {
  private static getBaseUrl(chainId: number): string {
    const network = ALCHEMY_NETWORKS[chainId as keyof typeof ALCHEMY_NETWORKS];
    if (!network) {
      throw new Error(`Unsupported chain ID for Alchemy: ${chainId}`);
    }
    return `https://${network}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
  }

  static isAvailable(): boolean {
    return !!ALCHEMY_API_KEY;
  }

  static isChainSupported(chainId: number): boolean {
    return chainId in ALCHEMY_NETWORKS;
  }

  static async getTokenBalances(address: string, chainId: number): Promise<TokenBalance[]> {
    if (!this.isAvailable()) {
      throw new Error('Alchemy API key not configured');
    }

    if (!this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} not supported by Alchemy`);
    }

    return AlchemyRateLimiter.withRetry(async () => {
      const baseUrl = this.getBaseUrl(chainId);

      const response = await axios.post(
        baseUrl,
        {
          id: 1,
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: [address, 'erc20'],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      const result: AlchemyTokenBalanceResponse = response.data.result;

      if (!result?.tokenBalances) {
        console.warn(`No token balances returned from Alchemy for ${address} on chain ${chainId}`);
        return [];
      }

      const tokensWithBalances = result.tokenBalances.filter(
        (token) => token.tokenBalance && token.tokenBalance !== '0x0',
      );

      const tokenBalances: TokenBalance[] = [];

      for (const token of tokensWithBalances) {
        try {
          const metadataResponse = await axios.post(
            baseUrl,
            {
              id: 1,
              jsonrpc: '2.0',
              method: 'alchemy_getTokenMetadata',
              params: [token.contractAddress],
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 15000,
            },
          );

          const metadata = metadataResponse.data.result;
          const decimals = metadata?.decimals ?? 18;
          const balance = parseInt(token.tokenBalance, 16);
          const formattedBalance = balance / Math.pow(10, decimals);

          if (formattedBalance > 0) {
            tokenBalances.push({
              contractAddress: token.contractAddress,
              symbol: metadata?.symbol ?? 'UNKNOWN',
              name: metadata?.name ?? 'Unknown Token',
              decimals,
              balance: formattedBalance,
              value: 0, // Would need price data
              price: 0,
              logo: metadata?.logo ?? '',
              chainId,
              chainName: ALCHEMY_NETWORKS[chainId as keyof typeof ALCHEMY_NETWORKS],
            });
          }
        } catch (error) {
          console.warn(`Failed to get metadata for token ${token.contractAddress}:`, error);
        }
      }

      return tokenBalances;
    }, `token balances for ${address} on chain ${chainId}`);
  }

  static async getTransactionHistory(address: string, chainId: number): Promise<Transaction[]> {
    if (!this.isAvailable()) {
      throw new Error('Alchemy API key not configured');
    }

    if (!this.isChainSupported(chainId)) {
      throw new Error(`Chain ${chainId} not supported by Alchemy`);
    }

    return AlchemyRateLimiter.withRetry(async () => {
      const baseUrl = this.getBaseUrl(chainId);

      const response = await axios.post(
        baseUrl,
        {
          id: 1,
          jsonrpc: '2.0',
          method: 'alchemy_getAssetTransfers',
          params: [
            {
              fromAddress: address,
              category: ['external', 'erc20', 'erc721', 'erc1155'],
              withMetadata: true,
              excludeZeroValue: true,
              maxCount: 100,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      const result = response.data.result;

      if (!result?.transfers) {
        console.warn(`No transactions returned from Alchemy for ${address} on chain ${chainId}`);
        return [];
      }

      return result.transfers.map(
        (transfer: {
          hash: string;
          from: string;
          to?: string;
          value?: string;
          metadata?: { blockTimestamp?: string };
        }): Transaction => ({
          hash: transfer.hash,
          from: transfer.from,
          to: transfer.to ?? '',
          value: parseFloat(transfer.value ?? '0'),
          timestamp: transfer.metadata?.blockTimestamp ?? new Date().toISOString(),
          type: 'transfer',
          gasUsed: 0,
          gasPrice: 0,
          chainId,
          chainName:
            ALCHEMY_NETWORKS[chainId as keyof typeof ALCHEMY_NETWORKS] || `Chain ${chainId}`,
        }),
      );
    }, `transaction history for ${address} on chain ${chainId}`);
  }
}
