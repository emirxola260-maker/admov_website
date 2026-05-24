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
          <h1 className="text-5xl md:text-6xl font-syne font-extrabold tracking-tight text-zinc-50 mb-4">Terms of Service</h1>
          <p className="text-zinc-400">Last updated: April 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">1. Agreement to Terms</h2>
            <p>By accessing or using ADMOV's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            <p className="mt-3">ADMOV reserves the right to modify these terms at any time. Continued use of our services following any changes constitutes your acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">2. Services</h2>
            <p>ADMOV provides AI-powered creative and business services including but not limited to:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>AI-generated video and photo production</li>
              <li>AI automation systems and workflow development</li>
              <li>LLM setup and integration</li>
              <li>Website and mobile app development</li>
              <li>Digital advertising management (Meta, Google, TikTok)</li>
              <li>Shopify and e-commerce solutions</li>
            </ul>
            <p className="mt-4">Specific deliverables, timelines, and pricing are defined in individual project agreements or proposals.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">3. Client Responsibilities</h2>
            <p>As a client, you agree to:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>Provide accurate and complete information necessary for service delivery</li>
              <li>Respond to requests for feedback or approval in a timely manner</li>
              <li>Ensure you have rights to any materials you provide to us (logos, brand assets, etc.)</li>
              <li>Make payments according to agreed schedules</li>
              <li>Not use our services for illegal, harmful, or deceptive purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">4. Intellectual Property</h2>
            <h3 className="text-lg font-syne font-bold text-violet mb-2">Deliverables</h3>
            <p>Upon full payment, you receive a license to use the deliverables created specifically for your project. Unless otherwise agreed in writing, ADMOV retains the underlying tools, templates, and processes used to create deliverables.</p>

            <h3 className="text-lg font-syne font-bold text-violet mb-2 mt-6">Portfolio Rights</h3>
            <p>ADMOV reserves the right to display completed work in our portfolio and marketing materials unless you request otherwise in writing prior to project commencement.</p>

            <h3 className="text-lg font-syne font-bold text-violet mb-2 mt-6">Third-Party Tools</h3>
            <p>Our services may utilize third-party AI tools and platforms. You are responsible for ensuring compliance with those platforms' terms of service for your use case.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">5. Payment Terms</h2>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>Pricing is outlined in individual project proposals</li>
              <li>A deposit may be required before project commencement</li>
              <li>Invoices are due within the timeframe specified in your agreement</li>
              <li>Late payments may result in project delays or suspension of services</li>
              <li>All fees are non-refundable unless otherwise agreed in writing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">6. Confidentiality</h2>
            <p>Both parties agree to keep confidential any proprietary or sensitive information shared during the course of the project. This includes business strategies, client data, pricing, and technical implementations.</p>
            <p className="mt-3">This confidentiality obligation does not apply to information that is publicly known, independently developed, or required to be disclosed by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, ADMOV shall not be liable for:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from third-party platform changes or outages</li>
              <li>Results from advertising campaigns (we do not guarantee specific ROI)</li>
            </ul>
            <p className="mt-4">Our total liability is limited to the amount paid for the specific service giving rise to the claim.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">8. Termination</h2>
            <p>Either party may terminate a project agreement with written notice. Upon termination:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
              <li>You will be billed for all work completed to date</li>
              <li>ADMOV will deliver any completed work upon receipt of outstanding payment</li>
              <li>Both parties will return or destroy confidential materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">9. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the competent courts.</p>
          </section>

          <section>
            <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">10. Contact</h2>
            <p>For questions about these Terms of Service, please reach out to us:</p>
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
            <Link to="/privacy" className="text-sm text-zinc-400 hover:text-violet transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-violet hover:text-violet-light transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
