import mongoose from 'mongoose';

const ServiceablePincodeSchema = new mongoose.Schema({
  pincode: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v.toString());
      },
      message: props => `${props.value} is not a valid 6-digit pincode!`
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add index for faster queries
ServiceablePincodeSchema.index({ pincode: 1 });
ServiceablePincodeSchema.index({ isActive: 1 });

const ServiceablePincode = mongoose.models.ServiceablePincode || mongoose.model('ServiceablePincode', ServiceablePincodeSchema);
export default ServiceablePincode;