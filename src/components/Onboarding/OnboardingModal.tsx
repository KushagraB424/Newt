import React, { useState } from "react";
import { InterestPicker } from "./InterestPicker";
import type { GradeLevel } from "../Header/Header";
import "./OnboardingModal.css";

export interface OnboardingModalProps {
  initialName?: string;
  initialGrade?: GradeLevel;
  initialWorlds?: string[];
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: { name: string; grade: GradeLevel; worlds: string[] }) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialName = "Maya",
  initialGrade = "explorer",
  initialWorlds = ["minecraft", "soccer"],
  isOpen,
  onClose,
  onSaveProfile,
}) => {
  const [name, setName] = useState<string>(initialName);
  const [grade, setGrade] = useState<GradeLevel>(initialGrade);

  if (!isOpen) return null;

  const handleSaveWorlds = (worlds: string[]) => {
    onSaveProfile({
      name: name.trim() || "Maya",
      grade,
      worlds,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="onboarding-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="onboarding-intro-strip">
          <div className="profile-input-row">
            <div className="name-input-group">
              <label htmlFor="student-name-input" className="field-label">Your Name:</label>
              <input
                id="student-name-input"
                type="text"
                className="name-text-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should Newt call you?"
              />
            </div>

            <div className="grade-selector-subgroup">
              <span className="field-label">Grade:</span>
              <div className="grade-pill-wrapper">
                <button
                  type="button"
                  className={`grade-select-btn ${grade === "explorer" ? "active" : ""}`}
                  onClick={() => setGrade("explorer")}
                >
                  Grades 4–5
                </button>
                <button
                  type="button"
                  className={`grade-select-btn ${grade === "middle" ? "active" : ""}`}
                  onClick={() => setGrade("middle")}
                >
                  Grades 6–8
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Interest Picker */}
        <InterestPicker
          initialWorlds={initialWorlds}
          onSave={handleSaveWorlds}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
