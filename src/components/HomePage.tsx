import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ClientMarquee } from "@/components/ClientMarquee";
import { Services } from "@/components/Services";
import { TechStack } from "@/components/TechStack";
import { Products } from "@/components/Products";
import { Showcase } from "@/components/Showcase";
import { Process } from "@/components/Process";
import { Work } from "@/components/Work";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { LatestPosts } from "@/components/blog/LatestPosts";
import { FAQ } from "@/components/FAQ";
import { Contact } from "@/components/Contact";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Footer } from "@/components/Footer";
import type { Product } from "@/lib/products/types";
import type { PostSummary } from "@/lib/blog/types";

export function HomePage({ products, posts }: { products: Product[]; posts: PostSummary[] }) {
  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-violet/20 selection:text-violet relative">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <ClientMarquee />
        <Services />
        <TechStack />
        <Products products={products} />
        <Showcase />
        <Process />
        <Work />
        <Stats />
        <Testimonials />
        <LatestPosts posts={posts} />
        <FAQ />
        <Contact />
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
