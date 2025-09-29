import mongoose from "mongoose";


const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug : { type: String, required: true },
    categoryId : { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image : { type: String },
    created_at : { type: Date, default: Date.now }
    });

const SubCategory = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);
export default SubCategory;