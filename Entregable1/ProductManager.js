import { Product } from './Product.js';

class ProductManager {
    constructor() {
        this.products = [];
    }

    getNextId = () => {
        const count = this.products.length;
        const nextId = (count > 0) ? this.products[count - 1].id + 1 : 1;
        return nextId;
    }

    addProduct(product) {
        if (!this.products.find((p) => p.code === product.code)) 
        {
            product['id'] = this.getNextId();
            this.products.push(product);
        }
    }
    getProducts() {
        // this.products.forEach((p) => {
        //     console.log(p.getProductAsStr());
        // });
        return this.products;
    }

    getProductById(id) {
        if (this.products.find((p) => p.id === id)) {
            return this.products.find((p) => p.id === id);
        } else {
            return 'Not found';
        }
    }

}


const product_ = new Product('Coca Cola', 'Bebida gaseosa', 100, 'https://www.coca-cola.com.ar/content/dam/journey/ar/es/private/2020/02/20/20-02-20-coca-cola-0-33l-1.png', '1', 100);
const product2 = new Product('mismo id', 'Bebida gaseosa', 100, 'https://www.coca-cola.com.ar/content/dam/journey/ar/es/private/2020/02/20/20-02-20-coca-cola-0-33l-1.png', '1', 100);
const product3 = new Product('Fanta', 'Bebida gaseosa', 100, 'https://www.coca-cola.com.ar/content/dam/journey/ar/es/private/2020/02/20/20-02-20-coca-cola-0-33l-1.png', '2', 100);
const product4 = new Product('7Up', 'Bebida gaseosa', 100, 'https://www.coca-cola.com.ar/content/dam/journey/ar/es/private/2020/02/20/20-02-20-coca-cola-0-33l-1.png', '3', 100);

console.log('eeeeeeeee');


const productManager = new ProductManager();
productManager.addProduct(product_);
productManager.addProduct(product2); //Mismo code, no debe agregarlo
productManager.addProduct(product3);
productManager.addProduct(product4);


console.log(productManager.getProducts()); //Solo debe mostrar 4 elemento.

console.log(productManager.getProductById(1)); //Debe mostrar el producto con id 1
console.log(productManager.getProductById(4)); //Not found

