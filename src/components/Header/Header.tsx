import React from "react";
import { Mascot } from "../Mascot/Mascot";
import { AuthControls } from "../Auth/AuthControls";
import "./Header.css";

export type GradeLevel = "explorer" | "middle";
export type ActiveView = "home" | "lesson" | "shelf" | "map" | "celebration";

export interface HeaderProps {
  gradeLevel: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  easyRead: boolean;
  onToggleEasyRead: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  mascotVariant: "clay" | "lilac";
  onToggleMascotVariant: () => void;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  studentName?: string;
  selectedWorldsCount?: number;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gradeLevel,
  onGradeChange,
  darkMode,
  onToggleDarkMode,
  easyRead,
  onToggleEasyRead,
  reducedMotion,
  onToggleReducedMotion,
  isMuted,
  onToggleMute,
  mascotVariant,
  onToggleMascotVariant,
  activeView,
  onViewChange,
  studentName = "Maya",
  selectedWorldsCount = 2,
  onOpenProfile,
}) => {
  return (
    <header className="newt-header">
      <div className="header-left">
        <button
          type="button"
          className="brand-logo-btn"
          onClick={() => onViewChange("home")}
          aria-label="Newt home"
        >
          <Mascot mood="idle" size={40} faceOnly variant={mascotVariant} />
          <span className="brand-wordmark">newt</span>
        </button>

        {/* View Navigation Tabs */}
        <nav className="header-nav" aria-label="Main navigation">
          <button
            type="button"
            className={`nav-tab-btn ${activeView === "home" ? "active" : ""}`}
            onClick={() => onViewChange("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeView === "lesson" ? "active" : ""}`}
            onClick={() => onViewChange("lesson")}
          >
            Lesson
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeView === "shelf" ? "active" : ""}`}
            onClick={() => onViewChange("shelf")}
          >
            Primitives Shelf
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeView === "map" ? "active" : ""}`}
            onClick={() => onViewChange("map")}
          >
            My Map
          </button>
        </nav>
      </div>

      {/* Controls & Accessibility */}
      <div className="header-right">
        {/* Clerk User / Auth Controls */}
        <AuthControls />

        {/* Student Profile & Worlds Chip */}
        {onOpenProfile && (
          <button
            type="button"
            className="student-profile-btn"
            onClick={onOpenProfile}
            title="Edit student name, grade, and chosen worlds"
          >
            <span className="profile-avatar-emoji">👤</span>
            <span className="profile-name-text">{studentName}</span>
            <span className="profile-worlds-badge numeral-tabular">{selectedWorldsCount} worlds</span>
          </button>
        )}

        {/* Grade Selector (Explorer vs Middle School) */}
        <div className="grade-selector-group" role="radiogroup" aria-label="Select Grade Level">
          <button
            type="button"
            className={`grade-pill ${gradeLevel === "explorer" ? "active" : ""}`}
            onClick={() => onGradeChange("explorer")}
            role="radio"
            aria-checked={gradeLevel === "explorer"}
          >
            Grades 4–5
          </button>
          <button
            type="button"
            className={`grade-pill ${gradeLevel === "middle" ? "active" : ""}`}
            onClick={() => onGradeChange("middle")}
            role="radio"
            aria-checked={gradeLevel === "middle"}
          >
            Grades 6–8
          </button>
        </div>

        {/* Independent Dark Mode Checkbox / Switch */}
        <label className={`dark-mode-toggle-label ${darkMode ? "is-dark" : ""}`} title="Toggle Dark Mode">
          <input
            type="checkbox"
            className="dark-mode-checkbox"
            checked={darkMode}
            onChange={onToggleDarkMode}
            aria-label="Toggle dark mode"
          />
          <span className="dark-mode-indicator">
            <span className="dark-mode-icon">{darkMode ? "🌙" : "☀️"}</span>
            <span className="dark-mode-text">Dark</span>
          </span>
        </label>

        {/* Accessibility Tools */}
        <div className="header-accessibility-tools">
          <button
            type="button"
            className={`tool-icon-btn ${easyRead ? "active" : ""}`}
            onClick={onToggleEasyRead}
            title={easyRead ? "Easy-read font active (Lexend)" : "Toggle Easy-read font (Lexend)"}
            aria-label="Toggle Easy-read font"
          >
            Aa
          </button>

          <button
            type="button"
            className={`tool-icon-btn ${reducedMotion ? "active" : ""}`}
            onClick={onToggleReducedMotion}
            title={reducedMotion ? "Reduced motion active" : "Toggle reduced motion"}
            aria-label="Toggle reduced motion"
          >
            ⚡
          </button>

          <button
            type="button"
            className={`tool-icon-btn ${isMuted ? "active" : ""}`}
            onClick={onToggleMute}
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
            aria-label="Toggle mute"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          <button
            type="button"
            className="tool-icon-btn mascot-toggle-pill"
            onClick={onToggleMascotVariant}
            title={`Current mascot: ${mascotVariant === "clay" ? "Terracotta Clay" : "Lilac SVG"}. Tap to switch.`}
          >
            <span className="mascot-tag">{mascotVariant === "clay" ? "Clay" : "Lilac"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
