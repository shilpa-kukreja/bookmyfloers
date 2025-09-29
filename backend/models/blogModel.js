import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    author : {
        type: String,
        required: true
        },
    image: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
    },
    description: {
        type: String,
        required: true
    },
    metaTitle : {
        type: String,
        required: true
    },
    metaDescription : {
        type: String,
        required: true
    },
        
    created_at : {
        type: Date,
        default: Date.now
        }
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
