"use client";

import * as React from "react";
import { saveAdminContentToSupabase } from "@/lib/supabase/client";

const STORAGE_KEY = "admov_admin_content";

// The CMS blob is loosely typed on purpose: it is edited free-form in /admin and
// every consumer falls back to the bundled translations when a field is missing.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminContentValue = Record<string, any> | null;

const AdminContentContext = React.createContext<AdminContentValue>(null);

/** Provides the admin-edited content (fetched server-side in the root layout) to client components. */
export function AdminContentProvider({ value, children }: { value: AdminContentValue; children: React.ReactNode }) {
  return <AdminContentContext.Provider value={value}>{children}</AdminContentContext.Provider>;
}

/** Read admin-edited content. Returns null when no admin edits exist. */
export function useAdminContent() {
  const content = React.useContext(AdminContentContext);
  return { content, loading: false };
}

/** Save admin content to Supabase (keeps a localStorage copy as a convenience backup). */
export async function saveAdminContent(content: unknown) {
  const success = await saveAdminContentToSupabase(content);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    /* ignore */
  }
  return success;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Hero content for a language, with admin overrides. */
export function getAdminHero(adminContent: any, lang: string, fallback: any) {
  if (!adminContent?.hero?.[lang]) return fallback;
  const ah = adminContent.hero[lang];
  const stats = adminContent.hero.stats?.[lang] || fallback.stats;
  return {
    ...fallback,
    label: ah.label || fallback.label,
    headline1: ah.headline1 || fallback.headline1,
    headline2: ah.headline2 || fallback.headline2,
    subtext: ah.subtext || fallback.subtext,
    cta1: ah.cta1 || fallback.cta1,
    cta2: ah.cta2 || fallback.cta2,
    videoBadge: ah.videoBadge || fallback.videoBadge,
    videoSub: ah.videoSub || fallback.videoSub,
    marquee: ah.marquee || fallback.marquee,
    stats,
  };
}

/**
 * Pricing for a language, or `null` when the section should not be on the site.
 *
 * Pricing is off unless it is explicitly switched on in /admin *and* at least
 * one tier has a price, so the section can never ship with empty or unreviewed
 * figures. The nav and footer links use the same check, so the section and the
 * links that point at it appear and disappear together.
 */
export function getAdminPricing(adminContent: any, lang: string, fallback: any) {
  const admin = adminContent?.pricing;
  if (!admin?.enabled || !Array.isArray(admin.tiers)) return null;

  const tiers = admin.tiers
    .map((tier: any, i: number) => ({
      name: tier?.name?.[lang]?.trim() || fallback.tiers[i]?.name || "",
      price: String(tier?.price ?? "").trim(),
      tagline: tier?.tagline?.[lang]?.trim() || fallback.tiers[i]?.tagline || "",
      features: String(tier?.features?.[lang] ?? "")
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean),
    }))
    .filter((tier: { name: string }) => tier.name);

  if (!tiers.length || !tiers.some((tier: { price: string }) => tier.price)) return null;
  return { ...fallback, tiers };
}

/** Services content for a language, with admin overrides. */
export function getAdminServices(adminContent: any, lang: string, fallback: any) {
  if (!adminContent?.services?.[lang]) return fallback;
  const as = adminContent.services[lang];
  return {
    ...fallback,
    items: fallback.items.map((item: any, i: number) => ({
      ...item,
      title: as[i]?.title || item.title,
      desc: as[i]?.desc || item.desc,
    })),
  };
}

/** Work/projects content for a language, with admin overrides. */
export function getAdminWork(adminContent: any, lang: string, fallback: any) {
  if (!adminContent?.work?.projects) return fallback;
  const ap = adminContent.work.projects;
  return {
    ...fallback,
    projects: fallback.projects.map((project: any, i: number) => ({
      ...project,
      // client always comes from content.json (source of truth)
      client: project.client,
      category: ap[i]?.category?.[lang] || project.category,
      description: ap[i]?.description?.[lang] || project.description,
    })),
  };
}

/** Testimonials content for a language, with admin overrides. */
export function getAdminTestimonials(adminContent: any, lang: string, fallback: any) {
  if (!adminContent?.testimonials?.items) return fallback;
  const at = adminContent.testimonials.items;
  return {
    ...fallback,
    items: fallback.items.map((item: any, i: number) => ({
      ...item,
      quote: at[i]?.quote?.[lang] || item.quote,
      author: at[i]?.author || item.author,
      title: at[i]?.title?.[lang] || item.title,
      stars: at[i]?.stars ?? item.stars,
    })),
  };
}

/** Contact info with admin overrides. */
export function getAdminContact(adminContent: any) {
  if (!adminContent?.contact) return null;
  return adminContent.contact;
}

/** SEO data with admin overrides. */
export function getAdminSeo(adminContent: any) {
  if (!adminContent?.seo) return null;
  return adminContent.seo;
}
