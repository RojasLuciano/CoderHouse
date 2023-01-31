


class Product {
    constructor(title, description, price, thumbnail, code, stock, category) {
        Product.validate(title, description, price, code, stock, category);
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail || '';
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.status = true;
    }

    getProduct() {
        return this;
    }

    getProductAsStr() {
        return JSON.stringify(this);
    }

    static validate(title, description, price, code, stock, category) {
        console.log(typeof title + ' ' + typeof description + ' ' + typeof price + ' ' + typeof code + ' ' + typeof stock + ' ' + typeof category);
        if (typeof title !== 'string' || title.trim().length === 0) {
            throw new Error('Title is not valid');
        }
        if (typeof description !== 'string' || description.trim().length === 0) {
            throw new Error('Description is not valid');
        }
        if (typeof price !== 'number' || price <= 0) {
            throw new Error('Price is not valid');
        }
        if (typeof stock !== 'number' || stock <= 0) {
            throw new Error('Stock is not valid');
        }
        if (typeof code !== 'number' || code <= 0) {
            throw new Error('Code is not valid');
        }
        if (typeof category !== 'string' || category.trim().length === 0) {
            throw new Error('Category is not valid');
        }
    }

}

export default Product;