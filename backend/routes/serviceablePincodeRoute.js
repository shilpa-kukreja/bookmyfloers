import express from 'express';
import {
  getAllPincodes,
  addPincode,
  addMultiplePincodes,
  updatePincode,
  bulkUpdatePincodes,
  deletePincode,
  bulkDeletePincodes,
  checkPincode
} from '../controllers/serviceablePincodeControllers.js';

const serviceablePincodeRouter = express.Router();

// GET all pincodes
serviceablePincodeRouter.get('/all', getAllPincodes);

// POST add single pincode
serviceablePincodeRouter.post('/add', addPincode);

// POST add multiple pincodes
serviceablePincodeRouter.post('/add-multiple', addMultiplePincodes);

// PUT update single pincode
serviceablePincodeRouter.put('/update/:id', updatePincode);

// PUT bulk update pincodes
serviceablePincodeRouter.put('/bulk-update', bulkUpdatePincodes);

// DELETE single pincode
serviceablePincodeRouter.delete('/delete/:id', deletePincode);

// POST bulk delete pincodes
serviceablePincodeRouter.post('/bulk-delete', bulkDeletePincodes);

serviceablePincodeRouter.post('/check-pincode', checkPincode);

export default serviceablePincodeRouter;