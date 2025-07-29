import express from 'express';
import { CartService } from '../services/carts.service.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newCart = await CartService.createCart();
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await CartService.getCartById(req.params.cid);
    res.render('cart', { cart });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await CartService.addProductToCart(cid, pid, quantity);
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartService.removeProductFromCart(
      req.params.cid, 
      req.params.pid
    );
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const cart = await CartService.updateCart(
      req.params.cid, 
      req.body.products
    );
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartService.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      req.body.quantity
    );
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await CartService.clearCart(req.params.cid);
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;