import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Mascot } from "../Mascot/Mascot";
import { FollowUps } from "../FollowUps/FollowUps";
import type { TopicBranch } from "../FollowUps/FollowUps";
import "./Celebration.css";

export interface CelebrationProps {
  kidName?: string;
  topicTitle?: string;
  achievementText?: string;
  nextTopicTitle?: string;
  nextTopicDesc?: string;
  branches?: TopicBranch[];
  onContinue?: () => void;
  onSelectBranch?: (branchId: string) => void;
  onWrapUpSession?: () => void;
}

export const Celebration: React.FC<CelebrationProps> = ({
  kidName = "Maya",
  topicTitle = "Linear Equations (y = mx + b)",
  achievementText = "You figured out how slope and the y-intercept work together to position any line on the grid.",
  nextTopicTitle = "Systems of Equations",
  nextTopicDesc,
  branches,
  onContinue,
  onSelectBranch,
  onWrapUpSession,
}) => {
  useEffect(() => {
    // Confetti only on topic mastery once!
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#3fb86e", "#ffc531", "#3b82f6", "#6b4de0"],
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div className="celebration-container newt-card">
      <div className="celebration-body">
        <Mascot mood="celebrate" size={100} variant="clay" className="celebration-mascot" />
        
        <h1 className="celebration-heading">You got it, {kidName}!</h1>
        
        <p className="celebration-topic-badge">{topicTitle}</p>
        
        <p className="celebration-subtext">{achievementText}</p>

        {/* Embedded FollowUps Component per spec */}
        <FollowUps
          kidName={kidName}
          nextTopicTitle={nextTopicTitle}
          nextTopicDesc={nextTopicDesc}
          branches={branches}
          onSelectBranch={(branchId) => onSelectBranch?.(branchId)}
          onStartNextTopic={() => onContinue?.()}
          onWrapUpSession={() => onWrapUpSession?.()}
        />
      </div>

      {/* Decorative spark bar at bottom — spec: the only decorative spark fill */}
      <div className="celebration-spark-bar" />
    </div>
  );
};
