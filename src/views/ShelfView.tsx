import React, { useState } from "react";
import { NumberLine } from "../components/Primitives/NumberLine";
import { BalanceScale } from "../components/Primitives/BalanceScale";
import { FractionBars } from "../components/Primitives/FractionBars";
import { CoordinatePlane } from "../components/Primitives/CoordinatePlane";
import { ParticleBox } from "../components/Primitives/ParticleBox";
import { HintLadder } from "../components/Hint/HintLadder";
import { FeedbackBanner } from "../components/Feedback/FeedbackBanner";
import "./ShelfView.css";

type PrimitiveKey = "numberline" | "balance" | "fractions" | "coord" | "particles";

export const ShelfView: React.FC = () => {
  const [selectedPrimitive, setSelectedPrimitive] = useState<PrimitiveKey>("numberline");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "got-it" | "not-yet"; message: string } | null>(null);

  const handlePrimitiveCheck = (_val: unknown, isCorrect: boolean) => {
    if (isCorrect) {
      setFeedback({
        type: "got-it",
        message: "You settled the exact correct target state.",
      });
    } else {
      setFeedback({
        type: "not-yet",
        message: "Check the position and direction. Try another step.",
      });
    }
  };

  return (
    <div className="shelf-view-container">
      <div className="shelf-header">
        <div>
          <h1 className="shelf-title">Interactive Primitives Shelf</h1>
          <p className="shelf-subtitle">
            The tutor never writes interface code — it picks a primitive, fills in settings, and reads back what the kid did.
          </p>
        </div>

        {/* Primitive Switcher Chips */}
        <div className="shelf-chips">
          <button
            type="button"
            className={`shelf-chip ${selectedPrimitive === "numberline" ? "active" : ""}`}
            onClick={() => { setSelectedPrimitive("numberline"); setFeedback(null); setShowHint(false); }}
          >
            Number Line
          </button>
          <button
            type="button"
            className={`shelf-chip ${selectedPrimitive === "balance" ? "active" : ""}`}
            onClick={() => { setSelectedPrimitive("balance"); setFeedback(null); setShowHint(false); }}
          >
            Balance Scale
          </button>
          <button
            type="button"
            className={`shelf-chip ${selectedPrimitive === "fractions" ? "active" : ""}`}
            onClick={() => { setSelectedPrimitive("fractions"); setFeedback(null); setShowHint(false); }}
          >
            Fraction Bars
          </button>
          <button
            type="button"
            className={`shelf-chip ${selectedPrimitive === "coord" ? "active" : ""}`}
            onClick={() => { setSelectedPrimitive("coord"); setFeedback(null); setShowHint(false); }}
          >
            Coordinate Plane
          </button>
          <button
            type="button"
            className={`shelf-chip ${selectedPrimitive === "particles" ? "active" : ""}`}
            onClick={() => { setSelectedPrimitive("particles"); setFeedback(null); setShowHint(false); }}
          >
            Particle Box
          </button>
        </div>
      </div>

      {feedback && (
        <div className="shelf-feedback-wrap">
          <FeedbackBanner
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        </div>
      )}

      {/* Primitive Display */}
      <div className="shelf-active-primitive">
        {selectedPrimitive === "numberline" && (
          <NumberLine
            min={-5}
            max={5}
            step={1}
            target={3}
            title="Slide the dot to 3"
            onCheck={(_val, correct) => handlePrimitiveCheck(_val, correct)}
            onHint={() => setShowHint(true)}
          />
        )}

        {selectedPrimitive === "balance" && (
          <BalanceScale
            targetX={2}
            initialX={1}
            onCheck={(_val, correct) => handlePrimitiveCheck(_val, correct)}
            onHint={() => setShowHint(true)}
          />
        )}

        {selectedPrimitive === "fractions" && (
          <FractionBars
            onCheck={(_top, _bot, correct) => handlePrimitiveCheck(null, correct)}
            onHint={() => setShowHint(true)}
          />
        )}

        {selectedPrimitive === "coord" && (
          <CoordinatePlane
            targetM={2}
            targetB={1}
            onCheck={(_m, _b, correct) => handlePrimitiveCheck(null, correct)}
            onHint={() => setShowHint(true)}
          />
        )}

        {selectedPrimitive === "particles" && <ParticleBox />}
      </div>

      {/* Hint Ladder drawer */}
      {showHint && (
        <div className="shelf-hint-wrap">
          <HintLadder onClose={() => setShowHint(false)} />
        </div>
      )}
    </div>
  );
};
