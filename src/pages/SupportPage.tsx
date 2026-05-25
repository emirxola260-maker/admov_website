import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-syne font-bold text-violet mb-2">{q}</h3>
      <p className="text-zinc-400">{children}</p>
    </div>
  );
}

export function SupportPage() {
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
          <span className="font-syne font-bold text-[11px] text-violet tracking-[0.10em] uppercase mb-3 block">Help Center</span>
          <h1 className="text-5xl md:text-6xl font-syne font-extrabold tracking-tight text-zinc-50 mb-4">Admov Support</h1>
          <p className="text-zinc-400">Need help with Admov? We're here for you.</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-12 text-zinc-300 leading-relaxed">

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">Contact us</h2>
            <p>The fastest way to reach us is email:</p>
            <a
              href="mailto:info@admov.io"
              className="mt-4 flex items-center gap-3 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-violet/40 transition-colors group"
            >
              <span className="text-2xl">📧</span>
              <span className="text-xl md:text-2xl font-syne font-bold text-violet group-hover:text-violet-light transition-colors break-all">info@admov.io</span>
            </a>
            <p className="mt-6">We typically reply within 1–2 business days. To help us help you faster, please include:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>Your account email</li>
              <li>The device and iOS version you're using</li>
              <li>A short description (and a screenshot, if relevant) of what happened</li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-3xl font-syne font-extrabold text-zinc-50 mb-8">Frequently asked questions</h2>

            <div className="space-y-10">
              <div>
                <h3 className="text-sm font-syne font-bold text-zinc-500 uppercase tracking-[0.15em] mb-5">Getting started</h3>
                <div className="space-y-6">
                  <Faq q="What is Admov?">
                    Admov turns your product photos into premium, AI-generated advertisements in seconds. Upload a photo, pick a business type and style, and generate a ready-to-post ad.
                  </Faq>
                  <Faq q="How do I create an ad?">
                    Tap <strong className="text-zinc-300">Create</strong>, upload your product photo, choose a business type and style, fill in any details, then tap <strong className="text-zinc-300">Generate</strong>. Your finished ad appears in a few seconds and is saved to <strong className="text-zinc-300">Projects</strong>.
                  </Faq>
                  <Faq q="Do I need an account?">
                    You can browse the app as a guest, but generating and saving content requires a free account. Sign in with Apple, Google, or email.
                  </Faq>
                  <Faq q="How long does a generation take?">
                    Most generations finish in about 20–40 seconds, depending on quality and network speed.
                  </Faq>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-syne font-bold text-zinc-500 uppercase tracking-[0.15em] mb-5">Credits &amp; billing</h3>
                <div className="space-y-6">
                  <Faq q="How do credits work?">
                    Generating ads, images, and using AI tools costs credits. You start with free credits and can buy more anytime, or subscribe for a larger monthly allowance.
                  </Faq>
                  <Faq q="How do I manage or cancel my subscription?">
                    Subscriptions are billed through your Apple ID and renew automatically. Manage or cancel anytime: open the <strong className="text-zinc-300">Settings app → tap your name → Subscriptions → Admov</strong>. Canceling stops future renewals; you keep access until the current period ends.
                  </Faq>
                  <Faq q="I bought credits or a subscription but don't see them.">
                    Open Admov → <strong className="text-zinc-300">Settings → Restore Purchases</strong>. If they still don't appear, email us at{" "}
                    <a href="mailto:info@admov.io" className="text-violet hover:text-violet-light transition-colors">info@admov.io</a> with your account email.
                  </Faq>
                  <Faq q="Can I get a refund?">
                    Purchases are processed by Apple. Refund requests are handled through Apple at{" "}
                    <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer" className="text-violet hover:text-violet-light transition-colors">reportaproblem.apple.com</a>.
                  </Faq>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-syne font-bold text-zinc-500 uppercase tracking-[0.15em] mb-5">Account</h3>
                <div className="space-y-6">
                  <Faq q="How do I reset my password?">
                    On the email sign-in screen, tap <strong className="text-zinc-300">Forgot password?</strong>, enter your email, and we'll send a 6-digit reset code.
                  </Faq>
                  <Faq q="I didn't get my verification / reset code.">
                    Check your spam folder and make sure the email is correct. You can tap <strong className="text-zinc-300">Resend</strong> after a short wait. Still stuck? Email{" "}
                    <a href="mailto:info@admov.io" className="text-violet hover:text-violet-light transition-colors">info@admov.io</a>.
                  </Faq>
                  <Faq q="How do I delete my account?">
                    Open Admov → <strong className="text-zinc-300">Settings → Delete account</strong>. This permanently removes your account and associated data. This action can't be undone.
                  </Faq>
                  <Faq q="What languages does Admov support?">
                    English, Arabic, and Turkish. The app follows your device language automatically.
                  </Faq>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-syne font-bold text-zinc-500 uppercase tracking-[0.15em] mb-5">Troubleshooting</h3>
                <div className="space-y-6">
                  <Faq q="A generation failed or got stuck.">
                    Check your internet connection and try again. Failed generations are refunded automatically. If it keeps happening, email us with a screenshot.
                  </Faq>
                  <Faq q="The app looks wrong or won't load content.">
                    Pull down to refresh, or fully close and reopen the app. Make sure you're on the latest version from the App Store.
                  </Faq>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-syne font-bold text-zinc-500 uppercase tracking-[0.15em] mb-5">Content &amp; safety</h3>
                <div className="space-y-6">
                  <Faq q="Who owns the images I create?">
                    You can use the images you generate for personal and commercial purposes, subject to our Terms of Use. Because output is AI-generated, please review it before publishing.
                  </Faq>
                  <Faq q="How do I report a problem with generated content?">
                    Use the report option on any result, or email{" "}
                    <a href="mailto:info@admov.io" className="text-violet hover:text-violet-light transition-colors">info@admov.io</a>. Prompts are filtered and content may be reviewed to keep Admov safe.
                  </Faq>
                </div>
              </div>
            </div>
          </section>

          {/* Legal */}
          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">Legal</h2>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>
                <Link to="/terms" className="text-violet hover:text-violet-light transition-colors">Terms of Use</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-violet hover:text-violet-light transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </section>

          {/* Still need help */}
          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">Still need help?</h2>
            <p>
              Email{" "}
              <a href="mailto:info@admov.io" className="text-violet hover:text-violet-light transition-colors">info@admov.io</a>
              {" "}— we read every message.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500">© {new Date().getFullYear()} ADMOV. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-zinc-400 hover:text-violet transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-zinc-400 hover:text-violet transition-colors">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
