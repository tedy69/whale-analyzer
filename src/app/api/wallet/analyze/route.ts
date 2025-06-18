import { NextRequest, NextResponse } from 'next/server';
import { MultiChainWalletAnalyzer } from '@/lib/multi-chain-analyzer';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    const walletData = await MultiChainWalletAnalyzer.analyzeWallet(address);

    return NextResponse.json(walletData);
  } catch (error) {
    console.error('Wallet analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze wallet' }, { status: 500 });
  }
}
