"use client";

import * as React from "react";
import Link from "next/link";
import { localePath } from "@/lib/i18n/paths";
import { useLanguage } from "@/i18n/LanguageContext";
import { PageChrome, renderRich, type Lang } from "./legalShared";

interface Faq { q: string; a: string; }
interface Category { title: string; faqs: Faq[]; }
interface SupportContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  contactHeading: string;
  contactIntro: string;
  includeIntro: string;
  includeItems: string[];
  faqHeading: string;
  categories: Category[];
  legalHeading: string;
  termsLabel: string;
  privacyLabel: string;
  stillHeading: string;
  stillText: string;
}

const content: Record<Lang, SupportContent> = {
  en: {
    eyebrow: "Help Center",
    title: "Admov Support",
    subtitle: "Help with the Admov app, and where to reach us about a project. We're here for you.",
    contactHeading: "Contact us",
    contactIntro: "The fastest way to reach us is email:",
    includeIntro: "We typically reply within 1–2 business days. If you are writing about the app, please include:",
    includeItems: [
      "Your account email",
      "The device and iOS version you're using",
      "A short description (and a screenshot, if relevant) of what happened",
    ],
    faqHeading: "Frequently asked questions",
    categories: [
      { title: "Getting started", faqs: [
        { q: "What is Admov?", a: "Admov turns your product photos into premium, AI-generated advertisements in seconds. Upload a photo, pick a business type and style, and generate a ready-to-post ad." },
        { q: "How do I create an ad?", a: "Tap **Create**, upload your product photo, choose a business type and style, fill in any details, then tap **Generate**. Your finished ad appears in a few seconds and is saved to **Projects**." },
        { q: "Do I need an account?", a: "You can browse the app as a guest, but generating and saving content requires a free account. Sign in with Apple, Google, or email." },
        { q: "How long does a generation take?", a: "Most generations finish in about 20–40 seconds, depending on quality and network speed." },
      ] },
      { title: "Credits & billing", faqs: [
        { q: "How do credits work?", a: "Generating ads, images, and using AI tools costs credits. You start with free credits and can buy more anytime, or subscribe for a larger monthly allowance." },
        { q: "How do I manage or cancel my subscription?", a: "Subscriptions are billed through your Apple ID and renew automatically. Manage or cancel anytime: open the **Settings app → tap your name → Subscriptions → Admov**. Canceling stops future renewals; you keep access until the current period ends." },
        { q: "I bought credits or a subscription but don't see them.", a: "Open Admov → **Settings → Restore Purchases**. If they still don't appear, email us at info@admov.io with your account email." },
        { q: "Can I get a refund?", a: "Purchases are processed by Apple. Refund requests are handled through Apple at reportaproblem.apple.com." },
      ] },
      { title: "Account", faqs: [
        { q: "How do I reset my password?", a: "On the email sign-in screen, tap **Forgot password?**, enter your email, and we'll send a 6-digit reset code." },
        { q: "I didn't get my verification / reset code.", a: "Check your spam folder and make sure the email is correct. You can tap **Resend** after a short wait. Still stuck? Email info@admov.io." },
        { q: "How do I delete my account?", a: "Open Admov → **Settings → Delete account**. This permanently removes your account and associated data. This action can't be undone." },
        { q: "What languages does Admov support?", a: "English, Arabic, and Turkish. The app follows your device language automatically." },
      ] },
      { title: "Troubleshooting", faqs: [
        { q: "A generation failed or got stuck.", a: "Check your internet connection and try again. Failed generations are refunded automatically. If it keeps happening, email us with a screenshot." },
        { q: "The app looks wrong or won't load content.", a: "Pull down to refresh, or fully close and reopen the app. Make sure you're on the latest version from the App Store." },
      ] },
      { title: "Content & safety", faqs: [
        { q: "Who owns the images I create?", a: "You can use the images you generate for personal and commercial purposes, subject to our Terms of Use. Because output is AI-generated, please review it before publishing." },
        { q: "How do I report a problem with generated content?", a: "Use the report option on any result, or email info@admov.io. Prompts are filtered and content may be reviewed to keep Admov safe." },
      ] },
      { title: "Business & project enquiries", faqs: [
        { q: "Can you build something for my business?", a: "Yes. Alongside the app, Admov works with businesses on AI video and photo production, automation systems, websites and apps, ads, and Shopify stores. Tell us what you need at info@admov.io, or book a free call from the contact section on our homepage." },
        { q: "How much does a project cost?", a: "Every project is quoted after a free discovery call, once we understand the scope. Creative work is usually a fixed price; automation, ads, and store management are usually a monthly plan." },
        { q: "Who owns the work you produce for us?", a: "You do. Delivered creatives, code, automations, and accounts are yours, and we hand them over with documentation so your team can run them. The specifics are set out in the written agreement for your project." },
      ] },
    ],
    legalHeading: "Legal",
    termsLabel: "Terms of Use",
    privacyLabel: "Privacy Policy",
    stillHeading: "Still need help?",
    stillText: "Email info@admov.io — we read every message.",
  },

  ar: {
    eyebrow: "مركز المساعدة",
    title: "دعم Admov",
    subtitle: "مساعدة في تطبيق Admov، وكيفية التواصل معنا بشأن مشروع. نحن هنا من أجلك.",
    contactHeading: "تواصل معنا",
    contactIntro: "أسرع طريقة للوصول إلينا هي البريد الإلكتروني:",
    includeIntro: "نردّ عادةً خلال يوم إلى يومين من أيام العمل. وإذا كانت رسالتك بخصوص التطبيق، يُرجى تضمين:",
    includeItems: [
      "البريد الإلكتروني لحسابك",
      "نوع الجهاز وإصدار iOS الذي تستخدمه",
      "وصف موجز (ولقطة شاشة إن كانت ذات صلة) لما حدث",
    ],
    faqHeading: "الأسئلة الشائعة",
    categories: [
      { title: "البدء", faqs: [
        { q: "ما هو Admov؟", a: "يحوّل Admov صور منتجاتك إلى إعلانات احترافية مولّدة بالذكاء الاصطناعي في ثوانٍ. ارفع صورة، واختر نوع النشاط والنمط، وأنشئ إعلانًا جاهزًا للنشر." },
        { q: "كيف أنشئ إعلانًا؟", a: "اضغط **إنشاء**، وارفع صورة منتجك، واختر نوع النشاط والنمط، واملأ أي تفاصيل، ثم اضغط **توليد**. يظهر إعلانك النهائي خلال ثوانٍ ويُحفظ في **المشاريع**." },
        { q: "هل أحتاج إلى حساب؟", a: "يمكنك تصفّح التطبيق كضيف، لكن إنشاء المحتوى وحفظه يتطلّب حسابًا مجانيًا. سجّل الدخول عبر Apple أو Google أو البريد الإلكتروني." },
        { q: "كم يستغرق الإنشاء؟", a: "تكتمل معظم عمليات الإنشاء خلال نحو 20–40 ثانية، حسب الجودة وسرعة الشبكة." },
      ] },
      { title: "الأرصدة والفوترة", faqs: [
        { q: "كيف تعمل الأرصدة؟", a: "يكلّف إنشاء الإعلانات والصور واستخدام أدوات الذكاء الاصطناعي أرصدة. تبدأ برصيد مجاني ويمكنك شراء المزيد في أي وقت، أو الاشتراك للحصول على حصة شهرية أكبر." },
        { q: "كيف أدير اشتراكي أو ألغيه؟", a: "تتم فوترة الاشتراكات عبر معرّف Apple الخاص بك وتُجدَّد تلقائيًا. للإدارة أو الإلغاء في أي وقت: افتح **تطبيق الإعدادات ← اضغط على اسمك ← الاشتراكات ← Admov**. يوقف الإلغاء التجديدات المستقبلية؛ وتحتفظ بإمكانية الوصول حتى نهاية الفترة الحالية." },
        { q: "اشتريت أرصدة أو اشتراكًا لكني لا أراها.", a: "افتح Admov ← **الإعدادات ← استعادة المشتريات**. إذا لم تظهر بعد، راسلنا على info@admov.io مع البريد الإلكتروني لحسابك." },
        { q: "هل يمكنني الحصول على استرداد؟", a: "تتم معالجة المشتريات عبر Apple. وتُعالَج طلبات الاسترداد عبر Apple على reportaproblem.apple.com." },
      ] },
      { title: "الحساب", faqs: [
        { q: "كيف أعيد تعيين كلمة المرور؟", a: "في شاشة تسجيل الدخول بالبريد الإلكتروني، اضغط **نسيت كلمة المرور؟**، وأدخل بريدك الإلكتروني، وسنرسل لك رمز إعادة تعيين من 6 أرقام." },
        { q: "لم يصلني رمز التحقق / إعادة التعيين.", a: "تحقّق من مجلد الرسائل غير المرغوب فيها وتأكّد من صحة البريد الإلكتروني. يمكنك الضغط على **إعادة الإرسال** بعد انتظار قصير. ما زلت تواجه مشكلة؟ راسلنا على info@admov.io." },
        { q: "كيف أحذف حسابي؟", a: "افتح Admov ← **الإعدادات ← حذف الحساب**. يؤدي ذلك إلى إزالة حسابك والبيانات المرتبطة به نهائيًا. ولا يمكن التراجع عن هذا الإجراء." },
        { q: "ما اللغات التي يدعمها Admov؟", a: "الإنجليزية والعربية والتركية. يتبع التطبيق لغة جهازك تلقائيًا." },
      ] },
      { title: "استكشاف الأخطاء وإصلاحها", faqs: [
        { q: "فشل الإنشاء أو تعطّل.", a: "تحقّق من اتصالك بالإنترنت وحاول مرة أخرى. تُسترَد الأرصدة تلقائيًا عند فشل عمليات الإنشاء. وإذا استمرت المشكلة، راسلنا مع لقطة شاشة." },
        { q: "يبدو التطبيق غير صحيح أو لا يحمّل المحتوى.", a: "اسحب للأسفل للتحديث، أو أغلق التطبيق تمامًا وأعد فتحه. وتأكّد من أنك تستخدم أحدث إصدار من App Store." },
      ] },
      { title: "المحتوى والسلامة", faqs: [
        { q: "من يملك الصور التي أنشئها؟", a: "يمكنك استخدام الصور التي تنشئها للأغراض الشخصية والتجارية، وفقًا لشروط الاستخدام لدينا. ولأن المُخرجات مولّدة بالذكاء الاصطناعي، يُرجى مراجعتها قبل النشر." },
        { q: "كيف أبلّغ عن مشكلة في المحتوى المُنشأ؟", a: "استخدم خيار الإبلاغ على أي نتيجة، أو راسلنا على info@admov.io. تُصفّى النصوص التوجيهية وقد تتم مراجعة المحتوى للحفاظ على سلامة Admov." },
      ] },
      { title: "استفسارات الأعمال والمشاريع", faqs: [
        { q: "هل يمكنكم بناء شيء لنشاطي التجاري؟", a: "نعم. إلى جانب التطبيق، تعمل Admov مع الشركات على إنتاج الفيديو والصور بالذكاء الاصطناعي، وأنظمة الأتمتة، والمواقع والتطبيقات، والإعلانات، ومتاجر Shopify. أخبرنا بما تحتاجه على info@admov.io، أو احجز مكالمة مجانية من قسم التواصل في صفحتنا الرئيسية." },
        { q: "كم تكلفة المشروع؟", a: "يُسعَّر كل مشروع بعد مكالمة اكتشاف مجانية، بمجرد أن نفهم النطاق. الأعمال الإبداعية عادةً بسعر ثابت، أما الأتمتة والإعلانات وإدارة المتاجر فتكون عادةً بخطة شهرية." },
        { q: "من يملك العمل الذي تنجزونه لنا؟", a: "أنت تملكه. التصاميم والأكواد والأتمتة والحسابات المسلَّمة ملك لك، ونسلّمها مع التوثيق ليتمكن فريقك من تشغيلها. وتُحدَّد التفاصيل في الاتفاقية المكتوبة الخاصة بمشروعك." },
      ] },
    ],
    legalHeading: "قانوني",
    termsLabel: "شروط الاستخدام",
    privacyLabel: "سياسة الخصوصية",
    stillHeading: "ما زلت بحاجة إلى مساعدة؟",
    stillText: "راسلنا على info@admov.io — نقرأ كل رسالة.",
  },

  tr: {
    eyebrow: "Yardım Merkezi",
    title: "Admov Destek",
    subtitle: "Admov uygulaması için yardım ve proje görüşmeleri için bize ulaşabileceğiniz yer. Buradayız.",
    contactHeading: "Bize ulaşın",
    contactIntro: "Bize ulaşmanın en hızlı yolu e-postadır:",
    includeIntro: "Genellikle 1–2 iş günü içinde yanıt veririz. Uygulamayla ilgili yazıyorsanız lütfen şunları ekleyin:",
    includeItems: [
      "Hesap e-postanız",
      "Kullandığınız cihaz ve iOS sürümü",
      "Ne olduğuna dair kısa bir açıklama (ve varsa bir ekran görüntüsü)",
    ],
    faqHeading: "Sıkça sorulan sorular",
    categories: [
      { title: "Başlangıç", faqs: [
        { q: "Admov nedir?", a: "Admov, ürün fotoğraflarınızı saniyeler içinde premium, yapay zeka ile üretilmiş reklamlara dönüştürür. Bir fotoğraf yükleyin, bir işletme türü ve stil seçin ve paylaşmaya hazır bir reklam oluşturun." },
        { q: "Nasıl reklam oluştururum?", a: "**Oluştur**'a dokunun, ürün fotoğrafınızı yükleyin, bir işletme türü ve stil seçin, varsa ayrıntıları doldurun, ardından **Üret**'e dokunun. Tamamlanan reklamınız birkaç saniye içinde görünür ve **Projeler**'e kaydedilir." },
        { q: "Hesaba ihtiyacım var mı?", a: "Uygulamaya misafir olarak göz atabilirsiniz, ancak içerik oluşturmak ve kaydetmek ücretsiz bir hesap gerektirir. Apple, Google veya e-posta ile giriş yapın." },
        { q: "Bir oluşturma ne kadar sürer?", a: "Çoğu oluşturma, kaliteye ve ağ hızına bağlı olarak yaklaşık 20–40 saniyede tamamlanır." },
      ] },
      { title: "Krediler ve faturalandırma", faqs: [
        { q: "Krediler nasıl çalışır?", a: "Reklam, görsel oluşturmak ve yapay zeka araçlarını kullanmak kredi harcar. Ücretsiz kredilerle başlarsınız ve istediğiniz zaman daha fazla satın alabilir ya da daha büyük bir aylık kota için abone olabilirsiniz." },
        { q: "Aboneliğimi nasıl yönetir veya iptal ederim?", a: "Abonelikler Apple Kimliğiniz üzerinden faturalandırılır ve otomatik yenilenir. İstediğiniz zaman yönetmek veya iptal etmek için: **Ayarlar uygulaması → adınıza dokunun → Abonelikler → Admov**. İptal, gelecekteki yenilemeleri durdurur; mevcut dönem bitene kadar erişiminiz sürer." },
        { q: "Kredi veya abonelik satın aldım ama görünmüyor.", a: "Admov → **Ayarlar → Satın Alımları Geri Yükle**'yi açın. Hâlâ görünmüyorsa, hesap e-postanızla info@admov.io adresine e-posta gönderin." },
        { q: "İade alabilir miyim?", a: "Satın alımlar Apple tarafından işlenir. İade talepleri Apple üzerinden reportaproblem.apple.com adresinde ele alınır." },
      ] },
      { title: "Hesap", faqs: [
        { q: "Parolamı nasıl sıfırlarım?", a: "E-posta ile giriş ekranında **Parolanızı mı unuttunuz?**'a dokunun, e-postanızı girin, size 6 haneli bir sıfırlama kodu gönderelim." },
        { q: "Doğrulama / sıfırlama kodumu almadım.", a: "Spam klasörünüzü kontrol edin ve e-postanın doğru olduğundan emin olun. Kısa bir bekleme sonrası **Yeniden gönder**'e dokunabilirsiniz. Hâlâ takıldınız mı? info@admov.io adresine e-posta gönderin." },
        { q: "Hesabımı nasıl silerim?", a: "Admov → **Ayarlar → Hesabı sil**'i açın. Bu, hesabınızı ve ilişkili verileri kalıcı olarak kaldırır. Bu işlem geri alınamaz." },
        { q: "Admov hangi dilleri destekler?", a: "İngilizce, Arapça ve Türkçe. Uygulama, cihazınızın dilini otomatik olarak izler." },
      ] },
      { title: "Sorun giderme", faqs: [
        { q: "Bir oluşturma başarısız oldu veya takıldı.", a: "İnternet bağlantınızı kontrol edin ve tekrar deneyin. Başarısız oluşturmalar otomatik olarak iade edilir. Devam ederse, bir ekran görüntüsüyle bize e-posta gönderin." },
        { q: "Uygulama bozuk görünüyor veya içeriği yüklemiyor.", a: "Yenilemek için aşağı çekin ya da uygulamayı tamamen kapatıp yeniden açın. App Store'daki en son sürümü kullandığınızdan emin olun." },
      ] },
      { title: "İçerik ve güvenlik", faqs: [
        { q: "Oluşturduğum görsellerin sahibi kim?", a: "Oluşturduğunuz görselleri, Kullanım Koşullarımıza tabi olarak kişisel ve ticari amaçlarla kullanabilirsiniz. Çıktı yapay zeka ile üretildiğinden, yayınlamadan önce lütfen gözden geçirin." },
        { q: "Oluşturulan içerikle ilgili bir sorunu nasıl bildiririm?", a: "Herhangi bir sonuçtaki bildirme seçeneğini kullanın veya info@admov.io adresine e-posta gönderin. Admov'u güvende tutmak için istemler filtrelenir ve içerik incelenebilir." },
      ] },
      { title: "İş ve proje talepleri", faqs: [
        { q: "İşletmem için bir şey geliştirebilir misiniz?", a: "Evet. Admov, uygulamanın yanı sıra işletmelerle yapay zeka video ve fotoğraf üretimi, otomasyon sistemleri, web siteleri ve uygulamalar, reklamlar ve Shopify mağazaları üzerine çalışır. İhtiyacınızı info@admov.io adresine yazın veya ana sayfamızdaki iletişim bölümünden ücretsiz görüşme planlayın." },
        { q: "Bir proje ne kadara mal olur?", a: "Her proje, kapsamı anladıktan sonra ücretsiz bir keşif görüşmesinin ardından fiyatlandırılır. Kreatif işler genellikle sabit fiyatlıdır; otomasyon, reklam ve mağaza yönetimi genellikle aylık plan şeklindedir." },
        { q: "Bizim için ürettiğiniz işin sahibi kim?", a: "Siz. Teslim edilen kreatifler, kodlar, otomasyonlar ve hesaplar size aittir; ekibinizin yönetebilmesi için dokümantasyonuyla birlikte devrederiz. Ayrıntılar projenizin yazılı sözleşmesinde belirlenir." },
      ] },
    ],
    legalHeading: "Yasal",
    termsLabel: "Kullanım Koşulları",
    privacyLabel: "Gizlilik Politikası",
    stillHeading: "Hâlâ yardıma mı ihtiyacınız var?",
    stillText: "info@admov.io adresine e-posta gönderin — her mesajı okuyoruz.",
  },
};

export function SupportPage() {
  const { lang } = useLanguage();
  const c = content[(lang as Lang)] ?? content.en;

  return (
    <PageChrome>
      <div className="mb-12">
        <span className="font-syne font-bold text-[11px] text-violet tracking-[0.10em] uppercase mb-3 block">{c.eyebrow}</span>
        <h1 className="text-5xl md:text-6xl font-syne font-extrabold tracking-tight text-zinc-50 mb-4">{c.title}</h1>
        <p className="text-zinc-400">{c.subtitle}</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-12 text-zinc-300 leading-relaxed">
        {/* Contact */}
        <section>
          <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">{c.contactHeading}</h2>
          <p>{c.contactIntro}</p>
          <a
            href="mailto:info@admov.io"
            dir="ltr"
            className="mt-4 flex items-center gap-3 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-violet/40 transition-colors group"
          >
            <span className="text-2xl">📧</span>
            <span className="text-xl md:text-2xl font-syne font-bold text-violet group-hover:text-violet-light transition-colors break-all">info@admov.io</span>
          </a>
          <p className="mt-6">{c.includeIntro}</p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
            {c.includeItems.map((it, i) => (<li key={i}>{it}</li>))}
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-syne font-extrabold text-zinc-50 mb-8">{c.faqHeading}</h2>
          <div className="space-y-10">
            {c.categories.map((cat, ci) => (
              <div key={ci}>
                <h3 className="text-sm font-syne font-bold text-zinc-500 uppercase tracking-[0.15em] mb-5">{cat.title}</h3>
                <div className="space-y-6">
                  {cat.faqs.map((f, fi) => (
                    <div key={fi}>
                      <h4 className="text-lg font-syne font-bold text-violet mb-2">{f.q}</h4>
                      <p className="text-zinc-400">{renderRich(f.a)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Legal */}
        <section>
          <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">{c.legalHeading}</h2>
          <ul className="list-disc list-inside mt-3 space-y-2 text-zinc-400">
            <li><Link href={localePath(lang, "/terms")} className="text-violet hover:text-violet-light transition-colors">{c.termsLabel}</Link></li>
            <li><Link href={localePath(lang, "/privacy")} className="text-violet hover:text-violet-light transition-colors">{c.privacyLabel}</Link></li>
          </ul>
        </section>

        {/* Still need help */}
        <section>
          <h2 className="text-2xl font-syne font-bold text-zinc-50 mb-4">{c.stillHeading}</h2>
          <p>{renderRich(c.stillText)}</p>
        </section>
      </div>
    </PageChrome>
  );
}
