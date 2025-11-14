import User from "../models/users.model.js";

// Thêm vào giỏ
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.id);
    const exist = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (exist) exist.quantity += quantity;
    else user.cart.push({ productId, quantity });

    await user.save();
    res.json({ message: "Đã thêm vào giỏ hàng", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm giỏ hàng", error: error.message });
  }
};

// Xem giỏ
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    await user.populate("cart.productId");
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error: error.message });
  }
};

// Xóa 1 sản phẩm
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== req.params.productId
    );
    await user.save();
    await user.populate("cart.productId");
    res.json({ message: "Đã xóa sản phẩm", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa giỏ hàng", error: error.message });
  }
};

// Sửa số lượng
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(userId);
    const item = user.cart.find((i) => i.productId.toString() === productId);

    if (item) {
      item.quantity = quantity;
      await user.save();
      await user.populate("cart.productId");
      return res.json({ message: "Cập nhật số lượng thành công", cart: user.cart });
    }

    res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

//  Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    user.cart = [];
    await user.save();

    res.json({ message: "Đã xóa tất cả sản phẩm trong giỏ hàng", cart: [] });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa giỏ hàng", error: error.message });
  }
};



