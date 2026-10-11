import React, { useState } from "react";
import {
  useNewtAuth,
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "../../auth/ClerkAuthProvider";
import "./AuthControls.css";

export const AuthControls: React.FC = () => {
  const { isConfigured } = useNewtAuth();
  const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

  // If Clerk key is configured in .env.local
  if (isConfigured) {
    return (
      <div className="auth-controls-container">
        <SignedIn>
          <div className="auth-user-wrapper">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: 34,
                    height: 34,
                    border: "2px solid var(--ink)",
                  },
                },
              }}
            />
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button type="button" className="auth-signin-btn" title="Sign in to save your progress">
              <span>✨</span> Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    );
  }

  // Fallback when VITE_CLERK_PUBLISHABLE_KEY is not yet populated
  return (
    <div className="auth-controls-container">
      <button
        type="button"
        className="auth-guest-badge"
        onClick={() => setShowSetupModal(true)}
        title="Running in local guest mode. Click to see Clerk setup instructions."
      >
        <span>👤</span> Guest Mode
      </button>

      {showSetupModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSetupModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content newt-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 480,
              width: "90%",
              padding: "24px",
              backgroundColor: "var(--card)",
              borderRadius: "16px",
              border: "2px solid var(--ink)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ margin: "0 0 12px 0", fontFamily: "var(--font-family-display)" }}>
              🔐 Clerk Account Setup
            </h3>
            <p style={{ fontSize: "14px", lineHeight: "1.5", color: "var(--ink-muted)" }}>
              Progress is currently saved <strong>locally on your machine</strong>. To enable cloud user accounts with Clerk:
            </p>
            <ol style={{ fontSize: "13px", lineHeight: "1.6", paddingLeft: "20px", color: "var(--ink)" }}>
              <li>
                Create a free app at <strong>clerk.com</strong>.
              </li>
              <li>
                Copy your <strong>Publishable key</strong> (starts with <code>pk_test_</code>).
              </li>
              <li>
                Add it to your <code>.env.local</code> file:
                <pre
                  style={{
                    backgroundColor: "var(--paper)",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid var(--grid)",
                    marginTop: "6px",
                    overflowX: "auto",
                  }}
                >
                  VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
                </pre>
              </li>
            </ol>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowSetupModal(false)}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
