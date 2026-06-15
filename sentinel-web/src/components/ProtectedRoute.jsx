import { Navigate } from "react-router-dom"
import { getUser } from "../lib/auth"

// Guards routes that require a logged-in user.
// requireAdmin=true additionally restricts to ADMIN role.
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const user = getUser()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/portal" replace />
  }

  return children
}
