import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require("fs");


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
                ? this.products = fs.readFileSync(this.path, "utf-8")
                : this.products = [];
        }
    }

    /**
     * Obtains the next id to be used
     * @returns next id
     */
    getNextId() {
        try {
            const products = this.getProducts(this.path);
            if (products.length > 0) {
                const maxId = products.reduce((max, p) => p.id > max ? p.id : max, products[0].id);
                return maxId + 1;
            }
            else {
                return 1;
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Adds a new product to the file
     * @param {*} product the product to be added
     */
    async addProduct(product) {
        try {
            if (Object.values(product).includes(undefined)) {
                throw new Error("El producto no tiene todas las propiedades");
            }
            if (!this.products.find((p) => p.code === product.code)) {
                product['id'] = this.getNextId();
                this.products.push(product);
                await fs.writeFileSync(this.path, JSON.stringify(this.products, null, "\t"));
            }
            else {
                throw new Error("El producto ya existe");
            }
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }

    /**
     * Gets all the products from the file
     * @param {*} path file path
     * @returns all the products
     */
    getProducts() {
        if (fs.existsSync(this.path)) {
            const products = fs.readFileSync(this.path, `utf-8`)
            return JSON.parse(products)
        } else {
            return []
        }
    }



    /**
     * Shows all the products from the file
     * @param {*} path file path
     */
    async showProducts() {
        try {
            const products = await this.getProducts();
            products.forEach((product) => {
                console.log(JSON.stringify(product));
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Gets a product by id
     * @param {*} path file path
     * @param {*} id product id
     * @returns the product
     */
    getProductById(id) {
        try {
            const products = this.getProducts();
            if (!products) {
                throw new Error("El archivo no existe");
            }
            const product = products.find((p) => p.id === parseInt(id));
            if (product) {
                return product;
            }
            else {
                throw new Error("El producto no existe");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Updates a product by id
     * @param {*} path file path
     * @param {*} id product id
     * @param {*} product product to be updated
     * @returns the updated product
     */
    async updateProductById(id, product) {
        try {
            const products = this.getProducts();
            if (products) {
                const index = products.findIndex((p) => p.id === id);
                if (index >= 0) {
                    products[index] = { ...products[index], ...product };
                    await fs.writeFileSync(this
                        .path, JSON.stringify(products, null, "\t"));
                    console.log('Producto actualizado');
                }
                else {
                    throw new Error("El producto no existe");
                }
            }
            else {
                throw new Error("El archivo no existe");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Deletes a product by id
     * @param {*} path file path
     * @param {*} id product id
     */
    async deleteProductById(id) {
        try {
            const products = await this.getProducts();
            if (products) {
                const index = products.findIndex((p) => p.id === id);
                if (index >= 0) {
                    products[index].available = false;
                    await fs.writeFileSync
                        (this.path, JSON.stringify(products, null, "\t"));
                    console.log('Producto eliminado');
                }
                else {
                    throw new Error("El producto no existe");
                }
            }
            else {
                throw new Error("El archivo no existe");
            }
        }
        catch (error) {
            console.log(error);
        }
    }



}

export { ProductManager };