// Supported languages
const supportedLanguages = ['id', 'en', 'nl'];
const defaultLanguage = 'en';

exports.setLanguage = (req, res, next) => {
  // Get language from query parameter
  let lang = req.query.lang || defaultLanguage;
  
  // Validate language
  if (!supportedLanguages.includes(lang)) {
    lang = defaultLanguage;
  }
  
  // Set language in request object
  req.language = lang;
  
  next();
};

// Translation helper
exports.translations = {
  en: {
    success: 'Success',
    error: 'Error',
    notFound: 'Not found',
    serverError: 'Server error',
    invalidCredentials: 'Invalid credentials',
    userExists: 'User already exists',
    loginSuccess: 'Login successful',
    logoutSuccess: 'Logged out successfully',
    registrationSuccess: 'User registered successfully',
    contactSuccess: 'Thank you for contacting us! We will get back to you soon.',
    newsletterSuccess: 'Successfully subscribed to our newsletter!',
    newsletterExists: 'This email is already subscribed to our newsletter',
    portfolioNotFound: 'Portfolio not found',
    blogNotFound: 'Blog not found',
    serviceNotFound: 'Service not found',
    subscriptionNotFound: 'Subscription not found'
  },
  id: {
    success: 'Berhasil',
    error: 'Error',
    notFound: 'Tidak ditemukan',
    serverError: 'Kesalahan server',
    invalidCredentials: 'Kredensial tidak valid',
    userExists: 'User sudah terdaftar',
    loginSuccess: 'Login berhasil',
    logoutSuccess: 'Logout berhasil',
    registrationSuccess: 'User berhasil didaftarkan',
    contactSuccess: 'Terima kasih telah menghubungi kami! Kami akan segera menghubungi Anda.',
    newsletterSuccess: 'Berhasil berlangganan newsletter kami!',
    newsletterExists: 'Email ini sudah terdaftar di newsletter kami',
    portfolioNotFound: 'Portfolio tidak ditemukan',
    blogNotFound: 'Blog tidak ditemukan',
    serviceNotFound: 'Service tidak ditemukan',
    subscriptionNotFound: 'Subscription tidak ditemukan'
  },
  nl: {
    success: 'Succes',
    error: 'Fout',
    notFound: 'Niet gevonden',
    serverError: 'Serverfout',
    invalidCredentials: 'Ongeldige inloggegevens',
    userExists: 'Gebruiker bestaat al',
    loginSuccess: 'Inloggen succesvol',
    logoutSuccess: 'Succesvol uitgelogd',
    registrationSuccess: 'Gebruiker succesvol geregistreerd',
    contactSuccess: 'Bedankt voor uw bericht! We nemen spoedig contact met u op.',
    newsletterSuccess: 'Succesvol geabonneerd op onze nieuwsbrief!',
    newsletterExists: 'Dit e-mailadres is al geabonneerd op onze nieuwsbrief',
    portfolioNotFound: 'Portfolio niet gevonden',
    blogNotFound: 'Blog niet gevonden',
    serviceNotFound: 'Service niet gevonden',
    subscriptionNotFound: 'Abonnement niet gevonden'
  }
};

// Get translation
exports.getTranslation = (lang, key) => {
  return this.translations[lang][key] || this.translations['en'][key];
};