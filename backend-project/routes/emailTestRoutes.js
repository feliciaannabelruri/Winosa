const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');
const { protect, admin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Test send email
router.post('/send-test', protect, admin, asyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to) {
    return res.status(400).json({
      success: false,
      message: 'Please provide recipient email'
    });
  }

  const html = `
    <h1>Test Email</h1>
    <p>${message || 'This is a test email from Winosa Backend API'}</p>
    <p>Sent at: ${new Date().toLocaleString()}</p>
  `;

  await sendEmail({
    to: to,
    subject: subject || 'Test Email from Winosa',
    html: html
  });

  res.json({
    success: true,
    message: 'Test email sent successfully'
  });
}));

module.exports = router;