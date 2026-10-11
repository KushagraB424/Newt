import React, { createContext, useContext } from "react";
import {
  ClerkProvider,
  useUser,
  useAuth,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/react";

export interface AuthUserState {
  isConfigured: boolean;
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

const AuthContext = createContext<AuthUserState>({
  isConfigured: false,
  isLoaded: true,
  isSignedIn: false,
  userId: "guest",
  userName: "Maya",
});

export const useNewtAuth = () => useContext(AuthContext);

// Unified SignedIn / SignedOut helper components
export const SignedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn } = useNewtAuth();
  return isSignedIn ? <>{children}</> : null;
};

export const SignedOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn } = useNewtAuth();
  return !isSignedIn ? <>{children}</> : null;
};

// Re-export Clerk components
export { SignInButton, SignUpButton, UserButton };

const rawKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const CLERK_PUBLISHABLE_KEY = (() => {
  if (!rawKey || typeof rawKey !== "string") return "";
  const match = rawKey.match(/pk_(?:test|live)_[A-Za-z0-9_$-]+/);
  return match ? match[0] : (rawKey.trim().startsWith("pk_") ? rawKey.trim() : "");
})();

/**
 * Inner bridge component that pulls user state from Clerk's useUser/useAuth hooks
 */
const ClerkAuthBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId } = useAuth();

  const authState: AuthUserState = {
    isConfigured: true,
    isLoaded: Boolean(isLoaded),
    isSignedIn: Boolean(isSignedIn),
    userId: userId || "guest",
    userName: user?.firstName || user?.fullName || undefined,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    userAvatar: user?.imageUrl,
  };

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

/**
 * Global Auth Provider that wraps the application.
 * If CLERK_PUBLISHABLE_KEY is present, initializes live Clerk authentication.
 * If key is not yet set, gracefully provides a guest account state and configuration banner.
 */
export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (CLERK_PUBLISHABLE_KEY) {
    return (
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        afterSignOutUrl="/"
      >
        <ClerkAuthBridge>{children}</ClerkAuthBridge>
      </ClerkProvider>
    );
  }

  // Fallback guest provider when VITE_CLERK_PUBLISHABLE_KEY is not set yet
  const fallbackState: AuthUserState = {
    isConfigured: false,
    isLoaded: true,
    isSignedIn: false,
    userId: "guest",
    userName: "Maya",
  };

  return <AuthContext.Provider value={fallbackState}>{children}</AuthContext.Provider>;
};
