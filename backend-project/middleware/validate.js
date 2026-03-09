const { ZodError } = require('zod');

exports.validate = (schema) => {
  return (req, res, next) => {
    try {
      // Skip validation if no body (untuk GET request)
      if (!req.body || Object.keys(req.body).length === 0) {
        return next();
      }

      // Convert string booleans to actual booleans (from form-data)
      if (req.body.isActive === 'true') req.body.isActive = true;
      if (req.body.isActive === 'false') req.body.isActive = false;
      if (req.body.isPublished === 'true') req.body.isPublished = true;
      if (req.body.isPublished === 'false') req.body.isPublished = false;

      // Convert string arrays (tags sent as JSON string)
      if (typeof req.body.tags === 'string') {
        try { req.body.tags = JSON.parse(req.body.tags); } catch { req.body.tags = [req.body.tags]; }
      }

      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError || Array.isArray(error?.errors)) {
        const errors = (error.errors || []).map(err => ({
          field: err.path?.join('.') || 'unknown',
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      next(error);
    }
  };
};