import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import "./index.css"
import "leaflet/dist/leaflet.css"

import App from "./App"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import PortalLayout from "./components/PortalLayout"

import Home from "./pages/portal/Home"
import Contacts from "./pages/portal/Contacts"
import ReportIncident from "./pages/portal/ReportIncident"
import SafeRoute from "./pages/portal/SafeRoute"
import History from "./pages/portal/History"
import Profile from "./pages/portal/Profile"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <App />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <PortalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="report" element={<ReportIncident />} />
          <Route path="route" element={<SafeRoute />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
