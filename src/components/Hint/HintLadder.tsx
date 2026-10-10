import React, { useState } from "react";
import "./HintLadder.css";

export interface HintRung {
  level: number;
  label: string;
  content: string;
}

export interface HintLadderProps {
  rungs?: HintRung[];
  onClose?: () => void;
}

const DEFAULT_RUNGS: HintRung[] = [
  {
    level: 1,
    label: "Nudge",
    content: "Look at where the line is when x = 0, then when x = 1. What changed?",
  },
  {
    level: 2,
    label: "Hint",
    content: "Slope is how much y climbs every time x steps right by 1.",
  },
  {
    level: 3,
    label: "Show me a similar one",
    content: "If a line starts at 0 and goes up 3 when x goes up 1, its slope m = 3.",
  },
  {
    level: 4,
    label: "Show the answer with why",
    content: "m = 2 because moving right 1 step lifts the line by 2 units. b = 1 because the line crosses the y-axis at (0, 1).",
  },
];

export const HintLadder: React.FC<HintLadderProps> = ({
  rungs = DEFAULT_RUNGS,
  onClose,
}) => {
  // Revealed level: starts at 1
  const [revealedLevel, setRevealedLevel] = useState<number>(1);

  const handleNextRung = () => {
    if (revealedLevel < rungs.length) {
      setRevealedLevel((prev) => prev + 1);
    }
  };

  return (
    <div className="hint-ladder-container">
      <div className="hint-ladder-header">
        <h3 className="hint-ladder-title">Hint Ladder</h3>
        {onClose && (
          <button
            type="button"
            className="hint-close-btn"
            onClick={onClose}
            aria-label="Close hints"
          >
            Done
          </button>
        )}
      </div>

      <div className="rungs-list">
        {rungs.map((rung) => {
          const isRevealed = rung.level <= revealedLevel;
          const isCurrent = rung.level === revealedLevel;

          return (
            <div
              key={rung.level}
              className={`rung-card ${isRevealed ? "revealed" : "locked"} ${isCurrent ? "current" : ""}`}
            >
              <div className="rung-step-badge">
                <span className="rung-number numeral-tabular">{rung.level}</span>
                <span className="rung-label">{rung.label}</span>
              </div>

              {isRevealed ? (
                <div className="rung-content">
                  <p className="rung-text">{rung.content}</p>
                </div>
              ) : (
                <div className="rung-locked-hint">
                  <span>Locked until earlier rungs are read</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {revealedLevel < rungs.length && (
        <div className="hint-ladder-actions">
          <button
            type="button"
            className="btn btn-outline next-rung-btn"
            onClick={handleNextRung}
          >
            Still stuck? Reveal next step ({revealedLevel + 1} of {rungs.length})
          </button>
        </div>
      )}
    </div>
  );
};
