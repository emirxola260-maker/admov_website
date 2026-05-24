import * as React from "react";
import {
  getAdminContentFromSupabase,
  subscribeToAdminContent,
  saveAdminContentToSupabase,
} from "@/lib/supabase";

const STORAGE_KEY = "admov_admin_content";

/**
 * Hook to read admin-edited content from Firebase.
 * Falls back to localStorage if Firebase is not available.
 * Returns null if no admin edits exist.
 */
export function useAdminContent() {
  const [content, setContent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Try to load from Supabase first
    const loadFromSupabase = async () => {
      try {
        const data = await getAdminContentFromSupabase();
        if (data) {
          setContent(data);
          // Also sync to localStorage as backup
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
          // Fall back to localStorage if no Supabase data
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            setContent(JSON.parse(raw));
          }
        }
      } catch (error) {
        console.error("Error loading from Supabase:", error);
        // Fall back to localStorage on error
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setContent(JSON.parse(raw));
        }
      } finally {
        setLoading(false);
      }
    };

    loadFromSupabase();

    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToAdminContent((data) => {
      if (data) {
        setContent(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    });

    return () => unsubscribe();
  }, []);

  return { content, loading };
}

/**
 * Save admin content to Supabase
 */
export async function saveAdminContent(content: any) {
  // Save to Supabase
  const success = await saveAdminContentToSupabase(content);
  // Also save to localStorage as backup
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  return success;
}

/**
 * Get hero content for a specific language, with admin overrides.
 */
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
    stats: stats,
  };
}

/**
 * Get services content for a specific language, with admin overrides.
 */
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

/**
 * Get work/projects content for a specific language, with admin overrides.
 */
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

/**
 * Get testimonials content for a specific language, with admin overrides.
 */
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

/**
 * Get contact info with admin overrides.
 */
export function getAdminContact(adminContent: any) {
  if (!adminContent?.contact) return null;
  return adminContent.contact;
}

/**
 * Get SEO data with admin overrides.
 */
export function getAdminSeo(adminContent: any) {
  if (!adminContent?.seo) return null;
  return adminContent.seo;
}
