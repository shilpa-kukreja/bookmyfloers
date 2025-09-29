import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create storage configuration for each type
const createStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, `../uploads/${folder}`));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${folder}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};


// Single configuration for product uploads
export const uploadProductFiles = multer({
  storage: createStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
}).fields([
  { name: 'image', maxCount: 1 },      // Main image
  { name: 'galleryImage', maxCount: 10 } // Gallery images
]);

// Configure each upload type
export const uploadProductImage = multer({
  storage: createStorage('productimg'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
});

export const uploadGalleryImages = multer({
  storage: createStorage('galleryimg'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
});

export const uploadCategoryImage = multer({
  storage: createStorage('category'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: imageFilter
});



export const uploadSubCategoryImage = multer({
  storage: createStorage('subcategory'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: imageFilter
});

export const uploadBlogImage = multer({
  storage: createStorage('blog'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: imageFilter
});