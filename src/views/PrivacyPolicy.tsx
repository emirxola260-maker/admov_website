"use client";

import { LegalDocPage, type Lang, type LegalDoc } from "./legalShared";

const content: Record<Lang, LegalDoc> = {
  en: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    updated: "Last updated: May 26, 2026",
    intro: `This Privacy Policy explains how **Admov** ("we", "us") collects, uses, and shares information when you use the Admov app and services (the "Service"). By using Admov, you agree to this Policy.`,
    sections: [
      {
        heading: "1. Information We Collect",
        blocks: [
          { p: `**Account information:** name, email address, and authentication identifiers when you sign in with Apple, Google, or email.` },
          { p: `**Content you provide:** photos and images you upload, text prompts, brand details (business name, logo, colors, phone, website, social handles), and the images you generate. Uploaded photos may contain people or faces if you choose to include them.` },
          { p: `**Purchase information:** records of credit purchases and subscriptions. Payments are processed by Apple; we do not receive your full payment-card details.` },
          { p: `**Usage and device data:** app interactions, feature usage, generation history, approximate diagnostics, device type, OS version, language, and similar technical data.` },
        ],
      },
      {
        heading: "2. How We Use Information",
        blocks: [
          { list: [
            `To provide, operate, and improve the Service and generate your requested Output.`,
            `To manage your account, credits, and subscriptions.`,
            `To provide customer support and respond to reports.`,
            `To enforce our Terms, prevent abuse, and moderate content for safety.`,
            `To send transactional messages (e.g. verification codes, password resets) and, where permitted, service notifications.`,
            `To comply with legal obligations.`,
          ] },
          { p: `We do not sell your personal information. We do not use Your Content to train our own AI models.` },
        ],
      },
      {
        heading: "3. How We Share Information",
        blocks: [
          { p: `We share information with service providers strictly to operate the Service:` },
          { list: [
            `**Cloud/backend & storage** (database, authentication, file storage, and serverless functions) to run the app.`,
            `**AI model and processing providers** — your uploaded images and prompts are sent to third-party AI providers to generate or edit your Output.`,
            `**Apple / Google** — for sign-in and in-app purchases.`,
            `**Email delivery providers** — to send verification and account emails.`,
          ] },
          { p: `These providers process data under their own privacy and security commitments. We may also disclose information to comply with law or protect our rights and users.` },
        ],
      },
      {
        heading: "4. Camera, Photos & Notifications",
        blocks: [
          { p: `With your permission, the app accesses your camera and photo library so you can upload images, and may send push notifications (e.g. when a generation is ready). You can change these permissions anytime in your device Settings.` },
        ],
      },
      {
        heading: "5. Data Retention",
        blocks: [
          { p: `We retain your account data and content while your account is active and as needed to provide the Service. When you delete your account in the app, we delete or anonymize your personal data within a reasonable period, except where we must retain it for legal, security, or accounting purposes.` },
        ],
      },
      {
        heading: "6. Your Rights",
        blocks: [
          { p: `Depending on where you live (e.g. under GDPR/KVKK), you may have rights to access, correct, delete, or port your data, and to object to or restrict certain processing. You can delete your account directly in the app (Settings → Delete account) or contact us at info@admov.io. We will respond as required by applicable law.` },
        ],
      },
      {
        heading: "7. International Transfers",
        blocks: [
          { p: `Your information may be processed in countries other than your own, including where our service providers operate. We take steps to protect it consistent with this Policy and applicable law.` },
        ],
      },
      {
        heading: "8. Security",
        blocks: [
          { p: `We use reasonable technical and organizational measures to protect your information. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.` },
        ],
      },
      {
        heading: "9. Children's Privacy",
        blocks: [
          { p: `The Service is not directed to children under 13 (or the minimum age in your country), and we do not knowingly collect their data. If you believe a child has provided us information, contact us and we will delete it.` },
        ],
      },
      {
        heading: "10. Changes to This Policy",
        blocks: [
          { p: `We may update this Policy from time to time. Material changes will be posted here with a new "Last updated" date and, where appropriate, notified in the app.` },
        ],
      },
    ],
    contact: {
      heading: "11. Contact",
      intro: `If you have questions about this Policy, you can reach us at:`,
      emailLabel: "Email",
      websiteLabel: "Website",
    },
  },

  ar: {
    eyebrow: "قانوني",
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 26 مايو 2026",
    intro: `توضّح سياسة الخصوصية هذه كيف تقوم **Admov** ("نحن"، "لنا") بجمع المعلومات واستخدامها ومشاركتها عند استخدامك لتطبيق Admov وخدماته ("الخدمة"). باستخدامك Admov فإنك توافق على هذه السياسة.`,
    sections: [
      {
        heading: "1. المعلومات التي نجمعها",
        blocks: [
          { p: `**معلومات الحساب:** الاسم والبريد الإلكتروني ومعرّفات المصادقة عند تسجيل الدخول باستخدام Apple أو Google أو البريد الإلكتروني.` },
          { p: `**المحتوى الذي تقدّمه:** الصور التي ترفعها، والنصوص التوجيهية، وتفاصيل العلامة التجارية (اسم النشاط، الشعار، الألوان، الهاتف، الموقع الإلكتروني، حسابات التواصل الاجتماعي)، والصور التي تنشئها. قد تحتوي الصور المرفوعة على أشخاص أو وجوه إذا اخترت تضمينها.` },
          { p: `**معلومات الشراء:** سجلّات شراء الأرصدة والاشتراكات. تتم معالجة المدفوعات عبر Apple؛ ولا نتلقّى تفاصيل بطاقة الدفع الكاملة الخاصة بك.` },
          { p: `**بيانات الاستخدام والجهاز:** تفاعلات التطبيق، واستخدام الميزات، وسجلّ الإنشاء، والتشخيصات التقريبية، ونوع الجهاز، وإصدار نظام التشغيل، واللغة، وبيانات تقنية مماثلة.` },
        ],
      },
      {
        heading: "2. كيف نستخدم المعلومات",
        blocks: [
          { list: [
            `لتقديم الخدمة وتشغيلها وتحسينها وإنشاء المُخرجات التي تطلبها.`,
            `لإدارة حسابك وأرصدتك واشتراكاتك.`,
            `لتقديم دعم العملاء والرد على البلاغات.`,
            `لتطبيق شروطنا، ومنع إساءة الاستخدام، ومراجعة المحتوى لأغراض السلامة.`,
            `لإرسال الرسائل المعاملاتية (مثل رموز التحقق وإعادة تعيين كلمة المرور) وإشعارات الخدمة حيثما كان ذلك مسموحًا.`,
            `للامتثال للالتزامات القانونية.`,
          ] },
          { p: `نحن لا نبيع معلوماتك الشخصية. ولا نستخدم المحتوى الخاص بك لتدريب نماذج الذكاء الاصطناعي الخاصة بنا.` },
        ],
      },
      {
        heading: "3. كيف نشارك المعلومات",
        blocks: [
          { p: `نشارك المعلومات مع مزوّدي الخدمات فقط لتشغيل الخدمة:` },
          { list: [
            `**الاستضافة السحابية والخوادم والتخزين** (قاعدة البيانات، والمصادقة، وتخزين الملفات، والوظائف بلا خادم) لتشغيل التطبيق.`,
            `**مزوّدو نماذج ومعالجة الذكاء الاصطناعي** — تُرسَل الصور والنصوص التي ترفعها إلى مزوّدي ذكاء اصطناعي خارجيين لإنشاء مُخرجاتك أو تعديلها.`,
            `**Apple / Google** — لتسجيل الدخول وعمليات الشراء داخل التطبيق.`,
            `**مزوّدو خدمة البريد الإلكتروني** — لإرسال رسائل التحقق ورسائل الحساب.`,
          ] },
          { p: `يعالج هؤلاء المزوّدون البيانات وفقًا لالتزاماتهم الخاصة بالخصوصية والأمان. وقد نفصح أيضًا عن المعلومات للامتثال للقانون أو لحماية حقوقنا ومستخدمينا.` },
        ],
      },
      {
        heading: "4. الكاميرا والصور والإشعارات",
        blocks: [
          { p: `بإذنك، يصل التطبيق إلى الكاميرا ومكتبة الصور لديك حتى تتمكن من رفع الصور، وقد يرسل إشعارات فورية (مثلاً عندما يصبح الإنشاء جاهزًا). يمكنك تغيير هذه الأذونات في أي وقت من إعدادات جهازك.` },
        ],
      },
      {
        heading: "5. الاحتفاظ بالبيانات",
        blocks: [
          { p: `نحتفظ ببيانات حسابك ومحتواك طالما كان حسابك نشطًا وبالقدر اللازم لتقديم الخدمة. عند حذف حسابك من داخل التطبيق، نحذف بياناتك الشخصية أو نجعلها مجهولة المصدر خلال فترة معقولة، إلا في الحالات التي يتعيّن علينا فيها الاحتفاظ بها لأغراض قانونية أو أمنية أو محاسبية.` },
        ],
      },
      {
        heading: "6. حقوقك",
        blocks: [
          { p: `بحسب مكان إقامتك (مثلاً بموجب GDPR/KVKK)، قد تتمتّع بحقوق الوصول إلى بياناتك وتصحيحها وحذفها ونقلها، والاعتراض على بعض عمليات المعالجة أو تقييدها. يمكنك حذف حسابك مباشرةً من داخل التطبيق (الإعدادات ← حذف الحساب) أو التواصل معنا عبر info@admov.io. وسنردّ وفقًا لما يقتضيه القانون المعمول به.` },
        ],
      },
      {
        heading: "7. عمليات النقل الدولية",
        blocks: [
          { p: `قد تتم معالجة معلوماتك في بلدان غير بلدك، بما في ذلك حيث يعمل مزوّدو خدماتنا. ونتّخذ خطوات لحمايتها بما يتوافق مع هذه السياسة والقانون المعمول به.` },
        ],
      },
      {
        heading: "8. الأمان",
        blocks: [
          { p: `نستخدم تدابير تقنية وتنظيمية معقولة لحماية معلوماتك. لا توجد وسيلة نقل أو تخزين آمنة تمامًا، لذا لا يمكننا ضمان الأمان المطلق.` },
        ],
      },
      {
        heading: "9. خصوصية الأطفال",
        blocks: [
          { p: `الخدمة غير موجّهة للأطفال دون سن 13 عامًا (أو الحد الأدنى للسن في بلدك)، ولا نجمع بياناتهم عن قصد. إذا كنت تعتقد أن طفلاً قد زوّدنا بمعلومات، فتواصل معنا وسنحذفها.` },
        ],
      },
      {
        heading: "10. التغييرات على هذه السياسة",
        blocks: [
          { p: `قد نحدّث هذه السياسة من وقت لآخر. ستُنشر التغييرات الجوهرية هنا مع تاريخ "آخر تحديث" جديد، وسنُعلمك بها داخل التطبيق عند الاقتضاء.` },
        ],
      },
    ],
    contact: {
      heading: "11. التواصل",
      intro: `إذا كانت لديك أسئلة حول هذه السياسة، يمكنك التواصل معنا عبر:`,
      emailLabel: "البريد الإلكتروني",
      websiteLabel: "الموقع الإلكتروني",
    },
  },

  tr: {
    eyebrow: "Yasal",
    title: "Gizlilik Politikası",
    updated: "Son güncelleme: 26 Mayıs 2026",
    intro: `Bu Gizlilik Politikası, Admov uygulamasını ve hizmetlerini ("Hizmet") kullandığınızda **Admov**'un ("biz", "bize") bilgileri nasıl topladığını, kullandığını ve paylaştığını açıklar. Admov'u kullanarak bu Politikayı kabul etmiş olursunuz.`,
    sections: [
      {
        heading: "1. Topladığımız Bilgiler",
        blocks: [
          { p: `**Hesap bilgileri:** Apple, Google veya e-posta ile giriş yaptığınızda adınız, e-posta adresiniz ve kimlik doğrulama tanımlayıcıları.` },
          { p: `**Sağladığınız içerik:** yüklediğiniz fotoğraflar ve görseller, metin istemleri, marka ayrıntıları (işletme adı, logo, renkler, telefon, web sitesi, sosyal medya hesapları) ve oluşturduğunuz görseller. Yüklenen fotoğraflar, dahil etmeyi seçerseniz kişileri veya yüzleri içerebilir.` },
          { p: `**Satın alma bilgileri:** kredi satın alımları ve aboneliklere ilişkin kayıtlar. Ödemeler Apple tarafından işlenir; tam ödeme kartı bilgilerinizi almayız.` },
          { p: `**Kullanım ve cihaz verileri:** uygulama etkileşimleri, özellik kullanımı, oluşturma geçmişi, yaklaşık tanılama bilgileri, cihaz türü, işletim sistemi sürümü, dil ve benzeri teknik veriler.` },
        ],
      },
      {
        heading: "2. Bilgileri Nasıl Kullanırız",
        blocks: [
          { list: [
            `Hizmeti sağlamak, işletmek ve geliştirmek ve talep ettiğiniz Çıktıyı oluşturmak için.`,
            `Hesabınızı, kredilerinizi ve aboneliklerinizi yönetmek için.`,
            `Müşteri desteği sağlamak ve bildirimlere yanıt vermek için.`,
            `Koşullarımızı uygulamak, kötüye kullanımı önlemek ve güvenlik için içeriği denetlemek için.`,
            `İşlemsel mesajlar (ör. doğrulama kodları, parola sıfırlama) ve izin verilen durumlarda hizmet bildirimleri göndermek için.`,
            `Yasal yükümlülüklere uymak için.`,
          ] },
          { p: `Kişisel bilgilerinizi satmayız. İçeriğinizi kendi yapay zeka modellerimizi eğitmek için kullanmayız.` },
        ],
      },
      {
        heading: "3. Bilgileri Nasıl Paylaşırız",
        blocks: [
          { p: `Bilgileri yalnızca Hizmeti işletmek amacıyla hizmet sağlayıcılarla paylaşırız:` },
          { list: [
            `**Bulut/arka uç & depolama** (veritabanı, kimlik doğrulama, dosya depolama ve sunucusuz işlevler) uygulamayı çalıştırmak için.`,
            `**Yapay zeka modeli ve işleme sağlayıcıları** — yüklediğiniz görseller ve istemler, Çıktınızı oluşturmak veya düzenlemek için üçüncü taraf yapay zeka sağlayıcılarına gönderilir.`,
            `**Apple / Google** — giriş ve uygulama içi satın alımlar için.`,
            `**E-posta gönderim sağlayıcıları** — doğrulama ve hesap e-postaları göndermek için.`,
          ] },
          { p: `Bu sağlayıcılar verileri kendi gizlilik ve güvenlik taahhütleri kapsamında işler. Ayrıca yasalara uymak veya haklarımızı ve kullanıcılarımızı korumak için bilgileri açıklayabiliriz.` },
        ],
      },
      {
        heading: "4. Kamera, Fotoğraflar ve Bildirimler",
        blocks: [
          { p: `İzninizle uygulama, görsel yükleyebilmeniz için kameranıza ve fotoğraf kitaplığınıza erişir ve anlık bildirimler gönderebilir (ör. bir oluşturma hazır olduğunda). Bu izinleri istediğiniz zaman cihazınızın Ayarlar bölümünden değiştirebilirsiniz.` },
        ],
      },
      {
        heading: "5. Veri Saklama",
        blocks: [
          { p: `Hesap verilerinizi ve içeriğinizi, hesabınız etkin olduğu sürece ve Hizmeti sağlamak için gerektiği kadar saklarız. Hesabınızı uygulamadan sildiğinizde, yasal, güvenlik veya muhasebe amaçlarıyla saklamamız gereken durumlar dışında, kişisel verilerinizi makul bir süre içinde sileriz veya anonimleştiririz.` },
        ],
      },
      {
        heading: "6. Haklarınız",
        blocks: [
          { p: `Yaşadığınız yere bağlı olarak (ör. GDPR/KVKK kapsamında), verilerinize erişme, bunları düzeltme, silme veya taşıma ve belirli işlemelere itiraz etme veya bunları kısıtlama haklarına sahip olabilirsiniz. Hesabınızı doğrudan uygulamadan silebilir (Ayarlar → Hesabı sil) veya info@admov.io adresinden bizimle iletişime geçebilirsiniz. Geçerli yasaların gerektirdiği şekilde yanıt vereceğiz.` },
        ],
      },
      {
        heading: "7. Uluslararası Aktarımlar",
        blocks: [
          { p: `Bilgileriniz, hizmet sağlayıcılarımızın faaliyet gösterdiği yerler dahil olmak üzere kendi ülkeniz dışındaki ülkelerde işlenebilir. Bu Politikaya ve geçerli yasalara uygun olarak korumak için adımlar atıyoruz.` },
        ],
      },
      {
        heading: "8. Güvenlik",
        blocks: [
          { p: `Bilgilerinizi korumak için makul teknik ve organizasyonel önlemler kullanırız. Hiçbir iletim veya depolama yöntemi tamamen güvenli değildir, bu nedenle mutlak güvenliği garanti edemeyiz.` },
        ],
      },
      {
        heading: "9. Çocukların Gizliliği",
        blocks: [
          { p: `Hizmet 13 yaşın altındaki çocuklara (veya ülkenizdeki asgari yaşa) yönelik değildir ve bilerek onların verilerini toplamayız. Bir çocuğun bize bilgi verdiğini düşünüyorsanız bizimle iletişime geçin, sileriz.` },
        ],
      },
      {
        heading: "10. Bu Politikadaki Değişiklikler",
        blocks: [
          { p: `Bu Politikayı zaman zaman güncelleyebiliriz. Önemli değişiklikler burada yeni bir "Son güncelleme" tarihiyle yayınlanacak ve uygun olduğunda uygulama içinde bildirilecektir.` },
        ],
      },
    ],
    contact: {
      heading: "11. İletişim",
      intro: `Bu Politika hakkında sorularınız varsa bize şu adresten ulaşabilirsiniz:`,
      emailLabel: "E-posta",
      websiteLabel: "Web Sitesi",
    },
  },
};

export function PrivacyPolicy() {
  return <LegalDocPage content={content} />;
}
