import { useState } from "react"
import { GoogleMap, Marker } from "@react-google-maps/api"
import { getUser } from "../../lib/auth"
import { useMaps, DEFAULT_CENTER, DARK_MAP } from "../../lib/useMaps"
import { getCurrentPosition } from "../../lib/geo"
import { submitReport } from "../../api/api"
import PageHeader from "../../components/PageHeader"
import { MapPin } from "../../components/Icons"

const TYPES = [
  "Harassment",
  "Stalking",
  "Theft / Snatching",
  "Suspicious Activity",
  "Poor Lighting",
  "Unsafe Area",
  "Other",
]

const SEVERITY = [
  { value: 1, label: "Low", cls: "chip-low" },
  { value: 2, label: "Medium", cls: "chip-med" },
  { value: 3, label: "High", cls: "chip-high" },
]

const mapStyle = { width: "100%", height: "100%" }

export default function ReportIncident() {
  const user = getUser()
  const { isLoaded } = useMaps()

  const [type, setType] = useState(TYPES[0])
  const [severity, setSeverity] = useState(2)
  const [description, setDescription] = useState("")
  const [pos, setPos] = useState(null)
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  function pick(e) {
    setPos({ lat: e.latLng.lat(), lng: e.latLng.lng() })
  }

  async function useMyLocation() {
    try {
      const p = await getCurrentPosition()
      const c = { lat: p.latitude, lng: p.longitude }
      setPos(c)
      setCenter(c)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!pos) {
      setError("Pick a location on the map or use your current location.")
      return
    }
    setSaving(true)
    try {
      await submitReport({
        user_email: user.email,
        report_type: type,
        severity: Number(severity),
        latitude: pos.lat,
        longitude: pos.lng,
        description: description.trim(),
      })
      setDone(true)
      setDescription("")
      setPos(null)
    } catch (err) {
      setError(err.message || "Could not submit report.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Report an incident"
        subtitle="Help keep the community safe by flagging unsafe areas."
      />

      {done && (
        <div className="panel p-5 mb-6 border-emerald-500/40 bg-emerald-500/10 text-emerald-300 flex items-center justify-between fade-up">
          <span>Report submitted. Thank you for keeping others safe.</span>
          <button
            className="btn btn-ghost"
            onClick={() => setDone(false)}
          >
            Report another
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-6">
        {/* Details */}
        <div className="panel p-6 space-y-5 fade-up">
          <div>
            <label className="label">Incident type</label>
            <select
              className="field"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Severity</label>
            <div className="flex gap-3">
              {SEVERITY.map((s) => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => setSeverity(s.value)}
                  className={`flex-1 py-3 rounded-xl font-bold border transition-colors ${
                    Number(severity) === s.value
                      ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-200"
                      : "border-white/10 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="field min-h-28 resize-y"
              placeholder="What happened? (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={useMyLocation}
            >
              <MapPin width={18} height={18} /> Use my location
            </button>
            <span className="text-slate-500 text-xs">
              {pos
                ? `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`
                : "No location selected"}
            </span>
          </div>

          {error && (
            <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button className="btn btn-primary w-full" disabled={saving}>
            {saving ? <span className="spinner" /> : "Submit report"}
          </button>
        </div>

        {/* Map */}
        <div className="panel overflow-hidden fade-up min-h-[360px]">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapStyle}
              center={center}
              zoom={13}
              onClick={pick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                styles: DARK_MAP,
              }}
            >
              {pos && <Marker position={pos} />}
            </GoogleMap>
          ) : (
            <div className="h-full min-h-[360px] grid place-items-center text-slate-500">
              Loading map…
            </div>
          )}
        </div>
      </form>
      <p className="text-slate-500 text-sm mt-3">
        Tip: click anywhere on the map to drop a pin at the incident location.
      </p>
    </div>
  )
}
