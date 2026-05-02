const express = require('express');
const db = require('../database');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all available donations (public for charities, filtered for donors)
router.get('/', auth, (req, res) => {
  let donations;

  if (req.user.role === 'donor') {
    donations = db.prepare(`
      SELECT d.*, u.name as donor_name, u.organization as donor_organization, u.phone as donor_phone,
        (SELECT COUNT(*) FROM claims c WHERE c.donation_id = d.id AND c.status != 'cancelled') as claim_count
      FROM donations d
      JOIN users u ON d.donor_id = u.id
      WHERE d.donor_id = ?
      ORDER BY d.created_at DESC
    `).all(req.user.id);
  } else {
    donations = db.prepare(`
      SELECT d.*, u.name as donor_name, u.organization as donor_organization, u.phone as donor_phone,
        (SELECT COUNT(*) FROM claims c WHERE c.donation_id = d.id AND c.status != 'cancelled') as claim_count
      FROM donations d
      JOIN users u ON d.donor_id = u.id
      WHERE d.status = 'available'
      ORDER BY d.pickup_date ASC, d.created_at DESC
    `).all();
  }

  res.json({ donations });
});

// Create a new donation (donors only)
router.post('/', auth, requireRole('donor'), (req, res) => {
  const { title, description, food_type, quantity, pickup_address, pickup_date, pickup_time_start, pickup_time_end } = req.body;

  if (!title || !food_type || !quantity || !pickup_address || !pickup_date || !pickup_time_start || !pickup_time_end) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  const result = db.prepare(`
    INSERT INTO donations (donor_id, title, description, food_type, quantity, pickup_address, pickup_date, pickup_time_start, pickup_time_end)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, title, description || null, food_type, quantity, pickup_address, pickup_date, pickup_time_start, pickup_time_end);

  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ donation });
});

// Get single donation
router.get('/:id', auth, (req, res) => {
  const donation = db.prepare(`
    SELECT d.*, u.name as donor_name, u.organization as donor_organization, u.phone as donor_phone, u.address as donor_address
    FROM donations d
    JOIN users u ON d.donor_id = u.id
    WHERE d.id = ?
  `).get(req.params.id);

  if (!donation) return res.status(404).json({ error: 'Donation not found.' });

  const claims = db.prepare(`
    SELECT c.*, u.name as charity_name, u.organization as charity_organization, u.phone as charity_phone
    FROM claims c
    JOIN users u ON c.charity_id = u.id
    WHERE c.donation_id = ?
    ORDER BY c.created_at DESC
  `).all(req.params.id);

  res.json({ donation, claims });
});

// Update donation status (donor only)
router.patch('/:id/status', auth, requireRole('donor'), (req, res) => {
  const { status } = req.body;
  const donation = db.prepare('SELECT * FROM donations WHERE id = ? AND donor_id = ?').get(req.params.id, req.user.id);

  if (!donation) return res.status(404).json({ error: 'Donation not found.' });

  db.prepare('UPDATE donations SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Status updated.' });
});

// Delete donation (donor only)
router.delete('/:id', auth, requireRole('donor'), (req, res) => {
  const donation = db.prepare('SELECT * FROM donations WHERE id = ? AND donor_id = ?').get(req.params.id, req.user.id);
  if (!donation) return res.status(404).json({ error: 'Donation not found.' });

  db.prepare('DELETE FROM claims WHERE donation_id = ?').run(req.params.id);
  db.prepare('DELETE FROM donations WHERE id = ?').run(req.params.id);
  res.json({ message: 'Donation deleted.' });
});

module.exports = router;
