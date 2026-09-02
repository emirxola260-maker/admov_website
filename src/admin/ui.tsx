"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Small form primitives matching the existing light admin theme (#5749C2 accent).

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-[11px] font-bold uppercase tracking-widest text-stone-500 mb-2">{label}</span>
      {children}
      {hint && <span className="block text-xs text-stone-400 mt-1.5">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full bg-white border border-[#eae7e7] rounded-xl px-4 py-3 text-sm text-[#1B1C1C] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5749C2]/30 focus:border-[#5749C2] transition";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, "leading-relaxed", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputClass, "appearance-none", props.className)} />;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost"; size?: "sm" | "md" }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  const sizes = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  const variants = {
    primary: "bg-gradient-to-br from-[#5749C2] to-[#7063DC] text-white shadow-lg shadow-[#5749C2]/20 hover:opacity-90",
    secondary: "border-2 border-[#5749C2]/20 text-[#5749C2] hover:bg-[#5749C2]/5",
    danger: "border-2 border-red-200 text-red-600 hover:bg-red-50",
    ghost: "text-stone-500 hover:text-[#1B1C1C] hover:bg-stone-100",
  }[variant];
  return <button {...props} className={cn(base, sizes, variants, className)} />;
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "amber" | "red" | "violet" | "blue" }) {
  const tones = {
    neutral: "bg-stone-100 text-stone-600",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
    violet: "bg-[#5749C2]/10 text-[#5749C2]",
    blue: "bg-blue-100 text-blue-700",
  }[tone];
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider", tones)}>{children}</span>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-white rounded-2xl border border-[#eae7e7] shadow-[0px_20px_40px_rgba(27,28,28,0.04)] p-6", className)}>{children}</div>;
}

export function Notice({ tone, children }: { tone: "error" | "success" | "info"; children: React.ReactNode }) {
  const tones = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-[#5749C2]/5 border-[#5749C2]/20 text-[#5749C2]",
  }[tone];
  return <div className={cn("rounded-xl border px-4 py-3 text-sm", tones)}>{children}</div>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-sm font-medium text-[#1B1C1C]">
      <span className={cn("relative inline-flex h-6 w-11 rounded-full transition-colors", checked ? "bg-[#5749C2]" : "bg-stone-300")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5.5 left-0" : "left-0.5")} style={{ transform: checked ? "translateX(22px)" : "translateX(0)" }} />
      </span>
      {label}
    </button>
  );
}
