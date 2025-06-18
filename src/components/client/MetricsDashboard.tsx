'use client';

import { WalletData } from '@/types';

interface MetricsDashboardProps {
  readonly walletData: WalletData;
}

export default function MetricsDashboard({ walletData }: MetricsDashboardProps) {
  // Calculate total balance from token balances if totalBalance is 0
  const calculatedBalance = walletData.totalBalance > 0 
    ? walletData.totalBalance 
    : walletData.tokenBalances.reduce((sum, token) => sum + (token.value || 0), 0);

  return (
    <div className='space-y-6'>
      <h3 className='text-3xl font-bold gradient-text mb-6 text-center'>Portfolio Overview</h3>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='glass-card p-6 text-center card-hover border-0'>
          <div className='text-2xl mb-2'>💰</div>
          <div className='text-2xl font-bold gradient-text mb-1'>
            ${calculatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className='text-sm text-muted-foreground'>Total Portfolio Value</div>
        </div>
        
        <div className='glass-card p-6 text-center card-hover border-0'>
          <div className='text-2xl mb-2'>🌐</div>
          <div className='text-2xl font-bold gradient-text mb-1'>{walletData.crossChainMetrics.totalChains}</div>
          <div className='text-sm text-muted-foreground'>Active Chains</div>
        </div>
        
        <div className='glass-card p-6 text-center card-hover border-0'>
          <div className='text-2xl mb-2'>🪙</div>
          <div className='text-2xl font-bold gradient-text mb-1'>{walletData.tokenBalances.length}</div>
          <div className='text-sm text-muted-foreground'>Token Holdings</div>
        </div>
        
        <div className='glass-card p-6 text-center card-hover border-0'>
          <div className='text-2xl mb-2'>📈</div>
          <div className='text-2xl font-bold gradient-text mb-1'>{walletData.transactions.length}</div>
          <div className='text-sm text-muted-foreground'>Transactions</div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='glass-card p-6 text-center card-hover border-0'>
          <div className='text-xl mb-2'>🐋</div>
          <div className='text-xl font-bold gradient-whale mb-1'>
            {(walletData.whaleScore * 100).toFixed(1)}%
          </div>
          <div className='text-sm text-muted-foreground'>Whale Score</div>
        </div>
        
        <div className='glass-card p-6 text-center card-hover border-0'>
          <div className='text-xl mb-2'>⚠️</div>
          <div className='text-xl font-bold gradient-crypto mb-1'>
            {walletData.liquidationRisk.riskLevel}
          </div>
          <div className='text-sm text-muted-foreground'>Risk Level</div>
        </div>
        
        <div className='glass-card p-6 text-center card-hover border-0'>
          <div className='text-xl mb-2'>💎</div>
          <div className='text-xl font-bold gradient-text mb-1'>
            {walletData.crossChainMetrics.dominantChain || 'Multi-Chain'}
          </div>
          <div className='text-sm text-muted-foreground'>Primary Chain</div>
        </div>
      </div>
    </div>
  );
}
