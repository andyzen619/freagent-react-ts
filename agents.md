# Agent Guide for Freagent

This document provides context, architectural details, and guidelines for AI agents working on the `freagent` repository.

## 1. Project Overview

**Freagent** is a full-stack application designed to interact with the Yahoo Fantasy Sports API. It consists of a modern React-based frontend and a Node.js/Express backend that handles OAuth authentication and data synchronization with a PostgreSQL database.

## 2. Technology Stack

### Frontend (`/ui`)

- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (with `clsx` and `tailwind-merge` for class management)
- **Routing:** TanStack Router (`@tanstack/react-router`)
- **Icons:** Lucide React
- **HTTP Client:** Native `fetch` (verified in `oauth_callback.tsx`)

### Backend (`/server`)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript (executed via `ts-node`)
- **Database:** PostgreSQL (`pg` driver)
- **API Integration:** Custom Yahoo API wrapper (handling XML parsing via `fast-xml-parser`)
- **Architecture:** Separation of concerns with dedicated `business`, `middleware`, and `lib` directories.

## 3. Directory Structure

```text
/
├── ui/                     # Frontend Application
│   ├── routes/             # TanStack Router route definitions
│   ├── hooks/              # Custom React hooks (e.g., useAuthState)
│   ├── components/         # Reusable UI components
│   ├── lib/                # Frontend utilities
│   ├── config.ts           # Frontend configuration (API URLs, keys)
│   └── vite.config.ts      # Vite configuration
│
├── server/                 # Backend Application
│   ├── server.ts           # Entry point (Express app setup)
│   ├── database.ts         # Database connection initialization
│   ├── business/           # Core business logic (e.g., dataSynchronization)
│   ├── lib/                # Shared libraries (Yahoo API wrapper, utils)
│   └── middleware/         # Express middleware (logging, auth)
│
└── package.json            # Root configuration (workspaces or script orchestration)
```

## 4. Key Workflows

### Authentication (OAuth 2.0)

The application implements a custom OAuth flow with Yahoo:

1. **Frontend:** Initiates auth request via `ConfigYahoo.REQUEST_TOKEN_URL`.
2. **Redirect:** Yahoo redirects to `/oauth_callback` with a code.
3. **Exchange:** Frontend sends code to Backend (`/get_token`).
4. **Backend:** Exchanges code for `access_token` using `client_id` and `client_secret` via Yahoo's token endpoint.
5. **Persistence:** Token is stored in `sessionStorage` (frontend) and used for subsequent requests.

### Data Synchronization

- **Endpoint:** `POST /players/sync`
- **Process:**
  1. Validates `AuthorizationToken` from headers.
  2. Fetches player data from Yahoo API.
  3. Passes data to `dataSynchronization` business logic to update the PostgreSQL database.

## 5. Development Guidelines

### Running the Project

1. **Backend:**

    ```bash
    cd server
    npm run dev  # Runs with --watch using ts-node
    ```

    _Server runs on `http://localhost:3000`_

2. **Frontend:**

    ```bash
    npm run dev  # Starts Vite development server
    ```

### Coding Conventions

- **TypeScript:** Strict typing is enforced. Avoid `any` where possible.
- **Imports:** Use absolute paths or aliases where configured (e.g., `@/components` in UI).
- **Styling:** Use Tailwind utility classes. For conditional classes, strictly use the `cn(...)` pattern (clsx + tailwind-merge).
- **State Management:** Use local state and custom hooks (like `useAuthState`) for module-specific state.
- **Backend Architecture:** Keep route handlers thin. Delegate complex logic to `business/` modules.

## 6. Common Tasks for Agents

- **Adding Routes:** Create new files in `ui/routes/` following TanStack Router file-based routing conventions.
- **Database Schema:** Check `server/database.ts` or migration files (if present) before querying.
- **API Changes:** When modifying backend endpoints, ensure `ui/types` are updated to reflect the new response shapes.
