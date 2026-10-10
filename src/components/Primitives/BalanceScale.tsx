import React, { useState } from "react";
import { Stage } from "../Stage/Stage";
import "./BalanceScale.css";

export interface BalanceScaleProps {
  targetX?: number;
  initialX?: number;
  onCheck?: (xVal: number, isBalanced: boolean) => void;
  onHint?: () => void;
}

export const BalanceScale: React.FC<BalanceScaleProps> = ({
  targetX = 2,
  initialX = 1,
  onCheck,
  onHint,
}) => {
  const [xVal, setXVal] = useState<number>(initialX);
  const [status, setStatus] = useState<"idle" | "active" | "got-it" | "not-yet">("idle");

  // Equation: 2x + 3 = 7
  const leftWeight = 2 * xVal + 3;
  const rightWeight = 7;
  const diff = leftWeight - rightWeight;
  // Tilt angle capped between -15 and 15 degrees
  const tiltAngle = Math.max(-14, Math.min(14, diff * 3.5));

  const handleAdjust = (delta: number) => {
    const next = Math.max(0, Math.min(6, xVal + delta));
    setXVal(next);
    setStatus("active");
  };

  const handleCheck = () => {
    const isCorrect = xVal === targetX;
    const nextStatus = isCorrect ? "got-it" : "not-yet";
    setStatus(nextStatus);
    onCheck?.(xVal, isCorrect);
  };

  return (
    <Stage
      title="Find x: keep the scale level"
      readout={`2x + 3 = 7  (Current x = ${xVal})`}
      onHintClick={onHint}
      actionLabel="Check balance"
      onActionClick={handleCheck}
      status={status}
    >
      <div className="balance-scale-stage">
        {/* SVG Drawing of the beam, pans, and fulcrum */}
        <div className="scale-svg-container">
          <svg viewBox="0 0 400 220" width="100%" height="220" className="scale-svg">
            {/* Triangle Fulcrum */}
            <polygon points="200,165 175,205 225,205" fill="var(--card)" stroke="var(--ink)" strokeWidth="3" />
            <circle cx="200" cy="165" r="5" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2.5" />
            {/* Base platform */}
            <line x1="140" y1="205" x2="260" y2="205" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />

            {/* Tilting Beam & Pans group */}
            <g
              transform={`rotate(${tiltAngle}, 200, 165)`}
              className="beam-group"
              style={{ transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              {/* Main Beam */}
              <line x1="60" y1="165" x2="340" y2="165" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />

              {/* Left Pan Chains */}
              <line x1="75" y1="165" x2="55" y2="195" stroke="var(--ink)" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="75" y1="165" x2="95" y2="195" stroke="var(--ink)" strokeWidth="2" strokeDasharray="3 3" />
              {/* Left Pan */}
              <path d="M 45 195 Q 75 208 105 195" fill="none" stroke="var(--ink)" strokeWidth="3.5" />
              {/* Left Blocks */}
              <rect x="52" y="178" width="18" height="16" rx="4" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
              <text x="61" y="190" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--card)">
                x
              </text>
              <rect x="74" y="178" width="18" height="16" rx="4" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" />
              <text x="83" y="190" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--card)">
                x
              </text>
              <circle cx="98" cy="188" r="5" fill="var(--spark)" stroke="var(--ink)" strokeWidth="1.5" />

              {/* Right Pan Chains */}
              <line x1="325" y1="165" x2="305" y2="195" stroke="var(--ink)" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="325" y1="165" x2="345" y2="195" stroke="var(--ink)" strokeWidth="2" strokeDasharray="3 3" />
              {/* Right Pan */}
              <path d="M 295 195 Q 325 208 355 195" fill="none" stroke="var(--ink)" strokeWidth="3.5" />
              {/* Right Weights (7 units) */}
              <rect x="312" y="178" width="26" height="16" rx="4" fill="var(--spark)" stroke="var(--ink)" strokeWidth="2" />
              <text x="325" y="190" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--ink)">
                7
              </text>
            </g>
          </svg>
        </div>

        {/* Adjust controls: kid adjusts value of x */}
        <div className="balance-controls">
          <span className="balance-label">Test value for x:</span>
          <div className="stepper-group">
            <button
              type="button"
              className="btn btn-outline step-btn"
              onClick={() => handleAdjust(-1)}
              disabled={xVal <= 0}
              aria-label="Decrease x"
            >
              −
            </button>
            <span className="stepper-display numeral-tabular">{xVal}</span>
            <button
              type="button"
              className="btn btn-outline step-btn"
              onClick={() => handleAdjust(1)}
              disabled={xVal >= 6}
              aria-label="Increase x"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </Stage>
  );
};
