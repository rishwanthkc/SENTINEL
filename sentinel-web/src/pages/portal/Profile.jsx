import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUser, logout } from "../../lib/auth"
import { getContacts, getEmergencyHistory } from "../../api/api"
import PageHeader from "../../components/PageHeader"
import { Logout } from "../../components/Icons"

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  )
}

export default function Profile() {
  const user = getUser()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ contacts: null, sos: null })

  useEffect(() => {
    Promise.all([
      getContacts(user.email).catch(() => []),
      getEmergencyHistory(user.email).catch(() => []),
    ]).then(([c, h]) =>
      setStats({
        contacts: Array.isArray(c) ? c.length : 0,
        sos: Array.isArray(h) ? h.length : 0,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleLogout() {
    logout()
    navigate("/")
  }

  const initials = (user?.display_name || user?.email || "U")
    .slice(0, 1)
    .toUpperCase()

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your account and activity." />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="panel p-8 flex flex-col items-center text-center fade-up">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 grid place-items-center text-4xl font-extrabold text-slate-900">
            {initials}
          </div>
          <h2 className="text-2xl font-bold mt-5">
            {user?.display_name || "User"}
          </h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <span className="chip chip-low mt-4">{user?.role || "USER"}</span>

          <button
            onClick={handleLogout}
            className="btn btn-danger w-full mt-8"
          >
            <Logout width={18} height={18} /> Sign out
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="panel p-6 fade-up">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                Trusted contacts
              </p>
              <p className="text-5xl font-extrabold text-cyan-300 mt-3">
                {stats.contacts === null ? "—" : stats.contacts}
              </p>
            </div>
            <div className="panel p-6 fade-up">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
                SOS triggered
              </p>
              <p className="text-5xl font-extrabold text-rose-400 mt-3">
                {stats.sos === null ? "—" : stats.sos}
              </p>
            </div>
          </div>

          <div className="panel p-6 fade-up">
            <h3 className="font-bold mb-2">Account details</h3>
            <Row label="Display name" value={user?.display_name || "—"} />
            <Row label="Email" value={user?.email} />
            <Row label="User ID" value={user?.user_id || "—"} />
            <Row label="Role" value={user?.role || "USER"} />
          </div>
        </div>
      </div>
    </div>
  )
}
