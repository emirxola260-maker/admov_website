import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function TermsOfService() {
  const { isRTL } = useLanguage();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-violet/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <polygon points="50,0 100,100 0,100" fill="#A49BFF" />
                <polygon points="50,50 75,100 25,100" fill="#7367F0" />
              </svg>
            </div>
            <span className="logo-text font-extrabold text-2xl tracking-tighter text-zinc-50">ADMOV</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-violet transition-colors text-sm font-syne font-bold"
          >
            <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-36 pb-24">
        <div className="mb-12">
          <span className="font-syne font-bold text-[11px] text-violet tracking-[0.10em] uppercase mb-3 block">Legal</span>
          <h1 className="text-5xl md:text-6xl font-syne font-extrabold tracking-tight text-zinc-50 mb-4">Terms of Use</h1>
          <p className="text-zinc-400">Last updated: May 26, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <p>
            These Terms of Use ("Terms") govern your access to and use of the Admov mobile application and related services (collectively, the "Service"), operated by <strong className="text-zinc-300">[LEGAL COMPANY NAME]</strong> ("Admov", "we", "us", or "our"). By downloading, accessing, or using the Service, you agree to these Terms. If you do not agree, do not use the Service.
          </p>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">1. The Service</h2>
            <p>Admov is an AI-powered creative tool that lets you generate, edit, and enhance advertising and marketing images from photos and text prompts you provide. Output is produced using artificial intelligence and may vary in quality and accuracy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">2. Eligibility</h2>
            <p>You must be at least 13 years old (or the minimum digital-consent age in your country) to use the Service. If you use Admov on behalf of a business, you represent that you are authorized to bind that business to these Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">3. Accounts</h2>
            <p>You can browse parts of the app as a guest, but creating content requires an account. You are responsible for safeguarding your login credentials and for all activity under your account. Sign-in is provided via Apple, Google, or email. Notify us at <a href="mailto:info@admov.io" className="text-violet hover:text-violet-light transition-colors">info@admov.io</a> of any unauthorized use.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">4. Credits, Purchases &amp; Subscriptions</h2>
            <p>The Service runs on a credit system. Credits and subscriptions are sold as in-app purchases processed by Apple.</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li><strong className="text-zinc-300">Consumable credits</strong> are deducted when you generate or process content and are non-refundable once used, except where required by law.</li>
              <li><strong className="text-zinc-300">Subscriptions</strong> (e.g. Pro, Business) are auto-renewable. Your Apple ID is charged upon confirmation of purchase and at the start of each renewal period. Subscriptions renew automatically unless canceled at least 24 hours before the end of the current period. Manage or cancel anytime in your App Store account settings.</li>
              <li>Prices may change with notice. Refunds are handled by Apple under the App Store terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">5. Acceptable Use</h2>
            <p>You agree not to use the Service to create, upload, or share content that:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>is illegal, infringing, defamatory, hateful, harassing, or violent;</li>
              <li>is sexually explicit or exploits minors;</li>
              <li>impersonates a real person without consent, or uses someone's likeness unlawfully;</li>
              <li>infringes intellectual-property, privacy, or publicity rights;</li>
              <li>is misleading, fraudulent, or violates advertising laws applicable to you.</li>
            </ul>
            <p className="mt-4">We may filter prompts, review generated content, suspend accounts, and remove content that violates these Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">6. Your Content</h2>
            <p>You retain ownership of the photos, logos, text, and other materials you upload ("Your Content"). You grant Admov a worldwide, non-exclusive license to host, process, and transmit Your Content solely to operate and improve the Service, including sending it to third-party AI providers to fulfill your requests. You represent that you have all rights necessary to upload Your Content and to authorize this processing.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">7. Generated Output</h2>
            <p>Subject to your compliance with these Terms and applicable law, you may use the images you generate ("Output") for personal and commercial purposes. Because Output is produced by AI:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>similar Output may be generated for other users;</li>
              <li>we do not guarantee that Output is unique, accurate, or free of third-party rights, and you are responsible for reviewing it before use;</li>
              <li>you are solely responsible for how you use Output, including compliance with advertising, trademark, and consumer-protection laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">8. Intellectual Property</h2>
            <p>The Service, including its software, design, branding, and templates, is owned by Admov and protected by law. We grant you a limited, revocable, non-transferable license to use the app for its intended purpose. You may not copy, reverse engineer, or resell the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">9. Third-Party Services</h2>
            <p>Admov relies on third parties including Apple, Google, and AI model and infrastructure providers. Your use of those services is subject to their terms, and we are not responsible for them.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">10. Termination</h2>
            <p>We may suspend or terminate your access at any time for violation of these Terms or to protect the Service. You may stop using the Service and delete your account at any time from within the app.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">11. Disclaimers</h2>
            <p>THE SERVICE AND OUTPUT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">12. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, ADMOV WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR FOR LOST PROFITS OR DATA. OUR TOTAL LIABILITY FOR ANY CLAIM WILL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">13. Indemnification</h2>
            <p>You agree to indemnify and hold Admov harmless from claims arising out of Your Content, your Output, or your violation of these Terms or applicable law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">14. Apple App Store</h2>
            <p>These Terms are between you and Admov, not Apple. Apple is not responsible for the Service or its content. Apple has no obligation to provide support or handle warranty claims, and is not responsible for any third-party claims relating to the app. Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">15. Changes</h2>
            <p>We may update these Terms from time to time. Material changes will be posted in the app or on this page with a new "Last updated" date. Continued use after changes means you accept them.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">16. Governing Law</h2>
            <p>These Terms are governed by the laws of <strong className="text-zinc-300">[e.g. Republic of Türkiye]</strong>, without regard to conflict-of-law rules. Disputes will be resolved in the courts of <strong className="text-zinc-300">[ISTANBUL]</strong>, unless otherwise required by mandatory local law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">17. Contact</h2>
            <p>For questions about these Terms, you can reach us at:</p>
            <div className="mt-4 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
              <p><strong className="text-zinc-300">Admov</strong></p>
              <p><strong className="text-zinc-300">Email:</strong> <a href="mailto:info@admov.io" className="text-violet hover:text-violet-light transition-colors">info@admov.io</a></p>
              <p><strong className="text-zinc-300">Website:</strong> <a href="https://admov.io" target="_blank" rel="noopener noreferrer" className="text-violet hover:text-violet-light transition-colors">https://admov.io</a></p>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} ADMOV. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-zinc-400 hover:text-violet transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-violet hover:text-violet-light transition-colors">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
