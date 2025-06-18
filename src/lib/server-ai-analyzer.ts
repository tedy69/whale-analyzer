import OpenAI from 'openai';
import { WalletData, AIAnalysis, WhaleMetrics, LiquidationRisk } from '@/types';
import { AIAnalyzerFallback } from './ai-analyzer-fallback';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Server-side AI Analyzer for SSR
 * This version calls OpenAI directly instead of making HTTP requests
 */
export class ServerAIAnalyzer {
  static async generateWalletSummary(walletData: WalletData): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OpenAI API key not configured, using fallback');
        return AIAnalyzerFallback.generateWalletSummary(walletData);
      }

      const prompt = this.buildAnalysisPrompt(walletData);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a charismatic Web3 and DeFi expert analyst with a knack for making complex data engaging. Write your analysis like an exciting financial story - use emojis, bold text, and catchy phrases. Make it readable with proper line breaks and formatting. Focus on actionable insights while keeping it entertaining and easy to digest.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content ?? 'Analysis unavailable';
    } catch (error) {
      console.error('Error generating wallet summary:', error);

      // Handle quota errors specifically
      if (
        error instanceof Error &&
        (error.message.includes('quota') || error.message.includes('429'))
      ) {
        console.warn('OpenAI quota exceeded, using fallback analysis');
        return AIAnalyzerFallback.generateWalletSummary(walletData);
      }

      // Use fallback for any other errors
      return AIAnalyzerFallback.generateWalletSummary(walletData);
    }
  }

  static async generateDetailedAnalysis(
    walletData: WalletData,
    whaleMetrics: WhaleMetrics,
    liquidationRisk: LiquidationRisk,
  ): Promise<AIAnalysis> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.warn('OpenAI API key not configured, using fallback');
        return AIAnalyzerFallback.generateDetailedAnalysis(
          walletData,
          whaleMetrics,
          liquidationRisk,
        );
      }

      const prompt = this.buildDetailedAnalysisPrompt(walletData, whaleMetrics, liquidationRisk);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a sophisticated AI analyst specializing in DeFi, Web3, and whale behavior analysis. Provide comprehensive, data-driven insights with strategic recommendations. Use proper formatting with emojis and clear sections. Focus on actionable intelligence and risk assessment.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.6,
      });

      const analysisText = completion.choices[0]?.message?.content ?? '';

      // Parse the analysis into structured format
      return this.parseAIAnalysis(analysisText, walletData, whaleMetrics);
    } catch (error) {
      console.error('Error generating detailed analysis:', error);

      // Handle quota errors specifically
      if (
        error instanceof Error &&
        (error.message.includes('quota') || error.message.includes('429'))
      ) {
        console.warn('OpenAI quota exceeded, using fallback analysis');
        return AIAnalyzerFallback.generateDetailedAnalysis(
          walletData,
          whaleMetrics,
          liquidationRisk,
        );
      }

      // Use fallback for any other errors
      return AIAnalyzerFallback.generateDetailedAnalysis(walletData, whaleMetrics, liquidationRisk);
    }
  }

  private static buildAnalysisPrompt(walletData: WalletData): string {
    const totalValue = walletData.totalBalance ?? 0;
    const tokenCount = walletData.tokenBalances?.length ?? 0;
    const transactionCount = walletData.transactions?.length ?? 0;

    return `Analyze this wallet: ${walletData.address}

📊 **Portfolio Overview:**
- Total Value: $${totalValue.toLocaleString()}
- Token Count: ${tokenCount}
- Recent Transactions: ${transactionCount}

🔍 **Key Holdings:**
${
  walletData.tokenBalances
    ?.slice(0, 10)
    .map(
      (token) =>
        `- ${token.symbol}: ${token.balance?.toFixed(4)} ($${token.value?.toLocaleString()})`,
    )
    .join('\n') ?? 'No token data available'
}

📈 **Recent Activity:**
${
  walletData.transactions
    ?.slice(0, 5)
    .map(
      (tx) =>
        `- ${tx.type}: $${tx.value?.toLocaleString()} on ${new Date(
          tx.timestamp,
        ).toLocaleDateString()}`,
    )
    .join('\n') ?? 'No transaction data available'
}

Please provide an engaging analysis covering:
1. Portfolio composition and diversity
2. Trading patterns and behavior
3. Risk assessment
4. Strategic insights and recommendations

Keep it concise but insightful, using emojis and clear formatting.`;
  }

  private static buildDetailedAnalysisPrompt(
    walletData: WalletData,
    whaleMetrics: WhaleMetrics,
    liquidationRisk: LiquidationRisk,
  ): string {
    return `Comprehensive Analysis for Wallet: ${walletData.address}

📊 **Portfolio Metrics:**
- Total Value: $${walletData.totalBalance?.toLocaleString() ?? 0}
- Token Diversity: ${walletData.tokenBalances?.length ?? 0} different tokens
- Transaction Volume: ${walletData.transactions?.length ?? 0} recent transactions

🐋 **Whale Metrics:**
- Whale Score: ${whaleMetrics.score}/100
- Total Value: $${whaleMetrics.totalValue?.toLocaleString() ?? 0}
- Large Transactions: ${whaleMetrics.largeTransactions}
- Unique Tokens: ${whaleMetrics.uniqueTokens}

⚠️ **Risk Assessment:**
- Liquidation Risk Score: ${liquidationRisk.riskScore}/100
- Total Borrowed: $${liquidationRisk.totalBorrowed?.toLocaleString() ?? 0}
- Total Collateral: $${liquidationRisk.totalCollateral?.toLocaleString() ?? 0}
- Health Factor: ${liquidationRisk.healthFactor ?? 'N/A'}

🔍 **Top Holdings:**
${
  walletData.tokenBalances
    ?.slice(0, 15)
    .map(
      (token) =>
        `- ${token.symbol}: ${token.balance?.toFixed(4)} ($${token.value?.toLocaleString()}) - ${(
          ((token.value ?? 0) / (walletData.totalBalance ?? 1)) *
          100
        ).toFixed(1)}%`,
    )
    .join('\n') ?? 'No token data available'
}

📈 **Recent Transactions:**
${
  walletData.transactions
    ?.slice(0, 10)
    .map(
      (tx) =>
        `- ${tx.type}: $${tx.value?.toLocaleString()} on ${new Date(
          tx.timestamp,
        ).toLocaleDateString()}`,
    )
    .join('\n') ?? 'No transaction data available'
}

Provide a comprehensive analysis with the following sections:
1. **Executive Summary** - Key insights and overall assessment
2. **Portfolio Analysis** - Composition, diversification, and strategy
3. **Risk Assessment** - Liquidation risks, concentration risks, volatility exposure
4. **Whale Behavior Analysis** - Market impact, trading patterns, influence
5. **Strategic Recommendations** - Actionable advice for optimization
6. **Market Outlook** - Potential opportunities and threats

Use clear formatting with emojis, bold headers, and bullet points. Focus on actionable insights.`;
  }

  private static parseAIAnalysis(
    analysisText: string,
    _walletData: WalletData,
    whaleMetrics: WhaleMetrics,
  ): AIAnalysis {
    // Extract sections from the analysis text
    const sections = analysisText.split(/(?=##?\s|\*\*[A-Z])/);

    let summary = '';
    const keyFindings: string[] = [];
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    sections.forEach((section) => {
      const lowerSection = section.toLowerCase();
      if (lowerSection.includes('executive summary') || lowerSection.includes('summary')) {
        summary = section.replace(/##?\s*\*?\*?.*summary\*?\*?:?\s*/i, '').trim();
      } else if (lowerSection.includes('risk')) {
        const riskMatches = section.match(/[-•]\s*([^-•\n]+)/g);
        if (riskMatches) {
          riskFactors.push(...riskMatches.map((r) => r.replace(/[-•]\s*/, '').trim()));
        }
      } else if (lowerSection.includes('finding') || lowerSection.includes('insight')) {
        const findingMatches = section.match(/[-•]\s*([^-•\n]+)/g);
        if (findingMatches) {
          keyFindings.push(...findingMatches.map((f) => f.replace(/[-•]\s*/, '').trim()));
        }
      } else if (lowerSection.includes('recommendation') || lowerSection.includes('advice')) {
        const recMatches = section.match(/[-•]\s*([^-•\n]+)/g);
        if (recMatches) {
          recommendations.push(...recMatches.map((r) => r.replace(/[-•]\s*/, '').trim()));
        }
      }
    });

    // Fallback to full text if sections not found
    if (!summary) {
      summary = analysisText.substring(0, 500) + '...';
    }

    return {
      summary: summary || 'Comprehensive analysis generated',
      keyFindings:
        keyFindings.length > 0
          ? keyFindings
          : ['Portfolio diversification analysis', 'Transaction pattern insights'],
      riskFactors:
        riskFactors.length > 0
          ? riskFactors
          : ['Portfolio concentration risk', 'Market volatility exposure'],
      recommendations:
        recommendations.length > 0
          ? recommendations
          : ['Monitor position sizes', 'Consider risk management strategies'],
      confidence: Math.min(95, Math.max(70, 85 + whaleMetrics.score / 10)),
    };
  }
}
