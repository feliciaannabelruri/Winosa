const Settings = require('../../models/Settings');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { uploadSingle, uploadToImageKit, deleteFromImageKit } = require('../../config/imagekit');

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res, next) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = new Settings();
  }

  res.json({
    success: true,
    data: settings
  });
});

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }

    try {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings();
      }

      const {
        siteName, siteTagline, siteEmail, sitePhone, siteAddress,
        socialInstagram, socialFacebook, socialTwitter, socialLinkedin,
        socialYoutube, socialWhatsapp,
        metaTitle, metaDescription, metaKeywords, googleAnalyticsId,
        removeLogo
      } = req.body;

      // General
      if (siteName      !== undefined) settings.siteName      = siteName;
      if (siteTagline   !== undefined) settings.siteTagline   = siteTagline;
      if (siteEmail     !== undefined) settings.siteEmail     = siteEmail;
      if (sitePhone     !== undefined) settings.sitePhone     = sitePhone;
      if (siteAddress   !== undefined) settings.siteAddress   = siteAddress;

      // Social
      if (socialInstagram !== undefined) settings.socialInstagram = socialInstagram;
      if (socialFacebook  !== undefined) settings.socialFacebook  = socialFacebook;
      if (socialTwitter   !== undefined) settings.socialTwitter   = socialTwitter;
      if (socialLinkedin  !== undefined) settings.socialLinkedin  = socialLinkedin;
      if (socialYoutube   !== undefined) settings.socialYoutube   = socialYoutube;
      if (socialWhatsapp  !== undefined) settings.socialWhatsapp  = socialWhatsapp;

      // SEO
      if (metaTitle         !== undefined) settings.metaTitle         = metaTitle;
      if (metaDescription   !== undefined) settings.metaDescription   = metaDescription;
      if (metaKeywords      !== undefined) settings.metaKeywords      = metaKeywords;
      if (googleAnalyticsId !== undefined) settings.googleAnalyticsId = googleAnalyticsId;

      // Handle logo removal
      if (removeLogo === 'true' || removeLogo === true) {
        if (settings.logoId) {
          try { await deleteFromImageKit(settings.logoId); } catch (e) {
            console.log('Could not delete old logo from ImageKit:', e.message);
          }
        }
        settings.logo   = '';
        settings.logoId = '';
      }

      // Handle new logo upload
      if (req.file) {
        if (settings.logoId) {
          try { await deleteFromImageKit(settings.logoId); } catch (e) {
            console.log('Could not delete old logo from ImageKit:', e.message);
          }
        }
        const uploadResult = await uploadToImageKit(req.file, 'settings');
        settings.logo   = uploadResult.url;
        settings.logoId = uploadResult.fileId;
      }

      await settings.save();

      res.json({
        success: true,
        message: 'Settings saved successfully',
        data: settings
      });
    } catch (error) {
      return next(new ErrorResponse(error.message, 500));
    }
  });
});