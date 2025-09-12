# Task Manager (Frontend · React + Vite)

A minimal task manager UI that talks to a Node/Express + MongoDB API.  
Register, log in, create tasks, toggle completion, and delete — all persisted in MongoDB Atlas.

- **Live Demo:** https://task-manager-calchang1994.netlify.app/
- **API (Render):** https://task-manager-api-g0uk.onrender.com

---

## ✨ Features
- Email/password **auth** (JWT)
- **Create / list / update / delete** tasks
- Optional **due dates**
- **Inline validation** (email format, password length, empty task titles)
- **Loading states** and friendly error messages
- Configurable API base via env var or in-app input

---

## 🧱 Tech Stack
- **React 18** + **Vite**
- Fetch API to call a **Node/Express** backend
- **JWT** stored in `localStorage`
- Styling with lightweight custom CSS (no framework)

---

## 🚀 Quick Start (Local Dev)

```bash
# from repo root
cd frontend-react
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

Set the API URL in one of two ways:

### Option A — .env (recommended)
Create `frontend-react/.env`:
```
VITE_API_BASE=https://task-manager-api-g0uk.onrender.com
```
Restart `npm run dev`.

### Option B — In-app input
Use the **API base** input (top card) → enter:
```
https://task-manager-api-g0uk.onrender.com
```
Click **Save API Base**.

---

## ✅ How to Use
1. **Register** with a new email and a 6+ char password  
2. **Login** → token is stored in `localStorage`  
3. **Add tasks**, **toggle done**, **delete**  
4. Check the backend logs on Render for `[REQ]`, `[LOGIN]`, `[TASKS]` entries

---

## 🔧 Environment Variables

| Name            | Where                 | Example                                         |
|-----------------|-----------------------|-------------------------------------------------|
| `VITE_API_BASE` | Netlify / local `.env`| `https://task-manager-api-g0uk.onrender.com`    |

If not set, the app falls back to `http://localhost:8080` and/or the value you save in the UI.

---

## 🏗️ Build

```bash
npm run build
```

Outputs to `dist/`. Use any static host (Netlify, Vercel, etc.).

---

## 🌐 Deploy on Netlify

**Settings (Netlify UI → Add new site → Import from Git):**
- **Base directory:** `frontend-react`
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment variable:**  
  `VITE_API_BASE = https://task-manager-api-g0uk.onrender.com`

**SPA redirect (avoid 404 on refresh):**  
Create `frontend-react/public/_redirects` with:
```
/*  /index.html  200
```

---

## 🔌 API Endpoints (used by the UI)

- `POST /api/auth/register` — `{ name, email, password }` → creates user
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`
- `GET /api/tasks` — (Bearer token) → `[ Task ]`
- `POST /api/tasks` — `{ title, dueDate? }` (Bearer token)
- `PATCH /api/tasks/:id` — `{ completed?, title?, dueDate? }` (Bearer token)
- `DELETE /api/tasks/:id` — (Bearer token)

**API health:** `GET /` → `{ ok: true, service: "Task Manager API" }`

---

## 🧪 Manual Test Checklist
- Register with valid/invalid inputs → see inline validation
- Login with wrong password → “Invalid credentials”
- Duplicate email → “Email already registered”
- Add empty task → disallowed with inline message
- Toggle & delete task → updates list immediately

---

## 📝 Notes
- Auth token is stored in `localStorage`; click **Logout** to clear.
- For production, keep `VITE_API_BASE` set in your host’s env vars.
- Backend source lives in `../backend` (separate README covers deployment).

---

## 📎 Links
- **Backend (Render):** https://task-manager-api-g0uk.onrender.com
- **Live Demo (Netlify):** https://task-manager-calchang1994.netlify.app/
