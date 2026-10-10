import React, { useState } from "react";
import { Stage } from "../Stage/Stage";
import "./CoordinatePlane.css";

export interface CoordinatePlaneProps {
  title?: string;
  targetM?: number;
  targetB?: number;
  initialM?: number;
  initialB?: number;
  secondaryLine?: { m: number; b: number; label?: string };
  onCheck?: (m: number, b: number, isCorrect: boolean) => void;
  onHint?: () => void;
}

export const CoordinatePlane: React.FC<CoordinatePlaneProps> = ({
  title = "Slide m to change steepness",
  targetM = 2,
  targetB = 1,
  initialM = 1,
  initialB = 0,
  secondaryLine,
  onCheck,
  onHint,
}) => {
  const [m, setM] = useState<number>(initialM);
  const [b, setB] = useState<number>(initialB);
  const [status, setStatus] = useState<"idle" | "active" | "got-it" | "not-yet">("idle");

  // Grid coordinate system: x from -5 to 5, y from -5 to 5.
  // Center is (150, 150) in 300x300 viewport.
  // 30px per unit.
  const toSvgX = (x: number) => 150 + x * 26;
  const toSvgY = (y: number) => 150 - y * 26;

  // Calculate endpoints of line y = mx + b for x in [-5, 5]
  const x1 = -5;
  const y1 = m * x1 + b;
  const x2 = 5;
  const y2 = m * x2 + b;

  const handleMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setM(Number(e.target.value));
    setStatus("active");
  };

  const handleBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setB(Number(e.target.value));
    setStatus("active");
  };

  const handleCheck = () => {
    const isCorrect = m === targetM && b === targetB;
    const nextStatus = isCorrect ? "got-it" : "not-yet";
    setStatus(nextStatus);
    onCheck?.(m, b, isCorrect);
  };

  // Format equation nicely
  const mStr = m === 1 ? "" : m === -1 ? "-" : `${m}`;
  const bStr = b > 0 ? ` + ${b}` : b < 0 ? ` - ${Math.abs(b)}` : "";
  const equation = `y = ${mStr}x${bStr}`;

  return (
    <Stage
      title={title}
      readout={equation}
      onHintClick={onHint}
      actionLabel="Check line"
      onActionClick={handleCheck}
      status={status}
    >
      <div className="coord-plane-stage">
        {/* SVG Grid */}
        <div className="coord-svg-wrap">
          <svg viewBox="0 0 300 300" width="300" height="300" className="coord-svg">
            {/* Grid lines */}
            {[-4, -3, -2, -1, 1, 2, 3, 4].map((n) => (
              <React.Fragment key={n}>
                <line
                  x1={toSvgX(n)}
                  y1={10}
                  x2={toSvgX(n)}
                  y2={290}
                  stroke="var(--grid)"
                  strokeWidth="1.5"
                />
                <line
                  x1={10}
                  y1={toSvgY(n)}
                  x2={290}
                  y2={toSvgY(n)}
                  stroke="var(--grid)"
                  strokeWidth="1.5"
                />
              </React.Fragment>
            ))}

            {/* X and Y axes */}
            <line x1={10} y1={150} x2={290} y2={150} stroke="var(--ink)" strokeWidth="3" />
            <line x1={150} y1={10} x2={150} y2={290} stroke="var(--ink)" strokeWidth="3" />

            {/* Secondary line (for Systems of Equations) */}
            {secondaryLine && (
              <g>
                <line
                  x1={toSvgX(x1)}
                  y1={toSvgY(secondaryLine.m * x1 + secondaryLine.b)}
                  x2={toSvgX(x2)}
                  y2={toSvgY(secondaryLine.m * x2 + secondaryLine.b)}
                  stroke="var(--ink-muted)"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                />
                <text
                  x={toSvgX(0.5)}
                  y={toSvgY(secondaryLine.m * 0.5 + secondaryLine.b) - 8}
                  fill="var(--ink)"
                  style={{ fontSize: 11, fontWeight: 700 }}
                >
                  {secondaryLine.label || "Target"}
                </text>
              </g>
            )}

            {/* Plotted Line in sky blue */}
            <line
              x1={toSvgX(x1)}
              y1={toSvgY(y1)}
              x2={toSvgX(x2)}
              y2={toSvgY(y2)}
              stroke={status === "got-it" ? "var(--got-it)" : status === "not-yet" ? "var(--not-yet)" : "var(--sky)"}
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Intercept point (0, b) */}
            <circle
              cx={toSvgX(0)}
              cy={toSvgY(b)}
              r="6"
              fill="var(--spark)"
              stroke="var(--ink)"
              strokeWidth="2.5"
            />

            {/* Intersection Highlight if matching in Systems mode */}
            {secondaryLine && status === "got-it" && (
              <g>
                <circle
                  cx={toSvgX(1)}
                  cy={toSvgY(3)}
                  r="7"
                  fill="var(--spark)"
                  stroke="var(--got-it)"
                  strokeWidth="3"
                />
                <text
                  x={toSvgX(1) + 10}
                  y={toSvgY(3) - 6}
                  fill="var(--got-it)"
                  style={{ fontSize: 12, fontWeight: 800 }}
                >
                  (1, 3) Meeting Point!
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Sliders */}
        <div className="coord-sliders">
          <div className="coord-slider-row">
            <label htmlFor="m-slider" className="slider-label">
              <span className="slider-name">m (slope)</span>
              <span className="slider-val numeral-tabular">{m}</span>
            </label>
            <input
              id="m-slider"
              type="range"
              min="-3"
              max="3"
              step="1"
              value={m}
              onChange={handleMChange}
              className="coord-range"
            />
          </div>

          <div className="coord-slider-row">
            <label htmlFor="b-slider" className="slider-label">
              <span className="slider-name">b (start)</span>
              <span className="slider-val numeral-tabular">{b}</span>
            </label>
            <input
              id="b-slider"
              type="range"
              min="-3"
              max="3"
              step="1"
              value={b}
              onChange={handleBChange}
              className="coord-range"
            />
          </div>
        </div>
      </div>
    </Stage>
  );
};
