import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  clearCart
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/cart", verifyToken, addToCart);

router.get("/cart", verifyToken, getCart);

router.delete("/cart/clear", verifyToken, clearCart);

router.delete("/cart/:productId", verifyToken, removeFromCart);

router.patch('/cart/:productId', verifyToken, updateCartQuantity);


export default router;
