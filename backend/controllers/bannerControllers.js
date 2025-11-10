import Banner from "../models/bannerModel.js";

export const createBanner = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ 
                status: 'error',
                error: "Image is required" 
            });
        }

        // Correct way to get the image path
        const image = `/uploads/banner/${req.file.filename}`;
        
        const { link, position = 100, status = true } = req.body;

        const banner = new Banner({ 
            image,
            link,
            position,
            status
        });
        
        await banner.save();
        
        res.status(201).json({
            status: 'success',
            message: "Banner created successfully",
            data: banner,
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
};

export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ position: 1, created_at: -1 });
        res.status(200).json({
            status: 'success',
            data: banners,
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
};

export const getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ 
                status: 'error',
                error: "Banner not found" 
            });
        }
        res.status(200).json({
            status: 'success',
            data: banner,
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
};

export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ 
                status: 'error',
                error: "Banner not found" 
            });
        }
        res.status(200).json({
            status: 'success',
            message: "Banner deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
};

// Add updateBanner function
export const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const { link, position, status } = req.body;
        
        let updateData = { link, position, status };
        
        // If new image is uploaded, update the image path
        if (req.file) {
            updateData.image = `/uploads/banner/${req.file.filename}`;
        }
        
        const banner = await Banner.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        if (!banner) {
            return res.status(404).json({ 
                status: 'error',
                error: "Banner not found" 
            });
        }
        
        res.status(200).json({
            status: 'success',
            message: "Banner updated successfully",
            data: banner,
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            error: error.message 
        });
    }
};