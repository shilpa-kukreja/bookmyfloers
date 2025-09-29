import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
    variantName: { type: String, required: true },
    actualPrice: { type: Number, required: true },
    discountPrice: { type: Number , required: true },
    stock : { type: Number, required: true },
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    section: { 
        type: String, 
        enum: ['bestseller', 'featured', 'new', 'regular'], 
        default: 'bestseller' 
    },
    image: { type: String, required: true },
    galleryImage: [{ type: String }],
    mrp: { type: Number },
    discountedPrice: { type: Number },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    additionalInformation: { type: String, default : '' },
    categoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    subcategoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
    productType: { 
        type: String, 
        enum: ['simple', 'variable'], 
        default: 'simple' 
    },
    variant: [variantSchema],
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
    dimensions: { type: Array, required : true },
    weight: { type: String },
    availability: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
// productSchema.pre('save', function(next) {
//     this.updatedAt = Date.now();
//     next();
// });

const productModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export default productModel;