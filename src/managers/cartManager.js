import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
  constructor(pathFile) {
    this.pathFile = path.join(__dirname, '..', pathFile);
  }

  async getCarts() {
    try {
      if (!fs.existsSync(this.pathFile)) {
        await fs.promises.writeFile(this.pathFile, JSON.stringify([], null, 2));
        return [];
      }
      const data = await fs.promises.readFile(this.pathFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error al obtener carritos: ${error.message}`);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find(c => c.id == id);
      if (!cart) throw new Error('Carrito no encontrado');
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener carrito: ${error.message}`);
    }
  }

  async addCart() {
    try {
      const carts = await this.getCarts();
      const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
      const newCart = { id, products: [] };
      carts.push(newCart);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      throw new Error(`Error al crear carrito: ${error.message}`);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex(c => c.id == cid);
      
      if (cartIndex === -1) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = carts[cartIndex].products.findIndex(p => p.product == pid);
      
      if (productIndex !== -1) {
        carts[cartIndex].products[productIndex].quantity++;
      } else {
        carts[cartIndex].products.push({ product: pid, quantity: 1 });
      }

      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
      return carts[cartIndex];
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }
}

export default CartManager;