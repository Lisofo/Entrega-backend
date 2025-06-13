import express from 'express';
import CartManager from '../managers/cartManager.js';

const router = express.Router();
const manager = new CartManager('./carts.json');

router.post('/', async (req, res) => {
  const cart = await manager.addCart();
  res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
  const cart = await manager.getCartById(req.params.cid);
  cart ? res.json(cart) : res.status(404).send('No encontrado');
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await manager.addProductToCart(req.params.cid, req.params.pid);
  cart ? res.json(cart) : res.status(404).send('Carrito no encontrado');
});

export default router;
