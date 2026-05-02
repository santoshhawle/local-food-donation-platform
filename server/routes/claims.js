const express = require('express');
const db = require('../database');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Claim a donation (charity only)
router.post('/', auth, requireRole('charity'), (req, res) => {
  const { donation_id, notes } = req.body;

  const donation = db.prepare('SELECT * FROM donations WHERE id = ? AND status = ?').get(donation_id, 'available');
  if (!donation) return res.status(404).json({ error: 'Donation not available.' });

  const existingClaim = db.prepare(
    'SELECT * FROM claims WHERE donation_id = ? AND charity_id = ? AND status != ?'
  ).get(donation_id, req.user.id, 'cancelled');
  if (existingClaim) return res.status(409).json({ error: 'You have already claimed this donation.' });

  const result = db.prepare(
    'INSERT INTO claims (donation_id, charity_id, notes) VALUES (?, ?, ?)'
  ).run(donation_id, req.user.id, notes || null);

  db.prepare('UPDATE donations SET status = ? WHERE id = ?').run('claimed', donation_id);

  const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ claim });
});

// Get my claims (charity)
router.get('/my', auth, requireRole('charity'), (req, res) => {
  const claims = db.prepare(`
    SELECT c.*, d.title, d.description, d.food_type, d.quantity, d.pickup_address, d.pickup_date,
      d.pickup_time_start, d.pickup_time_end, d.status as donation_status,
      u.name as donor_name, u.organization as donor_organization, u.phone as donor_phone
    FROM claims c
    JOIN donations d ON c.donation_id = d.id
    JOIN users u ON d.donor_id = u.id
    WHERE c.charity_id = ?
    ORDER BY c.created_at DESC
  `).all(req.user.id);

  res.json({ claims });
});

// Update claim status
router.patch('/:id/status', auth, (req, res) => {
  const { status } = req.body;
  const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(req.params.id);

  if (!claim) return res.status(404).json({ error: 'Claim not found.' });

  // Donors can approve/reject, charities can mark picked_up/completed/cancel
  if (req.user.role === 'donor') {
    const donation = db.prepare('SELECT * FROM donations WHERE id = ? AND donor_id = ?').get(claim.donation_id, req.user.id);
    if (!donation) return res.status(403).json({ error: 'Not your donation.' });
  } else {
    if (claim.charity_id !== req.user.id) return res.status(403).json({ error: 'Not your claim.' });
  }

  db.prepare('UPDATE claims SET status = ? WHERE id = ?').run(status, req.params.id);

  // Update donation status based on claim
  if (status === 'completed') {
    db.prepare('UPDATE donations SET status = ? WHERE id = ?').run('completed', claim.donation_id);
  } else if (status === 'cancelled') {
    const otherClaims = db.prepare(
      "SELECT * FROM claims WHERE donation_id = ? AND id != ? AND status != 'cancelled'"
    ).all(claim.donation_id, req.params.id);
    if (otherClaims.length === 0) {
      db.prepare('UPDATE donations SET status = ? WHERE id = ?').run('available', claim.donation_id);
    }
  }

  res.json({ message: 'Claim status updated.' });
});

module.exports = router;
