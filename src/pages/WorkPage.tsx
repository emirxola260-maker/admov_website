import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, ArrowLeft, ArrowRight, ExternalLink, Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminContent } from "@/admin/useAdminContent";
import content from "@/data/content.json";
import ShinyText from "@/components/ShinyText";
import { sanitizeHttpUrl } from "@/lib/security";

interface WorkProject {
  client: string;
  category: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
}

interface WorkSection {
  id: string;
  title: { en: string; ar: string; tr: string };
  subtitle: { en: string; ar: string; tr: string };
  projects: {
    client: string;
    category: { en: string; ar: string; tr: string };
    description: { en: string; ar: string; tr: string };
    imageUrl: string;
    videoUrl: string;
  }[];
}

const defaultSections: WorkSection[] = [
  {
    id: "featured",
    title: { en: "Featured Work", ar: "أعمال مميزة", tr: "Öne Çıkan Projeler" },
    subtitle: { en: "Our best and most impactful projects", ar: "أفضل مشاريعنا وأكثرها تأثيراً", tr: "En iyi ve en etkili projelerimiz" },
    projects: [],
  },
  {
    id: "ai-videos",
    title: { en: "AI Video Production", ar: "إنتاج فيديو بالذكاء الاصطناعي", tr: "AI Video Üretimi" },
    subtitle: { en: "Cinematic AI-generated video content for brands", ar: "محتوى فيديو سينمائي مولد بالذكاء الاصطناعي للعلامات التجارية", tr: "Markalar için sinematik AI video içerikleri" },
    projects: [],
  },
  {
    id: "ai-photos",
    title: { en: "AI Photography", ar: "تصوير بالذكاء الاصطناعي", tr: "AI Fotoğrafçılık" },
    subtitle: { en: "Product shots and lifestyle imagery at scale", ar: "صور المنتجات وصور نمط الحياة على نطاق واسع", tr: "Ölçekli ürün ve yaşam tarzı fotoğrafçılığı" },
    projects: [],
  },
  {
    id: "automation",
    title: { en: "Automation & AI Agents", ar: "الأتمتة ووكلاء الذكاء الاصطناعي", tr: "Otomasyon & AI Ajanları" },
    subtitle: { en: "Custom AI systems that scale your operations", ar: "أنظمة ذكاء اصطناعي مخصصة توسع عملياتك", tr: "Operasyonlarınızı ölçeklendiren özel AI sistemleri" },
    projects: [],
  },
  {
    id: "ecommerce",
    title: { en: "E-Commerce & Shopify", ar: "التجارة الإلكترونية وشوبيفاي", tr: "E-Ticaret & Shopify" },
    subtitle: { en: "Full store builds and management", ar: "بناء وإدارة المتاجر الكاملة", tr: "Tam mağaza kurulumu ve yönetimi" },
    projects: [],
  },
];

export function WorkPage() {
  const { t, lang, isRTL } = useLanguage();
  const { content: adminContent } = useAdminContent();
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [hoveredCard, setHoveredCard] = React.useState<string | null>(null);
  const videoRefs = React.useRef<Record<string, HTMLVideoElement | null>>({});

  // Build sections from admin content or defaults
  const sections: WorkSection[] = React.useMemo(() => {
    const adminSections = adminContent?.workPage?.sections as WorkSection[] | undefined;
    if (adminSections && adminSections.length > 0) return adminSections;

    // Build from existing work projects as fallback
    const mainProjects = adminContent?.work?.projects || [];
    const built = defaultSections.map((section) => ({ ...section, projects: [...section.projects] }));

    // Distribute existing projects into sections
    const contentProjects = content.work;
    contentProjects.forEach((p, i) => {
      const adminP = mainProjects[i];
      const project = {
        client: adminP?.client || p.client,
        category: adminP?.category || { en: p.category, ar: p.category, tr: p.category },
        description: adminP?.description || { en: p.description, ar: p.description, tr: p.description },
        imageUrl: adminP?.imageUrl || p.imageUrl || "",
        videoUrl: adminP?.videoUrl || "",
      };

      // Put first 2 in featured, rest distributed
      if (i < 2) built[0].projects.push(project);
      else if (p.category.includes("Video")) built[1].projects.push(project);
      else if (p.category.includes("Photo") || p.category.includes("Content")) built[2].projects.push(project);
      else if (p.category.includes("Automation")) built[3].projects.push(project);
      else built[4].projects.push(project);
    });

    return built.filter((s) => s.projects.length > 0);
  }, [adminContent, lang]);

  const allCategories = React.useMemo(() => {
    const cats = new Set<string>();
    sections.forEach((s) => cats.add(s.id));
    return ["all", ...Array.from(cats)];
  }, [sections]);

  const filteredSections = activeFilter === "all"
    ? sections
    : sections.filter((s) => s.id === activeFilter);

  const handleVideoHover = (key: string, play: boolean) => {
    const vid = videoRefs.current[key];
    if (!vid) return;
    if (play) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
      setHoveredCard(key);
    } else {
      vid.pause();
      setHoveredCard(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="50,0 100,100 0,100" fill="#A49BFF" />
                  <polygon points="50,50 75,100 25,100" fill="#7367F0" />
                </svg>
              </div>
              <span className="logo-text font-extrabold text-2xl tracking-tighter text-zinc-50">
                ADMOV
              </span>
            </Link>
            <span className="text-zinc-600 hidden md:inline">/</span>
            <span className="font-syne font-bold text-sm text-zinc-400 hidden md:inline uppercase tracking-wider">
              {t.work.label}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-zinc-400 hover:text-violet transition-colors flex items-center gap-2 font-medium"
            >
              <ArrowLeft size={16} className="rtl:rotate-180" />
              <span className="hidden sm:inline">{t.nav.home}</span>
            </Link>
            <a
              href="/#contact"
              className="px-5 py-2.5 rounded-full font-syne font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 backdrop-blur-xl border border-violet/30"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 15px rgba(139, 125, 240, 0.3)',
              }}
            >
              {t.nav.bookCall}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 md:pt-40 pb-12 md:pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet/10 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="section-label">{t.work.label}</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.95]">
              {t.work.heading}
              <br />
              <ShinyText
                text={t.work.headingHighlight}
                className="text-violet"
                color="#8B7DF0"
                shineColor="#ffffff"
                speed={3}
              />
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
              {lang === "en" && "Explore our portfolio of AI-powered creative work — from cinematic video production to fully automated business systems."}
              {lang === "ar" && "استكشف مجموعة أعمالنا المدعومة بالذكاء الاصطناعي — من إنتاج الفيديو السينمائي إلى أنظمة الأعمال المؤتمتة بالكامل."}
              {lang === "tr" && "AI destekli yaratıcı çalışma portföyümüzü keşfedin — sinematik video üretiminden tam otomasyonlu iş sistemlerine."}
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {allCategories.map((cat) => {
              const label = cat === "all"
                ? (lang === "en" ? "All Work" : lang === "ar" ? "جميع الأعمال" : "Tüm Projeler")
                : sections.find((s) => s.id === cat)?.title[lang] || cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-xl border ${
                    activeFilter === cat
                      ? "text-white border-violet/60"
                      : "text-zinc-300 border-white/10 hover:border-violet/30 hover:text-white"
                  }`}
                  style={activeFilter === cat ? {
                    backgroundImage: 'linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 15px rgba(139, 125, 240, 0.3)',
                  } : {
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </motion.div>
        </div>
      </header>

      {/* Sections */}
      <main className="px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-20">
          <AnimatePresence mode="wait">
            {filteredSections.map((section, sIdx) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: sIdx * 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-syne font-extrabold text-zinc-50 mb-2">
                      {section.title[lang]}
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-base max-w-lg">
                      {section.subtitle[lang]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 text-sm font-medium shrink-0">
                    <span>{section.projects.length} {lang === "en" ? "projects" : lang === "ar" ? "مشاريع" : "proje"}</span>
                  </div>
                </div>

                {/* Project Grid — adaptive layout */}
                {section.id === "featured" ? (
                  <FeaturedGrid
                    projects={section.projects}
                    lang={lang}
                    videoRefs={videoRefs}
                    hoveredCard={hoveredCard}
                    onHover={handleVideoHover}
                    sectionId={section.id}
                  />
                ) : (
                  <StandardGrid
                    projects={section.projects}
                    lang={lang}
                    videoRefs={videoRefs}
                    hoveredCard={hoveredCard}
                    onHover={handleVideoHover}
                    sectionId={section.id}
                  />
                )}
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* CTA Footer */}
      <section className="border-t border-zinc-800/50 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-syne font-extrabold mb-6">
            {lang === "en" && "Ready to create something amazing?"}
            {lang === "ar" && "مستعد لإنشاء شيء مذهل؟"}
            {lang === "tr" && "Harika bir şey yaratmaya hazır mısınız?"}
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            {lang === "en" && "Let's discuss how AI can transform your brand's visual content and operations."}
            {lang === "ar" && "دعنا نناقش كيف يمكن للذكاء الاصطناعي تحويل المحتوى المرئي وعمليات علامتك التجارية."}
            {lang === "tr" && "AI'ın markanızın görsel içeriğini ve operasyonlarını nasıl dönüştürebileceğini konuşalım."}
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 text-white px-10 py-4 rounded-full font-syne font-bold text-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-xl border border-violet/30"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 20px rgba(139, 125, 240, 0.3)',
            }}
          >
            {t.hero.cta1}
            <ArrowRight size={20} className="rtl:rotate-180" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-900 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <polygon points="50,0 100,100 0,100" fill="#A49BFF" />
                <polygon points="50,50 75,100 25,100" fill="#7367F0" />
              </svg>
            </div>
            <span className="logo-text font-extrabold text-lg tracking-tighter">ADMOV</span>
          </div>
          <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} ADMOV. {t.footer.rights}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-zinc-500 hover:text-violet transition-colors">{t.footer.privacy}</Link>
            <Link to="/terms" className="text-sm text-zinc-500 hover:text-violet transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Card Components ─────────────────────────── */

interface GridProps {
  projects: WorkSection["projects"];
  lang: string;
  videoRefs: React.MutableRefObject<Record<string, HTMLVideoElement | null>>;
  hoveredCard: string | null;
  onHover: (key: string, play: boolean) => void;
  sectionId: string;
}

function FeaturedGrid({ projects, lang, videoRefs, hoveredCard, onHover, sectionId }: GridProps) {
  if (projects.length === 0) return null;
  const first = projects[0];
  const rest = projects.slice(1);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Hero card — full height left */}
      <ProjectCard
        project={first}
        lang={lang}
        aspect="aspect-[3/4] md:aspect-auto md:h-full md:min-h-[500px]"
        videoRefs={videoRefs}
        hoveredCard={hoveredCard}
        onHover={onHover}
        cardKey={`${sectionId}-0`}
        size="large"
      />
      {/* Stacked right */}
      <div className="grid gap-4">
        {rest.map((p, i) => (
          <ProjectCard
            key={i}
            project={p}
            lang={lang}
            aspect="aspect-[16/9]"
            videoRefs={videoRefs}
            hoveredCard={hoveredCard}
            onHover={onHover}
            cardKey={`${sectionId}-${i + 1}`}
            size="medium"
          />
        ))}
      </div>
    </div>
  );
}

function StandardGrid({ projects, lang, videoRefs, hoveredCard, onHover, sectionId }: GridProps) {
  if (projects.length === 0) return null;

  // Adaptive: if 1-2 projects use 2-col, 3+ use 3-col
  const cols = projects.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${cols} gap-4`}>
      {projects.map((p, i) => (
        <ProjectCard
          key={i}
          project={p}
          lang={lang}
          aspect="aspect-[4/5]"
          videoRefs={videoRefs}
          hoveredCard={hoveredCard}
          onHover={onHover}
          cardKey={`${sectionId}-${i}`}
          size="standard"
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  lang,
  aspect,
  videoRefs,
  hoveredCard,
  onHover,
  cardKey,
  size,
}: {
  project: WorkSection["projects"][0];
  lang: string;
  aspect: string;
  videoRefs: React.MutableRefObject<Record<string, HTMLVideoElement | null>>;
  hoveredCard: string | null;
  onHover: (key: string, play: boolean) => void;
  cardKey: string;
  size: "large" | "medium" | "standard";
}) {
  const hasVideo = !!project.videoUrl;
  const isHovered = hoveredCard === cardKey;
  const category = typeof project.category === "object" ? (project.category as any)[lang] || project.category.en : project.category;
  const description = typeof project.description === "object" ? (project.description as any)[lang] || project.description.en : project.description;

  return (
    <motion.div
      className={`${aspect} rounded-2xl overflow-hidden bg-zinc-900 relative group cursor-pointer`}
      onMouseEnter={() => onHover(cardKey, true)}
      onMouseLeave={() => onHover(cardKey, false)}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      {/* Media */}
      {hasVideo ? (
        <video
          ref={(el) => { videoRefs.current[cardKey] = el; }}
          src={sanitizeHttpUrl(project.videoUrl)}
          muted
          loop
          playsInline
          poster={sanitizeHttpUrl(project.imageUrl) || undefined}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : project.imageUrl ? (
        <img
          src={sanitizeHttpUrl(project.imageUrl)}
          alt={project.client}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-zinc-950/10 group-hover:via-zinc-950/40 transition-all duration-500" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-5 flex items-start justify-between">
        <span className="bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full text-[10px] font-bold text-white/90 uppercase tracking-wider border border-white/10">
          {hasVideo && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse mr-1.5 align-middle" />}
          {category}
        </span>
        <div className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <ExternalLink size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Play button for video */}
      {hasVideo && !isHovered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
        <h3 className={`font-syne font-extrabold text-white mb-1 group-hover:text-violet-light transition-colors ${
          size === "large" ? "text-2xl md:text-3xl" : size === "medium" ? "text-xl md:text-2xl" : "text-lg md:text-xl"
        }`}>
          {project.client}
        </h3>
        <p className={`text-zinc-300/80 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 ${
          size === "large" ? "text-sm md:text-base max-w-md" : "text-xs md:text-sm"
        }`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}
