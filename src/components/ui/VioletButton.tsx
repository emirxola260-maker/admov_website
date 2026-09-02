import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const VARIANTS: Record<"violet" | "glass", { className: string; style: CSSProperties }> = {
  violet: {
    className: "text-white border border-violet/30",
    style: {
      backgroundImage: "linear-gradient(135deg, rgba(139, 125, 240, 0.6) 0%, rgba(115, 103, 240, 0.4) 100%)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 20px rgba(139, 125, 240, 0.3)",
    },
  },
  glass: {
    className: "text-zinc-50 border border-white/20",
    style: {
      backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 20px rgba(0, 0, 0, 0.3)",
    },
  },
};

const SIZES = { sm: "px-4 py-2 text-sm", md: "px-6 py-3 text-base", lg: "px-8 py-4 text-lg" };

export function VioletButton({
  href,
  onClick,
  variant = "violet",
  size = "md",
  type = "button",
  external,
  disabled,
  className,
  children,
}: {
  href?: string;
  onClick?: () => void;
  variant?: "violet" | "glass";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  external?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const v = VARIANTS[variant];
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-syne font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-xl disabled:opacity-60 disabled:hover:scale-100",
    SIZES[size],
    v.className,
    className,
  );
  if (href) {
    const isExternal = external ?? /^https?:\/\//.test(href);
    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={v.style}>
        {children}
      </a>
    ) : (
      <Link href={href} className={cls} style={v.style}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={v.style}>
      {children}
    </button>
  );
}
