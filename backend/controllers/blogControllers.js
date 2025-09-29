import Blog from '../models/blogModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createBlog = async (req, res) => {
  try {
    const { name, slug, author, tags, description, metaTitle, metaDescription } = req.body;
    
    // Validate required fields
    if (!name || !slug || !author || !description || !metaTitle || !metaDescription || !req.file) {
      // Remove uploaded file if validation fails
      // if (req.file) {
      //   fs.unlinkSync(req.file.path);
      // }
      return res.status(400).json({
        success: false,
        message: 'Name, slug, author, description, and image are required'
      });
    }

    // Check if slug already exists
    // const existingBlog = await Blog.findOne({ slug });
    // if (existingBlog) {
    //   fs.unlinkSync(req.file.path);
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Blog with this slug already exists'
    //   });
    // }

    // Create new blog with image path
    const blog = new Blog({
      name,
      slug,
      author,
      image: `/uploads/blog/${req.file.filename}`,
      tags: tags ? tags.split(',') : [],
      description,
      metaTitle,
      metaDescription,
    });

    const savedBlog = await blog.save();
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: savedBlog
    });

  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ created_at: -1 }).select('-__v');
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).select('-__v');
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, author, tags, description, metaTitle, metaDescription } = req.body;
    
    // Find existing blog
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false, 
        message: 'Blog not found' 
      });
    }

    // Check if slug is being changed and already exists
    if (slug && slug !== existingBlog.slug) {
      const slugExists = await Blog.findOne({ slug });
      if (slugExists) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: 'Blog with this slug already exists'
        });
      }
    }

    const tagsArray = Array.isArray(tags) ? tags : 
                 (typeof tags === 'string' ? tags.split(',') : []);

    // Prepare update data
    const updateData = {
      name: name || existingBlog.name,
      slug: slug || existingBlog.slug,
      author: author || existingBlog.author,
      tags: tagsArray,
      description: description || existingBlog.description,
      metaTitle: metaTitle || existingBlog.metaTitle,
      metaDescription: metaDescription || existingBlog.metaDescription
    };

    // If new image was uploaded
    if (req.file) {
      // Delete old image file
      if (existingBlog.image) {
        const oldImagePath = path.join(__dirname, `..${existingBlog.image}`);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/blog/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    }).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    });

  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Delete associated image file
    if (blog.image) {
      const imagePath = path.join(__dirname, `..${blog.image}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).select('-__v'); // Exclude version key
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};