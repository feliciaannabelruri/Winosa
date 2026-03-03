const SiteSettings = require('../../models/SiteSettings');
const asyncHandler = require('../../middleware/asyncHandler');
const { ErrorResponse } = require('../../middleware/errorHandler');
const { uploadSingle, uploadToImageKit, deleteFromImageKit } = require('../../config/imagekit');
const { invalidateCache } = require('../../middleware/cache');

// @desc    Get site settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = asyncHandler(async (req, res, next) => {
  // findOne or create default
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }

  res.json({
    success: true,
    data: settings,
  });
});

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = asyncHandler(async (req, res, next) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }

    try {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create({});
      }

      // Handle logo upload
      if (req.file) {
        // Delete old logo if exists
        if (settings.logoId) {
          try {
            await deleteFromImageKit(settings.logoId);
          } catch (e) {
            console.log('Could not delete old logo:', e.message);
          }
        }
        const uploaded = await uploadToImageKit(req.file, 'settings');
        req.body.logo   = uploaded.url;
        req.body.logoId = uploaded.fileId;
      }

      // Handle logo removal (frontend sends empty string)
      if (req.body.logo === '' && settings.logoId) {
        try {
          await deleteFromImageKit(settings.logoId);
        } catch (e) {
          console.log('Could not delete logo:', e.message);
        }
        req.body.logo   = null;
        req.body.logoId = null;
      }

      // Strip fields that should not be updated directly
      const { _id, __v, createdAt, updatedAt, ...updateData } = req.body;

      settings = await SiteSettings.findOneAndUpdate(
        {},
        updateData,
        { new: true, runValidators: true, upsert: true }
      );

      // Invalidate public cache if any
      invalidateCache('settings');

      res.json({
        success: true,
        message: 'Settings updated successfully',
        data: settings,
      });
    } catch (error) {
      return next(new ErrorResponse(error.message, 500));
    }
  });
});