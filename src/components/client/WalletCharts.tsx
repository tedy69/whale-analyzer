'use client';

import { WalletData } from '@/types';

interface WalletChartsProps {
  readonly walletData: WalletData;
}

export default function WalletCharts({ walletData }: WalletChartsProps) {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>Wallet Charts</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='p-4 border rounded-lg'>
          <h4 className='font-medium mb-2'>Total Balance</h4>
          <p className='text-2xl font-bold'>${walletData.totalBalance.toLocaleString()}</p>
        </div>
        <div className='p-4 border rounded-lg'>
          <h4 className='font-medium mb-2'>Whale Score</h4>
          <p className='text-2xl font-bold'>{walletData.whaleScore}/100</p>
        </div>
      </div>
    </div>
  );
}
