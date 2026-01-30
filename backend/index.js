import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authrouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoute.js";
import subcategoryRouter from "./routes/subcategoryRoute.js";
import couponRouter from "./routes/couponsRoute.js";
import blogRouter from "./routes/blogeRoute.js";
import contactRouter from "./routes/contactRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import bannerRouter from "./routes/bannerRoutes.js";
import serviceablePincodeRouter from "./routes/serviceablePincodeRoute.js";


dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Serve static files from the 'uploads' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authrouter);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subcategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/blog", blogRouter);
app.use("/api/contact", contactRouter);
app.use("/api/order", orderRouter);
app.use("/api/", productRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/pincode", serviceablePincodeRouter);


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));