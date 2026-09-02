import type { Language } from "./config";
import { extra } from "./extra";

export type { Language };

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const languages: LanguageMeta[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", dir: "ltr" },
];

// ─── English ────────────────────────────────────────────────────────
const en = {
  nav: {
    home: "Home",
    services: "Services",
    work: "Work",
    bookCall: "Book a Call",
  },
  hero: {
    label: "AI Agency for Businesses",
    headline1: "We make AI work",
    headline2: "for your business",
    subtext:
      "From AI-generated videos and photos to full automation systems — ADMOV builds intelligent solutions that save time and drive results.",
    cta1: "Book a Free Call",
    cta2: "See Our Work",
    stats: ["8+ Years Experience", "20+ Clients Served"],
    videoBadge: "AI Video Production",
    videoSub: "Watch our latest showreel",
    marquee:
      "✦ SMART ✦ DIGITAL ✦ SOLUTIONS ✦ FAST ✦ BUSINESS ✦ GROWTH ✦ AI ✦ AUTOMATION ✦",
  },
  services: {
    label: "Our Expertise",
    heading: "Intelligent solutions for ",
    headingHighlight: "modern brands",
    subtext:
      "We combine cutting-edge AI technology with creative strategy to help your business scale faster and smarter.",
    items: [
      {
        title: "AI Generated Videos",
        desc: "Cinematic, scroll-stopping video content produced entirely with AI — for ads, social media, and brand storytelling.",
      },
      {
        title: "AI Generated Photos",
        desc: "Product photography, lifestyle images, and ad creatives — generated at scale without a photoshoot.",
      },
      {
        title: "AI Automation Systems",
        desc: "Custom AI agents and automated workflows that eliminate repetitive tasks and scale your operations.",
      },
      {
        title: "LLM Setup & Integration",
        desc: "Deploy and configure large language models (GPT-4, Claude, Gemini) tailored to your business needs.",
      },
      {
        title: "Website Development",
        desc: "Fast, beautiful, conversion-optimized websites — from landing pages to full platforms.",
      },
      {
        title: "App Development",
        desc: "Cross-platform mobile apps (Flutter) that turn your product idea into a polished, deployable application.",
      },
      {
        title: "Meta, Google & TikTok Ads",
        desc: "Data-driven paid advertising campaigns managed end-to-end across all major platforms.",
      },
      {
        title: "Shopify & E-Commerce",
        desc: "Full Shopify store setup, product management, and dropshipping operations — from launch to scale.",
      },
    ],
  },
  process: {
    label: "Our Process",
    heading1: "From Idea",
    heading2: "To",
    heading3: "Deployment",
    steps: [
      {
        title: "Discovery Call",
        desc: "We analyze your bottlenecks and identify high-leverage AI opportunities that align with your unique scale goals.",
      },
      {
        title: "We Build",
        desc: "Our experts engineer the systems and creative content tailored specifically to your brand's aesthetic and functional requirements.",
      },
      {
        title: "You Grow",
        desc: "Scale your output and operations infinitely with AI working silently in the background, freeing your team for high-level strategy.",
      },
    ],
  },
  work: {
    label: "Selected Projects",
    heading: "Case studies of ",
    headingHighlight: "AI in action",
    viewAll: "View All Projects",
    projects: [
      {
        client: "MHD Invest",
        category: "Website Development",
        description:
          "Bilingual marketing site for a luxury Istanbul real-estate and Turkish-citizenship advisory, with an investment advisor tool and project showcase.",
      },
      {
        client: "Kyom",
        category: "AI Videos",
        description:
          "AI-generated video ad campaign that increased social engagement significantly.",
      },
      {
        client: "Belind Perfumes",
        category: "AI Photos & Branding",
        description:
          "Complete brand visual identity with AI-generated lifestyle photography.",
      },
      {
        client: "Jaeje Factory",
        category: "AI Content",
        description:
          "AI-powered content pipeline producing unique assets weekly for social media.",
      },
      {
        client: "n8n",
        category: "AI Automation",
        description:
          "Custom AI automation workflows eliminating repetitive tasks at scale.",
      },
      {
        client: "Hareem al-sultan",
        category: "E-Commerce",
        description:
          "Full Shopify store build with automated inventory management.",
      },
      {
        client: "Shopify Clients",
        category: "Full Store Management",
        description:
          "End-to-end Shopify management including product launch and ad campaigns.",
      },
    ],
  },
  testimonials: {
    label: "Client Success",
    heading: "What our partners ",
    headingHighlight: "say",
    items: [
      {
        quote:
          "ADMOV transformed our product visuals — we cut photography costs by 80% with AI-generated images.",
        author: "Sarah M.",
        title: "E-commerce Brand Owner",
      },
      {
        quote:
          "The automation system they built saves us 20+ hours per week. Incredible ROI.",
        author: "James K.",
        title: "SaaS Startup Founder",
      },
      {
        quote:
          "Best AI video content we've ever had. Clients can't tell it's AI-generated.",
        author: "Nadia R.",
        title: "Marketing Agency Director",
      },
      {
        quote:
          "Professional, fast, and results-driven. ADMOV delivered beyond expectations.",
        author: "Ahmed B.",
        title: "Retail Business Owner",
      },
    ],
  },
  contact: {
    label: "Get in Touch",
    heading1: "Ready to ",
    headingHighlight: "scale",
    heading2: " your business?",
    subtext:
      "Book a free strategy call today and discover how AI can transform your operations and content.",
    formName: "Name",
    formNamePlaceholder: "John Doe",
    formEmail: "Email",
    formEmailPlaceholder: "john@example.com",
    formMessage: "Message",
    formMessagePlaceholder: "Tell us about your project...",
    formSubmit: "Send Message",
  },
  footer: {
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    support: "Support",
    rights: "All rights reserved.",
  },
};

// ─── Arabic ─────────────────────────────────────────────────────────
const ar: typeof en = {
  nav: {
    home: "الرئيسية",
    services: "الخدمات",
    work: "أعمالنا",
    bookCall: "احجز مكالمة",
  },
  hero: {
    label: "وكالة ذكاء اصطناعي للأعمال",
    headline1: "نجعل الذكاء الاصطناعي",
    headline2: "يعمل لصالح عملك",
    subtext:
      "من الفيديوهات والصور المولدة بالذكاء الاصطناعي إلى أنظمة الأتمتة الكاملة — ADMOV تبني حلولاً ذكية توفر الوقت وتحقق النتائج.",
    cta1: "احجز مكالمة مجانية",
    cta2: "شاهد أعمالنا",
    stats: ["8+ سنوات خبرة", "20+ عميل"],
    videoBadge: "إنتاج فيديو بالذكاء الاصطناعي",
    videoSub: "شاهد أحدث أعمالنا",
    marquee:
      "✦ حلول ✦ رقمية ✦ ذكية ✦ نمو ✦ سريع ✦ للأعمال ✦ أتمتة ✦ بالذكاء ✦ الاصطناعي ✦",
  },
  services: {
    label: "خدماتنا",
    heading: "حلول ذكية لـ",
    headingHighlight: "العلامات التجارية الحديثة",
    subtext:
      "نجمع بين أحدث تقنيات الذكاء الاصطناعي والاستراتيجية الإبداعية لمساعدة عملك على التوسع بشكل أسرع وأذكى.",
    items: [
      {
        title: "فيديوهات بالذكاء الاصطناعي",
        desc: "محتوى فيديو سينمائي يجذب الانتباه، يُنتج بالكامل بالذكاء الاصطناعي — للإعلانات ووسائل التواصل الاجتماعي وسرد قصة العلامة التجارية.",
      },
      {
        title: "صور بالذكاء الاصطناعي",
        desc: "تصوير المنتجات وصور نمط الحياة والإبداعات الإعلانية — يتم إنشاؤها على نطاق واسع بدون جلسة تصوير.",
      },
      {
        title: "أنظمة أتمتة الذكاء الاصطناعي",
        desc: "وكلاء ذكاء اصطناعي مخصصون وسير عمل آلي يلغي المهام المتكررة ويوسع عملياتك.",
      },
      {
        title: "إعداد ودمج نماذج اللغة الكبيرة",
        desc: "نشر وتكوين نماذج اللغة الكبيرة (GPT-4, Claude, Gemini) المصممة خصيصاً لاحتياجات عملك.",
      },
      {
        title: "تطوير المواقع الإلكترونية",
        desc: "مواقع سريعة وجميلة ومحسنة للتحويل — من صفحات الهبوط إلى المنصات الكاملة.",
      },
      {
        title: "تطوير التطبيقات",
        desc: "تطبيقات جوال متعددة المنصات (Flutter) تحول فكرة منتجك إلى تطبيق مصقول وجاهز للنشر.",
      },
      {
        title: "إعلانات ميتا وجوجل وتيك توك",
        desc: "حملات إعلانية مدفوعة مبنية على البيانات تُدار من البداية إلى النهاية عبر جميع المنصات الرئيسية.",
      },
      {
        title: "شوبيفاي والتجارة الإلكترونية",
        desc: "إعداد متجر شوبيفاي كامل وإدارة المنتجات وعمليات دروبشيبينغ — من الإطلاق إلى التوسع.",
      },
    ],
  },
  process: {
    label: "خطوات عملنا",
    heading1: "من الفكرة",
    heading2: "إلى",
    heading3: "التنفيذ",
    steps: [
      {
        title: "مكالمة الاستكشاف",
        desc: "نحلل العقبات لديك ونحدد فرص الذكاء الاصطناعي عالية التأثير التي تتوافق مع أهداف التوسع الخاصة بك.",
      },
      {
        title: "نحن نبني",
        desc: "يقوم خبراؤنا بهندسة الأنظمة والمحتوى الإبداعي المصمم خصيصاً لجماليات علامتك التجارية ومتطلباتها الوظيفية.",
      },
      {
        title: "أنت تنمو",
        desc: "وسّع إنتاجك وعملياتك بلا حدود مع عمل الذكاء الاصطناعي بصمت في الخلفية، مما يحرر فريقك للاستراتيجية عالية المستوى.",
      },
    ],
  },
  work: {
    label: "مشاريع مختارة",
    heading: "دراسات حالة لـ",
    headingHighlight: "الذكاء الاصطناعي في العمل",
    viewAll: "عرض جميع المشاريع",
    projects: [
      {
        client: "MHD Invest",
        category: "تطوير المواقع",
        description:
          "موقع تسويقي ثنائي اللغة لشركة استشارات عقارية فاخرة في إسطنبول والجنسية التركية، مع أداة إرشاد استثماري وعرض للمشاريع.",
      },
      {
        client: "Kyom",
        category: "فيديوهات AI",
        description:
          "حملة إعلانية بالفيديو مولدة بالذكاء الاصطناعي زادت من التفاعل الاجتماعي بشكل كبير.",
      },
      {
        client: "Belind Perfumes",
        category: "صور AI وعلامة تجارية",
        description:
          "هوية بصرية كاملة للعلامة التجارية مع تصوير نمط حياة مولد بالذكاء الاصطناعي.",
      },
      {
        client: "Jaeje Factory",
        category: "محتوى AI",
        description:
          "خط إنتاج محتوى مدعوم بالذكاء الاصطناعي ينتج أصولاً فريدة أسبوعياً لوسائل التواصل الاجتماعي.",
      },
      {
        client: "n8n",
        category: "أتمتة AI",
        description:
          "سير عمل أتمتة AI مخصصة تلغي المهام المتكررة على نطاق واسع.",
      },
      {
        client: "Hareem al-sultan",
        category: "تجارة إلكترونية",
        description:
          "بناء متجر شوبيفاي كامل مع إدارة مخزون آلية.",
      },
      {
        client: "Shopify Clients",
        category: "إدارة متجر كاملة",
        description:
          "إدارة شوبيفاي شاملة تشمل إطلاق المنتجات والحملات الإعلانية.",
      },
    ],
  },
  testimonials: {
    label: "نجاح العملاء",
    heading: "ماذا يقول ",
    headingHighlight: "شركاؤنا",
    items: [
      {
        quote:
          "ADMOV حولت صور منتجاتنا — خفضنا تكاليف التصوير بنسبة 80% باستخدام الصور المولدة بالذكاء الاصطناعي.",
        author: "سارة م.",
        title: "صاحبة علامة تجارية إلكترونية",
      },
      {
        quote:
          "نظام الأتمتة الذي بنوه يوفر لنا أكثر من 20 ساعة أسبوعياً. عائد استثمار مذهل.",
        author: "جيمس ك.",
        title: "مؤسس شركة SaaS ناشئة",
      },
      {
        quote:
          "أفضل محتوى فيديو بالذكاء الاصطناعي حصلنا عليه. العملاء لا يستطيعون التمييز أنه مولد بالذكاء الاصطناعي.",
        author: "نادية ر.",
        title: "مديرة وكالة تسويق",
      },
      {
        quote:
          "محترفون وسريعون ويركزون على النتائج. ADMOV تجاوزت التوقعات.",
        author: "أحمد ب.",
        title: "صاحب متجر تجزئة",
      },
    ],
  },
  contact: {
    label: "تواصل معنا",
    heading1: "مستعد لـ",
    headingHighlight: "توسيع",
    heading2: " عملك؟",
    subtext:
      "احجز مكالمة استراتيجية مجانية اليوم واكتشف كيف يمكن للذكاء الاصطناعي تحويل عملياتك ومحتواك.",
    formName: "الاسم",
    formNamePlaceholder: "محمد أحمد",
    formEmail: "البريد الإلكتروني",
    formEmailPlaceholder: "mohammed@example.com",
    formMessage: "الرسالة",
    formMessagePlaceholder: "أخبرنا عن مشروعك...",
    formSubmit: "إرسال الرسالة",
  },
  footer: {
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    support: "الدعم",
    rights: "جميع الحقوق محفوظة.",
  },
};

// ─── Turkish ────────────────────────────────────────────────────────
const tr: typeof en = {
  nav: {
    home: "Ana Sayfa",
    services: "Hizmetler",
    work: "Projeler",
    bookCall: "Görüşme Ayarla",
  },
  hero: {
    label: "İşletmeler İçin Yapay Zeka Ajansı",
    headline1: "AI'ı işiniz için",
    headline2: "çalıştırıyoruz",
    subtext:
      "Yapay zeka ile üretilen video ve fotoğraflardan tam otomasyon sistemlerine kadar — ADMOV zaman kazandıran ve sonuç getiren akıllı çözümler üretir.",
    cta1: "Ücretsiz Görüşme",
    cta2: "Projelerimizi Gör",
    stats: ["8+ Yıl Deneyim", "20+ Müşteri"],
    videoBadge: "AI Video Üretimi",
    videoSub: "Son çalışmalarımızı izleyin",
    marquee:
      "✦ AKILLI ✦ DİJİTAL ✦ ÇÖZÜMLER ✦ HIZLI ✦ İŞ ✦ BÜYÜMESİ ✦ YAPAY ✦ ZEKA ✦ OTOMASYON ✦",
  },
  services: {
    label: "Uzmanlık Alanlarımız",
    heading: "Modern markalar için ",
    headingHighlight: "akıllı çözümler",
    subtext:
      "En son yapay zeka teknolojisini yaratıcı stratejiyle birleştirerek işletmenizin daha hızlı ve akıllı büyümesine yardımcı oluyoruz.",
    items: [
      {
        title: "AI ile Video Üretimi",
        desc: "Reklamlar, sosyal medya ve marka hikaye anlatımı için tamamen yapay zeka ile üretilen sinematik video içerikler.",
      },
      {
        title: "AI ile Fotoğraf Üretimi",
        desc: "Ürün fotoğrafçılığı, yaşam tarzı görselleri ve reklam kreatifleri — fotoğraf çekimi olmadan ölçekli üretim.",
      },
      {
        title: "AI Otomasyon Sistemleri",
        desc: "Tekrarlayan görevleri ortadan kaldıran ve operasyonlarınızı ölçeklendiren özel AI ajanları ve otomatik iş akışları.",
      },
      {
        title: "LLM Kurulum ve Entegrasyon",
        desc: "İş ihtiyaçlarınıza göre uyarlanmış büyük dil modellerinin (GPT-4, Claude, Gemini) kurulumu ve yapılandırması.",
      },
      {
        title: "Web Sitesi Geliştirme",
        desc: "Hızlı, güzel ve dönüşüm odaklı web siteleri — açılış sayfalarından tam platformlara.",
      },
      {
        title: "Uygulama Geliştirme",
        desc: "Ürün fikrinizi cilalı ve yayınlanabilir bir uygulamaya dönüştüren çok platformlu mobil uygulamalar (Flutter).",
      },
      {
        title: "Meta, Google & TikTok Reklamları",
        desc: "Tüm büyük platformlarda uçtan uca yönetilen veri odaklı ücretli reklam kampanyaları.",
      },
      {
        title: "Shopify & E-Ticaret",
        desc: "Tam Shopify mağaza kurulumu, ürün yönetimi ve dropshipping operasyonları — lansmandan ölçeklemeye.",
      },
    ],
  },
  process: {
    label: "Sürecimiz",
    heading1: "Fikirden",
    heading2: " ",
    heading3: "Uygulamaya",
    steps: [
      {
        title: "Keşif Görüşmesi",
        desc: "Darboğazlarınızı analiz ediyor ve benzersiz ölçekleme hedeflerinizle uyumlu yüksek etkili AI fırsatlarını belirliyoruz.",
      },
      {
        title: "Biz İnşa Ederiz",
        desc: "Uzmanlarımız, markanızın estetiğine ve işlevsel gereksinimlerine özel olarak tasarlanmış sistemler ve yaratıcı içerikler üretir.",
      },
      {
        title: "Siz Büyürsünüz",
        desc: "AI arka planda sessizce çalışırken üretim ve operasyonlarınızı sonsuzca ölçeklendirin, ekibinizi üst düzey stratejiye odaklayın.",
      },
    ],
  },
  work: {
    label: "Seçili Projeler",
    heading: "Yapay zekanın ",
    headingHighlight: "iş başında olduğu vaka çalışmaları",
    viewAll: "Tüm Projeleri Gör",
    projects: [
      {
        client: "MHD Invest",
        category: "Web Sitesi Geliştirme",
        description:
          "İstanbul'da lüks gayrimenkul ve Türk vatandaşlığı danışmanlığı için iki dilli tanıtım sitesi; yatırım danışmanı aracı ve proje vitrini ile.",
      },
      {
        client: "Kyom",
        category: "AI Videoları",
        description:
          "Sosyal etkileşimi önemli ölçüde artıran AI ile üretilmiş video reklam kampanyası.",
      },
      {
        client: "Belind Perfumes",
        category: "AI Fotoğraf & Marka",
        description:
          "AI ile üretilmiş yaşam tarzı fotoğrafçılığı ile kapsamlı marka görsel kimliği.",
      },
      {
        client: "Jaeje Factory",
        category: "AI İçerik",
        description:
          "Sosyal medya için haftalık benzersiz varlıklar üreten AI destekli içerik hattı.",
      },
      {
        client: "n8n",
        category: "AI Otomasyon",
        description:
          "Tekrarlayan görevleri ölçekte ortadan kaldıran özel AI otomasyon iş akışları.",
      },
      {
        client: "Hareem al-sultan",
        category: "E-Ticaret",
        description:
          "Otomatik envanter yönetimi ile tam Shopify mağaza kurulumu.",
      },
      {
        client: "Shopify Clients",
        category: "Tam Mağaza Yönetimi",
        description:
          "Ürün lansmanı ve reklam kampanyaları dahil uçtan uca Shopify yönetimi.",
      },
    ],
  },
  testimonials: {
    label: "Müşteri Başarıları",
    heading: "Ortaklarımız ne ",
    headingHighlight: "diyor",
    items: [
      {
        quote:
          "ADMOV ürün görsellerimizi dönüştürdü — AI ile üretilen görsellerle fotoğraf maliyetlerini %80 azalttık.",
        author: "Sarah M.",
        title: "E-ticaret Marka Sahibi",
      },
      {
        quote:
          "Kurdukları otomasyon sistemi bize haftada 20+ saat kazandırıyor. İnanılmaz yatırım getirisi.",
        author: "James K.",
        title: "SaaS Startup Kurucusu",
      },
      {
        quote:
          "Şimdiye kadar sahip olduğumuz en iyi AI video içeriği. Müşteriler AI ile üretildiğini anlayamıyor.",
        author: "Nadia R.",
        title: "Pazarlama Ajansı Direktörü",
      },
      {
        quote:
          "Profesyonel, hızlı ve sonuç odaklı. ADMOV beklentilerin ötesinde teslim etti.",
        author: "Ahmed B.",
        title: "Perakende İşletme Sahibi",
      },
    ],
  },
  contact: {
    label: "İletişime Geçin",
    heading1: "İşletmenizi ",
    headingHighlight: "büyütmeye",
    heading2: " hazır mısınız?",
    subtext:
      "Bugün ücretsiz bir strateji görüşmesi ayarlayın ve AI'ın operasyonlarınızı ve içeriğinizi nasıl dönüştürebileceğini keşfedin.",
    formName: "İsim",
    formNamePlaceholder: "Ahmet Yılmaz",
    formEmail: "E-posta",
    formEmailPlaceholder: "ahmet@example.com",
    formMessage: "Mesaj",
    formMessagePlaceholder: "Projenizden bahsedin...",
    formSubmit: "Mesaj Gönder",
  },
  footer: {
    privacy: "Gizlilik Politikası",
    terms: "Kullanım Koşulları",
    support: "Destek",
    rights: "Tüm hakları saklıdır.",
  },
};

// Newer sections (products, blog, FAQ, ...) live in ./extra.ts; merge them in so
// components keep a single `t` object. nav/footer are merged one level deep.
function merge<B extends { nav: object; footer: object }, E extends { nav: object; footer: object }>(base: B, ext: E) {
  return { ...base, ...ext, nav: { ...base.nav, ...ext.nav }, footer: { ...base.footer, ...ext.footer } };
}

const enAll = merge(en, extra.en);

export const translations: Record<Language, typeof enAll> = {
  en: enAll,
  ar: merge(ar, extra.ar),
  tr: merge(tr, extra.tr),
};
