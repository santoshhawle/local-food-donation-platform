const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, password, role, organization, phone, address } = req.body;

  if (!name || !email || !password || !role || !organization) {
    return res.status(400).json({ error: 'Name, email, password, role, and organization are required.' });
  }

  if (!['donor', 'charity'].includes(role)) {
    return res.status(400).json({ error: 'Role must be donor or charity.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const result = db.prepare(
    'INSERT INTO users (name, email, password, role, organization, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(name, email, hashedPassword, role, organization, phone || null, address || null);

  const token = jwt.sign(
    { id: result.lastInsertRowid, email, role, name, organization },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, name, email, role, organization, phone, address }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name, organization: user.organization },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, organization: user.organization, phone: user.phone, address: user.address }
  });
});

router.get('/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, organization, phone, address, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user });
});

module.exports = router;
