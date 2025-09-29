import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image : { type: String },
    created_at : { type: Date, default: Date.now },
    });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;