import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

console.log('🚀 Starting Task Manager API...');
const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`, req.headers['content-type'] || '', req.body || {});
  next();
});

app.get('/', (req, res) => res.json({ ok: true, service: 'Task Manager API' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Global error handler to ensure stack traces print
app.use((err, req, res, next) => {
  console.error('[ERR]', err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
