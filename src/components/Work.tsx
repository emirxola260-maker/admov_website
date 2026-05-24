import * as React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Play, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import content from "@/data/content.json";
import { useLanguage } from "@/i18n/LanguageContext";
import ShinyText from "./ShinyText";
import { useAdminContent, getAdminWork } from "@/admin/useAdminContent";
import { sanitizeHttpUrl } from "@/lib/security";

export function Work() {
  const { t, lang } = useLanguage();
  const { content: adminContent } = useAdminContent();
  const work = getAdminWork(adminContent, lang, t.work);
  const [activeVideo, setActiveVideo] = React.useState<number | null>(null);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);

  // Get media URLs from admin content or fallback to content.json
  const getMediaUrl = (index: number, field: "imageUrl" | "videoUrl") => {
    const adminProject = adminContent?.work?.projects?.[index];
    if (field === "videoUrl") {
      return sanitizeHttpUrl(adminProject?.videoUrl || "");
    }
    return sanitizeHttpUrl(adminProject?.imageUrl || content.work[index]?.imageUrl || "");
  };

  const handleVideoToggle = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (activeVideo === index) {
      video.pause();
      setActiveVideo(null);
    } else {
      // Pause any other playing video
      if (activeVideo !== null && videoRefs.current[activeVideo]) {
        videoRefs.current[activeVideo]!.pause();
      }
      video.play();
      setActiveVideo(index);
    }
  };

  // The first two projects get the "featured" large layout
  const featured = work.projects.slice(0, 2);
  const rest = work.projects.slice(2);

  return (
    <section id="work" className="py-16 md:py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="section-label">{work.label}</span>
            <h2 className="text-3xl md:text-5xl text-zinc-50">
              {work.heading}
              <ShinyText
                text={work.headingHighlight}
                className="text-violet"
                color="#8B7DF0"
                shineColor="#ffffff"
                speed={3}
              />
            </h2>
          </div>
          <Link
            to="/work"
            className="font-syne font-bold text-zinc-50 hover:text-violet transition-colors flex items-center gap-2 group shrink-0"
          >
            {work.viewAll}
            <ArrowUpRight
              size={20}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform rtl:group-hover:-translate-x-1 rtl:group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* Featured Projects — Large Cards (2-up) */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {featured.map((project, index) => {
            const videoUrl = getMediaUrl(index, "videoUrl");
            const imageUrl = getMediaUrl(index, "imageUrl");
            const hasVideo = !!videoUrl;
            const isPlaying = activeVideo === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="group relative"
              >
                <div className="aspect-[16/10] rounded-[1.5rem] overflow-hidden bg-zinc-900 relative cursor-pointer"
                  onClick={() => hasVideo && handleVideoToggle(index)}
                >
                  {/* Image / Video */}
                  {hasVideo ? (
                    <>
                      <video
                        ref={(el) => { videoRefs.current[index] = el; }}
                        src={videoUrl}
                        muted
                        loop
                        playsInline
                        poster={imageUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Play overlay */}
                      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play size={24} fill="white" className="text-white ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={imageUrl}
                      alt={project.client}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />

                  {/* Category tag */}
                  <div className="absolute top-5 left-5 rtl:left-auto rtl:right-5">
                    <span className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-[11px] font-syne font-bold text-white uppercase tracking-wider border border-white/10">
                      {hasVideo && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        </span>
                      )}
                      {project.category}
                    </span>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-syne font-extrabold text-white mb-2 group-hover:text-violet-light transition-colors">
                      {project.client}
                    </h3>
                    <p className="text-zinc-300 text-sm md:text-base max-w-md leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      {project.description}
                    </p>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                      <ExternalLink size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rest of Projects — Smaller Cards (3-up or 4-up) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((project, i) => {
            const index = i + 2;
            const videoUrl = getMediaUrl(index, "videoUrl");
            const imageUrl = getMediaUrl(index, "imageUrl");
            const hasVideo = !!videoUrl;
            const isPlaying = activeVideo === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="group relative"
              >
                <div
                  className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 relative cursor-pointer"
                  onClick={() => hasVideo && handleVideoToggle(index)}
                  onMouseEnter={() => {
                    if (hasVideo && videoRefs.current[index]) {
                      videoRefs.current[index]!.play();
                      setActiveVideo(index);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasVideo && videoRefs.current[index]) {
                      videoRefs.current[index]!.pause();
                      videoRefs.current[index]!.currentTime = 0;
                      setActiveVideo(null);
                    }
                  }}
                >
                  {hasVideo ? (
                    <video
                      ref={(el) => { videoRefs.current[index] = el; }}
                      src={videoUrl}
                      muted
                      loop
                      playsInline
                      poster={imageUrl}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <img
                      src={imageUrl}
                      alt={project.client}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

                  {/* Video indicator */}
                  {hasVideo && (
                    <div className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-60'}`}>
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                        <Play size={12} fill="white" className="text-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Category pill */}
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>

                  {/* Bottom text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-syne font-extrabold text-white mb-1 group-hover:text-violet-light transition-colors">
                      {project.client}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
