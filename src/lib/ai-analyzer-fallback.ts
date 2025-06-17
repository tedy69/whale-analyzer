import { WalletData, AIAnalysis, WhaleMetrics, LiquidationRisk } from '@/types';

export class AIAnalyzerFallback {
  static async generateWalletSummary(walletData: WalletData): Promise<string> {
    const { totalBalance, tokenBalances, whaleScore, liquidationRisk } = walletData;

    let summary = `**💰 Portfolio Overview:** $${totalBalance.toLocaleString()} spread across ${
      tokenBalances.length
    } different tokens.\n\n`;

    // Enhanced whale status assessment with more catchy language
    if (whaleScore >= 80) {
      summary +=
        '🐋 **WHALE ALERT!** This is a legendary crypto whale with massive holdings and institutional-level activity. The kind of wallet that moves markets! 🌊\n\n';
    } else if (whaleScore >= 60) {
      summary +=
        '🐋 **Big Fish Energy!** Significant whale activity detected with large holdings and frequent high-value transactions. This wallet means business! 💼\n\n';
    } else if (whaleScore >= 40) {
      summary +=
        '🐠 **Smart Money Moves!** Moderate trading activity with substantial holdings. Shows sophisticated understanding of the market. 📈\n\n';
    } else if (whaleScore >= 20) {
      summary +=
        '🐟 **Active Trader Vibes!** Regular transaction patterns showing engagement with the ecosystem. Building something good here! 🚀\n\n';
    } else {
      summary +=
        '🦐 **Getting Started!** Standard wallet activity with basic holdings. Everyone starts somewhere - keep building! 💪\n\n';
    }

    // Enhanced DeFi risk assessment with more engaging language
    if (liquidationRisk.riskLevel === 'CRITICAL') {
      summary +=
        '🚨 **RED ALERT!** CRITICAL liquidation risk detected - immediate action required! This is not a drill! ⚠️';
    } else if (liquidationRisk.riskLevel === 'HIGH') {
      summary +=
        '⚠️ **Danger Zone!** High liquidation risk in DeFi positions requires urgent attention. Time to take action! 🔧';
    } else if (liquidationRisk.riskLevel === 'MEDIUM') {
      summary +=
        '⚡ **Balanced Player!** Moderate DeFi exposure with manageable risk levels. Playing it smart! 🎯';
    } else if (liquidationRisk.totalBorrowed > 0) {
      summary +=
        '✅ **DeFi Pro!** Active in lending protocols with low risk profile. Earning that passive income! 💰';
    } else {
      summary +=
        '💎 **Diamond Hands!** Conservative holding strategy with minimal DeFi exposure. HODLing like a champion! 🏆';
    }

    return summary;
  }

  static async generateDetailedAnalysis(
    walletData: WalletData,
    whaleMetrics: WhaleMetrics,
    liquidationRisk: LiquidationRisk,
  ): Promise<AIAnalysis> {
    const keyFindings: string[] = [];
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // Enhanced whale analysis
    if (whaleMetrics.score >= 80) {
      keyFindings.push(
        '🏆 Legendary whale status with exceptional portfolio size ($' +
          whaleMetrics.totalValue.toLocaleString() +
          ')',
      );
      keyFindings.push('📈 Institutional-level trading patterns with significant market influence');
    } else if (whaleMetrics.score >= 60) {
      keyFindings.push(
        '🐋 Significant whale activity with large holdings ($' +
          whaleMetrics.totalValue.toLocaleString() +
          ')',
      );
      keyFindings.push('💪 Strong market position with substantial trading volume');
    } else if (whaleMetrics.score >= 40) {
      keyFindings.push('🐠 Moderate whale characteristics with growing portfolio');
      keyFindings.push('📊 Active trading strategy with regular large transactions');
    } else if (whaleMetrics.score >= 20) {
      keyFindings.push('🐟 Active trader with consistent transaction patterns');
    } else {
      keyFindings.push('🦐 Standard retail wallet with basic trading activity');
    }

    // Portfolio diversity analysis
    if (whaleMetrics.uniqueTokens >= 50) {
      keyFindings.push(
        '🌈 Extremely diversified portfolio across ' +
          whaleMetrics.uniqueTokens +
          ' different tokens',
      );
      recommendations.push('Consider portfolio optimization to reduce complexity');
    } else if (whaleMetrics.uniqueTokens >= 30) {
      keyFindings.push('🎯 Highly diversified portfolio with excellent risk distribution');
    } else if (whaleMetrics.uniqueTokens >= 15) {
      keyFindings.push('✅ Well-diversified holdings across multiple sectors');
    } else if (whaleMetrics.uniqueTokens >= 5) {
      keyFindings.push('⚖️ Moderate diversification with room for improvement');
      recommendations.push('Consider diversifying into more token categories');
    } else {
      keyFindings.push('⚠️ Limited diversification - concentrated holdings detected');
      riskFactors.push('High concentration risk due to limited token variety');
      recommendations.push('Diversify holdings to reduce concentration risk');
    }

    // Transaction behavior analysis
    if (whaleMetrics.largeTransactions >= 10) {
      keyFindings.push('💰 Frequent large transactions indicate sophisticated trading behavior');
    } else if (whaleMetrics.largeTransactions >= 5) {
      keyFindings.push('📈 Regular large transactions showing active management');
    } else if (whaleMetrics.largeTransactions >= 1) {
      keyFindings.push('🎯 Occasional large transactions detected');
    }

    // DeFi participation analysis
    if (whaleMetrics.stakingValue > 100000) {
      keyFindings.push(
        '🥩 Major staking participation with $' +
          whaleMetrics.stakingValue.toLocaleString() +
          ' staked',
      );
      keyFindings.push('🔒 Strong commitment to long-term holding strategy');
    } else if (whaleMetrics.stakingValue > 10000) {
      keyFindings.push(
        '🥩 Active staking with $' +
          whaleMetrics.stakingValue.toLocaleString() +
          ' earning rewards',
      );
    } else if (whaleMetrics.stakingValue > 0) {
      keyFindings.push('🌱 Moderate staking activity detected');
      recommendations.push('Consider increasing staking exposure for passive income');
    }

    if (whaleMetrics.lendingValue > 50000) {
      keyFindings.push(
        '🏦 Significant DeFi lending activity with $' +
          whaleMetrics.lendingValue.toLocaleString() +
          ' supplied',
      );
    } else if (whaleMetrics.lendingValue > 10000) {
      keyFindings.push('💼 Active DeFi lending participation');
    } else if (whaleMetrics.lendingValue > 0) {
      keyFindings.push('🌿 Some DeFi lending exposure detected');
    }

    // Risk analysis based on liquidation data
    if (liquidationRisk.riskLevel === 'CRITICAL') {
      riskFactors.push('🚨 CRITICAL liquidation risk - positions may be liquidated soon');
      riskFactors.push('📉 Health factor below safe levels');
      recommendations.push('URGENT: Add collateral or repay debt immediately');
      recommendations.push('Consider closing some leveraged positions');
    } else if (liquidationRisk.riskLevel === 'HIGH') {
      riskFactors.push('⚠️ High liquidation risk in current market conditions');
      riskFactors.push('🌊 Vulnerable to market volatility');
      recommendations.push('Monitor positions closely and prepare emergency funds');
      recommendations.push('Consider reducing leverage ratios');
    } else if (liquidationRisk.riskLevel === 'MEDIUM') {
      riskFactors.push('⚡ Moderate DeFi exposure with manageable risk');
      recommendations.push('Keep monitoring health factors regularly');
    } else if (liquidationRisk.totalBorrowed > 0) {
      keyFindings.push('✅ Conservative DeFi strategy with low liquidation risk');
    }

    // Market exposure risks
    if (walletData.totalBalance > 1000000) {
      riskFactors.push('💎 Large portfolio value exposed to market volatility');
      recommendations.push('Consider implementing systematic profit-taking strategy');
    }

    if (whaleMetrics.uniqueTokens < 5) {
      riskFactors.push('🎯 High concentration risk due to limited diversification');
    }

    // General recommendations based on profile
    if (whaleMetrics.score >= 60) {
      recommendations.push('Consider implementing advanced risk management strategies');
      recommendations.push('Explore institutional-grade DeFi protocols');
      recommendations.push('Monitor market impact of large transactions');
    } else if (whaleMetrics.score >= 30) {
      recommendations.push('Continue building diversified portfolio');
      recommendations.push('Explore additional DeFi yield opportunities');
    } else {
      recommendations.push('Focus on dollar-cost averaging and gradual accumulation');
      recommendations.push('Start with low-risk DeFi protocols to learn');
    }

    // Always include these general recommendations
    recommendations.push('Set up price alerts for major holdings');
    recommendations.push('Keep updated on regulatory developments');
    recommendations.push('Never invest more than you can afford to lose');

    // Calculate confidence based on data quality
    let confidence = 0.7; // Base confidence for fallback
    if (walletData.tokenBalances.length > 10) confidence += 0.1;
    if (walletData.transactions.length > 50) confidence += 0.1;
    if (liquidationRisk.positions.length > 0) confidence += 0.05;
    if (whaleMetrics.stakingValue > 0 || whaleMetrics.lendingValue > 0) confidence += 0.05;

    const summary = this.generateAnalysisSummary(walletData, whaleMetrics, liquidationRisk);

    return {
      summary,
      keyFindings: keyFindings.slice(0, 8), // Limit to top findings
      riskFactors: riskFactors.slice(0, 6), // Limit to top risks
      recommendations: recommendations.slice(0, 8), // Limit to top recommendations
      confidence: Math.min(confidence, 1.0),
    };
  }

  private static generateAnalysisSummary(
    walletData: WalletData,
    whaleMetrics: WhaleMetrics,
    liquidationRisk: LiquidationRisk,
  ): string {
    const portfolioSize = walletData.totalBalance;
    const whaleLevel = this.getWhaleLevel(whaleMetrics.score);
    const riskLevel = liquidationRisk.riskLevel.toLowerCase();

    let summary = `This ${whaleLevel} wallet manages a $${portfolioSize.toLocaleString()} portfolio `;
    summary += `across ${walletData.tokenBalances.length} tokens with ${riskLevel} DeFi risk exposure. `;

    if (whaleMetrics.stakingValue > 1000) {
      summary += `Significant staking activity ($${whaleMetrics.stakingValue.toLocaleString()}) `;
      summary += `demonstrates long-term investment strategy. `;
    }

    if (whaleMetrics.largeTransactions > 0) {
      summary += `${whaleMetrics.largeTransactions} large transactions indicate active trading behavior. `;
    }

    if (liquidationRisk.totalBorrowed > 1000) {
      summary += `Active DeFi participation with $${liquidationRisk.totalBorrowed.toLocaleString()} borrowed `;
      summary += `and ${liquidationRisk.healthFactor.toFixed(2)} health factor. `;
    }

    summary += this.getRecommendationSummary(whaleMetrics.score, liquidationRisk.riskLevel);

    return summary;
  }

  private static getWhaleLevel(score: number): string {
    if (score >= 80) return 'legendary whale';
    if (score >= 60) return 'major whale';
    if (score >= 40) return 'moderate whale';
    if (score >= 20) return 'active trader';
    return 'standard retail';
  }

  private static getRecommendationSummary(whaleScore: number, riskLevel: string): string {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return 'Immediate risk management required to prevent liquidation losses.';
    }

    if (whaleScore >= 60) {
      return 'Consider implementing advanced portfolio management and risk hedging strategies.';
    } else if (whaleScore >= 30) {
      return 'Continue building diversified positions while exploring additional DeFi opportunities.';
    } else {
      return 'Focus on gradual accumulation and learning DeFi fundamentals.';
    }
  }
}
