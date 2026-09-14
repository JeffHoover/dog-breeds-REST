__Historical development note__: _This document was an early plan for adding an Express backend. A backend was subsequently implemented, and these instructions may not match the current code. See the [main README](../../README.md) for current setup instructions._

Here are complete instructions to add a real Express backend for persistent user sessions to your AI-dog-breeds repo:

---

## 1. Set Up Your Backend Directory

Create a new directory at the root of your repo:
```bash
mkdir backend
cd backend
npm init -y
```

## 2. Install Dependencies

```bash
npm install express express-session cors dotenv
npm install @types/express @types/express-session ts-node typescript --save-dev
```

## 3. Create Your TypeScript Config

Create backend/tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

## 4. Create the Express Server

Create backend/src/server.ts:

```typescript
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// In production, use a store like Redis or MongoDB for sessions!
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    httpOnly: true,
    secure: false // set to true if using HTTPS
  }
}));

// Adjust the origin as needed for your frontend
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Dummy user database
const users: { [email: string]: { email: string; password: string } } = {};

// Signup route
app.post("/api/signup", (req, res) => {
  const { email, password } = req.body;
  if (users[email]) {
    return res.status(400).json({ message: "User already exists" });
  }
  users[email] = { email, password };
  res.json({ success: true });
});

// Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  (req.session as any).user = { email };
  res.json({ success: true, email });
});

// Auth check route
app.get("/api/me", (req, res) => {
  if (!(req.session as any).user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: (req.session as any).user });
});

// Logout route
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
```

## 5. Add a Start Script

Add to backend/package.json:
```json
"scripts": {
  "start": "ts-node src/server.ts"
}
```

## 6. Add a .env File

Create backend/.env:
```
SESSION_SECRET=your-secret-value
```

## 7. Run the Backend

```bash
npm start
```

---

## 8. Update Your Frontend

- Change your simulated-auth.ts to use fetch/axios to talk to /api/signup, /api/login, /api/logout, and /api/me on your backend.
- Use credentials: "include" in fetch so cookies are sent with requests.

Example login call:
```typescript
await fetch("http://localhost:4000/api/login", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```
Do the same for signup, logout, and auth checks.

---

## 9. Remove Simulated Auth

- Delete or refactor src/services/simulated-auth.ts and simulated-api.ts.
- Make sure the frontend checks authentication by calling the backend (e.g., /api/me).

---

## 10. (Optional) Use a Database

For production, replace the in-memory `users` object with a real database (MongoDB, PostgreSQL, etc).

---

## Summary

- The backend handles authentication, session storage, and issues cookies for persistent sessions.
- The frontend talks to the backend and no longer stores tokens in localStorage.
- All authentication and session logic is now secure and real.

Let me know if you want a full example of how to update your frontend to use this backend!
