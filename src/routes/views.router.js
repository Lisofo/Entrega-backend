import express from 'express';
import { ProductsService } from '../services/products.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await ProductsService.getProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await ProductsService.getPaginatedProducts({ limit, page, sort, query });
    res.render('products', result);
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductsService.getProductById(req.params.pid);
    res.render('productDetail', { product });
  } catch (error) {
    res.status(404).render('error', { error: error.message });
  }
});

export default router;