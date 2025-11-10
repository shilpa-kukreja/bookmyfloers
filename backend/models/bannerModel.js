import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    image : { type: String },
    link : { type: String },
    status : { type: Boolean, default: true },
    position : { type: String },
    created_at : { type: Date, default: Date.now }
});

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
export default Banner;