import { Syne, DM_Sans } from "next/font/google";
import localFont from "next/font/local";

// Exposed as CSS variables on <html> (see src/app/layout.tsx) and mapped to the
// Tailwind font tokens in src/app/globals.css.
export const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--next-font-syne",
  display: "swap",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--next-font-dm",
  display: "swap",
});

// Arabic display face, self-hosted from public/fonts. Not preloaded: only Arabic pages use it.
export const changa = localFont({
  src: [
    { path: "../../public/fonts/changa-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/changa-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/changa-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/changa-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--next-font-changa",
  display: "swap",
  preload: false,
});
