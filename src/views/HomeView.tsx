import React from "react";
import { WelcomeCard } from "../components/Home/WelcomeCard";
import "./HomeView.css";

export interface HomeViewProps {
  gradeLevel?: "explorer" | "middle";
  kidName?: string;
  selectedWorlds?: string[];
  currentTopicId?: string;
  completedTopics?: string[];
  onStartLesson: (topicId: string) => void;
  onOpenMap: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  gradeLevel = "explorer",
  kidName = "Maya",
  selectedWorlds = ["minecraft", "soccer"],
  currentTopicId = "linear-eq",
  completedTopics = [],
  onStartLesson,
  onOpenMap,
}) => {
  const isMiddle = gradeLevel === "middle";
  const primaryWorld = selectedWorlds[0] || "minecraft";
  const isLinearMastered = completedTopics.includes("linear-eq") || completedTopics.includes("slope");
  const nextTargetTopic = isLinearMastered ? "systems" : currentTopicId;

  let callbackQuote = 'Last time you figured out why a negative slope goes down. You said it was "like walking downhill."';
  if (isLinearMastered) {
    if (primaryWorld === "minecraft") {
      callbackQuote = 'Last time you mastered Linear Equations! You said slope m was like placing mountain steps and b was your starting block height.';
    } else if (primaryWorld === "soccer") {
      callbackQuote = 'Last time you mastered Linear Equations! You said slope m was the trajectory angle and b was where the kick started.';
    } else {
      callbackQuote = 'Last time you mastered Linear Equations! You said slope m sets the climb rate and b sets the starting line on the axis.';
    }
  } else if (primaryWorld === "minecraft") {
    callbackQuote = 'Last time you figured out why a negative slope goes down. You said it was "like mining downward staircase blocks into a cavern."';
  } else if (primaryWorld === "soccer") {
    callbackQuote = 'Last time you figured out why a negative slope goes down. You said it was "like the ball dipping after a high free kick."';
  } else if (primaryWorld === "space") {
    callbackQuote = 'Last time you figured out why a negative slope goes down. You said it was "like a shuttle descending on re-entry."';
  } else if (primaryWorld === "baking") {
    callbackQuote = 'Last time you figured out why a negative slope goes down. You said it was "like drizzling warm glaze down an angled cake."';
  }

  return (
    <div className={`home-view-container ${isMiddle ? "middle-mode" : "explorer-mode"}`}>
      {/* Welcome Card */}
      <WelcomeCard
        kidName={kidName}
        callbackQuote={callbackQuote}
        activeTopic={isLinearMastered ? "Systems of Equations" : "Linear Equations (y = mx + b)"}
        daysActiveThisWeek={4}
        gradeLevel={gradeLevel}
        onKeepGoing={() => onStartLesson(nextTargetTopic)}
        onSomethingNew={() => onStartLesson("balance")}
      />

      {/* Main Exploration Section */}
      <section className="home-explore-section">
        <h2 className="explore-question">
          {isMiddle ? "Choose your inquiry topic, Maya:" : "What do you want to learn, Maya?"}
        </h2>

        {/* Shortcut Chips */}
        {isMiddle ? (
          <div className="home-shortcut-chips">
            <button
              type="button"
              className="btn btn-outline shortcut-chip"
              onClick={() => onStartLesson("slope")}
            >
              Show me the math: Slope & Rates
            </button>
            <button
              type="button"
              className="btn btn-outline shortcut-chip"
              onClick={() => onStartLesson("balance")}
            >
              Equivalence: Balancing Systems
            </button>
            <button
              type="button"
              className="btn btn-outline shortcut-chip"
              onClick={() => onStartLesson("particles")}
            >
              Thermodynamic State Transitions
            </button>
            <button
              type="button"
              className="btn btn-outline shortcut-chip"
              onClick={() => onStartLesson("fractions")}
            >
              Fractional Ratios & Proportions
            </button>
          </div>
        ) : (
          <div className="home-shortcut-chips">
            <button
              type="button"
              className="btn btn-outline shortcut-chip"
              onClick={() => onStartLesson("slope")}
            >
              🏔️ Why slope goes down
            </button>
            <button
              type="button"
              className="btn btn-outline shortcut-chip"
              onClick={() => onStartLesson("balance")}
            >
              ⚖️ Balance an equation
            </button>
            <button
              type="button"
              className="btn btn-outline shortcut-chip"
              onClick={() => onStartLesson("particles")}
            >
              🧊 Particle states of matter
            </button>
            <button
              type="button"
              className="btn btn-outline shortcut-chip"
              onClick={() => onStartLesson("fractions")}
            >
              🍕 Comparing fractions
            </button>
          </div>
        )}
      </section>

      {/* Recents & Topic Mastery Shelf */}
      <section className="home-recents-section">
        <div className="recents-header">
          <h3 className="recents-title">
            {isMiddle ? "Concept Mastery & Review Schedule" : "Recent Topics & Mastery"}
          </h3>
          <button type="button" className="btn btn-ghost view-map-link" onClick={onOpenMap}>
            View full map →
          </button>
        </div>

        <div className="mastery-cards-grid">
          {/* Card 1 */}
          <div className="mastery-card newt-card">
            <div className="mastery-ring got-it">
              <span>✓</span>
            </div>
            <div className="mastery-info">
              <h4 className="mastery-topic-name">Number Line Jumps</h4>
              <span className="mastery-status-pill got-it">Mastered</span>
              <p className="mastery-review-text">Review in 21 days</p>
            </div>
            <button
              type="button"
              className="btn btn-outline card-play-btn"
              onClick={() => onStartLesson("numberline")}
            >
              Practice
            </button>
          </div>

          {/* Card 2 */}
          <div className="mastery-card newt-card">
            <div className="mastery-ring sky">
              <span>●</span>
            </div>
            <div className="mastery-info">
              <h4 className="mastery-topic-name">Negative Numbers</h4>
              <span className="mastery-status-pill solid">Solid</span>
              <p className="mastery-review-text">Review in 7 days</p>
            </div>
            <button
              type="button"
              className="btn btn-outline card-play-btn"
              onClick={() => onStartLesson("numberline")}
            >
              Practice
            </button>
          </div>

          {/* Card 3 */}
          <div className="mastery-card newt-card">
            <div className={`mastery-ring ${isLinearMastered ? "got-it" : "spark"}`}>
              <span>{isLinearMastered ? "✓" : "★"}</span>
            </div>
            <div className="mastery-info">
              <h4 className="mastery-topic-name">Linear Equations (y = mx + b)</h4>
              <span className={`mastery-status-pill ${isLinearMastered ? "got-it" : "getting-it"}`}>
                {isLinearMastered ? "Mastered" : "Getting it"}
              </span>
              <p className="mastery-review-text">
                {isLinearMastered ? "Review in 14 days" : "Review today"}
              </p>
            </div>
            <button
              type="button"
              className={`btn ${isLinearMastered ? "btn-outline" : "btn-spark"} card-play-btn`}
              onClick={() => onStartLesson("linear-eq")}
            >
              {isLinearMastered ? "Practice" : "Resume"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
