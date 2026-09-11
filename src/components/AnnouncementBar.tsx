"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { ANNOUNCE_COOKIE, type Announcement } from "@/lib/announcement";

/**
 * Thin sitewide bar above the navbar.
 *
 * The root layout only renders it when the visitor has not already dismissed
 * this exact message (it reads the cookie server-side), so a closed bar never
 * flashes back on the next page. Every fixed header offsets itself by
 * --announce-h, which the layout sets on <html> and this component clears.
 */
export function AnnouncementBar({ announcement, closeLabel }: { announcement: Announcement; closeLabel: string }) {
  const [open, setOpen] = React.useState(true);

  const dismiss = () => {
    document.cookie = `${ANNOUNCE_COOKIE}=${announcement.version}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    document.documentElement.style.setProperty("--announce-h", "0px");
    setOpen(false);
  };

  if (!open) return null;

  const external = announcement.href?.startsWith("http");
  const linkClass = "inline-flex shrink-0 items-center gap-1 font-bold underline underline-offset-2 whitespace-nowrap hover:no-underline";

  return (
    <div className="fixed top-0 inset-x-0 z-[55] h-10 bg-violet text-zinc-950">
      <div className="relative max-w-7xl mx-auto h-full px-10 md:px-12 flex items-center justify-center gap-3 text-sm">
        <p className="min-w-0 truncate font-medium">{announcement.text}</p>
        {announcement.href && announcement.linkLabel && (
          external ? (
            <a href={announcement.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {announcement.linkLabel}
              <ArrowRight size={14} className="rtl:rotate-180" aria-hidden />
            </a>
          ) : (
            <Link href={announcement.href} className={linkClass}>
              {announcement.linkLabel}
              <ArrowRight size={14} className="rtl:rotate-180" aria-hidden />
            </Link>
          )
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label={closeLabel}
          className="absolute end-2 md:end-4 p-1.5 rounded-full hover:bg-zinc-950/10 transition-colors"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
