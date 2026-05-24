import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export function PrivacyPolicy() {
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
          <h1 className="text-5xl md:text-6xl font-syne font-extrabold tracking-tight text-zinc-50 mb-4">Privacy Policy</h1>
          <p className="text-zinc-400">Last updated: April 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">1. Introduction</h2>
            <p>Welcome to ADMOV ("we", "our", or "us"). We are an AI agency for businesses, specializing in AI-generated videos, photos, automation systems, and digital marketing. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
            <p className="mt-3">By using our services, you agree to the collection and use of information in accordance with this policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">2. Information We Collect</h2>
            <h3 className="text-lg font-syne font-bold text-violet mb-2">Personal Information</h3>
            <p>When you contact us or use our services, we may collect:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>Name and email address (via contact form)</li>
              <li>Phone number (if provided)</li>
              <li>Business name and project details</li>
              <li>Communication history with our team</li>
            </ul>

            <h3 className="text-lg font-syne font-bold text-violet mb-2 mt-6">Usage Data</h3>
            <p>We automatically collect certain information when you visit our website, including:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>IP address and browser type</li>
              <li>Pages visited and time spent</li>
              <li>Referring URLs</li>
              <li>Device and operating system information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>To respond to your inquiries and provide our services</li>
              <li>To send project updates and relevant communications</li>
              <li>To improve our website and service offerings</li>
              <li>To comply with legal obligations</li>
              <li>To analyze usage patterns and optimize user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">4. Data Sharing & Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li><strong className="text-zinc-300">Service Providers:</strong> Trusted third parties that assist in operating our website or conducting our business (e.g., hosting providers, email services)</li>
              <li><strong className="text-zinc-300">Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
              <li><strong className="text-zinc-300">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">5. Cookies & Tracking</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience. Cookies are small files stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            <p className="mt-3">We use:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li><strong className="text-zinc-300">Essential Cookies:</strong> Required for the website to function (e.g., language preference)</li>
              <li><strong className="text-zinc-300">Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">6. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">7. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>The right to access your personal information</li>
              <li>The right to rectify inaccurate data</li>
              <li>The right to erasure ("right to be forgotten")</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
            <p className="mt-4">To exercise any of these rights, please contact us at <a href="mailto:info@admov.io" className="text-violet hover:text-violet-light transition-colors">info@admov.io</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">8. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites (Instagram, TikTok, WhatsApp). We are not responsible for the privacy practices of these sites and encourage you to review their privacy policies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this policy. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">10. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <div className="mt-4 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
              <p><strong className="text-zinc-300">Email:</strong> <a href="mailto:info@admov.io" className="text-violet hover:text-violet-light transition-colors">info@admov.io</a></p>
              <p><strong className="text-zinc-300">WhatsApp:</strong> <a href="https://wa.me/905375755445" className="text-violet hover:text-violet-light transition-colors">+90 537 575 54 45</a></p>
              <p><strong className="text-zinc-300">Instagram:</strong> <a href="https://www.instagram.com/admov.io" target="_blank" rel="noopener noreferrer" className="text-violet hover:text-violet-light transition-colors">@admov.io</a></p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} ADMOV. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-violet hover:text-violet-light transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-zinc-400 hover:text-violet transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
