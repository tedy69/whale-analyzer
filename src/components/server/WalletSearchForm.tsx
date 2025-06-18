'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidAddress } from '@/lib/validation';
import { type ChainConfig } from '@/lib/chains';

interface WalletSearchFormProps {
  readonly initialAddress?: string;
  readonly availableChains?: ChainConfig[];
}

export default function WalletSearchForm({
  initialAddress = '',
  availableChains,
}: WalletSearchFormProps) {
  const [address, setAddress] = useState(initialAddress);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Will be used for advanced chain selection features in future
  if (availableChains) {
    // Future enhancement placeholder
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!isValidAddress(address.trim())) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    setIsLoading(true);
    try {
      // Navigate to the SSR analysis page
      router.push(`/analyze/${address.trim()}`);
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Failed to navigate to analysis page');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Analysis Mode Info */}
      <div className='text-center'>
        <div className='inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium'>
          <span className='mr-2'>🚀</span>
          <span>Advanced Analysis Mode</span>
        </div>
      </div>

      {/* Address Input */}
      <div className='space-y-2'>
        <div className='relative'>
          <Input
            type='text'
            placeholder='Enter wallet address (0x...)'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='w-full h-14 pl-12 pr-4 text-lg border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 bg-white/95 dark:bg-gray-800 shadow-md focus:shadow-lg rounded-xl font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500'
            disabled={isLoading}
          />
          <Search className='absolute left-4 top-4.5 h-6 w-6 text-gray-400 dark:text-gray-500' />
          {isLoading && (
            <div className='absolute right-4 top-4.5'>
              <Loader2 className='h-6 w-6 animate-spin text-blue-500' />
            </div>
          )}
        </div>
        {error && <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type='submit'
        disabled={isLoading || !address.trim()}
        className='w-full h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg rounded-xl'>
        {isLoading ? (
          <>
            <Loader2 className='mr-2 h-6 w-6 animate-spin' />
            Analyzing...
          </>
        ) : (
          <>
            <Search className='mr-2 h-6 w-6' />
            Analyze Wallet
          </>
        )}
      </Button>

      {/* Feature Info */}
      <div className='text-center text-sm text-gray-600 dark:text-gray-400'>
        <p>✨ Advanced analysis provides instant results with enhanced security</p>
      </div>
    </form>
  );
}
