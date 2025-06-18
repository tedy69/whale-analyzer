import { TokenBalance, Transaction } from '@/types';
import { AlchemyProvider } from './alchemy';
import { MoralisProvider } from './moralis';
import { CovalentProvider } from './covalent';

export type DataProvider = 'covalent' | 'alchemy' | 'moralis';

interface ProviderConfig {
  name: DataProvider;
  isAvailable: () => boolean;
  isChainSupported: (chainId: number) => boolean;
  priority: number; // Lower number = higher priority
}

// Provider configurations with fallback priorities
const PROVIDERS: ProviderConfig[] = [
  {
    name: 'covalent',
    isAvailable: () => CovalentProvider.isAvailable(),
    isChainSupported: () => true, // Covalent supports most chains
    priority: 1,
  },
  {
    name: 'moralis',
    isAvailable: () => MoralisProvider.isAvailable(),
    isChainSupported: (chainId: number) => MoralisProvider.isChainSupported(chainId),
    priority: 2,
  },
  {
    name: 'alchemy',
    isAvailable: () => AlchemyProvider.isAvailable(),
    isChainSupported: (chainId: number) => AlchemyProvider.isChainSupported(chainId),
    priority: 3,
  },
];

export class MultiProviderManager {
  /**
   * Get available providers for a specific chain, sorted by priority
   */
  private static getAvailableProviders(chainId: number): DataProvider[] {
    return PROVIDERS.filter(
      (provider) => provider.isAvailable() && provider.isChainSupported(chainId),
    )
      .sort((a, b) => a.priority - b.priority)
      .map((provider) => provider.name);
  }

  /**
   * Get the best available provider for a chain
   */
  static getBestProvider(chainId: number): DataProvider | null {
    const providers = this.getAvailableProviders(chainId);
    return providers.length > 0 ? providers[0] : null;
  }

  /**
   * Get provider status summary
   */
  static getProviderStatus(): Record<
    DataProvider,
    { available: boolean; supportedChains: number[] }
  > {
    const commonChainIds = [1, 137, 56, 43114, 42161, 10, 8453, 250, 25];

    return {
      covalent: {
        available: CovalentProvider.isAvailable(),
        supportedChains: commonChainIds, // Covalent supports most chains
      },
      moralis: {
        available: MoralisProvider.isAvailable(),
        supportedChains: commonChainIds.filter((id) => MoralisProvider.isChainSupported(id)),
      },
      alchemy: {
        available: AlchemyProvider.isAvailable(),
        supportedChains: commonChainIds.filter((id) => AlchemyProvider.isChainSupported(id)),
      },
    };
  }

  /**
   * Get token balances with automatic provider fallback
   */
  static async getTokenBalances(
    address: string,
    chainId: number,
  ): Promise<{
    data: TokenBalance[];
    provider: DataProvider;
    errors: Record<DataProvider, string>;
  }> {
    const providers = this.getAvailableProviders(chainId);
    const errors: Record<DataProvider, string> = {} as Record<DataProvider, string>;

    for (const providerName of providers) {
      try {
        let data: TokenBalance[];

        switch (providerName) {
          case 'covalent':
            data = await CovalentProvider.getTokenBalances(address, chainId);
            break;
          case 'moralis':
            data = await MoralisProvider.getTokenBalances(address, chainId);
            break;
          case 'alchemy':
            data = await AlchemyProvider.getTokenBalances(address, chainId);
            break;
          default:
            throw new Error(`Unknown provider: ${providerName}`);
        }

        return { data, provider: providerName, errors };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors[providerName] = errorMessage;

        continue;
      }
    }

    // If all providers failed, throw error with details
    const errorSummary = Object.entries(errors)
      .map(([provider, error]) => `${provider}: ${error}`)
      .join('; ');

    throw new Error(
      `All providers failed for token balances on chain ${chainId}. Errors: ${errorSummary}`,
    );
  }

  /**
   * Get transaction history with automatic provider fallback
   */
  static async getTransactionHistory(
    address: string,
    chainId: number,
  ): Promise<{
    data: Transaction[];
    provider: DataProvider;
    errors: Record<DataProvider, string>;
  }> {
    const providers = this.getAvailableProviders(chainId);
    const errors: Record<DataProvider, string> = {} as Record<DataProvider, string>;

    for (const providerName of providers) {
      try {
        let data: Transaction[];

        switch (providerName) {
          case 'covalent':
            data = await CovalentProvider.getTransactionHistory(address, chainId);
            break;
          case 'moralis':
            data = await MoralisProvider.getTransactionHistory(address, chainId);
            break;
          case 'alchemy':
            data = await AlchemyProvider.getTransactionHistory(address, chainId);
            break;
          default:
            throw new Error(`Unknown provider: ${providerName}`);
        }

        return { data, provider: providerName, errors };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors[providerName] = errorMessage;

        // Continue to next provider
        continue;
      }
    }

    // If all providers failed, throw error with details
    const errorSummary = Object.entries(errors)
      .map(([provider, error]) => `${provider}: ${error}`)
      .join('; ');

    throw new Error(
      `All providers failed for transaction history on chain ${chainId}. Errors: ${errorSummary}`,
    );
  }

  /**
   * Get portfolio value with provider fallback
   */
  static async getPortfolioValue(
    address: string,
    chainIds: number[],
  ): Promise<{
    data: { chainId: number; totalValue: number }[];
    providers: Record<number, DataProvider>;
    errors: Record<string, string>;
  }> {
    const results: { chainId: number; totalValue: number }[] = [];
    const providers: Record<number, DataProvider> = {};
    const errors: Record<string, string> = {};

    for (const chainId of chainIds) {
      const availableProviders = this.getAvailableProviders(chainId);

      for (const providerName of availableProviders) {
        try {
          let totalValue: number;

          switch (providerName) {
            case 'covalent': {
              const covalentResult = await CovalentProvider.getPortfolioValue(address, chainId);
              totalValue = covalentResult || 0;
              break;
            }
            case 'moralis': {
              const moralisResult = await MoralisProvider.getWalletPortfolio(address, chainId);
              totalValue = moralisResult.totalValue;
              break;
            }
            case 'alchemy': {
              // Alchemy doesn't have direct portfolio endpoint, use token balances
              const tokens = await AlchemyProvider.getTokenBalances(address, chainId);
              totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
              break;
            }
            default:
              throw new Error(`Unknown provider: ${providerName}`);
          }

          results.push({ chainId, totalValue });
          providers[chainId] = providerName;
          break; // Success, move to next chain
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors[`${providerName}-${chainId}`] = errorMessage;

          // Continue to next provider for this chain
          continue;
        }
      }
    }

    return { data: results, providers, errors };
  }

  /**
   * Health check for all providers
   */
  static async healthCheck(): Promise<
    Record<DataProvider, { status: 'healthy' | 'unhealthy'; error?: string }>
  > {
    const healthStatus: Record<DataProvider, { status: 'healthy' | 'unhealthy'; error?: string }> =
      {} as Record<DataProvider, { status: 'healthy' | 'unhealthy'; error?: string }>;

    // Test address for health check
    const testAddress = '0x742CCF2e36AeBE0ad95A00c7cc1d8CB9aBBDBfE4';
    const testChainId = 1; // Ethereum mainnet

    for (const provider of PROVIDERS) {
      try {
        if (!provider.isAvailable()) {
          healthStatus[provider.name] = {
            status: 'unhealthy',
            error: 'API key not configured',
          };
          continue;
        }

        if (!provider.isChainSupported(testChainId)) {
          healthStatus[provider.name] = {
            status: 'unhealthy',
            error: 'Test chain not supported',
          };
          continue;
        }

        // Perform a simple API call to test connectivity
        switch (provider.name) {
          case 'covalent':
            await CovalentProvider.getTokenBalances(testAddress, testChainId);
            break;
          case 'moralis':
            await MoralisProvider.getTokenBalances(testAddress, testChainId);
            break;
          case 'alchemy':
            await AlchemyProvider.getTokenBalances(testAddress, testChainId);
            break;
        }

        healthStatus[provider.name] = { status: 'healthy' };
      } catch (error) {
        healthStatus[provider.name] = {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return healthStatus;
  }
}
