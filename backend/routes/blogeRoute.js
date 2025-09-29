import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getBlogById
} from '../controllers/blogControllers.js';
import { uploadBlogImage } from '../middleware/multer.js';  


const blogRouter = express.Router();

blogRouter.post('/add', uploadBlogImage.single('image'), createBlog);
blogRouter.post('/all', getAllBlogs);
blogRouter.get('/delete/:id',  deleteBlog);
blogRouter.get('/get/:id', getBlogById);
blogRouter.get('/get/:slug', getBlogBySlug);
blogRouter.put('/edit/:id', uploadBlogImage.single('image'), updateBlog );

export default blogRouter;