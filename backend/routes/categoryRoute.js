import express from 'express';
import { createCategory, getCategories, editCategory, getCategory, deleteCategory} from '../controllers/categoryControllers.js';
import { uploadCategoryImage } from '../middleware/multer.js';  


const categoryRouter = express.Router();

categoryRouter.post('/add', uploadCategoryImage.single('image'), createCategory);
categoryRouter.post('/all', getCategories);
categoryRouter.get('/delete/:id', deleteCategory);
categoryRouter.get('/get/:id', getCategory);
categoryRouter.put('/edit/:id', uploadCategoryImage.single('image'), editCategory );

export default categoryRouter;