// frontend/src/lib/api.js
// Full corrected API client for SkillGap AI
// - Uses VITE_API_BASE (defaults to http://127.0.0.1:8000)
// - Adds Authorization: Bearer <token> automatically
// - Supports JSON + multipart (resume upload)
// - Auto-redirects to /login if token invalid
// - Exposes: signup, login, fetchMe, logout, fetchRoles, analyzeJob, listHistory, getHistoryItem

const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

const TOKEN_KEY = "skillgap_token";

/* ===========================
   TOKEN HELPERS
=========================== */

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

/* ===========================
   ERROR PARSER
=========================== */

async function parseError(res) {
  const text = await res.text();
  if (!text) return `Request failed: ${res.status}`;

  try {
    const j = JSON.parse(text);
    return j.detail || j.message || text;
  } catch {
    return text;
  }
}

/* ===========================
   CORE REQUEST FUNCTION
=========================== */

async function request(path, { method = "GET", headers = {}, body } = {}) {
  const token = getToken();

  const finalHeaders = {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: finalHeaders,
    body
  });

  // ✅ Auto-handle expired/invalid token
  if (res.status === 401 || res.status === 403) {
    logout();
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}

/* ===========================
   JSON REQUEST WRAPPER
=========================== */

function jsonRequest(path, payload, method = "POST") {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

/* ===========================
   AUTH
=========================== */

export function signup({ full_name = "", email, password }) {
  return jsonRequest("/auth/signup", { full_name, email, password }, "POST");
}

export async function login({ email, password }) {
  const res = await jsonRequest("/auth/login", { email, password }, "POST");

  // ✅ Store token automatically after login
  if (res?.access_token) {
    setToken(res.access_token);
  }

  return res;
}

export function fetchMe() {
  return request("/auth/me", { method: "GET" });
}

/* ===========================
   ROLES
=========================== */

export function fetchRoles() {
  return request("/roles", { method: "GET" });
}

/* ===========================
   ANALYZE
=========================== */

export async function analyzeJob({
  jobRole,
  manualSkills = [],
  resumeText = "",
  resumeFile = null
}) {
  const fd = new FormData();

  fd.append("job_role", jobRole || "");
  fd.append("manual_skills_json", JSON.stringify(manualSkills || []));
  fd.append("resume_text", resumeText || "");

  if (resumeFile) {
    fd.append("resume_file", resumeFile);
  }

  return request("/analyze", {
    method: "POST",
    body: fd
    // DO NOT set Content-Type manually for multipart
  });
}

/* ===========================
   HISTORY
=========================== */

export function listHistory() {
  return request("/history", { method: "GET" });
}

export function getHistoryItem(id) {
  return request(`/history/${id}`, { method: "GET" });
}