import { NextResponse } from 'next/server';
import { MultiProviderManager } from '@/lib/providers/multi-provider';

export async function GET() {
  try {
    const healthStatus = await MultiProviderManager.healthCheck();
    return NextResponse.json(healthStatus);
  } catch (error) {
    console.error('Provider health check error:', error);
    return NextResponse.json({ error: 'Failed to perform health check' }, { status: 500 });
  }
}
