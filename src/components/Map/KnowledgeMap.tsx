import React from "react";
import "./KnowledgeMap.css";

export interface MapNode {
  id: string;
  label: string;
  status: "mastered" | "in-progress" | "locked";
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  reviewDays?: number;
}

export interface MapEdge {
  from: string;
  to: string;
}

const DEFAULT_NODES: MapNode[] = [
  { id: "num-line", label: "Number Line", status: "mastered", x: 18, y: 70, reviewDays: 21 },
  { id: "fractions", label: "Fractions", status: "mastered", x: 18, y: 30, reviewDays: 14 },
  { id: "neg-num", label: "Negative Numbers", status: "mastered", x: 42, y: 70, reviewDays: 7 },
  { id: "slope", label: "Slope & Rise/Run", status: "in-progress", x: 42, y: 30 },
  { id: "coord", label: "Coordinate Plane", status: "in-progress", x: 68, y: 50 },
  { id: "linear-eq", label: "Linear Equations", status: "locked", x: 88, y: 30 },
  { id: "systems", label: "Systems of Equations", status: "locked", x: 88, y: 70 },
];

const DEFAULT_EDGES: MapEdge[] = [
  { from: "num-line", to: "neg-num" },
  { from: "fractions", to: "slope" },
  { from: "neg-num", to: "coord" },
  { from: "slope", to: "coord" },
  { from: "coord", to: "linear-eq" },
  { from: "coord", to: "systems" },
];

export interface KnowledgeMapProps {
  onSelectNode?: (node: MapNode) => void;
  selectedNodeId?: string;
  completedTopicIds?: string[];
}

export const KnowledgeMap: React.FC<KnowledgeMapProps> = ({
  onSelectNode,
  selectedNodeId = "linear-eq",
  completedTopicIds = [],
}) => {
  const isLinearDone = completedTopicIds.includes("linear-eq") || completedTopicIds.includes("slope");
  
  const nodes: MapNode[] = DEFAULT_NODES.map((node) => {
    if (node.id === "linear-eq") {
      return {
        ...node,
        status: isLinearDone ? "mastered" : "in-progress",
        reviewDays: isLinearDone ? 14 : undefined,
      };
    }
    if (node.id === "systems") {
      return {
        ...node,
        status: isLinearDone ? "in-progress" : "locked",
      };
    }
    if (node.id === "slope" || node.id === "coord") {
      return {
        ...node,
        status: "mastered",
        reviewDays: 7,
      };
    }
    return node;
  });
  return (
    <div className="knowledge-map-card newt-card">
      <div className="map-header">
        <h2 className="map-title">My Learning Map</h2>
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-dot mastered" />
            <span>Mastered</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot in-progress" />
            <span>In progress</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot locked" />
            <span>Locked</span>
          </div>
        </div>
      </div>

      <div className="map-stage stage-floor">
        {/* SVG connection lines */}
        <svg className="map-edges-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {DEFAULT_EDGES.map((edge, idx) => {
            const source = nodes.find((n) => n.id === edge.from);
            const target = nodes.find((n) => n.id === edge.to);
            if (!source || !target) return null;

            const isLockedEdge = target.status === "locked";
            return (
              <line
                key={idx}
                x1={`${source.x}%`}
                y1={`${source.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke={isLockedEdge ? "var(--ink-muted)" : "var(--ink)"}
                strokeWidth="2"
                strokeDasharray={isLockedEdge ? "3 3" : undefined}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          return (
            <button
              key={node.id}
              type="button"
              className={`map-node ${node.status} ${isSelected ? "selected" : ""}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => onSelectNode?.(node)}
              aria-label={`${node.label} (${node.status})`}
            >
              <div className="node-icon-circle">
                {node.status === "mastered" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : node.status === "in-progress" ? (
                  <span className="node-star">★</span>
                ) : (
                  <span className="node-lock">🔒</span>
                )}
              </div>
              <span className="node-label-pill">{node.label}</span>
              {node.reviewDays && (
                <span className="node-review-pill">Review in {node.reviewDays}d</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
