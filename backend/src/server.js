import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, service: 'Task Manager API' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
