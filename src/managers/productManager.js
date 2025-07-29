import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
  constructor(pathFile) {
    this.pathFile = path.join(__dirname, '..', pathFile); // Agregamos '..' para subir un nivel
  }

  validateProduct(product) {
    const requiredFields = ['title', 'description', 'price', 'code', 'stock', 'category'];
    const missingFields = requiredFields.filter(field => !product[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
    }

    if (typeof product.price !== 'number' || product.price <= 0) {
      throw new Error('El precio debe ser un número mayor a 0');
    }

    if (typeof product.stock !== 'number' || product.stock < 0) {
      throw new Error('El stock debe ser un número positivo');
    }
  }

  generateNewId(products) {
    if (products.length > 0) {
      return products[products.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.pathFile)) {
        await fs.promises.writeFile(this.pathFile, JSON.stringify([], null, 2));
        return [];
      }
      const data = await fs.promises.readFile(this.pathFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find(p => p.id == id);
      if (!product) throw new Error('Producto no encontrado');
      return product;
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  async addProduct(newProduct) {
    try {
      this.validateProduct(newProduct);
      const products = await this.getProducts();
      
      const codeExists = products.some(p => p.code === newProduct.code);
      if (codeExists) {
        throw new Error('El código del producto ya existe');
      }

      const id = this.generateNewId(products);
      const product = { 
        id, 
        status: true,
        thumbnails: [],
        ...newProduct 
      };
      
      products.push(product);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2));
      return product;
    } catch (error) {
      throw new Error(`Error al agregar producto: ${error.message}`);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex(p => p.id == id);
      
      if (index === -1) {
        throw new Error('Producto no encontrado');
      }

      if (updatedFields.code) {
        const codeExists = products.some(p => p.code === updatedFields.code && p.id != id);
        if (codeExists) {
          throw new Error('El código del producto ya existe en otro producto');
        }
      }

      products[index] = { 
        ...products[index], 
        ...updatedFields, 
        id: products[index].id 
      };
      
      await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const filtered = products.filter(p => p.id != id);
      
      if (products.length === filtered.length) {
        throw new Error('Producto no encontrado');
      }
      
      await fs.promises.writeFile(this.pathFile, JSON.stringify(filtered, null, 2));
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

export const productManagerInstance = new ProductManager('products.json');