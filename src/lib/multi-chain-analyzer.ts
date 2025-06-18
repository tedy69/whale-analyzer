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
import {
  getMultiChainTokenBalances as getCovalentTokenBalances,
  getMultiChainTransactionHistory as getCovalentTransactionHistory,
  getMultiChainPortfolioValue as getCovalentPortfolioValue,
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
      console.log('📊 Fetching token balances with multi-provider support...');

      // Try to get token balances for each supported chain using multi-provider
      const balancePromises = supportedChainIds.map(async (chainId) => {
        try {
          const result = await MultiProviderManager.getTokenBalances(address, chainId);
          console.log(`✅ Chain ${chainId}: ${result.data.length} tokens from ${result.provider}`);
          return result.data.map((token) => ({ ...token, chainId }));
        } catch (error) {
          console.warn(`⚠️ Chain ${chainId}: All providers failed`, error);
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
      allTokenBalances.forEach(token => {
        const key = `${token.contractAddress || token.symbol}-${token.chainId}`;
        if (!seenTokens.has(key)) {
          seenTokens.set(key, token);
        }
      });
      tokenBalances = Array.from(seenTokens.values());

      console.log(`✅ Total unique token balances found: ${tokenBalances.length} (was ${allTokenBalances.length} before deduplication)`);
    } catch (error) {
      console.warn(
        '⚠️ Multi-provider token balance fetch failed, falling back to Covalent:',
        error,
      );
      try {
        tokenBalances = await getCovalentTokenBalances(address);
      } catch (fallbackError) {
        console.error('❌ Fallback token balance fetch also failed:', fallbackError);
      }
    }

    try {
      console.log('📈 Fetching transaction history with multi-provider support...');

      // Try to get transactions for main chains using multi-provider
      const mainChains = [1, 137, 56]; // Focus on main chains for transaction history
      const transactionPromises = mainChains.map(async (chainId) => {
        try {
          const result = await MultiProviderManager.getTransactionHistory(address, chainId);
          console.log(
            `✅ Chain ${chainId}: ${result.data.length} transactions from ${result.provider}`,
          );
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

      console.log(`✅ Total transactions found: ${transactions.length}`);
    } catch (error) {
      console.warn('⚠️ Multi-provider transaction fetch failed, falling back to Covalent:', error);
      try {
        transactions = await getCovalentTransactionHistory(address);
      } catch (fallbackError) {
        console.error('❌ Fallback transaction fetch also failed:', fallbackError);
      }
    }

    try {
      console.log('💰 Calculating portfolio value with multi-provider support...');

      const portfolioResult = await MultiProviderManager.getPortfolioValue(
        address,
        supportedChainIds.slice(0, 5),
      );
      totalPortfolioValue = portfolioResult.data.reduce((sum, chain) => sum + chain.totalValue, 0);

      console.log(`✅ Portfolio value from providers: $${totalPortfolioValue.toLocaleString()}`);
      console.log(`📊 Providers used:`, portfolioResult.providers);
      
      // If provider-based calculation returns 0, try fallback calculation
      if (totalPortfolioValue === 0 && tokenBalances.length > 0) {
        console.log('⚠️ Provider portfolio value is 0, calculating from token balances...');
        console.log(`📊 Total tokens to process: ${tokenBalances.length}`);
        
        // Count tokens with actual values
        const tokensWithValue = tokenBalances.filter(balance => (balance.value || 0) > 0);
        console.log(`📊 Tokens with value > 0: ${tokensWithValue.length}`);
        
        const calculatedValue = tokenBalances.reduce((sum, balance) => {
          const value = balance.value || 0;
          if (value > 0) {
            console.log(`💰 Token ${balance.symbol} (${balance.chainId}): $${value.toLocaleString()}`);
          }
          return sum + value;
        }, 0);
        
        console.log(`📊 Final calculated portfolio value: $${calculatedValue.toLocaleString()}`);
        
        if (calculatedValue > 0) {
          totalPortfolioValue = calculatedValue;
          console.log(`✅ Set portfolio value from tokens: $${totalPortfolioValue.toLocaleString()}`);
        } else {
          console.log('⚠️ No tokens with positive values found!');
        }
      }
    } catch (error) {
      console.warn('⚠️ Multi-provider portfolio fetch failed, calculating from balances:', error);
      try {
        totalPortfolioValue = await getCovalentPortfolioValue(address);
        console.log(`✅ Fallback Covalent portfolio value: $${totalPortfolioValue.toLocaleString()}`);
      } catch (fallbackError) {
        console.warn(
          '⚠️ Fallback portfolio calculation failed, using token balances:',
          fallbackError,
        );
        totalPortfolioValue = tokenBalances.reduce((sum, balance) => {
          const value = balance.value || 0;
          if (value > 0) {
            console.log(`💰 Fallback token ${balance.symbol}: $${value.toLocaleString()}`);
          }
          return sum + value;
        }, 0);
        console.log(`✅ Final calculated portfolio value: $${totalPortfolioValue.toLocaleString()}`);
      }
    }

    return { tokenBalances, transactions, totalPortfolioValue };
  }

  /**
   * Analyze a wallet across multiple blockchain networks
   */
  static async analyzeWallet(address: string): Promise<WalletData> {
    try {
      console.log(`🔍 Analyzing wallet: ${address}`);

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

      console.log(`✅ Wallet analysis completed for ${address}`);
      console.log(
        `📊 Summary: ${chains.length} chains, $${totalPortfolioValue.toLocaleString()} total value`,
      );

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
      console.log(`🔍 Analyzing wallet with multi-provider support: ${address}`);

      // Get provider status
      const providerStatus = MultiProviderManager.getProviderStatus();
      console.log('📊 Available providers:', providerStatus);

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
