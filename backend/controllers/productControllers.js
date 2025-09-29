import productModel from '../models/productModel.js';
import { uploadGalleryImages, uploadProductImage } from '../middleware/multer.js';

export const allProducts = async (req, res) => {
    try {
        // Get page and limit from either query params or body
        // const page = parseInt(req.query.page || req.body.page) || 2;
        // const limit = parseInt(req.query.limit || req.body.limit) || 10;
        // const skip = (page - 1) * limit;

        const products = await productModel
            .find({})
            .populate('categoryId')
            .populate('subcategoryId');

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        const totalProducts = await productModel.countDocuments();

        res.json({
            success : true,
            message: 'Products found',
            products,
            // totalProducts,
            // totalPages: Math.ceil(totalProducts / limit),
            // currentPage: page,
            // limit: limit // Include limit in response for verification
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



// export const allProducts = async (req, res) => {
//     try {
//         // Get page and limit from either query params or body
//         const page = parseInt(req.query.page || req.body.page) || 2;
//         const limit = parseInt(req.query.limit || req.body.limit) || 10;
//         const skip = (page - 1) * limit;

//         const products = await productModel
//             .find()
//             .skip(skip)
//             .limit(limit)
//             .populate('categoryId')
//             .populate('subcategoryId');

//         if (!products || products.length === 0) {
//             return res.status(404).json({ message: 'No products found' });
//         }

//         const totalProducts = await productModel.countDocuments();

//         res.json({
//             message: 'Products found',
//             products,
//             totalProducts,
//             totalPages: Math.ceil(totalProducts / limit),
//             currentPage: page,
//             limit: limit // Include limit in response for verification
//         });
//     } catch (error) {
//         console.error('Error fetching products:', error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// };


export const addProduct = async (req, res) => {
    try {
        // Debug received files and body
        // console.log('Uploaded files:', {
        //     mainImage: req.files?.image?.[0],
        //     galleryImages: req.files?.galleryImage
        // });

        // Extract all fields from request body
        const {
            name,
            slug,
            section,
            shortDescription,
            description,
            additionalInformation,
            productType,
            sku,
            stock,
            status,
            availability,
            categoryId,
            subcategoryId,
            actualPrice,
            discountPrice,
            variant,
            provariants,
            dimensions,
            weight,
            metaTitle,
            metaDescription
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'name', 'slug', 'shortDescription', 'description', 
            'productType', 'sku', 'categoryId'
        ];

   
        
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0 || !req.files?.image?.[0]) {
            return res.status(400).json({ 
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')} or main image`
            });
        }

         const mainImagePath = '/uploads/products/' + req.files?.image?.[0]?.filename;
        const galleryImagePaths =  req.files?.galleryImage?.map(file => '/uploads/products/' + file.filename) || [];

        // Prepare product data
        const productData = {
            name,
            slug,
            section: section || 'bestseller',
            shortDescription,
            description,
            additionalInformation: additionalInformation || '',
            productType,
            sku,
            stock: parseInt(stock) || 0,
            status: status !== 'false',
            availability: availability !== 'false',
            image : mainImagePath,
            galleryImage: galleryImagePaths,
            categoryId: Array.isArray(categoryId) 
                ? categoryId 
                : [categoryId].filter(Boolean),
            subcategoryId: Array.isArray(subcategoryId)
                ? subcategoryId
                : [subcategoryId].filter(Boolean),
            dimensions: {
                length: parseFloat(dimensions?.length) || 0,
                width: parseFloat(dimensions?.width) || 0,
                height: parseFloat(dimensions?.height) || 0
            },
            weight: weight || '0kg',
            metaTitle: metaTitle || '',
            metaDescription: metaDescription || ''
        };

        // Handle pricing based on product type
        if (productType === 'simple') {
            productData.mrp = parseFloat(actualPrice) || 0;
            productData.discountedPrice = parseFloat(discountPrice || actualPrice) || 0;
        }

        console.log(provariants);
        // Handle variant data for variable products
if (productType === 'variable' && provariants) {
    try {
        // Parse the variants if it's a string, otherwise use as-is
        let parsedVariants = typeof provariants === 'string' 
            ? JSON.parse(provariants) 
            : provariants;

    

        // Validate and transform variant data
        productData.variant = parsedVariants.map(v => ({
            variantName: v.variantName || '',
            actualPrice: parseFloat(v.actualPrice) || 0,
            discountPrice: parseFloat(v.discountPrice) || 0,
            stock: parseInt(v.stock) || 0
        }));


         // CORRECTED: Calculate total stock for variable product
        productData.stock = parsedVariants.reduce((sum, v) => {
            return sum + (parseInt(v.stock)) || 0}, 0);

    } catch (e) {
        console.error('Error parsing variant data:', e);
        return res.status(400).json({ 
            success: false,
            message: 'Invalid variant data format. Expected format: [{variantName, actualPrice, stock}]' 
        });
    }
}

        console.log(productData.variant);

        // Validate dimensions
        if (!productData.dimensions || 
            typeof productData.dimensions !== 'object' || 
            !productData.weight) {
            return res.status(400).json({
                success: false,
                message: 'Dimensions and weight are required'
            });
        }

        // Create and save product
        const product = new productModel(productData);
        await product.save();

        // Populate category and subcategory data for response
        const populatedProduct = await productModel.findById(product._id)
            .populate('categoryId', 'name')
            .populate('subcategoryId', 'name');

        // Successful response
        res.status(201).json({ 
            success: true,
            message: 'Product added successfully',
            product: {
                _id: populatedProduct._id,
                name: populatedProduct.name,
                slug: populatedProduct.slug,
                image: populatedProduct.image,
                galleryImage: populatedProduct.galleryImage,
                categoryId: populatedProduct.categoryId,
                subcategoryId: populatedProduct.subcategoryId,
                productType: populatedProduct.productType,
                status: populatedProduct.status,
                availability: populatedProduct.availability
            }
        });

    } catch (error) {
        console.error('Error in addProduct:', error);
        
        // Handle specific errors
        let errorMessage = 'Failed to add product';
        let statusCode = 500;

        if (error.name === 'ValidationError') {
            statusCode = 400;
            errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
        } else if (error.code === 11000) {
            statusCode = 409;
            const field = error.message.includes('slug') ? 'slug' : 'SKU';
            errorMessage = `Product with this ${field} already exists`;
        } else if (error.name === 'CastError') {
            statusCode = 400;
            errorMessage = 'Invalid data format for one or more fields';
        }

        res.status(statusCode).json({ 
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        // Handle file uploads if they exist
        if (req.files?.image?.[0]) {
            product.image = '/uploads/products/' + req.files.image[0].filename;
        } else if (req.body.deletedMainImage === 'true') {
            product.image = ''; // Remove main image if marked for deletion
        }

        // Handle gallery images
        if (req.files?.galleryImage) {
            const newGalleryImages = req.files.galleryImage.map(file => '/uploads/products/' + file.filename);
            
            // Filter out deleted images
            const existingGalleryImages = product.galleryImage.filter(img => {
                return !req.body.deletedGalleryImages?.includes(img);
            });
            
            product.galleryImage = [...existingGalleryImages, ...newGalleryImages];
        } else if (req.body.deletedGalleryImages) {
            // Just remove deleted images if no new ones were uploaded
            product.galleryImage = product.galleryImage.filter(img => {
                return !req.body.deletedGalleryImages.includes(img);
            });
        }

        const {
            name,
            slug,
            section,
            shortDescription,
            description,
            additionalInformation,
            productType,
            sku,
            stock,
            status,
            availability,
            actualPrice,
            discountPrice,
            variant,
            provariants,
            dimensions,
            weight,
            metaTitle,
            metaDescription
        } = req.body;

        // Improved parsing of category and subcategory IDs
        let categoryIds = [];
        let subcategoryIds = [];

        console.log(req.body.categoryId);
        console.log(req.body.subcategoryId);

        try {
            // Handle category IDs - accept both string IDs and objects with _id property
            if (req.body.categoryId) {
                if (Array.isArray(req.body.categoryId)) {
                    categoryIds = req.body.categoryId.map(item => {
                        if (typeof item === 'string') {
                            return item;
                        } else if (item && item._id) {
                            return item._id;
                        }
                        return null;
                    }).filter(Boolean);
                } else if (typeof req.body.categoryId === 'string') {
                    categoryIds = [req.body.categoryId];
                } else if (req.body.categoryId._id) {
                    categoryIds = [req.body.categoryId._id];
                }
            }

            // Handle subcategory IDs - same logic as categories
            if (req.body.subcategoryId) {
                if (Array.isArray(req.body.subcategoryId)) {
                    subcategoryIds = req.body.subcategoryId.map(item => {
                        if (typeof item === 'string') {
                            return item;
                        } else if (item && item._id) {
                            return item._id;
                        }
                        return null;
                    }).filter(Boolean);
                } else if (typeof req.body.subcategoryId === 'string') {
                    subcategoryIds = [req.body.subcategoryId];
                } else if (req.body.subcategoryId._id) {
                    subcategoryIds = [req.body.subcategoryId._id];
                }
            }
        } catch (e) {
            console.error('Error parsing category/subcategory IDs:', e);
            return res.status(400).json({
                success: false,
                message: 'Invalid category or subcategory format'
            });
        }

        // Update product data
        product.name = name || product.name;
        product.slug = slug || product.slug;
        product.section = section || product.section;
        product.shortDescription = shortDescription || product.shortDescription;
        product.description = description || product.description;
        product.additionalInformation = additionalInformation || product.additionalInformation;
        product.productType = productType || product.productType;
        product.sku = sku || product.sku;
        product.status = status !== undefined ? status !== 'false' : product.status;
        product.availability = availability !== undefined ? availability !== 'false' : product.availability;
        product.categoryId = categoryIds.length > 0 ? categoryIds : product.categoryId;
        product.subcategoryId = subcategoryIds.length > 0 ? subcategoryIds : product.subcategoryId;

        // Handle dimensions and weight
        if (dimensions) {
            product.dimensions = {
                length: dimensions.length ? parseFloat(dimensions.length) : product.dimensions.length,
                width: dimensions.width ? parseFloat(dimensions.width) : product.dimensions.width,
                height: dimensions.height ? parseFloat(dimensions.height) : product.dimensions.height
            };
        }
        product.weight = weight || product.weight;

        // Handle meta information
        product.metaTitle = metaTitle || product.metaTitle;
        product.metaDescription = metaDescription || product.metaDescription;

        // Handle pricing based on product type
        if (productType === 'simple') {
            product.mrp = actualPrice !== undefined ? parseFloat(actualPrice) : product.mrp;
            product.discountedPrice = discountPrice !== undefined 
                ? parseFloat(discountPrice) 
                : actualPrice !== undefined 
                    ? parseFloat(actualPrice) 
                    : product.discountedPrice;
            product.stock = stock !== undefined ? parseInt(stock) : product.stock;
        }

        // Handle variant data for variable products
        if (productType === 'variable' && provariants) {
            try {
                let parsedVariants;
                
                if (typeof provariants === 'string') {
                    // Handle case where provariants is a JSON string
                    parsedVariants = JSON.parse(provariants);
                } else if (Array.isArray(provariants)) {
                    // Handle case where provariants is already an array
                    parsedVariants = provariants;
                } else {
                    throw new Error('Invalid variant data format');
                }

                // Validate and transform variant data
                product.variant = parsedVariants.map(v => ({
                    variantName: v.variantName || '',
                    actualPrice: v.actualPrice ? parseFloat(v.actualPrice) : 0,
                    discountPrice: v.discountPrice ? parseFloat(v.discountPrice) : 0,
                    stock: v.stock ? parseInt(v.stock) : 0
                }));

                // Calculate total stock for variable product
                product.stock = product.variant.reduce((sum, v) => sum + (v.stock || 0), 0);
            } catch (e) {
                console.error('Error parsing variant data:', e);
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid variant data format. Expected format: [{variantName, actualPrice, stock}]' 
                });
            }
        }

        await product.save();

        // Populate category and subcategory data for response
        const populatedProduct = await productModel.findById(product._id)
            .populate('categoryId', 'name')
            .populate('subcategoryId', 'name');

        res.json({ 
            success: true,
            message: 'Product updated successfully',
            product: populatedProduct
        });
    } catch (error) {
        console.error('Error updating product:', error);
        
        let errorMessage = 'Failed to update product';
        let statusCode = 500;

        if (error.name === 'ValidationError') {
            statusCode = 400;
            errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
        } else if (error.code === 11000) {
            statusCode = 409;
            const field = error.message.includes('slug') ? 'slug' : 'SKU';
            errorMessage = `Product with this ${field} already exists`;
        } else if (error.name === 'CastError') {
            statusCode = 400;
            errorMessage = 'Invalid data format for one or more fields';
        }

        res.status(statusCode).json({ 
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id)
            .populate('categoryId', '_id name')  // Only get _id and name
            .populate('subcategoryId', '_id name')
            .lean();
            
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure categoryId and subcategoryId are arrays
        const responseData = {
            ...product,
            categoryId: product.categoryId || [],
            subcategoryId: product.subcategoryId || []
        };

        res.json({ 
            message: 'Product found', 
            product: responseData 
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            message: 'Error fetching product', 
            error: error.message 
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ 
            message: 'Error deleting product', 
            error: error.message 
        });
    }
};