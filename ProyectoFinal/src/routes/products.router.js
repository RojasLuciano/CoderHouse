import { Router } from 'express';
import Manager from '../api/ProductManager.js';

const router = Router();
const items = new Manager('./products.json');

router.get('/', async (req, res) => {
    try {
        if (!isNaN(req.query.limit)) {
            let products = await items.getAll();
            products = products.slice(0, parseInt(req.query.limit));
            if (products) {
                return res.json(products);
            }
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
);

router.get('/:pid', async (req, res) => {
    try {
        const product = await items.getByID(req.params.pid);
        if (product) {
            return res.json(product);
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const product = await items.addProduct(req.body);
        if (!product) {
            return res.status(201).json('Producto agregado');
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const product = await items.updateProduct(req.params.pid, req.body);
        if (!product) {
            return res.status(200).json('Producto actualizado');
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const product = await items.delete(req.params.pid);
        if (!product) {
            return res.status(200).json('Producto eliminado');
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;