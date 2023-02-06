import fs from 'fs'
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
 * Get products
 */
const getProducts = async () => {
    try {
        const dataData = await readFile(dataProducts);
        if (dataData) {
            return dataData;
        } else {
            throw new Error('No hay productos cargados');
        }
    } catch (error) {
        console.error(`Error getProducts: ${error}`)
    }
}

/**
 * Add product
 * @param {*} product 
 * @returns 
 */
const addProduct = async (product) => {
    const dataData = await readFile(dataProducts);
    const { title, description, price, thumbnail, code, stock, category } = product;
    if (dataData.find(product => product.code == code)) {
        throw new Error('El producto ya existe');
    }
    else {
        const newProduct = new Product(title, description, parseInt(price), thumbnail, parseInt(code), parseInt(stock), category);
        newProduct.id = await getNextId();
        dataData.push(newProduct);
        await fs.promises.writeFile(dataProducts, JSON.stringify(dataData, null, '\t'));
        return newProduct;
    }
}

/**
 * Delete product by id
 * @param {*} req 
 * @param {*} res 
 */
const deleteProduct = async (id) => {
    const dataData = await readFile(dataProducts);
    const product = dataData.find(product => product.id == id);
    if (product) {
        const newProducts = dataData.filter(product => product.id != id);
        await fs.promises.writeFile(dataProducts, JSON.stringify(newProducts, null, '\t'));
        return product;
    }
    else {
        throw new Error('El producto no existe');
    }
}


export const productController = {
    getProducts, addProduct, deleteProduct
}

