import express from 'express';
import { getSubCategories, createSubCategory, getSubCategory, editSubCategory, deleteSubCategory} from '../controllers/subcategoryControllers.js';
import { uploadSubCategoryImage } from '../middleware/multer.js';  



const subcategoryRouter = express.Router();

subcategoryRouter.post('/all', getSubCategories);
subcategoryRouter.post('/add', uploadSubCategoryImage.single('image'), createSubCategory);
subcategoryRouter.get('/get/:id', getSubCategory);
subcategoryRouter.get('/delete/:id', deleteSubCategory);
subcategoryRouter.put('/edit/:id', uploadSubCategoryImage.single('image'), editSubCategory);

export default subcategoryRouter;