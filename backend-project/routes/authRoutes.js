const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { mediumLimit, mediumUrlEncoded } = require('../middleware/requestLimit');

router.post('/register', mediumLimit, mediumUrlEncoded, register);
router.post('/login',    mediumLimit, mediumUrlEncoded, login);
router.post('/logout',   protect, logout);
router.get('/me',        protect, getMe);
router.put('/profile',   protect, mediumLimit, mediumUrlEncoded, updateProfile);
router.put('/password',  protect, mediumLimit, mediumUrlEncoded, updatePassword);

module.exports = router;