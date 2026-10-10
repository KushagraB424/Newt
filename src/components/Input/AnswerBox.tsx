import React, { useState } from "react";
import "./AnswerBox.css";

export interface AnswerBoxProps {
  placeholder?: string;
  onCheck: (answer: string) => void;
  disabled?: boolean;
}

export const AnswerBox: React.FC<AnswerBoxProps> = ({
  placeholder = "Type your answer...",
  onCheck,
  disabled = false,
}) => {
  const [answer, setAnswer] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!answer.trim() || disabled) return;
    onCheck(answer.trim());
    setAnswer("");
  };

  const toggleVoiceMode = () => {
    setIsVoiceActive((prev) => !prev);
  };

  const handleVoiceListen = () => {
    // If Web Speech Recognition API is supported:
    const win = window as unknown as Record<string, any>;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        setIsListening(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setAnswer(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    }

    // Fallback simulation for browsers without microphone permissions
    setIsListening(true);
    setTimeout(() => {
      setAnswer("The slope is 2 because it rises 2 for every 1 step right.");
      setIsListening(false);
    }, 1800);
  };

  return (
    <div className="answer-box-container">
      <form onSubmit={handleSubmit} className="answer-box-form">
        {/* Main Input */}
        <div className="answer-input-wrapper">
          <input
            type="text"
            className="answer-input"
            placeholder={placeholder}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={disabled}
            aria-label="Your answer"
          />
        </div>

        {/* Voice preview row if expanded */}
        {isVoiceActive && (
          <div className="voice-active-panel">
            <button
              type="button"
              className={`btn btn-outline voice-listen-btn ${isListening ? "listening" : ""}`}
              onClick={handleVoiceListen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              <span>{isListening ? "Listening to your voice..." : "Tap to speak your answer"}</span>
            </button>
          </div>
        )}

        {/* Bottom action row: Link on left, Spark button on right */}
        <div className="answer-foot-row">
          <button
            type="button"
            className="say-instead-link"
            onClick={toggleVoiceMode}
          >
            {isVoiceActive ? "Type it instead" : "Say it instead"}
          </button>

          <button
            type="submit"
            className="btn btn-spark check-answer-btn"
            disabled={!answer.trim() || disabled}
          >
            Check my answer
          </button>
        </div>
      </form>
    </div>
  );
};
