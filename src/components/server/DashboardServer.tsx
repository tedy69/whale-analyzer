import { Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import WalletSearchServer from './WalletSearchServer';

/**
 * Main Dashboard Server Component - Modern, catchy design
 */
export default async function DashboardServer() {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob'></div>
        <div className='absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000'></div>
      </div>

      <div className='container mx-auto px-4 pt-8 relative z-10'>
        {/* Navigation Bar */}
        <nav className='glass-card mb-12 p-6 card-hover'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <div className='w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center glow'>
                  <span className='text-white font-bold text-xl'>🐋</span>
                </div>
                <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping'></div>
              </div>
              <div>
                <h1 className='text-3xl font-bold gradient-text'>Whale Analyzer</h1>
                <p className='text-sm text-muted-foreground'>AI-Powered Web3 Analytics</p>
              </div>
            </div>

            <div className='flex items-center space-x-6'>
              <div className='hidden md:flex items-center space-x-2 glass-button px-4 py-2 rounded-xl'>
                <div className='w-2 h-2 bg-green-400 rounded-full pulse-slow' />
                <span className='text-sm font-medium'>Live Analysis</span>
              </div>
              <ThemeToggle className='glass-button' />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className='text-center mb-16 space-y-8'>
          <div className='float'>
            <h2 className='text-6xl md:text-7xl font-bold mb-6'>
              <span className='gradient-whale block'>Web3 Whale</span>
              <span className='gradient-crypto'>Analyzer</span>
            </h2>
          </div>

          <p className='text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed'>
            Discover crypto whales, analyze DeFi risks, and get AI-powered insights with our{' '}
            <span className='gradient-text font-semibold'>server-side rendered</span> analytics
            platform
          </p>

          {/* Feature Highlights */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
            <div className='glass-card p-8 card-hover group'>
              <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                🐋
              </div>
              <h3 className='text-xl font-bold mb-3 gradient-whale'>Whale Detection</h3>
              <p className='text-muted-foreground'>
                Identify crypto whales and analyze their trading patterns with advanced algorithms
              </p>
            </div>

            <div className='glass-card p-8 card-hover group'>
              <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                ⚡
              </div>
              <h3 className='text-xl font-bold mb-3 gradient-crypto'>Real-time Analysis</h3>
              <p className='text-muted-foreground'>
                Get instant insights with server-side rendering and live blockchain data
              </p>
            </div>

            <div className='glass-card p-8 card-hover group'>
              <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>
                🤖
              </div>
              <h3 className='text-xl font-bold mb-3 gradient-text'>AI Insights</h3>
              <p className='text-muted-foreground'>
                Powered by advanced AI to provide actionable investment insights and risk analysis
              </p>
            </div>
          </div>
        </div>

        {/* Main Search Interface */}
        <div className='flex justify-center mb-16'>
          <Suspense fallback={<WalletSearchLoadingSkeleton />}>
            <WalletSearchServer />
          </Suspense>
        </div>

        {/* Stats Section */}
        <div className='max-w-4xl mx-auto mb-16'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <StatsCard title='Whales Detected' value='1,337+' icon='🐋' />
            <StatsCard title='Wallets Analyzed' value='50K+' icon='💼' />
            <StatsCard title='Risk Assessments' value='25K+' icon='⚡' />
            <StatsCard title='AI Insights' value='100K+' icon='🤖' />
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for wallet search
function WalletSearchLoadingSkeleton() {
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <Card className='glass-card border-0'>
        <CardHeader>
          <div className='shimmer h-8 w-48 mx-auto rounded-lg'></div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='shimmer h-12 w-full rounded-xl'></div>
          <div className='shimmer h-10 w-32 mx-auto rounded-lg'></div>
        </CardContent>
      </Card>
    </div>
  );
}

// Stats card component
interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className='glass-card p-6 text-center card-hover border-0'>
      <div className='text-2xl mb-2'>{icon}</div>
      <div className='text-2xl font-bold gradient-text mb-1'>{value}</div>
      <div className='text-sm text-muted-foreground'>{title}</div>
    </div>
  );
}
