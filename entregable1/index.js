class Product {
    static increments = 0;

    constructor(title, description, price, thumbnail, code, stock) {
        this.id = ++Product.increments;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
    }

    isSameCode(code) {
        let isSameCode = false;
        this.products.forEach(p => {
            if(p.code.toLowerCase() === code.toLowerCase()) {
                isSameCode = true;
            }
        });

        return isSameCode;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if(this.isSameCode(code)) {
            throw new Error(`Ya existe un producto con el código ${code}`);
        }
        this.products.push(new Product(title, description, price, thumbnail, code, stock));
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        let product = this.products.find(p => p.id === id);
        if(!product) {
            throw new Error("Not found");
        }
        return product;
    }
}

try {
    const productManager = new ProductManager();

    console.log(productManager.getProducts());

    productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc23", 25);

    console.log(productManager.getProducts());

    productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

    console.log(productManager.getProductById(2));
} catch(error) {
    console.log(error);
}
