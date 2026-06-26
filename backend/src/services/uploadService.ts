import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn('⚠️ CLOUDINARY_CLOUD_NAME not set - using local storage');
}

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Use Cloudinary if configured, otherwise fall back to local storage
let storage: any;

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'delka-medias',
      resource_type: 'auto',
      quality: 'auto:good',
    } as any,
  });
} else {
  // Fallback to local storage for development
  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  const fs = require('fs');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const { v4: uuidv4 } = require('uuid');
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
}

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp,video/mp4,video/webm,application/pdf').split(',');
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`));
  }
};

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '104857600'); // 100MB

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSize },
});

export const deleteFile = async (filepath: string) => {
  try {
    if (isCloudinaryConfigured) {
      // Extract public ID from Cloudinary URL
      const urlParts = filepath.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicId = `delka-medias/${filename.split('.')[0]}`;
      
      await cloudinary.uploader.destroy(publicId);
      return true;
    } else {
      // Local file deletion
      const fs = require('fs');
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};
