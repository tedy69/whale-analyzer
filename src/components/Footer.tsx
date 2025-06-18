import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800'>
      <div className='container mx-auto px-6 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <svg
                  viewBox='0 0 32 32'
                  className='w-5 h-5'
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
              <h3 className='text-xl font-bold text-slate-900 dark:text-white'>Whale Analyzer</h3>
            </div>
            <p className='text-slate-600 dark:text-slate-400 text-sm leading-relaxed'>
              A personal project for AI-powered Web3 wallet analysis across multiple blockchains.
              Built by Tedy Fazrin.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='https://github.com/tedy69/whale-analyzer'
                className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors'
                aria-label='GitHub'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
              </Link>
              <Link
                href='https://linkedin.com/in/mochammad-tedy-fazrin/'
                className='text-slate-400 hover:text-blue-600 transition-colors'
                aria-label='LinkedIn'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
              Features
            </h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Wallet Analysis
                </Link>
              </li>
              <li>
                <Link
                  href='/#features'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Multi-Chain Support
                </Link>
              </li>
              <li>
                <Link
                  href='/#ai-analysis'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  AI Risk Assessment
                </Link>
              </li>
              <li>
                <Link
                  href='/#whale-detection'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Whale Detection
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical */}
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
              Technical
            </h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='https://github.com/tedy69/whale-analyzer'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Source Code
                </Link>
              </li>
              <li>
                <Link
                  href='https://github.com/tedy69/whale-analyzer/blob/main/README.md'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href='https://github.com/tedy69/whale-analyzer/issues'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Report Issues
                </Link>
              </li>
              <li>
                <Link
                  href='https://github.com/tedy69/whale-analyzer/blob/main/CONTRIBUTING.md'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Contributing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider'>
              Information
            </h4>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/about'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  About Project
                </Link>
              </li>
              <li>
                <Link
                  href='mailto:gmail@tedyfazrin.com'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Contact Developer
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm'>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          <div className='text-slate-600 dark:text-slate-400 text-sm'>
            © {currentYear} Tedy Fazrin. Personal project - Open source on GitHub.
          </div>

          <div className='flex items-center space-x-6 text-sm'>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
              <span className='text-slate-600 dark:text-slate-400'>All systems operational</span>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='text-slate-400'>Supported networks:</span>
              <div className='flex items-center space-x-2'>
                {/* Ethereum */}
                <div className='w-4 h-4' title='Ethereum'>
                  <svg viewBox='0 0 32 32' className='w-full h-full'>
                    <path d='M16 4L16.333 14.5L25 16L16 4Z' fill='#627EEA' />
                    <path d='M16 4L7 16L15.667 14.5L16 4Z' fill='#627EEA' fillOpacity='0.6' />
                    <path d='M16 21.5L16.333 28L25 17.5L16 21.5Z' fill='#627EEA' />
                    <path d='M16 28L16 21.5L7 17.5L16 28Z' fill='#627EEA' fillOpacity='0.6' />
                    <path d='M16 20L25 16L16.333 14.5L16 20Z' fill='#627EEA' fillOpacity='0.2' />
                    <path d='M7 16L16 20L15.667 14.5L7 16Z' fill='#627EEA' fillOpacity='0.6' />
                  </svg>
                </div>

                {/* Polygon */}
                <div className='w-4 h-4' title='Polygon'>
                  <svg viewBox='0 0 32 32' className='w-full h-full'>
                    <path
                      d='M22.5 10.5L19.5 8.5C18.8 8.1 17.9 8.1 17.2 8.5L12 11.5L8.5 13.5L3.3 16.5C2.6 16.9 1.7 16.9 1 16.5L-2 14.5V10.5L1 8.5C1.7 8.1 2.6 8.1 3.3 8.5L8.5 11.5L12 13.5L17.2 10.5C17.9 10.1 18.8 10.1 19.5 10.5L22.5 12.5V16.5L19.5 18.5C18.8 18.9 17.9 18.9 17.2 18.5L12 15.5L8.5 13.5L3.3 10.5C2.6 10.1 1.7 10.1 1 10.5L-2 12.5V16.5L1 18.5C1.7 18.9 2.6 18.9 3.3 18.5L8.5 15.5L12 13.5L17.2 16.5C17.9 16.9 18.8 16.9 19.5 16.5L22.5 14.5V10.5Z'
                      fill='#8247E5'
                      transform='translate(5, 5) scale(0.7)'
                    />
                  </svg>
                </div>

                {/* BSC */}
                <div className='w-4 h-4' title='BSC'>
                  <svg viewBox='0 0 32 32' className='w-full h-full'>
                    <circle cx='16' cy='16' r='14' fill='#F3BA2F' />
                    <path d='M12 12L16 8L20 12L24 16L20 20L16 24L12 20L8 16L12 12Z' fill='white' />
                    <path d='M16 14L18 16L16 18L14 16L16 14Z' fill='#F3BA2F' />
                  </svg>
                </div>

                {/* Arbitrum */}
                <div className='w-4 h-4' title='Arbitrum'>
                  <svg viewBox='0 0 32 32' className='w-full h-full'>
                    <circle cx='16' cy='16' r='14' fill='#2D374B' />
                    <path d='M12 22L16 8L20 22L16 18L12 22Z' fill='#28A0F0' />
                    <path d='M16 8L20 14L16 18L12 14L16 8Z' fill='#96BEDC' />
                  </svg>
                </div>

                <span className='text-slate-400 text-xs'>+5 more</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
