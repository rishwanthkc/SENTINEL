import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getUser } from "../../lib/auth"
import { getCurrentPosition } from "../../lib/geo"
import { triggerEmergency, getContacts } from "../../api/api"
import PageHeader from "../../components/PageHeader"
import { Users, Flag, Route, MapPin, Siren } from "../../components/Icons"

const QUICK = [
  {
    to: "/portal/contacts",
    label: "Trusted Contacts",
    desc: "Manage who gets alerted",
    icon: Users,
    color: "text-cyan-300",
  },
  {
    to: "/portal/report",
    label: "Report Incident",
    desc: "Flag an unsafe area",
    icon: Flag,
    color: "text-amber-300",
  },
  {
    to: "/portal/route",
    label: "Safe Route",
    desc: "Plan a safer journey",
    icon: Route,
    color: "text-emerald-300",
  },
]

export default function Home() {
  const user = getUser()
  const [status, setStatus] = useState("idle") // idle | locating | sending | sent | error
  const [message, setMessage] = useState("")
  const [coords, setCoords] = useState(null)
  const [contactCount, setContactCount] = useState(null)

  useEffect(() => {
    if (!user?.email) return
    getContacts(user.email)
      .then((c) => setContactCount(Array.isArray(c) ? c.length : 0))
      .catch(() => setContactCount(0))
  }, [user?.email])

  async function handleSos() {
    if (status === "locating" || status === "sending") return
    setMessage("")
    setStatus("locating")
    try {
      const pos = await getCurrentPosition()
      setCoords(pos)
      setStatus("sending")
      await triggerEmergency({
        user_email: user.email,
        latitude: pos.latitude,
        longitude: pos.longitude,
      })
      setStatus("sent")
      setMessage(
        "Emergency triggered. Your live location was sent to the command center."
      )
    } catch (err) {
      setStatus("error")
      setMessage(err.message || "Could not send SOS. Please try again.")
    }
  }

  const sending = status === "locating" || status === "sending"

  return (
    <div>
      <PageHeader
        title={
          <>
            Hi, {user?.display_name?.split(" ")[0] || "there"}{" "}
            <span className="text-slate-500 font-bold">·</span>{" "}
            <span className="brand-mark">you're protected</span>
          </>
        }
        subtitle="Press and hold nothing — one tap on the SOS sends help your way."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SOS panel */}
        <div className="lg:col-span-2 panel p-8 flex flex-col items-center justify-center text-center fade-up">
          <p className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-8">
            Emergency SOS
          </p>

          <button
            onClick={handleSos}
            disabled={sending}
            className={`relative w-56 h-56 rounded-full grid place-items-center font-extrabold text-2xl text-white transition-transform active:scale-95 ${
              status === "sent" ? "" : "sos-pulse"
            }`}
            style={{
              background:
                status === "sent"
                  ? "radial-gradient(circle at 50% 35%, #34d399, #047857)"
                  : "radial-gradient(circle at 50% 35%, #fb7185, #be123c)",
            }}
          >
            <span className="flex flex-col items-center gap-2">
              <Siren width={44} height={44} />
              {sending
                ? status === "locating"
                  ? "LOCATING…"
                  : "SENDING…"
                : status === "sent"
                ? "SENT"
                : "SOS"}
            </span>
          </button>

          {message && (
            <div
              className={`mt-8 max-w-md px-5 py-3 rounded-xl text-sm border ${
                status === "error"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              }`}
            >
              {message}
            </div>
          )}

          {coords && (
            <p className="mt-4 text-slate-500 text-xs flex items-center gap-1">
              <MapPin width={14} height={14} />
              {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </p>
          )}
        </div>

        {/* Side status */}
        <div className="space-y-6">
          <div className="panel p-6 fade-up">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
              Trusted contacts
            </p>
            <p className="text-5xl font-extrabold text-cyan-300 mt-3">
              {contactCount === null ? "—" : contactCount}
            </p>
            <Link
              to="/portal/contacts"
              className="text-cyan-300 text-sm font-semibold mt-3 inline-block"
            >
              {contactCount ? "Manage contacts →" : "Add your first contact →"}
            </Link>
          </div>

          <div className="panel p-6 fade-up">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">
              How SOS works
            </p>
            <ul className="text-sm text-slate-300 space-y-2 mt-3">
              <li>1. Tap the SOS button.</li>
              <li>2. We capture your live GPS location.</li>
              <li>3. The command center is alerted instantly.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="text-xl font-bold mt-12 mb-5">Quick actions</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {QUICK.map(({ to, label, desc, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="panel panel-hover p-6 fade-up block"
          >
            <span className={color}>
              <Icon width={28} height={28} />
            </span>
            <h3 className="text-lg font-bold mt-4">{label}</h3>
            <p className="text-slate-400 text-sm mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
