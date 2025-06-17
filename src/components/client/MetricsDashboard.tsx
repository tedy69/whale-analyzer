'use client';

import { WalletData, WhaleMetrics } from '@/types';
import { useState, useEffect } from 'react';

interface MetricsDashboardProps {
  walletData: WalletData;
  whaleMetrics: WhaleMetrics;
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function AnimatedCounter({ value, duration = 2000, prefix = '', suffix = '', decimals = 0 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = value * easeOutQuart;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
      {prefix}{displayValue.toLocaleString(undefined, { 
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals 
      })}{suffix}
    </span>
  );
}

function WhaleIndicator({ score }: { score: number }) {
  const getWhaleLevel = (score: number) => {
    if (score >= 90) return { emoji: '🐋', text: 'Legendary Whale', color: 'from-purple-400 via-pink-400 to-red-400' };
    if (score >= 80) return { emoji: '🐋', text: 'Mega Whale', color: 'from-blue-400 via-purple-400 to-pink-400' };
    if (score >= 60) return { emoji: '🐋', text: 'Whale', color: 'from-cyan-400 via-blue-400 to-purple-400' };
    if (score >= 40) return { emoji: '🐠', text: 'Big Fish', color: 'from-green-400 via-cyan-400 to-blue-400' };
    if (score >= 20) return { emoji: '🐟', text: 'Fish', color: 'from-yellow-400 via-green-400 to-cyan-400' };
    return { emoji: '🦐', text: 'Shrimp', color: 'from-gray-400 via-yellow-400 to-green-400' };
  };

  const whale = getWhaleLevel(score);

  return (
    <div className="flex items-center gap-3">
      <div className="text-4xl animate-bounce">{whale.emoji}</div>
      <div>
        <div className={`text-xl font-bold bg-gradient-to-r ${whale.color} bg-clip-text text-transparent`}>
          {whale.text}
        </div>
        <div className="text-sm text-gray-400">
          Whale Score: <AnimatedCounter value={score} suffix="/100" />
        </div>
      </div>
    </div>
  );
}

function RiskIndicator({ risk }: { risk: string }) {
  const getRiskConfig = (risk: string) => {
    switch (risk.toUpperCase()) {
      case 'CRITICAL':
        return { 
          color: 'from-red-500 to-red-600', 
          bgColor: 'from-red-500/20 to-red-600/20',
          icon: '🚨',
          text: 'Critical Risk'
        };
      case 'HIGH':
        return { 
          color: 'from-orange-500 to-red-500', 
          bgColor: 'from-orange-500/20 to-red-500/20',
          icon: '⚠️',
          text: 'High Risk'
        };
      case 'MEDIUM':
        return { 
          color: 'from-yellow-500 to-orange-500', 
          bgColor: 'from-yellow-500/20 to-orange-500/20',
          icon: '🔔',
          text: 'Medium Risk'
        };
      case 'LOW':
        return { 
          color: 'from-green-500 to-emerald-500', 
          bgColor: 'from-green-500/20 to-emerald-500/20',
          icon: '✅',
          text: 'Low Risk'
        };
      default:
        return { 
          color: 'from-gray-500 to-gray-600', 
          bgColor: 'from-gray-500/20 to-gray-600/20',
          icon: '❓',
          text: 'Unknown Risk'
        };
    }
  };

  const riskConfig = getRiskConfig(risk);

  return (
    <div className={`bg-gradient-to-r ${riskConfig.bgColor} rounded-xl p-4 border border-white/10`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{riskConfig.icon}</div>
        <div>
          <div className={`text-lg font-bold bg-gradient-to-r ${riskConfig.color} bg-clip-text text-transparent`}>
            {riskConfig.text}
          </div>
          <div className="text-sm text-gray-400">Liquidation Risk Level</div>
        </div>
      </div>
    </div>
  );
}

export default function MetricsDashboard({ walletData, whaleMetrics }: MetricsDashboardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Portfolio Value */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Total Portfolio</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">💰</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            $<AnimatedCounter value={walletData.totalBalance} decimals={2} />
          </div>
          <div className="text-xs text-gray-500">Across all chains</div>
        </div>

        {/* Token Count */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Token Holdings</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🪙</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            <AnimatedCounter value={walletData.tokenBalances.length} />
          </div>
          <div className="text-xs text-gray-500">Different tokens</div>
        </div>

        {/* Transaction Count */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Transactions</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📊</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            <AnimatedCounter value={walletData.transactions.length} />
          </div>
          <div className="text-xs text-gray-500">Recent activity</div>
        </div>

        {/* Whale Score */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl group hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Whale Score</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🐋</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            <AnimatedCounter value={whaleMetrics.score} suffix="/100" />
          </div>
          <div className="text-xs text-gray-500">
            {whaleMetrics.score >= 90 ? 'Legendary Whale' :
             whaleMetrics.score >= 80 ? 'Mega Whale' :
             whaleMetrics.score >= 60 ? 'Whale' :
             whaleMetrics.score >= 40 ? 'Big Fish' :
             whaleMetrics.score >= 20 ? 'Fish' : 'Shrimp'}
          </div>
        </div>
      </div>

      {/* Whale Status and Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Whale Status */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></span>
            Whale Analysis
          </h3>
          <WhaleIndicator score={whaleMetrics.score} />
          
          {/* Whale Metrics - simplified since metrics property doesn't exist */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Total Value</span>
              <span className="text-white font-medium">
                ${whaleMetrics.totalValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Large Transactions</span>
              <span className="text-white font-medium">
                {whaleMetrics.largeTransactions}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Unique Tokens</span>
              <span className="text-white font-medium">
                {whaleMetrics.uniqueTokens}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-pulse"></span>
            Risk Assessment
          </h3>
          <RiskIndicator risk={walletData.liquidationRisk.riskLevel} />
          
          {/* Risk Details */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Health Factor</span>
              <span className="text-white font-medium">
                {walletData.liquidationRisk.healthFactor.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Total Collateral</span>
              <span className="text-white font-medium">
                ${walletData.liquidationRisk.totalCollateral.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Total Borrowed</span>
              <span className="text-white font-medium">
                ${walletData.liquidationRisk.totalBorrowed.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
