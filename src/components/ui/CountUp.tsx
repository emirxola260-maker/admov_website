"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Animates a stat from zero to its final value when it scrolls into view.
 *
 * Values arrive as display strings ("8+", "20+", "3"), so the numeric part is
 * animated and any prefix/suffix is preserved verbatim. Anything without a
 * number in it is rendered as-is, which keeps the component safe for whatever
 * the admin dashboard puts in a stat.
 */
function splitValue(value: string): { prefix: string; target: number; suffix: string; decimals: number } | null {
  const match = value.match(/^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/s);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const normalised = digits.replace(",", ".");
  const target = Number(normalised);
  if (!Number.isFinite(target)) return null;
  return { prefix, target, suffix, decimals: (normalised.split(".")[1] ?? "").length };
}

export function CountUp({ value, className, durationMs = 1400 }: { value: string; className?: string; durationMs?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const parsed = React.useMemo(() => splitValue(value), [value]);
  const [display, setDisplay] = React.useState(() => (parsed ? 0 : null));

  React.useEffect(() => {
    if (!parsed || !inView || reduceMotion) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      // Ease-out cubic: fast at first, settles gently on the real number.
      setDisplay(parsed.target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [parsed, inView, reduceMotion, durationMs]);

  if (!parsed) return <span className={className}>{value}</span>;

  // Before it enters the viewport (and whenever motion is reduced) the final
  // value is what renders, so the number is never missing for a crawler,
  // a screenshot, or someone who prefers less movement.
  const shown = reduceMotion || !inView || display === null ? parsed.target : display;

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {parsed.prefix}
      {shown.toFixed(parsed.decimals)}
      {parsed.suffix}
    </span>
  );
}
