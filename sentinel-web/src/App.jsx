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
import { Shield, Logout, Siren, Users, MapPin, Phone, Plus } from "./components/Icons"

const mapStyle = { width: "100%", height: "550px" }
const mapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  styles: DARK_MAP,
}

const baseIconStyle = {
  width: 20,
  height: 20,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

// Additional Inline SVG Icons
const DashboardIcon = (props) => (
  <svg {...baseIconStyle} {...props} viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
)

const MapIcon = (props) => (
  <svg {...baseIconStyle} {...props} viewBox="0 0 24 24">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
)

const BrainIcon = (props) => (
  <svg {...baseIconStyle} {...props} viewBox="0 0 24 24">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
  </svg>
)

const AnalyticsIcon = (props) => (
  <svg {...baseIconStyle} {...props} viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const BellIcon = (props) => (
  <svg {...baseIconStyle} {...props} viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const FeedbackIcon = (props) => (
  <svg {...baseIconStyle} {...props} viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const AuditIcon = (props) => (
  <svg {...baseIconStyle} {...props} viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)

export default function App() {
  const { isLoaded, loadError } = useMaps()
  const navigate = useNavigate()
  const currentAdmin = getUser()

  // Navigation state
  const [activeTab, setActiveTab] = useState("dashboard")

  // Core Data loaded from APIs
  const [emergencies, setEmergencies] = useState([])
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])
  const [hotspots, setHotspots] = useState([])
  const [stats, setStats] = useState({
    total_users: 0,
    total_reports: 0,
    active_emergencies: 0,
    total_contacts: 0,
  })

  // Track last seen emergency IDs to trigger sound alerts
  const [lastSeenEmergencyIds, setLastSeenEmergencyIds] = useState([])
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false)
  const [toasts, setToasts] = useState([])
  const isFirstLoad = React.useRef(true)

  const addToast = (message, type = "info") => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 6000)
  }

  // 1. Dashboard specific mock states
  const [activeUsersToday, setActiveUsersToday] = useState(18)
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: "SOS", text: "SOS triggered by sneha@test.com - Chennai IT Corridor", time: "10 mins ago" },
    { id: 2, type: "Zone", text: "New Red Zone added by Admin Alice near Vadapalani", time: "1 hour ago" },
    { id: 3, type: "AI", text: "AI flagged suspicious scream match for priya@test.com", time: "2 hours ago" },
    { id: 4, type: "User", text: "User ananya@test.com registered successfully", time: "3 hours ago" },
  ])

  // 2. User Management interactive states
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null)
  const [selectedUserContacts, setSelectedUserContacts] = useState(null)
  const [localUsersOverride, setLocalUsersOverride] = useState({})

  // 3 & 4. Emergency & SOS Live Tracking states
  const [trackingSOS, setTrackingSOS] = useState(null)
  const [simulatedOffset, setSimulatedOffset] = useState({ lat: 0, lng: 0 })

  // 5. AI Risk Monitoring states
  const [aiDetections, setAiDetections] = useState([
    {
      id: "ai-1",
      user: "priya@test.com",
      activity: "High-decibel vocal scream pattern detected",
      riskLevel: "High",
      time: "2026-06-23 12:15:30",
      recommendation: "Deploy emergency security vehicle immediately and send distress alert to primary circle.",
      resolved: false,
    },
    {
      id: "ai-2",
      user: "sneha@test.com",
      activity: "Significant deviation from safe route path corridor",
      riskLevel: "Medium",
      time: "2026-06-23 11:42:10",
      recommendation: "Trigger automatic confirmation phone call, notify primary circle with real-time route path link.",
      resolved: false,
    },
    {
      id: "ai-3",
      user: "rishi@test.com",
      activity: "Speed velocity signature matched with running pattern",
      riskLevel: "Low",
      time: "2026-06-23 09:20:05",
      recommendation: "Track location ping frequency, check active SOS trigger readiness.",
      resolved: true,
    },
  ])

  // 6. Safe / Unsafe Zone Management states
  const [zones, setZones] = useState([
    { id: "zone-1", name: "Chennai IT Expressway Corridor", type: "Safe", lat: 13.0280, lng: 80.2000, radius: 600, activeUsers: 48, incidents: 0 },
    { id: "zone-2", name: "Anna Nagar Central Park Area", type: "Safe", lat: 13.0850, lng: 80.2100, radius: 450, activeUsers: 22, incidents: 0 },
    { id: "zone-3", name: "Vadapalani Dark Alleyway Intersection", type: "Red", lat: 13.0490, lng: 80.2080, radius: 300, activeUsers: 5, incidents: 8 },
    { id: "zone-4", name: "Tambaram Industrial Bypass Underpass", type: "Red", lat: 12.9230, lng: 80.1200, radius: 500, activeUsers: 1, incidents: 12 },
  ])
  const [newZoneForm, setNewZoneForm] = useState({ name: "", type: "Safe", lat: "13.0827", lng: "80.2707", radius: "500" })

  // 8. Notification Center states
  const [notificationForm, setNotificationForm] = useState({ title: "", body: "", type: "Global Announcement" })
  const [notificationHistory, setNotificationHistory] = useState([
    { id: 1, title: "Weather Warning", body: "Heavy rain predicted tonight. Stick to primary lit roads.", type: "Global Announcement", date: "2026-06-22" },
    { id: 2, title: "Emergency Update", body: "Police patrol density increased near Anna Nagar hub.", type: "Safety Announcement", date: "2026-06-21" },
  ])

  // 9. Contact / Helpline Management states
  const [helplines, setHelplines] = useState([
    { id: 1, name: "National Emergency Service", number: "112", category: "Helpline" },
    { id: 2, name: "Women Helpline Center", number: "1091", category: "Helpline" },
    { id: 3, name: "Central Police Head Office", number: "044-23458300", category: "Police" },
    { id: 4, name: "Chennai General Hospital ER", number: "044-28290200", category: "Hospital" },
    { id: 5, name: "Aadya Women Support Foundation", number: "1800-419-8588", category: "NGO" },
  ])
  const [newHelplineForm, setNewHelplineForm] = useState({ name: "", number: "", category: "Helpline" })

  // 10. Feedback & Complaints states
  const [complaints, setComplaints] = useState([
    { id: 1, user: "ananya@test.com", category: "Infrastructure", content: "Streetlights are completely offline near the Metro Station exit road. The pathway is extremely dark.", status: "Pending", reply: "", date: "2026-06-20" },
    { id: 2, user: "meera@test.com", category: "App Bug", content: "The emergency volume button shortcut did not vibrate when I was testing it in the profile section.", status: "In Progress", reply: "We are patching this on the upcoming Android build (v2.1).", date: "2026-06-18" },
    { id: 3, user: "sneha@test.com", category: "Safety Issue", content: "Unsafe gathering noted daily near the Vadapalani bus depot back exit around 9 PM.", status: "Resolved", reply: "Local patrol team notified. Guard presence increased.", date: "2026-06-15" },
  ])
  const [replyComplaintId, setReplyComplaintId] = useState(null)
  const [replyText, setReplyText] = useState("")

  // 11. Audit Logs states
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, timestamp: "2026-06-23 11:24:12", user: "Alice (cipher@new.com)", action: "Admin Session Login", details: "Signed in successfully from IP 192.168.1.42", type: "Security" },
    { id: 2, timestamp: "2026-06-23 10:45:00", user: "System", action: "SOS Alarm Auto-Trigger", details: "Emergency alert initialized for sneha@test.com", type: "System" },
    { id: 3, timestamp: "2026-06-23 09:12:00", user: "Alice (cipher@new.com)", action: "Zone Registry Update", details: "Added new Red Zone: Tambaram Bypass Underpass", type: "Admin" },
    { id: 4, timestamp: "2026-06-23 08:30:15", user: "System", action: "Database Maintenance", details: "Archived 12-day-old location logs (database optimization)", type: "System" },
  ])

  // Simulation logic for user live tracking
  useEffect(() => {
    if (!trackingSOS) return
    const interval = setInterval(() => {
      setSimulatedOffset((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [trackingSOS])

  // Synthesize siren beep and trigger toast to alert Admin when new SOS arrives
  useEffect(() => {
    if (!hasLoadedInitially) return

    const activeIds = emergencies.map(e => e.id)
    
    if (isFirstLoad.current) {
      setLastSeenEmergencyIds(activeIds)
      isFirstLoad.current = false
      return
    }

    const hasNewSOS = activeIds.some(id => !lastSeenEmergencyIds.includes(id))
    
    if (hasNewSOS) {
      const newEmergencies = emergencies.filter(e => !lastSeenEmergencyIds.includes(e.id))
      newEmergencies.forEach(e => {
        addToast(`CRITICAL: SOS triggered by ${e.user_email}!`, "danger")
      })

      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(880, audioCtx.currentTime) // High beep
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.4)
        osc.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.4)
      } catch (err) {
        console.log("Audio warning: autoplay blocked", err)
      }
    }
    setLastSeenEmergencyIds(activeIds)
  }, [emergencies, lastSeenEmergencyIds, hasLoadedInitially])

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
      setReports(Array.isArray(r) ? r : [])
      setUsers(Array.isArray(u) ? u : [])
      setHotspots(Array.isArray(h) ? h : [])
      setHasLoadedInitially(true)
    } catch (err) {
      console.log(err)
    }
  }

  async function handleResolve(id, userEmail = "User") {
    try {
      await resolveEmergency(id)
      
      // Update Audit Logs
      const now = new Date().toISOString().replace("T", " ").substring(0, 19)
      setAuditLogs((prev) => [
        {
          id: Date.now(),
          timestamp: now,
          user: "Alice (cipher@new.com)",
          action: "Resolve SOS Alert",
          details: `Resolved emergency SOS alert for ${userEmail}`,
          type: "Admin",
        },
        ...prev,
      ])

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
    loadAll()
    const interval = setInterval(loadAll, 3000)
    return () => clearInterval(interval)
  }, [])

  // Interactive functions

  // User Management
  const getDisplayUsers = () => {
    return users.map(u => {
      const override = localUsersOverride[u.user_id] || {}
      return {
        ...u,
        display_name: override.display_name !== undefined ? override.display_name : u.display_name,
        email: override.email !== undefined ? override.email : u.email,
        role: override.role !== undefined ? override.role : u.role,
        status: override.status !== undefined ? override.status : "Active",
        safetyScore: override.safetyScore !== undefined ? override.safetyScore : (92 + (parseInt(u.user_id?.slice(0, 2), 16) || 5) % 8) + "%"
      }
    }).filter(u => {
      const query = userSearchQuery.toLowerCase()
      return u.display_name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query)
    })
  }

  const handleUpdateUser = (e) => {
    e.preventDefault()
    if (!selectedUserForEdit) return
    const id = selectedUserForEdit.user_id
    setLocalUsersOverride(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        display_name: selectedUserForEdit.display_name,
        email: selectedUserForEdit.email,
        role: selectedUserForEdit.role,
        status: selectedUserForEdit.status,
      }
    }))

    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: "User Update",
        details: `Edited user details for ${selectedUserForEdit.email} (${selectedUserForEdit.role})`,
        type: "Admin",
      },
      ...prev,
    ])

    setSelectedUserForEdit(null)
  }

  const handleDeleteUser = (userId, email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}?`)) return
    setUsers(prev => prev.filter(u => u.user_id !== userId))
    
    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: "User Deletion",
        details: `Deleted user account: ${email}`,
        type: "Security",
      },
      ...prev,
    ])
  }

  const handleToggleUserStatus = (u) => {
    const id = u.user_id
    const newStatus = u.status === "Active" ? "Deactivated" : "Active"
    setLocalUsersOverride(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        status: newStatus
      }
    }))

    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: newStatus === "Deactivated" ? "Account Deactivation" : "Account Activation",
        details: `${newStatus === "Deactivated" ? "Deactivated" : "Activated"} user: ${u.email}`,
        type: "Admin",
      },
      ...prev,
    ])
  }

  // Zone Management
  const handleAddZone = (e) => {
    e.preventDefault()
    if (!newZoneForm.name) return
    const newZone = {
      id: "zone-" + Date.now(),
      name: newZoneForm.name,
      type: newZoneForm.type,
      lat: parseFloat(newZoneForm.lat) || 13.0827,
      lng: parseFloat(newZoneForm.lng) || 80.2707,
      radius: parseInt(newZoneForm.radius) || 500,
      activeUsers: 0,
      incidents: newZoneForm.type === "Red" ? 1 : 0
    }
    setZones(prev => [...prev, newZone])
    
    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: "Zone Addition",
        details: `Added new ${newZoneForm.type} Zone: ${newZoneForm.name}`,
        type: "Admin",
      },
      ...prev,
    ])

    setNewZoneForm({ name: "", type: "Safe", lat: "13.0827", lng: "80.2707", radius: "500" })
  }

  const handleDeleteZone = (id, name) => {
    setZones(prev => prev.filter(z => z.id !== id))
    
    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: "Zone Deletion",
        details: `Deleted Zone: ${name}`,
        type: "Admin",
      },
      ...prev,
    ])
  }

  // AI Risk Detections Resolve
  const handleResolveAi = (id, user) => {
    setAiDetections(prev => prev.map(d => d.id === id ? { ...d, resolved: true } : d))
    
    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: "AI Risk Resolved",
        details: `Acknowledged and resolved AI alert warning for user ${user}`,
        type: "Admin",
      },
      ...prev,
    ])
  }

  // Send Notification
  const handleSendNotification = (e) => {
    e.preventDefault()
    if (!notificationForm.title || !notificationForm.body) return
    const newNotif = {
      id: Date.now(),
      title: notificationForm.title,
      body: notificationForm.body,
      type: notificationForm.type,
      date: new Date().toISOString().split("T")[0]
    }
    setNotificationHistory(prev => [newNotif, ...prev])
    
    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: "Push Notification Broadcasted",
        details: `Sent [${notificationForm.type}] notification: "${notificationForm.title}"`,
        type: "Admin",
      },
      ...prev,
    ])

    alert(`Notification Broadcast Successfully sent to all active devices!`)
    setNotificationForm({ title: "", body: "", type: "Global Announcement" })
  }

  // Helplines Management
  const handleAddHelpline = (e) => {
    e.preventDefault()
    if (!newHelplineForm.name || !newHelplineForm.number) return
    const newItem = {
      id: Date.now(),
      name: newHelplineForm.name,
      number: newHelplineForm.number,
      category: newHelplineForm.category
    }
    setHelplines(prev => [...prev, newItem])
    
    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: "Helpline Addition",
        details: `Added new ${newHelplineForm.category} contact: ${newHelplineForm.name}`,
        type: "Admin",
      },
      ...prev,
    ])

    setNewHelplineForm({ name: "", number: "", category: "Helpline" })
  }

  const handleDeleteHelpline = (id, name) => {
    setHelplines(prev => prev.filter(h => h.id !== id))
    
    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: "Helpline Deletion",
        details: `Deleted contact: ${name}`,
        type: "Admin",
      },
      ...prev,
    ])
  }

  // Feedback & Complaints
  const handleReplyComplaint = (e) => {
    e.preventDefault()
    if (!replyComplaintId || !replyText) return
    setComplaints(prev => prev.map(c => c.id === replyComplaintId ? { ...c, status: "Resolved", reply: replyText } : c))
    
    // Audit Log
    const now = new Date().toISOString().replace("T", " ").substring(0, 19)
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        timestamp: now,
        user: "Alice (cipher@new.com)",
        action: "Complaint Reply",
        details: `Replied and resolved complaint #${replyComplaintId}`,
        type: "Admin",
      },
      ...prev,
    ])

    setReplyComplaintId(null)
    setReplyText("")
  }

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-80 shrink-0 border-r border-cyan-400/10 bg-[#040b1c]/90 backdrop-blur sticky top-0 h-screen flex-col justify-between">
        <div className="flex flex-col h-full overflow-y-auto pb-4">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
            <span className="text-cyan-300">
              <Shield width={32} height={32} />
            </span>
            <div>
              <span className="brand-mark text-2xl">SENTINEL</span>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest -mt-1">
                Command Center v2.0
              </p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "dashboard"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <DashboardIcon />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("map")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "map"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <MapIcon />
              Live Tracking Map
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <Users width={20} height={20} />
              User Management
            </button>

            <button
              onClick={() => setActiveTab("emergencies")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "emergencies"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <Siren width={20} height={20} />
              Emergency & SOS
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "ai"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <BrainIcon />
              AI Risk Monitoring
            </button>

            <button
              onClick={() => setActiveTab("zones")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "zones"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <MapPin width={20} height={20} />
              Zone Management
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <AnalyticsIcon />
              Reports & Analytics
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "notifications"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <BellIcon />
              Notification Center
            </button>

            <button
              onClick={() => setActiveTab("contacts")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "contacts"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <Phone width={20} height={20} />
              Helplines & Contacts
            </button>

            <button
              onClick={() => setActiveTab("feedback")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "feedback"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <FeedbackIcon />
              User Feedback
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "audit"
                  ? "bg-cyan-400/15 text-cyan-200 border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              }`}
            >
              <AuditIcon />
              Audit Logs
            </button>
          </nav>
        </div>

        {/* Admin profile detail block */}
        <div className="p-4 border-t border-white/5">
          <div className="panel p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 grid place-items-center font-bold text-slate-900">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate text-sm">
                {currentAdmin?.display_name || "Alice"}
              </p>
              <p className="text-slate-500 text-xs truncate">
                {currentAdmin?.email || "cipher@new.com"}
              </p>
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
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#020617]">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-cyan-400/10 bg-[#040b1c]/80 backdrop-blur sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-cyan-300">
              <Shield width={24} height={24} />
            </span>
            <span className="brand-mark text-xl">SENTINEL</span>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="bg-[#06142b] border border-cyan-400/30 text-xs px-2 py-1.5 rounded-lg text-cyan-200 outline-none"
            >
              <option value="dashboard">Dashboard</option>
              <option value="map">Live Tracking Map</option>
              <option value="users">User Management</option>
              <option value="emergencies">Emergency & SOS</option>
              <option value="ai">AI Risk Monitoring</option>
              <option value="zones">Zone Management</option>
              <option value="analytics">Reports & Analytics</option>
              <option value="notifications">Notification Center</option>
              <option value="contacts">Helplines & Contacts</option>
              <option value="feedback">User Feedback</option>
              <option value="audit">Audit Logs</option>
            </select>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Logout width={20} height={20} />
            </button>
          </div>
        </header>

        {/* Scrollable container for tab contents */}
        <main className="flex-1 px-6 sm:px-10 py-8 overflow-y-auto">
          {/* Active Live SOS banner (shown on all tabs for quick actions) */}
          {emergencies.length > 0 && (
            <div className="mb-8 panel p-6 border-rose-500/50 bg-rose-500/10 sos-pulse flex flex-col sm:flex-row items-start sm:items-center gap-5 fade-up">
              <span className="text-rose-400 animate-bounce">
                <Siren width={36} height={36} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="live-dot" />
                  <h2 className="text-xl font-bold text-rose-300">
                    CRITICAL EMERGENCY ALERT ACTIVE
                  </h2>
                </div>
                <p className="text-slate-300 mt-1 truncate text-sm">
                  {emergencies[0].user_email} · Location: {emergencies[0].latitude}, {emergencies[0].longitude}
                  {emergencies.length > 1 && ` (+${emergencies.length - 1} more active)`}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  className="btn btn-ghost text-xs py-2 px-4 flex-1 sm:flex-initial"
                  onClick={() => {
                    setTrackingSOS(emergencies[0])
                    setActiveTab("map")
                  }}
                >
                  Track Live Location
                </button>
                <button
                  className="btn btn-danger text-xs py-2 px-4 flex-1 sm:flex-initial"
                  onClick={() => handleResolve(emergencies[0].id, emergencies[0].user_email)}
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          )}

          {/* 1. DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 fade-up">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold">Command Center Dashboard</h1>
                <p className="text-slate-400 mt-1">Safety infrastructure, real-time analytics & telemetry.</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="panel p-5 sm:p-6 flex flex-col justify-between">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Registered</p>
                  <p className="text-4xl sm:text-5xl font-extrabold mt-3 text-cyan-300">{stats.total_users}</p>
                  <p className="text-[10px] text-slate-500 mt-2">Active database records</p>
                </div>
                <div className="panel p-5 sm:p-6 flex flex-col justify-between">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Users Today</p>
                  <p className="text-4xl sm:text-5xl font-extrabold mt-3 text-emerald-400">{activeUsersToday}</p>
                  <p className="text-[10px] text-emerald-500 mt-2">● Real-time sync online</p>
                </div>
                <div className="panel p-5 sm:p-6 flex flex-col justify-between">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active SOS Alerts</p>
                  <p className="text-4xl sm:text-5xl font-extrabold mt-3 text-rose-400">{emergencies.length}</p>
                  <p className="text-[10px] text-rose-500 mt-2">Immediate response required</p>
                </div>
                <div className="panel p-5 sm:p-6 flex flex-col justify-between">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Risk Zones Detected</p>
                  <p className="text-4xl sm:text-5xl font-extrabold mt-3 text-amber-400">{hotspots.length}</p>
                  <p className="text-[10px] text-amber-500 mt-2">Based on incident severity</p>
                </div>
              </div>

              {/* CRITICAL UPDATE: Live Active SOS Alerts list on Dashboard */}
              {emergencies.length > 0 && (
                <div className="panel p-6 border-rose-500/40 bg-rose-500/5 space-y-4 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-pulse-subtle">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="live-dot" />
                      <h3 className="text-lg font-bold text-rose-300">Live Active SOS Emergencies</h3>
                    </div>
                    <span className="chip chip-high text-[10px]">{emergencies.length} ACTIVE</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {emergencies.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-[#180a0f] border border-rose-500/30 flex flex-col justify-between space-y-4">
                        <div>
                          <p className="text-sm font-bold text-rose-200 truncate">{item.user_email}</p>
                          <p className="text-xs text-slate-400 mt-1">Coordinates: {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}</p>
                          <p className="text-[10px] text-slate-500 mt-1">Triggered: {item.created_at}</p>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-rose-500/10">
                          <button
                            className="btn btn-ghost text-[10px] py-1 px-3 flex-1"
                            onClick={() => {
                              setTrackingSOS(item)
                              setActiveTab("map")
                            }}
                          >
                            Track Live
                          </button>
                          <button
                            className="btn btn-danger text-[10px] py-1 px-3 flex-1"
                            onClick={() => handleResolve(item.id, item.user_email)}
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary stats row */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Resolved vs Pending Panel */}
                <div className="panel p-6 lg:col-span-1">
                  <h3 className="text-lg font-bold text-slate-200 mb-4">Incident Scorecard</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Total Incident Reports</span>
                        <span className="font-bold text-slate-200">{stats.total_reports}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: "100%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Resolved SOS alerts</span>
                        <span className="font-bold text-emerald-400">96.8%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: "96.8%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Unsafe Hotspots Resolved</span>
                        <span className="font-bold text-amber-400">75%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: "75%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="panel p-6 lg:col-span-2">
                  <h3 className="text-lg font-bold text-slate-200 mb-4">Recent Emergency Activities</h3>
                  <div className="space-y-3.5">
                    {recentActivities.map((act) => (
                      <div key={act.id} className="flex justify-between items-start gap-4 text-sm pb-2.5 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${act.type === 'SOS' ? 'bg-rose-400' : act.type === 'AI' ? 'bg-cyan-400' : 'bg-slate-400'}`} />
                          <p className="text-slate-300">{act.text}</p>
                        </div>
                        <span className="text-slate-500 text-xs shrink-0">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Danger hotspots overview */}
              <div className="panel p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-200">Critical High-Risk Hotspots</h3>
                  <button className="btn btn-ghost text-xs py-1.5 px-3" onClick={() => setActiveTab("zones")}>Manage Zones</button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {hotspots.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-rose-500/25">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-rose-400 font-bold tracking-wider">ZONE #{idx + 1}</span>
                        <span className="chip chip-high text-[10px] py-0.5">SCORE {item.risk_score}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-200 mt-3 truncate">{item.report_type}</p>
                      <p className="text-xs text-slate-400 mt-1">Severity rating: {item.severity}/3</p>
                      <p className="text-[10px] text-slate-600 mt-2 font-mono">{Number(item.latitude).toFixed(4)}, {Number(item.longitude).toFixed(4)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. USER MANAGEMENT VIEW */}
          {activeTab === "users" && (
            <div className="space-y-6 fade-up">
              <div>
                <h1 className="text-3xl font-extrabold">Registered User Directory</h1>
                <p className="text-slate-400 mt-1">Monitor credentials, modify authorization rules, toggle statuses, and audit circle configurations.</p>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                <input
                  type="text"
                  placeholder="Search registered accounts by name or email address..."
                  className="field max-w-md"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
                <span className="text-xs text-slate-500 self-center">Showing {getDisplayUsers().length} accounts</span>
              </div>

              {/* Users Table */}
              <div className="panel overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400">
                      <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Safety Score</th>
                        <th className="p-4">Account Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getDisplayUsers().map((user) => (
                        <tr key={user.user_id} className="border-t border-white/5 hover:bg-white/[0.02]">
                          <td className="p-4 font-semibold text-slate-200">{user.display_name || "N/A"}</td>
                          <td className="p-4 text-slate-300 font-mono text-xs">{user.email}</td>
                          <td className="p-4">
                            <span className={`chip ${user.role === 'ADMIN' ? 'chip-med' : 'chip-low'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300 font-bold">{user.safetyScore}</td>
                          <td className="p-4">
                            <span className={`chip ${user.status === 'Active' ? 'chip-low' : 'chip-high'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                className="btn btn-ghost text-xs py-1.5 px-3"
                                onClick={() => setSelectedUserContacts({
                                  email: user.email,
                                  contacts: [
                                    { name: "Mom", phone: "+919876543210" },
                                    { name: "Brother", phone: "+919876543211" },
                                  ]
                                })}
                              >
                                Circle Contacts
                              </button>
                              <button
                                className="btn btn-ghost text-xs py-1.5 px-3"
                                onClick={() => setSelectedUserForEdit(user)}
                              >
                                Edit
                              </button>
                              <button
                                className={`btn text-xs py-1.5 px-3 ${user.status === 'Active' ? 'btn-ghost' : 'btn-primary'}`}
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                className="btn btn-danger text-xs py-1.5 px-3"
                                onClick={() => handleDeleteUser(user.user_id, user.email)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {getDisplayUsers().length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">No accounts found matching search criteria.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit User Modal */}
              {selectedUserForEdit && (
                <div className="fixed inset-0 bg-black/75 grid place-items-center z-50 p-4">
                  <form onSubmit={handleUpdateUser} className="panel p-8 w-full max-w-md space-y-5 fade-up" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold text-cyan-300">Edit User Profile</h2>
                    
                    <div>
                      <label className="label">Display Name</label>
                      <input
                        type="text"
                        className="field"
                        value={selectedUserForEdit.display_name || ""}
                        onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, display_name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Email Address</label>
                      <input
                        type="email"
                        className="field"
                        value={selectedUserForEdit.email || ""}
                        onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Role</label>
                        <select
                          className="field"
                          value={selectedUserForEdit.role || "USER"}
                          onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, role: e.target.value})}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                      <div>
                        <label className="label">Status</label>
                        <select
                          className="field"
                          value={selectedUserForEdit.status || "Active"}
                          onChange={(e) => setSelectedUserForEdit({...selectedUserForEdit, status: e.target.value})}
                        >
                          <option value="Active">Active</option>
                          <option value="Deactivated">Deactivated</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button type="submit" className="btn btn-primary flex-1">Save Changes</button>
                      <button type="button" className="btn btn-ghost flex-1" onClick={() => setSelectedUserForEdit(null)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {/* View Emergency Contacts Modal */}
              {selectedUserContacts && (
                <div className="fixed inset-0 bg-black/75 grid place-items-center z-50 p-4" onClick={() => setSelectedUserContacts(null)}>
                  <div className="panel p-8 w-full max-w-md space-y-4 fade-up" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-xl font-bold text-cyan-300">Trusted Contacts Circle</h2>
                    <p className="text-slate-400 text-xs -mt-2">Configured emergency SMS contacts for: <span className="text-slate-200">{selectedUserContacts.email}</span></p>

                    <div className="space-y-2 mt-4">
                      {selectedUserContacts.contacts.map((c, i) => (
                        <div key={i} className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/5 text-sm">
                          <span className="font-semibold text-slate-300">{c.name}</span>
                          <span className="font-mono text-cyan-400">{c.phone}</span>
                        </div>
                      ))}
                    </div>

                    <button className="btn btn-ghost w-full mt-6" onClick={() => setSelectedUserContacts(null)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. EMERGENCY MANAGEMENT VIEW */}
          {activeTab === "emergencies" && (
            <div className="space-y-6 fade-up">
              <div>
                <h1 className="text-3xl font-extrabold">Emergency & SOS Logs</h1>
                <p className="text-slate-400 mt-1">Audit active alarms, review geolocation logs, and record resolution notes.</p>
              </div>

              {/* SOS History Table */}
              <div className="panel overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Latitude</th>
                        <th className="p-4">Longitude</th>
                        <th className="p-4">Trigger Time</th>
                        <th className="p-4">Alarm Status</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emergencies.map((item) => (
                        <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.02] bg-rose-500/5">
                          <td className="p-4 font-semibold text-rose-300">{item.user_email}</td>
                          <td className="p-4 font-mono text-xs">{item.latitude}</td>
                          <td className="p-4 font-mono text-xs">{item.longitude}</td>
                          <td className="p-4 text-slate-400">{String(item.created_at || "")}</td>
                          <td className="p-4">
                            <span className="chip chip-high animate-pulse">ACTIVE SOS</span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                className="btn btn-primary text-xs py-1.5 px-3"
                                onClick={() => {
                                  setTrackingSOS(item)
                                  setActiveTab("map")
                                }}
                              >
                                Live Tracking
                              </button>
                              <button
                                className="btn btn-danger text-xs py-1.5 px-3"
                                onClick={() => handleResolve(item.id, item.user_email)}
                              >
                                Mark Resolved
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {emergencies.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">No active SOS emergencies. All clear.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resolved Emergency Logs */}
              <div className="panel p-6 space-y-4">
                <h3 className="text-xl font-bold text-slate-200">Incident History logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400">
                      <tr>
                        <th className="p-3">User</th>
                        <th className="p-3">Coordinates</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-white/5 text-slate-400">
                        <td className="p-3">sneha@test.com</td>
                        <td className="p-3">13.0280, 80.2000</td>
                        <td className="p-3 text-emerald-400">RESOLVED</td>
                        <td className="p-3">2026-06-23 10:45:12</td>
                      </tr>
                      <tr className="border-t border-white/5 text-slate-400">
                        <td className="p-3">ananya@test.com</td>
                        <td className="p-3">13.0850, 80.2100</td>
                        <td className="p-3 text-emerald-400">RESOLVED</td>
                        <td className="p-3">2026-06-22 19:12:05</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. LIVE MAP & TRACKING VIEW */}
          {activeTab === "map" && (
            <div className="space-y-6 fade-up">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-extrabold">Live Emergency Tracking Map</h1>
                  <p className="text-slate-400 mt-1">Real-time SOS tracking overlays, geo-fence monitoring circle buffers and danger heatmaps.</p>
                </div>
                {trackingSOS && (
                  <button className="btn btn-danger text-xs" onClick={() => { setTrackingSOS(null); setSimulatedOffset({ lat: 0, lng: 0 }); }}>
                    Stop Tracking
                  </button>
                )}
              </div>

              {trackingSOS && (
                <div className="panel p-5 bg-[#0b1a30] border-cyan-400/50 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="live-dot" />
                    <div>
                      <p className="text-sm font-bold text-slate-200">Active Live Tracking Mode: {trackingSOS.user_email}</p>
                      <p className="text-xs text-slate-400">Telemetry: Lat {(trackingSOS.latitude + simulatedOffset.lat).toFixed(6)}, Lng {(trackingSOS.longitude + simulatedOffset.lng).toFixed(6)}</p>
                    </div>
                  </div>
                  <span className="chip chip-med text-[10px] animate-pulse">SIMULATED LOCATION MOVING</span>
                </div>
              )}

              {/* 2-Column Map view: Map + Active SOS sidebar */}
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Map display */}
                <div className="panel overflow-hidden min-h-[550px] lg:col-span-3 flex flex-col justify-center relative">
                  {loadError ? (
                    <div className="p-6 text-center space-y-3 text-rose-300">
                      <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">Map Error</span>
                      <p className="font-extrabold text-lg">Failed to load Map</p>
                      <p className="text-slate-400 text-xs max-w-sm mx-auto">Please check Maps billing settings in GCP Console.</p>
                    </div>
                  ) : isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapStyle}
                      center={trackingSOS ? { lat: trackingSOS.latitude + simulatedOffset.lat, lng: trackingSOS.longitude + simulatedOffset.lng } : DEFAULT_CENTER}
                      zoom={trackingSOS ? 15 : 12}
                      options={mapOptions}
                    >
                      {/* Active Emergencies Markers */}
                      {emergencies.map((item) => (
                        <Marker
                          key={item.id}
                          position={{
                            lat: item.id === trackingSOS?.id ? item.latitude + simulatedOffset.lat : item.latitude,
                            lng: item.id === trackingSOS?.id ? item.longitude + simulatedOffset.lng : item.longitude
                          }}
                          icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                          onClick={() => setSelectedEmergency(item)}
                        />
                      ))}

                      {/* Zone Geo-fences overlays */}
                      {zones.map((zone) => (
                        <Circle
                          key={zone.id}
                          center={{ lat: zone.lat, lng: zone.lng }}
                          radius={zone.radius}
                          options={{
                            fillColor: zone.type === "Safe" ? "#10b981" : "#f43f5e",
                            fillOpacity: 0.15,
                            strokeColor: zone.type === "Safe" ? "#10b981" : "#f43f5e",
                            strokeWeight: 1.5,
                          }}
                        />
                      ))}

                      {/* Incident Hotspot Circles */}
                      {reports.map((r, idx) => (
                        <Circle
                          key={idx}
                          center={{ lat: parseFloat(r.latitude) || 13.08, lng: parseFloat(r.longitude) || 80.27 }}
                          radius={r.severity === 3 ? 400 : r.severity === 2 ? 250 : 150}
                          options={{
                            fillColor: r.severity === 3 ? "#f43f5e" : r.severity === 2 ? "#fbbf24" : "#10b981",
                            fillOpacity: 0.1,
                            strokeColor: r.severity === 3 ? "#f43f5e" : r.severity === 2 ? "#fbbf24" : "#10b981",
                            strokeWeight: 1,
                          }}
                        />
                      ))}

                      {selectedEmergency && (
                        <InfoWindow
                          position={{ lat: selectedEmergency.latitude, lng: selectedEmergency.longitude }}
                          onCloseClick={() => setSelectedEmergency(null)}
                        >
                          <div className="text-black p-1">
                            <strong className="text-rose-600">SOS ACTIVE</strong>
                            <p className="text-xs">{selectedEmergency.user_email}</p>
                            <p className="text-[10px]">{selectedEmergency.latitude.toFixed(4)}, {selectedEmergency.longitude.toFixed(4)}</p>
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  ) : (
                    <div className="h-[550px] grid place-items-center text-slate-500">Loading Map components…</div>
                  )}
                </div>

                {/* Sidebar list of active SOS */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <div className="panel p-5 space-y-4 flex-1 overflow-y-auto max-h-[550px]">
                    <h3 className="text-md font-bold text-slate-200 border-b border-white/5 pb-2">Active SOS Signals</h3>
                    {emergencies.length === 0 ? (
                      <p className="text-xs text-slate-500">No active SOS signals currently transmitting.</p>
                    ) : (
                      <div className="space-y-3">
                        {emergencies.map((item) => (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                              trackingSOS?.id === item.id
                                ? "bg-rose-950/20 border-rose-500/50"
                                : "bg-white/5 border-white/5 hover:border-white/10"
                            }`}
                            onClick={() => {
                              setTrackingSOS(item)
                              setSimulatedOffset({ lat: 0, lng: 0 })
                            }}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-rose-300 truncate max-w-[120px]">{item.user_email}</span>
                              <span className="live-dot" />
                            </div>
                            <p className="text-slate-400">Lat: {item.latitude.toFixed(4)}</p>
                            <p className="text-slate-400">Lng: {item.longitude.toFixed(4)}</p>
                            <div className="mt-2 flex gap-1 justify-end">
                              <button
                                className="btn btn-ghost text-[9px] py-0.5 px-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleResolve(item.id, item.user_email)
                                  if (trackingSOS?.id === item.id) {
                                    setTrackingSOS(null)
                                  }
                                }}
                              >
                                Resolve
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. AI RISK MONITORING VIEW */}
          {activeTab === "ai" && (
            <div className="space-y-6 fade-up">
              <div>
                <h1 className="text-3xl font-extrabold">AI Predictive Risk Monitoring</h1>
                <p className="text-slate-400 mt-1">Real-time neural network detection of scream logs, anomalous route offsets and abnormal speeds.</p>
              </div>

              {/* Detections List */}
              <div className="panel overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-200">Active AI Detection Feed</h3>
                  <button className="btn btn-ghost text-xs" onClick={() => {
                    const newD = {
                      id: "ai-" + Date.now(),
                      user: "ananya@test.com",
                      activity: "Anomalous route stoppage detected in dark spot",
                      riskLevel: "Medium",
                      time: new Date().toISOString().replace("T", " ").substring(0, 19),
                      recommendation: "Query user via SMS check-in pulse, trigger mock geocoding check.",
                      resolved: false
                    }
                    setAiDetections(prev => [newD, ...prev])
                  }}>Simulate AI Event</button>
                </div>
                <div className="divide-y divide-white/5">
                  {aiDetections.map((det) => (
                    <div key={det.id} className={`p-6 flex flex-col md:flex-row gap-5 justify-between items-start md:items-center ${det.resolved ? 'opacity-55' : ''}`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`chip ${det.riskLevel === 'High' ? 'chip-high' : det.riskLevel === 'Medium' ? 'chip-med' : 'chip-low'}`}>
                            {det.riskLevel.toUpperCase()} RISK
                          </span>
                          <span className="text-slate-400 font-semibold">{det.user}</span>
                          <span className="text-slate-500 text-xs">{det.time}</span>
                        </div>
                        <p className="text-slate-200 font-bold text-base">{det.activity}</p>
                        <p className="text-sm text-cyan-300/80 bg-cyan-900/10 p-3 rounded-lg border border-cyan-400/10">
                          <span className="font-bold text-cyan-300">Recommendation:</span> {det.recommendation}
                        </p>
                      </div>
                      
                      {!det.resolved ? (
                        <button
                          className="btn btn-primary text-xs shrink-0 py-2 px-4"
                          onClick={() => handleResolveAi(det.id, det.user)}
                        >
                          Resolve Alert
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-bold text-sm">✓ RESOLVED</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. ZONE MANAGEMENT VIEW */}
          {activeTab === "zones" && (
            <div className="space-y-6 fade-up">
              <div>
                <h1 className="text-3xl font-extrabold">Safe & Red Zone Registry</h1>
                <p className="text-slate-400 mt-1">Configure geofencing radius profiles, define red risk polygons, and view active traffic statistics.</p>
              </div>

              {/* Add Zone Form */}
              <div className="panel p-6">
                <h3 className="text-lg font-bold text-slate-200 mb-4">Register New Geo-fence Area</h3>
                <form onSubmit={handleAddZone} className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="label">Zone Name</label>
                    <input
                      type="text"
                      className="field"
                      placeholder="e.g. IT Park Gate 3"
                      value={newZoneForm.name}
                      onChange={(e) => setNewZoneForm({...newZoneForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Classification</label>
                    <select
                      className="field"
                      value={newZoneForm.type}
                      onChange={(e) => setNewZoneForm({...newZoneForm, type: e.target.value})}
                    >
                      <option value="Safe">Safe Zone (Green)</option>
                      <option value="Red">Red Zone (Risk Area)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Latitude</label>
                    <input
                      type="text"
                      className="field font-mono"
                      value={newZoneForm.lat}
                      onChange={(e) => setNewZoneForm({...newZoneForm, lat: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Longitude</label>
                    <input
                      type="text"
                      className="field font-mono"
                      value={newZoneForm.lng}
                      onChange={(e) => setNewZoneForm({...newZoneForm, lng: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="label">Radius (m)</label>
                      <input
                        type="number"
                        className="field"
                        value={newZoneForm.radius}
                        onChange={(e) => setNewZoneForm({...newZoneForm, radius: e.target.value})}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary px-3 self-end flex-initial" style={{height: "47px"}}>
                      <Plus width={18} height={18} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Zones List Table */}
              <div className="panel overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400">
                      <tr>
                        <th className="p-4">Zone Name</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Geofence Coordinates</th>
                        <th className="p-4">Radius (m)</th>
                        <th className="p-4">Active Traffic</th>
                        <th className="p-4">Incidents Recorded</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zones.map((zone) => (
                        <tr key={zone.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                          <td className="p-4 font-semibold text-slate-200">{zone.name}</td>
                          <td className="p-4">
                            <span className={`chip ${zone.type === 'Safe' ? 'chip-low' : 'chip-high'}`}>
                              {zone.type.toUpperCase()} ZONE
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-400">{zone.lat.toFixed(5)}, {zone.lng.toFixed(5)}</td>
                          <td className="p-4 text-slate-300 font-mono">{zone.radius}m</td>
                          <td className="p-4 text-slate-300">{zone.activeUsers} online</td>
                          <td className="p-4 text-slate-300 font-bold">{zone.incidents}</td>
                          <td className="p-4 text-center">
                            <button
                              className="btn btn-danger text-xs py-1 px-3"
                              onClick={() => handleDeleteZone(zone.id, zone.name)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 7. REPORTS & ANALYTICS VIEW */}
          {activeTab === "analytics" && (
            <div className="space-y-8 fade-up">
              <div>
                <h1 className="text-3xl font-extrabold">Reports & Incident Analytics</h1>
                <p className="text-slate-400 mt-1">Compile safety index records, chart daily growth rates, and download spreadsheets.</p>
              </div>

              {/* Chart trends custom representation */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Incident Trends CSS Chart */}
                <div className="panel p-6 space-y-6">
                  <h3 className="text-lg font-bold text-slate-200">Weekly Incident Trends (by Type)</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Harassment / Suspicious Gathering</span>
                        <span>42 incidents</span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: "80%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Physical Stalking / Escort deviation</span>
                        <span>24 incidents</span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: "45%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Critical Threat / Immediate Violence</span>
                        <span>9 incidents</span>
                      </div>
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-400" style={{ width: "18%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Download Reports Actions */}
                <div className="panel p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-200 mb-2">Export Data Ledger</h3>
                    <p className="text-slate-400 text-sm">Download aggregated incident scorecards, registration catalogs, and telemetry logs formatted for audits.</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 mt-6">
                    <button
                      className="btn btn-ghost text-sm py-3"
                      onClick={() => alert("Excel Safety Audit report compilation complete! Initializing download...")}
                    >
                      Download Excel Audit (.xlsx)
                    </button>
                    <button
                      className="btn btn-primary text-sm py-3"
                      onClick={() => alert("PDF Incident telemetry scorecard compiled successfully! Initializing download...")}
                    >
                      Download PDF Summary (.pdf)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. NOTIFICATION CENTER VIEW */}
          {activeTab === "notifications" && (
            <div className="space-y-6 fade-up">
              <div>
                <h1 className="text-3xl font-extrabold">Safety Notification Center</h1>
                <p className="text-slate-400 mt-1">Compose real-time alert broadcasts, send security announcements, and test push notification templates.</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Broadcast Composer */}
                <form onSubmit={handleSendNotification} className="panel p-6 lg:col-span-1 space-y-4">
                  <h3 className="text-lg font-bold text-slate-200">Compose Broadcast</h3>
                  
                  <div>
                    <label className="label">Category</label>
                    <select
                      className="field"
                      value={notificationForm.type}
                      onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})}
                    >
                      <option value="Global Announcement">Global Announcement</option>
                      <option value="Safety Announcement">Safety Announcement</option>
                      <option value="Emergency Broadcast">Emergency Broadcast</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Title</label>
                    <input
                      type="text"
                      className="field"
                      placeholder="e.g. System alert"
                      value={notificationForm.title}
                      onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Message Body</label>
                    <textarea
                      rows="4"
                      className="field"
                      placeholder="Type your safety announcement message here..."
                      value={notificationForm.body}
                      onChange={(e) => setNotificationForm({...notificationForm, body: e.target.value})}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full mt-4">Send Broadcast</button>
                </form>

                {/* Broadcast History */}
                <div className="panel p-6 lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-200">Notification Dispatch History</h3>
                  <div className="space-y-3">
                    {notificationHistory.map((notif) => (
                      <div key={notif.id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="chip chip-low text-[10px] py-0.5">{notif.type}</span>
                          <span className="text-slate-500 text-xs">{notif.date}</span>
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm">{notif.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{notif.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. CONTACT MANAGEMENT VIEW */}
          {activeTab === "contacts" && (
            <div className="space-y-6 fade-up">
              <div>
                <h1 className="text-3xl font-extrabold">Emergency Directory & Contact Management</h1>
                <p className="text-slate-400 mt-1">Configure global hotlines, manage emergency responder channels, and catalog support NGOs.</p>
              </div>

              {/* Add Contact Form */}
              <div className="panel p-6">
                <h3 className="text-lg font-bold text-slate-200 mb-4">Add Global Emergency contact</h3>
                <form onSubmit={handleAddHelpline} className="grid sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="label">Contact/Helpline Name</label>
                    <input
                      type="text"
                      className="field"
                      placeholder="e.g. Central NGO desk"
                      value={newHelplineForm.name}
                      onChange={(e) => setNewHelplineForm({...newHelplineForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Phone / Dispatch Number</label>
                    <input
                      type="text"
                      className="field font-mono"
                      placeholder="e.g. +91 44 ..."
                      value={newHelplineForm.number}
                      onChange={(e) => setNewHelplineForm({...newHelplineForm, number: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="label">Classification</label>
                      <select
                        className="field"
                        value={newHelplineForm.category}
                        onChange={(e) => setNewHelplineForm({...newHelplineForm, category: e.target.value})}
                      >
                        <option value="Helpline">Helpline</option>
                        <option value="Police">Police Station</option>
                        <option value="Hospital">Hospital ER</option>
                        <option value="NGO">NGO / Support Center</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary self-end" style={{height: "47px"}}>
                      <Plus width={18} height={18} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Contact Directory */}
              <div className="panel overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400">
                      <tr>
                        <th className="p-4">Contact Name</th>
                        <th className="p-4">Number</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {helplines.map((item) => (
                        <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                          <td className="p-4 font-semibold text-slate-200">{item.name}</td>
                          <td className="p-4 font-mono text-cyan-400">{item.number}</td>
                          <td className="p-4">
                            <span className={`chip ${item.category === 'Police' ? 'chip-high' : item.category === 'Hospital' ? 'chip-med' : 'chip-low'}`}>
                              {item.category.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              className="btn btn-danger text-xs py-1 px-3"
                              onClick={() => handleDeleteHelpline(item.id, item.name)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 10. FEEDBACK & COMPLAINTS VIEW */}
          {activeTab === "feedback" && (
            <div className="space-y-6 fade-up">
              <div>
                <h1 className="text-3xl font-extrabold">User Complaints & Feedback Portal</h1>
                <p className="text-slate-400 mt-1">Review feedback, record resolution comments, and trace grievance categories.</p>
              </div>

              {/* Complaints List */}
              <div className="panel overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Complaint Description</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Resolution Note / Reply</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((item) => (
                        <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                          <td className="p-4 text-slate-300 font-mono text-xs">{item.user}</td>
                          <td className="p-4 font-semibold text-slate-200">{item.category}</td>
                          <td className="p-4 text-slate-400 max-w-sm">{item.content}</td>
                          <td className="p-4">
                            <span className={`chip ${item.status === 'Resolved' ? 'chip-low' : item.status === 'In Progress' ? 'chip-med' : 'chip-high'}`}>
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300 text-xs italic">{item.reply || "No reply recorded yet."}</td>
                          <td className="p-4 text-center">
                            {item.status !== "Resolved" ? (
                              <button
                                className="btn btn-primary text-xs py-1.5 px-3"
                                onClick={() => {
                                  setReplyComplaintId(item.id)
                                  setReplyText("")
                                }}
                              >
                                Reply & Resolve
                              </button>
                            ) : (
                              <span className="text-emerald-400 text-xs font-bold">Closed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reply Modal */}
              {replyComplaintId && (
                <div className="fixed inset-0 bg-black/75 grid place-items-center z-50 p-4">
                  <form onSubmit={handleReplyComplaint} className="panel p-8 w-full max-w-md space-y-4 fade-up" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-xl font-bold text-cyan-300">Reply to Complaint</h2>
                    <p className="text-xs text-slate-400">Record a resolution note to send back to the user account.</p>
                    
                    <div>
                      <label className="label">Resolution Reply Message</label>
                      <textarea
                        rows="4"
                        className="field text-sm"
                        placeholder="e.g. Local patrol dispatched to check the lights..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button type="submit" className="btn btn-primary flex-1">Send & Resolve</button>
                      <button type="button" className="btn btn-ghost flex-1" onClick={() => setReplyComplaintId(null)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* 11. AUDIT LOGS VIEW */}
          {activeTab === "audit" && (
            <div className="space-y-6 fade-up">
              <div>
                <h1 className="text-3xl font-extrabold">Security Audit Logs</h1>
                <p className="text-slate-400 mt-1">Audit administrative operations, monitor security transactions, and trace session access logs.</p>
              </div>

              {/* Log List */}
              <div className="panel overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400">
                      <tr>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Operator</th>
                        <th className="p-4">Action</th>
                        <th className="p-4">Details</th>
                        <th className="p-4 text-center">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="border-t border-white/5 hover:bg-white/[0.02] font-mono">
                          <td className="p-4 text-slate-500">{log.timestamp}</td>
                          <td className="p-4 text-slate-300 font-semibold">{log.user}</td>
                          <td className="p-4 text-cyan-300">{log.action}</td>
                          <td className="p-4 text-slate-400">{log.details}</td>
                          <td className="p-4 text-center">
                            <span className={`chip ${log.type === 'Security' ? 'chip-high' : log.type === 'Admin' ? 'chip-med' : 'chip-low'} text-[10px]`}>
                              {log.type.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl border pointer-events-auto shadow-2xl flex items-center justify-between gap-3 animate-slide-in ${
              toast.type === "danger"
                ? "bg-rose-500/20 border-rose-500/40 text-rose-200"
                : "bg-cyan-500/20 border-cyan-500/40 text-cyan-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={toast.type === "danger" ? "text-rose-400 animate-pulse" : "text-cyan-400"}>
                <Siren width={20} height={20} />
              </span>
              <p className="text-sm font-semibold">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
