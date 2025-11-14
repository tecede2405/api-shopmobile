import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  changeProductStatus, 
  getDashboardStats
} from '../controllers/admin.controller.js';
import { getAllOrders,confirmOrder } from "../controllers/orders.controller.js";
import { verifyAdmin } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get('/products', verifyAdmin, getAllProducts); // /api/admin/products
router.get('/products/:id', verifyAdmin, getProductById);
router.post('/products', verifyAdmin, createProduct);
router.put('/products/:id', verifyAdmin, updateProduct);
router.patch('/products/:id/status', verifyAdmin, changeProductStatus);
router.delete('/products/:id', verifyAdmin, deleteProduct);

//duyệt đơn hàng
router.get("/orders", verifyAdmin, getAllOrders);
router.patch("/orders/:id/confirm", verifyAdmin, confirmOrder);

router.get("/dashboard", verifyAdmin, getDashboardStats);

export default router;
