// routes/auth.js
// Email OTP login

const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();

// email -> { hash, expires, attempts, sentAt }
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function hashOtp(email, otp) {
  return crypto
    .createHash('sha256')
    .update(email + ':' + otp)
    .digest('hex');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* ---------- SEND OTP ---------- */

router.post('/send-otp', async (req, res) => {

  const email = String(req.body.email || '').trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const existing = otpStore.get(email);

  if (existing && Date.now() - existing.sentAt < 30000) {
    return res.status(429).json({
      error: 'Please wait 30 seconds before requesting a new OTP.'
    });
  }

  const otp = crypto.randomInt(100000, 1000000);

  otpStore.set(email, {
    hash: hashOtp(email, otp),
    expires: Date.now() + 5 * 60 * 1000,
    attempts: 0,
    sentAt: Date.now()
  });

  try {

    await transporter.sendMail({
      from: `"DisasterRelief" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your DisasterRelief login OTP',
      text: `Your OTP is ${otp}. It is valid for 5 minutes. Do not share it with anyone.`
    });

    res.json({ message: 'OTP sent to your email.' });

  } catch (err) {

    console.error('Email error:', err.message);
    otpStore.delete(email);

    res.status(500).json({
      error: 'Could not send the email. Please check the server settings.'
    });
  }
});


/* ---------- VERIFY OTP ---------- */

router.post('/verify-otp', (req, res) => {

  const email = String(req.body.email || '').trim().toLowerCase();
  const otp = String(req.body.otp || '').trim();

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ error: 'Please generate an OTP first.' });
  }

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP has expired. Please generate a new one.' });
  }

  if (record.attempts >= 5) {
    otpStore.delete(email);
    return res.status(429).json({ error: 'Too many wrong attempts. Please generate a new OTP.' });
  }

  record.attempts += 1;

  if (hashOtp(email, otp) !== record.hash) {
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
  }

  otpStore.delete(email);

  res.json({ message: 'Login successful', email });
});

module.exports = router;