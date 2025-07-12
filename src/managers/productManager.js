import fs from 'fs';

class ProductManager {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  generateNewId(products) {
    if (products.length > 0) {
      return products[products.length - 1].id + 1;
    } else {
      return 1;
    }
  }

  async getProducts() {
    const data = await fs.promises.readFile(this.pathFile, 'utf-8');
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id == id);
  }

  async addProduct(newProduct) {
    const products = await this.getProducts();
    const id = this.generateNewId(products);
    const product = { id, ...newProduct };
    products.push(product);
    await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2));
    return product;
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updatedFields, id: products[index].id };
    await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id != id);
    await fs.promises.writeFile(this.pathFile, JSON.stringify(filtered, null, 2));
  }
}

export const productManagerInstance = new ProductManager('./products.json');
