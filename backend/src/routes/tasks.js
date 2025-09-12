import { Router } from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', async (req, res) => {
  console.log('[TASKS] list for user', req.user.id);
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  console.log('[TASKS] create', req.body);
  const { title, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const task = await Task.create({ userId: req.user.id, title, dueDate });
  res.status(201).json(task);
});

router.patch('/:id', async (req, res) => {
  console.log('[TASKS] update', req.params.id, req.body);
  const { id } = req.params;
  const { title, completed, dueDate } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    { $set: { ...(title!==undefined?{title}:{ }), ...(completed!==undefined?{completed}:{ }), ...(dueDate!==undefined?{dueDate}:{ }) } },
    { new: true }
  );
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  console.log('[TASKS] delete', req.params.id);
  const { id } = req.params;
  const deleted = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.json({ ok: true });
});

export default router;
