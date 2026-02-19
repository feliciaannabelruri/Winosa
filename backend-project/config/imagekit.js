const ImageKit = require('imagekit');
const multer = require('multer');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Multer Memory Storage
const storage = multer.memoryStorage();

// Improved File Filter
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed. You uploaded: ${file.mimetype}`), false);
  }
};

// Upload Middleware - Single Image
const uploadSingle = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1
  }
}).single('image');

// Upload Middleware - Multiple Images
const uploadMultiple = (maxCount = 5) => multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: maxCount
  }
}).array('images', maxCount);

// Upload to ImageKit with error handling
const uploadToImageKit = async (file, folder = 'general') => {
  try {
    // Validate file size again (double check)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }

    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}_${file.originalname}`,
      folder: `winosa/${folder}`,
      useUniqueFileName: true,
      transformation: {
        pre: 'l-text,i-Winosa,fs-50,l-end', // Optional watermark
        post: [
          {
            type: 'transformation',
            value: 'w-1200,h-800,c-at_max' // Max dimensions
          }
        ]
      }
    });

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      size: result.size
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error(`ImageKit upload failed: ${error.message}`);
  }
};

// Delete from ImageKit with retry
const deleteFromImageKit = async (fileId, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await imagekit.deleteFile(fileId);
      console.log(`✅ Image deleted from ImageKit: ${fileId}`);
      return { success: true };
    } catch (error) {
      console.error(`Attempt ${i + 1} - Failed to delete image:`, error.message);
      if (i === retries - 1) {
        throw new Error(`ImageKit delete failed after ${retries} attempts: ${error.message}`);
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Extract fileId from ImageKit URL
const extractFileId = (url) => {
  if (!url || !url.includes('ik.imagekit.io')) return null;
  
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  
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