import ServiceablePincode from '../models/serviceablePincodeModel.js';

// Get all pincodes
export const getAllPincodes = async (req, res) => {
  try {
    const pincodes = await ServiceablePincode.find().sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: pincodes
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Add single pincode
export const addPincode = async (req, res) => {
  try {
    const { pincode, isActive = true } = req.body;

    // Validation
    if (!pincode) {
      return res.status(400).json({
        status: 'error',
        message: 'Pincode is required'
      });
    }

    if (!/^\d{6}$/.test(pincode.toString())) {
      return res.status(400).json({
        status: 'error',
        message: 'Pincode must be a 6-digit number'
      });
    }

    // Check if pincode already exists
    const existingPincode = await ServiceablePincode.findOne({ pincode: Number(pincode) });
    if (existingPincode) {
      return res.status(400).json({
        status: 'error',
        message: 'Pincode already exists'
      });
    }

    // Create new pincode
    const newPincode = await ServiceablePincode.create({
      pincode: Number(pincode),
      isActive: Boolean(isActive)
    });

    res.status(201).json({
      status: 'success',
      message: 'Pincode added successfully',
      data: newPincode
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Add multiple pincodes
export const addMultiplePincodes = async (req, res) => {
  try {
    const { pincodes } = req.body;

    // Validation
    if (!Array.isArray(pincodes) || pincodes.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Pincodes array is required and should not be empty'
      });
    }

    // Validate each pincode
    const validPincodes = [];
    const errors = [];

    for (const [index, item] of pincodes.entries()) {
      const { pincode, isActive = true } = item;

      if (!pincode) {
        errors.push({
          index,
          pincode,
          error: 'Pincode is required'
        });
        continue;
      }

      if (!/^\d{6}$/.test(pincode.toString())) {
        errors.push({
          index,
          pincode,
          error: 'Pincode must be a 6-digit number'
        });
        continue;
      }

      const pincodeNumber = Number(pincode);
      
      // Check for duplicates in request
      const isDuplicateInRequest = validPincodes.some(p => p.pincode === pincodeNumber);
      if (isDuplicateInRequest) {
        errors.push({
          index,
          pincode: pincodeNumber,
          error: 'Duplicate pincode in request'
        });
        continue;
      }

      validPincodes.push({
        pincode: pincodeNumber,
        isActive: Boolean(isActive)
      });
    }

    // Check for existing pincodes in database
    const existingPincodes = await ServiceablePincode.find({
      pincode: { $in: validPincodes.map(p => p.pincode) }
    });

    const existingPinValues = existingPincodes.map(p => p.pincode);
    const newPincodes = validPincodes.filter(p => !existingPinValues.includes(p.pincode));

    // Add errors for duplicates in database
    existingPincodes.forEach((existing, index) => {
      errors.push({
        index: validPincodes.findIndex(p => p.pincode === existing.pincode),
        pincode: existing.pincode,
        error: 'Pincode already exists in database'
      });
    });

    if (newPincodes.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No new pincodes to add',
        errors,
        totalRequested: pincodes.length,
        valid: validPincodes.length,
        duplicates: errors.length
      });
    }

    // Insert new pincodes
    const insertedPincodes = await ServiceablePincode.insertMany(newPincodes);

    res.status(201).json({
      status: 'success',
      message: `${insertedPincodes.length} pincode(s) added successfully`,
      data: insertedPincodes,
      summary: {
        totalRequested: pincodes.length,
        added: insertedPincodes.length,
        duplicates: errors.length,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update pincode
export const updatePincode = async (req, res) => {
  try {
    const { id } = req.params;
    const { pincode, isActive } = req.body;

    // Find pincode
    const existingPincode = await ServiceablePincode.findById(id);
    if (!existingPincode) {
      return res.status(404).json({
        status: 'error',
        message: 'Pincode not found'
      });
    }

    // If pincode is being changed, check for duplicates
    if (pincode && pincode !== existingPincode.pincode) {
      if (!/^\d{6}$/.test(pincode.toString())) {
        return res.status(400).json({
          status: 'error',
          message: 'Pincode must be a 6-digit number'
        });
      }

      const duplicatePincode = await ServiceablePincode.findOne({
        pincode: Number(pincode),
        _id: { $ne: id }
      });

      if (duplicatePincode) {
        return res.status(400).json({
          status: 'error',
          message: 'Pincode already exists'
        });
      }

      existingPincode.pincode = Number(pincode);
    }

    // Update other fields
    if (isActive !== undefined) {
      existingPincode.isActive = Boolean(isActive);
    }

    await existingPincode.save();

    res.status(200).json({
      status: 'success',
      message: 'Pincode updated successfully',
      data: existingPincode
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Bulk update pincode status
export const bulkUpdatePincodes = async (req, res) => {
  try {
    const { pincodeIds, isActive } = req.body;

    // Validation
    if (!Array.isArray(pincodeIds) || pincodeIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Pincode IDs array is required'
      });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        status: 'error',
        message: 'isActive must be a boolean value'
      });
    }

    // Update pincodes
    const result = await ServiceablePincode.updateMany(
      { _id: { $in: pincodeIds } },
      { isActive, updatedAt: Date.now() }
    );

    res.status(200).json({
      status: 'success',
      message: `${result.modifiedCount} pincode(s) updated successfully`,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete single pincode
export const deletePincode = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPincode = await ServiceablePincode.findByIdAndDelete(id);
    if (!deletedPincode) {
      return res.status(404).json({
        status: 'error',
        message: 'Pincode not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Pincode deleted successfully',
      data: deletedPincode
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Bulk delete pincodes
export const bulkDeletePincodes = async (req, res) => {
  try {
    const { pincodeIds } = req.body;

    // Validation
    if (!Array.isArray(pincodeIds) || pincodeIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Pincode IDs array is required'
      });
    }

    // Delete pincodes
    const result = await ServiceablePincode.deleteMany({ _id: { $in: pincodeIds } });

    res.status(200).json({
      status: 'success',
      message: `${result.deletedCount} pincode(s) deleted successfully`,
      data: {
        deleted: result.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const checkPincode = async (req, res) => {
  try {
    const { pincode } = req.body;   // Assuming the pincode is sent in the request body
    if (!pincode || !/^\d{6}$/.test(pincode.toString())) {
      return res.status(400).json({ error: 'Pincode is required and must be a 6-digit number' });
    }

    const pincodeNumber = Number(pincode);
    const pincodeExists = await ServiceablePincode.findOne({ pincode: pincodeNumber });

    if(!pincodeExists){
        res.status(200).json({ status: 'error', message: pincodeExists ? 'Pincode exists' : 'Pincode does not exist' });
        return;
    }

    res.status(200).json({ status: 'success', data: pincodeExists, message: pincodeExists ? 'Pincode exists' : 'Pincode Not Serviceable' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};