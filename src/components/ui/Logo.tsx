import { cn } from "@/lib/utils";

/** The same two triangles used in the wordmark, reusable as a decorative brand detail. */
export function AdmovMark({ className, outline = false }: { className?: string; outline?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <polygon points="50,0 100,100 0,100" fill={outline ? "none" : "#A49BFF"} stroke={outline ? "currentColor" : undefined} vectorEffect="non-scaling-stroke" />
      <polygon points="50,50 75,100 25,100" fill={outline ? "none" : "#7367F0"} stroke={outline ? "currentColor" : undefined} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Logo({ size = "md", className }: { size?: "sm" | "md"; className?: string }) {
  const box = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const text = size === "sm" ? "text-lg" : "text-2xl";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn(box, "flex items-center justify-center")}>
        <AdmovMark className="w-full h-full" />
      </span>
      <span className={cn("logo-text font-extrabold tracking-tighter text-zinc-50", text)}>ADMOV</span>
    </span>
  );
}
