// models/Coupon.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
 couponCode : { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  discounttype: { type: String, required: true },  
  expiryDate: { type: Date, required: true }, 
  minPurchaseAmount: { type: Number, default: 0 }, 
  maxDiscountAmount: { type: Number }, 
  isActive: { type: Boolean, default: true }, 
  createdAt: { type: Date, default: Date.now },
});

const Coupons =  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupons;
