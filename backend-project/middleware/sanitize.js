const sanitizeHtml = require('sanitize-html');

const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  next();
};

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;

  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeHtml(obj[key], {
        allowedTags: [],        // strip semua HTML tags
        allowedAttributes: {},  // strip semua attributes
      });
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

module.exports = sanitizeInput;