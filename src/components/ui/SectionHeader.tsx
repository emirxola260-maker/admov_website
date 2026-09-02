import { cn } from "@/lib/utils";
import ShinyText from "@/components/ShinyText";

export function SectionHeader({
  label,
  heading,
  highlight,
  subtext,
  align = "center",
  className,
}: {
  label: string;
  heading: string;
  highlight?: string;
  subtext?: string;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "text-center max-w-3xl mx-auto" : "max-w-2xl", className)}>
      <span className={cn("section-label", align === "center" && "mx-auto")}>{label}</span>
      <h2 className="text-4xl md:text-6xl mb-6 text-zinc-50">
        {heading}
        {highlight && <ShinyText text={highlight} className="text-violet" color="#8B7DF0" shineColor="#ffffff" speed={3} />}
      </h2>
      {subtext && <p className="text-lg text-zinc-400">{subtext}</p>}
    </div>
  );
}
