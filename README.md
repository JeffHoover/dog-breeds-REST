# dog-breeds-REST

`dog-breeds-REST` is a deliberately small full-stack learning prototype. The dog-breed discussion domain is intentionally narrow so the project can focus on application structure, client-side routing, REST boundaries, a mock authentication flow, and tests.

The repository began as `AI-dog-breeds`, with a frontend created using Create React App (CRA). The project then gained a Node.js/Express backend, after which the frontend was migrated from CRA to Vite. The repository was later renamed to reflect its REST focus. It does not integrate an AI model.

## Architecture

- The [frontend](./src/) is a TypeScript and React 19 application built with Vite. React Router handles browser navigation, and Vitest with React Testing Library covers components and routes.
- The [backend](./dog-breeds-backend/) is a JavaScript Node.js/Express 5 API. It serves topics, messages, and mock authentication responses from in-memory data.
- During local development, the Vite server runs at `http://localhost:5173` and proxies requests beginning with `/api` to the backend at `http://localhost:5000`.

The frontend and backend are separate Node.js projects. Each directory has its own `package.json` and dependencies.

## Start the complete application

Prerequisites: Node.js and npm.

Install and start the backend in one terminal:

```bash
cd dog-breeds-backend
npm install
node index.js
```

The backend prints:

```text
API running on http://localhost:5000
```

In a second terminal, return to the repository root and start the frontend:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in a browser. The root route redirects to the login page when no mock token is stored. The backend currently accepts any email and password and returns a dummy token, so no account setup is required to explore the prototype.

Keep both terminal processes running. The frontend needs the backend for topics and authentication requests.

## Frontend scripts

Run these commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm start` | Start the same Vite development server using the `start` alias. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm test` | Run the Vitest test suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run typecheck` | Check TypeScript without emitting files. |

The backend does not currently define a `start` script or an automated test suite. Run it from `dog-breeds-backend/` with `node index.js`. Its placeholder `npm test` script exits with an error.

## Browser routes

| Route | Current behavior |
| --- | --- |
| `/` | Redirects to `/home` when a token exists in local storage; otherwise redirects to `/login`. |
| `/home` | Displays the post-login dashboard. |
| `/login` | Sends credentials to the mock login API and stores the returned dummy token. |
| `/signup` | Sends signup details to the mock signup API. |
| `/topics` | Fetches and displays topics from the backend. |
| `/topics/:id` | Currently renders a placeholder topic detail view; backend message loading and posting are not yet connected to this screen. |
| Any other path | Displays the not-found page. |

## API routes

The backend accepts JSON requests at `http://localhost:5000`. When the frontend is running through Vite, it calls the same routes with the relative `/api` prefix and relies on the development proxy.

| Method | Route | Request body | Response |
| --- | --- | --- | --- |
| `GET` | `/api/topics` | None | All in-memory topics. |
| `GET` | `/api/topics/:id/messages` | None | Messages whose `topicId` matches `:id`. |
| `POST` | `/api/topics/:id/messages` | `{ "text": "..." }` | The newly created message with a generated ID and HTTP status `201`. |
| `POST` | `/api/auth/signup` | `{ "email": "...", "password": "..." }` | `{ "success": true }`. The user is not persisted. |
| `POST` | `/api/auth/login` | `{ "email": "...", "password": "..." }` | `{ "token": "dummy-token" }`. Credentials are not validated. |

The frontend includes an `Authorization` header on topic and message requests when a token exists, but the backend does not currently validate or enforce it.

## Post a message

With the backend running, add a message to topic `1`:

```bash
curl --request POST http://localhost:5000/api/topics/1/messages \
  --header "Content-Type: application/json" \
  --data '{"text":"Labradors are wonderful family dogs."}'
```

The response has this shape; the generated `id` will vary:

```json
{
  "id": "generated-id",
  "topicId": "1",
  "text": "Labradors are wonderful family dogs."
}
```

Retrieve the topic's messages, including the newly posted one:

```bash
curl http://localhost:5000/api/topics/1/messages
```

## API URL configuration

No environment variable is needed for the default two-terminal development setup because Vite proxies `/api` to port `5000`.

To call the backend directly instead, create a `.env.local` file in the repository root:

```dotenv
VITE_API_URL=http://localhost:5000
```

The frontend appends `/api/...` to that base URL.

## Current limitations

- Topics and messages are stored in memory and reset whenever the backend restarts.
- Signup and login are mock flows; there is no user database, password hashing, token validation, expiry, or authorization enforcement.
- The backend does not validate message text or verify that a topic exists before creating a message.
- Backend message retrieval and posting are implemented in the API client but are not yet connected to the topic-detail screen.
- The backend has no automated test suite.
- The project has no production deployment configuration.

Earlier planning and review documents are retained in [docs/early-development-notes](./docs/early-development-notes/) as a record of the project's evolution. They do not describe the current implementation.
