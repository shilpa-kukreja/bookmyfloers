import Category from "../models/categoryModel.js";
import { uploadCategoryImage } from "../middleware/multer.js";
import fs from "fs";



export const getCategories = async (req, res) => {
    try {
        // Only get active categories, sorted by creation date (newest first)
        const categories = await Category.find({ })
            .sort({ createdAt: -1 })
            .select('-__v'); // Exclude version key
        
        // Add caching headers
        res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch categories",
            error: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};
export const createCategory = async (req, res) => {
    try {


        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: 'Name and slug are required'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Category image is required'
            });
        }

        const imagePath = `/uploads/category/${req.file.filename}`;
        console.log(imagePath);

        const category = await Category.create({
            name,
            slug,
            image: imagePath
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Category found',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};



export const editCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, slug } = req.body;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: 'Name and slug are required'
            });
        }
        const imagePath = category.image;
        if (req.file) {
            const oldImagePath = category.image;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            const imagePath = `/uploads/category/${req.file.filename}`;
            category.image = imagePath;
        }
        category.name = name;
        category.slug = slug;
        await category.save();
        res.status(200).json({
            success: true,
            message: 'Category Updated Successfully',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Find the category first to get the image path
        const category = await Category.findById(id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        // Delete the associated image file if it exists
        const imagePath = category.image;
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        
        // Use deleteOne() instead of remove()
        await Category.deleteOne({ _id: id });
        
        res.status(200).json({
            success: true,
            message: 'Category Deleted Successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server error',
            error: error.message
        });
    }
};