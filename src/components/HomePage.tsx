import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Showcase } from "@/components/Showcase";
import { Process } from "@/components/Process";
import { Work } from "@/components/Work";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export function HomePage() {
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
