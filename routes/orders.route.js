import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createOrder, getUserOrders,cancelOrder } from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);       
router.get("/", verifyToken, getUserOrders);    
router.patch("/:id/cancel", verifyToken, cancelOrder);

export default router;