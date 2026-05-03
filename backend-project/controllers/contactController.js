const Contact = require('../models/Contact');
const { getTranslation } = require('../middleware/language');
const sendEmail = require('../utils/sendEmail');
const { contactFormTemplate } = require('../utils/emailTemplates');

// @desc    Create new contact message
// @route   POST /api/contact?lang=id
// @access  Public
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const lang = req.language || 'en';

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    const contact = await Contact.create({ name, email, subject, message });

    // Notify admin via email
    try {
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission${subject ? ': ' + subject : ''}`,
        html: contactFormTemplate({ name, email, subject, message })
      });
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError.message);
    }

    // Send confirmation email to the submitter
    try {
      await sendEmail({
        to: email,
        subject: `We've received your message | Winosa`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 580px; margin: 0 auto; padding: 32px 16px; }
              .card { background: #fff; border: 1px solid #eee; border-radius: 16px; padding: 32px; }
              .header { text-align: center; margin-bottom: 28px; }
              .logo { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #0a0a0a; }
              .badge { display: inline-block; background: #f5f5f5; color: #555; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-bottom: 16px; }
              h2 { font-size: 20px; color: #0a0a0a; margin: 0 0 8px; }
              p { font-size: 14px; color: #555; margin: 0 0 16px; }
              .message-box { background: #f9f9f9; border-left: 3px solid #ccc; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #666; }
              .footer { text-align: center; margin-top: 28px; font-size: 12px; color: #aaa; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="header">
                  <div class="logo">WINOSA</div>
                </div>
                <span class="badge">Message Received</span>
                <h2>Hi ${name}, thank you for reaching out! 👋</h2>
                <p>We've received your message and our team will get back to you within <strong>1–2 business days</strong>.</p>
                <div class="message-box">
                  <strong>Your message:</strong><br/><br/>
                  ${message.replace(/\n/g, '<br/>')}
                </div>
                <p>In the meantime, feel free to explore our work at <a href="https://winosa.id" style="color:#0a0a0a">winosa.id</a>.</p>
                <p style="color:#aaa; font-size:13px;">— The Winosa Team</p>
              </div>
              <div class="footer">© ${new Date().getFullYear()} Winosa Mitra Bharatajaya. All rights reserved.</div>
            </div>
          </body>
          </html>
        `
      });
    } catch (confirmError) {
      console.error('❌ Failed to send confirmation email to submitter:', confirmError.message);
      // Non-blocking — form submission still succeeds
    }

    res.status(201).json({
      success: true,
      message: getTranslation(lang, 'contactSuccess'),
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private (Admin only)
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Get single contact by ID (with replies)
// @route   GET /api/contact/:id
// @access  Private (Admin only)
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update contact (isRead toggle)
// @route   PATCH /api/contact/:id
// @access  Private (Admin only)
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    if (typeof req.body.isRead === 'boolean') {
      contact.isRead = req.body.isRead;
    }

    await contact.save();

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reply to a contact message — sends email + saves to DB
// @route   POST /api/contact/:id/reply
// @access  Private (Admin only)
exports.replyContact = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // Define email template
    const replyHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
          .content { background-color: white; padding: 30px; border-radius: 10px; }
          .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .original { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #ccc; font-size: 13px; color: #666; }
          .footer { margin-top: 20px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h2>Reply from Winosa</h2></div>
          <div class="content">
            <p>Hi <strong>${contact.name}</strong>,</p>
            <p>${message.replace(/\n/g, '<br/>')}</p>
            <div class="original">
              <p><strong>Your original message:</strong></p>
              <p>${contact.message}</p>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Winosa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Attempt to send email
    let emailSent = false;
    let emailError = null;

    try {
      await sendEmail({
        to: contact.email,
        subject: `Re: ${contact.subject || 'Your inquiry to Winosa'}`,
        html: replyHtml
      });
      emailSent = true;
    } catch (err) {
      console.error('Reply email error:', err.message);
      emailError = err.message;
    }

    // Save reply to DB regardless of email status (so admin's work is not lost)
    const newReply = {
      message: message.trim(),
      sentBy:  req.user?.name || 'Admin',
      sentAt:  new Date(),
    };

    contact.replies.push(newReply);
    contact.isRead = true;
    await contact.save();

    const savedReply = contact.replies[contact.replies.length - 1];

    if (!emailSent) {
      return res.status(200).json({
        success: true,
        message: `Reply saved to database, but email failed to send: ${emailError}`,
        data: { reply: savedReply, emailError }
      });
    }

    res.json({
      success: true,
      message: `Reply sent to ${contact.email}`,
      data: { reply: savedReply }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};