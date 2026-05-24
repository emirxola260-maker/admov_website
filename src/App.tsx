import * as React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "@/i18n/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Showcase } from "@/components/Showcase";
import { Process } from "@/components/Process";
import { Work } from "@/components/Work";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = React.lazy(() => import("@/pages/PrivacyPolicy").then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = React.lazy(() => import("@/pages/TermsOfService").then(m => ({ default: m.TermsOfService })));
const AdminPage = React.lazy(() => import("@/admin/AdminPage").then(m => ({ default: m.AdminPage })));
const WorkPage = React.lazy(() => import("@/pages/WorkPage").then(m => ({ default: m.WorkPage })));

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function FontWrapper({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  return (
    <div
      className={lang === "ar" ? "font-changa" : ""}
      style={lang === "ar" ? { fontFamily: '"Changa", sans-serif' } : undefined}
    >
      {children}
    </div>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-violet/20 selection:text-violet relative">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Services />
        <Showcase />
        <Process />
        <Work />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <FontWrapper>
        <ScrollToTop />
        <React.Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </React.Suspense>
      </FontWrapper>
    </LanguageProvider>
  );
}
