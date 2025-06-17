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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { address } = await params;

  if (!isValidAddress(address)) {
    return {
      title: 'Invalid Address - Whale Analyzer',
      description: 'The provided wallet address is invalid.',
    };
  }

  return {
    title: `Wallet Analysis: ${address.slice(0, 6)}...${address.slice(-4)} - Whale Analyzer`,
    description: `Comprehensive whale detection and DeFi risk analysis for wallet ${address}`,
    openGraph: {
      title: `Wallet Analysis: ${address.slice(0, 6)}...${address.slice(-4)}`,
      description: `AI-powered analysis of wallet activity, whale detection, and liquidation risk assessment`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Wallet Analysis: ${address.slice(0, 6)}...${address.slice(-4)}`,
      description: `AI-powered wallet analysis and risk assessment`,
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
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden'>
      {/* Animated Background Elements */}

        {/* Animated particles */}
        <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-float' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-float animate-delay-2000' />
        <div className='absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-float animate-delay-4000' />
      </div>

      {/* Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none' />

      {/* Main Content */}
      <div className='relative z-10'>
        <Suspense fallback={<WalletAnalysisLoading address={address} />}>
          <WalletAnalysisServer {...analysisParams} />
        </Suspense>
      </div>
    </div>
  );
}
