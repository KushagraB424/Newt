import type { GradeLevel } from "../components/Header/Header";

export interface UserPreferences {
  darkMode: boolean;
  easyRead: boolean;
  reducedMotion: boolean;
  isMuted: boolean;
  mascotVariant: "clay" | "lilac";
}

export interface UserProgressData {
  userId: string;
  studentName: string;
  gradeLevel: GradeLevel;
  selectedWorlds: string[];
  completedTopics: string[];
  currentTopic: string;
  streakDays: number;
  lastActiveDate: string;
  preferences: UserPreferences;
}

const STORAGE_PREFIX = "newt_progress_user_";

export const DEFAULT_GUEST_PROGRESS: UserProgressData = {
  userId: "guest",
  studentName: "Maya",
  gradeLevel: "explorer",
  selectedWorlds: ["minecraft", "soccer"],
  completedTopics: ["linear-eq"],
  currentTopic: "systems",
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split("T")[0],
  preferences: {
    darkMode: false,
    easyRead: false,
    reducedMotion: false,
    isMuted: false,
    mascotVariant: "clay",
  },
};

/**
 * Get storage key scoped per Clerk userId (or "guest" if unauthenticated)
 */
export function getStorageKey(userId?: string | null): string {
  const safeId = userId && userId.trim() ? userId.trim() : "guest";
  return `${STORAGE_PREFIX}${safeId}`;
}

/**
 * Load progress scoped to the specific user.
 * If user has no previous progress, migrates guest progress or uses defaults.
 */
export function loadUserProgress(
  userId?: string | null,
  fallbackName?: string
): UserProgressData {
  const key = getStorageKey(userId);

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: UserProgressData = JSON.parse(raw);
      // Ensure all fields exist
      return {
        ...DEFAULT_GUEST_PROGRESS,
        ...parsed,
        userId: userId || "guest",
        studentName: parsed.studentName || fallbackName || DEFAULT_GUEST_PROGRESS.studentName,
        preferences: {
          ...DEFAULT_GUEST_PROGRESS.preferences,
          ...(parsed.preferences || {}),
        },
      };
    }

    // If new signed-in user, check if we can migrate progress from guest
    if (userId && userId !== "guest") {
      const guestRaw = localStorage.getItem(getStorageKey("guest"));
      if (guestRaw) {
        const guestParsed = JSON.parse(guestRaw);
        const migrated: UserProgressData = {
          ...DEFAULT_GUEST_PROGRESS,
          ...guestParsed,
          userId,
          studentName: fallbackName || guestParsed.studentName || "Explorer",
        };
        saveUserProgress(userId, migrated);
        return migrated;
      }
    }
  } catch (err) {
    console.warn("Failed to load user progress from localStorage:", err);
  }

  // Fallback defaults
  const initial: UserProgressData = {
    ...DEFAULT_GUEST_PROGRESS,
    userId: userId || "guest",
    studentName: fallbackName || DEFAULT_GUEST_PROGRESS.studentName,
  };
  saveUserProgress(userId, initial);
  return initial;
}

/**
 * Save progress updates for the active user
 */
export function saveUserProgress(
  userId: string | null | undefined,
  updates: Partial<UserProgressData>
): UserProgressData {
  const key = getStorageKey(userId);
  let current: UserProgressData;

  try {
    const raw = localStorage.getItem(key);
    current = raw ? JSON.parse(raw) : { ...DEFAULT_GUEST_PROGRESS, userId: userId || "guest" };
  } catch {
    current = { ...DEFAULT_GUEST_PROGRESS, userId: userId || "guest" };
  }

  const updated: UserProgressData = {
    ...current,
    ...updates,
    userId: userId || "guest",
    preferences: {
      ...current.preferences,
      ...(updates.preferences || {}),
    },
  };

  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to persist user progress to localStorage:", err);
  }

  return updated;
}
