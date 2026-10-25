// server.js
// Main entry point for the Disaster Relief backend.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const reportsRouter = require('./routes/reports');
const authRouter = require('./routes/auth');
const notificationsRouter = require('./routes/notifications');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Disaster Relief Backend is running.');
});

app.use('/api/reports', reportsRouter);
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationsRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});