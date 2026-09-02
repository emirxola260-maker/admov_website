import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div
      id={id}
      className={cn("backdrop-blur-xl border border-white/15 rounded-3xl", className)}
      style={{
        backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      {children}
    </div>
  );
}
