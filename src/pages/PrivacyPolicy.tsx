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
          <p className="text-zinc-400">Last updated: May 26, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <p>
            This Privacy Policy explains how <strong className="text-zinc-300">Admov</strong> ("we", "us") collects, uses, and shares information when you use the Admov app and services (the "Service"). By using Admov, you agree to this Policy.
          </p>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">1. Information We Collect</h2>
            <p><strong className="text-zinc-300">Account information:</strong> name, email address, and authentication identifiers when you sign in with Apple, Google, or email.</p>
            <p className="mt-3"><strong className="text-zinc-300">Content you provide:</strong> photos and images you upload, text prompts, brand details (business name, logo, colors, phone, website, social handles), and the images you generate. Uploaded photos may contain people or faces if you choose to include them.</p>
            <p className="mt-3"><strong className="text-zinc-300">Purchase information:</strong> records of credit purchases and subscriptions. Payments are processed by Apple; we do not receive your full payment-card details.</p>
            <p className="mt-3"><strong className="text-zinc-300">Usage and device data:</strong> app interactions, feature usage, generation history, approximate diagnostics, device type, OS version, language, and similar technical data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">2. How We Use Information</h2>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>To provide, operate, and improve the Service and generate your requested Output.</li>
              <li>To manage your account, credits, and subscriptions.</li>
              <li>To provide customer support and respond to reports.</li>
              <li>To enforce our Terms, prevent abuse, and moderate content for safety.</li>
              <li>To send transactional messages (e.g. verification codes, password resets) and, where permitted, service notifications.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p className="mt-4">We do <strong className="text-zinc-300">not</strong> sell your personal information. We do not use Your Content to train our own AI models.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">3. How We Share Information</h2>
            <p>We share information with service providers strictly to operate the Service:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li><strong className="text-zinc-300">Cloud/backend &amp; storage</strong> (database, authentication, file storage, and serverless functions) to run the app.</li>
              <li><strong className="text-zinc-300">AI model and processing providers</strong> — your uploaded images and prompts are sent to third-party AI providers to generate or edit your Output.</li>
              <li><strong className="text-zinc-300">Apple / Google</strong> — for sign-in and in-app purchases.</li>
              <li><strong className="text-zinc-300">Email delivery providers</strong> — to send verification and account emails.</li>
            </ul>
            <p className="mt-3">These providers process data under their own privacy and security commitments. We may also disclose information to comply with law or protect our rights and users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">4. Camera, Photos &amp; Notifications</h2>
            <p>With your permission, the app accesses your camera and photo library so you can upload images, and may send push notifications (e.g. when a generation is ready). You can change these permissions anytime in your device Settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">5. Data Retention</h2>
            <p>We retain your account data and content while your account is active and as needed to provide the Service. When you delete your account in the app, we delete or anonymize your personal data within a reasonable period, except where we must retain it for legal, security, or accounting purposes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">6. Your Rights</h2>
            <p>Depending on where you live (e.g. under GDPR/KVKK), you may have rights to access, correct, delete, or port your data, and to object to or restrict certain processing. You can delete your account directly in the app (Settings → Delete account) or contact us at <a href="mailto:info@admov.io" className="text-violet hover:text-violet-light transition-colors">info@admov.io</a>. We will respond as required by applicable law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">7. International Transfers</h2>
            <p>Your information may be processed in countries other than your own, including where our service providers operate. We take steps to protect it consistent with this Policy and applicable law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">8. Security</h2>
            <p>We use reasonable technical and organizational measures to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">9. Children's Privacy</h2>
            <p>The Service is not directed to children under 13 (or the minimum age in your country), and we do not knowingly collect their data. If you believe a child has provided us information, contact us and we will delete it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">10. Changes to This Policy</h2>
            <p>We may update this Policy from time to time. Material changes will be posted here with a new "Last updated" date and, where appropriate, notified in the app.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">11. Contact</h2>
            <p>If you have questions about this Policy, you can reach us at:</p>
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
            <Link to="/privacy" className="text-sm text-violet hover:text-violet-light transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-zinc-400 hover:text-violet transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
