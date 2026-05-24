import * as React from "react";
import { motion } from "motion/react";
import { Mail, ArrowRight, Instagram, ChevronDown, Calendar, Clock, Phone } from "lucide-react";
import content from "@/data/content.json";
import { useLanguage } from "@/i18n/LanguageContext";
import ShinyText from "./ShinyText";
import { useAdminContent, getAdminContact } from "@/admin/useAdminContent";
import { sanitizeHttpUrl } from "@/lib/security";

const WORK_TYPES = [
  { en: "AI Video Production", ar: "إنتاج فيديو بالذكاء الاصطناعي", tr: "AI Video Prodüksiyon" },
  { en: "AI Photography", ar: "تصوير بالذكاء الاصطناعي", tr: "AI Fotoğrafçılık" },
  { en: "AI Automation", ar: "أتمتة بالذكاء الاصطناعي", tr: "AI Otomasyon" },
  { en: "E-Commerce & Shopify", ar: "التجارة الإلكترونية وشوبيفاي", tr: "E-Ticaret & Shopify" },
  { en: "Social Media Content", ar: "محتوى وسائل التواصل", tr: "Sosyal Medya İçerik" },
  { en: "Branding & Design", ar: "العلامة التجارية والتصميم", tr: "Marka & Tasarım" },
  { en: "Full Business Package", ar: "حزمة أعمال كاملة", tr: "Tam İş Paketi" },
  { en: "Other", ar: "أخرى", tr: "Diğer" },
];

const COUNTRIES = [
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
];

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_NAMES_AR = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];
const DAY_NAMES_TR = ["PAZ", "PTS", "SAL", "ÇAR", "PER", "CUM", "CTS"];

function MiniCalendar({ lang, onSelectDate }: { lang: string; onSelectDate?: (date: string) => void }) {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.toLocaleString(lang === "ar" ? "ar-SA" : lang === "tr" ? "tr-TR" : "en-US", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);

  const dayNames = lang === "ar" ? DAY_NAMES_AR : lang === "tr" ? DAY_NAMES_TR : DAY_NAMES;

  // Generate available days (future weekdays only)
  const availableDays = React.useMemo(() => {
    const days = new Set<number>();
    for (let d = currentDay + 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(currentYear, currentDate.getMonth(), d).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days.add(d);
      }
    }
    return days;
  }, [currentDay, daysInMonth, currentYear, currentDate.getMonth()]);

  const handleDayClick = (day: number) => {
    if (!availableDays.has(day)) return;
    setSelectedDay(day);
    const selectedDate = new Date(currentYear, currentDate.getMonth(), day);
    const dateString = selectedDate.toLocaleDateString(lang === "ar" ? "ar-SA" : lang === "tr" ? "tr-TR" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
    onSelectDate?.(dateString);
  };

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-zinc-50 font-syne font-bold text-sm">{currentMonth} {currentYear}</p>
          <p className="text-zinc-500 text-xs mt-0.5 flex items-center gap-1">
            <Clock size={10} />
            30 min call
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-violet/20 flex items-center justify-center">
          <Calendar size={14} className="text-violet" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div key={day} className="h-7 flex items-center justify-center">
            <span className="text-[10px] font-medium text-zinc-500">{day}</span>
          </div>
        ))}
        {Array(firstDayOfWeek).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="h-7" />
        ))}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const isToday = day === currentDay;
          const isPast = day < currentDay;
          const isAvailable = availableDays.has(day);
          const isSelected = day === selectedDay;

          let dayClass = "h-7 w-7 flex items-center justify-center rounded-lg text-xs font-medium transition-all ";

          if (isSelected) {
            dayClass += "bg-violet text-white ring-2 ring-violet/50 scale-110";
          } else if (isToday) {
            dayClass += "bg-violet/30 text-violet-light ring-1 ring-violet/30";
          } else if (isAvailable) {
            dayClass += "bg-violet/10 text-violet-light hover:bg-violet/30 cursor-pointer";
          } else if (isPast) {
            dayClass += "text-zinc-700 cursor-not-allowed";
          } else {
            dayClass += "text-zinc-400";
          }

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={!isAvailable && !isToday}
              className={dayClass}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-violet" />
          <span className="text-[10px] text-zinc-500">{lang === "ar" ? "اليوم" : lang === "tr" ? "Bugün" : "Today"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-violet/30" />
          <span className="text-[10px] text-zinc-500">{lang === "ar" ? "متاح" : lang === "tr" ? "Müsait" : "Available"}</span>
        </div>
        {selectedDay && (
          <div className="flex items-center gap-1.5 ml-auto rtl:mr-auto rtl:ml-0">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] text-green-400">{selectedDay} {lang === "ar" ? "مختار" : lang === "tr" ? "Seçildi" : "Selected"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

async function sendContactForm(data: {
  name: string;
  email: string;
  phone: string;
  workType: string;
  date: string;
  message: string;
  lang: string;
  company: string;
}) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to send message");
  }
  return response.json();
}

export function Contact() {
  const { t, lang } = useLanguage();
  const { content: adminContent } = useAdminContent();
  const adminContact = getAdminContact(adminContent);
  const contactInfo = adminContact || content.contact;

  const [countryOpen, setCountryOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(COUNTRIES[0]);
  const [workTypeOpen, setWorkTypeOpen] = React.useState(false);
  const [selectedWorkType, setSelectedWorkType] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  // Form state
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [company, setCompany] = React.useState(""); // honeypot — must stay empty
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const countryRef = React.useRef<HTMLDivElement>(null);
  const workTypeRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
      if (workTypeRef.current && !workTypeRef.current.contains(e.target as Node)) {
        setWorkTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const workTypeLabel = lang === "ar" ? "نوع العمل" : lang === "tr" ? "Hizmet Türü" : "Work Type";
  const workTypePlaceholder = lang === "ar" ? "اختر نوع الخدمة" : lang === "tr" ? "Hizmet seçin" : "Select a service";
  const phoneLabel = lang === "ar" ? "رقم الهاتف" : lang === "tr" ? "Telefon" : "Phone";
  const phonePlaceholder = lang === "ar" ? "رقم هاتفك" : lang === "tr" ? "Telefon numaranız" : "Your phone number";

  return (
    <section id="contact" className="py-16 md:py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 lg:p-24 overflow-hidden relative backdrop-blur-xl border border-white/15"
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left Column */}
            <div>
              <span className="font-syne font-bold text-[11px] text-violet-light tracking-[0.10em] uppercase mb-4 md:mb-6 block">
                {t.contact.label}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-zinc-50 mb-6 md:mb-8 leading-[1.05] break-words">
                {t.contact.heading1}<ShinyText text={t.contact.headingHighlight} className="text-violet-light" color="#A49BFF" shineColor="#ffffff" speed={3} />{t.contact.heading2}
              </h2>
              <p className="text-zinc-400 text-base md:text-lg mb-8 md:mb-10 max-w-md">
                {t.contact.subtext}
              </p>

              <div className="flex flex-col gap-6 mb-10">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-4 text-zinc-50 hover:text-violet-light transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-violet/20 transition-colors">
                    <Mail size={20} />
                  </div>
                  <span className="text-lg md:text-xl font-syne font-bold break-all">{contactInfo.email}</span>
                </a>

                <div className="flex gap-4 mt-2">
                  <a
                    href={sanitizeHttpUrl(contactInfo.instagram, "https://www.instagram.com/admov.io")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-50 hover:bg-violet/20 hover:text-violet-light transition-all"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href={sanitizeHttpUrl(contactInfo.tiktok, "https://www.tiktok.com/@admov.io")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-50 hover:bg-violet/20 hover:text-violet-light transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.71a8.19 8.19 0 004.76 1.52V6.79a4.83 4.83 0 01-1-.1z"/>
                    </svg>
                  </a>
                  <a
                    href={sanitizeHttpUrl(contactInfo.whatsapp, "https://wa.me/905375755445")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-50 hover:bg-violet/20 hover:text-violet-light transition-all"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>

            </div>

            {/* Right Column — Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl border border-white/15 p-6 md:p-10 rounded-[2rem]"
              style={{
                backgroundImage: 'linear-gradient(135deg, rgba(139, 125, 240, 0.15) 0%, rgba(115, 103, 240, 0.08) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <form
                className="flex flex-col gap-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  try {
                    await sendContactForm({
                      name,
                      email,
                      phone: `${selectedCountry.code} ${phone}`,
                      workType: selectedWorkType,
                      date: selectedDate,
                      message,
                      lang,
                      company,
                    });
                    setIsSubmitted(true);
                    // Reset form
                    setName("");
                    setEmail("");
                    setPhone("");
                    setMessage("");
                    setSelectedWorkType("");
                    setSelectedDate("");
                    setTimeout(() => setIsSubmitted(false), 5000);
                  } catch (error) {
                    console.error("Error sending to Telegram:", error);
                    alert("Error sending message. Please try again.");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {isSubmitted && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-green-400 text-sm">
                    {lang === "ar" ? "تم إرسال رسالتك بنجاح!" : lang === "tr" ? "Mesajınız başarıyla gönderildi!" : "Your message has been sent successfully!"}
                  </div>
                )}

                {/* Honeypot — hidden from real users, catches bots */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
                />

                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-syne font-bold uppercase tracking-wider">{t.contact.formName}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.contact.formNamePlaceholder}
                      required
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-50 text-sm focus:outline-none focus:border-violet/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-400 text-xs font-syne font-bold uppercase tracking-wider">{t.contact.formEmail}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.contact.formEmailPlaceholder}
                      required
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-50 text-sm focus:outline-none focus:border-violet/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Phone with Country Selector */}
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-syne font-bold uppercase tracking-wider">{phoneLabel}</label>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <div ref={countryRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setCountryOpen(!countryOpen)}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-zinc-50 text-sm flex items-center gap-1.5 hover:border-zinc-700 transition-colors min-w-[100px] justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="text-base">{selectedCountry.flag}</span>
                          <span className="text-zinc-300">{selectedCountry.code}</span>
                        </span>
                        <ChevronDown size={14} className={`text-zinc-500 transition-transform ${countryOpen ? "rotate-180" : ""}`} />
                      </button>
                      {countryOpen && (
                        <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-1 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 z-50 max-h-60 overflow-y-auto scrollbar-thin">
                          {COUNTRIES.map((country) => (
                            <button
                              key={country.code + country.name}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country);
                                setCountryOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${
                                selectedCountry.code === country.code && selectedCountry.name === country.name
                                  ? "bg-violet/10 text-violet-light"
                                  : "text-zinc-300"
                              }`}
                            >
                              <span className="text-base">{country.flag}</span>
                              <span className="flex-1 text-left rtl:text-right">{country.name}</span>
                              <span className="text-zinc-500 text-xs">{country.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={phonePlaceholder}
                      required
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-50 text-sm focus:outline-none focus:border-violet/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Work Type Selector */}
                <div className="flex flex-col gap-2" ref={workTypeRef}>
                  <label className="text-zinc-400 text-xs font-syne font-bold uppercase tracking-wider">{workTypeLabel}</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setWorkTypeOpen(!workTypeOpen)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm flex items-center justify-between hover:border-zinc-700 transition-colors"
                    >
                      <span className={selectedWorkType ? "text-zinc-50" : "text-zinc-500"}>
                        {selectedWorkType || workTypePlaceholder}
                      </span>
                      <ChevronDown size={14} className={`text-zinc-500 transition-transform ${workTypeOpen ? "rotate-180" : ""}`} />
                    </button>
                    {workTypeOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 z-50 overflow-hidden">
                        {WORK_TYPES.map((type) => {
                          const label = lang === "ar" ? type.ar : lang === "tr" ? type.tr : type.en;
                          return (
                            <button
                              key={type.en}
                              type="button"
                              onClick={() => {
                                setSelectedWorkType(label);
                                setWorkTypeOpen(false);
                              }}
                              className={`w-full text-left rtl:text-right px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors ${
                                selectedWorkType === label
                                  ? "bg-violet/10 text-violet-light"
                                  : "text-zinc-300"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferred Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-syne font-bold uppercase tracking-wider">
                    {lang === "ar" ? "التاريخ المفضل" : lang === "tr" ? "Tercih Edilen Tarih" : "Preferred Date"}
                  </label>
                  <MiniCalendar lang={lang} onSelectDate={setSelectedDate} />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 text-xs font-syne font-bold uppercase tracking-wider">{t.contact.formMessage}</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.contact.formMessagePlaceholder}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-50 text-sm focus:outline-none focus:border-violet/50 transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white py-4 rounded-xl font-syne font-bold text-lg transition-all flex items-center justify-center gap-2 group mt-1 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl border border-violet/30 hover:scale-105 active:scale-95"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 20px rgba(139, 125, 240, 0.3)',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⌛</span>
                      {lang === "ar" ? "جاري الإرسال..." : lang === "tr" ? "Gönderiliyor..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      {t.contact.formSubmit}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
