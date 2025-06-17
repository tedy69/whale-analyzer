'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TokenBalance, Transaction } from '@/types';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface WalletChartsProps {
  tokenBalances: TokenBalance[];
  transactions: Transaction[];
  totalBalance: number;
}

export default function WalletCharts({
  tokenBalances,
  transactions,
  totalBalance,
}: WalletChartsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse'>
        <div className='bg-gray-200 dark:bg-gray-700 rounded-lg h-80'></div>
        <div className='bg-gray-200 dark:bg-gray-700 rounded-lg h-80'></div>
      </div>
    );
  }

  // Portfolio Distribution Chart Data
  const portfolioData = tokenBalances
    .filter((token) => token.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) // Top 10 tokens
    .map((token) => ({
      name: token.symbol,
      value: token.value,
      percentage: ((token.value / totalBalance) * 100).toFixed(1),
    }));

  const portfolioChartOptions = {
    chart: {
      type: 'donut' as const,
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    colors: [
      '#8B5CF6',
      '#06B6D4',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#EC4899',
      '#3B82F6',
      '#6366F1',
      '#14B8A6',
      '#F97316',
    ],
    labels: portfolioData.map((item) => item.name),
    legend: {
      position: 'bottom' as const,
      labels: {
        colors: '#E5E7EB',
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              color: '#E5E7EB',
            },
            value: {
              show: true,
              color: '#E5E7EB',
              formatter: (val: string) => `$${parseFloat(val).toLocaleString()}`,
            },
            total: {
              show: true,
              color: '#E5E7EB',
              label: 'Total',
              formatter: () => `$${totalBalance.toLocaleString()}`,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`,
      },
    },
  };

  // Transaction Activity Chart Data
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const recentTransactions = transactions
    .filter((tx) => new Date(tx.timestamp) >= last30Days)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Group transactions by day
  const dailyActivity = recentTransactions.reduce((acc, tx) => {
    const date = new Date(tx.timestamp).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, count: 0, volume: 0 };
    }
    acc[date].count += 1;
    acc[date].volume += tx.value;
    return acc;
  }, {} as Record<string, { date: string; count: number; volume: number }>);

  const activityData = Object.values(dailyActivity);

  const activityChartOptions = {
    chart: {
      type: 'area' as const,
      background: 'transparent',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    colors: ['#06B6D4', '#8B5CF6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2,
    },
    xaxis: {
      categories: activityData.map((item) => item.date),
      labels: {
        style: {
          colors: '#9CA3AF',
        },
      },
    },
    yaxis: [
      {
        title: {
          text: 'Transaction Count',
          style: {
            color: '#9CA3AF',
          },
        },
        labels: {
          style: {
            colors: '#9CA3AF',
          },
        },
      },
      {
        opposite: true,
        title: {
          text: 'Volume ($)',
          style: {
            color: '#9CA3AF',
          },
        },
        labels: {
          style: {
            colors: '#9CA3AF',
          },
          formatter: (val: number) => `$${val.toLocaleString()}`,
        },
      },
    ],
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3,
    },
    tooltip: {
      theme: 'dark',
      shared: true,
      intersect: false,
    },
    legend: {
      labels: {
        colors: '#E5E7EB',
      },
    },
  };

  const activitySeries = [
    {
      name: 'Transaction Count',
      type: 'column' as const,
      data: activityData.map((item) => item.count),
    },
    {
      name: 'Volume',
      type: 'area' as const,
      yAxisIndex: 1,
      data: activityData.map((item) => item.volume),
    },
  ];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Portfolio Distribution Chart */}
      <div className='bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl'>
        <h3 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
          <span className='w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse'></span>
          Portfolio Distribution
        </h3>
        <div className='h-80'>
          <Chart
            options={portfolioChartOptions}
            series={portfolioData.map((item) => item.value)}
            type='donut'
            height={320}
          />
        </div>
      </div>

      {/* Transaction Activity Chart */}
      <div className='bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl'>
        <h3 className='text-xl font-bold text-white mb-6 flex items-center gap-2'>
          <span className='w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse'></span>
          Activity (Last 30 Days)
        </h3>
        <div className='h-80'>
          <Chart options={activityChartOptions} series={activitySeries} type='line' height={320} />
        </div>
      </div>
    </div>
  );
}
