import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className='container mx-auto px-4 pt-8'>
      {/* Navigation Bar */}
      <nav className='flex items-center justify-between mb-8 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse'>
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
            <Loader2 className='w-3 h-3 animate-spin' />
            <span>Loading...</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className='text-center mb-12'>
        <h2 className='text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4'>
          Web3 Whale & Risk Analyzer
        </h2>
        <p className='text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto'>
          Server-side rendered wallet analysis with AI-powered insights
        </p>

        {/* Loading Feature Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-gray-700/30 shadow-lg'>
              <div className='w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse mx-auto mb-3' />
              <div className='w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto mb-2' />
              <div className='w-full h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
            </div>
          ))}
        </div>
      </div>

      {/* Loading Search Interface */}
      <div className='flex justify-center mb-12'>
        <div className='w-full max-w-3xl mx-auto'>
          <Card className='bg-white/98 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-gray-300/80 dark:border-gray-700/50 shadow-2xl'>
            <CardHeader className='text-center space-y-2'>
              <div className='mx-auto w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-2xl animate-pulse' />
              <div className='w-48 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto' />
              <div className='w-64 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto' />
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='w-full h-14 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse' />
              <div className='w-full h-14 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse' />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Loading Status Section */}
      <div className='max-w-4xl mx-auto mb-12'>
        <Card className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30'>
          <CardHeader>
            <CardTitle className='text-center text-xl font-bold text-gray-900 dark:text-gray-100'>
              <div className='w-48 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto' />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='space-y-3'>
                  <div className='w-full h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
                  <div className='w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
                  <div className='w-1/2 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
