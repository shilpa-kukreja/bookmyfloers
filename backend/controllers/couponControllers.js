import Coupons from "../models/couponModel.js";


export const createCoupon = async (req, res) => {
    try {
        const { 
            couponCode, 
            discount, 
            discounttype, 
            expiryDate, 
            minPurchaseAmount, 
            maxDiscountAmount, 
            isActive 
        } = req.body;

        // Validate required fields
        if (!couponCode || !discount || !discounttype || !expiryDate, !minPurchaseAmount) {
            return res.status(400).json({ 
                success: false, 
                message: "couponCode, discount, discounttype, and expiryDate are required fields" 
            });
        }

        // Create new coupon
        const coupon = new Coupons({
            couponCode,
            discount,
            discounttype,
            expiryDate,
            minPurchaseAmount: minPurchaseAmount || 0,
            maxDiscountAmount,
            isActive: isActive !== undefined ? isActive : true
        });

        // Save to database
        const savedCoupon = await coupon.save();

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: savedCoupon
        });

    } catch (error) {
        if (error.code === 11000 && error.keyPattern.couponCode) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists"
            });
        }
        
        console.error("Error creating coupon:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}; 

export const getAllCoupons = async (req, res) => {
  try {
   


    // Build sort object
    let sortOption = { createdAt: -1 }; // Default: newest first

    const coupons = await Coupons.find()
      .sort(sortOption)
      .select('-__v'); // Exclude version key

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons
    });

  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupons.findById(req.params.id).select('-__v');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: coupon
    });

  } catch (error) {
    console.error('Error fetching coupon:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupons.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting coupon:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { 
      couponCode,
      discount,
      discounttype,
      minPurchaseAmount,
      maxDiscountAmount,
      isActive,
      expiryDate
    } = req.body;

    // Validate required fields
    if (!couponCode || !discount || !discounttype || !expiryDate || minPurchaseAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'couponCode, discount, discountType, expiryDate, and minPurchaseAmount are required fields'
      });
    }

    // Validate discount values
    if (discounttype === 'percentage' && (discount < 1 || discount > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount must be between 1 and 100'
      });
    }

    if (discounttype === 'fixed' && discount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Fixed discount must be greater than 0'
      });
    }

    if (minPurchaseAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Minimum purchase amount cannot be negative'
      });
    }

    // Check if coupon exists
    const existingCoupon = await Coupons.findById(req.params.id);
    if (!existingCoupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if coupon code is being changed to one that already exists
    if (couponCode !== existingCoupon.couponCode) {
      const codeExists = await Coupons.findOne({ couponCode });
      if (codeExists) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
    }

    // Update coupon
    const updatedCoupon = await Coupons.findByIdAndUpdate(
      req.params.id,
      {
        couponCode,
        discount,
        discounttype,
        minPurchaseAmount,
        maxDiscountAmount: discounttype === 'percentage' ? maxDiscountAmount : undefined,
        expiryDate,
        isActive
      },
      { new: true, runValidators: true }
    ).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: updatedCoupon
    });

  } catch (error) {
    console.error('Error updating coupon:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon ID format'
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