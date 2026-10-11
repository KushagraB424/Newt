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
import { ClerkAuthProvider, useNewtAuth } from "./auth/ClerkAuthProvider";
import { loadUserProgress, saveUserProgress, type UserProgressData } from "./utils/userProgress";
import "./App.css";

function NewtAppInner() {
  const { userId, userName } = useNewtAuth();

  const [progress, setProgress] = useState<UserProgressData>(() =>
    loadUserProgress(userId, userName)
  );

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isSessionEndOpen, setIsSessionEndOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [justMasteredTopic, setJustMasteredTopic] = useState<string>("linear-eq");

  // Keep progress in sync whenever Clerk user account switches (e.g. sign in or sign out)
  useEffect(() => {
    setProgress(loadUserProgress(userId, userName));
  }, [userId, userName]);

  const {
    studentName,
    gradeLevel,
    selectedWorlds,
    completedTopics,
    currentTopic,
    preferences,
  } = progress;
  const { darkMode, easyRead, reducedMotion, isMuted, mascotVariant } = preferences;

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
    const updated = saveUserProgress(userId, { currentTopic: topicId });
    setProgress(updated);
    setActiveView("lesson");
  };

  const handleMasteryReached = () => {
    setJustMasteredTopic(currentTopic);
    const updatedCompleted = completedTopics.includes(currentTopic)
      ? completedTopics
      : [...completedTopics, currentTopic];

    const info = getTopicInfo(currentTopic);
    const updated = saveUserProgress(userId, {
      completedTopics: updatedCompleted,
      currentTopic: info.nextTopicId,
    });
    setProgress(updated);
    setActiveView("celebration");
  };

  const handleSaveProfile = (profile: { name: string; grade: GradeLevel; worlds: string[] }) => {
    const updated = saveUserProgress(userId, {
      studentName: profile.name,
      gradeLevel: profile.grade,
      selectedWorlds: profile.worlds,
    });
    setProgress(updated);
  };

  const handleToggleDarkMode = () => {
    const updated = saveUserProgress(userId, {
      preferences: { ...preferences, darkMode: !darkMode },
    });
    setProgress(updated);
  };

  const handleToggleEasyRead = () => {
    const updated = saveUserProgress(userId, {
      preferences: { ...preferences, easyRead: !easyRead },
    });
    setProgress(updated);
  };

  const handleToggleReducedMotion = () => {
    const updated = saveUserProgress(userId, {
      preferences: { ...preferences, reducedMotion: !reducedMotion },
    });
    setProgress(updated);
  };

  const handleToggleMute = () => {
    const updated = saveUserProgress(userId, {
      preferences: { ...preferences, isMuted: !isMuted },
    });
    setProgress(updated);
  };

  const handleToggleMascotVariant = () => {
    const updated = saveUserProgress(userId, {
      preferences: {
        ...preferences,
        mascotVariant: mascotVariant === "clay" ? "lilac" : "clay",
      },
    });
    setProgress(updated);
  };

  return (
    <div className="app-container">
      {/* Header with Clerk User Controls, Grade Selector, Dark Mode, Profile/Worlds */}
      <Header
        gradeLevel={gradeLevel}
        onGradeChange={(g) => {
          const updated = saveUserProgress(userId, { gradeLevel: g });
          setProgress(updated);
        }}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        easyRead={easyRead}
        onToggleEasyRead={handleToggleEasyRead}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        mascotVariant={mascotVariant}
        onToggleMascotVariant={handleToggleMascotVariant}
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
            onToggleMute={handleToggleMute}
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
        daysActiveThisWeek={progress.streakDays || 4}
        isOpen={isSessionEndOpen}
        onFinishSession={() => {
          setIsSessionEndOpen(false);
          setActiveView("home");
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <ClerkAuthProvider>
      <NewtAppInner />
    </ClerkAuthProvider>
  );
}

export default App;
