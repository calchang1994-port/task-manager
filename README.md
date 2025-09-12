# Task Manager — React + Node (with logging)

This project contains:
- **backend/** Node + Express + MongoDB + JWT (with request logging + error logs)
- **frontend-react/** React (Vite) app that consumes the API

## Quickstart
1) Backend
```bash
cd backend
npm i
cp .env.example .env   # set MONGODB_URI & JWT_SECRET
npm run dev
```
2) Frontend
```bash
cd ../frontend-react
npm i
npm run dev
```
Open the printed localhost URL. In the UI, set the API base (e.g., http://localhost:8080) and click **Save API Base**.
