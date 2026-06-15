import { useEffect, useState } from "react"
import { getUser } from "../../lib/auth"
import { getEmergencyHistory } from "../../api/api"
import PageHeader from "../../components/PageHeader"
import { Clock, MapPin } from "../../components/Icons"

function StatusChip({ status }) {
  const active = (status || "").toUpperCase() === "ACTIVE"
  return (
    <span className={`chip ${active ? "chip-high" : "chip-low"}`}>
      {active ? "ACTIVE" : "RESOLVED"}
    </span>
  )
}

export default function History() {
  const user = getUser()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmergencyHistory(user.email)
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <PageHeader
        title="Emergency history"
        subtitle="A timeline of every SOS you've triggered."
      />

      {loading ? (
        <div className="panel p-10 text-center text-slate-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="panel p-12 text-center fade-up">
          <span className="text-slate-600 inline-flex">
            <Clock width={48} height={48} />
          </span>
          <p className="mt-4 text-slate-300 font-semibold">No SOS history</p>
          <p className="text-slate-500 text-sm mt-1">
            You haven't triggered any emergencies. Stay safe.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="panel panel-hover p-5 flex items-center gap-4 fade-up"
            >
              <div className="w-11 h-11 rounded-full bg-rose-500/15 text-rose-300 grid place-items-center shrink-0">
                <Clock width={22} height={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold">SOS triggered</span>
                  <StatusChip status={it.status} />
                </div>
                <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                  <MapPin width={14} height={14} />
                  {Number(it.latitude).toFixed(5)},{" "}
                  {Number(it.longitude).toFixed(5)}
                </p>
              </div>
              <div className="text-slate-500 text-sm text-right shrink-0">
                {it.created_at ? String(it.created_at) : "—"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
