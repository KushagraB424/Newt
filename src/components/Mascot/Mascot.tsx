import React from "react";
import "./Mascot.css";

export type MascotMood =
  | "idle"
  | "listening"
  | "thinking"
  | "talking"
  | "happy"
  | "celebrate"
  | "not-yet"
  | "wave"
  | "nudge"
  | "curious";

export interface MascotProps {
  mood?: MascotMood;
  size?: number | string;
  faceOnly?: boolean;
  variant?: "clay" | "lilac";
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = "idle",
  size = 120,
  faceOnly = false,
  variant = "clay",
  className = "",
}) => {
  const pixelSize = typeof size === "number" ? `${size}px` : size;

  if (variant === "lilac") {
    return (
      <div
        className={`newt-mascot lilac mood-${mood} ${faceOnly ? "face-only" : ""} ${className}`}
        style={{ width: pixelSize, height: pixelSize }}
        aria-label={`Newt mascot (${mood})`}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="42" fill="var(--tutor-soft)" stroke="var(--tutor)" strokeWidth="4" />
          {/* Crest */}
          <circle cx="34" cy="18" r="7" fill="#a08fff" />
          <circle cx="50" cy="14" r="8.5" fill="var(--tutor)" />
          <circle cx="66" cy="18" r="7" fill="#a08fff" />
          {/* Eyes */}
          <circle cx="38" cy="46" r="6" fill="var(--ink)" className="mascot-eye" />
          <circle cx="62" cy="46" r="6" fill="var(--ink)" className="mascot-eye" />
          <circle cx="36" cy="44" r="2" fill="#fff" />
          <circle cx="60" cy="44" r="2" fill="#fff" />
          {/* Mouth */}
          {mood === "talking" ? (
            <ellipse cx="50" cy="62" rx="6" ry="8" fill="var(--ink)" className="talking-mouth" />
          ) : mood === "not-yet" ? (
            <path d="M 42 64 Q 50 61 58 64" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 42 58 Q 50 68 58 58" stroke="var(--ink)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          )}
        </svg>
      </div>
    );
  }

  // Terracotta Clay Newt (Spec Final Mascot)
  return (
    <div
      className={`newt-mascot clay mood-${mood} ${faceOnly ? "face-only" : ""} ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
      aria-label={`Newt mascot (${mood})`}
    >
      <svg viewBox="0 0 120 120" width="100%" height="100%">
        {/* Head / Body */}
        <circle cx="60" cy="64" r="44" fill="var(--newt-clay)" stroke="var(--ink)" strokeWidth="3" />
        {/* Belly & Cheeks in warm cream */}
        <ellipse cx="60" cy="74" rx="32" ry="24" fill="var(--newt-cream)" />
        
        {/* Clay crest crest spots */}
        <circle cx="38" cy="24" r="7.5" fill="var(--newt-spot)" stroke="var(--ink)" strokeWidth="2.5" />
        <circle cx="60" cy="18" r="9" fill="var(--newt-spot)" stroke="var(--ink)" strokeWidth="2.5" />
        <circle cx="82" cy="24" r="7.5" fill="var(--newt-spot)" stroke="var(--ink)" strokeWidth="2.5" />

        {/* Eyes according to mood */}
        {mood === "celebrate" || mood === "happy" ? (
          <>
            <path d="M 40 54 Q 48 46 54 54" stroke="var(--newt-brown)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 66 54 Q 72 46 80 54" stroke="var(--newt-brown)" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        ) : mood === "thinking" ? (
          <>
            <circle cx="46" cy="48" r="6" fill="var(--newt-brown)" className="mascot-eye" />
            <circle cx="72" cy="48" r="6" fill="var(--newt-brown)" className="mascot-eye" />
            <circle cx="48" cy="46" r="2" fill="#fff" />
            <circle cx="74" cy="46" r="2" fill="#fff" />
            {/* Raised eyebrow */}
            <path d="M 40 40 Q 47 36 54 41" stroke="var(--ink)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : mood === "not-yet" ? (
          <>
            <circle cx="46" cy="53" r="6" fill="var(--newt-brown)" />
            <circle cx="74" cy="53" r="6" fill="var(--newt-brown)" />
            <circle cx="45" cy="51" r="2" fill="#fff" />
            <circle cx="73" cy="51" r="2" fill="#fff" />
            {/* Encouraging eyebrow */}
            <path d="M 42 45 Q 48 48 54 46" stroke="var(--ink)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 66 46 Q 72 48 78 45" stroke="var(--ink)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="46" cy="52" r="6.5" fill="var(--newt-brown)" className="mascot-eye" />
            <circle cx="74" cy="52" r="6.5" fill="var(--newt-brown)" className="mascot-eye" />
            <circle cx="44.5" cy="50" r="2.2" fill="#fff" />
            <circle cx="72.5" cy="50" r="2.2" fill="#fff" />
          </>
        )}

        {/* Cheeks rosy spots */}
        <circle cx="34" cy="68" r="5" fill="var(--newt-spot)" opacity="0.3" />
        <circle cx="86" cy="68" r="5" fill="var(--newt-spot)" opacity="0.3" />

        {/* Mouth */}
        {mood === "talking" ? (
          <ellipse cx="60" cy="74" rx="7" ry="9" fill="var(--newt-brown)" className="talking-mouth" />
        ) : mood === "not-yet" ? (
          <path d="M 52 75 Q 60 71 68 75" stroke="var(--newt-brown)" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M 50 71 Q 60 81 70 71" stroke="var(--newt-brown)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        )}

        {/* Waving arm */}
        {mood === "wave" && (
          <path
            d="M 94 65 Q 112 50 106 35"
            stroke="var(--newt-clay)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="waving-arm"
          />
        )}
      </svg>
    </div>
  );
};
