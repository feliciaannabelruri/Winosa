const logger = (req, res, next) => {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    
    if (res.statusCode >= 500) {
      console.error(`❌ ${logMessage}`);
    } else if (res.statusCode >= 400) {
      console.warn(`⚠️  ${logMessage}`);
    } else {
      console.log(`✅ ${logMessage}`);
    }
  });

  next();
};

module.exports = logger;