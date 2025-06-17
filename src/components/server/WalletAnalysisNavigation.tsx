import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function WalletAnalysisNavigation() {
  return (
    <nav className='flex items-center justify-between mb-8 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl animate-slide-in-up'>
      <div className='flex items-center space-x-3'>
        <Link href='/' className='flex items-center space-x-3 hover:opacity-80 transition-opacity'>
          <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-glow'>
            <span className='text-white font-bold text-lg'>🐋</span>
          </div>
          <div>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Whale Analyzer
            </h1>
            <p className='text-sm text-gray-600 dark:text-gray-400'>AI-Powered Web3 Analytics</p>
          </div>
        </Link>
      </div>

      <div className='flex items-center space-x-4'>
        <div className='hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400'>
          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
          <span>Analysis Complete</span>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
