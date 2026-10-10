import React from "react";
import "./Stage.css";

export interface StageProps {
  title: string;
  readout?: React.ReactNode;
  onHintClick?: () => void;
  actionLabel?: string;
  onActionClick?: () => void;
  status?: "idle" | "active" | "checking" | "got-it" | "not-yet" | "revealed";
  children: React.ReactNode;
  className?: string;
}

export const Stage: React.FC<StageProps> = ({
  title,
  readout,
  onHintClick,
  actionLabel = "Check",
  onActionClick,
  status = "idle",
  children,
  className = "",
}) => {
  return (
    <div className={`stage-container ${status} ${className}`}>
      {/* Title Strip: <=8 words in title type */}
      <div className="stage-title-strip">
        <h2 className="stage-title">{title}</h2>
      </div>

      {/* The Floor: Graph paper dots on card, outlined in ink */}
      <div className="stage-floor stage-content-area">
        {children}
      </div>

      {/* Live Readout directly under the drawing */}
      {readout && (
        <div className="stage-readout-strip">
          <div className="stage-readout numeral-tabular">{readout}</div>
        </div>
      )}

      {/* The Foot: Hint button on left, Spark action on right */}
      <footer className="stage-foot">
        {onHintClick ? (
          <button
            type="button"
            className="stage-hint-btn"
            onClick={onHintClick}
            aria-label="Show me a hint"
            title="Hint ladder"
          >
            <span className="hint-ring-icon">?</span>
            <span className="hint-label">Hint</span>
          </button>
        ) : <div />}

        {onActionClick && (
          <button
            type="button"
            className="btn btn-spark stage-action-btn"
            onClick={onActionClick}
          >
            {actionLabel}
          </button>
        )}
      </footer>
    </div>
  );
};
