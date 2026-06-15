import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { getUser, logout } from "../lib/auth"
import {
  Shield,
  Siren,
  Users,
  Flag,
  Route,
  Clock,
  User,
  Logout,
  Grid,
  Menu,
} from "./Icons"

const NAV = [
  { to: "/portal", label: "Home", icon: Siren, end: true },
  { to: "/portal/contacts", label: "Contacts", icon: Users },
  { to: "/portal/report", label: "Report", icon: Flag },
  { to: "/portal/route", label: "Safe Route", icon: Route },
  { to: "/portal/history", label: "History", icon: Clock },
  { to: "/portal/profile", label: "Profile", icon: User },
]

export default function PortalLayout() {
  const user = getUser()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate("/")
  }

  const initials = (user?.display_name || user?.email || "U")
    .slice(0, 1)
    .toUpperCase()

  const SidebarInner = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="text-cyan-300">
          <Shield width={28} height={28} />
        </span>
        <span className="brand-mark text-2xl">SENTINEL</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors",
                isActive
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent",
              ].join(" ")
            }
          >
            <Icon width={20} height={20} />
            {label}
          </NavLink>
        ))}

        {user?.role === "ADMIN" && (
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-amber-300/80 hover:text-amber-200 hover:bg-amber-400/10 border border-transparent transition-colors"
          >
            <Grid width={20} height={20} />
            Command Center
          </NavLink>
        )}
      </nav>

      <div className="p-3">
        <div className="panel p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 grid place-items-center font-bold text-slate-900">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold truncate text-sm">
              {user?.display_name || "User"}
            </p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Logout width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-cyan-400/10 bg-[#040b1c]/70 backdrop-blur sticky top-0 h-screen">
        {SidebarInner}
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-cyan-400/10 bg-[#040b1c]/80 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <span className="text-cyan-300">
            <Shield width={24} height={24} />
          </span>
          <span className="brand-mark text-xl">SENTINEL</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-slate-200">
          <Menu />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-[#040b1c] border-r border-cyan-400/15 fade-up">
            {SidebarInner}
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 px-5 sm:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
