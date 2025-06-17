import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import DashboardServer from '@/components/server/DashboardServer';
import DashboardLoading from '@/components/server/DashboardLoading';

interface HomePageProps {
  readonly searchParams: Promise<{
    address?: string;
    chain?: string;
    mode?: 'single-chain' | 'multi-chain';
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // If there's an address in search params, redirect to SSR analysis page
  if (params.address) {
    const queryString = new URLSearchParams();
    if (params.chain) queryString.set('chain', params.chain);
    if (params.mode) queryString.set('mode', params.mode);

    const queryStr = queryString.toString();
    const redirectUrl = `/analyze/${params.address}` + (queryStr ? `?${queryStr}` : '');
    redirect(redirectUrl);
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900'>
      {/* Animated Background Elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-float' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-float animate-delay-2000' />
        <div className='absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-300 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-float animate-delay-4000' />
      </div>

      <div className='relative z-10'>
        <Suspense fallback={<DashboardLoading />}>
          <DashboardServer />
        </Suspense>
      </div>
    </div>
  );
}
