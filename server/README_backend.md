# Simple backend to avoid exposing full local user data

This small Express server returns masked user details by default so that when you share a local URL you don't expose full personal information. It is intentionally minimal and intended for development only.

Files added
- `index.js` - Express server that serves `/api/user`, `/api/login`, and `/health`.
- `.env.example` - Example environment variables.

Behavior
- GET `/api/user` - returns masked user info by default. If you send `x-owner-secret` header or `?secret=...` query with the correct `OWNER_SECRET`, the full user object is returned.
- POST `/api/login` - development-only login: send `{ username: 'owner', password: 'password' }` to receive the owner secret token.

Run locally

1. Install dependencies (from project root or from `server` folder):

```powershell
cd "c:\Users\Rushdeen.White\Downloads\A&R Mood Sync\server"
npm init -y
npm i express cors dotenv
```

2. Create an `.env` file (copy `.env.example`) and set a strong `OWNER_SECRET`.

3. Start the server:

```powershell
node index.js
```

The server will listen on the port configured in `.env` (default 4000). Use the `x-owner-secret` header on requests to see unmasked data.

Security
- This is a development helper only. Do not use `POST /api/login` or the plain `OWNER_SECRET` pattern in production. Replace with real authentication and proper storage for secrets when moving to production.
