# SENTINEL — Web App

Web version of the SENTINEL women-safety Android app. Built with **React 19 +
Vite + Tailwind CSS v4**, talking to the existing **FastAPI** backend
(`../sentinel-backend`).

It ships two experiences from one codebase:

- **User portal** (`/portal`) — the full safety app: one-tap **SOS**, **trusted
  contacts**, **incident reporting** with a map picker, a **safe-route**
  planner, **emergency history**, and a **profile**.
- **Command Center** (`/dashboard`) — the admin/operator dashboard with live
  SOS alerts, stats, dangerous-zone hotspots, a live emergency map, an incident
  heatmap, and reports/users tables. Refreshes every 5s.

Routing sends users to the right place after login based on their `role`
(`ADMIN` → dashboard, otherwise → portal).

## Prerequisites

- Node.js 18+
- The SENTINEL backend running (see `../sentinel-backend`)

## Configuration

Environment variables live in `.env`:

```
VITE_GOOGLE_MAPS_API_KEY=<your Google Maps JS API key>
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Point `VITE_API_BASE_URL` at wherever the FastAPI backend is reachable
(e.g. `http://localhost:8000` or a LAN IP like `http://192.168.x.x:8000`).

## Run

```bash
npm install
npm run dev      # start the dev server (default http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## Backend it talks to

| Feature            | Endpoint                          |
|--------------------|-----------------------------------|
| Register           | `POST /auth/register`             |
| Login              | `POST /auth/login`                |
| Trigger SOS        | `POST /emergency/trigger`         |
| Emergency history  | `GET  /emergency/history/{email}` |
| Add contact        | `POST /contacts/add`              |
| List contacts      | `GET  /contacts/{email}`          |
| Submit report      | `POST /reports/submit`            |
| Dashboard stats    | `GET  /dashboard/stats`           |
| Active emergencies | `GET  /emergency/active`          |
| Dashboard data     | `GET  /dashboard/{reports,users,hotspots}` |
| Resolve emergency  | `POST /dashboard/resolve/{id}`    |

## Project structure

```
src/
  api/api.js              # all backend calls (base URL from VITE_API_BASE_URL)
  lib/                    # auth (localStorage), geolocation, Google Maps loader
  components/             # Icons, AuthShell, PortalLayout, ProtectedRoute, ...
  pages/
    Login.jsx Register.jsx
    portal/               # Home (SOS), Contacts, ReportIncident, SafeRoute,
                          # History, Profile
  App.jsx                 # admin Command Center dashboard
  main.jsx                # routes
```

## Notes

- Auth is email-based (matching the backend); registration generates a
  `firebase_uid` for the web client automatically.
- Maps use the Google Maps JavaScript API; the route planner uses the
  Directions service and the report form lets you drop a pin or use your
  current location.
