import React, { useState, useRef, useCallback } from "react";
import { Stage } from "../Stage/Stage";
import "./NumberLine.css";

export interface NumberLineProps {
  min?: number;
  max?: number;
  step?: number;
  target?: number;
  title?: string;
  onCheck?: (val: number, isCorrect: boolean) => void;
  onHint?: () => void;
  mode?: "explorer" | "scholar";
}

export const NumberLine: React.FC<NumberLineProps> = ({
  min = -5,
  max = 5,
  step = 1,
  target = 3,
  title = "Slide the dot to 3",
  onCheck,
  onHint,
}) => {
  const [value, setValue] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "active" | "got-it" | "not-yet">("idle");
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const totalSteps = Math.round((max - min) / step);

  const calculateValueFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const relativeX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = relativeX / rect.width;
      const rawVal = min + percentage * (max - min);
      const steppedVal = Math.round(rawVal / step) * step;
      return Math.max(min, Math.min(max, Number(steppedVal.toFixed(2))));
    },
    [min, max, step, value]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setStatus("active");
    const newVal = calculateValueFromPointer(e.clientX);
    setValue(newVal);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const newVal = calculateValueFromPointer(e.clientX);
    setValue(newVal);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(min, Number((value - step).toFixed(2)));
      setValue(next);
      setStatus("active");
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(max, Number((value + step).toFixed(2)));
      setValue(next);
      setStatus("active");
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleCheck();
    }
  };

  const handleCheck = () => {
    const isCorrect = Math.abs(value - target) < 0.001;
    const nextStatus = isCorrect ? "got-it" : "not-yet";
    setStatus(nextStatus);
    onCheck?.(value, isCorrect);
  };

  // Compute position percentage
  const percentage = ((value - min) / (max - min)) * 100;

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i <= totalSteps; i++) {
    const tickVal = Number((min + i * step).toFixed(2));
    const tickPos = (i / totalSteps) * 100;
    ticks.push({ value: tickVal, pos: tickPos });
  }

  return (
    <Stage
      title={title}
      readout={`You're at ${value}`}
      onHintClick={onHint}
      actionLabel="Check"
      onActionClick={handleCheck}
      status={status}
    >
      <div className="numberline-wrapper" onKeyDown={handleKeyDown} tabIndex={0}>
        <div
          className="numberline-track"
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Main baseline line in ink */}
          <div className="numberline-line" />

          {/* Tick marks */}
          {ticks.map((tick) => (
            <div
              key={tick.value}
              className={`numberline-tick ${tick.value === 0 ? "zero-tick" : ""}`}
              style={{ left: `${tick.pos}%` }}
            >
              <div className="tick-mark" />
              <span className="tick-label numeral-tabular">{tick.value}</span>
            </div>
          ))}

          {/* Draggable Handle */}
          <div
            className={`numberline-handle ${status}`}
            style={{ left: `${percentage}%` }}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-label="Number line handle"
            tabIndex={0}
          >
            <div className="handle-dot" />
          </div>
        </div>
      </div>
    </Stage>
  );
};
