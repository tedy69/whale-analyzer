import { NextRequest, NextResponse } from 'next/server';
import { MultiChainWalletAnalyzer } from '@/lib/multi-chain-analyzer';

// Set max duration for Vercel edge runtime (max 30 seconds for free tier)
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Create a timeout promise to prevent Vercel timeout
    const timeoutPromise = new Promise(
      (_, reject) => setTimeout(() => reject(new Error('Analysis timeout')), 25000), // 25 seconds
    );

    // Race between analysis and timeout
    const walletData = await Promise.race([
      MultiChainWalletAnalyzer.analyzeWallet(address),
      timeoutPromise,
    ]);

    return NextResponse.json(walletData);
  } catch (error) {
    console.error('Wallet analysis error:', error);

    // Handle timeout specifically
    if (error instanceof Error && error.message === 'Analysis timeout') {
      return NextResponse.json(
        {
          error: 'Analysis is taking longer than expected. Please try again.',
          timeout: true,
        },
        { status: 408 },
      );
    }

    return NextResponse.json({ error: 'Failed to analyze wallet' }, { status: 500 });
  }
}
