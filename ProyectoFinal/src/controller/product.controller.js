import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataProducts = path.join(__dirname, '../data/products.json');

/**
 * Read data from file
 * @param {*} file 
 * @returns 
 */
const readFile = async (file) => {
    try {
        const data = await fs.promises.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                return err;
            }
            return data;
        });
        return JSON.parse(data);
    }
    catch (error) {
        return error;
    }
}

/**
 * Get next id
 * @returns 
 */
const getNextId = async () => {
    try {
        const items = await readFile(dataProducts);
        return items.length > 0 ? items[items.length - 1].id + 1 : 1;
    }
    catch (error) {
        return error;
    }
}

/**
 * Get product by id
 * @param {*} req 
 * @param {*} res 
 */
const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const dataData = await readFile(dataProducts);
        if (!pid) {
            res.send(dataData)
        } else {
            const info = dataData.find(product => product.id == pid)
            if (info) {
                res.send(info)
            } else {
                res.status(400).json({ error: 'producto no encontrado' })
            }
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

/**
 * Get products
 * @param {*} req 
 * @param {*} res 
 */
const getProducts = async (req, res) => {
    try {
        const { limit } = req.query;
        const dataData = await readFile(dataProducts);
        if (limit) {
            const limitData = dataData.slice(0, limit);
            res.send(limitData);
        }
        else {
            res.send(dataData);
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

/**
 * Add product
 * @param {*} req 
 * @param {*} res 
 */
const addProduct = async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        const newProduct = new Product(title, description, price, thumbnail, code, stock, category);
        const dataData = await readFile(dataProducts);
        newProduct.id = await getNextId();
        dataData.push(newProduct);
        await fs.promises.writeFile(dataProducts, JSON.stringify(dataData, null, '\t'));
        res.status(200).json({ msg: 'Producto agregado con exito', data: newProduct });
    }
    catch (error) {
        console.error(`Error: ${error}`)
    }
}

/**
 * Update product by id
 * @param {*} req 
 * @param {*} res 
 */
const updateProduct = async (req, res) => {
    const items = await readFile(dataProducts);
    const index = await items.findIndex(product => product.id == parseInt(req.params.pid));
    if (index >= 0) {
        items[index] = { ...items[index], ...req.body };
        await fs.promises.writeFile(dataProducts, JSON.stringify(items, null, '\t'));
        res.status(200).json({ msg: 'Producto actualizado con exito', data: items[index] });
    } else {
        res.status(400).json({ error: 'producto no encontrado' })
    }
}

/**
 * Delete product by id
 * @param {*} req 
 * @param {*} res 
 */
const deleteProduct = async (req, res) => {
    const items = await readFile(dataProducts);
    const index = await items.findIndex(product => product.id ==  parseInt(req.params.pid));
    if (index >= 0) {
        items.splice(index, 1);
        await fs.promises.writeFile(dataProducts, JSON.stringify(items, null, '\t'));
        res.status(200).json({ msg: 'Producto eliminado con exito' });
    } else {
        res.status(400).json({ error: 'producto no encontrado' })
    }
}

export const productController = {
    getProductById, addProduct, updateProduct, deleteProduct, getProducts
}
