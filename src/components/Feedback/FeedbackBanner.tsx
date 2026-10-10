import React from "react";
import "./FeedbackBanner.css";

export interface FeedbackBannerProps {
  type: "got-it" | "not-yet";
  message: string;
  onDismiss?: () => void;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  type,
  message,
  onDismiss,
}) => {
  const isGotIt = type === "got-it";

  return (
    <div
      className={`feedback-banner ${type}`}
      role="alert"
      aria-live="polite"
    >
      <div className="feedback-mark-circle">
        {isGotIt ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span className="feedback-exclamation">!</span>
        )}
      </div>

      <div className="feedback-text-wrap">
        <span className="feedback-word">{isGotIt ? "Got it!" : "Not yet"}</span>
        <span className="feedback-message">{message}</span>
      </div>

      {onDismiss && (
        <button
          type="button"
          className="feedback-dismiss-btn"
          onClick={onDismiss}
          aria-label="Dismiss feedback"
        >
          ×
        </button>
      )}
    </div>
  );
};
