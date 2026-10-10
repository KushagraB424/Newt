import React, { useState } from "react";
import "./TalkButton.css";

export interface TalkButtonProps {
  onTranscript?: (text: string) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const TalkButton: React.FC<TalkButtonProps> = ({
  onTranscript,
  isMuted = false,
  onToggleMute,
}) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (isMuted) return;
    setIsListening(true);

    const win = window as unknown as Record<string, any>;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.onresult = (e: any) => {
          const text = e.results[0][0].transcript;
          onTranscript?.(text);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        return;
      } catch {
        // Fallback below
      }
    }

    // Interactive fallback for simulation
    setTimeout(() => {
      onTranscript?.("I think the line goes up because the slope is positive!");
      setIsListening(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  return (
    <div className="talk-button-fixed-container">
      <div className="talk-button-inner">
        {onToggleMute && (
          <button
            type="button"
            className={`talk-mute-toggle ${isMuted ? "muted" : ""}`}
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute tutor voice and sounds" : "Mute tutor voice and sounds"}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </button>
        )}

        <button
          type="button"
          className={`talk-main-btn ${isListening ? "listening" : ""} ${isMuted ? "muted" : ""}`}
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          aria-label={isListening ? "Listening to your voice" : "Hold to talk"}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span className="talk-btn-caption">
            {isMuted ? "Muted" : isListening ? "Listening..." : "Hold to talk"}
          </span>
        </button>
      </div>
    </div>
  );
};
