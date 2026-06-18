import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { GoogleMap, Marker, InfoWindow, Circle } from "@react-google-maps/api"
import {
  fetchActiveEmergencies,
  fetchDashboardStats,
  fetchDashboardReports,
  fetchUsers,
  fetchHotspots,
  resolveEmergency,
} from "./api/api"
import { useMaps, DEFAULT_CENTER, DARK_MAP } from "./lib/useMaps"
import { getUser, logout } from "./lib/auth"
import { Shield, Logout, Siren } from "./components/Icons"

const mapStyle = { width: "100%", height: "500px" }
const mapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  styles: DARK_MAP,
}

function severityIcon(sev) {
  if (sev === 3) return "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  if (sev === 2)
    return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  return "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
}
function severityColor(sev) {
  return sev === 3 ? "#f43f5e" : sev === 2 ? "#fbbf24" : "#34d399"
}

function StatCard({ label, value, color, glow }) {
  return (
    <div
      className="panel panel-hover px-7 py-6 flex-1 min-w-[200px]"
      style={{ boxShadow: `0 16px 40px -24px ${glow}` }}
    >
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
        {label}
      </p>
      <p className="text-5xl font-extrabold mt-3" style={{ color }}>
        {value}
      </p>
    </div>
  )
}

function SeverityChip({ severity }) {
  if (severity === 3) return <span className="chip chip-high">HIGH</span>
  if (severity === 2) return <span className="chip chip-med">MEDIUM</span>
  return <span className="chip chip-low">LOW</span>
}

export default function App() {
  const { isLoaded, loadError } = useMaps()
  const navigate = useNavigate()
  const admin = getUser()

  const [emergencies, setEmergencies] = useState([])
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [incidentMarkers, setIncidentMarkers] = useState([])
  const [hotspots, setHotspots] = useState([])
  const [selectedSOS, setSelectedSOS] = useState(null)
  const [latestEmergency, setLatestEmergency] = useState(null)
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    total_users: 0,
    total_reports: 0,
    active_emergencies: 0,
    total_contacts: 0,
  })

  async function loadAll() {
    try {
      const [s, e, r, u, h] = await Promise.all([
        fetchDashboardStats().catch(() => null),
        fetchActiveEmergencies().catch(() => []),
        fetchDashboardReports().catch(() => []),
        fetchUsers().catch(() => []),
        fetchHotspots().catch(() => []),
      ])
      if (s) setStats(s)
      setEmergencies(Array.isArray(e) ? e : [])
      setLatestEmergency(Array.isArray(e) && e.length ? e[0] : null)
      setReports(Array.isArray(r) ? r : [])
      setIncidentMarkers(Array.isArray(r) ? r : [])
      setUsers(Array.isArray(u) ? u : [])
      setHotspots(Array.isArray(h) ? h : [])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleResolve(id) {
    try {
      await resolveEmergency(id)
      loadAll()
    } catch (err) {
      console.log(err)
    }
  }

  function handleLogout() {
    logout()
    navigate("/")
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll()
    const interval = setInterval(loadAll, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-cyan-400/10 bg-[#040b1c]/85 backdrop-blur">
        <div className="px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-cyan-300">
              <Shield width={28} height={28} />
            </span>
            <div>
              <span className="brand-mark text-2xl">SENTINEL</span>
              <p className="text-slate-500 text-xs -mt-1">Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 text-slate-400 text-sm">
              <span className="live-dot" /> Live · refreshing every 5s
            </span>
            <Link to="/portal" className="btn btn-ghost hidden sm:inline-flex">
              User app
            </Link>
            <span className="text-slate-300 text-sm hidden md:inline">
              {admin?.display_name || admin?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign out"
            >
              <Logout width={22} height={22} />
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 sm:px-10 py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          Women Safety <span className="brand-mark">Command Center</span>
        </h1>
        <p className="text-slate-400 mt-2">
          Real-time monitoring of emergencies, incidents and registered users.
        </p>

        {/* Live SOS banner */}
        {latestEmergency && (
          <div className="mt-7 panel p-6 border-rose-500/50 bg-rose-500/10 sos-pulse flex items-center gap-5 fade-up">
            <span className="text-rose-400">
              <Siren width={40} height={40} />
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-rose-300">
                LIVE SOS DETECTED
              </h2>
              <p className="text-slate-300 mt-1 truncate">
                {latestEmergency.user_email} · {latestEmergency.latitude},{" "}
                {latestEmergency.longitude}
              </p>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => handleResolve(latestEmergency.id)}
            >
              Resolve
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-5 flex-wrap mt-8">
          <StatCard
            label="Total Users"
            value={stats.total_users}
            color="#22d3ee"
            glow="rgba(34,211,238,0.6)"
          />
          <StatCard
            label="Total Reports"
            value={stats.total_reports}
            color="#34d399"
            glow="rgba(52,211,153,0.6)"
          />
          <StatCard
            label="Active Emergencies"
            value={stats.active_emergencies}
            color="#f43f5e"
            glow="rgba(244,63,94,0.6)"
          />
          <StatCard
            label="Total Contacts"
            value={stats.total_contacts}
            color="#fbbf24"
            glow="rgba(251,191,36,0.6)"
          />
        </div>

        {/* Dangerous zones */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-rose-300 mb-6">
            Top Dangerous Zones
          </h2>
          {hotspots.length === 0 ? (
            <p className="text-slate-500">No hotspot data yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hotspots.slice(0, 6).map((item, index) => (
                <div
                  key={`${item.latitude}-${item.longitude}-${index}`}
                  className="panel panel-hover p-6 border-rose-500/30"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-rose-300 text-xl font-bold">
                      Zone #{index + 1}
                    </h3>
                    <span
                      className={`chip ${
                        item.risk_score >= 80
                          ? "chip-high"
                          : item.risk_score >= 50
                          ? "chip-med"
                          : "chip-low"
                      }`}
                    >
                      {item.risk_score >= 80
                        ? "HIGH RISK"
                        : item.risk_score >= 50
                        ? "MEDIUM RISK"
                        : "LOW RISK"}
                    </span>
                  </div>
                  <p className="mt-3 text-slate-400 text-sm">
                    Risk score:{" "}
                    <span className="text-rose-300 font-bold">
                      {item.risk_score}
                    </span>
                  </p>
                  <p className="text-slate-400 text-sm">
                    Severity: {item.severity} · {item.report_type}
                  </p>
                  <p className="text-slate-600 text-xs mt-2">
                    {Number(item.latitude).toFixed(4)},{" "}
                    {Number(item.longitude).toFixed(4)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Live map */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-cyan-300 mb-6">
            Live Emergency Map
          </h2>
          <div className="panel overflow-hidden min-h-[500px] flex flex-col justify-center">
            {loadError ? (
              <div className="p-6 text-center space-y-3 text-rose-300">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                  Map Error
                </span>
                <p className="font-extrabold text-lg">Failed to load Map</p>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Please verify that your Google Maps API Key is valid and has billing enabled on the Google Cloud Console.
                </p>
              </div>
            ) : isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapStyle}
                center={DEFAULT_CENTER}
                zoom={12}
                options={mapOptions}
              >
                {emergencies.map((item) => (
                  <Marker
                    key={item.id}
                    position={{ lat: item.latitude, lng: item.longitude }}
                    icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    onClick={() => setSelectedEmergency(item)}
                  />
                ))}
                {selectedEmergency && (
                  <InfoWindow
                    position={{
                      lat: selectedEmergency.latitude,
                      lng: selectedEmergency.longitude,
                    }}
                    onCloseClick={() => setSelectedEmergency(null)}
                  >
                    <div className="text-black p-1">
                      <strong className="text-rose-600">SOS ACTIVE</strong>
                      <p>{selectedEmergency.user_email}</p>
                      <p>
                        {selectedEmergency.latitude},{" "}
                        {selectedEmergency.longitude}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="h-[500px] grid place-items-center text-slate-500">
                Loading map…
              </div>
            )}
          </div>
        </section>

        {/* Incident heatmap */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-cyan-300 mb-6">
            Incident Heatmap
          </h2>
          <div className="panel overflow-hidden min-h-[500px] flex flex-col justify-center">
            {loadError ? (
              <div className="p-6 text-center space-y-3 text-rose-300">
                <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                  Map Error
                </span>
                <p className="font-extrabold text-lg">Failed to load Map</p>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Please verify that your Google Maps API Key is valid and has billing enabled on the Google Cloud Console.
                </p>
              </div>
            ) : isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapStyle}
                center={DEFAULT_CENTER}
                zoom={11}
                options={mapOptions}
              >
                {incidentMarkers.map((report) => (
                  <React.Fragment key={report.id}>
                    <Marker
                      position={{
                        lat: Number(report.latitude),
                        lng: Number(report.longitude),
                      }}
                      icon={severityIcon(report.severity)}
                    />
                    <Circle
                      center={{
                        lat: Number(report.latitude),
                        lng: Number(report.longitude),
                      }}
                      radius={
                        report.severity === 3
                          ? 500
                          : report.severity === 2
                          ? 350
                          : 200
                      }
                      options={{
                        fillColor: severityColor(report.severity),
                        fillOpacity: 0.22,
                        strokeColor: severityColor(report.severity),
                        strokeWeight: 1.5,
                      }}
                    />
                  </React.Fragment>
                ))}
              </GoogleMap>
            ) : (
              <div className="h-[500px] grid place-items-center text-slate-500">
                Loading map…
              </div>
            )}
          </div>
        </section>

        {/* Reports table */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-cyan-300 mb-6">
            Incident Reports
          </h2>
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-t border-white/5 hover:bg-white/[0.03]"
                    >
                      <td className="p-4">{report.user_email}</td>
                      <td className="p-4">{report.report_type}</td>
                      <td className="p-4">
                        <SeverityChip severity={report.severity} />
                      </td>
                      <td className="p-4 max-w-xs truncate text-slate-300">
                        {report.description}
                      </td>
                      <td className="p-4 text-slate-500">
                        {String(report.created_at || "")}
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td className="p-6 text-slate-500" colSpan={5}>
                        No reports yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Users table */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-cyan-300 mb-6">
            Registered Users
          </h2>
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Verified</th>
                    <th className="p-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.user_id}
                      className="border-t border-white/5 hover:bg-white/[0.03]"
                    >
                      <td className="p-4">{user.display_name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        {user.email_verified === 1 ? (
                          <span className="chip chip-low">VERIFIED</span>
                        ) : (
                          <span className="chip chip-high">NOT VERIFIED</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500">
                        {String(user.created_at || "")}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td className="p-6 text-slate-500" colSpan={4}>
                        No users yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Live emergencies cards */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-cyan-300 mb-6">
            Live Emergencies
          </h2>
          {emergencies.length === 0 ? (
            <div className="panel p-10 text-center text-slate-500">
              No active emergencies. All clear.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencies.slice(0, 12).map((item) => (
                <div
                  key={item.id}
                  className="panel panel-hover p-6 border-rose-500/30"
                >
                  <div className="flex items-center gap-2">
                    <span className="live-dot" />
                    <h3 className="text-lg font-bold text-rose-300">
                      SOS ACTIVE
                    </h3>
                  </div>
                  <p className="mt-4 text-slate-300 truncate">
                    {item.user_email}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    {Number(item.latitude).toFixed(4)},{" "}
                    {Number(item.longitude).toFixed(4)}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {String(item.created_at || "")}
                  </p>
                  <div className="flex gap-3 mt-5">
                    <button
                      className="btn btn-ghost flex-1"
                      onClick={() => setSelectedSOS(item)}
                    >
                      Details
                    </button>
                    <button
                      className="btn btn-danger flex-1"
                      onClick={() => handleResolve(item.id)}
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Details modal */}
      {selectedSOS && (
        <div
          className="fixed inset-0 bg-black/70 grid place-items-center z-50 p-4"
          onClick={() => setSelectedSOS(null)}
        >
          <div
            className="panel p-8 w-full max-w-md fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">
              Emergency details
            </h2>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-slate-400">User: </span>
                {selectedSOS.user_email}
              </p>
              <p>
                <span className="text-slate-400">Latitude: </span>
                {selectedSOS.latitude}
              </p>
              <p>
                <span className="text-slate-400">Longitude: </span>
                {selectedSOS.longitude}
              </p>
              <p>
                <span className="text-slate-400">Time: </span>
                {String(selectedSOS.created_at || "")}
              </p>
            </div>
            <div className="flex gap-3 mt-7">
              <button
                className="btn btn-danger flex-1"
                onClick={() => {
                  handleResolve(selectedSOS.id)
                  setSelectedSOS(null)
                }}
              >
                Resolve
              </button>
              <button
                className="btn btn-ghost flex-1"
                onClick={() => setSelectedSOS(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
