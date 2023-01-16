


class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.available = true;
    }

    getProduct() {
        return this;
    }

    getProductAsStr() {
        return JSON.stringify(this);
    }

}

export { Product };