// Centralized API layer for SENTINEL web.
// Base URL is configurable via VITE_API_BASE_URL (see .env).

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"

export { BASE_URL }

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })

  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!response.ok) {
    const message =
      (data && data.detail) ||
      (typeof data === "string" && data) ||
      `Request failed (${response.status})`
    throw new Error(message)
  }

  return data
}

/* ---------------- AUTH ---------------- */

export function registerUser({ email, display_name, firebase_uid }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, display_name, firebase_uid }),
  })
}

export function loginUser(email) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

/* ---------------- EMERGENCY (user) ---------------- */

export function triggerEmergency({ user_email, latitude, longitude }) {
  return request("/emergency/trigger", {
    method: "POST",
    body: JSON.stringify({ user_email, latitude, longitude }),
  })
}

export function getEmergencyHistory(email) {
  return request(`/emergency/history/${encodeURIComponent(email)}`)
}

/* ---------------- CONTACTS ---------------- */

export function addContact({ user_email, contact_name, contact_phone }) {
  return request("/contacts/add", {
    method: "POST",
    body: JSON.stringify({ user_email, contact_name, contact_phone }),
  })
}

export function getContacts(email) {
  return request(`/contacts/${encodeURIComponent(email)}`)
}

/* ---------------- REPORTS ---------------- */

export function submitReport({
  user_email,
  report_type,
  severity,
  latitude,
  longitude,
  description,
}) {
  return request("/reports/submit", {
    method: "POST",
    body: JSON.stringify({
      user_email,
      report_type,
      severity,
      latitude,
      longitude,
      description,
    }),
  })
}

export function getReports() {
  return request("/reports/all")
}

/* ---------------- ADMIN DASHBOARD ---------------- */

export function fetchDashboardStats() {
  return request("/dashboard/stats")
}

export function fetchActiveEmergencies() {
  return request("/emergency/active")
}

export function fetchDashboardReports() {
  return request("/dashboard/reports")
}

export function fetchUsers() {
  return request("/dashboard/users")
}

export function fetchHotspots() {
  return request("/dashboard/hotspots")
}

export function fetchAnalytics() {
  return request("/dashboard/analytics")
}

export function resolveEmergency(id) {
  return request(`/dashboard/resolve/${id}`, { method: "POST" })
}
