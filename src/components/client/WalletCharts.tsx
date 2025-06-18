'use client';

import { WalletData } from '@/types';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/components/ThemeProvider';
import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';

// Dynamically import ApexCharts with better error handling
const Chart = dynamic(
  () =>
    import('react-apexcharts').catch(() => {
      // If ApexCharts fails to load, return a fallback component
      return {
        default: () => (
          <div className='flex items-center justify-center h-64 text-gray-500'>
            <p>Charts unavailable</p>
          </div>
        ),
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    ),
  },
);

interface WalletChartsProps {
  readonly walletData: WalletData;
}

export default function WalletCharts({ walletData }: WalletChartsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Theme-aware colors
  const getThemeColors = useMemo(() => {
    const isDark = resolvedTheme === 'dark';
    return {
      primary: isDark ? '#3B82F6' : '#1D4ED8',
      success: isDark ? '#10B981' : '#059669',
      warning: isDark ? '#F59E0B' : '#D97706',
      danger: isDark ? '#EF4444' : '#DC2626',
      purple: isDark ? '#8B5CF6' : '#7C3AED',
      orange: isDark ? '#F97316' : '#EA580C',
      cyan: isDark ? '#06B6D4' : '#0891B2',
      lime: isDark ? '#84CC16' : '#65A30D',
      text: isDark ? '#F3F4F6' : '#374151',
      background: isDark ? '#1F2937' : '#FFFFFF',
      gridColor: isDark ? '#374151' : '#E5E7EB',
    };
  }, [resolvedTheme]);

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

    // Theme-aware colors for different chains
    const chainColors = [
      getThemeColors.primary,   // Blue
      getThemeColors.success,   // Green
      getThemeColors.warning,   // Yellow
      getThemeColors.danger,    // Red
      getThemeColors.purple,    // Purple
      getThemeColors.orange,    // Orange
      getThemeColors.cyan,      // Cyan
      getThemeColors.lime,      // Lime
    ];

    return {
      series: activeChains.map((chain) => chain.totalValue),
      labels: activeChains.map((chain) => chain.chainName),
      colors: activeChains.map((_, index) => chainColors[index % chainColors.length]),
    };
  }, [walletData.chains, getThemeColors]);

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
          ? [getThemeColors.success]
          : walletData.whaleScore >= 50
          ? [getThemeColors.warning]
          : [getThemeColors.danger],
    };
  }, [walletData.whaleScore, getThemeColors]);

  const commonChartOptions = useMemo(() => {
    const themeMode: 'light' | 'dark' = resolvedTheme === 'dark' ? 'dark' : 'light';
    
    return {
      chart: {
        toolbar: { show: false },
        background: 'transparent',
      },
      theme: {
        mode: themeMode,
      },
      legend: {
        position: 'bottom' as const,
        labels: {
          colors: getThemeColors.text,
        },
      },
      grid: {
        borderColor: getThemeColors.gridColor,
      },
      xaxis: {
        labels: {
          style: {
            colors: getThemeColors.text,
          },
        },
        axisBorder: {
          color: getThemeColors.gridColor,
        },
        axisTicks: {
          color: getThemeColors.gridColor,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: getThemeColors.text,
          },
        },
      },
      tooltip: {
        theme: themeMode,
      },
    };
  }, [resolvedTheme, getThemeColors]);

  // Don't render charts on server or before hydration
  if (!isMounted) {
    return (
      <div className='space-y-6'>
        <h3 className='text-lg font-semibold'>Portfolio Analytics</h3>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <Card className='p-6'>
            <div className='flex items-center justify-center h-64'>
              <div className='animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-48 w-full'></div>
            </div>
          </Card>
          <Card className='p-6'>
            <div className='flex items-center justify-center h-64'>
              <div className='animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-48 w-full'></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
                colors: [getThemeColors.primary],
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
          <h5 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Total Balance</h5>
          <p className='text-xl font-bold'>${walletData.totalBalance.toLocaleString()}</p>
        </Card>
        <Card className='p-4 text-center'>
          <h5 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Active Chains</h5>
          <p className='text-xl font-bold'>{walletData.crossChainMetrics?.totalChains ?? 0}</p>
        </Card>
        <Card className='p-4 text-center'>
          <h5 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Total Tokens</h5>
          <p className='text-xl font-bold'>{walletData.tokenBalances?.length ?? 0}</p>
        </Card>
        <Card className='p-4 text-center'>
          <h5 className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Transactions</h5>
          <p className='text-xl font-bold'>{walletData.transactions?.length ?? 0}</p>
        </Card>
      </div>
    </div>
  );
}
