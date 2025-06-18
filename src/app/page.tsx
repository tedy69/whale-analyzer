import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import DashboardServer from '@/components/server/DashboardServer';
import DashboardLoading from '@/components/server/DashboardLoading';

export const metadata: Metadata = {
  title: 'Whale Analyzer - AI-Powered Web3 Wallet Analysis & DeFi Risk Assessment',
  description:
    'Analyze Web3 wallets across 9+ blockchains with AI-powered whale detection, DeFi liquidation risk analysis, and real-time portfolio insights. Supports Ethereum, Polygon, BSC, Arbitrum, and more.',
  keywords: [
    'web3 whale analyzer',
    'crypto whale detection',
    'DeFi liquidation risk',
    'multi-chain wallet analysis',
    'ethereum wallet analyzer',
    'polygon wallet tracker',
    'BSC wallet analysis',
    'arbitrum portfolio',
    'on-chain analytics',
    'crypto portfolio tracker',
  ],
  openGraph: {
    title: 'Whale Analyzer - AI-Powered Web3 Wallet Analysis',
    description:
      'Analyze Web3 wallets across 9+ blockchains with AI-powered whale detection and DeFi liquidation risk analysis.',
    url: 'https://whale-analyzer.tedyfazrin.com',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Whale Analyzer Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whale Analyzer - AI-Powered Web3 Wallet Analysis',
    description:
      'Analyze Web3 wallets across 9+ blockchains with AI-powered whale detection and DeFi liquidation risk analysis.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://whale-analyzer.tedyfazrin.com',
  },
};

interface HomePageProps {
  readonly searchParams: Promise<{
    address?: string;
    chain?: string;
    mode?: 'single-chain' | 'multi-chain';
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // If there's an address in search params, redirect to SSR analysis page
  if (params.address) {
    const queryString = new URLSearchParams();
    if (params.chain) queryString.set('chain', params.chain);
    if (params.mode) queryString.set('mode', params.mode);

    const queryStr = queryString.toString();
    const redirectUrl = `/analyze/${params.address}` + (queryStr ? `?${queryStr}` : '');
    redirect(redirectUrl);
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Whale Analyzer',
            description:
              'AI-powered Web3 wallet analysis and DeFi liquidation risk assessment across multiple blockchains',
            url: 'https://whale-analyzer.tedyfazrin.com',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'Multi-chain wallet analysis',
              'AI-powered whale detection',
              'DeFi liquidation risk assessment',
              'Real-time portfolio insights',
              'Cross-chain token tracking',
            ],
            supportedBlockchains: [
              'Ethereum',
              'Polygon',
              'Binance Smart Chain',
              'Arbitrum',
              'Optimism',
              'Avalanche',
              'Fantom',
              'Base',
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
          <Suspense fallback={<DashboardLoading />}>
            <DashboardServer />
          </Suspense>
        </div>
      </div>
    </>
  );
}
