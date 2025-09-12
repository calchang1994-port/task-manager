# Task Manager API (Backend · Node + Express + MongoDB)

A minimal REST API for a task manager, built with **Express**, **Mongoose**, and **JWT auth**.  
Pairs with the React frontend (`frontend-react/`).

- **Live API (Render):** https://task-manager-api-g0uk.onrender.com
- **Frontend (Netlify):** https://task-manager-calchang1994.netlify.app/

---

## ✨ Features
- User **registration** and **login** with hashed passwords (bcrypt)
- **JWT** authentication (Bearer token)
- CRUD for **Tasks** (title, completed, optional dueDate)
- Helpful request logging & error logs (for debugging in dev and on Render)
- CORS enabled

---

## 🗂️ Project Structure
```
backend/
  package.json
  .env.example
  src/
    server.js       # express app + routes + error handler
    db.js           # mongoose connection
    routes/
      auth.js       # /api/auth/register, /api/auth/login
      tasks.js      # /api/tasks CRUD (auth required)
    models/
      User.js       # name, email(unique), passwordHash
      Task.js       # userId, title, completed, dueDate
    middleware/
      auth.js       # JWT verification
```

---

## ⚙️ Local Setup

### 1) Install and run
```bash
cd backend
npm install
cp .env.example .env   # Windows: copy .env.example .env
# Fill in your Atlas values in .env (see below)
npm run dev
```
You should see:
```
🚀 Starting Task Manager API...
API listening on port 8080
MongoDB connected
```

### 2) Environment variables (`.env`)
```
MONGODB_URI=mongodb+srv://<USER>:<ENCODED_PASS>@<CLUSTER>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=task_manager
JWT_SECRET=some-long-random-string
PORT=8080
```
> ⚠️ If your password has special characters (`@ : / # ? & %`), URL‑encode them:  
> `@`→`%40`, `#`→`%23`, `/`→`%2F`, `:`→`%3A`, `?`→`%3F`, `&`→`%26`, `%`→`%25`

### 3) Quick health check (local)
```bash
curl -i http://localhost:8080/
# => { "ok": true, "service": "Task Manager API" }
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` → `{ name, email, password }` → `201 { id, name, email }`
- `POST /api/auth/login` → `{ email, password }` → `200 { token, user }`

### Tasks (require `Authorization: Bearer <token>`)
- `GET /api/tasks` → `200 [ Task ]`
- `POST /api/tasks` → body `{ title, dueDate? }` → `201 Task`
- `PATCH /api/tasks/:id` → body `{ title?, completed?, dueDate? }` → `200 Task`
- `DELETE /api/tasks/:id` → `200 { ok: true }`

**Health:** `GET /` → `{ ok: true, service: "Task Manager API" }`

---

## 🧪 Curl Tests (cloud URL)

Replace emails/tokens as needed. Uses your Render URL:

```bash
# Health
curl -i https://task-manager-api-g0uk.onrender.com/

# Register (use fresh email)
curl -i -X POST https://task-manager-api-g0uk.onrender.com/api/auth/register   -H "Content-Type: application/json"   -d '{"name":"Calvin","email":"cloud_readme1@test.com","password":"pass123"}'

# Login
curl -i -X POST https://task-manager-api-g0uk.onrender.com/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"cloud_readme1@test.com","password":"pass123"}'
# copy the "token" from the response

# List tasks
curl -i https://task-manager-api-g0uk.onrender.com/api/tasks   -H "Authorization: Bearer <TOKEN>"

# Create task
curl -i -X POST https://task-manager-api-g0uk.onrender.com/api/tasks   -H "Authorization: Bearer <TOKEN>"   -H "Content-Type: application/json"   -d '{"title":"Finish Week 2 setup"}'

# Update task (replace <ID>)
curl -i -X PATCH https://task-manager-api-g0uk.onrender.com/api/tasks/<ID>   -H "Authorization: Bearer <TOKEN>"   -H "Content-Type: application/json"   -d '{"completed": true}'
```

**Windows CMD tip:** quoting can break JSON. Put bodies in files and use `-d @file.json`.

---

## ☁️ Deploy to Render

1) **Push to GitHub**.
2) Render → **New** → **Web Service** → import repo.
3) **Build Command**  
   `cd backend && npm install`
4) **Start Command**  
   `cd backend && node src/server.js`
5) **Environment Variables** (Render → Environment)
   - `MONGODB_URI` – Atlas SRV string (password URL‑encoded)
   - `MONGODB_DB` – `task_manager`
   - `JWT_SECRET` – long random string
   - `PORT` – `8080`
6) Deploy → Logs should show:
```
🚀 Starting Task Manager API...
API listening on port 8080
MongoDB connected
```

---

## 🧰 Troubleshooting

- **MongoServerError: auth required**  
  - Atlas → Database Access: ensure the user exists with **Atlas Admin** (dev) or **readWrite** on `task_manager`  
  - Atlas → Network Access: allow your IP or `0.0.0.0/0` for dev  
  - Make sure `MONGODB_URI` has **username + URL‑encoded password**

- **MongoParseError / querySrv EBADNAME**  
  - Re-copy the SRV URI from Atlas (**Connect → Drivers → Node.js**)  
  - If needed, use the **Standard (mongodb:// seed list)** string

- **500 Server error on register/login**  
  - Check Render **Logs**: look for `[REGISTER_ERROR]` / `[LOGIN_ERROR]` / `[ERR]`  
  - Verify `Content-Type: application/json` and valid JSON body

- **CORS in production**  
  - Default `cors()` allows all origins; to restrict later:
    ```js
    import cors from 'cors';
    app.use(cors({ origin: ['https://task-manager-calchang1994.netlify.app'] }));
    ```

- **Port issues on Render**  
  - Ensure server listens on `process.env.PORT` (already handled in `server.js`).

---

## 🔒 Notes
- Passwords are hashed with **bcrypt** before storage.
- JWTs expire in **7 days** (see `routes/auth.js`).

---

## 📎 Links
- **Frontend (Netlify):** https://task-manager-calchang1994.netlify.app/
- **API (Render):** https://task-manager-api-g0uk.onrender.com
