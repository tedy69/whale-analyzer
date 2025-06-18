import { validateAnalysisParams } from '@/lib/validation';
import { MultiChainWalletAnalyzer } from '@/lib/multi-chain-analyzer';
import { ServerAIAnalyzer } from '@/lib/server-ai-analyzer';
import { AIAnalyzerFallback } from '@/lib/ai-analyzer-fallback';
import { graphProtocolService } from '@/lib/graph-protocol';
import { WalletData, AIAnalysis } from '@/types';
import { WhaleDetector } from '@/lib/whale-detector';
import { ThemeToggle } from '@/components/ThemeToggle';
import WalletSearchForm from './WalletSearchForm';
import WalletCharts from '@/components/client/WalletCharts';
import DeFiAnalysis from '@/components/DeFiAnalysis';

interface WalletAnalysisServerProps {
  readonly address: string;
  readonly chain?: number;
  readonly mode: 'single-chain' | 'multi-chain';
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
  let defiAnalysis: Awaited<ReturnType<typeof graphProtocolService.getDeFiAnalysis>> | null = null;
  let error: string | null = null;
  let isUsingFallback = false;

  try {
    // Validate parameters on the server
    const validatedParams = validateAnalysisParams({ address, chain, mode });

    // Fetch wallet data
    console.log(`🔍 Analyzing wallet: ${validatedParams.address}`);
    walletData = await MultiChainWalletAnalyzer.analyzeWalletWithProviders(validatedParams.address);

    if (!walletData) {
      throw new Error('Failed to fetch wallet data');
    }

    // Fetch DeFi analysis from The Graph Protocol
    try {
      defiAnalysis = await graphProtocolService.getDeFiAnalysis(validatedParams.address);
      console.log(`📊 DeFi analysis completed for ${validatedParams.address}`);
    } catch (defiError) {
      console.error('Failed to fetch DeFi analysis:', defiError);
      defiAnalysis = null;
    }

    // Generate AI analysis with fallback handling
    const whaleMetrics = WhaleDetector.analyzeWallet(
      walletData.tokenBalances,
      walletData.transactions,
    );

    try {
      const aiResult = await ServerAIAnalyzer.generateDetailedAnalysis(
        walletData,
        whaleMetrics,
        walletData.liquidationRisk,
      );
      aiAnalysis = aiResult;
      isUsingFallback = aiResult.confidence <= 75;
    } catch (aiError) {
      console.error('Failed to generate AI analysis, trying fallback:', aiError);

      try {
        const fallbackAnalysis = await AIAnalyzerFallback.generateDetailedAnalysis(
          walletData,
          whaleMetrics,
          walletData.liquidationRisk,
        );
        aiAnalysis = fallbackAnalysis;
        isUsingFallback = true;
      } catch (fallbackError) {
        console.error('Fallback AI analysis also failed:', fallbackError);

        // Generate basic fallback analysis
        const portfolioValue =
          walletData.totalBalance > 0
            ? walletData.totalBalance
            : walletData.tokenBalances.reduce((sum, token) => sum + (token.value || 0), 0);

        aiAnalysis = {
          summary: `Analyzed wallet contains ${walletData.tokenBalances.length} tokens across ${
            walletData.crossChainMetrics.totalChains
          } blockchain networks with a total portfolio value of $${portfolioValue.toLocaleString()}.`,
          keyFindings: [
            `Multi-chain portfolio spanning ${walletData.crossChainMetrics.totalChains} blockchain networks`,
            `Holdings include ${walletData.tokenBalances.length} different token types`,
            `Portfolio valued at $${portfolioValue.toLocaleString()} based on current market prices`,
          ],
          riskFactors: [
            'Market volatility across multiple blockchain networks',
            'Smart contract interaction risks',
          ],
          recommendations: [
            'Implement proper security measures including hardware wallet usage',
            'Diversify holdings across different asset classes and risk levels',
          ],
          confidence: 0.6,
        };
        isUsingFallback = true;
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

  // Return the success state with all data
  return (
    <div className='container mx-auto px-4 pt-8'>
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

      <div className='space-y-12 mb-16'>
        {/* Hero Section */}
        <div className='text-center mb-16 animate-slideInUp'>
          <div className='inline-flex items-center gap-3 glass-card px-6 py-3 rounded-2xl mb-8 card-hover'>
            <div className='w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse'></div>
            <span className='text-sm font-medium text-green-400'>Analysis Complete</span>
          </div>

          <h1 className='text-5xl md:text-7xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'>
              Wallet Analysis
            </span>
          </h1>

          <div className='max-w-2xl mx-auto'>
            <p className='text-xl text-gray-300 mb-8'>
              Comprehensive analysis of wallet{' '}
              <span className='font-mono text-cyan-400 break-all'>{address}</span>
            </p>

            <div className='inline-flex items-center gap-3 glass-card px-8 py-4 rounded-2xl'>
              <span className='text-3xl'>🐋</span>
              <div className='text-left'>
                <div className='text-2xl font-bold gradient-text'>
                  {(walletData.whaleScore * 100).toFixed(1)}%
                </div>
                <div className='text-sm text-muted-foreground'>Whale Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className='animate-slideInUp animate-delay-200 animate-fill-forwards'>
          <div className='glass-card p-8 card-hover'>
            <h2 className='text-3xl font-bold gradient-text mb-8 text-center'>
              Portfolio Overview
            </h2>
            <WalletCharts walletData={walletData} />
          </div>
        </div>

        {/* AI Analysis */}
        {aiAnalysis && (
          <div className='animate-slideInUp animate-delay-400 animate-fill-forwards'>
            <div className='glass-card p-8 card-hover'>
              <div className='text-center mb-8'>
                <h2 className='text-3xl font-bold gradient-text mb-4'>AI Analysis</h2>
                {isUsingFallback && (
                  <div className='inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 rounded-xl'>
                    <span className='text-yellow-400'>⚠️</span>
                    <span className='text-sm text-yellow-400'>Using fallback analysis</span>
                  </div>
                )}
              </div>

              <div className='space-y-8'>
                {/* Summary */}
                <div className='glass-card p-8 card-hover'>
                  <h3 className='text-2xl font-bold gradient-text mb-6'>Summary</h3>
                  <p className='text-lg text-muted-foreground leading-relaxed'>
                    {aiAnalysis.summary}
                  </p>
                  <div className='mt-6 flex items-center gap-3'>
                    <span className='text-sm text-muted-foreground'>Confidence:</span>
                    <div className='flex-1 bg-gray-800 rounded-full h-2 overflow-hidden'>
                      <div
                        className='h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ease-out'
                        style={{ width: `${aiAnalysis.confidence}%` }}
                      />
                    </div>
                    <span className='text-sm font-medium text-cyan-400'>
                      {aiAnalysis.confidence}%
                    </span>
                  </div>
                </div>

                {/* Key Findings */}
                <div className='glass-card p-8 card-hover'>
                  <h3 className='text-2xl font-bold gradient-text mb-6'>Key Findings</h3>
                  <ul className='space-y-3'>
                    {aiAnalysis.keyFindings.map((finding: string, index: number) => (
                      <li key={index} className='flex items-start gap-3'>
                        <div className='w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mt-2'></div>
                        <span className='text-muted-foreground'>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Factors and Recommendations */}
                <div className='grid md:grid-cols-2 gap-8'>
                  <div className='glass-card p-8 card-hover'>
                    <h3 className='text-2xl font-bold gradient-text mb-6'>Risk Factors</h3>
                    <ul className='space-y-3'>
                      {aiAnalysis.riskFactors.map((risk: string, index: number) => (
                        <li key={index} className='flex items-start gap-3'>
                          <div className='w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mt-2'></div>
                          <span className='text-muted-foreground'>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className='glass-card p-8 card-hover'>
                    <h3 className='text-2xl font-bold gradient-text mb-6'>Recommendations</h3>
                    <ul className='space-y-3'>
                      {aiAnalysis.recommendations.map((rec: string, index: number) => (
                        <li key={index} className='flex items-start gap-3'>
                          <div className='w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mt-2'></div>
                          <span className='text-muted-foreground'>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DeFi Analysis */}
        <div className='animate-slideInUp animate-delay-700 animate-fill-forwards'>
          <DeFiAnalysis analysis={defiAnalysis} />
        </div>

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
