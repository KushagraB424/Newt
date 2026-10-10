import React from "react";
import { Mascot } from "../Mascot/Mascot";
import "./WelcomeCard.css";

export interface WelcomeCardProps {
  kidName?: string;
  callbackQuote?: string;
  activeTopic?: string;
  daysActiveThisWeek?: number;
  gradeLevel?: "explorer" | "middle";
  onKeepGoing?: () => void;
  onSomethingNew?: () => void;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({
  kidName = "Maya",
  callbackQuote = 'Last time you figured out why a negative slope goes down. You said it was "like walking downhill."',
  activeTopic = "Slope & Steepness",
  daysActiveThisWeek = 4,
  gradeLevel = "explorer",
  onKeepGoing,
  onSomethingNew,
}) => {
  const isMiddle = gradeLevel === "middle";

  return (
    <div className={`welcome-card newt-card ${isMiddle ? "middle-card" : "explorer-card"}`}>
      <div className="welcome-card-header">
        <div className="welcome-title-wrap">
          <div className="welcome-grade-badge-row">
            <span className={`grade-mode-tag ${isMiddle ? "middle-tag" : "explorer-tag"}`}>
              {isMiddle ? "Scholar Mode · Grades 6–8" : "Explorer Mode · Grades 4–5"}
            </span>
          </div>
          <h1 className="welcome-heading">Hi, {kidName}.</h1>
          <p className="welcome-callback">{callbackQuote}</p>
        </div>

        {/* Mascot: 72px full-size in Explorer; 28px face only in Middle School per spec */}
        {isMiddle ? (
          <div className="middle-mascot-pill" title="Newt">
            <Mascot mood="talking" size={28} faceOnly variant="clay" />
            <span className="middle-mascot-label">Newt</span>
          </div>
        ) : (
          <Mascot mood="happy" size={72} variant="clay" className="welcome-mascot" />
        )}
      </div>

      {/* Days this week tracker — counted, never guilted */}
      <div className="days-active-row">
        <div className="days-dots-strip" aria-label={`${daysActiveThisWeek} days active this week`}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`day-dot ${i < daysActiveThisWeek ? "completed" : "pending"}`}
            />
          ))}
        </div>
        <span className="days-label numeral-tabular">{daysActiveThisWeek} days this week</span>
      </div>

      {/* CTAs */}
      <div className="welcome-actions">
        <button
          type="button"
          className="btn btn-spark keep-going-btn"
          onClick={onKeepGoing}
        >
          Keep going with {activeTopic}
        </button>

        <button
          type="button"
          className="btn btn-outline something-new-btn"
          onClick={onSomethingNew}
        >
          Something new
        </button>
      </div>
    </div>
  );
};
