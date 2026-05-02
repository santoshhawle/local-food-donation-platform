const express = require('express');
const db = require('../database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
  if (req.user.role === 'donor') {
    const totalDonations = db.prepare('SELECT COUNT(*) as count FROM donations WHERE donor_id = ?').get(req.user.id).count;
    const activeDonations = db.prepare("SELECT COUNT(*) as count FROM donations WHERE donor_id = ? AND status = 'available'").get(req.user.id).count;
    const claimedDonations = db.prepare("SELECT COUNT(*) as count FROM donations WHERE donor_id = ? AND status = 'claimed'").get(req.user.id).count;
    const completedDonations = db.prepare("SELECT COUNT(*) as count FROM donations WHERE donor_id = ? AND status = 'completed'").get(req.user.id).count;

    res.json({ totalDonations, activeDonations, claimedDonations, completedDonations });
  } else {
    const totalClaims = db.prepare('SELECT COUNT(*) as count FROM claims WHERE charity_id = ?').get(req.user.id).count;
    const pendingClaims = db.prepare("SELECT COUNT(*) as count FROM claims WHERE charity_id = ? AND status = 'pending'").get(req.user.id).count;
    const completedClaims = db.prepare("SELECT COUNT(*) as count FROM claims WHERE charity_id = ? AND status = 'completed'").get(req.user.id).count;
    const availableDonations = db.prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'available'").get().count;

    res.json({ totalClaims, pendingClaims, completedClaims, availableDonations });
  }
});

module.exports = router;
