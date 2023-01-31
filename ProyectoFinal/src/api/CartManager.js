import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require("fs");
import Cart from "../class/Cart.js";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager('./products.json');

class CartManager {
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
            fs.existsSync(path) ?
                this.items = JSON.parse(fs.readFileSync(this.path, "utf-8"))
                : this.items = [];
        }
    }

    /**
     * Gets all the carts
     * @returns All the carts
     */
    getAll() {
        return this.items;
    }

    /**
     * Get the next id for a new cart
     * @returns the next id
     */
    getNextId() {
        return this.items.length > 0 ? this.items[this.items.length - 1].idCart + 1 : 1;
    }

    /**
     * Adds a new cart to the file
     */
    async addCart() {
        const newCart = new Cart();
        newCart['idCart'] = this.getNextId();
        this.items.push(newCart);
        await fs.writeFileSync(this.path, JSON.stringify(this.items, null, "\t"));
    }

    /**
     * Adds a product to a cart
     * @param {*} params pid: id of the product to be added, cid: id of the cart where the product will be added
     */
    async addProductToCart(params) {
        const product = productManager.getByID(params.pid);
        if (product) {
            const cart = this.items.find((i) => i.idCart == parseInt(params.cid));
            if (cart) {
                if (cart.products.find((i) => i.idProduct == parseInt(params.pid)) != undefined) {
                    const product_ = cart.products.find((i) => i.idProduct == parseInt(params.pid));
                    product_.quantity += product.stock;
                }
                else {
                    cart.products.push({ idProduct: parseInt(params.pid), quantity: 1 });
                }
                await fs.writeFileSync(this.path, JSON.stringify(this.items, null, "\t"));
            }
            else {
                throw new Error("Carrito no encontrado");
            }
        }
        else {
            throw new Error("Producto no encontrado");
        }
    }

    /**
     * Gets a cart by its id
     * @param {*} id id of the cart to be retrieved
     * @returns the cart
     */
    async getCart(id) {
        const cart = this.items.find((i) => i.idCart == parseInt(id));
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    }

}

export default CartManager;