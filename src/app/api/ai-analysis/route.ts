import { NextRequest, NextResponse } from 'next/server';
import { ServerAIAnalyzer } from '@/lib/server-ai-analyzer';
import { WalletData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const walletData: WalletData = await request.json();

    const analysis = await ServerAIAnalyzer.generateWalletSummary(walletData);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('AI Analysis error:', error);
    return NextResponse.json({ error: 'Failed to generate AI analysis' }, { status: 500 });
  }
}
