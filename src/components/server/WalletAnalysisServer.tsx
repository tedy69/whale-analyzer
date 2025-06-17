import { validateAnalysisParams } from '@/lib/validation';
import { MultiChainWalletAnalyzer } from '@/lib/multi-chain-analyzer';
import { ServerAIAnalyzer } from '@/lib/server-ai-analyzer';
import { AIAnalyzerFallback } from '@/lib/ai-analyzer-fallback';
import { WalletData, AIAnalysis } from '@/types';
import { WhaleDetector } from '@/lib/whale-detector';
import WalletAnalysisNavigation from './WalletAnalysisNavigation';
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
        // Set basic fallback analysis
        aiAnalysis = {
          summary: 'AI analysis temporarily unavailable. Manual analysis shows wallet activity.',
          keyFindings: [
            `Portfolio contains ${walletData.tokenBalances.length} different tokens`,
            `Total portfolio value: $${walletData.totalBalance.toLocaleString()}`,
            `Recent transaction activity: ${walletData.transactions.length} transactions analyzed`,
          ],
          riskFactors: ['Market volatility', 'Smart contract risks'],
          recommendations: ['Diversify holdings', 'Monitor market conditions', 'Set stop losses'],
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
      <div className='min-h-screen relative'>
        <div className='container mx-auto px-4 pt-8'>
          <WalletAnalysisNavigation />

          <div className='text-center py-24'>
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

              <div className='bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl'>
                <h3 className='text-2xl font-bold text-white mb-4'>Try Another Wallet</h3>
                <WalletSearchForm initialAddress='' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const whaleMetrics = WhaleDetector.analyzeWallet(
    walletData.tokenBalances,
    walletData.transactions,
  );

  return (
    <div className='min-h-screen relative'>
      {/* Header Navigation */}
      <div className='container mx-auto px-4 pt-8'>
        <WalletAnalysisNavigation />
      </div>

      {/* Hero Section */}
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center mb-16'>
          {/* Animated Header */}
          <div className='animate-slideInUp'>
            <h1 className='text-6xl md:text-7xl font-bold mb-6'>
              <span className='gradient-crypto'>Wallet Analysis</span>
            </h1>

            {/* Address Display */}
            <div className='bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 max-w-2xl mx-auto mb-8 shadow-2xl'>
              <div className='flex items-center justify-center gap-4'>
                <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse'>
                  <span className='text-white text-xl'>🔍</span>
                </div>
                <div>
                  <p className='text-sm text-gray-400'>Analyzing Wallet</p>
                  <p className='text-xl font-mono text-white'>
                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                  </p>
                </div>
              </div>

              {/* Status Indicators */}
              <div className='flex items-center justify-center gap-6 mt-6 text-sm'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                  <span className='text-gray-300'>Blockchain Data</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      isUsingFallback ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                  <span className='text-gray-300'>
                    {isUsingFallback ? 'AI Fallback' : 'AI Analysis'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className='animate-slideInUp opacity-0 animate-delay-200 animate-fill-forwards'>
          <MetricsDashboard walletData={walletData} whaleMetrics={whaleMetrics} />
        </div>

        {/* Charts Section */}
        <div className='animate-slideInUp opacity-0 animate-delay-400 animate-fill-forwards'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-white mb-2 text-center'>Portfolio Analytics</h2>
            <p className='text-gray-400 text-center mb-8'>
              Visual breakdown of holdings and trading activity
            </p>
          </div>
          <WalletCharts
            tokenBalances={walletData.tokenBalances}
            transactions={walletData.transactions}
            totalBalance={walletData.totalBalance}
          />
        </div>

        {/* AI Analysis Section */}
        {aiAnalysis && (
          <div className='animate-slideInUp opacity-0 animate-delay-600 animate-fill-forwards'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12'>
              {/* AI Summary */}
              <div className='bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl'>
                <h3 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
                  <span className='w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse'></span>
                  AI Analysis Summary
                  <div className='ml-auto text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-3 py-1 border border-purple-500/30'>
                    {Math.round(aiAnalysis.confidence * 100)}% Confidence
                  </div>
                </h3>
                <div className='prose prose-invert max-w-none'>
                  <p className='text-gray-300 leading-relaxed'>{aiAnalysis.summary}</p>
                </div>
              </div>

              {/* Key Findings */}
              <div className='bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl'>
                <h3 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
                  <span className='w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse'></span>
                  Key Findings
                </h3>
                <ul className='space-y-3'>
                  {aiAnalysis.keyFindings.map((finding, index) => (
                    <li key={`finding-${index}`} className='flex items-start gap-3 group'>
                      <div className='w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mt-2 group-hover:scale-125 transition-transform'></div>
                      <span className='text-gray-300 group-hover:text-white transition-colors'>
                        {finding}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Factors */}
              <div className='bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl'>
                <h3 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
                  <span className='w-3 h-3 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-pulse'></span>
                  Risk Factors
                </h3>
                <ul className='space-y-3'>
                  {aiAnalysis.riskFactors.map((risk, index) => (
                    <li key={`risk-${index}`} className='flex items-start gap-3 group'>
                      <div className='w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mt-2 group-hover:scale-125 transition-transform'></div>
                      <span className='text-gray-300 group-hover:text-white transition-colors'>
                        {risk}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className='bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl'>
                <h3 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
                  <span className='w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse'></span>
                  Recommendations
                </h3>
                <ul className='space-y-3'>
                  {aiAnalysis.recommendations.map((recommendation, index) => (
                    <li key={`rec-${index}`} className='flex items-start gap-3 group'>
                      <div className='w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2 group-hover:scale-125 transition-transform'></div>
                      <span className='text-gray-300 group-hover:text-white transition-colors'>
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Additional Search */}
        <div className='animate-slideInUp opacity-0 animate-delay-800 animate-fill-forwards mt-16 text-center'>
          <div className='bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl'>
            <h3 className='text-2xl font-bold text-white mb-4'>Analyze Another Wallet</h3>
            <p className='text-gray-400 mb-6'>Enter a new wallet address to continue analyzing</p>
            <WalletSearchForm initialAddress='' />
          </div>
        </div>
      </div>
    </div>
  );
}
