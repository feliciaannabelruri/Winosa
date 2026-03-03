const Newsletter = require('../models/Newsletter');
const { getTranslation } = require('../middleware/language');
const sendEmail = require('../utils/sendEmail');
const { newsletterWelcomeTemplate, newsletterAdminTemplate } = require('../utils/emailTemplates');
const asyncHandler = require('../middleware/asyncHandler');
const { ErrorResponse } = require('../middleware/errorHandler');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter?lang=id
// @access  Public
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    const lang = req.language || 'en';

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email' });
    }

    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: getTranslation(lang, 'newsletterExists'),
        });
      } else {
        existingSubscriber.isActive = true;
        await existingSubscriber.save();

        try {
          await sendEmail({
            to: email,
            subject: lang === 'id' ? 'Selamat Datang di Newsletter Winosa!' :
                     lang === 'nl' ? 'Welkom bij Winosa Nieuwsbrief!' :
                     'Welcome to Winosa Newsletter!',
            html: newsletterWelcomeTemplate(email, lang),
          });
        } catch (emailError) {
          console.error('❌ Failed to send welcome email:', emailError.message);
        }

        return res.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        });
      }
    }

    const subscriber = await Newsletter.create({ email: email.toLowerCase() });

    try {
      await sendEmail({
        to: email,
        subject: lang === 'id' ? 'Selamat Datang di Newsletter Winosa!' :
                 lang === 'nl' ? 'Welkom bij Winosa Nieuwsbrief!' :
                 'Welcome to Winosa Newsletter!',
        html: newsletterWelcomeTemplate(email, lang),
      });
    } catch (emailError) {
      console.error('❌ Failed to send welcome email:', emailError.message);
    }

    try {
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: 'New Newsletter Subscriber',
        html: newsletterAdminTemplate(email),
      });
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: getTranslation(lang, 'newsletterSuccess'),
      data: subscriber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message,
    });
  }
};

// @desc    Get all subscribers (admin)
// @route   GET /api/newsletter
// @access  Private/Admin
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: getTranslation(req.language || 'en', 'serverError'),
      error: error.message,
    });
  }
};

// @desc    Delete/remove subscriber
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
// NOTE: Frontend NewsletterPage.tsx calls this endpoint.
exports.deleteSubscriber = asyncHandler(async (req, res, next) => {
  const subscriber = await Newsletter.findById(req.params.id);

  if (!subscriber) {
    return next(new ErrorResponse('Subscriber not found', 404));
  }

  await Newsletter.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Subscriber removed successfully',
  });
});