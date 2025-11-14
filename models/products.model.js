import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String, // ví dụ: "Apple", "Samsung", "Xiaomi"
      required: true,
    },
    category: {
      type: String,
      required: true, // ví dụ: "smartphone", "tablet", "laptop", "accessory"
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0, // % giảm giá
    },
    stock: {
      type: Number,
      required: true, // số lượng còn trong kho
    },
    thumbnail: {
      type: String, // ảnh chính
      required: true,
    },
    images: [
      {
        type: String, // ảnh phụ 
      },
    ],
    specs: {
      screen: String, // thông số kỹ thuật
      chip: String,
      ram: String,
      storage: String,
      battery: String,
      camera: String,
      weight: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "coming"], // còn bán, ngừng bán, sắp ra mắt
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false, // true = bị xóa mềm
    },
  },
  {
    timestamps: true, //createAt và updateAt
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
