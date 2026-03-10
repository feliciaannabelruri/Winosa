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

    try {
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission${subject ? ': ' + subject : ''}`,
        html: contactFormTemplate({ name, email, subject, message })
      });
    } catch (emailError) {
      console.error('❌ Failed to send email notification:', emailError.message);
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

// @desc    Update contact (isRead toggle)
// @route   PATCH /api/contact/:id
// @access  Private (Admin only)
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // Only allow updating isRead field
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

// @desc    Reply to a contact message via email
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

    await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject || 'Your inquiry to Winosa'}`,
      html: replyHtml
    });

    // Mark as read after replying
    contact.isRead = true;
    await contact.save();

    res.json({ success: true, message: `Reply sent to ${contact.email}` });
  } catch (error) {
    console.error('Reply email error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
};