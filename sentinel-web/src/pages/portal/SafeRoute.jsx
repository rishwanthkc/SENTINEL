import { useState, useCallback } from "react"
import {
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api"
import { useMaps, DEFAULT_CENTER, DARK_MAP } from "../../lib/useMaps"
import { getCurrentPosition } from "../../lib/geo"
import PageHeader from "../../components/PageHeader"
import { Route, MapPin } from "../../components/Icons"

const mapStyle = { width: "100%", height: "420px" }

export default function SafeRoute() {
  const { isLoaded, loadError } = useMaps()
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [directions, setDirections] = useState(null)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const useMyLocation = useCallback(async () => {
    try {
      const p = await getCurrentPosition()
      setOrigin(`${p.latitude}, ${p.longitude}`)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  async function plan(e) {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) return
    setError("")
    setLoading(true)
    setDirections(null)
    setInfo(null)
    try {
      const service = new window.google.maps.DirectionsService()
      const result = await service.route({
        origin: origin.trim(),
        destination: destination.trim(),
        travelMode: window.google.maps.TravelMode.WALKING,
      })
      setDirections(result)
      const leg = result.routes[0]?.legs[0]
      if (leg) {
        setInfo({
          distance: leg.distance?.text,
          duration: leg.duration?.text,
          start: leg.start_address,
          end: leg.end_address,
        })
      }
    } catch (err) {
      setError(
        err?.message ||
          "Could not find a route. Check the locations and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Safe route planner"
        subtitle="Plan a walking route and share it before you head out."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={plan} className="panel p-6 space-y-4 h-fit fade-up">
          <div>
            <label className="label">From</label>
            <input
              className="field"
              placeholder="Start location"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
            <button
              type="button"
              onClick={useMyLocation}
              className="text-cyan-300 text-sm font-semibold mt-2 inline-flex items-center gap-1"
            >
              <MapPin width={14} height={14} /> Use my location
            </button>
          </div>

          <div>
            <label className="label">To</label>
            <input
              className="field"
              placeholder="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <Route width={18} height={18} /> Find route
              </>
            )}
          </button>

          {info && (
            <div className="mt-2 panel p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Distance</span>
                <span className="font-bold text-cyan-300">{info.distance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">On foot</span>
                <span className="font-bold text-cyan-300">{info.duration}</span>
              </div>
              <div className="pt-2 border-t border-white/10 text-slate-400 text-xs">
                {info.start} → {info.end}
              </div>
            </div>
          )}
        </form>

        <div className="lg:col-span-2 panel overflow-hidden fade-up min-h-[420px] flex flex-col justify-center">
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
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                styles: DARK_MAP,
              }}
            >
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    polylineOptions: {
                      strokeColor: "#22d3ee",
                      strokeWeight: 6,
                      strokeOpacity: 0.9,
                    },
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="h-full min-h-[420px] grid place-items-center text-slate-500">
              Loading map…
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
