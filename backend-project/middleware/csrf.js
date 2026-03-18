const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Setup cookie parser
exports.cookieParser = cookieParser();

// CSRF protection middleware
exports.csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// Send CSRF token to client
exports.sendCsrfToken = (req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  next();
};

// Handle CSRF errors
exports.csrfErrorHandler = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'Invalid or missing CSRF token',
    });
  }
  next(err);
};