import express from 'express';
import { allProducts , addProduct, updateProduct, getProducts, deleteProduct } from '../controllers/productControllers.js';
import { uploadGalleryImages , uploadProductImage, uploadProductFiles } from '../middleware/multer.js';
const productRouter = express.Router();

 
productRouter.post('/all', allProducts);
productRouter.post('/add', 
  (req, res, next) => {
    uploadProductFiles(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          message: err.message.includes('File too large') 
            ? 'File size exceeds 5MB limit'
            : err.message 
        });
      }
      next();
    });
  },
  addProduct
);
 


productRouter.put('/update/:id',  (req, res, next) => {
    uploadProductFiles(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          message: err.message.includes('File too large') 
            ? 'File size exceeds 5MB limit'
            : err.message 
        });
      }
      next();
    });
  }, updateProduct);
productRouter.get('/get/:id', getProducts);
productRouter.get('/delete/:id', deleteProduct);

export default productRouter;


