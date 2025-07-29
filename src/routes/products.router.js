import express from 'express';
import { ProductsService } from '../services/products.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await ProductsService.getPaginatedProducts({ limit, page, sort, query });
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await ProductsService.getProductById(req.params.pid);
    res.json({ status: 'success', payload: product });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await ProductsService.createProduct(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await ProductsService.updateProduct(
      req.params.pid, 
      req.body
    );
    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await ProductsService.deleteProduct(req.params.pid);
    res.status(204).end();
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const products = await ProductsService.getProductsByCategory(
      req.params.category
    );
    res.json({ status: 'success', payload: products });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;