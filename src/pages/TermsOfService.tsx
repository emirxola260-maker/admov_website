import { LegalDocPage, type Lang, type LegalDoc } from "./legalShared";

const content: Record<Lang, LegalDoc> = {
  en: {
    eyebrow: "Legal",
    title: "Terms of Use",
    updated: "Last updated: May 26, 2026",
    intro: `These Terms of Use ("Terms") govern your access to and use of the Admov mobile application and related services (collectively, the "Service"), operated by **Admov** ("we", "us", or "our"). By downloading, accessing, or using the Service, you agree to these Terms. If you do not agree, do not use the Service.`,
    sections: [
      { heading: "1. The Service", blocks: [
        { p: `Admov is an AI-powered creative tool that lets you generate, edit, and enhance advertising and marketing images from photos and text prompts you provide. Output is produced using artificial intelligence and may vary in quality and accuracy.` },
      ] },
      { heading: "2. Eligibility", blocks: [
        { p: `You must be at least 13 years old (or the minimum digital-consent age in your country) to use the Service. If you use Admov on behalf of a business, you represent that you are authorized to bind that business to these Terms.` },
      ] },
      { heading: "3. Accounts", blocks: [
        { p: `You can browse parts of the app as a guest, but creating content requires an account. You are responsible for safeguarding your login credentials and for all activity under your account. Sign-in is provided via Apple, Google, or email. Notify us at info@admov.io of any unauthorized use.` },
      ] },
      { heading: "4. Credits, Purchases & Subscriptions", blocks: [
        { p: `The Service runs on a credit system. Credits and subscriptions are sold as in-app purchases processed by Apple.` },
        { list: [
          `**Consumable credits** are deducted when you generate or process content and are non-refundable once used, except where required by law.`,
          `**Subscriptions** (e.g. Pro, Business) are auto-renewable. Your Apple ID is charged upon confirmation of purchase and at the start of each renewal period. Subscriptions renew automatically unless canceled at least 24 hours before the end of the current period. Manage or cancel anytime in your App Store account settings.`,
          `Prices may change with notice. Refunds are handled by Apple under the App Store terms.`,
        ] },
      ] },
      { heading: "5. Acceptable Use", blocks: [
        { p: `You agree not to use the Service to create, upload, or share content that:` },
        { list: [
          `is illegal, infringing, defamatory, hateful, harassing, or violent;`,
          `is sexually explicit or exploits minors;`,
          `impersonates a real person without consent, or uses someone's likeness unlawfully;`,
          `infringes intellectual-property, privacy, or publicity rights;`,
          `is misleading, fraudulent, or violates advertising laws applicable to you.`,
        ] },
        { p: `We may filter prompts, review generated content, suspend accounts, and remove content that violates these Terms.` },
      ] },
      { heading: "6. Your Content", blocks: [
        { p: `You retain ownership of the photos, logos, text, and other materials you upload ("Your Content"). You grant Admov a worldwide, non-exclusive license to host, process, and transmit Your Content solely to operate and improve the Service, including sending it to third-party AI providers to fulfill your requests. You represent that you have all rights necessary to upload Your Content and to authorize this processing.` },
      ] },
      { heading: "7. Generated Output", blocks: [
        { p: `Subject to your compliance with these Terms and applicable law, you may use the images you generate ("Output") for personal and commercial purposes. Because Output is produced by AI:` },
        { list: [
          `similar Output may be generated for other users;`,
          `we do not guarantee that Output is unique, accurate, or free of third-party rights, and you are responsible for reviewing it before use;`,
          `you are solely responsible for how you use Output, including compliance with advertising, trademark, and consumer-protection laws.`,
        ] },
      ] },
      { heading: "8. Intellectual Property", blocks: [
        { p: `The Service, including its software, design, branding, and templates, is owned by Admov and protected by law. We grant you a limited, revocable, non-transferable license to use the app for its intended purpose. You may not copy, reverse engineer, or resell the Service.` },
      ] },
      { heading: "9. Third-Party Services", blocks: [
        { p: `Admov relies on third parties including Apple, Google, and AI model and infrastructure providers. Your use of those services is subject to their terms, and we are not responsible for them.` },
      ] },
      { heading: "10. Termination", blocks: [
        { p: `We may suspend or terminate your access at any time for violation of these Terms or to protect the Service. You may stop using the Service and delete your account at any time from within the app.` },
      ] },
      { heading: "11. Disclaimers", blocks: [
        { p: `THE SERVICE AND OUTPUT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.` },
      ] },
      { heading: "12. Limitation of Liability", blocks: [
        { p: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ADMOV WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, OR FOR LOST PROFITS OR DATA. OUR TOTAL LIABILITY FOR ANY CLAIM WILL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS BEFORE THE CLAIM.` },
      ] },
      { heading: "13. Indemnification", blocks: [
        { p: `You agree to indemnify and hold Admov harmless from claims arising out of Your Content, your Output, or your violation of these Terms or applicable law.` },
      ] },
      { heading: "14. Apple App Store", blocks: [
        { p: `These Terms are between you and Admov, not Apple. Apple is not responsible for the Service or its content. Apple has no obligation to provide support or handle warranty claims, and is not responsible for any third-party claims relating to the app. Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.` },
      ] },
      { heading: "15. Changes", blocks: [
        { p: `We may update these Terms from time to time. Material changes will be posted in the app or on this page with a new "Last updated" date. Continued use after changes means you accept them.` },
      ] },
      { heading: "16. Governing Law", blocks: [
        { p: `These Terms are governed by the laws of **the Republic of Türkiye**, without regard to conflict-of-law rules. Disputes will be resolved in the courts of **Istanbul**, unless otherwise required by mandatory local law.` },
      ] },
    ],
    contact: {
      heading: "17. Contact",
      intro: `For questions about these Terms, you can reach us at:`,
      emailLabel: "Email",
      websiteLabel: "Website",
    },
  },

  ar: {
    eyebrow: "قانوني",
    title: "شروط الاستخدام",
    updated: "آخر تحديث: 26 مايو 2026",
    intro: `تحكم شروط الاستخدام هذه ("الشروط") وصولك إلى تطبيق Admov للهواتف المحمولة والخدمات المرتبطة به (يُشار إليها مجتمعةً بـ "الخدمة") واستخدامك لها، وتُشغّلها **Admov** ("نحن"، "لنا"، أو "خاصتنا"). بتنزيلك الخدمة أو الوصول إليها أو استخدامها، فإنك توافق على هذه الشروط. وإذا لم توافق، فلا تستخدم الخدمة.`,
    sections: [
      { heading: "1. الخدمة", blocks: [
        { p: `Admov أداة إبداعية مدعومة بالذكاء الاصطناعي تتيح لك إنشاء صور إعلانية وتسويقية وتحريرها وتحسينها انطلاقًا من الصور والنصوص التوجيهية التي تقدّمها. تُنتَج المُخرجات باستخدام الذكاء الاصطناعي وقد تتفاوت في الجودة والدقة.` },
      ] },
      { heading: "2. الأهلية", blocks: [
        { p: `يجب أن يكون عمرك 13 عامًا على الأقل (أو الحد الأدنى لسن الموافقة الرقمية في بلدك) لاستخدام الخدمة. إذا كنت تستخدم Admov نيابةً عن نشاط تجاري، فإنك تقرّ بأنك مخوّل بإلزام ذلك النشاط بهذه الشروط.` },
      ] },
      { heading: "3. الحسابات", blocks: [
        { p: `يمكنك تصفّح أجزاء من التطبيق كضيف، لكن إنشاء المحتوى يتطلّب حسابًا. أنت مسؤول عن حماية بيانات تسجيل دخولك وعن جميع الأنشطة التي تتم ضمن حسابك. يتوفّر تسجيل الدخول عبر Apple أو Google أو البريد الإلكتروني. أبلغنا عبر info@admov.io بأي استخدام غير مصرّح به.` },
      ] },
      { heading: "4. الأرصدة والمشتريات والاشتراكات", blocks: [
        { p: `تعمل الخدمة بنظام أرصدة. تُباع الأرصدة والاشتراكات كعمليات شراء داخل التطبيق تتم معالجتها عبر Apple.` },
        { list: [
          `**الأرصدة الاستهلاكية** تُخصَم عند إنشاء المحتوى أو معالجته وغير قابلة للاسترداد بعد استخدامها، إلا حيثما يقتضي القانون ذلك.`,
          `**الاشتراكات** (مثل Pro وBusiness) تُجدَّد تلقائيًا. يُحصَّل من معرّف Apple الخاص بك عند تأكيد الشراء وفي بداية كل فترة تجديد. تُجدَّد الاشتراكات تلقائيًا ما لم يتم إلغاؤها قبل 24 ساعة على الأقل من نهاية الفترة الحالية. يمكنك الإدارة أو الإلغاء في أي وقت من إعدادات حساب App Store.`,
          `قد تتغيّر الأسعار مع إشعار مسبق. تتم معالجة عمليات الاسترداد عبر Apple بموجب شروط App Store.`,
        ] },
      ] },
      { heading: "5. الاستخدام المقبول", blocks: [
        { p: `أنت توافق على عدم استخدام الخدمة لإنشاء أو رفع أو مشاركة محتوى:` },
        { list: [
          `غير قانوني أو مُنتهِك للحقوق أو تشهيري أو يحضّ على الكراهية أو يتضمّن مضايقة أو عنفًا؛`,
          `ذي طابع جنسي صريح أو يستغلّ القاصرين؛`,
          `ينتحل شخصية حقيقية دون موافقتها، أو يستخدم صورة شخص ما بصورة غير قانونية؛`,
          `ينتهك حقوق الملكية الفكرية أو الخصوصية أو حقوق الدعاية؛`,
          `مضلِّل أو احتيالي أو يخالف قوانين الإعلان المنطبقة عليك.`,
        ] },
        { p: `يجوز لنا تصفية النصوص التوجيهية، ومراجعة المحتوى المُنشأ، وتعليق الحسابات، وإزالة المحتوى الذي ينتهك هذه الشروط.` },
      ] },
      { heading: "6. المحتوى الخاص بك", blocks: [
        { p: `تحتفظ بملكية الصور والشعارات والنصوص والمواد الأخرى التي ترفعها ("المحتوى الخاص بك"). وتمنح Admov ترخيصًا عالميًا غير حصري لاستضافة المحتوى الخاص بك ومعالجته ونقله فقط لتشغيل الخدمة وتحسينها، بما في ذلك إرساله إلى مزوّدي ذكاء اصطناعي خارجيين لتلبية طلباتك. وتقرّ بأنك تملك جميع الحقوق اللازمة لرفع المحتوى الخاص بك والإذن بهذه المعالجة.` },
      ] },
      { heading: "7. المُخرجات المُنشأة", blocks: [
        { p: `رهنًا بالتزامك بهذه الشروط والقانون المعمول به، يجوز لك استخدام الصور التي تنشئها ("المُخرجات") للأغراض الشخصية والتجارية. ولأن المُخرجات تُنتَج بواسطة الذكاء الاصطناعي:` },
        { list: [
          `قد تُنشأ مُخرجات مشابهة لمستخدمين آخرين؛`,
          `لا نضمن أن تكون المُخرجات فريدة أو دقيقة أو خالية من حقوق الغير، وأنت مسؤول عن مراجعتها قبل استخدامها؛`,
          `أنت وحدك المسؤول عن كيفية استخدامك للمُخرجات، بما في ذلك الامتثال لقوانين الإعلان والعلامات التجارية وحماية المستهلك.`,
        ] },
      ] },
      { heading: "8. الملكية الفكرية", blocks: [
        { p: `الخدمة، بما في ذلك برمجياتها وتصميمها وعلامتها التجارية وقوالبها، مملوكة لـ Admov ومحمية بموجب القانون. نمنحك ترخيصًا محدودًا وقابلاً للإلغاء وغير قابل للنقل لاستخدام التطبيق للغرض المقصود منه. لا يجوز لك نسخ الخدمة أو هندستها عكسيًا أو إعادة بيعها.` },
      ] },
      { heading: "9. خدمات الأطراف الثالثة", blocks: [
        { p: `تعتمد Admov على أطراف ثالثة، منها Apple وGoogle ومزوّدو نماذج الذكاء الاصطناعي والبنية التحتية. ويخضع استخدامك لتلك الخدمات لشروطها، ولسنا مسؤولين عنها.` },
      ] },
      { heading: "10. الإنهاء", blocks: [
        { p: `يجوز لنا تعليق وصولك أو إنهاؤه في أي وقت بسبب انتهاك هذه الشروط أو لحماية الخدمة. ويمكنك التوقف عن استخدام الخدمة وحذف حسابك في أي وقت من داخل التطبيق.` },
      ] },
      { heading: "11. إخلاء المسؤولية", blocks: [
        { p: `تُقدَّم الخدمة والمُخرجات "كما هي" و"حسب توفّرها" دون أي ضمانات من أي نوع، صريحة كانت أو ضمنية، بما في ذلك ضمانات القابلية للتسويق والملاءمة لغرض معيّن وعدم انتهاك الحقوق.` },
      ] },
      { heading: "12. تحديد المسؤولية", blocks: [
        { p: `إلى أقصى حدّ يسمح به القانون، لن تكون Admov مسؤولة عن الأضرار غير المباشرة أو العَرَضية أو الخاصة أو التبعية، أو عن خسارة الأرباح أو البيانات. ولن تتجاوز مسؤوليتنا الإجمالية عن أي مطالبة المبلغ الذي دفعته لنا خلال الـ 12 شهرًا السابقة للمطالبة.` },
      ] },
      { heading: "13. التعويض", blocks: [
        { p: `أنت توافق على تعويض Admov وإبراء ذمتها من أي مطالبات تنشأ عن المحتوى الخاص بك أو مُخرجاتك أو انتهاكك لهذه الشروط أو للقانون المعمول به.` },
      ] },
      { heading: "14. متجر Apple App Store", blocks: [
        { p: `هذه الشروط مبرمة بينك وبين Admov، وليست مع Apple. ليست Apple مسؤولة عن الخدمة أو محتواها. ولا يقع على Apple أي التزام بتقديم الدعم أو معالجة مطالبات الضمان، وليست مسؤولة عن أي مطالبات من أطراف ثالثة تتعلق بالتطبيق. وتُعدّ Apple وشركاتها التابعة مستفيدين من أطراف ثالثة بموجب هذه الشروط ويجوز لها إنفاذها بحقك.` },
      ] },
      { heading: "15. التغييرات", blocks: [
        { p: `قد نحدّث هذه الشروط من وقت لآخر. ستُنشر التغييرات الجوهرية داخل التطبيق أو على هذه الصفحة مع تاريخ "آخر تحديث" جديد. ويعني استمرارك في الاستخدام بعد التغييرات قبولك لها.` },
      ] },
      { heading: "16. القانون الحاكم", blocks: [
        { p: `تخضع هذه الشروط لقوانين **جمهورية تركيا**، دون اعتبار لقواعد تنازع القوانين. وتُحَلّ النزاعات في محاكم **إسطنبول**، ما لم يقتضِ القانون المحلي الإلزامي خلاف ذلك.` },
      ] },
    ],
    contact: {
      heading: "17. التواصل",
      intro: `لأي أسئلة حول هذه الشروط، يمكنك التواصل معنا عبر:`,
      emailLabel: "البريد الإلكتروني",
      websiteLabel: "الموقع الإلكتروني",
    },
  },

  tr: {
    eyebrow: "Yasal",
    title: "Kullanım Koşulları",
    updated: "Son güncelleme: 26 Mayıs 2026",
    intro: `Bu Kullanım Koşulları ("Koşullar"), Admov mobil uygulamasına ve ilgili hizmetlere (topluca "Hizmet") erişiminizi ve bunları kullanımınızı düzenler; Hizmet **Admov** ("biz", "bize" veya "bizim") tarafından işletilir. Hizmeti indirerek, ona erişerek veya kullanarak bu Koşulları kabul edersiniz. Kabul etmiyorsanız Hizmeti kullanmayın.`,
    sections: [
      { heading: "1. Hizmet", blocks: [
        { p: `Admov, sağladığınız fotoğraflar ve metin istemlerinden reklam ve pazarlama görselleri oluşturmanıza, düzenlemenize ve geliştirmenize olanak tanıyan yapay zeka destekli bir yaratıcı araçtır. Çıktı yapay zeka kullanılarak üretilir ve kalite ile doğrulukta değişiklik gösterebilir.` },
      ] },
      { heading: "2. Uygunluk", blocks: [
        { p: `Hizmeti kullanmak için en az 13 yaşında (veya ülkenizdeki asgari dijital onay yaşında) olmalısınız. Admov'u bir işletme adına kullanıyorsanız, o işletmeyi bu Koşullarla bağlama yetkiniz olduğunu beyan edersiniz.` },
      ] },
      { heading: "3. Hesaplar", blocks: [
        { p: `Uygulamanın bazı bölümlerine misafir olarak göz atabilirsiniz, ancak içerik oluşturmak bir hesap gerektirir. Giriş bilgilerinizi korumaktan ve hesabınız altındaki tüm etkinliklerden siz sorumlusunuz. Giriş Apple, Google veya e-posta ile sağlanır. Yetkisiz herhangi bir kullanımı info@admov.io adresinden bize bildirin.` },
      ] },
      { heading: "4. Krediler, Satın Almalar ve Abonelikler", blocks: [
        { p: `Hizmet bir kredi sistemiyle çalışır. Krediler ve abonelikler, Apple tarafından işlenen uygulama içi satın almalar olarak satılır.` },
        { list: [
          `**Tüketilebilir krediler**, içerik oluşturduğunuzda veya işlediğinizde düşülür ve yasaların gerektirdiği durumlar dışında, kullanıldıktan sonra iade edilemez.`,
          `**Abonelikler** (ör. Pro, Business) otomatik yenilenir. Apple Kimliğiniz, satın alma onayında ve her yenileme döneminin başında ücretlendirilir. Abonelikler, mevcut dönemin bitiminden en az 24 saat önce iptal edilmediği sürece otomatik olarak yenilenir. İstediğiniz zaman App Store hesap ayarlarınızdan yönetebilir veya iptal edebilirsiniz.`,
          `Fiyatlar bildirimde bulunularak değişebilir. İadeler, App Store koşulları kapsamında Apple tarafından yönetilir.`,
        ] },
      ] },
      { heading: "5. Kabul Edilebilir Kullanım", blocks: [
        { p: `Hizmeti, aşağıdaki nitelikte içerik oluşturmak, yüklemek veya paylaşmak için kullanmamayı kabul edersiniz:` },
        { list: [
          `yasa dışı, hak ihlali içeren, hakaret edici, nefret söylemi içeren, taciz edici veya şiddet içeren;`,
          `müstehcen olan veya küçükleri istismar eden;`,
          `rızası olmadan gerçek bir kişinin kimliğine bürünen veya birinin görüntüsünü hukuka aykırı şekilde kullanan;`,
          `fikri mülkiyet, gizlilik veya kişilik haklarını ihlal eden;`,
          `yanıltıcı, hileli olan veya size uygulanan reklam yasalarını ihlal eden.`,
        ] },
        { p: `İstemleri filtreleyebilir, oluşturulan içeriği inceleyebilir, hesapları askıya alabilir ve bu Koşulları ihlal eden içeriği kaldırabiliriz.` },
      ] },
      { heading: "6. İçeriğiniz", blocks: [
        { p: `Yüklediğiniz fotoğrafların, logoların, metinlerin ve diğer materyallerin ("İçeriğiniz") mülkiyetini elinizde tutarsınız. Admov'a, yalnızca Hizmeti işletmek ve geliştirmek amacıyla — taleplerinizi yerine getirmek üzere üçüncü taraf yapay zeka sağlayıcılarına göndermek dahil — İçeriğinizi barındırması, işlemesi ve iletmesi için dünya çapında, münhasır olmayan bir lisans verirsiniz. İçeriğinizi yüklemek ve bu işlemeye izin vermek için gerekli tüm haklara sahip olduğunuzu beyan edersiniz.` },
      ] },
      { heading: "7. Oluşturulan Çıktı", blocks: [
        { p: `Bu Koşullara ve geçerli yasalara uymanız koşuluyla, oluşturduğunuz görselleri ("Çıktı") kişisel ve ticari amaçlarla kullanabilirsiniz. Çıktı yapay zeka tarafından üretildiğinden:` },
        { list: [
          `diğer kullanıcılar için benzer Çıktı oluşturulabilir;`,
          `Çıktının benzersiz, doğru veya üçüncü taraf haklarından arınmış olduğunu garanti etmeyiz ve kullanmadan önce gözden geçirmekten siz sorumlusunuz;`,
          `Çıktıyı nasıl kullandığınızdan — reklam, ticari marka ve tüketici koruma yasalarına uyum dahil — yalnızca siz sorumlusunuz.`,
        ] },
      ] },
      { heading: "8. Fikri Mülkiyet", blocks: [
        { p: `Yazılımı, tasarımı, markası ve şablonları dahil olmak üzere Hizmet, Admov'a aittir ve yasalarca korunur. Size, uygulamayı amaçlanan şekilde kullanmanız için sınırlı, geri alınabilir ve devredilemez bir lisans veririz. Hizmeti kopyalayamaz, tersine mühendislik yapamaz veya yeniden satamazsınız.` },
      ] },
      { heading: "9. Üçüncü Taraf Hizmetleri", blocks: [
        { p: `Admov; Apple, Google ve yapay zeka modeli ile altyapı sağlayıcıları dahil üçüncü taraflara dayanır. Bu hizmetleri kullanımınız onların koşullarına tabidir ve biz onlardan sorumlu değiliz.` },
      ] },
      { heading: "10. Fesih", blocks: [
        { p: `Bu Koşulların ihlali nedeniyle veya Hizmeti korumak için erişiminizi istediğimiz zaman askıya alabilir veya sonlandırabiliriz. Hizmeti kullanmayı bırakabilir ve hesabınızı istediğiniz zaman uygulama içinden silebilirsiniz.` },
      ] },
      { heading: "11. Sorumluluk Reddi", blocks: [
        { p: `HİZMET VE ÇIKTI; TİCARİ ELVERİŞLİLİK, BELİRLİ BİR AMACA UYGUNLUK VE İHLAL ETMEME DAHİL OLMAK ÜZERE, AÇIK VEYA ZIMNİ HİÇBİR GARANTİ OLMAKSIZIN "OLDUĞU GİBİ" VE "MEVCUT HÂLİYLE" SAĞLANIR.` },
      ] },
      { heading: "12. Sorumluluğun Sınırlandırılması", blocks: [
        { p: `YASALARIN İZİN VERDİĞİ AZAMİ ÖLÇÜDE, ADMOV DOLAYLI, ARIZİ, ÖZEL VEYA SONUÇSAL ZARARLARDAN YA DA KÂR VEYA VERİ KAYBINDAN SORUMLU OLMAYACAKTIR. HERHANGİ BİR TALEP İÇİN TOPLAM SORUMLULUĞUMUZ, TALEPTEN ÖNCEKİ 12 AY İÇİNDE BİZE ÖDEDİĞİNİZ TUTARI AŞMAYACAKTIR.` },
      ] },
      { heading: "13. Tazminat", blocks: [
        { p: `İçeriğinizden, Çıktınızdan veya bu Koşulları ya da geçerli yasaları ihlal etmenizden kaynaklanan taleplere karşı Admov'u tazmin etmeyi ve zarar görmemesini sağlamayı kabul edersiniz.` },
      ] },
      { heading: "14. Apple App Store", blocks: [
        { p: `Bu Koşullar sizinle Admov arasındadır, Apple ile değil. Apple, Hizmetten veya içeriğinden sorumlu değildir. Apple'ın destek sağlama veya garanti taleplerini ele alma yükümlülüğü yoktur ve uygulamayla ilgili herhangi bir üçüncü taraf talebinden sorumlu değildir. Apple ve bağlı kuruluşları bu Koşulların üçüncü taraf yararlanıcılarıdır ve bunları size karşı uygulayabilirler.` },
      ] },
      { heading: "15. Değişiklikler", blocks: [
        { p: `Bu Koşulları zaman zaman güncelleyebiliriz. Önemli değişiklikler, yeni bir "Son güncelleme" tarihiyle uygulamada veya bu sayfada yayınlanacaktır. Değişikliklerden sonra kullanmaya devam etmeniz, bunları kabul ettiğiniz anlamına gelir.` },
      ] },
      { heading: "16. Geçerli Hukuk", blocks: [
        { p: `Bu Koşullar, kanunlar ihtilafı kurallarına bakılmaksızın **Türkiye Cumhuriyeti** yasalarına tabidir. Zorunlu yerel yasaların aksini gerektirdiği durumlar dışında, uyuşmazlıklar **İstanbul** mahkemelerinde çözümlenecektir.` },
      ] },
    ],
    contact: {
      heading: "17. İletişim",
      intro: `Bu Koşullar hakkında sorularınız için bize şu adresten ulaşabilirsiniz:`,
      emailLabel: "E-posta",
      websiteLabel: "Web Sitesi",
    },
  },
};

export function TermsOfService() {
  return <LegalDocPage content={content} />;
}
