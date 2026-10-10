export interface TopicBranch {
  id: string;
  label: string;
}

export interface TopicInfo {
  id: string;
  title: string;
  shortTitle: string;
  achievementText: string;
  nextTopicId: string;
  nextTopicTitle: string;
  nextTopicDesc: string;
  branches: TopicBranch[];
}

export const TOPICS: Record<string, TopicInfo> = {
  "linear-eq": {
    id: "linear-eq",
    title: "Linear Equations (y = mx + b)",
    shortTitle: "Linear Equations",
    achievementText:
      "You mastered plotting lines using slope (m) and the y-intercept (b). You can explain why m changes steepness and b sets the starting height on the y-axis.",
    nextTopicId: "systems",
    nextTopicTitle: "Systems of Equations",
    nextTopicDesc:
      "Combine two lines on the grid to find their exact meeting point (intersection).",
    branches: [
      { id: "systems", label: "Where two lines intersect (Systems of Equations)" },
      { id: "negative-slopes", label: "Tackle lines with negative slopes and downhill paths" },
      { id: "real-world-rates", label: "Model real-world speed, distance, and plans" },
    ],
  },
  systems: {
    id: "systems",
    title: "Systems of Equations",
    shortTitle: "Systems of Equations",
    achievementText:
      "You found the exact coordinate point where two different linear equations intersect and share a single common solution.",
    nextTopicId: "balance",
    nextTopicTitle: "Balancing Equations",
    nextTopicDesc:
      "Discover how equations stay balanced on a fulcrum scale by doing the same thing to both sides.",
    branches: [
      { id: "parallel-lines", label: "What happens when lines never cross (Parallel lines)" },
      { id: "balance", label: "Balance algebraic equations on a scale" },
      { id: "quadratics", label: "Non-linear curves & parabolas" },
    ],
  },
  slope: {
    id: "slope",
    title: "Slope & Rise/Run",
    shortTitle: "Slope & Steepness",
    achievementText:
      "You figured out why a line climbs or falls before writing any formulas. You explained rise over run in your own words.",
    nextTopicId: "linear-eq",
    nextTopicTitle: "Linear Equations (y = mx + b)",
    nextTopicDesc:
      "Combine what you know about slope with where the line crosses the y-axis.",
    branches: [
      { id: "steepness-speed", label: "Connect slope to speed & distance" },
      { id: "negative-slopes", label: "Tackle a steeper downhill slope" },
      { id: "parallel-lines", label: "Why parallel lines have matching slopes" },
    ],
  },
  balance: {
    id: "balance",
    title: "Balancing Equations",
    shortTitle: "Balance",
    achievementText:
      "You discovered how equations stay balanced by performing equal operations on both pans of the scale.",
    nextTopicId: "fractions",
    nextTopicTitle: "Comparing Fractions",
    nextTopicDesc:
      "Slice and shade fraction bars to discover how denominators shape piece sizes.",
    branches: [
      { id: "two-step", label: "Two-step algebraic balance" },
      { id: "fractions", label: "Slice and compare fraction bars" },
      { id: "linear-eq", label: "Connect balance to linear lines" },
    ],
  },
  fractions: {
    id: "fractions",
    title: "Comparing Fractions",
    shortTitle: "Fractions",
    achievementText:
      "You visualized how denominators divide the whole and compared unit fraction pieces on interactive bars.",
    nextTopicId: "numberline",
    nextTopicTitle: "Number Line Jumps",
    nextTopicDesc:
      "Hop forward and backward to see positive and negative numbers on a number line.",
    branches: [
      { id: "numberline", label: "Hop with fractions on a number line" },
      { id: "common-denom", label: "Finding common denominators" },
      { id: "linear-eq", label: "Turn fraction slopes into grid lines" },
    ],
  },
  numberline: {
    id: "numberline",
    title: "Number Line Jumps",
    shortTitle: "Number Line",
    achievementText:
      "You mastered directional jumps and positive/negative values on the number line.",
    nextTopicId: "linear-eq",
    nextTopicTitle: "Linear Equations (y = mx + b)",
    nextTopicDesc:
      "Cross two number lines into an x and y grid to plot dynamic linear slopes.",
    branches: [
      { id: "linear-eq", label: "Turn x and y number lines into a coordinate grid" },
      { id: "fractions", label: "Hop with fractions on the number line" },
      { id: "balance", label: "Balance positive and negative weights" },
    ],
  },
  particles: {
    id: "particles",
    title: "States of Matter",
    shortTitle: "Particles",
    achievementText:
      "You explored how thermal energy changes particle motion across Solid, Liquid, and Gas states.",
    nextTopicId: "balance",
    nextTopicTitle: "Conservation of Mass",
    nextTopicDesc:
      "See how matter and mass stay balanced even when physical states change.",
    branches: [
      { id: "phase-change", label: "Melting and boiling transitions" },
      { id: "gas-pressure", label: "Particle speed and collision pressure" },
      { id: "balance", label: "Conservation of mass on a balance scale" },
    ],
  },
};

export function getTopicInfo(topicId?: string): TopicInfo {
  if (!topicId) return TOPICS["linear-eq"];
  // Handle aliases
  if (topicId === "linear" || topicId === "linear-equations" || topicId === "coord") {
    return TOPICS["linear-eq"];
  }
  return TOPICS[topicId] || TOPICS["linear-eq"];
}
