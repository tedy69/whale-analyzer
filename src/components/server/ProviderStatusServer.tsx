/**
 * Server-Side Provider Status Component
   if (error || !providerStatus) {
    return (
      <div className='text-center py-6'>
        <div className='text-red-600 dark:text-red-400 mb-2'>⚠️ Status Check Failed</div>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {error ?? 'Unable to check provider status'}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {providerStatus.map((provider: ProviderData, index: number) => (
        <ProviderStatusCard key={provider.name ?? index} provider={provider} />
      ))}chain provider status
 */

interface ProviderData {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime?: number;
  lastChecked?: string;
  features?: string[];
}

// Simple provider status for display purposes
function getProviderStatus(): ProviderData[] {
  const providers: ProviderData[] = [
    {
      name: 'covalent',
      status: process.env.COVALENT_API_KEY ? 'operational' : 'down',
      responseTime: 250,
      lastChecked: new Date().toISOString(),
      features: ['Multi-chain', 'DeFi', 'NFTs'],
    },
    {
      name: 'openai',
      status: process.env.OPENAI_API_KEY ? 'operational' : 'down',
      responseTime: 500,
      lastChecked: new Date().toISOString(),
      features: ['AI Analysis', 'Risk Assessment'],
    },
  ];

  return providers;
}

export default async function ProviderStatusServer() {
  let providerStatus: ProviderData[] = [];
  let error: string | null = null;

  try {
    providerStatus = getProviderStatus();
  } catch (err) {
    console.error('Failed to get provider status:', err);
    error = err instanceof Error ? err.message : 'Failed to get provider status';
  }

  if (error || !providerStatus) {
    return (
      <div className='text-center py-6'>
        <div className='text-red-600 dark:text-red-400 mb-2'>⚠️ Status Check Failed</div>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {error ?? 'Unable to check provider status'}
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {providerStatus.map((provider: ProviderData, index: number) => (
        <ProviderStatusCard key={provider.name ?? index} provider={provider} />
      ))}
    </div>
  );
}

// Provider status card component
interface ProviderStatusCardProps {
  readonly provider: {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    responseTime?: number;
    lastChecked?: string;
    features?: string[];
  };
}

function ProviderStatusCard({ provider }: ProviderStatusCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 dark:text-green-400';
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return '✅';
      case 'degraded':
        return '⚠️';
      case 'down':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
      <div className='flex items-center justify-between mb-2'>
        <h4 className='font-semibold text-gray-900 dark:text-gray-100'>{provider.name}</h4>
        <span className='text-lg'>{getStatusIcon(provider.status)}</span>
      </div>

      <div className='space-y-1'>
        <p className={`text-sm font-medium capitalize ${getStatusColor(provider.status)}`}>
          {provider.status}
        </p>

        {provider.responseTime && (
          <p className='text-xs text-gray-600 dark:text-gray-400'>
            Response: {provider.responseTime}ms
          </p>
        )}

        {provider.lastChecked && (
          <p className='text-xs text-gray-600 dark:text-gray-400'>
            Last checked: {new Date(provider.lastChecked).toLocaleTimeString()}
          </p>
        )}

        {provider.features && provider.features.length > 0 && (
          <div className='mt-2'>
            <p className='text-xs text-gray-500 dark:text-gray-500'>Features:</p>
            <div className='flex flex-wrap gap-1 mt-1'>
              {provider.features.slice(0, 2).map((feature, index) => (
                <span
                  key={`${provider.name}-${feature}-${index}`}
                  className='text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded'>
                  {feature}
                </span>
              ))}
              {provider.features.length > 2 && (
                <span className='text-xs text-gray-500 dark:text-gray-500'>
                  +{provider.features.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
