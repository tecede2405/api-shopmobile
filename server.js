import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import productsRoute from "./routes/products.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/users.route.js";
import orderRoutes from "./routes/orders.route.js";


dotenv.config();
const app = express();

// Kết nối MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productsRoute);
app.use("/api/admin", adminRoutes);
app.use('/api/auth', authRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Kiểm tra API hoạt động
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
