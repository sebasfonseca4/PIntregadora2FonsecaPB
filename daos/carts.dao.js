// cart.dao.js
import Cart from "../schemas/carts.schema.js";

class CartDAO {
  static async getByUserId(userId) {
    return await Cart.findOne({ userId }).populate('products').lean();
  }

  static async addProduct(userId, productId) {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [productId], total: 0 });
    } else {
      cart.products.push(productId);
    }

    await cart.save();

    return cart;
  }
}

export default CartDAO;
