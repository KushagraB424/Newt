import React, { useState, useEffect, useRef } from "react";
import "./Whiteboard.css";

export interface ScriptBeat {
  id: string;
  narration: string;
  action: "draw-triangle" | "write-rise" | "write-run" | "draw-slope-line";
  caption: string;
}

const LESSON_SCRIPT: ScriptBeat[] = [
  {
    id: "beat-1",
    narration: "Start at any point on the line. Take 1 step to the right.",
    action: "write-run",
    caption: "run = 1",
  },
  {
    id: "beat-2",
    narration: "Now count how many steps straight up to hit the line again: 2 steps up.",
    action: "write-rise",
    caption: "rise = 2",
  },
  {
    id: "beat-3",
    narration: "Connect them together: the rise over run triangle shows why slope is 2 over 1, or simply 2.",
    action: "draw-triangle",
    caption: "slope = rise / run = 2 / 1 = 2",
  },
  {
    id: "beat-4",
    narration: "And that works everywhere on this line: every step right costs you 2 up.",
    action: "draw-slope-line",
    caption: "Steepness is constant everywhere",
  },
];

export interface WhiteboardProps {
  onClose?: () => void;
  isMuted?: boolean;
}

export const Whiteboard: React.FC<WhiteboardProps> = ({ onClose, isMuted = false }) => {
  const [activeTab, setActiveTab] = useState<"board" | "steps" | "notes">("board");
  const [currentBeatIndex, setCurrentBeatIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const currentBeat = LESSON_SCRIPT[currentBeatIndex];

  // Play narration with Web Speech Synthesis if available and not muted
  useEffect(() => {
    if (!isPlaying) return;

    if (!isMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentBeat.narration);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      synthRef.current = utterance;

      utterance.onend = () => {
        // Automatically advance to next beat after a brief pause
        const timer = setTimeout(() => {
          if (currentBeatIndex < LESSON_SCRIPT.length - 1) {
            setCurrentBeatIndex((prev) => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, 1500);
        return () => clearTimeout(timer);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer when muted or speech synthesis not enabled
      const timer = setTimeout(() => {
        if (currentBeatIndex < LESSON_SCRIPT.length - 1) {
          setCurrentBeatIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentBeatIndex, isPlaying, isMuted, currentBeat.narration]);

  const handleReplay = () => {
    setCurrentBeatIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="whiteboard-container">
      {/* Tab Header: Graph/Sim/Video | Steps | Notes */}
      <div className="whiteboard-header">
        <div className="whiteboard-tabs">
          <button
            type="button"
            className={`wb-tab ${activeTab === "board" ? "active" : ""}`}
            onClick={() => setActiveTab("board")}
          >
            Live Board
          </button>
          <button
            type="button"
            className={`wb-tab ${activeTab === "steps" ? "active" : ""}`}
            onClick={() => setActiveTab("steps")}
          >
            Steps
          </button>
          <button
            type="button"
            className={`wb-tab ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            className="btn btn-ghost wb-close-btn"
            onClick={onClose}
            aria-label="Back to chat"
          >
            Back to chat ←
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "board" && (
        <div className="whiteboard-stage stage-floor">
          <svg viewBox="0 0 400 300" width="100%" height="280" className="whiteboard-svg">
            {/* Grid Lines */}
            {[50, 100, 150, 200, 250, 300, 350].map((x) => (
              <line key={`x-${x}`} x1={x} y1={20} x2={x} y2={280} stroke="var(--grid)" strokeWidth="1.5" />
            ))}
            {[50, 100, 150, 200, 250].map((y) => (
              <line key={`y-${y}`} x1={20} y1={y} x2={380} y2={y} stroke="var(--grid)" strokeWidth="1.5" />
            ))}

            {/* Axes */}
            <line x1={30} y1={250} x2={370} y2={250} stroke="var(--ink)" strokeWidth="2.5" />
            <line x1={80} y1={30} x2={80} y2={270} stroke="var(--ink)" strokeWidth="2.5" />

            {/* Rise-over-run triangle */}
            {currentBeatIndex >= 0 && (
              /* Run line: horizontal from (140, 200) to (200, 200) */
              <g className="drawn-element">
                <line x1={140} y1={200} x2={200} y2={200} stroke="var(--ink)" strokeWidth="3" strokeDasharray="4 2" />
                <text x={170} y={222} textAnchor="middle" fill="var(--ink)" style={{ font: "var(--type-label)" }}>
                  run = 1
                </text>
              </g>
            )}

            {currentBeatIndex >= 1 && (
              /* Rise line: vertical from (200, 200) to (200, 100) */
              <g className="drawn-element">
                <line x1={200} y1={200} x2={200} y2={100} stroke="var(--ink)" strokeWidth="3" strokeDasharray="4 2" />
                <text x={232} y={155} textAnchor="middle" fill="var(--ink)" style={{ font: "var(--type-label)" }}>
                  rise = 2
                </text>
              </g>
            )}

            {currentBeatIndex >= 2 && (
              /* Plotted slope line in sky blue */
              <g className="drawn-element">
                <line x1={110} y1={250} x2={230} y2={50} stroke="var(--sky)" strokeWidth="5" strokeLinecap="round" />
                <circle cx={140} cy={200} r="6" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
                <circle cx={200} cy={100} r="6" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
              </g>
            )}

            {/* Leading pen cursor */}
            <g
              transform={`translate(${
                currentBeatIndex === 0
                  ? "200, 200"
                  : currentBeatIndex === 1
                  ? "200, 100"
                  : "230, 50"
              })`}
              className="pen-lead-indicator"
            >
              <circle cx="0" cy="0" r="5" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
              <line x1="0" y1="0" x2="10" y2="-12" stroke="var(--ink)" strokeWidth="2" />
            </g>
          </svg>

          {/* Sync Narration Subtitle Strip */}
          <div className="whiteboard-narration-strip">
            <span className="narration-speaker">Newt:</span>
            <p className="narration-text">"{currentBeat.narration}"</p>
            <span className="beat-progress-badge numeral-tabular">
              Beat {currentBeatIndex + 1} of {LESSON_SCRIPT.length}
            </span>
          </div>
        </div>
      )}

      {activeTab === "steps" && (
        <div className="wb-tab-panel">
          <ol className="wb-steps-list">
            {LESSON_SCRIPT.map((beat, idx) => (
              <li key={beat.id} className={`wb-step-row ${idx <= currentBeatIndex ? "completed" : ""}`}>
                <span className="step-idx">{idx + 1}</span>
                <div className="step-detail">
                  <strong>{beat.caption}</strong>
                  <p>{beat.narration}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="wb-tab-panel">
          <div className="wb-notes-content">
            <h3>Big Idea: Slope is a Rate</h3>
            <p>Every time you step forward (run), you go up or down by the slope (rise).</p>
            <ul>
              <li><strong>Positive slope:</strong> uphill (climbs left to right)</li>
              <li><strong>Negative slope:</strong> downhill (drops left to right)</li>
              <li><strong>Zero slope:</strong> flat ground</li>
            </ul>
          </div>
        </div>
      )}

      {/* Footer controls */}
      <div className="whiteboard-foot">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleReplay}
        >
          ↻ Replay lesson
        </button>

        <button
          type="button"
          className="btn btn-spark"
          onClick={() => {
            if (currentBeatIndex < LESSON_SCRIPT.length - 1) {
              setCurrentBeatIndex((p) => p + 1);
            }
          }}
          disabled={currentBeatIndex >= LESSON_SCRIPT.length - 1}
        >
          Next beat →
        </button>
      </div>
    </div>
  );
};
