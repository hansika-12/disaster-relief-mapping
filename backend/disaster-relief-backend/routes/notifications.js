// routes/notifications.js
// Notifications server pe save hoti hain (har user ke email ke hisaab se)

const express = require('express');
const router = express.Router();
const db = require('../db/database');

db.defaults({ notifications: [] }).write();

function norm(email) {
  return String(email || '').trim().toLowerCase();
}

// reports.js isko use karta hai
function addNotification(user, icon, title, message) {

  const u = norm(user);

  if (!u || u === 'anonymous' || u === 'unknown' || u === 'citizen') {
    return null;
  }

  const n = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    user: u,
    icon,
    title,
    message,
    unread: true,
    created_at: new Date().toISOString()
  };

  db.get('notifications').push(n).write();

  return n;
}


// GET /api/notifications?user=email
router.get('/', (req, res) => {

  const user = norm(req.query.user);

  if (!user) {
    return res.status(400).json({ error: 'user is required' });
  }

  const list = db.get('notifications').value()
    .filter(n => n.user === user)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json(list);
});


// POST /api/notifications/read  { user }
router.post('/read', (req, res) => {

  const user = norm(req.body.user);

  if (!user) {
    return res.status(400).json({ error: 'user is required' });
  }

  db.get('notifications')
    .filter(n => n.user === user && n.unread)
    .each(n => { n.unread = false; })
    .write();

  res.json({ message: 'Marked as read' });
});


module.exports = router;
module.exports.addNotification = addNotification;