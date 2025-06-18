'use client';

import { WalletData } from '@/types';
import { Card } from '@/components/ui/card';

interface SimpleWalletChartsProps {
  readonly walletData: WalletData;
}

export default function SimpleWalletCharts({ walletData }: SimpleWalletChartsProps) {
  // Calculate portfolio distribution
  const topTokens =
    walletData.tokenBalances
      ?.filter((token) => token.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) ?? [];

  const totalValue = topTokens.reduce((sum, token) => sum + token.value, 0);

  // Calculate whale tier
  const getWhaleTier = (score: number) => {
    if (score >= 80) return { name: '🐋 Legendary Whale', color: 'bg-purple-500' };
    if (score >= 60) return { name: '🐋 Mega Whale', color: 'bg-blue-500' };
    if (score >= 40) return { name: '🐋 Whale', color: 'bg-green-500' };
    if (score >= 20) return { name: '🐬 Dolphin', color: 'bg-yellow-500' };
    return { name: '🐟 Fish', color: 'bg-gray-500' };
  };

  const whaleTier = getWhaleTier(walletData.whaleScore ?? 0);

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>Portfolio Analytics</h3>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Portfolio Summary */}
        <Card className='p-6'>
          <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            💰 Portfolio Summary
          </h4>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span>Total Value:</span>
              <span className='font-bold text-xl text-green-600'>
                ${walletData.totalBalance?.toLocaleString() ?? '0'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Total Tokens:</span>
              <span className='font-bold'>{walletData.tokenBalances?.length ?? 0}</span>
            </div>
            <div className='flex justify-between'>
              <span>Active Chains:</span>
              <span className='font-bold'>{walletData.crossChainMetrics?.totalChains ?? 0}</span>
            </div>
            <div className='flex justify-between'>
              <span>Transactions:</span>
              <span className='font-bold'>{walletData.transactions?.length ?? 0}</span>
            </div>
          </div>
        </Card>

        {/* Whale Score */}
        <Card className='p-6'>
          <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'>🎯 Whale Analysis</h4>
          <div className='space-y-4'>
            <div className='text-center'>
              <div className='text-3xl font-bold mb-2'>{walletData.whaleScore ?? 0}/100</div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-white text-sm ${whaleTier.color}`}>
                {whaleTier.name}
              </div>
            </div>
            {/* Score Progress Bar */}
            <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
              <div
                className={`h-full rounded-full ${whaleTier.color} transition-all duration-500`}
                style={{ width: `${Math.min(walletData.whaleScore ?? 0, 100)}%` }}
              />
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400 text-center'>
              Score based on portfolio value, transaction volume, and DeFi activity
            </div>
          </div>
        </Card>
      </div>

      {/* Token Distribution */}
      <Card className='p-6'>
        <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'>📊 Token Holdings</h4>
        <div className='space-y-3'>
          {topTokens.length > 0 ? (
            topTokens.map((token, index) => {
              const percentage = totalValue > 0 ? (token.value / totalValue) * 100 : 0;
              return (
                <div key={token.symbol || index} className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>{token.symbol || 'Unknown'}</span>
                    <div className='text-right'>
                      <div className='font-bold'>${token.value?.toLocaleString() ?? '0'}</div>
                      <div className='text-sm text-gray-500'>{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
                    <div
                      className='bg-blue-500 h-full rounded-full transition-all duration-500'
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className='text-gray-500 text-center py-4'>No tokens found</p>
          )}
        </div>
      </Card>

      {/* Chain Distribution */}
      {walletData.chains && walletData.chains.length > 0 && (
        <Card className='p-6'>
          <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            🌐 Multi-Chain Activity
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {walletData.chains
              .filter((chain) => chain.totalValue > 0)
              .map((chain, index) => (
                <div
                  key={chain.chainId || index}
                  className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                  <div className='font-medium text-sm'>{chain.chainName}</div>
                  <div className='font-bold text-lg'>
                    ${chain.totalValue?.toLocaleString() ?? '0'}
                  </div>
                  <div className='text-sm text-gray-500'>{chain.tokenCount ?? 0} tokens</div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      {walletData.transactions && walletData.transactions.length > 0 && (
        <Card className='p-6'>
          <h4 className='text-lg font-semibold mb-4 flex items-center gap-2'>📈 Recent Activity</h4>
          <div className='space-y-2'>
            {walletData.transactions.slice(0, 5).map((tx, index) => (
              <div
                key={tx.hash || index}
                className='flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0'>
                <div className='text-sm'>
                  <div className='font-mono text-xs text-gray-500'>
                    {tx.hash
                      ? `${tx.hash.slice(0, 10)}...${tx.hash.slice(-6)}`
                      : `Transaction ${index + 1}`}
                  </div>
                  <div className='text-xs text-gray-400'>
                    {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : 'Unknown date'}
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-sm font-medium'>
                    {tx.value ? `$${tx.value.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
