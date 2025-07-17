import express from 'express';
import { productManagerInstance } from '../managers/productManager.js';
import { io } from '../app.js';

const router = express.Router();

router.get('/', async (req, res) => {
  res.json(await productManagerInstance.getProducts());
});

router.get('/:pid', async (req, res) => {
  const prod = await productManagerInstance.getProductById(req.params.pid);
  prod ? res.json(prod) : res.status(404).send('No encontrado');
});

router.post('/', async (req, res) => {
  try {
    const prod = await productManagerInstance.addProduct(req.body);
    io.emit('updateProducts', await productManagerInstance.getProducts());
    res.status(201).json(prod);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  const updated = await productManagerInstance.updateProduct(req.params.pid, req.body);
  if (updated) {
    io.emit('updateProducts', await productManagerInstance.getProducts());
    res.json(updated);
  } else {
    res.status(404).send('No encontrado');
  }
});

router.delete('/:pid', async (req, res) => {
  await productManagerInstance.deleteProduct(req.params.pid);
  io.emit('updateProducts', await productManagerInstance.getProducts());
  res.status(204).send();
});

export default router;