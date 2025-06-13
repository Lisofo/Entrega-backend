import fs from 'fs';

class CartManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  async getCarts() {
    const data = await fs.promises.readFile(this.pathFile, 'utf-8');
    return JSON.parse(data);
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id == id);
  }

  async addCart() {
    const carts = await this.getCarts();
    const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id, products: [] };
    carts.push(newCart);
    await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id == cid);
    if (!cart) return null;

    const prod = cart.products.find(p => p.product == pid);
    if (prod) {
      prod.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export default CartManager;
