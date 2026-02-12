const Newsletter = require('../models/Newsletter');
const { getTranslation } = require('../middleware/language');
const sendEmail = require('../utils/sendEmail');
const { newsletterWelcomeTemplate, newsletterAdminTemplate } = require('../utils/emailTemplates');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter?lang=id
// @access  Public
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const lang = req.language || 'en';

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email'
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

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: getTranslation(lang, 'newsletterExists')
        });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        
        // Send welcome email
        try {
          await sendEmail({
            to: email,
            subject: lang === 'id' ? 'Selamat Datang di Newsletter Winosa!' : 
                     lang === 'nl' ? 'Welkom bij Winosa Nieuwsbrief!' :
                     'Welcome to Winosa Newsletter!',
            html: newsletterWelcomeTemplate(email, lang)
          });
          console.log('✅ Welcome email sent to subscriber');
        } catch (emailError) {
          console.error('❌ Failed to send welcome email:', emailError.message);
        }
        
        return res.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
    }

    // Create new subscription
    const subscriber = await Newsletter.create({
      email: email.toLowerCase()
    });

    // Send welcome email to subscriber
    try {
      await sendEmail({
        to: email,
        subject: lang === 'id' ? 'Selamat Datang di Newsletter Winosa!' : 
                 lang === 'nl' ? 'Welkom bij Winosa Nieuwsbrief!' :
                 'Welcome to Winosa Newsletter!',
        html: newsletterWelcomeTemplate(email, lang)
      });
      console.log('✅ Welcome email sent to new subscriber');
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError.message);
    }

    // Send notification to admin
    try {
      await sendEmail({
        to: process.env.EMAIL_USER, // Admin email
        subject: 'New Newsletter Subscriber',
        html: newsletterAdminTemplate(email)
      });
      console.log('✅ Admin notification sent');
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: getTranslation(lang, 'newsletterSuccess'),
      data: subscriber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter
// @access  Private (Admin only)
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message
    });
  }
};