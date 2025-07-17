import express from 'express';
import { productManagerInstance } from '../managers/productManager.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await productManagerInstance.getProducts();
  res.render('home', { 
    products,
    useSocket: false
  });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await productManagerInstance.getProducts();
  res.render('realTimeProducts', { 
    products,
    useSocket: true
  });
});

export default router;