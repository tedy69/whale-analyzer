import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for Whale Analyzer - Read our terms and conditions for using our Web3 wallet analysis platform.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
      <div className='container mx-auto px-6 py-16'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold text-slate-900 dark:text-white mb-4'>
              Terms of Service
            </h1>
            <p className='text-lg text-slate-600 dark:text-slate-400'>
              Last updated: June 18, 2025
            </p>
          </div>

          {/* Content */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-8'>
            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                1. Acceptance of Terms
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  By accessing and using Whale Analyzer (&quot;the Service&quot;), you accept and
                  agree to be bound by the terms and provision of this agreement. If you do not
                  agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These Terms of Service (&quot;Terms&quot;) govern your use of our website and
                  services provided by Whale Analyzer (&quot;we&quot;, &quot;us&quot;, or
                  &quot;our&quot;).
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                2. Description of Service
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  Whale Analyzer provides AI-powered analysis of Web3 wallets and blockchain data.
                  Our service includes:
                </p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>Wallet portfolio analysis and valuation</li>
                  <li>DeFi liquidation risk assessment</li>
                  <li>Whale detection and activity tracking</li>
                  <li>Multi-chain support across various blockchains</li>
                  <li>AI-generated insights and recommendations</li>
                </ul>
                <p>
                  All analysis is based on publicly available blockchain data and is provided for
                  informational purposes only.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                3. User Responsibilities
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <h3 className='text-lg font-medium text-slate-800 dark:text-slate-200'>
                  3.1 Acceptable Use
                </h3>
                <p>
                  You agree to use the Service only for lawful purposes and in accordance with these
                  Terms. You agree not to:
                </p>
                <ul className='list-disc list-inside space-y-2 ml-4'>
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Use automated tools to access the Service without permission</li>
                  <li>Transmit any malicious code or harmful content</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>

                <h3 className='text-lg font-medium text-slate-800 dark:text-slate-200'>
                  3.2 Account Security
                </h3>
                <p>
                  While we do not require account creation for basic usage, you are responsible for
                  maintaining the security of any credentials or data you use with our Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                4. Disclaimers and Limitations
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <h3 className='text-lg font-medium text-slate-800 dark:text-slate-200'>
                  4.1 No Financial Advice
                </h3>
                <p>
                  <strong>IMPORTANT:</strong> The information provided by Whale Analyzer is for
                  informational and educational purposes only and should not be construed as
                  financial, investment, or trading advice. You should not rely on our analysis for
                  making investment decisions.
                </p>

                <h3 className='text-lg font-medium text-slate-800 dark:text-slate-200'>
                  4.2 Data Accuracy
                </h3>
                <p>
                  While we strive to provide accurate analysis based on blockchain data, we do not
                  guarantee the completeness, accuracy, or timeliness of any information provided.
                  Blockchain data may be incomplete or contain errors.
                </p>

                <h3 className='text-lg font-medium text-slate-800 dark:text-slate-200'>
                  4.3 AI-Generated Content
                </h3>
                <p>
                  Our Service uses artificial intelligence to generate insights and recommendations.
                  AI-generated content may contain inaccuracies and should be verified independently
                  before making any decisions.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                5. Limitation of Liability
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WHALE ANALYZER SHALL NOT BE LIABLE FOR ANY
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
                  WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE
                  LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
                </p>
                <p>
                  Our total liability to you for any claims arising from or related to these Terms
                  or the Service shall not exceed the amount you have paid us in the twelve (12)
                  months prior to the claim.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                6. Intellectual Property
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  The Service and its original content, features, and functionality are and will
                  remain the exclusive property of Whale Analyzer and its licensors. The Service is
                  protected by copyright, trademark, and other laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly
                  display, publicly perform, republish, download, store, or transmit any of the
                  material on our Service without our prior written consent.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                7. Privacy and Data Protection
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also
                  governs your use of the Service, to understand our practices.
                </p>
                <p>
                  We process blockchain data, which is inherently public. We do not collect or store
                  private keys, seed phrases, or any sensitive wallet credentials.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                8. Service Availability
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  We strive to maintain high availability of our Service, but we do not guarantee
                  uninterrupted access. The Service may be temporarily unavailable for maintenance,
                  updates, or due to factors beyond our control.
                </p>
                <p>
                  We may modify, suspend, or discontinue any part of the Service at any time with or
                  without notice.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                9. Third-Party Services
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  Our Service may integrate with third-party blockchain data providers and APIs. We
                  are not responsible for the availability, accuracy, or reliability of these
                  third-party services.
                </p>
                <p>
                  Your use of third-party services is subject to their respective terms and
                  conditions.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                10. Indemnification
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  You agree to defend, indemnify, and hold harmless Whale Analyzer and its
                  affiliates, officers, directors, employees, and agents from and against any and
                  all claims, damages, obligations, losses, liabilities, costs, or debt, and
                  expenses (including attorney&apos;s fees) arising from your use of the Service or
                  violation of these Terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                11. Governing Law
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  These Terms shall be interpreted and governed by the laws of [Your Jurisdiction],
                  without regard to its conflict of law provisions. Any legal action or proceeding
                  arising under these Terms will be brought exclusively in the courts of [Your
                  Jurisdiction].
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                12. Changes to Terms
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision
                  is material, we will provide at least 30 days notice prior to any new terms taking
                  effect.
                </p>
                <p>
                  Your continued use of the Service after any such changes constitutes your
                  acceptance of the new Terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                13. Severability
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>
                  If any provision of these Terms is held to be unenforceable or invalid, such
                  provision will be changed and interpreted to accomplish the objectives of such
                  provision to the greatest extent possible under applicable law and the remaining
                  provisions will continue in full force and effect.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                14. Contact Information
              </h2>
              <div className='space-y-4 text-slate-700 dark:text-slate-300'>
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className='bg-slate-50 dark:bg-slate-700 p-4 rounded-lg'>
                  <p>
                    <strong>Email:</strong> legal@tedyfazrin.com
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
