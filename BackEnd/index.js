import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from 'morgan';
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));