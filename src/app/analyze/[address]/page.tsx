import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import WalletAnalysisServer from '@/components/server/WalletAnalysisServer';
import WalletAnalysisLoading from '@/components/server/WalletAnalysisLoading';
import { isValidAddress } from '@/lib/validation';

interface PageProps {
  params: Promise<{
    address: string;
  }>;
  searchParams: Promise<{
    chain?: string;
    mode?: 'single-chain' | 'multi-chain';
  }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { address } = await params;
  const { chain, mode } = await searchParams;

  if (!isValidAddress(address)) {
    return {
      title: 'Invalid Address - Whale Analyzer',
      description: 'The provided wallet address is invalid.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const chainText = chain ? ` on Chain ${chain}` : ' (Multi-chain)';
  const modeText = mode === 'single-chain' ? 'Single-chain' : 'Multi-chain';

  return {
    title: `${modeText} Wallet Analysis: ${shortAddress}${chainText} - Whale Analyzer`,
    description: `Comprehensive AI-powered analysis of wallet ${address}. Includes whale detection, DeFi liquidation risk assessment, portfolio tracking, and transaction analysis across multiple blockchains.`,
    keywords: [
      `wallet analysis ${address}`,
      'crypto whale detection',
      'DeFi liquidation risk',
      'Web3 portfolio analysis',
      'blockchain wallet tracker',
      'on-chain analytics',
      `${address} wallet`,
      'multi-chain analysis',
    ],
    openGraph: {
      title: `${modeText} Wallet Analysis: ${shortAddress}`,
      description: `AI-powered analysis of wallet activity, whale detection, and liquidation risk assessment for ${shortAddress}`,
      type: 'website',
      url: `https://whale-analyzer.tedyfazrin.com/analyze/${address}`,
      images: [
        {
          url: 'https://whale-analyzer.tedyfazrin.com/og-image.svg',
          width: 1200,
          height: 630,
          alt: `Wallet Analysis for ${shortAddress}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${modeText} Wallet Analysis: ${shortAddress}`,
      description: `AI-powered wallet analysis and risk assessment for ${shortAddress}`,
      images: ['https://whale-analyzer.tedyfazrin.com/og-image.svg'],
    },
    alternates: {
      canonical: `https://whale-analyzer.tedyfazrin.com/analyze/${address}`,
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  };
}

export default async function WalletAnalysisPage({ params, searchParams }: PageProps) {
  const { address } = await params;
  const { chain, mode = 'multi-chain' } = await searchParams;

  // Validate address format
  if (!isValidAddress(address)) {
    notFound();
  }

  const analysisParams = {
    address,
    chain: chain ? parseInt(chain, 10) : undefined,
    mode,
  };

  return (
    <>
      {/* Structured Data for Wallet Analysis */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AnalysisNewsArticle',
            headline: `Wallet Analysis: ${address.slice(0, 6)}...${address.slice(-4)}`,
            description: `Comprehensive AI-powered analysis of Web3 wallet ${address} including whale detection and DeFi risk assessment`,
            author: {
              '@type': 'Organization',
              name: 'Whale Analyzer',
              url: 'https://whale-analyzer.tedyfazrin.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Whale Analyzer',
              logo: {
                '@type': 'ImageObject',
                url: 'https://whale-analyzer.tedyfazrin.com/logo.svg',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://whale-analyzer.tedyfazrin.com/analyze/${address}`,
            },
            image: 'https://whale-analyzer.tedyfazrin.com/og-image.svg',
            datePublished: new Date().toISOString(),
            dateModified: new Date().toISOString(),
            keywords: [
              'wallet analysis',
              'crypto whale detection',
              'DeFi liquidation risk',
              'blockchain analytics',
              address,
            ],
          }),
        }}
      />

      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900'>
        {/* Animated Background Elements */}
        <div className='fixed inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-float' />
          <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-float animate-delay-2000' />
          <div className='absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-float animate-delay-4000' />
        </div>

        <div className='relative z-10'>
          <Suspense fallback={<WalletAnalysisLoading address={address} />}>
            <WalletAnalysisServer {...analysisParams} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
