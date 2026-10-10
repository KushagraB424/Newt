import React from "react";
import { Mascot } from "../Mascot/Mascot";
import "./SessionEndModal.css";

export interface SessionEndModalProps {
  kidName?: string;
  summaryAccomplishment?: string;
  nextUpPreview?: string;
  daysActiveThisWeek?: number;
  isOpen: boolean;
  onFinishSession: () => void;
}

export const SessionEndModal: React.FC<SessionEndModalProps> = ({
  kidName = "Maya",
  summaryAccomplishment = "You figured out how slope measures steepness by comparing vertical rise to horizontal run.",
  nextUpPreview = "Next time: we'll discover what happens when you shift the line up and down the y-axis.",
  daysActiveThisWeek = 4,
  isOpen,
  onFinishSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="session-end-card newt-card">
        {/* Header with Mascot Waving */}
        <div className="session-end-mascot-row">
          <Mascot mood="wave" size={100} variant="clay" />
        </div>

        <div className="session-end-header">
          <h2 className="session-end-title">Great work today, {kidName}.</h2>
          <p className="session-end-summary">{summaryAccomplishment}</p>
        </div>

        {/* What's next on your map */}
        <div className="session-next-up-box">
          <span className="next-up-tag">What's Next</span>
          <p className="next-up-text">{nextUpPreview}</p>
        </div>

        {/* Guilt-free days active row — counted, never guilted */}
        <div className="session-end-days-row">
          <div className="days-dots-strip" aria-label={`${daysActiveThisWeek} days active this week`}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`day-dot ${i < daysActiveThisWeek ? "completed" : "pending"}`}
              />
            ))}
          </div>
          <span className="days-label numeral-tabular">{daysActiveThisWeek} days showing up this week</span>
        </div>

        {/* Footer Action */}
        <div className="session-end-actions">
          <button
            type="button"
            className="btn btn-spark finish-session-btn"
            onClick={onFinishSession}
          >
            See you next time →
          </button>
        </div>
      </div>
    </div>
  );
};
