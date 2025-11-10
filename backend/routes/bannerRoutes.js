import express from 'express';
import { 
    createBanner, 
    getAllBanners, 
    getBannerById, 
    deleteBanner, 
    updateBanner 
} from '../controllers/bannerControllers.js';
import { uploadBannerImage } from '../middleware/multer.js';

const bannerRouter = express.Router();

bannerRouter.post('/add', uploadBannerImage.single('image'), createBanner);
bannerRouter.post('/all', getAllBanners);
bannerRouter.get('/delete/:id', deleteBanner);
bannerRouter.get('/get/:id', getBannerById);
bannerRouter.put('/edit/:id', uploadBannerImage.single('image'), updateBanner);

export default bannerRouter;