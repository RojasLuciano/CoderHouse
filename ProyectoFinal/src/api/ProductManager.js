import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require("fs");
import Product from "../class/Product.js";

class ProductManager {
    /**
     * Builds a new ProductManager
     * @param {*} path  Path to the file where the products are stored
     */
    constructor(path) {
        if (!path) {
            throw new Error("No se ha especificado un archivo");
        }
        else {
            this.path = path;
            fs.existsSync(path)
                ? this.items = JSON.parse(fs.readFileSync(this.path, "utf-8"))
                : this.items = [];
        }
    }

    /**
     * Gets all the products
     * @returns All the products
     */
    async getAll() {
        return this.items;
    }

    /**
     * Gets a product by its id
     * @param {*} id id of the product to be retrieved
     * @returns the product
     */
    async getByID(id) {
        const item = this.items.find((item) => item.id === parseInt(id));
        if (item) {
            return item;
        }
        else {
            throw new Error("El producto no existe");
        }
    }

    /**
     * Gets the next id for a new product
     * @returns the next id
     */
    async getNextId() {
        return this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1;
    }

    /**
     * Adds a new product to the file
     * @param {*} item the product to be added
     */
    async addProduct(item) {
        const newProduct = new Product(item.title, item.description, item.price, item.thumbnail, item.code, item.stock, item.category);
        if (!this.items.find((p) => p.code === (newProduct.code))) {
            newProduct['id'] = await this.getNextId();
            this.items.push(newProduct);
            await fs.writeFileSync(this.path, JSON.stringify(this.items, null, "\t"));
        }
        else {
            throw new Error("El producto ya existe");
        }
    }

    /**
     * Updates a product
     * @param {*} id   id of the product to be updated
     * @param {*} product product with the new values
     */
    async updateProduct(id, product) {
        const index = await this.items.findIndex((p) => p.id === parseInt(id));
        if (index >= 0) {
            this.items[index] = { ...this.items[index], ...product };
            await fs.writeFileSync(this
                .path, JSON.stringify(this.items, null, "\t"));
        }
        else {
            throw new Error("El producto no existe");
        }
    }

    /**
     * Deletes a product
     * @param {*} id id of the product to be deleted
     */
    async delete(id) {
        const index = await this.items.findIndex((p) => p.id === parseInt(id));
        if (index >= 0) {
            this.items.splice(index, 1);
            await fs.writeFileSync(this
                .path, JSON.stringify(this.items, null, "\t"));
        }
        else {
            throw new Error("El producto no existe");
        }
    }
}

export default ProductManager;