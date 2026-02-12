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

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    // Save contact to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // Send email notification to admin
    try {
      await sendEmail({
        to: process.env.EMAIL_USER, // Admin email
        subject: `New Contact Form Submission${subject ? ': ' + subject : ''}`,
        html: contactFormTemplate({
          name,
          email,
          subject,
          message
        })
      });
      console.log('✅ Contact form notification email sent to admin');
    } catch (emailError) {
      console.error('❌ Failed to send email notification:', emailError.message);
      // Don't fail the request if email fails
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