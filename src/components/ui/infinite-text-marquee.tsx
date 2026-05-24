"use client";

import * as React from "react";
import { useEffect, useState } from "react";

type InfiniteTextMarqueeProps = {
  text?: string;
  link?: string;
  speed?: number;
  showTooltip?: boolean;
  tooltipText?: string;
  fontSize?: string;
  textColor?: string;
  hoverColor?: string;
  rtl?: boolean;
};

export const InfiniteTextMarquee: React.FC<InfiniteTextMarqueeProps> = ({
  text = "Let's Get Started",
  link = "#",
  speed = 200,
  showTooltip = true,
  tooltipText = "Time to Flex",
  fontSize = "clamp(2.5rem, 6vw, 6rem)",
  textColor = "",
  hoverColor = "",
  rtl = false,
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  const maxRotation = 8;

  useEffect(() => {
    if (!showTooltip) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      const midpoint = window.innerWidth / 2;
      const distanceFromMidpoint = Math.abs(e.clientX - midpoint);
      const rot = (distanceFromMidpoint / midpoint) * maxRotation;
      setRotation(e.clientX > midpoint ? rot : -rot);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showTooltip]);

  // Ensure text is valid
  const safeText = text || "Marquee Text";

  // Create the content - many repetitions to ensure seamless loop
  const content = Array(24).fill(`${safeText} ✦ `).join("");

  return (
    <>
      {showTooltip && (
        <div
          className={`fixed z-[99] transition-opacity duration-300 font-bold px-12 py-6 rounded-3xl text-nowrap
            ${isHovered ? "opacity-100" : "opacity-0"}
            bg-violet text-white pointer-events-none
          `}
          style={{
            top: `${cursorPosition.y}px`,
            left: `${cursorPosition.x}px`,
            transform: `rotateZ(${rotation}deg) translate(-50%, -140%)`,
          }}
        >
          <p>{tooltipText}</p>
        </div>
      )}

      <div
        className="relative w-full overflow-hidden py-6 md:py-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex"
          style={{
            width: "max-content",
            animation: `marquee-scroll ${speed}s linear infinite`,
          }}
        >
          <a
            href={link}
            className="whitespace-nowrap flex-shrink-0"
            style={{ color: textColor || undefined }}
          >
            <span
              className={`font-bold tracking-tight block ${textColor ? "" : "text-zinc-50"}`}
              style={{ fontSize }}
            >
              {content}
            </span>
          </a>
          {/* Duplicate for seamless loop */}
          <a
            href={link}
            className="whitespace-nowrap flex-shrink-0"
            style={{ color: textColor || undefined }}
          >
            <span
              className={`font-bold tracking-tight block ${textColor ? "" : "text-zinc-50"}`}
              style={{ fontSize }}
            >
              {content}
            </span>
          </a>
        </div>
      </div>

      {/* Inline styles for animation */}
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
};
