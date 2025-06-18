'use client';

import { WalletData } from '@/types';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface WalletChartsProps {
  readonly walletData: WalletData;
}

export default function WalletCharts({ walletData }: WalletChartsProps) {
  // Portfolio Distribution Pie Chart
  const portfolioData = useMemo(() => {
    const topTokens = walletData.tokenBalances
      .filter((token) => token.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 tokens

    const others = walletData.tokenBalances
      .filter((token) => token.value > 0)
      .slice(8)
      .reduce((sum, token) => sum + token.value, 0);

    const series = topTokens.map((token) => token.value);
    const labels = topTokens.map((token) => token.symbol);

    if (others > 0) {
      series.push(others);
      labels.push('Others');
    }

    return { series, labels };
  }, [walletData.tokenBalances]);

  // Chain Distribution Donut Chart
  const chainData = useMemo(() => {
    const activeChains = walletData.chains?.filter((chain) => chain.totalValue > 0) ?? [];

    // Predefined colors for different chains
    const chainColors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#F97316', // Orange
      '#06B6D4', // Cyan
      '#84CC16', // Lime
    ];

    return {
      series: activeChains.map((chain) => chain.totalValue),
      labels: activeChains.map((chain) => chain.chainName),
      colors: activeChains.map((_, index) => chainColors[index % chainColors.length]),
    };
  }, [walletData.chains]);

  // Transaction Activity Area Chart
  const transactionData = useMemo(() => {
    if (!walletData.transactions?.length) return { series: [], categories: [] };

    // Group transactions by day
    const dailyActivity = walletData.transactions.reduce((acc, tx) => {
      const date = new Date(tx.timestamp).toISOString().split('T')[0];
      acc[date] = (acc[date] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const series = last30Days.map((date) => dailyActivity[date] ?? 0);
    const categories = last30Days.map((date) => new Date(date).toLocaleDateString());

    return { series, categories };
  }, [walletData.transactions]);

  // Whale Score Radial Chart
  const whaleScoreData = useMemo(() => {
    return {
      series: [walletData.whaleScore],
      colors:
        walletData.whaleScore >= 80
          ? ['#10B981']
          : walletData.whaleScore >= 50
          ? ['#F59E0B']
          : ['#EF4444'],
    };
  }, [walletData.whaleScore]);

  const commonChartOptions = {
    chart: {
      toolbar: { show: false },
      background: 'transparent',
    },
    theme: {
      mode: 'light' as const,
    },
    legend: {
      position: 'bottom' as const,
    },
  };

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold'>Portfolio Analytics</h3>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Portfolio Distribution */}
        <Card className='p-6'>
          <h4 className='font-medium mb-4'>Token Distribution</h4>
          {portfolioData.series.length > 0 ? (
            <Chart
              options={{
                ...commonChartOptions,
                labels: portfolioData.labels,
                plotOptions: {
                  pie: {
                    donut: {
                      size: '65%',
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: 'Total Value',
                          formatter: () => `$${walletData.totalBalance.toLocaleString()}`,
                        },
                      },
                    },
                  },
                },
                dataLabels: {
                  enabled: true,
                  formatter: (val: number) => `${val.toFixed(1)}%`,
                },
                tooltip: {
                  y: {
                    formatter: (val: number) => `$${val.toLocaleString()}`,
                  },
                },
              }}
              series={portfolioData.series}
              type='donut'
              height={300}
            />
          ) : (
            <div className='flex items-center justify-center h-[300px] text-gray-500'>
              No token data available
            </div>
          )}
        </Card>

        {/* Chain Distribution */}
        <Card className='p-6'>
          <h4 className='font-medium mb-4'>Chain Distribution</h4>
          {chainData.series.length > 0 ? (
            <Chart
              options={{
                ...commonChartOptions,
                labels: chainData.labels,
                colors: chainData.colors,
                plotOptions: {
                  pie: {
                    donut: {
                      size: '65%',
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: 'Chains',
                          formatter: () => `${chainData.series.length}`,
                        },
                      },
                    },
                  },
                },
                dataLabels: {
                  enabled: true,
                  formatter: (val: number) => `${val.toFixed(1)}%`,
                },
                tooltip: {
                  y: {
                    formatter: (val: number) => `$${val.toLocaleString()}`,
                  },
                },
              }}
              series={chainData.series}
              type='donut'
              height={300}
            />
          ) : (
            <div className='flex items-center justify-center h-[300px] text-gray-500'>
              No chain data available
            </div>
          )}
        </Card>

        {/* Transaction Activity */}
        <Card className='p-6'>
          <h4 className='font-medium mb-4'>Transaction Activity (30 Days)</h4>
          {transactionData.series.length > 0 ? (
            <Chart
              options={{
                ...commonChartOptions,
                xaxis: {
                  categories: transactionData.categories,
                  labels: {
                    rotate: -45,
                    style: { fontSize: '12px' },
                  },
                },
                yaxis: {
                  title: { text: 'Transactions' },
                },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.1,
                  },
                },
                stroke: {
                  curve: 'smooth' as const,
                  width: 2,
                },
                colors: ['#3B82F6'],
                dataLabels: { enabled: false },
                tooltip: {
                  y: {
                    formatter: (val: number) => `${val} transactions`,
                  },
                },
              }}
              series={[
                {
                  name: 'Transactions',
                  data: transactionData.series,
                },
              ]}
              type='area'
              height={300}
            />
          ) : (
            <div className='flex items-center justify-center h-[300px] text-gray-500'>
              No transaction data available
            </div>
          )}
        </Card>

        {/* Whale Score */}
        <Card className='p-6'>
          <h4 className='font-medium mb-4'>Whale Score</h4>
          <Chart
            options={{
              ...commonChartOptions,
              plotOptions: {
                radialBar: {
                  hollow: {
                    size: '60%',
                  },
                  dataLabels: {
                    show: true,
                    name: {
                      show: true,
                      fontSize: '16px',
                      fontWeight: 600,
                      offsetY: -10,
                    },
                    value: {
                      show: true,
                      fontSize: '24px',
                      fontWeight: 700,
                      formatter: (val: number) => `${val}/100`,
                    },
                  },
                },
              },
              colors: whaleScoreData.colors,
              labels: ['Whale Score'],
              fill: {
                type: 'gradient',
                gradient: {
                  shade: 'dark',
                  type: 'horizontal',
                  shadeIntensity: 0.5,
                  gradientToColors: whaleScoreData.colors,
                  inverseColors: true,
                  opacityFrom: 1,
                  opacityTo: 1,
                },
              },
            }}
            series={whaleScoreData.series}
            type='radialBar'
            height={300}
          />
        </Card>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='p-4 text-center'>
          <h5 className='text-sm font-medium text-gray-600 mb-1'>Total Balance</h5>
          <p className='text-xl font-bold'>${walletData.totalBalance.toLocaleString()}</p>
        </Card>
        <Card className='p-4 text-center'>
          <h5 className='text-sm font-medium text-gray-600 mb-1'>Active Chains</h5>
          <p className='text-xl font-bold'>{walletData.crossChainMetrics?.totalChains ?? 0}</p>
        </Card>
        <Card className='p-4 text-center'>
          <h5 className='text-sm font-medium text-gray-600 mb-1'>Total Tokens</h5>
          <p className='text-xl font-bold'>{walletData.tokenBalances?.length ?? 0}</p>
        </Card>
        <Card className='p-4 text-center'>
          <h5 className='text-sm font-medium text-gray-600 mb-1'>Transactions</h5>
          <p className='text-xl font-bold'>{walletData.transactions?.length ?? 0}</p>
        </Card>
      </div>
    </div>
  );
}
