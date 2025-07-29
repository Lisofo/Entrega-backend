import { Product } from '../models/product.model.js';

export class ProductsService {
  static async getProducts() {
    return await Product.find({});
  }

  static async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Product code already exists');
      }
      throw error;
    }
  }

  static async updateProduct(id, updatedFields) {
    const product = await Product.findByIdAndUpdate(
      id, 
      updatedFields, 
      { new: true, runValidators: true }
    );
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async getPaginatedProducts({ limit = 10, page = 1, sort, query }) {
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined
    };

    const filter = query ? {
      $or: [
        { category: { $regex: query, $options: 'i' } },
        { status: query === 'available' ? true : false }
      ]
    } : {};

    const result = await Product.paginate(filter, options);
    
    return {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage || null,
      nextPage: result.nextPage || null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? 
        `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort || ''}&query=${query || ''}` : null,
      nextLink: result.hasNextPage ?
        `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort || ''}&query=${query || ''}` : null
    };
  }
}