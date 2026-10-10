import React from "react";
import "./FollowUps.css";

export interface TopicBranch {
  id: string;
  label: string;
  description?: string;
}

export interface FollowUpsProps {
  kidName?: string;
  nextTopicTitle?: string;
  nextTopicDesc?: string;
  branches?: TopicBranch[];
  onSelectBranch: (branchId: string) => void;
  onStartNextTopic: () => void;
  onWrapUpSession: () => void;
}

const DEFAULT_BRANCHES: TopicBranch[] = [
  { id: "systems", label: "Where two lines intersect (Systems of Equations)" },
  { id: "negative-slopes", label: "Tackle a steeper downhill slope" },
  { id: "real-world-rates", label: "Model real-world speed & phone rate plans" },
];

export const FollowUps: React.FC<FollowUpsProps> = ({
  kidName = "Maya",
  nextTopicTitle = "Systems of Equations",
  nextTopicDesc,
  branches = DEFAULT_BRANCHES,
  onSelectBranch,
  onStartNextTopic,
  onWrapUpSession,
}) => {
  return (
    <div className="follow-ups-container">
      <div className="follow-ups-header">
        <h3 className="follow-ups-title">Want to keep going, {kidName}?</h3>
        <p className="follow-ups-subtitle">
          Pick a branch that sounds fun, jump to the next step, or wrap up for today.
        </p>
      </div>

      {/* 2-3 Chip options (outline, radius-pill) — a fork, not a funnel */}
      <div className="follow-ups-chips-row">
        {branches.map((branch) => (
          <button
            key={branch.id}
            type="button"
            className="btn btn-outline follow-up-chip"
            onClick={() => onSelectBranch(branch.id)}
          >
            ↳ {branch.label}
          </button>
        ))}
      </div>

      {/* Featured card at bottom: "You're ready for: [next topic]" + spark button */}
      <div className="next-topic-featured-card newt-card">
        <div className="next-topic-info">
          <span className="next-topic-tag">Recommended Next</span>
          <h4 className="next-topic-title">You're ready for: {nextTopicTitle}</h4>
          <p className="next-topic-desc">
            {nextTopicDesc || "Combine two lines on the grid to find their exact meeting point (intersection)."}
          </p>
        </div>

        <div className="next-topic-actions">
          <button
            type="button"
            className="btn btn-spark start-next-btn"
            onClick={onStartNextTopic}
          >
            Start {nextTopicTitle.split(" ")[0]} →
          </button>

          <button
            type="button"
            className="btn btn-ghost wrap-up-btn"
            onClick={onWrapUpSession}
          >
            Wrap up today's session
          </button>
        </div>
      </div>
    </div>
  );
};
