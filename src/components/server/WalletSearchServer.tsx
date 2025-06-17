import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import WalletSearchForm from './WalletSearchForm';
import { getSupportedChains, type ChainConfig } from '@/lib/chains';

/**
 * Server-Side Wallet Search Component
 * Renders the search interface with server-side data fetching
 */
export default async function WalletSearchServer() {
  // Fetch supported chains on the server
  let availableChains: ChainConfig[] = [];
  try {
    const chains = await getSupportedChains();
    availableChains = Object.values(chains).filter((chain) => chain.covalentSupported);
  } catch (error) {
    console.error('Failed to load chains on server:', error);
    availableChains = [];
  }

  return (
    <div className='w-full max-w-3xl mx-auto'>
      <Card className='bg-white/98 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-gray-300/80 dark:border-gray-700/50 shadow-2xl animate-scale-in'>
        <CardHeader className='text-center space-y-2 bg-gradient-to-b from-gray-50/80 to-white/20 dark:from-gray-800/50 dark:to-transparent rounded-t-xl'>
          <div className='mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 animate-glow shadow-lg'>
            <Sparkles className='w-8 h-8 text-white animate-pulse' />
          </div>
          <CardTitle className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Web3 Wallet Analyzer
          </CardTitle>
          <p className='text-gray-600 dark:text-gray-400 text-lg font-medium'>
            Server-side rendered analysis with AI-powered insights
          </p>
        </CardHeader>

        <CardContent className='space-y-6 bg-gradient-to-b from-white/40 to-gray-50/60 dark:from-transparent dark:to-transparent'>
          {/* Server-side rendered search form */}
          <WalletSearchForm availableChains={availableChains} />

          {/* Benefits Section */}
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800'>
            <h4 className='font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center'>
              <span className='mr-2'>🚀</span>
              Server-Side Benefits
            </h4>
            <ul className='text-sm text-blue-700 dark:text-blue-400 space-y-1'>
              <li>• ⚡ Faster initial load with pre-rendered data</li>
              <li>• 🔒 Enhanced security with server-side API calls</li>
              <li>• 🔍 SEO-optimized for search engines</li>
              <li>• 📱 Better performance on mobile devices</li>
            </ul>
          </div>

          {/* Demo Wallets Quick Access */}
          <div className='space-y-4'>
            <h4 className='text-center font-semibold text-gray-700 dark:text-gray-300'>
              🎯 Try Demo Wallets
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
              <DemoWalletButton
                label='Vitalik.eth'
                address='0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
                emoji='👑'
              />
              <DemoWalletButton
                label='Binance Hot'
                address='0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503'
                emoji='🏦'
              />
              <DemoWalletButton
                label='Uniswap V3'
                address='0xE592427A0AEce92De3Edee1F18E0157C05861564'
                emoji='🦄'
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Demo wallet button component
interface DemoWalletButtonProps {
  readonly label: string;
  readonly address: string;
  readonly emoji: string;
}

function DemoWalletButton({ label, address, emoji }: DemoWalletButtonProps) {
  return (
    <a
      href={`/analyze/${address}`}
      className='flex items-center space-x-2 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-md group text-sm'>
      <span className='text-lg'>{emoji}</span>
      <div className='flex-1'>
        <p className='font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
          {label}
        </p>
        <p className='text-xs text-gray-500 dark:text-gray-400 font-mono'>
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    </a>
  );
}
