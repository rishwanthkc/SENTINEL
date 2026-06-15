import { useJsApiLoader } from "@react-google-maps/api"

// Single shared Google Maps loader so the script is injected only once.
const ID = "sentinel-google-maps"

export function useMaps() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: ID,
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  })
  return { isLoaded, loadError }
}

export const DEFAULT_CENTER = { lat: 13.0827, lng: 80.2707 } // Chennai

// Dark map theme shared across all maps.
export const DARK_MAP = [
  { elementType: "geometry", stylers: [{ color: "#0a1830" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a1830" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8aa0bd" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#16304f" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#04284a" }],
  },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
]
