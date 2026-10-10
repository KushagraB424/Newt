import React from "react";
import { Celebration } from "../components/Celebration/Celebration";
import { getTopicInfo } from "../data/topics";
import "./CelebrationView.css";

export interface CelebrationViewProps {
  kidName?: string;
  topicId?: string;
  onContinue: (nextTopicId: string) => void;
  onSelectBranch?: (branchId: string) => void;
  onWrapUpSession?: () => void;
}

export const CelebrationView: React.FC<CelebrationViewProps> = ({
  kidName = "Maya",
  topicId = "linear-eq",
  onContinue,
  onSelectBranch,
  onWrapUpSession,
}) => {
  const topicInfo = getTopicInfo(topicId);

  return (
    <div className="celebration-view-wrapper">
      <Celebration
        kidName={kidName}
        topicTitle={topicInfo.title}
        achievementText={topicInfo.achievementText}
        nextTopicTitle={topicInfo.nextTopicTitle}
        nextTopicDesc={topicInfo.nextTopicDesc}
        branches={topicInfo.branches}
        onContinue={() => onContinue(topicInfo.nextTopicId)}
        onSelectBranch={onSelectBranch}
        onWrapUpSession={onWrapUpSession}
      />
    </div>
  );
};
