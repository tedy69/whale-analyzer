import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Whale Analyzer - Learn how we collect, use, and protect your data when using our Web3 wallet analysis platform.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
      <div className='container mx-auto px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-slate-900 dark:text-white mb-4'>
              Privacy Policy
            </h1>
            <p className='text-lg text-slate-600 dark:text-slate-400'>
              Last updated: June 18, 2025
            </p>
          </div>

          {/* Content */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-8'>
            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                1. Information We Collect
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <h3 className='text-lg font-medium text-slate-800 dark:text-slate-200'>
                  1.1 Wallet Addresses
                </h3>
                <p>
                  When you use our wallet analysis service, we temporarily process wallet addresses
                  that you provide. These addresses are used solely for analysis purposes and are
                  not permanently stored unless you explicitly save them to your session.
                </p>

                <h3 className='text-lg font-medium text-slate-800 dark:text-slate-200'>
                  1.2 Usage Data
                </h3>
                <p>
                  We collect anonymous usage statistics including page visits, analysis requests,
                  and feature usage. This data helps us improve our service and is never linked to
                  individual users.
                </p>

                <h3 className='text-lg font-medium text-slate-800 dark:text-slate-200'>
                  1.3 Technical Information
                </h3>
                <p>
                  We automatically collect technical information such as IP addresses, browser type,
                  device information, and access times for security and performance optimization
                  purposes.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                2. How We Use Your Information
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <ul className='list-disc list-inside space-y-2'>
                  <li>Provide wallet analysis and portfolio insights</li>
                  <li>Generate AI-powered recommendations and risk assessments</li>
                  <li>Improve our algorithms and service quality</li>
                  <li>Detect and prevent fraudulent or malicious activity</li>
                  <li>Comply with legal obligations and enforce our terms</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                3. Data Sharing and Disclosure
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third
                  parties except in the following circumstances:
                </p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>
                    With service providers who assist in our operations (under strict
                    confidentiality agreements)
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                4. Blockchain Data
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  Our analysis is based on publicly available blockchain data. All blockchain
                  transactions are inherently public and immutable. We do not collect or store
                  private keys, seed phrases, or any sensitive wallet information.
                </p>
                <p>
                  The wallet addresses you submit for analysis may be temporarily cached for
                  performance optimization, but this data is automatically purged within 24 hours.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                5. Data Security
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>We implement industry-standard security measures to protect your information:</p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>End-to-end encryption for data transmission</li>
                  <li>Secure server infrastructure with regular security audits</li>
                  <li>Access controls and authentication protocols</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Data minimization practices</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                6. Cookies and Tracking
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>We use cookies and similar technologies to enhance your experience:</p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>
                    <strong>Essential cookies:</strong> Required for basic functionality
                  </li>
                  <li>
                    <strong>Performance cookies:</strong> Help us understand how you use our service
                  </li>
                  <li>
                    <strong>Preference cookies:</strong> Remember your settings and preferences
                  </li>
                </ul>
                <p>You can control cookie settings through your browser preferences.</p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                7. Your Rights
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>Depending on your jurisdiction, you may have the following rights:</p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>Access to your personal data</li>
                  <li>Correction of inaccurate data</li>
                  <li>Deletion of your data (subject to legal obligations)</li>
                  <li>Data portability</li>
                  <li>Objection to processing</li>
                  <li>Withdrawal of consent</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                8. International Data Transfers
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  Our services may involve international data transfers. We ensure appropriate
                  safeguards are in place when transferring data across borders, including standard
                  contractual clauses and adequacy decisions.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                9. Children&apos;s Privacy
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  Our service is not intended for children under 13 years of age. We do not
                  knowingly collect personal information from children under 13. If you believe we
                  have collected information from a child under 13, please contact us immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                10. Changes to This Privacy Policy
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any
                  material changes by posting the new Privacy Policy on this page and updating the
                  &quot;Last updated&quot; date.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                11. Contact Us
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please
                  contact us:
                </p>
                <div className='bg-slate-50 dark:bg-slate-700 p-4 rounded-lg'>
                  <p>
                    <strong>Email:</strong> privacy@tedyfazrin.com
                  </p>
                  <p>
                    <strong>Data Protection Officer:</strong> gmail@tedyfazrin.com
                  </p>
                </div>
              </div>
            </section>
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
