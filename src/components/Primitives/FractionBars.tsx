import React, { useState } from "react";
import { Stage } from "../Stage/Stage";
import "./FractionBars.css";

export interface FractionBarsProps {
  onCheck?: (topShaded: number, bottomShaded: number, isCorrect: boolean) => void;
  onHint?: () => void;
}

export const FractionBars: React.FC<FractionBarsProps> = ({ onCheck, onHint }) => {
  const [topDenominator] = useState<number>(3);
  const [topShaded, setTopShaded] = useState<number>(1);

  const [bottomDenominator, setBottomDenominator] = useState<number>(4);
  const [bottomShaded, setBottomShaded] = useState<number>(1);

  const [status, setStatus] = useState<"idle" | "active" | "got-it" | "not-yet">("idle");

  const handleTopTap = (idx: number) => {
    setTopShaded(idx + 1 === topShaded ? idx : idx + 1);
    setStatus("active");
  };

  const handleBottomTap = (idx: number) => {
    setBottomShaded(idx + 1 === bottomShaded ? idx : idx + 1);
    setStatus("active");
  };

  const handleCutChange = (denom: number) => {
    setBottomDenominator(denom);
    if (bottomShaded > denom) setBottomShaded(denom);
    setStatus("active");
  };

  const handleCheck = () => {
    // Correct if 1 piece shaded on each bar
    const isCorrect = topShaded === 1 && bottomShaded === 1;
    const nextStatus = isCorrect ? "got-it" : "not-yet";
    setStatus(nextStatus);
    onCheck?.(topShaded, bottomShaded, isCorrect);
  };

  const topValue = topShaded / topDenominator;
  const bottomValue = bottomShaded / bottomDenominator;

  let comparisonText = "Tap one piece on each bar.";
  if (topShaded > 0 && bottomShaded > 0) {
    if (topValue > bottomValue) {
      comparisonText = `${topShaded}/${topDenominator} is bigger than ${bottomShaded}/${bottomDenominator}`;
    } else if (topValue < bottomValue) {
      comparisonText = `${bottomShaded}/${bottomDenominator} is bigger than ${topShaded}/${topDenominator}`;
    } else {
      comparisonText = `${topShaded}/${topDenominator} equals ${bottomShaded}/${bottomDenominator}`;
    }
  }

  return (
    <Stage
      title="Shade one piece of each bar"
      readout={comparisonText}
      onHintClick={onHint}
      actionLabel="Check pieces"
      onActionClick={handleCheck}
      status={status}
    >
      <div className="fraction-bars-stage">
        {/* Top Bar (Thirds) */}
        <div className="bar-row">
          <span className="fraction-label numeral-tabular">{topShaded}/{topDenominator}</span>
          <div className="fraction-bar-track">
            {Array.from({ length: topDenominator }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`fraction-segment ${i < topShaded ? "shaded" : ""}`}
                onClick={() => handleTopTap(i)}
                aria-label={`Piece ${i + 1} of ${topDenominator}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bar-row">
          <span className="fraction-label numeral-tabular">{bottomShaded}/{bottomDenominator}</span>
          <div className="fraction-bar-track">
            {Array.from({ length: bottomDenominator }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`fraction-segment ${i < bottomShaded ? "shaded" : ""}`}
                onClick={() => handleBottomTap(i)}
                aria-label={`Piece ${i + 1} of ${bottomDenominator}`}
              />
            ))}
          </div>
        </div>

        {/* Cut chips control */}
        <div className="fraction-cut-controls">
          <span className="cut-title">Cut the bottom bar into:</span>
          <div className="cut-chips">
            {[4, 5, 8].map((denom) => (
              <button
                key={denom}
                type="button"
                className={`cut-chip ${bottomDenominator === denom ? "active" : ""}`}
                onClick={() => handleCutChange(denom)}
              >
                {denom}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Stage>
  );
};
