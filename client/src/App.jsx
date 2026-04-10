import { useEffect, useState, useCallback } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getMeRequest } from "./utils/api";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MentorPage from "./pages/MentorPage";
import CareerAnalysisPage from "./pages/CareerAnalysisPage";
import ProfilePage from "./pages/ProfilePage";

// ── Storage helpers ───────────────────────────────────────────────────────────
const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const getStoredAuth = () => {
  try {
    const token =
      localStorage.getItem("ah_token") || sessionStorage.getItem("ah_token");
    const user =
      localStorage.getItem("ah_user")
        ? JSON.parse(localStorage.getItem("ah_user"))
        : sessionStorage.getItem("ah_user")
        ? JSON.parse(sessionStorage.getItem("ah_user"))
        : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export default function App() {
  const stored = getStoredAuth();
  const [authToken, setAuthToken] = useState(stored.token);
  const [authUser, setAuthUser] = useState(stored.user);
  const [authReady, setAuthReady] = useState(false);

  // Saved careers persisted in localStorage
  const [savedCareers, setSavedCareers] = useState(() =>
    readStorage("ah_saved", [])
  );

  const isAuthenticated = Boolean(authToken && authUser);

  // ── Persist saved careers ─────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("ah_saved", JSON.stringify(savedCareers));
  }, [savedCareers]);

  // ── Session validation ────────────────────────────────────────────────────
  useEffect(() => {
    const validate = async () => {
      if (!authToken) {
        setAuthReady(true);
        return;
      }
      // Small delay so server has time to be ready
      await new Promise((r) => setTimeout(r, 500));
      try {
        const { data } = await getMeRequest();
        setAuthUser(data.user);
      } catch (err) {
        // Only clear auth if it's actually an auth error (401)
        // ECONNREFUSED = server not ready yet, keep the token
        if (err?.response?.status === 401) {
          setAuthToken(null);
          setAuthUser(null);
          localStorage.removeItem("ah_token");
          localStorage.removeItem("ah_user");
          sessionStorage.removeItem("ah_token");
          sessionStorage.removeItem("ah_user");
        }
      } finally {
        setAuthReady(true);
      }
    };
    validate();
  }, [authToken]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const handleLoginSuccess = useCallback(({ token, user }, remember = true) => {
    setAuthToken(token);
    setAuthUser(user);
    const store = remember ? localStorage : sessionStorage;
    store.setItem("ah_token", token);
    store.setItem("ah_user", JSON.stringify(user));
  }, []);

  const handleLogout = useCallback(() => {
    setAuthToken(null);
    setAuthUser(null);
    localStorage.removeItem("ah_token");
    localStorage.removeItem("ah_user");
    sessionStorage.removeItem("ah_token");
    sessionStorage.removeItem("ah_user");
  }, []);

  // ── Career save/unsave ────────────────────────────────────────────────────
  const toggleSaveCareer = useCallback((career) => {
    setSavedCareers((prev) => {
      const exists = prev.find((c) => c.title === career.title);
      return exists ? prev.filter((c) => c.title !== career.title) : [...prev, career];
    });
  }, []);

  // Prevent flash before auth is validated
  if (!authReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex gap-2">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/app/dashboard" replace />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/app/dashboard" replace />
          ) : (
            <RegisterPage onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      {/* Protected */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route
          path="/app"
          element={
            <AppLayout authUser={authUser} onLogout={handleLogout} />
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <DashboardPage
                authUser={authUser}
                savedCareers={savedCareers}
                onToggleSave={toggleSaveCareer}
              />
            }
          />
          <Route path="mentor" element={<MentorPage authUser={authUser} />} />
          <Route
            path="career"
            element={
              <CareerAnalysisPage
                savedCareers={savedCareers}
                onToggleSave={toggleSaveCareer}
              />
            }
          />
          <Route
            path="profile"
            element={
              <ProfilePage
                authUser={authUser}
                savedCareers={savedCareers}
                onToggleSave={toggleSaveCareer}
              />
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
