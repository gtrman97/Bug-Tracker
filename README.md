# Bug Tracker — Frontend

A React + Vite single-page application for tracking bugs and issues across software projects. This is the frontend half of a full-stack bug tracker; it talks to a companion [Express/PostgreSQL API](https://github.com/gtrman97/bug-tracker-back-end) for authentication and data.

## Overview

Bug Tracker is a lightweight, Jira-style issue tracker. Users can belong to multiple projects, hold different roles on each one (Admin, Manager, Developer, Submitter), and manage tickets scoped to those projects. It's built as a portfolio project with an emphasis on getting the fundamentals — authentication, authorization, and API integration — right rather than maximizing feature count.

## Tech Stack

- **React 18** — component-based UI
- **Vite** — dev server and build tooling
- **React Router v6** — client-side routing and route protection
- **Recharts** — dashboard data visualization
- **React Context API** — auth/session state (no external state library)
- **CSS Modules** — scoped component styling

## Features

- Email/password registration and sign-in against a real backend (JWT-based auth, no third-party auth provider)
- Persistent sessions: JWT stored client-side and validated against the API on page refresh
- Protected routing — authenticated-only views redirect unauthenticated users to sign-in
- Per-project role assignment (Admin / Manager / Developer / Submitter)
- Dashboard, project list, ticket list, role assignment, and notification views

> **Current status:** Authentication is fully wired to the live backend and verified end-to-end. The Dashboard, My Projects, My Tickets, and Role Assignment views are still running on mock data while the corresponding API integrations are built out — see [Roadmap](#roadmap).

## Project Structure

```
src/
├── api/
│   └── client.js              # Centralized fetch wrapper (auth headers, base URL, error handling)
├── context/
│   └── AuthContext.jsx        # JWT persistence + session restoration via /auth/me
├── components/
│   ├── SignIn/                # Sign-in form
│   ├── SignUp/                # Sign-up form
│   ├── ForgotPassword/
│   ├── ProtectedRoute.jsx     # Route-level auth gating
│   └── DemoSignIn/
│       ├── HomePage/          # Authenticated app shell (nav + layout)
│       ├── Dashboard/
│       ├── MyProjects/
│       ├── MyTickets/
│       ├── RoleAssignment/
│       ├── Notifications/
│       └── MySettings/
├── App.jsx                    # Route definitions
└── main.jsx                   # App entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the [backend API](https://github.com/gtrman97/bug-tracker-back-end)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/gtrman97/Bug-Tracker.git
   cd Bug-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables — copy `.env.example` to `.env` and point it at your running backend:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

   The app runs on Vite's default port (`5173`) and expects the backend to be running and reachable at `VITE_API_BASE_URL`, with its `FRONTEND_ORIGIN` configured to match.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build a production bundle to `dist/` |
| `npm run preview` | Serve the production build locally |

## Architecture Notes

**Auth token handling.** The JWT is passed via an `Authorization: Bearer` header rather than a cookie, since the frontend and backend are deployed on different origins (Netlify + a separate API host) and cross-domain cookies add complexity this project doesn't need yet. `AuthContext` persists the token and re-validates it against `/auth/me` on every page load, so a refresh doesn't silently log the user out.

**Route protection.** `ProtectedRoute` wraps the authenticated section of the route tree in `App.jsx`, so new authenticated views only need to be added under that one route rather than individually guarded.

**Why no Redux/Zustand.** Session state is the only cross-cutting state so far, and Context handles that cleanly. This will be revisited if/when more complex cross-component state emerges during the data-wiring phase.

## Roadmap

- [ ] Replace mock data in Dashboard, My Projects, My Tickets, and Role Assignment with real API calls, including loading and error states
- [ ] Build create/edit/delete flows through the UI (currently only exercised via the API directly)
- [ ] Gate UI elements by per-project role (e.g., hide "Manage Role Assignment" from non-admins)
- [ ] Automated component tests (React Testing Library), starting with the auth flow
- [ ] Deploy to Netlify and verify CORS/env alignment against the deployed backend

## Related Repository

- **Backend API:** [gtrman97/bug-tracker-back-end](https://github.com/gtrman97/bug-tracker-back-end) — Express, Sequelize, PostgreSQL, JWT auth with per-project role-based authorization
