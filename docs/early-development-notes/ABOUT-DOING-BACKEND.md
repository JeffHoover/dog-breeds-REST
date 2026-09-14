__Historical development note__: _This document captures an earlier stage of the project and does not describe the current implementation. It is retained as a record of the project’s evolution. See the [main README](../../README.md) for the current architecture, behavior, and setup instructions._

Your AI-dog-breeds repo currently simulates user sessions using localStorage and dummy tokens in the client (see src/services/simulated-auth.ts and simulated-api.ts). This is suitable for prototyping, but not for real persistent sessions.

### How it works now
- On login, a "dummy" token is stored in localStorage.
- isAuthenticated() returns true if a token exists.
- logout() removes the token.
- There is no token expiry, refresh, or backend verification.
- No real backend API is used—everything is simulated in the frontend.

### How to implement real persistent user sessions

1. **Add a Backend Auth API**
   - Use Node.js/Express (or any backend) to handle authentication and manage sessions or JWT tokens.
   - On login/signup, the backend should issue a session cookie (httpOnly, secure) or a JWT.

2. **Frontend changes**
   - Replace the simulated-auth.ts logic with real API calls (e.g., via fetch or axios).
   - On successful login, the cookie/token from the backend will maintain the session.
   - Remove localStorage token logic, and rely on backend-issued tokens/cookies.

3. **Session Verification**
   - For each authenticated request, include the session cookie or token.
   - The backend checks validity and returns user data or errors as appropriate.

4. **Session Expiry & Logout**
   - The backend should set an expiry for the session/cookie.
   - On logout, the backend should clear the session, and the frontend should update UI accordingly.

#### Example: Express backend session code

```typescript
import express from 'express';
import session from 'express-session';

const app = express();

app.use(express.json());
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }
}));

app.post('/login', (req, res) => {
  // Validate credentials (from req.body)
  req.session.userId = user.id;
  res.send({ success: true });
});

app.get('/profile', (req, res) => {
  if (!req.session.userId) return res.status(401).send('Not authenticated');
  // Return user data
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.send({ success: true }));
});
```

#### What you’d change in your repo:
- Replace simulated-auth.ts API calls with real HTTP requests to your backend.
- Remove direct token storage in localStorage.
- Adjust your Auth components (Login, Signup) to handle API errors, session state, and redirect flows according to backend responses.

---

**Summary:** Your repo currently simulates sessions solely in the frontend (localStorage, dummy tokens). For real persistent sessions, you need a backend (Express or similar) to handle authentication, issue a real session/cookie/JWT, and validate it on each request. Update your frontend to communicate with this backend, and remove simulated session logic from the client.

Let me know if you want specific code for updating your frontend logic or want a detailed walkthrough for backend setup!
