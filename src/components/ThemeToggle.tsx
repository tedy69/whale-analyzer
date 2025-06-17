'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: Readonly<ThemeToggleProps>) {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={toggleTheme}
      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${className}`}
      aria-label='Toggle theme'>
      <div className='relative w-5 h-5'>
        {/* Sun Icon */}
        <Sun
          className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
            resolvedTheme === 'dark'
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />

        {/* Moon Icon */}
        <Moon
          className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
            resolvedTheme === 'light'
              ? '-rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </div>

      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-md transition-all duration-300 ${
          resolvedTheme === 'light'
            ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20'
            : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
        }`}
      />
    </Button>
  );
}
