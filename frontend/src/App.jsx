// frontend/src/App.jsx

import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import RequireAuth from "./components/RequireAuth";

import Overview from "./pages/Overview";
import Analyzer from "./pages/Analyzer";
import History from "./pages/History";
import Report from "./pages/Report";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  const token = localStorage.getItem("skillgap_token");

  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}
      <Route
        path="/login"
        element={
          token ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/signup"
        element={
          token ? <Navigate to="/" replace /> : <Signup />
        }
      />

      {/* ================= PROTECTED APP ROUTES ================= */}
      <Route
        path="/*"
        element={
          <RequireAuth>
            <div className="h-full flex">
              <Sidebar />

              <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/analyzer" element={<Analyzer />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/report/:id" element={<Report />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </main>
            </div>
          </RequireAuth>
        }
      />
    </Routes>
  );
}