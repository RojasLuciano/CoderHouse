import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Cart from '../models/cart.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataCart = path.join(__dirname, '../data/carts.json');
const dataProducts = path.join(__dirname, '../data/products.json');

const readFile = async (file) => {
    try {
        const data = await fs.promises.readFile(file, 'utf-8', (err, data) => {
            if (err) throw err
            return data
        })
        return JSON.parse(data)
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

/**
 * Get next id
 * @returns 
 */
const getNextId = async () => {
    try {
        const items = await readFile(dataCart);
        return items.length > 0 ? items[items.length - 1].id + 1 : 1;
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

/**
 * Adds a new cart
 * @param {*} req 
 * @param {*} res 
 */
const addCart = async (req, res) => {
    try {
        const carts = await readFile(dataCart);
        console.log(carts);
        const newCart = new Cart();
        newCart.id = await getNextId();
        carts.push(newCart);
        await fs.promises.writeFile(dataCart, JSON.stringify(carts, null, '\t'));
        res.status(200).json('Carrito creado con exito.' + ' ID: ' + newCart.id);
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

/**
 * Gets a cart by id
 * @param {*} req 
 * @param {*} res 
 */
const getCart = async (req, res) => {
    try {
        const carts = await readFile(dataCart);
        const cart = carts.find(cart => cart.id === parseInt(req.params.cid));
        if (cart) {
            res.send(cart.products);
        } else {
            res.status(404).json('Carrito no encontrado.');
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

/**
 * Adds a product to a cart and updates the quantity
 * @param {*} req 
 * @param {*} res 
 */
const addProductToCart = async (req, res) => {
    try {
        const products = await readFile(dataProducts);
        const product = products.find(product => product.id === parseInt(req.params.pid));
        if (product) {
            const carts = await readFile(dataCart);
            const cart = carts.find(cart => cart.id === parseInt(req.params.cid));
            if (cart) {
                const productInCart = cart.products.find(product => product.id === parseInt(req.params.pid));
                if (productInCart) {
                    productInCart.quantity += product.stock;
                } else {
                    cart.products.push({ id: product.id, quantity: product.stock });
                }
                await fs.promises.writeFile(dataCart, JSON.stringify(carts, null, '\t'));
                res.status(200).json('Producto agregado al carrito con exito.');
            } else {
                res.status(404).json('Carrito no encontrado.');
            }
        } else {
            res.status(404).json('Producto no encontrado.');
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

export const cartController = {
    addCart, getCart, addProductToCart
}