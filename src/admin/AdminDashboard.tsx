"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Layers, Briefcase, MessageSquareQuote,
  AtSign, Search, LogOut, ChevronDown, Check, Save, Eye,
  BarChart3, Lightbulb, Image, Settings, Plus, Trash2, Star,
  ArrowRight, Globe, Loader2, Package, Newspaper, Tag, ShoppingBag, Megaphone, GraduationCap
} from "lucide-react";
import { Field, Input, Textarea, Toggle, Notice, Pill } from "./ui";
import { AppsEditor } from "./AppsEditor";
import { CoursesEditor } from "./CoursesEditor";
import { ProductsEditor } from "./ProductsEditor";
import { BlogEditor } from "./BlogEditor";
import { revalidateTags } from "@/lib/admin/api";
import { saveAdminContentToSupabase } from "@/lib/supabase/client";

type SectionId = "hero" | "services" | "work" | "work-page" | "testimonials" | "pricing" | "announcement" | "contact" | "seo" | "products" | "apps" | "courses" | "blog";
type LangTab = "en" | "ar" | "tr";

interface ContentData {
  hero: {
    en: { label: string; headline1: string; headline2: string; subtext: string; cta1: string; cta2: string; videoBadge: string; videoSub: string; marquee: string };
    ar: { label: string; headline1: string; headline2: string; subtext: string; cta1: string; cta2: string; videoBadge: string; videoSub: string; marquee: string };
    tr: { label: string; headline1: string; headline2: string; subtext: string; cta1: string; cta2: string; videoBadge: string; videoSub: string; marquee: string };
    stats: { en: string[]; ar: string[]; tr: string[] };
  };
  services: {
    en: { title: string; desc: string }[];
    ar: { title: string; desc: string }[];
    tr: { title: string; desc: string }[];
  };
  work: {
    projects: { client: string; category: { en: string; ar: string; tr: string }; description: { en: string; ar: string; tr: string }; imageUrl: string; videoUrl: string }[];
  };
  testimonials: {
    items: { quote: { en: string; ar: string; tr: string }; author: string; title: { en: string; ar: string; tr: string }; stars: number }[];
  };
  contact: { email: string; phone: string; instagram: string; tiktok: string; whatsapp: string };
  seo: { title: string; description: string; ogImage: string };
  announcement: {
    enabled: boolean;
    text: { en: string; ar: string; tr: string };
    /** "/apps" stays in the visitor's language; full URLs open in a new tab. */
    linkUrl: string;
    linkLabel: { en: string; ar: string; tr: string };
  };
  pricing: {
    /** The section stays off the site until this is switched on in /admin. */
    enabled: boolean;
    tiers: {
      name: { en: string; ar: string; tr: string };
      /** Shared across languages — one figure, e.g. "$750". Empty = quoted tier. */
      price: string;
      tagline: { en: string; ar: string; tr: string };
      /** One feature per line. */
      features: { en: string; ar: string; tr: string };
    }[];
  };
  workPage: {
    sections: {
      id: string;
      title: { en: string; ar: string; tr: string };
      subtitle: { en: string; ar: string; tr: string };
      projects: { client: string; category: { en: string; ar: string; tr: string }; description: { en: string; ar: string; tr: string }; imageUrl: string; videoUrl: string }[];
    }[];
  };
}

const defaultContent: ContentData = {
  hero: {
    en: { label: "AI Agency for Businesses", headline1: "We make AI work", headline2: "for your business", subtext: "From AI-generated videos and photos to full automation systems — ADMOV builds intelligent solutions that save time and drive results.", cta1: "Book a Free Call", cta2: "See Our Work", videoBadge: "AI Video Production", videoSub: "Watch our latest showreel", marquee: "✦ SMART ✦ DIGITAL ✦ SOLUTIONS ✦ FAST ✦ BUSINESS ✦ GROWTH ✦ AI ✦ AUTOMATION ✦" },
    ar: { label: "وكالة ذكاء اصطناعي للأعمال", headline1: "نجعل الذكاء الاصطناعي", headline2: "يعمل لصالح عملك", subtext: "من الفيديوهات والصور المولدة بالذكاء الاصطناعي إلى أنظمة الأتمتة الكاملة — ADMOV تبني حلولاً ذكية توفر الوقت وتحقق النتائج.", cta1: "احجز مكالمة مجانية", cta2: "شاهد أعمالنا", videoBadge: "إنتاج فيديو بالذكاء الاصطناعي", videoSub: "شاهد أحدث أعملنا", marquee: "✦ حلول ✦ رقمية ✦ ذكية ✦ نمو ✦ سريع ✦ للأعمال ✦ أتمتة ✦ بالذكاء ✦ الاصطناعي ✦" },
    tr: { label: "İşletmeler İçin Yapay Zeka Ajansı", headline1: "Yapay zekayı işiniz", headline2: "için çalıştırıyoruz", subtext: "Yapay zeka ile üretilen video ve fotoğraflardan tam otomasyon sistemlerine kadar — ADMOV zaman kazandıran ve sonuç getiren akıllı çözümler üretir.", cta1: "Ücretsiz Görüşme", cta2: "Projelerimizi Gör", videoBadge: "AI Video Üretimi", videoSub: "Son çalışmalarımızı izleyin", marquee: "✦ AKILLI ✦ DİJİTAL ✦ ÇÖZÜMLER ✦ HIZLI ✦ İŞ ✦ BÜYÜMESİ ✦ YAPAY ✦ ZEKA ✦ OTOMASYON ✦" },
    stats: {
      en: ["8+ Years Experience", "20+ Clients Served"],
      ar: ["8+ سنوات خبرة", "20+ عميل"],
      tr: ["8+ Yıl Deneyim", "20+ Müşteri"],
    },
  },
  announcement: {
    enabled: false,
    text: { en: "", ar: "", tr: "" },
    linkUrl: "",
    linkLabel: { en: "", ar: "", tr: "" },
  },
  pricing: {
    enabled: false,
    tiers: [
      {
        name: { en: "Starter", ar: "البداية", tr: "Başlangıç" },
        price: "",
        tagline: { en: "One service, done properly.", ar: "خدمة واحدة، منفَّذة باحتراف.", tr: "Tek hizmet, hakkıyla yapılmış." },
        features: {
          en: "One AI video or photo package\nTwo rounds of revisions\nDelivery in 5–7 business days\nFull commercial usage rights",
          ar: "باقة فيديو أو صور واحدة بالذكاء الاصطناعي\nجولتا تعديلات\nالتسليم خلال ٥–٧ أيام عمل\nحقوق استخدام تجاري كاملة",
          tr: "Bir AI video veya fotoğraf paketi\nİki revizyon turu\n5–7 iş gününde teslim\nTam ticari kullanım hakkı",
        },
      },
      {
        name: { en: "Growth", ar: "النمو", tr: "Büyüme" },
        price: "",
        tagline: { en: "Content and automation working together.", ar: "المحتوى والأتمتة يعملان معاً.", tr: "İçerik ve otomasyon birlikte çalışır." },
        features: {
          en: "Everything in Starter\nMonthly content package\nOne automation workflow (n8n or Make)\nPriority delivery\nMonthly performance review",
          ar: "كل ما في باقة البداية\nباقة محتوى شهرية\nسير عمل أتمتة واحد (n8n أو Make)\nأولوية في التسليم\nمراجعة أداء شهرية",
          tr: "Başlangıç paketindeki her şey\nAylık içerik paketi\nBir otomasyon akışı (n8n veya Make)\nÖncelikli teslim\nAylık performans değerlendirmesi",
        },
      },
      {
        name: { en: "Full Business", ar: "الأعمال الكاملة", tr: "Tam İşletme" },
        price: "",
        tagline: { en: "We run your content and operations end to end.", ar: "ندير المحتوى والعمليات من البداية إلى النهاية.", tr: "İçeriğinizi ve operasyonlarınızı uçtan uca yönetiriz." },
        features: {
          en: "Everything in Growth\nPaid ads managed end to end\nWebsite or Shopify build and upkeep\nCustom LLM setup and integration\nA dedicated point of contact",
          ar: "كل ما في باقة النمو\nإدارة الإعلانات المدفوعة بالكامل\nبناء وصيانة موقع أو متجر شوبيفاي\nإعداد ودمج نماذج لغوية مخصصة\nمسؤول حساب مخصص",
          tr: "Büyüme paketindeki her şey\nUçtan uca reklam yönetimi\nWeb sitesi veya Shopify kurulumu ve bakımı\nÖzel LLM kurulumu ve entegrasyonu\nSize özel bir muhatap",
        },
      },
    ],
  },
  services: {
    en: [
      { title: "AI Generated Videos", desc: "Cinematic, scroll-stopping video content produced entirely with AI." },
      { title: "AI Generated Photos", desc: "Product photography and ad creatives generated at scale." },
      { title: "AI Automation Systems", desc: "Custom AI agents and automated workflows." },
      { title: "LLM Setup & Integration", desc: "Deploy and configure large language models." },
      { title: "Website Development", desc: "Fast, beautiful, conversion-optimized websites." },
      { title: "App Development", desc: "Cross-platform mobile apps (Flutter)." },
      { title: "Meta, Google & TikTok Ads", desc: "Data-driven paid advertising campaigns." },
      { title: "Shopify & E-Commerce", desc: "Full Shopify store setup and management." },
    ],
    ar: [
      { title: "فيديوهات بالذكاء الاصطناعي", desc: "محتوى فيديو سينمائي يُنتج بالكامل بالذكاء الاصطناعي." },
      { title: "صور بالذكاء الاصطناعي", desc: "تصوير المنتجات والإبداعات الإعلانية على نطاق واسع." },
      { title: "أنظمة أتمتة الذكاء الاصطناعي", desc: "وكلاء ذكاء اصطناعي مخصصون وسير عمل آلي." },
      { title: "إعداد ودمج نماذج اللغة الكبيرة", desc: "نشر وتكوين نماذج اللغة الكبيرة." },
      { title: "تطوير المواقع الإلكترونية", desc: "مواقع سريعة وجميلة ومحسنة للتحويل." },
      { title: "تطوير التطبيقات", desc: "تطبيقات جوال متعددة المنصات (Flutter)." },
      { title: "إعلانات ميتا وجوجل وتيك توك", desc: "حملات إعلانية مدفوعة مبنية على البيانات." },
      { title: "شوبيفاي والتجارة الإلكترونية", desc: "إعداد متجر شوبيفاي كامل وإدارته." },
    ],
    tr: [
      { title: "AI ile Video Üretimi", desc: "Tamamen yapay zeka ile üretilen sinematik video içerikler." },
      { title: "AI ile Fotoğraf Üretimi", desc: "Ölçekli ürün fotoğrafçılığı ve reklam kreatifleri." },
      { title: "AI Otomasyon Sistemleri", desc: "Özel AI ajanları ve otomatik iş akışları." },
      { title: "LLM Kurulum ve Entegrasyon", desc: "Büyük dil modellerinin kurulumu ve yapılandırması." },
      { title: "Web Sitesi Geliştirme", desc: "Hızlı, güzel ve dönüşüm odaklı web siteleri." },
      { title: "Uygulama Geliştirme", desc: "Çok platformlu mobil uygulamalar (Flutter)." },
      { title: "Meta, Google & TikTok Reklamları", desc: "Veri odaklı ücretli reklam kampanyaları." },
      { title: "Shopify & E-Ticaret", desc: "Tam Shopify mağaza kurulumu ve yönetimi." },
    ],
  },
  work: {
    projects: [
      { client: "Belind Perfumes", category: { en: "AI Videos", ar: "فيديوهات AI", tr: "AI Videoları" }, description: { en: "AI-generated video ad campaign that increased social engagement significantly.", ar: "حملة إعلانية بالفيديو مولدة بالذكاء الاصطناعي.", tr: "Sosyal etkileşimi artıran AI video reklam kampanyası." }, imageUrl: "", videoUrl: "" },
      { client: "Riviera", category: { en: "AI Photos & Branding", ar: "صور AI وعلامة تجارية", tr: "AI Fotoğraf & Marka" }, description: { en: "Complete brand visual identity with AI-generated photography.", ar: "هوية بصرية كاملة مع تصوير مولد بالذكاء الاصطناعي.", tr: "AI ile üretilmiş fotoğrafçılık ile kapsamlı marka kimliği." }, imageUrl: "", videoUrl: "" },
      { client: "Bokhoor", category: { en: "AI Content", ar: "محتوى AI", tr: "AI İçerik" }, description: { en: "AI-powered content pipeline producing unique assets weekly.", ar: "خط إنتاج محتوى مدعوم بالذكاء الاصطناعي.", tr: "Haftalık benzersiz varlıklar üreten AI içerik hattı." }, imageUrl: "", videoUrl: "" },
      { client: "TipTob", category: { en: "E-Commerce", ar: "تجارة إلكترونية", tr: "E-Ticaret" }, description: { en: "Full Shopify store build with automated inventory management.", ar: "بناء متجر شوبيفاي كامل مع إدارة مخزون آلية.", tr: "Otomatik envanter yönetimi ile Shopify mağaza kurulumu." }, imageUrl: "", videoUrl: "" },
      { client: "Kyom", category: { en: "AI Automation", ar: "أتمتة AI", tr: "AI Otomasyon" }, description: { en: "Custom AI agent system automating customer support.", ar: "نظام وكيل ذكاء اصطناعي مخصص.", tr: "Müşteri desteğini otomatikleştiren AI ajan sistemi." }, imageUrl: "", videoUrl: "" },
      { client: "Shopify Client", category: { en: "Full Store Management", ar: "إدارة متجر كاملة", tr: "Tam Mağaza Yönetimi" }, description: { en: "End-to-end Shopify management including product launch.", ar: "إدارة شوبيفاي شاملة تشمل إطلاق المنتجات.", tr: "Ürün lansmanı dahil uçtan uca Shopify yönetimi." }, imageUrl: "", videoUrl: "" },
    ],
  },
  testimonials: {
    items: [
      { quote: { en: "ADMOV transformed our product visuals — we cut photography costs by 80%.", ar: "ADMOV حولت صور منتجاتنا — خفضنا تكاليف التصوير بنسبة 80%.", tr: "ADMOV ürün görsellerimizi dönüştürdü — fotoğraf maliyetlerini %80 azalttık." }, author: "Sarah M.", title: { en: "E-commerce Brand Owner", ar: "صاحبة علامة تجارية إلكترونية", tr: "E-ticaret Marka Sahibi" }, stars: 5 },
      { quote: { en: "The automation system saves us 20+ hours per week. Incredible ROI.", ar: "نظام الأتمتة يوفر لنا أكثر من 20 ساعة أسبوعياً.", tr: "Otomasyon sistemi bize haftada 20+ saat kazandırıyor." }, author: "James K.", title: { en: "SaaS Startup Founder", ar: "مؤسس شركة SaaS ناشئة", tr: "SaaS Startup Kurucusu" }, stars: 5 },
      { quote: { en: "Best AI video content we've ever had.", ar: "أفضل محتوى فيديو بالذكاء الاصطناعي.", tr: "Şimdiye kadar sahip olduğumuz en iyi AI video içeriği." }, author: "Nadia R.", title: { en: "Marketing Agency Director", ar: "مديرة وكالة تسويق", tr: "Pazarlama Ajansı Direktörü" }, stars: 5 },
      { quote: { en: "Professional, fast, and results-driven. ADMOV delivered beyond expectations.", ar: "محترفون وسريعون. ADMOV تجاوزت التوقعات.", tr: "Profesyonel, hızlı ve sonuç odaklı." }, author: "Ahmed B.", title: { en: "Retail Business Owner", ar: "صاحب متجر تجزئة", tr: "Perakende İşletme Sahibi" }, stars: 5 },
    ],
  },
  contact: { email: "info@admov.io", phone: "", instagram: "https://www.instagram.com/admov.io", tiktok: "https://www.tiktok.com/@admov.io", whatsapp: "https://wa.me/905375755445" },
  seo: { title: "ADMOV — Let AI do the Work", description: "B2B AI agency specializing in AI-generated videos, photos, and automation systems.", ogImage: "" },
  workPage: { sections: [] },
};

const sidebarItems: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: "hero", label: "Hero Section", icon: <LayoutDashboard size={18} /> },
  { id: "services", label: "Services", icon: <Layers size={18} /> },
  { id: "work", label: "Work", icon: <Briefcase size={18} /> },
  { id: "work-page", label: "Work Page", icon: <Image size={18} /> },
  { id: "testimonials", label: "Testimonials", icon: <MessageSquareQuote size={18} /> },
  { id: "pricing", label: "Pricing", icon: <Tag size={18} /> },
  { id: "announcement", label: "Announcement Bar", icon: <Megaphone size={18} /> },
  { id: "contact", label: "Contact Info", icon: <AtSign size={18} /> },
  { id: "seo", label: "SEO & Meta", icon: <Search size={18} /> },
  { id: "products", label: "Products", icon: <Package size={18} /> },
  { id: "apps", label: "Apps & Store", icon: <ShoppingBag size={18} /> },
  { id: "courses", label: "Courses", icon: <GraduationCap size={18} /> },
  { id: "blog", label: "Blog & AI Writer", icon: <Newspaper size={18} /> },
];

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = React.useState<SectionId>("hero");
  const [activeLang, setActiveLang] = React.useState<LangTab>("en");
  const [content, setContent] = React.useState<ContentData>(defaultContent);
  const [saved, setSaved] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  // Deep links from Telegram / the site: /admin#blog, /admin#products
  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "blog" || hash === "products" || hash === "apps" || hash === "courses") setActiveSection(hash);
  }, []);

  // Load content from Supabase on mount
  React.useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      // Try to load from Supabase first
      let loadedFromSupabase = false;
      try {
        const { getAdminContentFromSupabase } = await import("@/lib/supabase/client");
        const data = await getAdminContentFromSupabase();
        if (isMounted && data) {
          loadedFromSupabase = true;
          setContent({
            ...defaultContent,
            ...data,
            hero: { ...defaultContent.hero, ...(data.hero || {}) },
            services: { ...defaultContent.services, ...(data.services || {}) },
            work: { ...defaultContent.work, ...(data.work || {}) },
            testimonials: { ...defaultContent.testimonials, ...(data.testimonials || {}) },
            contact: { ...defaultContent.contact, ...(data.contact || {}) },
            seo: { ...defaultContent.seo, ...(data.seo || {}) },
            pricing: { ...defaultContent.pricing, ...(data.pricing || {}) },
            announcement: { ...defaultContent.announcement, ...(data.announcement || {}) },
          });
          try {
            localStorage.setItem("admov_admin_content", JSON.stringify(data));
          } catch {
            /* ignore quota errors */
          }
        }
      } catch (error) {
        console.error("Error loading from Supabase:", error);
      }

      // Only fall back to localStorage if Supabase was unavailable or returned nothing
      if (!loadedFromSupabase && isMounted) {
        try {
          const saved = localStorage.getItem("admov_admin_content");
          if (saved) {
            const parsed = JSON.parse(saved);
            setContent({
              ...defaultContent,
              ...parsed,
              hero: { ...defaultContent.hero, ...(parsed.hero || {}) },
              services: { ...defaultContent.services, ...(parsed.services || {}) },
              work: { ...defaultContent.work, ...(parsed.work || {}) },
              testimonials: { ...defaultContent.testimonials, ...(parsed.testimonials || {}) },
              contact: { ...defaultContent.contact, ...(parsed.contact || {}) },
              seo: { ...defaultContent.seo, ...(parsed.seo || {}) },
              pricing: { ...defaultContent.pricing, ...(parsed.pricing || {}) },
              announcement: { ...defaultContent.announcement, ...(parsed.announcement || {}) },
            });
          }
        } catch (e) {
          console.error("Error loading from localStorage:", e);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadContent();

    // Set up subscription for real-time updates (disabled in admin to prevent overwriting local edits)
    // The subscription is only used on the public site, not in admin
    // const unsubscribe = subscribeToAdminContent((data) => {
    //   if (data) {
    //     setContent((prev) => ({
    //       ...defaultContent,
    //       ...data,
    //       hero: { ...defaultContent.hero, ...(data.hero || {}) },
    //       services: { ...defaultContent.services, ...(data.services || {}) },
    //       work: { ...defaultContent.work, ...(data.work || {}) },
    //       testimonials: { ...defaultContent.testimonials, ...(data.testimonials || {}) },
    //       contact: { ...defaultContent.contact, ...(data.contact || {}) },
    //       seo: { ...defaultContent.seo, ...(data.seo || {}) },
    //     }));
    //   }
    // });

    return () => {
      isMounted = false;
      // unsubscribe();
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const success = await saveAdminContentToSupabase(content);
      if (!success) {
        setSaveError("Save failed — your changes were NOT published. Make sure you are signed in as an allow-listed admin (public.admins) and try again.");
        return;
      }
      localStorage.setItem("admov_admin_content", JSON.stringify(content));
      await revalidateTags(["admin-content"]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const sectionTitles: Record<SectionId, string> = {
    hero: "Hero Section Editor",
    services: "Services Editor",
    work: "Work & Projects Editor",
    "work-page": "Work Page Manager",
    testimonials: "Testimonials Editor",
    pricing: "Pricing Editor",
    announcement: "Announcement Bar",
    contact: "Contact Information",
    seo: "SEO & Meta Tags",
    products: "Products",
    apps: "Apps & Store",
    courses: "Courses",
    blog: "Blog & AI Writer",
  };

  const sectionDescs: Record<SectionId, string> = {
    hero: "Customize your primary entrance. Changes are saved locally until published.",
    services: "Manage your service offerings across all languages.",
    work: "Showcase your best projects and case studies.",
    "work-page": "Manage sections and projects on the dedicated /work page. Add sections, add projects with images and videos.",
    testimonials: "Manage client testimonials and social proof.",
    pricing: "Set your package prices. The section stays off the website until you switch it on here.",
    announcement: "A thin bar above the navbar on every page. Visitors can close it; change the message and it shows again.",
    contact: "Update your contact details and social links.",
    seo: "Optimize search engine visibility and meta information.",
    products: "Your own apps, SaaS and websites shown in the Products section and on /products. Changes go live immediately.",
    apps: "Everything you sell on /apps. Store listings link to the App Store or Google Play; the other kinds are paid through Stripe.",
    courses: "Training courses sold on /courses through Stripe. Keep a course as a draft until it has a price, then publish it.",
    blog: "Review AI-generated drafts, edit them per language, publish, and queue topics for the daily writer.",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#FCF9F8" }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-[#5749C2]" />
          <p className="text-stone-500 text-sm font-medium">Loading content from Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Manrope', sans-serif", backgroundColor: "#FCF9F8", color: "#1B1C1C" }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-[#1B1C1C] text-stone-300 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-8">
          <div className="text-2xl font-black uppercase tracking-tighter text-white" style={{ fontFamily: 'var(--next-font-syne), sans-serif' }}>
            ADMOV
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-widest text-stone-500 font-bold">Content Management</div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`group w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-[#5749C2] text-white"
                  : "hover:bg-white/5 hover:text-white text-stone-400"
              }`}
            >
              <span className={`mr-3 ${activeSection === item.id ? "text-white" : "opacity-60 group-hover:opacity-100"}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={onLogout}
            className="group flex items-center px-4 py-2 text-xs font-semibold uppercase tracking-widest text-stone-500 hover:text-[#5749C2] transition-colors w-full"
          >
            <LogOut size={14} className="mr-3" />
            Admin Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* TopBar */}
        <header className="h-20 bg-white/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10 shadow-[0px_20px_40px_rgba(27,28,28,0.04)]">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#1B1C1C]"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <h1 className="text-xl font-extrabold tracking-tight text-[#1B1C1C]" style={{ fontFamily: 'var(--next-font-syne), sans-serif' }}>
              Admin Dashboard
            </h1>
            <span className="px-2 py-0.5 bg-[#F6F3F2] text-[10px] font-bold uppercase tracking-wider rounded text-stone-500 hidden sm:inline">
              Editor V2.4
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="/"
              target="_blank"
              className="px-4 lg:px-6 py-2.5 text-sm font-semibold border-2 border-[#5749C2]/20 text-[#5749C2] rounded-xl hover:bg-[#5749C2]/5 transition-all duration-300 active:scale-95 flex items-center gap-2"
            >
              <Eye size={16} />
              <span className="hidden sm:inline">Preview</span>
            </a>
            {!["products", "blog", "apps", "courses"].includes(activeSection) && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 lg:px-6 py-2.5 text-sm font-semibold bg-gradient-to-br from-[#5749C2] to-[#7063DC] text-white rounded-xl shadow-lg shadow-[#5749C2]/20 hover:opacity-90 transition-all duration-300 active:scale-90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
              <span className="hidden sm:inline">{saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}</span>
            </button>
            )}
          </div>
        </header>
        {saveError && (
          <div className="px-6 lg:px-10 pt-6">
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">{saveError}</div>
          </div>
        )}

        <div className="p-6 lg:p-10 max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tighter mb-4" style={{ fontFamily: 'var(--next-font-syne), sans-serif' }}>
                {sectionTitles[activeSection]}
              </h2>
              <p className="text-[#474553] font-light max-w-2xl leading-relaxed text-sm">
                {sectionDescs[activeSection]}
              </p>
            </div>

            {/* Language Tabs - only for content sections */}
            {["hero", "services", "work", "work-page", "testimonials", "pricing", "announcement", "products", "apps", "courses", "blog"].includes(activeSection) && (
              <div className="bg-[#F6F3F2] p-1.5 rounded-2xl flex items-center shadow-sm shrink-0">
                {(["en", "ar", "tr"] as LangTab[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-4 lg:px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${
                      activeLang === lang
                        ? "bg-white text-[#5749C2] shadow-sm"
                        : "text-stone-500 hover:text-[#1B1C1C]"
                    }`}
                  >
                    {lang === "en" ? "English" : lang === "ar" ? "Arabic" : "Turkish"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {activeSection === "hero" && (
                <HeroEditor content={content} setContent={setContent} lang={activeLang} />
              )}
              {activeSection === "services" && (
                <ServicesEditor content={content} setContent={setContent} lang={activeLang} />
              )}
              {activeSection === "work" && (
                <WorkEditor content={content} setContent={setContent} lang={activeLang} />
              )}
              {activeSection === "work-page" && (
                <WorkPageEditor content={content} setContent={setContent} lang={activeLang} />
              )}
              {activeSection === "testimonials" && (
                <TestimonialsEditor content={content} setContent={setContent} lang={activeLang} />
              )}
              {activeSection === "announcement" && (
                <AnnouncementEditor content={content} setContent={setContent} lang={activeLang} />
              )}
              {activeSection === "pricing" && (
                <PricingEditor content={content} setContent={setContent} lang={activeLang} />
              )}
              {activeSection === "contact" && (
                <ContactEditor content={content} setContent={setContent} />
              )}
              {activeSection === "seo" && (
                <SeoEditor content={content} setContent={setContent} />
              )}
              {activeSection === "products" && <ProductsEditor lang={activeLang} />}
              {activeSection === "apps" && <AppsEditor lang={activeLang} />}
              {activeSection === "courses" && <CoursesEditor lang={activeLang} />}
              {activeSection === "blog" && <BlogEditor lang={activeLang} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dashboard Footer */}
        <footer className="mt-20 border-t border-[#eae7e7] px-6 lg:px-10 py-8 flex flex-col md:flex-row justify-between items-center text-stone-400 text-xs font-medium gap-4">
          <span>&copy; {new Date().getFullYear()} ADMOV Admin Interface. All rights reserved.</span>
          <div className="flex items-center space-x-8">
            <a href="/" className="hover:text-[#5749C2] transition-colors">Back to Site</a>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ─────────────── Field Components ─────────────── */

function FieldLabel({ children, primary = false }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <label className={`block text-[11px] font-bold uppercase tracking-widest mb-3 ${primary ? "text-[#5749C2]" : "text-stone-400"}`}>
      {children}
    </label>
  );
}

function TextField({ label, value, onChange, primary = false, large = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; primary?: boolean; large?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <FieldLabel primary={primary}>{label}</FieldLabel>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-[#eae7e7] border-none rounded-xl px-5 py-4 text-[#1B1C1C] placeholder:opacity-50 focus:ring-2 focus:ring-[#5749C2]/20 transition-all outline-none ${large ? "text-2xl font-extrabold" : "text-sm"}`}
        style={large ? { fontFamily: 'var(--next-font-syne), sans-serif' } : {}}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4, primary = false }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; primary?: boolean;
}) {
  return (
    <div>
      <FieldLabel primary={primary}>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-[#eae7e7] border-none rounded-xl px-5 py-4 text-[#1B1C1C] leading-relaxed font-light focus:ring-2 focus:ring-[#5749C2]/20 transition-all outline-none text-sm resize-none"
      />
    </div>
  );
}

function LangIndicator({ lang }: { lang: LangTab }) {
  const labels: Record<LangTab, string> = { en: "English Content", ar: "Arabic Content (RTL)", tr: "Turkish Content" };
  return (
    <div className="mb-8 flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5749C2]/40">
        Editing: {labels[lang]}
      </span>
      <Globe size={18} className="text-[#5749C2]/40" />
    </div>
  );
}

/* ─────────────── Section Editors ─────────────── */

function HeroEditor({ content, setContent, lang }: { content: ContentData; setContent: (c: ContentData) => void; lang: LangTab }) {
  const hero = content.hero[lang];
  const updateField = (field: string, value: string) => {
    setContent({ ...content, hero: { ...content.hero, [lang]: { ...hero, [field]: value } } });
  };
  const updateStat = (index: number, value: string) => {
    const newStats = { ...content.hero.stats };
    newStats[lang] = [...newStats[lang]];
    newStats[lang][index] = value;
    setContent({ ...content, hero: { ...content.hero, stats: newStats } });
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8 space-y-8">
        {/* Content Card */}
        <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)]" dir={lang === "ar" ? "rtl" : "ltr"}>
          <LangIndicator lang={lang} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TextField label="Label Text" value={hero.label} onChange={(v) => updateField("label", v)} primary />
            <div>
              <FieldLabel>Accent Color</FieldLabel>
              <div className="flex items-center space-x-3" dir="ltr">
                <div className="w-12 h-12 rounded-xl bg-[#5749C2] shadow-inner shrink-0" />
                <input type="text" value="#5749C2" readOnly className="flex-1 bg-[#eae7e7] border-none rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-[#5749C2]/20 transition-all outline-none" />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <TextField label="Headline Line 1" value={hero.headline1} onChange={(v) => updateField("headline1", v)} primary large />
            </div>
            <div className="col-span-1 md:col-span-2">
              <TextField label="Headline Line 2" value={hero.headline2} onChange={(v) => updateField("headline2", v)} primary large />
            </div>
            <div className="col-span-1 md:col-span-2">
              <TextArea label="Subtext Description" value={hero.subtext} onChange={(v) => updateField("subtext", v)} />
            </div>
            <TextField label="Primary CTA" value={hero.cta1} onChange={(v) => updateField("cta1", v)} primary />
            <TextField label="Secondary CTA" value={hero.cta2} onChange={(v) => updateField("cta2", v)} />
            <TextField label="Video Badge" value={hero.videoBadge} onChange={(v) => updateField("videoBadge", v)} />
            <TextField label="Video Subtitle" value={hero.videoSub} onChange={(v) => updateField("videoSub", v)} />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#F6F3F2] p-8 lg:p-10 rounded-[20px]">
          <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center" style={{ fontFamily: 'var(--next-font-syne), sans-serif' }}>
            <BarChart3 size={20} className="mr-3 text-[#5749C2]" />
            Performance Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.hero.stats[lang].map((stat, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-sm">
                <label className="block text-[10px] font-bold uppercase text-stone-400 mb-2">Stat {i + 1}</label>
                <input
                  type="text"
                  value={stat}
                  onChange={(e) => updateStat(i, e.target.value)}
                  className="text-xl font-extrabold w-full border-none p-0 focus:ring-0 bg-transparent outline-none"
                  style={{ fontFamily: 'var(--next-font-syne), sans-serif' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-12 lg:col-span-4 space-y-8">
        {/* Hero Image */}
        <div className="bg-white p-8 rounded-[20px] shadow-sm">
          <FieldLabel>Hero Background Video</FieldLabel>
          <div className="aspect-video rounded-xl overflow-hidden relative group mb-4 bg-[#eae7e7]">
            <video src="/hero-video.mp4" muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-[#5749C2]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white text-[#1B1C1C] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer">
                Change Video
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-stone-400">
            <Image size={14} />
            <span>Recommended: 1920x1080px, MP4</span>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white p-8 rounded-[20px] shadow-sm space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Section Settings</h4>
          <ToggleRow label="Show Bottom Gradient" defaultOn />
          <ToggleRow label="Enable Parallax Effect" defaultOn={false} />
          <ToggleRow label="Floating UI Elements" defaultOn />
        </div>

        {/* AI Insight */}
        <div className="bg-[#5749C2]/5 p-6 rounded-[20px] border border-[#5749C2]/10">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 rounded-full bg-[#5749C2] animate-pulse mr-3" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5749C2]">AI Insight</span>
          </div>
          <p className="text-xs text-[#5D54A0] leading-relaxed font-medium">
            "Your headline score is 84/100. Consider using more action-oriented verbs like 'Transform' or 'Elevate' to improve conversion rates by up to 12%."
          </p>
        </div>
      </div>
    </div>
  );
}

function ServicesEditor({ content, setContent, lang }: { content: ContentData; setContent: (c: ContentData) => void; lang: LangTab }) {
  const services = content.services[lang];
  const icons = ["🎬", "🖼️", "⚡", "🧠", "🌐", "📱", "📣", "🛍️"];

  const updateService = (index: number, field: "title" | "desc", value: string) => {
    const newServices = { ...content.services };
    newServices[lang] = [...newServices[lang]];
    newServices[lang][index] = { ...newServices[lang][index], [field]: value };
    setContent({ ...content, services: newServices });
  };

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)]">
        <LangIndicator lang={lang} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <div key={i} className="p-6 bg-[#F6F3F2] rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icons[i]}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Service {i + 1}</span>
              </div>
              <input
                type="text"
                value={service.title}
                onChange={(e) => updateService(i, "title", e.target.value)}
                className="w-full bg-white border-none rounded-lg px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-[#5749C2]/20 outline-none"
              />
              <textarea
                value={service.desc}
                onChange={(e) => updateService(i, "desc", e.target.value)}
                rows={3}
                className="w-full bg-white border-none rounded-lg px-4 py-3 text-sm font-light leading-relaxed focus:ring-2 focus:ring-[#5749C2]/20 outline-none resize-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkEditor({ content, setContent, lang }: { content: ContentData; setContent: (c: ContentData) => void; lang: LangTab }) {
  const updateProject = (index: number, field: "client" | "category" | "description", value: string) => {
    const newProjects = [...content.work.projects];
    if (field === "client") {
      newProjects[index] = { ...newProjects[index], client: value };
    } else {
      newProjects[index] = { ...newProjects[index], [field]: { ...newProjects[index][field], [lang]: value } };
    }
    setContent({ ...content, work: { projects: newProjects } });
  };

  const updateMedia = (index: number, field: "imageUrl" | "videoUrl", value: string) => {
    const newProjects = [...content.work.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setContent({ ...content, work: { projects: newProjects } });
  };

  return (
    <div className="space-y-6">
      {/* Media Management Card */}
      <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)]">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5749C2]/40">Media & Assets</span>
          <Image size={18} className="text-[#5749C2]/40" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {content.work.projects.map((project, i) => (
            <div key={i} className="group relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#eae7e7] relative">
                {project.videoUrl ? (
                  <video src={project.videoUrl} muted playsInline className="w-full h-full object-cover" />
                ) : project.imageUrl ? (
                  <img src={project.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Image size={24} className="mx-auto mb-2 text-stone-400" />
                      <span className="text-[10px] text-stone-400 font-medium">No media</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs font-bold">Edit Media</span>
                </div>
                {project.videoUrl && (
                  <div className="absolute top-2 right-2 bg-red-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    VIDEO
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs font-semibold truncate">{project.client}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-project editors with language + media */}
      <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)]" dir={lang === "ar" ? "rtl" : "ltr"}>
        <LangIndicator lang={lang} />
        <div className="space-y-6">
          {content.work.projects.map((project, i) => (
            <div key={i} className="p-6 bg-[#F6F3F2] rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={14} className="text-[#5749C2]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {i < 2 ? `Featured Project ${i + 1}` : `Project ${i + 1}`}
                  </span>
                </div>
                {i < 2 && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#5749C2] bg-[#5749C2]/10 px-2 py-1 rounded-full">
                    Large Card
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-stone-400 mb-1 block">Client Name</label>
                  <input
                    type="text"
                    value={project.client}
                    onChange={(e) => updateProject(i, "client", e.target.value)}
                    className="w-full bg-white border-none rounded-lg px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-[#5749C2]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-stone-400 mb-1 block">Category</label>
                  <input
                    type="text"
                    value={project.category[lang]}
                    onChange={(e) => updateProject(i, "category", e.target.value)}
                    className="w-full bg-white border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5749C2]/20 outline-none"
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-stone-400 mb-1 block">Description</label>
                  <textarea
                    value={project.description[lang]}
                    onChange={(e) => updateProject(i, "description", e.target.value)}
                    rows={2}
                    className="w-full bg-white border-none rounded-lg px-4 py-3 text-sm font-light leading-relaxed focus:ring-2 focus:ring-[#5749C2]/20 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Media URLs */}
              <div className="mt-4 pt-4 border-t border-stone-200/50" dir="ltr">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#5749C2] mb-1 flex items-center gap-1.5">
                      <Image size={10} />
                      Image URL (Thumbnail)
                    </label>
                    <input
                      type="url"
                      value={project.imageUrl}
                      onChange={(e) => updateMedia(i, "imageUrl", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-xs font-mono focus:ring-2 focus:ring-[#5749C2]/20 outline-none placeholder:text-stone-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#5749C2] mb-1 flex items-center gap-1.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Video URL (MP4)
                    </label>
                    <input
                      type="url"
                      value={project.videoUrl}
                      onChange={(e) => updateMedia(i, "videoUrl", e.target.value)}
                      placeholder="https://example.com/video.mp4"
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-xs font-mono focus:ring-2 focus:ring-[#5749C2]/20 outline-none placeholder:text-stone-300"
                    />
                  </div>
                </div>
                {/* Quick preview */}
                {(project.imageUrl || project.videoUrl) && (
                  <div className="mt-3 flex gap-2">
                    {project.imageUrl && (
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-200">
                        <img src={project.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    {project.videoUrl && (
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-stone-200 relative">
                        <video src={project.videoUrl} muted playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-[#5749C2]/5 p-6 rounded-[20px] border border-[#5749C2]/10">
        <div className="flex items-center mb-3">
          <Lightbulb size={14} className="mr-2 text-[#5749C2]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#5749C2]">Media Tips</span>
        </div>
        <p className="text-xs text-[#5D54A0] leading-relaxed font-medium">
          The first 2 projects display as large featured cards. The rest show as a 4-column grid. Add video URLs (MP4) for auto-play on hover. Images serve as fallback thumbnails.
        </p>
      </div>
    </div>
  );
}

function WorkPageEditor({ content, setContent, lang }: { content: ContentData; setContent: (c: ContentData) => void; lang: LangTab }) {
  const sections = content.workPage?.sections || [];

  const addSection = () => {
    const id = `section-${Date.now()}`;
    const newSection = {
      id,
      title: { en: "New Section", ar: "قسم جديد", tr: "Yeni Bölüm" },
      subtitle: { en: "Section description", ar: "وصف القسم", tr: "Bölüm açıklaması" },
      projects: [],
    };
    setContent({
      ...content,
      workPage: { sections: [...sections, newSection] },
    });
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setContent({ ...content, workPage: { sections: newSections } });
  };

  const updateSection = (index: number, field: "title" | "subtitle", value: string) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [field]: { ...newSections[index][field], [lang]: value },
    };
    setContent({ ...content, workPage: { sections: newSections } });
  };

  const addProject = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      projects: [
        ...newSections[sectionIndex].projects,
        {
          client: "New Project",
          category: { en: "Category", ar: "الفئة", tr: "Kategori" },
          description: { en: "Project description", ar: "وصف المشروع", tr: "Proje açıklaması" },
          imageUrl: "",
          videoUrl: "",
        },
      ],
    };
    setContent({ ...content, workPage: { sections: newSections } });
  };

  const removeProject = (sectionIndex: number, projectIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      projects: newSections[sectionIndex].projects.filter((_, i) => i !== projectIndex),
    };
    setContent({ ...content, workPage: { sections: newSections } });
  };

  const updateProject = (sectionIndex: number, projectIndex: number, field: string, value: string) => {
    const newSections = [...sections];
    const projects = [...newSections[sectionIndex].projects];
    if (field === "client" || field === "imageUrl" || field === "videoUrl") {
      projects[projectIndex] = { ...projects[projectIndex], [field]: value };
    } else {
      projects[projectIndex] = {
        ...projects[projectIndex],
        [field]: { ...(projects[projectIndex] as any)[field], [lang]: value },
      };
    }
    newSections[sectionIndex] = { ...newSections[sectionIndex], projects };
    setContent({ ...content, workPage: { sections: newSections } });
  };

  return (
    <div className="space-y-6">
      {/* Add Section Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          {sections.length} section{sections.length !== 1 ? "s" : ""} configured.
          {sections.length === 0 && " The page will auto-generate sections from your homepage Work data."}
        </p>
        <button
          onClick={addSection}
          className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-br from-[#5749C2] to-[#7063DC] text-white rounded-xl shadow-lg shadow-[#5749C2]/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Section
        </button>
      </div>

      {/* Sections */}
      {sections.map((section, sIdx) => (
        <div key={section.id} className="bg-white rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)] overflow-hidden">
          {/* Section Header */}
          <div className="p-6 lg:p-8 border-b border-stone-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-[#5749C2]" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#5749C2]">
                  Section {sIdx + 1}
                </span>
              </div>
              <button
                onClick={() => removeSection(sIdx)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 font-medium"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir={lang === "ar" ? "rtl" : "ltr"}>
              <div>
                <label className="text-[10px] font-bold uppercase text-[#5749C2] mb-1 block">Section Title</label>
                <input
                  type="text"
                  value={section.title[lang]}
                  onChange={(e) => updateSection(sIdx, "title", e.target.value)}
                  className="w-full bg-[#F6F3F2] border-none rounded-lg px-4 py-3 text-lg font-extrabold focus:ring-2 focus:ring-[#5749C2]/20 outline-none"
                  style={{ fontFamily: 'var(--next-font-syne), sans-serif' }}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-stone-400 mb-1 block">Subtitle</label>
                <input
                  type="text"
                  value={section.subtitle[lang]}
                  onChange={(e) => updateSection(sIdx, "subtitle", e.target.value)}
                  className="w-full bg-[#F6F3F2] border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#5749C2]/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Projects in this section */}
          <div className="p-6 lg:p-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                {section.projects.length} Project{section.projects.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => addProject(sIdx)}
                className="text-xs font-semibold text-[#5749C2] hover:text-[#7063DC] transition-colors flex items-center gap-1"
              >
                <Plus size={12} />
                Add Project
              </button>
            </div>

            {section.projects.length === 0 && (
              <div className="py-8 text-center border-2 border-dashed border-stone-200 rounded-xl">
                <Image size={24} className="mx-auto mb-2 text-stone-300" />
                <p className="text-xs text-stone-400">No projects yet. Click "Add Project" to get started.</p>
              </div>
            )}

            {section.projects.map((project, pIdx) => (
              <div key={pIdx} className="p-5 bg-[#F6F3F2] rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Project {pIdx + 1}
                  </span>
                  <button
                    onClick={() => removeProject(sIdx, pIdx)}
                    className="text-[10px] text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={10} />
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" dir={lang === "ar" ? "rtl" : "ltr"}>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-400 mb-1 block">Client</label>
                    <input
                      type="text"
                      value={project.client}
                      onChange={(e) => updateProject(sIdx, pIdx, "client", e.target.value)}
                      className="w-full bg-white border-none rounded-lg px-3 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#5749C2]/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-stone-400 mb-1 block">Category</label>
                    <input
                      type="text"
                      value={project.category[lang]}
                      onChange={(e) => updateProject(sIdx, pIdx, "category", e.target.value)}
                      className="w-full bg-white border-none rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#5749C2]/20 outline-none"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-stone-400 mb-1 block">Description</label>
                    <textarea
                      value={project.description[lang]}
                      onChange={(e) => updateProject(sIdx, pIdx, "description", e.target.value)}
                      rows={2}
                      className="w-full bg-white border-none rounded-lg px-3 py-2.5 text-sm font-light focus:ring-2 focus:ring-[#5749C2]/20 outline-none resize-none"
                    />
                  </div>
                </div>
                {/* Media URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-stone-200/50" dir="ltr">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#5749C2] mb-1 flex items-center gap-1">
                      <Image size={10} />
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={project.imageUrl}
                      onChange={(e) => updateProject(sIdx, pIdx, "imageUrl", e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white border-none rounded-lg px-3 py-2.5 text-xs font-mono focus:ring-2 focus:ring-[#5749C2]/20 outline-none placeholder:text-stone-300"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-[#5749C2] mb-1 flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Video URL (MP4)
                    </label>
                    <input
                      type="url"
                      value={project.videoUrl}
                      onChange={(e) => updateProject(sIdx, pIdx, "videoUrl", e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-white border-none rounded-lg px-3 py-2.5 text-xs font-mono focus:ring-2 focus:ring-[#5749C2]/20 outline-none placeholder:text-stone-300"
                    />
                  </div>
                </div>
                {/* Thumbnail preview */}
                {(project.imageUrl || project.videoUrl) && (
                  <div className="mt-2 flex gap-2">
                    {project.imageUrl && (
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-stone-200">
                        <img src={project.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    {project.videoUrl && (
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-stone-200 relative">
                        <video src={project.videoUrl} muted playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tips */}
      <div className="bg-[#5749C2]/5 p-6 rounded-[20px] border border-[#5749C2]/10">
        <div className="flex items-center mb-3">
          <Lightbulb size={14} className="mr-2 text-[#5749C2]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#5749C2]">How it works</span>
        </div>
        <p className="text-xs text-[#5D54A0] leading-relaxed font-medium">
          Each section appears as a titled group on the /work page with its own grid of project cards. The "Featured" section uses a special large-card layout. If no sections are added here, the page auto-generates from your homepage Work data. Add videos (MP4 URLs) for auto-play on hover.
        </p>
      </div>
    </div>
  );
}

function AnnouncementEditor({ content, setContent, lang }: { content: ContentData; setContent: (c: ContentData) => void; lang: LangTab }) {
  const a = content.announcement;
  const update = (patch: Partial<ContentData["announcement"]>) => setContent({ ...content, announcement: { ...a, ...patch } });
  const text = a.text[lang] ?? "";
  const tooLong = text.length > 80;

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold text-stone-800">Show the announcement bar</p>
            <p className="text-sm text-stone-500 mt-1">
              {a.enabled ? "Live on every page except the admin panel." : "Hidden. Write a message, then switch this on."}
            </p>
          </div>
          <Toggle checked={a.enabled} onChange={(v) => update({ enabled: v })} label={a.enabled ? "Live" : "Hidden"} />
        </div>
        {a.enabled && !(a.text.en || "").trim() && (
          <Notice tone="error">Add an English message — it is the fallback for any language left empty.</Notice>
        )}
      </div>

      <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)] space-y-5">
        <LangIndicator lang={lang} />
        <Field label="Message" hint={`${text.length}/80 — longer messages are cut off on phones.`}>
          <Input
            value={text}
            onChange={(e) => update({ text: { ...a.text, [lang]: e.target.value } })}
            placeholder="CreatorFlow is coming soon — join the early list"
          />
        </Field>
        {tooLong && <Notice tone="info">This is over 80 characters, so phones will show it cut off with “…”.</Notice>}
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Link" hint="Optional. “/apps” keeps visitors in their language; a full URL opens in a new tab.">
            <Input value={a.linkUrl} onChange={(e) => update({ linkUrl: e.target.value })} placeholder="/apps" dir="ltr" />
          </Field>
          <Field label="Link text">
            <Input
              value={a.linkLabel[lang] ?? ""}
              onChange={(e) => update({ linkLabel: { ...a.linkLabel, [lang]: e.target.value } })}
              placeholder="See our apps"
            />
          </Field>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Preview</p>
          <div className="rounded-lg bg-[#8B7DF0] text-zinc-950 h-10 px-4 flex items-center justify-center gap-3 text-sm overflow-hidden">
            <span className="truncate font-medium">{text || a.text.en || "Your message appears here"}</span>
            {a.linkUrl && (a.linkLabel[lang] || a.linkLabel.en) && (
              <span className="font-bold underline underline-offset-2 whitespace-nowrap">{a.linkLabel[lang] || a.linkLabel.en} →</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingEditor({ content, setContent, lang }: { content: ContentData; setContent: (c: ContentData) => void; lang: LangTab }) {
  const pricing = content.pricing;

  const updateTier = (index: number, field: "name" | "tagline" | "features" | "price", value: string) => {
    const tiers = [...pricing.tiers];
    tiers[index] =
      field === "price"
        ? { ...tiers[index], price: value }
        : { ...tiers[index], [field]: { ...tiers[index][field], [lang]: value } };
    setContent({ ...content, pricing: { ...pricing, tiers } });
  };

  const priced = pricing.tiers.some((t) => t.price.trim());

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold text-stone-800">Show pricing on the website</p>
            <p className="text-sm text-stone-500 mt-1">
              {pricing.enabled
                ? "The pricing section is live on your homepage."
                : "The section is hidden. Set your prices below, then switch this on."}
            </p>
          </div>
          <Toggle
            checked={pricing.enabled}
            onChange={(v) => setContent({ ...content, pricing: { ...pricing, enabled: v } })}
            label={pricing.enabled ? "Live" : "Hidden"}
          />
        </div>
        {pricing.enabled && !priced && (
          <Notice tone="error">
            No prices set yet, so the section will stay hidden even while this is on. Add at least one price below.
          </Notice>
        )}
        <Notice tone="info">
          A price is one figure shown in every language — write it exactly as it should appear, e.g. <b>$750</b>. Leave it
          empty for a quoted tier and the card shows &ldquo;Let&rsquo;s talk&rdquo; instead.
        </Notice>
      </div>

      <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)]">
        <LangIndicator lang={lang} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pricing.tiers.map((tier, i) => (
            <div key={i} className="p-6 bg-[#F6F3F2] rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Tier {i + 1}</span>
                {i === 1 && <Pill tone="violet">Most popular</Pill>}
              </div>
              <Field label="Name">
                <Input value={tier.name[lang]} onChange={(e) => updateTier(i, "name", e.target.value)} placeholder="Starter" />
              </Field>
              <Field label="Price" hint="Same in all languages. Empty = “Let’s talk”.">
                <Input value={tier.price} onChange={(e) => updateTier(i, "price", e.target.value)} placeholder="$750" dir="ltr" />
              </Field>
              <Field label="One-line summary">
                <Input value={tier.tagline[lang]} onChange={(e) => updateTier(i, "tagline", e.target.value)} placeholder="One service, done properly." />
              </Field>
              <Field label="What's included" hint="One per line.">
                <Textarea rows={6} value={tier.features[lang]} onChange={(e) => updateTier(i, "features", e.target.value)} />
              </Field>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialsEditor({ content, setContent, lang }: { content: ContentData; setContent: (c: ContentData) => void; lang: LangTab }) {
  const updateTestimonial = (index: number, field: "quote" | "author" | "title" | "stars", value: string | number) => {
    const newItems = [...content.testimonials.items];
    if (field === "author") {
      newItems[index] = { ...newItems[index], author: value as string };
    } else if (field === "stars") {
      newItems[index] = { ...newItems[index], stars: value as number };
    } else {
      newItems[index] = { ...newItems[index], [field]: { ...newItems[index][field], [lang]: value } };
    }
    setContent({ ...content, testimonials: { items: newItems } });
  };

  return (
    <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)]">
        <LangIndicator lang={lang} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.testimonials.items.map((item, i) => (
            <div key={i} className="p-6 bg-[#F6F3F2] rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Testimonial {i + 1}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateTestimonial(i, "stars", s)}
                      className={`transition-colors ${s <= item.stars ? "text-amber-400" : "text-stone-300"}`}
                    >
                      <Star size={14} fill={s <= item.stars ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={item.quote[lang]}
                onChange={(e) => updateTestimonial(i, "quote", e.target.value)}
                rows={3}
                placeholder="Client quote..."
                className="w-full bg-white border-none rounded-lg px-4 py-3 text-sm italic font-light leading-relaxed focus:ring-2 focus:ring-[#5749C2]/20 outline-none resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={item.author}
                  onChange={(e) => updateTestimonial(i, "author", e.target.value)}
                  placeholder="Author name"
                  className="bg-white border-none rounded-lg px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-[#5749C2]/20 outline-none"
                />
                <input
                  type="text"
                  value={item.title[lang]}
                  onChange={(e) => updateTestimonial(i, "title", e.target.value)}
                  placeholder="Title / Role"
                  className="bg-white border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#5749C2]/20 outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactEditor({ content, setContent }: { content: ContentData; setContent: (c: ContentData) => void }) {
  const updateContact = (field: string, value: string) => {
    setContent({ ...content, contact: { ...content.contact, [field]: value } });
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)]">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5749C2]/40">Contact Details</span>
            <AtSign size={18} className="text-[#5749C2]/40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TextField label="Email Address" value={content.contact.email} onChange={(v) => updateContact("email", v)} primary />
            <TextField label="Phone Number" value={content.contact.phone} onChange={(v) => updateContact("phone", v)} placeholder="+1 234 567 890" />
            <TextField label="Instagram URL" value={content.contact.instagram} onChange={(v) => updateContact("instagram", v)} primary />
            <TextField label="TikTok URL" value={content.contact.tiktok} onChange={(v) => updateContact("tiktok", v)} />
            <div className="col-span-1 md:col-span-2">
              <TextField label="WhatsApp URL" value={content.contact.whatsapp} onChange={(v) => updateContact("whatsapp", v)} primary />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <div className="bg-[#5749C2]/5 p-6 rounded-[20px] border border-[#5749C2]/10">
          <div className="flex items-center mb-3">
            <Lightbulb size={14} className="mr-2 text-[#5749C2]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5749C2]">Tip</span>
          </div>
          <p className="text-xs text-[#5D54A0] leading-relaxed font-medium">
            Make sure your WhatsApp link uses the format: https://wa.me/PHONENUMBER (with country code, no spaces or dashes).
          </p>
        </div>
      </div>
    </div>
  );
}

function SeoEditor({ content, setContent }: { content: ContentData; setContent: (c: ContentData) => void }) {
  const updateSeo = (field: string, value: string) => {
    setContent({ ...content, seo: { ...content.seo, [field]: value } });
  };

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-[0px_20px_40px_rgba(27,28,28,0.06)]">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5749C2]/40">Search Engine Optimization</span>
            <Search size={18} className="text-[#5749C2]/40" />
          </div>
          <div className="space-y-8">
            <TextField label="Page Title" value={content.seo.title} onChange={(v) => updateSeo("title", v)} primary />
            <TextArea label="Meta Description" value={content.seo.description} onChange={(v) => updateSeo("description", v)} rows={3} />
            <TextField label="OG Image URL" value={content.seo.ogImage} onChange={(v) => updateSeo("ogImage", v)} placeholder="https://admov.io/og-image.jpg" />
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 space-y-8">
        {/* Preview Card */}
        <div className="bg-white p-8 rounded-[20px] shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">Google Preview</h4>
          <div className="border border-[#c8c4d5]/20 rounded-xl p-5 space-y-2">
            <p className="text-[#5749C2] text-sm truncate">{content.seo.title || "Page Title"}</p>
            <p className="text-xs text-green-700 truncate">admov.io</p>
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{content.seo.description || "Meta description will appear here..."}</p>
          </div>
        </div>
        <div className="bg-[#5749C2]/5 p-6 rounded-[20px] border border-[#5749C2]/10">
          <div className="flex items-center mb-3">
            <div className="w-2 h-2 rounded-full bg-[#5749C2] animate-pulse mr-3" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#5749C2]">SEO Score</span>
          </div>
          <p className="text-xs text-[#5D54A0] leading-relaxed font-medium">
            Title length: {content.seo.title.length}/60 characters. {content.seo.title.length > 60 ? "Consider shortening." : "Good length!"} Description: {content.seo.description.length}/160 characters.
          </p>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = React.useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${on ? "bg-[#5749C2]" : "bg-[#eae7e7]"}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${on ? "right-1" : "left-1"}`} />
      </button>
    </div>
  );
}
