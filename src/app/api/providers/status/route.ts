import { NextResponse } from 'next/server';
import { MultiProviderManager } from '@/lib/providers/multi-provider';

export async function GET() {
  try {
    const status = MultiProviderManager.getProviderStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Provider status error:', error);
    return NextResponse.json({ error: 'Failed to get provider status' }, { status: 500 });
  }
}
