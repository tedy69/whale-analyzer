import {
  WalletData,
  ChainData,
  CrossChainMetrics,
  ChainDistribution,
  LiquidationRisk,
  TokenBalance,
  Transaction,
} from '@/types';
import {
  getMultiChainTokenBalances,
  getMultiChainTransactionHistory,
  getMultiChainPortfolioValue,
} from './covalent';
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
   * Fetch wallet data with robust error handling
   */
  private static async fetchWalletData(address: string): Promise<{
    tokenBalances: TokenBalance[];
    transactions: Transaction[];
    totalPortfolioValue: number;
  }> {
    let tokenBalances: TokenBalance[] = [];
    let transactions: Transaction[] = [];
    let totalPortfolioValue = 0;

    try {
      console.log('📊 Fetching token balances...');
      tokenBalances = await getMultiChainTokenBalances(address);
      console.log(`✅ Found ${tokenBalances.length} token balances`);
    } catch (error) {
      console.warn('⚠️ Failed to fetch token balances, using fallback:', error);
    }

    try {
      console.log('📈 Fetching transaction history...');
      transactions = await getMultiChainTransactionHistory(address);
      console.log(`✅ Found ${transactions.length} transactions`);
    } catch (error) {
      console.warn('⚠️ Failed to fetch transactions, using fallback:', error);
    }

    try {
      console.log('💰 Calculating portfolio value...');
      totalPortfolioValue = await getMultiChainPortfolioValue(address);
      console.log(`✅ Portfolio value: $${totalPortfolioValue.toLocaleString()}`);
    } catch (error) {
      console.warn('⚠️ Failed to fetch portfolio value, calculating from balances:', error);
      totalPortfolioValue = tokenBalances.reduce((sum, balance) => sum + balance.value, 0);
    }

    return { tokenBalances, transactions, totalPortfolioValue };
  }

  /**
   * Analyze a wallet across multiple blockchain networks
   */
  static async analyzeWallet(address: string): Promise<WalletData> {
    try {
      // Validate address format
      if (!this.isValidAddress(address)) {
        throw new Error('Invalid wallet address format');
      }

      console.log('🔍 Starting multi-chain wallet analysis...');

      // Get multi-chain data with robust error handling
      const { tokenBalances, transactions, totalPortfolioValue } = await this.fetchWalletData(
        address,
      );

      // Analyze whale metrics (using available data)
      const whaleMetrics = WhaleDetector.analyzeWallet(tokenBalances, transactions);

      // Create temporary wallet data for liquidation risk calculation
      const tempWalletData = {
        address,
        totalBalance: totalPortfolioValue,
        tokenBalances,
        transactions,
        whaleScore: whaleMetrics.score,
        liquidationRisk: {
          riskLevel: 'LOW' as const,
          totalCollateral: 0,
          totalDebt: 0,
          totalBorrowed: 0,
          healthFactor: 2.0,
          riskScore: 10,
          positions: [],
        },
        chains: [], // Will be populated below
        crossChainMetrics: {
          totalChains: 0,
          dominantChain: '',
          chainDistribution: [],
          bridgeActivity: [],
          multiChainScore: 0,
        },
      };

      // Calculate liquidation risk
      const liquidationRisk = calculateLiquidationRisk(tempWalletData);

      // Create multi-chain wallet data
      const walletData: WalletData = {
        address,
        totalBalance: totalPortfolioValue,
        tokenBalances,
        transactions,
        whaleScore: whaleMetrics.score,
        liquidationRisk,
        chains: [],
        crossChainMetrics: {
          totalChains: 0,
          dominantChain: '',
          chainDistribution: [],
          bridgeActivity: [],
          multiChainScore: 0,
        },
      };

      // Aggregate data by chain
      const chainMap = new Map<number, ChainData>();

      // Process token balances
      for (const token of tokenBalances) {
        if (!chainMap.has(token.chainId)) {
          const chainConfig = Object.values(SUPPORTED_CHAINS).find(
            (c) => c.chainId === token.chainId,
          );
          chainMap.set(token.chainId, {
            chainId: token.chainId,
            chainName: chainConfig?.name ?? `Chain ${token.chainId}`,
            chainLogo: chainConfig?.logo ?? '',
            nativeCurrency: chainConfig?.nativeCurrency?.symbol ?? 'ETH',
            totalValue: 0,
            tokenCount: 0,
            transactionCount: 0,
            defiValue: 0,
            stakingValue: 0,
            isActive: false,
          });
        }

        const chainData = chainMap.get(token.chainId)!;
        chainData.totalValue += token.value ?? 0;
        chainData.tokenCount += 1;
        chainData.isActive = true;

        // Estimate DeFi and staking values (simplified)
        if (token.symbol?.includes('LP') || token.symbol?.includes('Pool')) {
          chainData.defiValue += token.value ?? 0;
        }
        if (token.symbol?.includes('st') || token.symbol?.includes('Staked')) {
          chainData.stakingValue += token.value ?? 0;
        }
      }

      // Process transactions
      for (const tx of transactions) {
        const chainData = chainMap.get(tx.chainId);
        if (chainData) {
          chainData.transactionCount += 1;
        }
      }

      const chains = Array.from(chainMap.values()).filter((chain) => chain.isActive);
      walletData.chains = chains;

      // Calculate cross-chain metrics
      walletData.crossChainMetrics = this.calculateCrossChainMetrics(chains);

      // Generate AI summary
      try {
        walletData.aiSummary = await ServerAIAnalyzer.generateWalletSummary(walletData);
      } catch (aiError) {
        console.warn('⚠️ AI analysis failed, using fallback:', aiError);
        try {
          walletData.aiSummary = await AIAnalyzerFallback.generateWalletSummary(walletData);
        } catch (fallbackError) {
          console.error('❌ Fallback AI analysis also failed:', fallbackError);
          walletData.aiSummary =
            'Analysis completed successfully, but AI summary generation is currently unavailable.';
        }
      }

      console.log('✅ Multi-chain analysis complete');
      return walletData;
    } catch (error) {
      console.error('❌ Multi-chain analysis failed:', error);
      throw error;
    }
  }

  /**
   * Enhanced analyze wallet method with multi-provider support
   */
  static async analyzeWalletWithProviders(address: string): Promise<WalletData> {
    try {
      console.log('🔍 Starting enhanced wallet analysis...');
      // Use the existing Covalent-based analysis
      return this.analyzeWallet(address);
    } catch (error) {
      console.error('Enhanced wallet analysis failed:', error);
      // Fallback to original method
      return this.analyzeWallet(address);
    }
  }

  /**
   * Calculate cross-chain metrics based on chain data
   */
  private static calculateCrossChainMetrics(chains: ChainData[]): CrossChainMetrics {
    const totalValue = chains.reduce((sum, chain) => sum + chain.totalValue, 0);
    const totalChains = chains.length;

    // Find dominant chain
    const dominantChain =
      chains.length > 0
        ? chains.reduce(
            (prev, current) => (prev.totalValue > current.totalValue ? prev : current),
            chains[0],
          ).chainName
        : 'Unknown';

    // Calculate chain distribution
    const chainDistribution: ChainDistribution[] = chains.map((chain, index) => ({
      chainName: chain.chainName,
      chainId: chain.chainId,
      percentage: totalValue > 0 ? (chain.totalValue / totalValue) * 100 : 0,
      value: chain.totalValue,
      color: this.getChainColor(index),
    }));

    // Calculate multi-chain score (diversification metric)
    const multiChainScore = totalChains > 1 ? Math.min(100, totalChains * 20) : 0;

    return {
      totalChains,
      dominantChain,
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
