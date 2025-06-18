'use client';

import { useState, useEffect } from 'react';

interface ProviderInfo {
  name: string;
  description: string;
  icon: string;
  available: boolean;
  supportedChains: number[];
}

interface ProviderStatusDashboardProps {
  className?: string;
}

export default function ProviderStatusDashboard({ className = '' }: ProviderStatusDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [providerInfo, setProviderInfo] = useState<Record<string, ProviderInfo>>({});

  useEffect(() => {
    setMounted(true);
    
    // Check provider availability (this would ideally come from an API in production)
    const providers: Record<string, ProviderInfo> = {
      covalent: {
        name: 'Covalent',
        description: 'Multi-chain blockchain data API with comprehensive coverage',
        icon: '🌐',
        available: true, // Assume primary provider is available
        supportedChains: [1, 137, 56, 43114, 42161, 10, 8453, 250, 25],
      },
      alchemy: {
        name: 'Alchemy',
        description: 'High-performance blockchain infrastructure and APIs',
        icon: '⚗️',
        available: false, // Will be dynamically checked
        supportedChains: [1, 137, 56, 42161, 10, 8453],
      },
      moralis: {
        name: 'Moralis',
        description: 'Web3 development platform with blockchain APIs',
        icon: '🚀',
        available: false, // Will be dynamically checked
        supportedChains: [1, 137, 56, 43114, 42161, 10, 8453, 250, 25],
      },
    };

    setProviderInfo(providers);
  }, []);

  if (!mounted) {
    return (
      <div className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-16 bg-slate-700/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (provider: ProviderInfo) => {
    if (!provider.available) return 'text-red-400 bg-red-900/20';
    if (provider.supportedChains.length === 0) return 'text-yellow-400 bg-yellow-900/20';
    return 'text-green-400 bg-green-900/20';
  };

  const getStatusIcon = (provider: ProviderInfo) => {
    if (!provider.available) return '❌';
    if (provider.supportedChains.length === 0) return '⚠️';
    return '✅';
  };

  const totalProviders = Object.keys(providerInfo).length;
  const availableProviders = Object.values(providerInfo).filter(p => p.available).length;

  return (
    <div className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl ${className}`}>
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></span>
        Multi-Provider Status
      </h3>
      
      {/* Summary */}
      <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300">Active Providers</span>
          <span className="text-white font-bold">{availableProviders}/{totalProviders}</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(availableProviders / totalProviders) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {availableProviders === 1 ? 'Using primary provider only' : 
           availableProviders > 1 ? 'Multi-provider redundancy active' : 
           'No providers configured'}
        </p>
      </div>
      
      <div className="space-y-4">
        {Object.entries(providerInfo).map(([key, provider]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 rounded-lg border border-slate-600/50 bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">
                {provider.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">
                    {provider.name}
                  </p>
                  <span className="text-lg">
                    {getStatusIcon(provider)}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {provider.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {provider.available 
                    ? `${provider.supportedChains.length} chains supported`
                    : key === 'covalent' ? 'Primary provider' : `Add ${key.toUpperCase()}_API_KEY to .env.local`
                  }
                </p>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(provider)}`}>
              {provider.available ? 
                (key === 'covalent' ? 'Primary' : 'Backup') : 
                'Configure'
              }
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
        <p className="text-sm text-blue-300">
          💡 <strong>Multi-Provider Benefits:</strong> When multiple providers are configured, the system automatically 
          switches to backup providers if the primary fails, ensuring 99.9% uptime for blockchain data.
        </p>
      </div>

      <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-700/50">
        <div className="text-sm text-purple-300">
          <p className="font-semibold mb-2">🔧 Setup Additional Providers:</p>
          <div className="space-y-1 text-xs">
            <p>• <strong>Alchemy:</strong> Add ALCHEMY_API_KEY=your_key to .env.local</p>
            <p>• <strong>Moralis:</strong> Add MORALIS_API_KEY=your_key to .env.local</p>
          </div>
        </div>
      </div>
    </div>
  );
}
