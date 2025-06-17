import { TokenBalance, Transaction, WhaleMetrics } from '@/types';

const WHALE_THRESHOLDS = {
  TOTAL_VALUE: 1000000, // $1M USD
  LARGE_TRANSACTION: 100000, // $100K USD
  MIN_STAKING_VALUE: 32, // 32 ETH minimum for staking
  MIN_LENDING_VALUE: 50000, // $50K USD
  UNIQUE_TOKENS_THRESHOLD: 20,
  TRANSACTION_FREQUENCY: 100, // transactions per month
};

export class WhaleDetector {
  static analyzeWallet(tokenBalances: TokenBalance[], transactions: Transaction[]): WhaleMetrics {
    const totalValue = this.calculateTotalValue(tokenBalances);
    const largeTransactions = this.countLargeTransactions(transactions);
    const stakingValue = this.calculateStakingValue(tokenBalances);
    const lendingValue = this.estimateLendingValue(tokenBalances);
    const nftValue = this.estimateNFTValue(tokenBalances);
    const uniqueTokens = tokenBalances.length;
    const averageTransactionSize = this.calculateAverageTransactionSize(transactions);

    const score = this.calculateWhaleScore({
      totalValue,
      largeTransactions,
      stakingValue,
      lendingValue,
      nftValue,
      uniqueTokens,
      averageTransactionSize,
    });

    return {
      totalValue,
      largeTransactions,
      stakingValue,
      lendingValue,
      nftValue,
      uniqueTokens,
      averageTransactionSize,
      score,
    };
  }

  private static calculateTotalValue(tokenBalances: TokenBalance[]): number {
    return tokenBalances.reduce((sum, token) => sum + token.value, 0);
  }

  private static countLargeTransactions(transactions: Transaction[]): number {
    return transactions.filter(
      (tx) => tx.value * 3000 > WHALE_THRESHOLDS.LARGE_TRANSACTION, // Approximate ETH price
    ).length;
  }

  private static calculateStakingValue(tokenBalances: TokenBalance[]): number {
    // Look for stETH, rETH, and other staking tokens
    const stakingTokens = ['stETH', 'rETH', 'cbETH', 'sfrxETH'];
    return tokenBalances
      .filter(
        (token) =>
          token?.symbol &&
          stakingTokens.some((st) => token.symbol?.toLowerCase()?.includes(st.toLowerCase())),
      )
      .reduce((sum, token) => sum + token.value, 0);
  }

  private static estimateLendingValue(tokenBalances: TokenBalance[]): number {
    // Look for aTokens (Aave), cTokens (Compound)
    const lendingTokens = tokenBalances.filter(
      (token) => token?.symbol && (token.symbol?.startsWith('a') || token.symbol?.startsWith('c')),
    );
    return lendingTokens.reduce((sum, token) => sum + token.value, 0);
  }

  private static estimateNFTValue(tokenBalances: TokenBalance[]): number {
    // This is a simplified estimation - in reality, you'd need NFT-specific APIs
    return tokenBalances
      .filter((token) => token?.symbol?.includes('NFT') || token?.name?.includes('NFT'))
      .reduce((sum, token) => sum + token.value, 0);
  }

  private static calculateAverageTransactionSize(transactions: Transaction[]): number {
    if (transactions.length === 0) return 0;
    const totalValue = transactions.reduce((sum, tx) => sum + tx.value, 0);
    return totalValue / transactions.length;
  }

  private static calculateWhaleScore(metrics: Omit<WhaleMetrics, 'score'>): number {
    const valueScore = this.calculateValueScore(metrics.totalValue);
    const transactionScore = this.calculateTransactionScore(metrics.largeTransactions);
    const defiScore = this.calculateDefiScore(metrics.stakingValue + metrics.lendingValue);
    const diversityScore = this.calculateDiversityScore(metrics.uniqueTokens);
    const avgTxScore = this.calculateAvgTransactionScore(metrics.averageTransactionSize);

    return Math.min(valueScore + transactionScore + defiScore + diversityScore + avgTxScore, 100);
  }

  private static calculateValueScore(totalValue: number): number {
    if (totalValue >= WHALE_THRESHOLDS.TOTAL_VALUE * 10) return 40;
    if (totalValue >= WHALE_THRESHOLDS.TOTAL_VALUE * 5) return 35;
    if (totalValue >= WHALE_THRESHOLDS.TOTAL_VALUE) return 25;
    if (totalValue >= WHALE_THRESHOLDS.TOTAL_VALUE * 0.5) return 15;
    if (totalValue >= WHALE_THRESHOLDS.TOTAL_VALUE * 0.1) return 5;
    return 0;
  }

  private static calculateTransactionScore(largeTransactions: number): number {
    if (largeTransactions >= 50) return 20;
    if (largeTransactions >= 20) return 15;
    if (largeTransactions >= 10) return 10;
    if (largeTransactions >= 5) return 5;
    return 0;
  }

  private static calculateDefiScore(defiValue: number): number {
    if (defiValue >= 500000) return 20;
    if (defiValue >= 100000) return 15;
    if (defiValue >= 50000) return 10;
    if (defiValue >= 10000) return 5;
    return 0;
  }

  private static calculateDiversityScore(uniqueTokens: number): number {
    if (uniqueTokens >= 50) return 10;
    if (uniqueTokens >= 30) return 8;
    if (uniqueTokens >= 20) return 6;
    if (uniqueTokens >= 10) return 4;
    if (uniqueTokens >= 5) return 2;
    return 0;
  }

  private static calculateAvgTransactionScore(averageTransactionSize: number): number {
    const avgTxUSD = averageTransactionSize * 3000; // Approximate ETH price
    if (avgTxUSD >= 100000) return 10;
    if (avgTxUSD >= 50000) return 8;
    if (avgTxUSD >= 10000) return 6;
    if (avgTxUSD >= 5000) return 4;
    if (avgTxUSD >= 1000) return 2;
    return 0;
  }

  static getWhaleLevel(score: number): string {
    if (score >= 80) return 'LEGENDARY WHALE';
    if (score >= 60) return 'MEGA WHALE';
    if (score >= 40) return 'WHALE';
    if (score >= 20) return 'DOLPHIN';
    return 'FISH';
  }

  static getWhaleBadges(metrics: WhaleMetrics): string[] {
    const badges: string[] = [];

    if (metrics.totalValue >= 10000000) badges.push('🐋 MEGA WHALE');
    if (metrics.totalValue >= 1000000) badges.push('🐳 WHALE');
    if (metrics.largeTransactions >= 20) badges.push('💰 BIG SPENDER');
    if (metrics.stakingValue >= 100000) badges.push('🥩 STAKING MASTER');
    if (metrics.lendingValue >= 100000) badges.push('🏦 DEFI DEGEN');
    if (metrics.uniqueTokens >= 50) badges.push('🎯 TOKEN COLLECTOR');
    if (metrics.nftValue >= 100000) badges.push('🎨 NFT WHALE');

    return badges;
  }
}
