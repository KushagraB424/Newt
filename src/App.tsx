import { useState, useEffect } from "react";
import { Header } from "./components/Header/Header";
import type { GradeLevel, ActiveView } from "./components/Header/Header";
import { OnboardingModal } from "./components/Onboarding/OnboardingModal";
import { SessionEndModal } from "./components/SessionEnd/SessionEndModal";
import { HomeView } from "./views/HomeView";
import { LessonView } from "./views/LessonView";
import { ShelfView } from "./views/ShelfView";
import { MapView } from "./views/MapView";
import { CelebrationView } from "./views/CelebrationView";
import { getTopicInfo } from "./data/topics";
import "./App.css";

export function App() {
  const [studentName, setStudentName] = useState<string>("Maya");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("explorer");
  const [selectedWorlds, setSelectedWorlds] = useState<string[]>(["minecraft", "soccer"]);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isSessionEndOpen, setIsSessionEndOpen] = useState<boolean>(false);

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [easyRead, setEasyRead] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [mascotVariant, setMascotVariant] = useState<"clay" | "lilac">("clay");
  const [activeView, setActiveView] = useState<ActiveView>("home");

  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("newt_completed_topics");
      if (stored) return JSON.parse(stored);
    } catch {
      // safe fallback
    }
    // Default to linear-eq mastered as the user has just finished it
    return ["linear-eq"];
  });

  const [currentTopic, setCurrentTopic] = useState<string>(() => {
    const stored = localStorage.getItem("newt_current_topic");
    if (stored) return stored;
    return "systems";
  });

  const [justMasteredTopic, setJustMasteredTopic] = useState<string>("linear-eq");

  // Keep DOM root attributes in sync with state for CSS tokens
  useEffect(() => {
    document.documentElement.setAttribute("data-grade", gradeLevel);
    document.documentElement.setAttribute("data-dark", darkMode ? "true" : "false");

    const themeName =
      gradeLevel === "middle"
        ? darkMode
          ? "middle-dark"
          : "middle"
        : darkMode
        ? "explorer-dark"
        : "explorer";
    document.documentElement.setAttribute("data-theme", themeName);

    document.documentElement.setAttribute("data-easy-read", easyRead ? "true" : "false");
    document.documentElement.setAttribute("data-reduced-motion", reducedMotion ? "true" : "false");
  }, [gradeLevel, darkMode, easyRead, reducedMotion]);

  const handleStartLesson = (topicId: string) => {
    setCurrentTopic(topicId);
    try {
      localStorage.setItem("newt_current_topic", topicId);
    } catch {
      // safe fallback
    }
    setActiveView("lesson");
  };

  const handleMasteryReached = () => {
    setJustMasteredTopic(currentTopic);
    const updated = completedTopics.includes(currentTopic)
      ? completedTopics
      : [...completedTopics, currentTopic];
    setCompletedTopics(updated);
    try {
      localStorage.setItem("newt_completed_topics", JSON.stringify(updated));
    } catch {
      // safe fallback
    }

    const info = getTopicInfo(currentTopic);
    setCurrentTopic(info.nextTopicId);
    try {
      localStorage.setItem("newt_current_topic", info.nextTopicId);
    } catch {
      // safe fallback
    }

    setActiveView("celebration");
  };

  const handleSaveProfile = (profile: { name: string; grade: GradeLevel; worlds: string[] }) => {
    setStudentName(profile.name);
    setGradeLevel(profile.grade);
    setSelectedWorlds(profile.worlds);
  };

  return (
    <div className="app-container">
      {/* Header with decoupled Grade Selector, Dark Mode Checkbox, and Profile/Worlds Button */}
      <Header
        gradeLevel={gradeLevel}
        onGradeChange={(g) => setGradeLevel(g)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((p) => !p)}
        easyRead={easyRead}
        onToggleEasyRead={() => setEasyRead((p) => !p)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((p) => !p)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((p) => !p)}
        mascotVariant={mascotVariant}
        onToggleMascotVariant={() =>
          setMascotVariant((p) => (p === "clay" ? "lilac" : "clay"))
        }
        activeView={activeView}
        onViewChange={(v) => setActiveView(v)}
        studentName={studentName}
        selectedWorldsCount={selectedWorlds.length}
        onOpenProfile={() => setIsOnboardingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="app-main-content">
        {activeView === "home" && (
          <HomeView
            gradeLevel={gradeLevel}
            kidName={studentName}
            selectedWorlds={selectedWorlds}
            currentTopicId={currentTopic}
            completedTopics={completedTopics}
            onStartLesson={handleStartLesson}
            onOpenMap={() => setActiveView("map")}
          />
        )}

        {activeView === "lesson" && (
          <LessonView
            topicId={currentTopic}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((p) => !p)}
            theme={gradeLevel === "middle" ? (darkMode ? "middle-dark" : "middle") : "explorer"}
            kidName={studentName}
            selectedWorlds={selectedWorlds}
            onMasteryReached={handleMasteryReached}
          />
        )}

        {activeView === "shelf" && <ShelfView />}

        {activeView === "map" && (
          <MapView
            completedTopics={completedTopics}
            onStartTopic={handleStartLesson}
          />
        )}

        {activeView === "celebration" && (
          <CelebrationView
            kidName={studentName}
            topicId={justMasteredTopic}
            onContinue={(nextTopicId) => handleStartLesson(nextTopicId)}
            onSelectBranch={(branchId) => handleStartLesson(branchId)}
            onWrapUpSession={() => setIsSessionEndOpen(true)}
          />
        )}
      </main>

      {/* Profile & InterestPicker Modal */}
      <OnboardingModal
        initialName={studentName}
        initialGrade={gradeLevel}
        initialWorlds={selectedWorlds}
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      {/* Session End Modal */}
      <SessionEndModal
        kidName={studentName}
        summaryAccomplishment="You figured out how slope measures steepness by comparing vertical rise to horizontal run."
        nextUpPreview="Next time: we'll discover how the y-intercept shifts the line up and down the y-axis."
        daysActiveThisWeek={4}
        isOpen={isSessionEndOpen}
        onFinishSession={() => {
          setIsSessionEndOpen(false);
          setActiveView("home");
        }}
      />
    </div>
  );
}

export default App;
