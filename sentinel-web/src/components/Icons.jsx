// Minimal inline SVG icon set (stroke-based, currentColor).
const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
}

export const Shield = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
    <path d="M9.5 12l1.8 1.8L15 10" />
  </svg>
)

export const Siren = (p) => (
  <svg {...base} {...p}>
    <path d="M7 18v-4a5 5 0 0 1 10 0v4" />
    <path d="M5 18h14" />
    <path d="M4 22h16" />
    <path d="M12 3v2M19 6l-1.5 1.5M5 6l1.5 1.5" />
  </svg>
)

export const Users = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 6.2a3 3 0 0 1 0 5.6" />
    <path d="M18 14.5a5 5 0 0 1 2.5 4.5" />
  </svg>
)

export const Flag = (p) => (
  <svg {...base} {...p}>
    <path d="M5 21V4" />
    <path d="M5 4h11l-1.5 3L16 10H5" />
  </svg>
)

export const Route = (p) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="19" r="2.2" />
    <circle cx="18" cy="5" r="2.2" />
    <path d="M8 19h6a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h6" />
  </svg>
)

export const Clock = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const User = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  </svg>
)

export const Logout = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
    <path d="M17 16l4-4-4-4" />
    <path d="M21 12H9" />
  </svg>
)

export const Grid = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
)

export const MapPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
)

export const Phone = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L19 12l3 1.5V17a2 2 0 0 1-2 2A15 15 0 0 1 5 6a2 2 0 0 1 0-2z" />
  </svg>
)

export const Plus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Alert = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3l9 16H3z" />
    <path d="M12 9v4M12 16.5v.5" />
  </svg>
)

export const Menu = (p) => (
  <svg {...base} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)
