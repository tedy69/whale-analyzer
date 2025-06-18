import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ClientErrorBoundary, ErrorFallback } from '@/components/ErrorBoundary';
import ClientOnly from '@/components/ClientOnly';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Whale Analyzer - AI-Powered Web3 Wallet Analysis',
    template: '%s | Whale Analyzer',
  },
  description:
    'Advanced AI-powered analysis of Web3 wallets across multiple blockchains. Detect whales, assess DeFi liquidation risks, and get comprehensive portfolio insights for Ethereum, Polygon, BSC, and more.',
  keywords: [
    'web3',
    'whale analyzer',
    'cryptocurrency',
    'DeFi',
    'liquidation risk',
    'portfolio analysis',
    'blockchain',
    'ethereum',
    'polygon',
    'BSC',
    'wallet analysis',
    'crypto analytics',
    'on-chain analysis',
  ],
  authors: [{ name: 'Whale Analyzer Team' }],
  creator: 'Whale Analyzer',
  publisher: 'Whale Analyzer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://whale-analyzer.tedyfazrin.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://whale-analyzer.tedyfazrin.com',
    title: 'Whale Analyzer - AI-Powered Web3 Wallet Analysis',
    description:
      'Advanced AI-powered analysis of Web3 wallets across multiple blockchains. Detect whales, assess DeFi liquidation risks, and get comprehensive portfolio insights.',
    siteName: 'Whale Analyzer',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Whale Analyzer - Web3 Wallet Analysis Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whale Analyzer - AI-Powered Web3 Wallet Analysis',
    description:
      'Advanced AI-powered analysis of Web3 wallets across multiple blockchains. Detect whales, assess DeFi liquidation risks.',
    images: ['/og-image.svg'],
    creator: '@whale_analyzer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#3b82f6',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Whale Analyzer',
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientErrorBoundary fallback={ErrorFallback}>
          <ClientOnly fallback={<div className='min-h-screen bg-white' />}>
            <ThemeProvider>
              <div className='min-h-screen flex flex-col'>
                <main className='flex-grow'>{children}</main>
                <Footer />
              </div>
            </ThemeProvider>
          </ClientOnly>
        </ClientErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
