import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about the Web3 Whale Analyzer project - an open-source AI-powered blockchain wallet analysis tool built by Tedy Fazrin.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
      <div className='container mx-auto px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <div className='flex justify-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center'>
                <svg
                  viewBox='0 0 32 32'
                  className='w-10 h-10'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <g transform='translate(4, 8)'>
                    <path
                      d='M0 8 C0 4, 4 0, 10 0 C16 0, 20 3, 20 6 L20 10 C20 13, 16 16, 10 16 C4 16, 0 12, 0 8 Z'
                      fill='white'
                    />
                    <path d='M20 6 L24 4 L26 8 L24 12 L20 10' fill='white' />
                    <circle cx='7' cy='6' r='1.5' fill='#3b82f6' />
                    <circle cx='7.5' cy='5.7' r='0.7' fill='white' />
                  </g>
                </svg>
              </div>
            </div>
            <h1 className='text-4xl font-bold text-slate-900 dark:text-white mb-4'>
              About Whale Analyzer
            </h1>
            <p className='text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto'>
              An open-source AI-powered Web3 wallet analysis tool for detecting whales, assessing
              DeFi risks, and providing comprehensive blockchain portfolio insights.
            </p>
          </div>

          {/* Main Content */}
          <div className='space-y-12'>
            {/* Project Overview */}
            <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-6'>
                🐋 Project Overview
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  Whale Analyzer is a personal project that leverages artificial intelligence and
                  blockchain data to provide comprehensive analysis of Web3 wallets across multiple
                  networks. The tool helps users understand wallet behaviors, detect whale
                  activities, and assess potential risks in DeFi protocols.
                </p>
                <p>
                  Built with modern technologies like Next.js, TypeScript, and Tailwind CSS, this
                  project demonstrates the power of combining AI analysis with real-time blockchain
                  data to create meaningful insights for the Web3 community.
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-6'>
                ⚡ Key Features
              </h2>
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <div className='flex items-start space-x-3'>
                    <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-blue-600 dark:text-blue-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'>
                        <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-900 dark:text-white'>
                        Multi-Chain Support
                      </h3>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>
                        Analyze wallets across Ethereum, Polygon, BSC, Arbitrum, and more
                        blockchains.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3'>
                    <div className='w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-purple-600 dark:text-purple-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'>
                        <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z' />
                      </svg>
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-900 dark:text-white'>
                        AI-Powered Analysis
                      </h3>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>
                        Advanced AI algorithms provide intelligent insights and risk assessments.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3'>
                    <div className='w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-green-600 dark:text-green-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-900 dark:text-white'>
                        Real-Time Data
                      </h3>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>
                        Live blockchain data integration with multiple provider support.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-start space-x-3'>
                    <div className='w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-red-600 dark:text-red-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-900 dark:text-white'>
                        Risk Assessment
                      </h3>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>
                        Identify DeFi liquidation risks and potential security concerns.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3'>
                    <div className='w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-cyan-600 dark:text-cyan-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'>
                        <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                      </svg>
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-900 dark:text-white'>
                        Portfolio Insights
                      </h3>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>
                        Comprehensive portfolio analysis and asset distribution breakdowns.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start space-x-3'>
                    <div className='w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <svg
                        className='w-4 h-4 text-orange-600 dark:text-orange-400'
                        fill='currentColor'
                        viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className='font-semibold text-slate-900 dark:text-white'>Open Source</h3>
                      <p className='text-sm text-slate-600 dark:text-slate-400'>
                        Fully open-source project available on GitHub for community contributions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technology Stack */}
            <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-6'>
                🛠️ Technology Stack
              </h2>
              <div className='grid md:grid-cols-3 gap-6'>
                <div>
                  <h3 className='font-semibold text-slate-900 dark:text-white mb-3'>Frontend</h3>
                  <ul className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                    <li>• Next.js 15 (React Framework)</li>
                    <li>• TypeScript for type safety</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Responsive design</li>
                    <li>• Dark mode support</li>
                  </ul>
                </div>
                <div>
                  <h3 className='font-semibold text-slate-900 dark:text-white mb-3'>
                    Backend & APIs
                  </h3>
                  <ul className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                    <li>• Next.js API routes</li>
                    <li>• Multiple blockchain providers</li>
                    <li>• AI analysis integration</li>
                    <li>• Rate limiting & caching</li>
                    <li>• Error handling & fallbacks</li>
                  </ul>
                </div>
                <div>
                  <h3 className='font-semibold text-slate-900 dark:text-white mb-3'>
                    Infrastructure
                  </h3>
                  <ul className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                    <li>• Vercel deployment</li>
                    <li>• Edge functions</li>
                    <li>• CDN optimization</li>
                    <li>• Environment-based configs</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Developer Section */}
            <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-6'>
                👨‍💻 About the Developer
              </h2>
              <div className='flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8'>
                <div className='flex-shrink-0'>
                  <div className='w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                    <span className='text-2xl font-bold text-white'>TF</span>
                  </div>
                </div>
                <div className='flex-grow'>
                  <h3 className='text-xl font-semibold text-slate-900 dark:text-white mb-2'>
                    Tedy Fazrin
                  </h3>
                  <p className='text-slate-600 dark:text-slate-400 mb-4'>
                    Full-stack developer passionate about Web3 technologies, blockchain development,
                    and creating tools that make complex blockchain data accessible to everyone.
                    This project combines my interests in AI, cryptocurrency, and open-source
                    development.
                  </p>
                  <div className='flex space-x-4'>
                    <Link
                      href='https://github.com/tedy69'
                      className='flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                      </svg>
                      <span>GitHub</span>
                    </Link>
                    <Link
                      href='https://linkedin.com/in/mochammad-tedy-fazrin'
                      className='flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                      </svg>
                      <span>LinkedIn</span>
                    </Link>
                    <Link
                      href='mailto:gmail@tedyfazrin.com'
                      className='flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                        />
                      </svg>
                      <span>Email</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contributing */}
            <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-6'>
                🤝 Contributing
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  This is an open-source project and contributions are welcome! Whether you&apos;re
                  interested in:
                </p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>Adding support for new blockchain networks</li>
                  <li>Improving the AI analysis algorithms</li>
                  <li>Enhancing the user interface and experience</li>
                  <li>Fixing bugs or optimizing performance</li>
                  <li>Adding new features or analysis metrics</li>
                  <li>Improving documentation</li>
                </ul>
                <p>
                  Feel free to check out the{' '}
                  <Link
                    href='https://github.com/tedy69/whale-analyzer'
                    className='text-blue-600 dark:text-blue-400 hover:underline'>
                    GitHub repository
                  </Link>{' '}
                  and submit issues, feature requests, or pull requests.
                </p>
              </div>
            </div>

            {/* Future Plans */}
            <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8'>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-6'>
                🚀 Future Plans
              </h2>
              <div className='grid md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='font-semibold text-slate-900 dark:text-white mb-3'>Short Term</h3>
                  <ul className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                    <li>• Enhanced whale detection algorithms</li>
                    <li>• More blockchain network support</li>
                    <li>• Advanced portfolio analytics</li>
                    <li>• Performance optimizations</li>
                    <li>• Mobile app development</li>
                  </ul>
                </div>
                <div>
                  <h3 className='font-semibold text-slate-900 dark:text-white mb-3'>Long Term</h3>
                  <ul className='space-y-2 text-sm text-slate-600 dark:text-slate-400'>
                    <li>• Machine learning model improvements</li>
                    <li>• Historical data analysis</li>
                    <li>• Social trading features</li>
                    <li>• API for third-party integrations</li>
                    <li>• Community-driven features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className='mt-12 text-center'>
            <Link
              href='/'
              className='inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
