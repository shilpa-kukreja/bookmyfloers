import SubCategory from "../models/subcategoryModel.js";

import { uploadSubCategoryImage } from "../middleware/multer.js";
import fs from "fs";

export const getSubCategories = async (req, res) => {
    try {
        const subcategories = await SubCategory.find({})
            .sort({ createdAt: -1 })
            .populate('categoryId'); // Include only specific fields from Category
        
        res.json(subcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching subcategories",
            error: error.message
        });
    }
};

export const createSubCategory = async (req, res) => {
    try {


        const { name, slug, category:categoryid } = req.body;

        if (!name || !slug || !categoryid) {
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

        const imagePath = `/uploads/subcategory/${req.file.filename}`;

        const category = await SubCategory.create({
            name,
            slug,
            categoryId:categoryid,
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

export const getSubCategory = async (req, res) => {
    try {
        const category = await SubCategory.findOne({ _id: req.params.id });
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



export const editSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, slug , category : categoryid } = req.body;
        const category = await SubCategory.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        if (!name || !slug || !categoryid) {
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
            const imagePath = `/uploads/subcategory/${req.file.filename}`;
            category.image = imagePath;
        }
        category.name = name;
        category.slug = slug;
        category.categoryId = categoryid;
        await category.save();
        res.status(200).json({
            success: true,
            message: 'Sub Category Updated Successfully',
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server error',
            error: error.message
        });
    }
};

export const deleteSubCategory = async (req, res) => {
    try {
        const id = req.params.id;
        
        // Find the category first to get the image path
        const category = await SubCategory.findById(id);
        
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
        await SubCategory.deleteOne({ _id: id });
        
        res.status(200).json({
            success: true,
            message: 'Sub Category Deleted Successfully'
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