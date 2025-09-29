import Contact from '../models/contactModel.js';

// Create a new contact enquiry
export const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message
    });

    const savedContact = await newContact.save();
    
    res.status(201).json({
      success: true,
      message: 'Contact enquiry submitted successfully',
      data: savedContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact enquiry',
      error: error.message
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    // Get all contacts sorted by createdAt (newest first)
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact enquiries',
      error: error.message
    });
  }
};

// Get single contact enquiry
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact enquiry',
      error: error.message
    });
  }
};

// Update contact enquiry status
export const updateContact = async (req, res) => {
  try {
    const { status, response } = req.body;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, response, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact enquiry updated successfully',
      data: updatedContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update contact enquiry',
      error: error.message
    });
  }
};

// Delete contact enquiry
export const deleteContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact enquiry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact enquiry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact enquiry',
      error: error.message
    });
  }
};