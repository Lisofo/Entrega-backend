import { Cart } from '../models/cart.model.js';

export class CartService {
  static async createCart() {
    return await Cart.create({ products: [] });
  }

  static async getCartById(id) {
    const cart = await Cart.findById(id).populate('products.product');
    if (!cart) throw new Error('Cart not found');
    return cart;
  }

  static async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const existingProduct = cart.products.find(
      p => p.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cart.save();
  }

  static async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    cart.products = cart.products.filter(
      p => p.product.toString() !== productId
    );

    return await cart.save();
  }

  static async updateCart(cartId, products) {
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { products },
      { new: true }
    );
    if (!cart) throw new Error('Cart not found');
    return cart;
  }

  static async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const product = cart.products.find(
      p => p.product.toString() === productId
    );
    if (!product) throw new Error('Product not in cart');

    product.quantity = quantity;
    return await cart.save();
  }

  static async clearCart(cartId) {
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
    if (!cart) throw new Error('Cart not found');
    return cart;
  }
}