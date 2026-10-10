import React, { useState } from "react";
import { Mascot } from "../Mascot/Mascot";
import "./InterestPicker.css";

export interface WorldOption {
  id: string;
  label: string;
  icon: string;
  exampleQuote: string;
}

export const WORLD_OPTIONS: WorldOption[] = [
  {
    id: "minecraft",
    label: "Minecraft",
    icon: "⛏️",
    exampleQuote: "In Minecraft: slope is how many blocks high your mountain staircase climbs for every block forward.",
  },
  {
    id: "soccer",
    label: "Soccer",
    icon: "⚽",
    exampleQuote: "On the soccer field: slope is the steep trajectory of a lofted cross rising toward the net.",
  },
  {
    id: "baking",
    label: "Baking",
    icon: "🧁",
    exampleQuote: "In the kitchen: slope is the rising ratio of flour to milk as batter puffs up in the oven.",
  },
  {
    id: "space",
    label: "Space & Rockets",
    icon: "🚀",
    exampleQuote: "At mission control: slope is the ascent angle of a rocket gaining altitude as it reaches orbit.",
  },
  {
    id: "animals",
    label: "Animals & Wildlife",
    icon: "🐾",
    exampleQuote: "In nature: slope is the steepness of a mountain goat path climbing up a rocky ridge.",
  },
  {
    id: "music",
    label: "Music & Beats",
    icon: "🎵",
    exampleQuote: "In audio tracks: slope is how sharply a synthesizer pitch climbs across beats in a bar.",
  },
  {
    id: "skateboarding",
    label: "Skateboarding",
    icon: "🛹",
    exampleQuote: "At the skate park: slope is the steep incline of the halfpipe ramp before you drop in.",
  },
  {
    id: "robotics",
    label: "Robotics & Coding",
    icon: "🤖",
    exampleQuote: "In robotics: slope is the gear ratio between motor turns and robot distance traveled.",
  },
];

export interface InterestPickerProps {
  initialWorlds?: string[];
  onSave: (selectedIds: string[]) => void;
  onClose?: () => void;
}

export const InterestPicker: React.FC<InterestPickerProps> = ({
  initialWorlds = ["minecraft", "soccer"],
  onSave,
  onClose,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialWorlds);

  const toggleWorld = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  // The active preview quote based on the most recently selected world
  const latestSelectedWorld =
    selectedIds.length > 0
      ? WORLD_OPTIONS.find((w) => w.id === selectedIds[selectedIds.length - 1])
      : WORLD_OPTIONS[0];

  const handleSave = () => {
    onSave(selectedIds);
  };

  return (
    <div className="interest-picker-card newt-card">
      <div className="interest-picker-header">
        <div>
          <h2 className="interest-picker-title">Pick up to three worlds you like</h2>
          <p className="interest-picker-subtitle">
            Newt rewrites every example, problem, and picture inside the worlds you choose.
          </p>
        </div>
        <span className="selection-count-pill numeral-tabular">
          {selectedIds.length} of 3 chosen
        </span>
      </div>

      {/* World Chips */}
      <div className="worlds-chips-grid">
        {WORLD_OPTIONS.map((world) => {
          const isSelected = selectedIds.includes(world.id);
          const isDisabled = !isSelected && selectedIds.length >= 3;

          return (
            <button
              key={world.id}
              type="button"
              className={`world-chip ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
              onClick={() => toggleWorld(world.id)}
              disabled={isDisabled}
              aria-pressed={isSelected}
            >
              <span className="world-chip-icon">{world.icon}</span>
              <span className="world-chip-label">{world.label}</span>
              {isSelected && <span className="world-check">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Live Preview Panel — Spec: "Live preview shows tutor rewriting an example in the chosen world context" */}
      {latestSelectedWorld && (
        <div className="live-preview-box">
          <div className="preview-speaker-row">
            <Mascot mood="talking" size={32} faceOnly variant="clay" />
            <span className="preview-label">How Newt teaches slope in {latestSelectedWorld.label}:</span>
          </div>
          <div className="preview-bubble">
            <p className="preview-quote">"{latestSelectedWorld.exampleQuote}"</p>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="interest-picker-actions">
        {onClose && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          className="btn btn-spark save-worlds-btn"
          onClick={handleSave}
          disabled={selectedIds.length === 0}
        >
          Use these worlds in my lessons
        </button>
      </div>
    </div>
  );
};
