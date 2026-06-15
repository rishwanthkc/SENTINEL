// Lightweight auth/session helpers backed by localStorage.

const KEY = "user"

export function getUser() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem(KEY)
}

export function isAdmin() {
  const u = getUser()
  return u && u.role === "ADMIN"
}
