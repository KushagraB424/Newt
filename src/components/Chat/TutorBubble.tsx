import React from "react";
import { Mascot } from "../Mascot/Mascot";
import "./TutorBubble.css";

export interface Message {
  id: string;
  sender: "tutor" | "kid";
  text: string;
  timestamp?: string;
}

export interface TutorBubbleProps {
  message?: Message;
  isLoading?: boolean;
  theme?: "explorer" | "middle" | "middle-dark";
}

export const TutorBubble: React.FC<TutorBubbleProps> = ({
  message,
  isLoading = false,
  theme = "explorer",
}) => {
  if (isLoading) {
    return (
      <div className={`tutor-bubble-row tutor-side ${theme}`}>
        <Mascot mood="thinking" size={32} faceOnly variant="clay" className="bubble-mascot" />
        <div className="bubble-content bubble-loading" aria-label="Newt is thinking">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    );
  }

  if (!message) return null;

  const isTutor = message.sender === "tutor";

  if (theme === "middle" || theme === "middle-dark") {
    // Middle school: Message rows with a name, tutor lines in a tutor-soft card
    return (
      <div className={`middle-message-row ${isTutor ? "tutor" : "kid"}`}>
        <div className="middle-message-header">
          {isTutor && (
            <Mascot mood="talking" size={24} faceOnly variant="clay" className="middle-mascot-face" />
          )}
          <span className="middle-sender-name">{isTutor ? "Newt" : "You"}</span>
        </div>
        <div className={`middle-message-body ${isTutor ? "tutor-card" : "kid-card"}`}>
          <p className="message-text">{message.text}</p>
        </div>
      </div>
    );
  }

  // Explorer (Grades 4-5): Speech bubbles with 3px outline / radius-lg
  return (
    <div className={`tutor-bubble-row ${isTutor ? "tutor-side" : "kid-side"}`}>
      {isTutor && (
        <Mascot mood="talking" size={40} faceOnly variant="clay" className="bubble-mascot" />
      )}
      <div className={`bubble-content ${isTutor ? "tutor-bubble" : "kid-bubble"}`}>
        <p className="message-text">{message.text}</p>
      </div>
    </div>
  );
};
