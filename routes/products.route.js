import express from 'express';
import { index, getFilteredProducts,searchByName,getProductsByCategory, getProductsByDiscount } from '../controllers/product.controller.js';

const router = express.Router();

//Trang chủ (lấy ra tất cả sản phẩm )
router.get('/', (req, res) => {
  if (Object.keys(req.query).length > 0) {
    return getFilteredProducts(req, res);
  } else {
    return index(req, res);
  }
});
// Trang tìm kiếm
router.get('/search', searchByName);

// Trang lọc sản phẩm theo danh mục
router.get('/category/:category', getProductsByCategory); // 👈 Thêm dòng này

// Lọc sản phẩm giảm giá trên X%
router.get("/discount/:percentage", getProductsByDiscount);


export default router;
