import { validateAnalysisParams } from '@/lib/validation';
import { MultiChainWalletAnalyzer } from '@/lib/multi-chain-analyzer';
import { ServerAIAnalyzer } from '@/lib/server-ai-analyzer';
import { AIAnalyzerFallback } from '@/lib/ai-analyzer-fallback';
import { WalletData, AIAnalysis } from '@/types';
import { WhaleDetector } from '@/lib/whale-detector';
import { ThemeToggle } from '@/components/ThemeToggle';
import WalletSearchForm from './WalletSearchForm';
import WalletCharts from '@/components/client/WalletCharts';
import MetricsDashboard from '@/components/client/MetricsDashboard';

interface WalletAnalysisServerProps {
  readonly address: string;
  readonly chain?: number;
  readonly mode: 'single-chain' | 'multi-chain';
}

/**
 * Server-side data fetching for wallet analysis - calls analyzer directly
 */
async function fetchWalletData(params: {
  address: string;
  chain?: number;
  mode: 'single-chain' | 'multi-chain';
}): Promise<WalletData> {
  try {
    console.log(`🔍 Analyzing wallet: ${params.address}`);

    // Use the MultiChainWalletAnalyzer directly - no HTTP requests needed in SSR
    const walletData = await MultiChainWalletAnalyzer.analyzeWalletWithProviders(params.address);

    if (!walletData) {
      throw new Error('No wallet data returned from analysis');
    }

    return walletData;
  } catch (error) {
    console.error('Error in fetchWalletData:', error);
    throw error;
  }
}

/**
 * Server Component for wallet analysis - performs all data fetching on the server
 */
export default async function WalletAnalysisServer({
  address,
  chain,
  mode,
}: WalletAnalysisServerProps) {
  let walletData: WalletData | null = null;
  let aiAnalysis: AIAnalysis | null = null;
  let error: string | null = null;
  let isUsingFallback = false;

  try {
    // Validate parameters on the server
    const validatedParams = validateAnalysisParams({ address, chain, mode });

    // Fetch wallet data using our server-side function
    walletData = await fetchWalletData({
      address: validatedParams.address,
      chain: validatedParams.chain,
      mode: validatedParams.mode,
    });

    if (!walletData) {
      throw new Error('Failed to fetch wallet data');
    }

    // Generate AI analysis on the server using ServerAIAnalyzer
    try {
      const whaleMetrics = WhaleDetector.analyzeWallet(
        walletData.tokenBalances,
        walletData.transactions,
      );

      aiAnalysis = await ServerAIAnalyzer.generateDetailedAnalysis(
        walletData,
        whaleMetrics,
        walletData.liquidationRisk,
      );

      // Check if the analysis is from fallback (low confidence indicates fallback was used)
      if (aiAnalysis && aiAnalysis.confidence <= 75) {
        isUsingFallback = true;
      }
    } catch (aiError) {
      console.error('Failed to generate AI analysis, trying fallback:', aiError);
      isUsingFallback = true;

      try {
        const whaleMetrics = WhaleDetector.analyzeWallet(
          walletData.tokenBalances,
          walletData.transactions,
        );
        aiAnalysis = await AIAnalyzerFallback.generateDetailedAnalysis(
          walletData,
          whaleMetrics,
          walletData.liquidationRisk,
        );
      } catch (fallbackError) {
        console.error('Fallback AI analysis also failed:', fallbackError);
        // Set comprehensive fallback analysis
        const portfolioValue =
          walletData.totalBalance > 0
            ? walletData.totalBalance
            : walletData.tokenBalances.reduce((sum, token) => sum + (token.value || 0), 0);

        const riskFactors = [
          'Market volatility across multiple blockchain networks',
          'Smart contract interaction risks',
          'Cross-chain bridge security considerations',
          ...(walletData.liquidationRisk.riskLevel === 'HIGH'
            ? ['Elevated liquidation risk detected']
            : []),
          ...(walletData.whaleScore > 0.8
            ? ['Large position size increases market impact risk']
            : []),
          ...(portfolioValue > 1000000
            ? ['High-value portfolio attracts additional security risks']
            : []),
        ];

        const recommendations = [
          'Implement proper security measures including hardware wallet usage',
          'Diversify holdings across different asset classes and risk levels',
          'Monitor market conditions and set appropriate stop-loss levels',
          'Consider dollar-cost averaging for large position entries and exits',
          ...(walletData.liquidationRisk.riskLevel === 'HIGH'
            ? ['Review and reduce liquidation risk exposure']
            : []),
          ...(portfolioValue > 100000
            ? ['Consider portfolio insurance or hedging strategies']
            : []),
          ...(walletData.crossChainMetrics.totalChains > 3
            ? ['Consolidate holdings on fewer chains to reduce complexity']
            : []),
        ];

        aiAnalysis = {
          summary: `Analyzed wallet contains ${walletData.tokenBalances.length} tokens across ${
            walletData.crossChainMetrics.totalChains
          } blockchain networks with a total portfolio value of $${portfolioValue.toLocaleString()}. ${
            walletData.transactions.length
          } transactions were analyzed to assess trading patterns and risk factors.`,
          keyFindings: [
            `Multi-chain portfolio spanning ${walletData.crossChainMetrics.totalChains} blockchain networks`,
            `Holdings include ${walletData.tokenBalances.length} different token types`,
            `Portfolio valued at $${portfolioValue.toLocaleString()} based on current market prices`,
            `${walletData.transactions.length} transaction history analyzed for risk assessment`,
            `Whale score: ${(walletData.whaleScore * 100).toFixed(1)}% - ${
              walletData.whaleScore > 0.7 ? 'High whale activity' : 'Standard trading patterns'
            }`,
            `Risk level assessed as: ${walletData.liquidationRisk.riskLevel}`,
          ],
          riskFactors,
          recommendations,
          confidence: 0.6,
        };
      }
    }
  } catch (fetchError) {
    console.error('Failed to analyze wallet:', fetchError);
    error = fetchError instanceof Error ? fetchError.message : 'Failed to analyze wallet';
  }

  // If there's an error, show error state
  if (error || !walletData) {
    return (
      <div className='container mx-auto px-4 pt-8'>
        {/* Navigation Bar - matching home page style */}
        <nav className='glass-card mb-12 p-6 card-hover'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <div className='w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center glow'>
                  <span className='text-white font-bold text-xl'>🐋</span>
                </div>
                <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping'></div>
              </div>
              <div>
                <h1 className='text-3xl font-bold gradient-text'>Whale Analyzer</h1>
                <p className='text-sm text-muted-foreground'>AI-Powered Web3 Analytics</p>
              </div>
            </div>

            <div className='flex items-center space-x-6'>
              <div className='hidden md:flex items-center space-x-2 glass-button px-4 py-2 rounded-xl'>
                <div className='w-2 h-2 bg-red-400 rounded-full pulse-slow' />
                <span className='text-sm font-medium'>Analysis Failed</span>
              </div>
              <ThemeToggle className='glass-button' />
            </div>
          </div>
        </nav>

        <div className='text-center mb-16'>
          <div className='max-w-md mx-auto'>
            {/* Error Animation */}
            <div className='w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-red-500/30 animate-pulse'>
              <span className='text-6xl'>❌</span>
            </div>

            <h2 className='text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4'>
              Analysis Failed
            </h2>
            <p className='text-xl text-gray-300 mb-8'>
              {error ?? 'Unable to analyze the provided wallet address'}
            </p>

            <div className='glass-card p-8 card-hover'>
              <h3 className='text-2xl font-bold text-white mb-4'>Try Another Wallet</h3>
              <WalletSearchForm initialAddress='' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 pt-8'>
      {/* Navigation Bar - matching home page style */}
      <nav className='glass-card mb-12 p-6 card-hover'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <div className='w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center glow'>
                <span className='text-white font-bold text-xl'>🐋</span>
              </div>
              <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping'></div>
            </div>
            <div>
              <h1 className='text-3xl font-bold gradient-text'>Whale Analyzer</h1>
              <p className='text-sm text-muted-foreground'>AI-Powered Web3 Analytics</p>
            </div>
          </div>

          <div className='flex items-center space-x-6'>
            <div className='hidden md:flex items-center space-x-2 glass-button px-4 py-2 rounded-xl'>
              <div
                className={`w-2 h-2 rounded-full pulse-slow ${
                  isUsingFallback ? 'bg-yellow-400' : 'bg-green-400'
                }`}
              />
              <span className='text-sm font-medium'>
                {isUsingFallback ? 'AI Fallback' : 'Live Analysis'}
              </span>
            </div>
            <ThemeToggle className='glass-button' />
          </div>
        </div>
      </nav>

      {/* Hero Section - matching home page style */}
      <div className='text-center mb-16 space-y-8'>
        <div className='float'>
          <h2 className='text-6xl md:text-7xl font-bold mb-6'>
            <span className='gradient-whale block'>Wallet</span>
            <span className='gradient-crypto'>Analysis</span>
          </h2>
        </div>

        {/* Address Display Card */}
        <div className='glass-card p-8 max-w-2xl mx-auto card-hover'>
          <div className='flex items-center justify-center gap-4 mb-6'>
            <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse'>
              <span className='text-white text-xl'>🔍</span>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Analyzing Wallet</p>
              <p className='text-xl font-mono gradient-text'>
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className='flex items-center justify-center gap-6 text-sm'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              <span className='text-muted-foreground'>Blockchain Data</span>
            </div>
            <div className='flex items-center gap-2'>
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isUsingFallback ? 'bg-yellow-400' : 'bg-green-400'
                }`}></div>
              <span className='text-muted-foreground'>
                {isUsingFallback ? 'AI Fallback' : 'AI Analysis'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className='space-y-12 pb-8'>
        {/* Metrics Dashboard */}
        <div className='glass-card p-8 card-hover'>
          <MetricsDashboard walletData={walletData} />
        </div>

        {/* Charts Section */}
        <div className='glass-card p-8 card-hover'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold gradient-text mb-2 text-center'>
              Portfolio Analytics
            </h2>
            <p className='text-muted-foreground text-center mb-8'>
              Visual breakdown of holdings and trading activity
            </p>
          </div>
          <WalletCharts walletData={walletData} />
        </div>

        {/* AI Analysis Section */}
        {aiAnalysis && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* AI Summary */}
            <div className='glass-card p-8 card-hover'>
              <h3 className='text-2xl font-bold gradient-text mb-6 flex items-center gap-3'>
                <span className='w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse'></span>
                AI Analysis Summary
                <div className='ml-auto text-sm glass-button px-3 py-1 rounded-full'>
                  {Math.round(aiAnalysis.confidence * 100)}% Confidence
                </div>
              </h3>
              <div className='prose prose-invert max-w-none'>
                <p className='text-muted-foreground leading-relaxed'>{aiAnalysis.summary}</p>
              </div>
            </div>

            {/* Key Findings */}
            <div className='glass-card p-8 card-hover'>
              <h3 className='text-2xl font-bold gradient-text mb-6 flex items-center gap-3'>
                <span className='w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse'></span>{' '}
                Key Findings
              </h3>
              <ul className='space-y-3'>
                {aiAnalysis.keyFindings.map((finding, index) => (
                  <li
                    key={`finding-${finding.slice(0, 20)}-${index}`}
                    className='flex items-start gap-3 group'>
                    <div className='w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mt-2 group-hover:scale-125 transition-transform'></div>
                    <span className='text-muted-foreground group-hover:text-black transition-colors'>
                      {finding}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div className='glass-card p-8 card-hover'>
              <h3 className='text-2xl font-bold gradient-text mb-6 flex items-center gap-3'>
                <span className='w-3 h-3 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-pulse'></span>{' '}
                Risk Factors
              </h3>
              <ul className='space-y-3'>
                {aiAnalysis.riskFactors.filter((risk) => risk && risk.trim().length > 0).length >
                0 ? (
                  aiAnalysis.riskFactors
                    .filter((risk) => risk && risk.trim().length > 0)
                    .map((risk, index) => (
                      <li
                        key={`risk-${risk.slice(0, 20)}-${index}`}
                        className='flex items-start gap-3 group'>
                        <div className='w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mt-2 group-hover:scale-125 transition-transform'></div>
                        <span className='text-muted-foreground group-hover:text-pink-400 transition-colors'>
                          {risk}
                        </span>
                      </li>
                    ))
                ) : (
                  <li className='flex items-start gap-3'>
                    <div className='w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mt-2'></div>
                    <span className='text-muted-foreground'>
                      No significant risk factors identified at this time.
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Recommendations */}
            <div className='glass-card p-8 card-hover'>
              <h3 className='text-2xl font-bold gradient-text mb-6 flex items-center gap-3'>
                <span className='w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse'></span>{' '}
                Recommendations
              </h3>
              <ul className='space-y-3'>
                {aiAnalysis.recommendations.filter((rec) => rec && rec.trim().length > 0).length >
                0 ? (
                  aiAnalysis.recommendations
                    .filter((rec) => rec && rec.trim().length > 0)
                    .map((recommendation, index) => (
                      <li
                        key={`rec-${recommendation.slice(0, 20)}-${index}`}
                        className='flex items-start gap-3 group'>
                        <div className='w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 group-hover:scale-125 transition-transform'></div>
                        <span className='text-muted-foreground group-hover:text-pink-400 transition-colors'>
                          {recommendation}
                        </span>
                      </li>
                    ))
                ) : (
                  <li className='flex items-start gap-3'>
                    <div className='w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mt-2'></div>
                    <span className='text-muted-foreground'>
                      Portfolio appears well-managed. Continue monitoring market conditions.
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Additional Search */}
        <div className='animate-slideInUp animate-delay-800 animate-fill-forwards text-center'>
          <div className='glass-card p-8 max-w-2xl mx-auto card-hover'>
            <h3 className='text-2xl font-bold gradient-text mb-4'>Analyze Another Wallet</h3>
            <p className='text-muted-foreground mb-6'>
              Enter a new wallet address to continue analyzing
            </p>
            <WalletSearchForm initialAddress='' />
          </div>
        </div>
      </div>
    </div>
  );
}
