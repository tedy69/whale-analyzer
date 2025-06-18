import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

interface WalletAnalysisLoadingProps {
  address: string;
}

export default function WalletAnalysisLoading({ address }: WalletAnalysisLoadingProps) {
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className='container mx-auto px-4 pt-8'>
      {/* Navigation Bar */}
      <nav className='flex items-center justify-between mb-8 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl animate-slide-in-up'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-glow'>
            <span className='text-white font-bold text-lg'>🐋</span>
          </div>
          <div>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Whale Analyzer
            </h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>AI-Powered Web3 Analytics</p>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
            <span>Analyzing...</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Loading Header */}
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
          Analyzing Wallet
        </h2>
        <p className='text-lg text-gray-600 dark:text-gray-300 mb-4'>{truncatedAddress}</p>
        {/* Loading Progress Indicator */}
        <div className='max-w-2xl mx-auto'>
          <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30'>
            <CardContent className='p-6'>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-4 h-4 bg-green-500 rounded-full animate-pulse' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Fetching wallet data...
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Loader2 className='w-4 h-4 animate-spin text-blue-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    Analyzing transactions...
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full' />
                  <span className='text-sm text-gray-400'>Generating AI insights...</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full' />
                  <span className='text-sm text-gray-400'>Calculating risk assessment...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading Cards Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8'>
        {/* Portfolio Overview Loading */}
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30'>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-32 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='w-full h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            <div className='grid grid-cols-2 gap-4'>
              <div className='w-full h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-full h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            </div>
            <div className='w-3/4 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
          </CardContent>
        </Card>

        {/* Whale Score Loading */}
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30'>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-28 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-center'>
              <div className='w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse' />
            </div>
            <div className='w-full h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            <div className='w-2/3 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto' />
          </CardContent>
        </Card>

        {/* Risk Assessment Loading */}
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30'>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-36 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='w-full h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            <div className='space-y-2'>
              <div className='w-full h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-5/6 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-4/5 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Loading */}
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30'>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2'>
              <div className='w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-32 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='w-full h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            <div className='space-y-2'>
              <div className='w-full h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-11/12 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-10/12 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
              <div className='w-9/12 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
