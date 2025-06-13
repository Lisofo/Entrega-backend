import express from 'express';
import ProductManager from '../managers/productManager.js';

const router = express.Router();
const manager = new ProductManager('./products.json');

router.get('/', async (req, res) => {
  res.json(await manager.getProducts());
});

router.get('/:pid', async (req, res) => {
  const prod = await manager.getProductById(req.params.pid);
  prod ? res.json(prod) : res.status(404).send('No encontrado');
});

router.post('/', async (req, res) => {
  const prod = await manager.addProduct(req.body);
  res.status(201).json(prod);
});

router.put('/:pid', async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).send('No encontrado');
});

router.delete('/:pid', async (req, res) => {
  await manager.deleteProduct(req.params.pid);
  res.status(204).send();
});

export default router;
