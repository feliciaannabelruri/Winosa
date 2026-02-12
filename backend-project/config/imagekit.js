const ImageKit = require('imagekit');
const multer = require('multer');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Multer Memory Storage (upload ke RAM dulu, baru ke ImageKit)
const storage = multer.memoryStorage();

// File Filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Upload Middleware - Single Image
const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
}).single('image');

// Upload Middleware - Multiple Images
const uploadMultiple = (maxCount = 5) => multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max per file
  }
}).array('images', maxCount);

// Upload to ImageKit
const uploadToImageKit = async (file, folder = 'general') => {
  try {
    const result = await imagekit.upload({
      file: file.buffer, // File buffer dari multer
      fileName: `${Date.now()}_${file.originalname}`,
      folder: `winosa/${folder}`,
      useUniqueFileName: true
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name
    };
  } catch (error) {
    throw new Error(`ImageKit upload failed: ${error.message}`);
  }
};

// Delete from ImageKit
const deleteFromImageKit = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
    return { success: true };
  } catch (error) {
    throw new Error(`ImageKit delete failed: ${error.message}`);
  }
};

// Extract fileId from ImageKit URL
const extractFileId = (url) => {
  if (!url || !url.includes('ik.imagekit.io')) return null;
  
  // URL format: https://ik.imagekit.io/your_id/winosa/folder/file_id.jpg
  // FileId biasanya ada di path setelah folder
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  
  // Return filename without extension as potential fileId
  // Note: ImageKit fileId lebih kompleks, might need to store it in DB
  return filename.split('.')[0];
};

module.exports = {
  imagekit,
  uploadSingle,
  uploadMultiple,
  uploadToImageKit,
  deleteFromImageKit,
  extractFileId
};