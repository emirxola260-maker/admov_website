"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AdmovMark } from "@/components/ui/Logo";
import { useLanguage } from "@/i18n/LanguageContext";
import { productShowcase } from "@/i18n/product-showcase";
import type { Product, ProductCategory } from "@/lib/products/types";
import { pickLang } from "@/lib/blog/utils";
import { sanitizeHttpUrl } from "@/lib/security";
import { isComingSoonBadge } from "@/lib/products/badges";
import { localePath } from "@/lib/i18n/paths";
import { ProductMedia } from "./ProductMedia";
import styles from "./products.module.css";

export function ProductsPage({ products }: { products: Product[] }) {
  const { t, lang } = useLanguage();
  const copy = productShowcase[lang];
  const [filter, setFilter] = React.useState<"all" | ProductCategory>("all");
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const visible = products.filter((p) => filter === "all" || p.category === filter);
  // Respect the CMS order and featured flag; no additional database fields.
  const featured = products.find((p) => p.featured && !p.badges.some(isComingSoonBadge))
    ?? products.find((p) => p.featured) ?? products[0];
  const showFeatured = featured && visible.some((p) => p.id === featured.id);
  const collection = visible.filter((p) => !showFeatured || p.id !== featured.id);

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <header className={styles.hero}>
          <AdmovMark outline className={styles.heroMark} />
          <div className={styles.eyebrow}><AdmovMark className={styles.brandMark} />{copy.studio}</div>
          <div className={styles.heroGrid}>
            <h1>{copy.title}<br /><span>{copy.titleAccent}</span></h1>
            <div className={styles.heroAside}>
              <p>{copy.intro}</p>
              <a href="#collection" className={styles.textLink}>{copy.collection}<ArrowDown size={16} aria-hidden /></a>
            </div>
          </div>
        </header>
        <section id="collection" className={styles.collection} data-featured={Boolean(showFeatured)} aria-label={copy.collection}>
          <div className={styles.toolbar}>
            <div className={styles.filters} role="group" aria-label={copy.filter}>
              {(["all", ...(categories.length > 1 ? categories : [])] as const).map((category) => (
                <button key={category} type="button" aria-pressed={filter === category} onClick={() => setFilter(category)}>
                  {category === "all" ? t.products.all : t.products.categories[category]}
                  <span>{category === "all" ? products.length : products.filter((p) => p.category === category).length}</span>
                </button>
              ))}
            </div>
            <p className={styles.collectionCount} role="status">{visible.length.toString().padStart(2, "0")} / {copy.count}</p>
          </div>
          {showFeatured && (
            <article id={featured.slug} className={styles.featured} aria-labelledby={`title-${featured.slug}`}>
              <div className={styles.featuredStory}>
                <div className={styles.featuredKicker}><span className={styles.chapterNumber} aria-hidden><AdmovMark className={styles.chapterMark} />{(products.indexOf(featured) + 1).toString().padStart(2, "0")}</span>{copy.selected}</div>
                <ProductIdentity product={featured} />
                <p className={styles.featuredTagline}>{pickLang(featured.tagline, lang)}</p>
                <ProductDescription product={featured} />
                <ProductAction product={featured} primary />
                <div className={styles.featuredFoot}><AdmovMark className={styles.brandMark} />{t.products.label}</div>
              </div>
              <ProductMedia product={featured} featured />
            </article>
          )}
          {collection.length > 0 && (
            <div className={styles.stories}>
              <div className={styles.sectionHeading}>
                <h2><AdmovMark className={styles.sectionMark} />{copy.collection}</h2><p>{copy.collectionIntro}</p>
              </div>
              <div className={styles.productGrid}>
                {collection.map((product, index) => (
                  <article key={product.id} id={product.slug} className={`${styles.product} ${index === collection.length - 1 && collection.length % 2 !== 0 ? styles.wideProduct : ""}`} aria-labelledby={`title-${product.slug}`}>
                    <ProductMedia product={product} />
                    <div className={styles.productStory}>
                      <div className={styles.productMeta}><span className={styles.chapterNumber} aria-hidden><AdmovMark className={styles.chapterMark} />{(products.indexOf(product) + 1).toString().padStart(2, "0")}</span><ProductStatus product={product} /></div>
                      <h3 id={`title-${product.slug}`} className={styles.productName}><bdi className="logo-text">{product.name}</bdi></h3>
                      <p className={styles.productTagline}>{pickLang(product.tagline, lang)}</p>
                      <ProductDescription product={product} />
                      <ProductAction product={product} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
          {visible.length === 0 && <p className={styles.empty}>{t.products.empty}</p>}
        </section>
        <aside className={styles.closing}>
          <AdmovMark outline className={styles.closingMark} />
          <div><h2>{copy.nextTitle}</h2><p>{copy.nextBody}</p></div>
          <Link href={`${localePath(lang, "/")}#contact`} className={styles.closingLink}>{copy.nextAction}<ArrowUpRight size={23} aria-hidden /></Link>
        </aside>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}

function ProductStatus({ product }: { product: Product }) {
  const { t, lang } = useLanguage();
  const soon = product.badges.some(isComingSoonBadge);
  const live = product.badges.some((badge) => badge.trim().toLowerCase() === "live");
  return <div className={styles.status}><span>{t.products.categories[product.category]}</span>{soon ? <span>{t.products.comingSoon}</span> : live ? <span className={styles.live}><i aria-hidden />{productShowcase[lang].live}</span> : null}</div>;
}

function ProductIdentity({ product }: { product: Product }) {
  const logo = sanitizeHttpUrl(product.logo_url);
  return <div className={styles.identity}>{logo && <img src={logo} alt="" width={44} height={44} />}<h2 id={`title-${product.slug}`}><bdi className="logo-text">{product.name}</bdi></h2><ProductStatus product={product} /></div>;
}

function ProductDescription({ product }: { product: Product }) {
  const { lang } = useLanguage();
  const description = pickLang(product.description, lang);
  if (!description) return null;
  return <details className={styles.description}><summary>{productShowcase[lang].details}<Plus size={16} aria-hidden /></summary><p>{description}</p></details>;
}

function ProductAction({ product, primary = false }: { product: Product; primary?: boolean }) {
  const { lang } = useLanguage();
  const copy = productShowcase[lang];
  const url = sanitizeHttpUrl(product.url);
  if (!url) return null;
  return <a href={url} target="_blank" rel="noopener noreferrer" className={primary ? styles.primaryLink : styles.productLink}>{product.badges.some(isComingSoonBadge) ? copy.preview : copy.open} <bdi>{product.name}</bdi><ArrowUpRight size={18} aria-hidden /></a>;
}
