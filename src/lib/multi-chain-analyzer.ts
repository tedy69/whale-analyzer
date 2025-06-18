import {
  WalletData,
  ChainData,
  CrossChainMetrics,
  ChainDistribution,
  LiquidationRisk,
  TokenBalance,
  Transaction,
} from '@/types';
import { MultiProviderManager } from './providers/multi-provider';
import { CovalentProvider } from './providers/covalent';
import { SUPPORTED_CHAINS } from './chains';
import { WhaleDetector } from './whale-detector';
import { ServerAIAnalyzer } from './server-ai-analyzer';
import { AIAnalyzerFallback } from './ai-analyzer-fallback';

// Simple liquidation risk calculator
function calculateLiquidationRisk(walletData: WalletData): LiquidationRisk {
  const totalValue = walletData.chains.reduce((total, chain) => total + (chain.totalValue ?? 0), 0);
  const hasDefiPositions = walletData.chains.some((chain) => chain.defiValue > 0);

  // Simple risk assessment based on total value and DeFi exposure
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let riskScore = 10;

  if (hasDefiPositions && totalValue > 100000) {
    riskLevel = 'MEDIUM';
    riskScore = 50;
  } else if (hasDefiPositions && totalValue > 1000000) {
    riskLevel = 'HIGH';
    riskScore = 80;
  }

  return {
    totalBorrowed: hasDefiPositions ? totalValue * 0.3 : 0,
    totalCollateral: totalValue * 0.8,
    healthFactor: hasDefiPositions ? 1.5 : 2.0,
    riskLevel,
    riskScore,
    positions: [], // No specific positions in this simplified version
  };
}

export class MultiChainWalletAnalyzer {
  /**
   * Check if an address is valid
   */
  static isValidAddress(address: string): boolean {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Fetch wallet data with multi-provider support and robust error handling
   */
  private static async fetchWalletData(address: string): Promise<{
    tokenBalances: TokenBalance[];
    transactions: Transaction[];
    totalPortfolioValue: number;
  }> {
    let tokenBalances: TokenBalance[] = [];
    let transactions: Transaction[] = [];
    let totalPortfolioValue = 0;

    const supportedChainIds = Object.keys(SUPPORTED_CHAINS).map(Number);

    try {
      // Try to get token balances for each supported chain using multi-provider
      const balancePromises = supportedChainIds.map(async (chainId) => {
        try {
          const result = await MultiProviderManager.getTokenBalances(address, chainId);
          return result.data.map((token) => ({ ...token, chainId }));
        } catch {
          return [];
        }
      });

      const chainBalances = await Promise.allSettled(balancePromises);
      const allTokenBalances = chainBalances
        .filter(
          (result): result is PromiseFulfilledResult<TokenBalance[]> =>
            result.status === 'fulfilled',
        )
        .flatMap((result) => result.value);

      // Remove duplicates - same token on same chain should not be counted twice
      const seenTokens = new Map<string, TokenBalance>();
      allTokenBalances.forEach((token) => {
        const key = `${token.contractAddress || token.symbol}-${token.chainId}`;
        if (!seenTokens.has(key)) {
          seenTokens.set(key, token);
        }
      });
      tokenBalances = Array.from(seenTokens.values());
    } catch (error) {
      console.warn(
        '⚠️ Multi-provider token balance fetch failed, falling back to Covalent:',
        error,
      );
      try {
        tokenBalances = await CovalentProvider.getMultiChainTokenBalances(address);
      } catch (fallbackError) {
        console.error('❌ Fallback token balance fetch also failed:', fallbackError);
      }
    }

    try {
      // Try to get transactions for main chains using multi-provider
      const mainChains = [1, 137, 56]; // Focus on main chains for transaction history
      const transactionPromises = mainChains.map(async (chainId) => {
        try {
          const result = await MultiProviderManager.getTransactionHistory(address, chainId);

          return result.data.map((tx) => ({ ...tx, chainId }));
        } catch (error) {
          console.warn(`⚠️ Chain ${chainId}: Transaction fetch failed`, error);
          return [];
        }
      });

      const chainTransactions = await Promise.allSettled(transactionPromises);
      transactions = chainTransactions
        .filter(
          (result): result is PromiseFulfilledResult<Transaction[]> =>
            result.status === 'fulfilled',
        )
        .flatMap((result) => result.value);
    } catch (error) {
      console.warn('⚠️ Multi-provider transaction fetch failed, falling back to Covalent:', error);
      try {
        transactions = await CovalentProvider.getMultiChainTransactionHistory(address);
      } catch (fallbackError) {
        console.error('❌ Fallback transaction fetch also failed:', fallbackError);
      }
    }

    try {
      const portfolioResult = await MultiProviderManager.getPortfolioValue(
        address,
        supportedChainIds.slice(0, 5),
      );
      totalPortfolioValue = portfolioResult.data.reduce((sum, chain) => sum + chain.totalValue, 0);

      // If provider-based calculation returns 0, try fallback calculation
      if (totalPortfolioValue === 0 && tokenBalances.length > 0) {
        const calculatedValue = tokenBalances.reduce((sum, balance) => {
          const value = balance.value || 0;
          return sum + value;
        }, 0);

        if (calculatedValue > 0) {
          totalPortfolioValue = calculatedValue;
        }
      }
    } catch (error) {
      console.warn('⚠️ Multi-provider portfolio fetch failed, calculating from balances:', error);
      try {
        totalPortfolioValue = await CovalentProvider.getMultiChainPortfolioValue(address);
      } catch (fallbackError) {
        console.warn(
          '⚠️ Fallback portfolio calculation failed, using token balances:',
          fallbackError,
        );
        totalPortfolioValue = tokenBalances.reduce((sum, balance) => {
          const value = balance.value || 0;

          return sum + value;
        }, 0);
      }
    }

    return { tokenBalances, transactions, totalPortfolioValue };
  }

  /**
   * Analyze a wallet across multiple blockchain networks
   */
  static async analyzeWallet(address: string): Promise<WalletData> {
    try {
      // Validate address
      if (!this.isValidAddress(address)) {
        throw new Error(`Invalid Ethereum address: ${address}`);
      }

      // Fetch wallet data
      const { tokenBalances, transactions, totalPortfolioValue } = await this.fetchWalletData(
        address,
      );

      // Process data into chain-specific format
      const chainMap = new Map<number, ChainData>();

      // Group token balances by chain
      for (const balance of tokenBalances) {
        const chainId = balance.chainId || 1; // Default to Ethereum if not specified

        if (!chainMap.has(chainId)) {
          const chainConfig = SUPPORTED_CHAINS[chainId];
          chainMap.set(chainId, {
            chainId,
            chainName: chainConfig?.name || `Chain ${chainId}`,
            chainLogo: chainConfig?.logo_url ?? '',
            nativeCurrency: chainConfig?.nativeCurrency?.symbol ?? 'ETH',
            name: chainConfig?.name || `Chain ${chainId}`,
            nativeBalance: 0,
            tokenCount: 0,
            totalValue: 0,
            transactionCount: 0,
            defiValue: 0,
            stakingValue: 0,
            isActive: true,
            transactions: [],
            topTokens: [],
            riskLevel: 'LOW',
          });
        }

        const chainData = chainMap.get(chainId)!;
        chainData.tokenCount++;
        chainData.totalValue += balance.value || 0;

        // Add to top tokens (keep top 5)
        chainData.topTokens ??= [];
        chainData.topTokens.push({
          symbol: balance.symbol,
          balance: balance.balance,
          value: balance.value ?? 0,
          address: balance.address ?? balance.contractAddress,
        });
        const sortedTokens = chainData.topTokens.toSorted((a, b) => b.value - a.value).slice(0, 5);
        chainData.topTokens = sortedTokens;
      }

      // Group transactions by chain
      for (const transaction of transactions) {
        const chainId = transaction.chainId || 1;
        const chainData = chainMap.get(chainId);
        if (chainData?.transactions) {
          chainData.transactions.push(transaction);
        }
      }

      const chains = Array.from(chainMap.values());

      // Generate whale metrics and AI analysis
      const whaleMetrics = WhaleDetector.calculateWhaleMetrics(tokenBalances, transactions);
      const liquidationRisk = calculateLiquidationRisk({ chains } as WalletData);
      const crossChainMetrics = this.calculateCrossChainMetrics(chains);

      // Generate AI analysis
      let aiSummary;
      try {
        const walletDataForAI: WalletData = {
          address,
          totalBalance: totalPortfolioValue,
          tokenBalances,
          transactions,
          whaleScore: whaleMetrics.score,
          liquidationRisk,
          chains,
          crossChainMetrics,
          whaleMetrics,
        };
        aiSummary = await ServerAIAnalyzer.generateWalletSummary(walletDataForAI);
      } catch (aiError) {
        console.warn('⚠️ AI analysis failed, using fallback:', aiError);
        const walletDataForFallback: WalletData = {
          address,
          totalBalance: totalPortfolioValue,
          tokenBalances,
          transactions,
          whaleScore: whaleMetrics.score,
          liquidationRisk,
          chains,
          crossChainMetrics,
          whaleMetrics,
        };
        aiSummary = await AIAnalyzerFallback.generateWalletSummary(walletDataForFallback);
      }

      const walletData: WalletData = {
        address,
        totalBalance: totalPortfolioValue,
        tokenBalances,
        transactions,
        whaleScore: whaleMetrics.score,
        chains,
        whaleMetrics,
        liquidationRisk,
        crossChainMetrics,
        aiSummary,
      };

      return walletData;
    } catch (error) {
      console.error(`❌ Wallet analysis failed for ${address}:`, error);
      throw error;
    }
  }

  /**
   * Analyze a wallet using multiple providers for enhanced reliability
   */
  static async analyzeWalletWithProviders(address: string): Promise<WalletData> {
    try {
      // Use the enhanced multi-provider analysis
      return await this.analyzeWallet(address);
    } catch (error) {
      console.error(`❌ Multi-provider wallet analysis failed for ${address}:`, error);
      throw error;
    }
  }

  /**
   * Calculate cross-chain metrics
   */
  private static calculateCrossChainMetrics(chains: ChainData[]): CrossChainMetrics {
    const totalValue = chains.reduce((sum, chain) => sum + chain.totalValue, 0);
    const totalChains = chains.length;

    // Find dominant chain
    const dominantChain = chains.reduce(
      (prev, current) => (current.totalValue > prev.totalValue ? current : prev),
      chains[0],
    );

    // Calculate distribution
    const chainDistribution: ChainDistribution[] = chains.map((chain, index) => ({
      chainId: chain.chainId,
      chainName: chain.name ?? chain.chainName,
      value: chain.totalValue,
      percentage: totalValue > 0 ? (chain.totalValue / totalValue) * 100 : 0,
      color: this.getChainColor(index),
    }));

    // Calculate multi-chain score (0-100)
    const multiChainScore = Math.min(
      100,
      totalChains * 15 + chainDistribution.filter((d) => d.percentage > 5).length * 10,
    );

    return {
      totalChains,
      dominantChain: dominantChain.name ?? dominantChain.chainName,
      chainDistribution,
      bridgeActivity: [], // Simplified for now
      multiChainScore,
    };
  }

  /**
   * Get color for chain visualization
   */
  private static getChainColor(index: number): string {
    const colors = [
      '#3B82F6', // Blue
      '#EF4444', // Red
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#8B5CF6', // Purple
      '#F97316', // Orange
      '#06B6D4', // Cyan
      '#84CC16', // Lime
    ];
    return colors[index % colors.length];
  }
}
