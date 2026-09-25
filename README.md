# Art a Day

A local-only TypeScript application that selects a landscape artwork from The Metropolitan Museum of Art Collection API and presents a short description from the artwork's supplied metadata.

## Structure

- `backend/` contains the Node.js and Express API.
- `frontend/` contains the React and Vite interface.

## Local setup

1. Install a current LTS version of Node.js.
2. Install workspace dependencies with `npm install`.
3. Copy `.env.example` to `.env`.
4. Review the local backend port in `.env`. Keep `.env` untracked.
5. Start the backend with `npm run dev:backend`.
6. Set `VITE_API_BASE_URL` to the local backend base URL if the frontend is not served through a same-origin proxy.
7. Start the frontend in a second terminal with `npm run dev:frontend`.

The backend binds to the configured local host. It exposes `/health` and `/api/artwork`. Each artwork request selects a new eligible landscape and builds its description from the metadata returned by The Met.

## Validation

Run `npm run typecheck` and `npm run build` from the repository root. The backend can also be checked independently with `npm --workspace backend run typecheck`; the frontend with `npm --workspace frontend run build`.
