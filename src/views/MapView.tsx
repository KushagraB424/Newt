import React, { useState } from "react";
import { KnowledgeMap } from "../components/Map/KnowledgeMap";
import type { MapNode } from "../components/Map/KnowledgeMap";
import "./MapView.css";

export interface MapViewProps {
  completedTopics?: string[];
  onStartTopic: (topicId: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({ completedTopics = [], onStartTopic }) => {
  const isLinearDone = completedTopics.includes("linear-eq") || completedTopics.includes("slope");

  const [selectedNode, setSelectedNode] = useState<MapNode | null>({
    id: isLinearDone ? "systems" : "linear-eq",
    label: isLinearDone ? "Systems of Equations" : "Linear Equations",
    status: "in-progress",
    x: 88,
    y: isLinearDone ? 70 : 30,
  });

  return (
    <div className="map-view-container">
      <div className="map-view-header">
        <div>
          <h1 className="map-view-title">My Knowledge Map</h1>
          <p className="map-view-subtitle">
            Every step connected by what you understand. No scores, no levels — only concepts you have built with Newt.
          </p>
        </div>
      </div>

      <KnowledgeMap
        selectedNodeId={selectedNode?.id}
        completedTopicIds={completedTopics}
        onSelectNode={(node) => setSelectedNode(node)}
      />

      {/* Selected Node Drawer */}
      {selectedNode && (
        <div className="selected-node-panel newt-card">
          <div className="node-panel-info">
            <div className="panel-badge-row">
              <span className={`panel-status-pill ${selectedNode.status}`}>
                {selectedNode.status === "mastered"
                  ? "Mastered"
                  : selectedNode.status === "in-progress"
                  ? "In progress"
                  : "Locked"}
              </span>
              {selectedNode.reviewDays && (
                <span className="panel-review-badge">
                  Next review in {selectedNode.reviewDays} days
                </span>
              )}
            </div>

            <h3 className="panel-node-title">{selectedNode.label}</h3>
            <p className="panel-node-desc">
              {selectedNode.id === "slope"
                ? "Understand why steepness is measured by comparing vertical change to horizontal change before introducing formulas."
                : selectedNode.id === "fractions"
                ? "Compare different slice sizes and observe how denominators shape the piece size."
                : "Explore how quantities change step-by-step with interactive visual models."}
            </p>
          </div>

          <div className="panel-node-actions">
            <button
              type="button"
              className="btn btn-spark"
              onClick={() => onStartTopic(selectedNode.id)}
              disabled={selectedNode.status === "locked"}
            >
              {selectedNode.status === "mastered"
                ? "Practice again"
                : selectedNode.status === "in-progress"
                ? "Jump into lesson"
                : "Locked topic"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
