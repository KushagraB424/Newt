import React from "react";
import "./LessonPath.css";

export interface LessonStep {
  id: string;
  name: string;
}

export const DEFAULT_LESSON_STEPS: LessonStep[] = [
  { id: "idea", name: "Big idea" },
  { id: "why", name: "Why" },
  { id: "picture", name: "Picture" },
  { id: "video", name: "Video" },
  { id: "check", name: "Check" },
  { id: "practice", name: "Practice" },
];

export interface LessonPathProps {
  steps?: LessonStep[];
  currentStepIndex: number;
  onSelectStep?: (index: number) => void;
  onNextStep?: () => void;
}

export const LessonPath: React.FC<LessonPathProps> = ({
  steps = DEFAULT_LESSON_STEPS,
  currentStepIndex,
  onSelectStep,
  onNextStep,
}) => {
  return (
    <nav className="lesson-path-nav" aria-label="Lesson progress">
      <div className="steps-horizontal-bar">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          const stepClass = isCompleted
            ? "completed"
            : isCurrent
            ? "current"
            : "upcoming";

          return (
            <button
              key={step.id}
              type="button"
              className={`path-step-item ${stepClass}`}
              onClick={() => onSelectStep?.(idx)}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="step-indicator-mark">
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="step-number numeral-tabular">{idx + 1}</span>
                )}
              </div>
              <span className="step-name-text">{step.name}</span>
            </button>
          );
        })}
      </div>

      {onNextStep && currentStepIndex < steps.length - 1 && (
        <button
          type="button"
          className="btn btn-outline next-step-btn"
          onClick={onNextStep}
        >
          Next step →
        </button>
      )}
    </nav>
  );
};
