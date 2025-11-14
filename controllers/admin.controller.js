import Product from "../models/products.model.js";
import Order from "../models/order.model.js";

// Lấy danh sách sản phẩm (có tìm kiếm + phân trang + lọc trạng thái)
export const getAllProducts = async (req, res) => {
  try {
    const { name = "", page = 1, limit = 5, status } = req.query;

    const pageNum = Math.max(Number(page), 1);      // đảm bảo page >= 1
    const limitNum = Math.max(Number(limit), 1);    // đảm bảo limit >= 1

    const query = {
      deleted: false,
      ...(name && { name: { $regex: name, $options: "i" } }),
      ...(status && { status }),
    };


    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ createdAt: 1, _id: 1 })  // ✅ đảm bảo thứ tự ổn định
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({ products, total });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error: error.message });
  }
};

//Lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, deleted: false });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm" });
  }
};

//Thêm sản phẩm
export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo sản phẩm", error: error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
  }
};

// Xóa mềm sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
  }
};

// Cập nhật trạng thái sản phẩm
export const changeProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Product.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(updated); // trả về sản phẩm mới để cập nhật UI
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    // Doanh thu theo tháng (chỉ tính đơn đã duyệt hoặc hoàn tất)
    const revenueByMonthRaw = await Order.aggregate([
      { $match: { status: { $in: ["confirmed", "completed"] } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%m/%Y", date: "$createdAt" }, // ví dụ: "11/2025"
          },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const revenueByMonth = revenueByMonthRaw.map((item) => ({
      month: item._id,
      total: item.total,
    }));

    // rạng thái đơn hàng
    const orderStatus = {
      pending: await Order.countDocuments({ status: "pending" }),
      confirmed: await Order.countDocuments({ status: "confirmed" }),
      completed: await Order.countDocuments({ status: "completed" }),
      cancelled: await Order.countDocuments({ status: "cancelled" }),
    };

    // Top sản phẩm bán chạy (tính từ đơn hàng thực tế)
    const topProductsRaw = await Order.aggregate([
      { $match: { status: { $in: ["confirmed", "completed"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          sold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]);

    const topProducts = await Promise.all(
      topProductsRaw.map(async (item) => {
        const product = await Product.findById(item._id).select("name");
        return {
          name: product?.name || "Không xác định",
          sold: item.sold,
        };
      })
    );

    // Trả về dữ liệu tổng hợp
    res.json({ revenueByMonth, orderStatus, topProducts });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard:", error);
    res.status(500).json({
      message: "Lỗi khi lấy dữ liệu dashboard",
      error: error.message,
    });
  }
};
