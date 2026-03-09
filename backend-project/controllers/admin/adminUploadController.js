const multer = require('multer');
const { uploadToImageKit } = require('../../config/imagekit');

// Buat middleware sendiri dengan field name 'file' (sesuai frontend)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('file'); // ← 'file' bukan 'image'

const uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    try {
      const result = await uploadToImageKit(req.file, 'winosa-uploads');
      return res.status(200).json({ success: true, url: result.url });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  });
};

module.exports = { uploadImage };