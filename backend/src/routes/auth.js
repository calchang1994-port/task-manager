import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    console.log('[REGISTER] body:', req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.warn('[REGISTER] Missing fields');
      return res.status(400).json({ error: 'Missing fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      console.warn('[REGISTER] Duplicate email:', email);
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    console.log('[REGISTER] Success:', user._id.toString());
    return res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (e) {
    if (e?.code === 11000) {
      console.warn('[REGISTER] Duplicate key error for', req.body?.email);
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error('[REGISTER_ERROR]', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('[LOGIN] body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      console.warn('[LOGIN] Missing fields');
      return res.status(400).json({ error: 'Missing fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      console.warn('[LOGIN] No user for', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.warn('[LOGIN] Bad password for', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('[LOGIN] Success:', user._id.toString());
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    console.error('[LOGIN_ERROR]', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
