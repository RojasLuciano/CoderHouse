import { Router } from 'express';
import CartManager from '../api/CartManager.js'

const carts = new CartManager('./carts.json');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await carts.getAll();
        if (req.query.limit && !isNaN(req.query.limit) && !carts) {
            carts = carts.slice(0, req.query.limit);
        }
        return res.json(carts);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
);


router.post('/', async (req, res) => {
    try {
        const cart = await carts.addCart();
        if (!cart) {
            return res.json({ message: "Carrito agregado" });
        }
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
);

router.get('/:cid', async (req, res) => {
    try {
        const cart = await carts.getCart(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        return res.json(cart);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
);

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const result = await carts.addProductToCart(req.params);
        if (!result) {
            return res.json({ message: "Producto agregado al carrito" });
        }
    }
    catch (error) {
        return res.status(404).json({ error: error.message });
    }
}
);

export default router;  