import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number }, // giá tại thời điểm mua
      },
    ],
    method: {
      type: String,
      enum: ["cod", "store"],
      required: true,
    },
    info: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String },
      date: { type: String },
      time: { type: String },
    },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);