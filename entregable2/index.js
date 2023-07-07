const fs = require("fs");

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
        this.path = `${__dirname}/data.json`;

        if(fs.existsSync(this.path)) {
            let info = fs.readFileSync(this.path, { encoding: 'utf-8' });
            if(info) {
                this.products = JSON.parse(info);
                Product.increments = this.products.at(-1).id;
            }
        }
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

    addProduct(product) {
        if(this.isSameCode(product.code)) {
            throw new Error(`Ya existe un producto con el código ${product.code}`);
        }
        this.products.push(product);

        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2, "\t"));
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        let product = this.products.find(p => p.id === id);
        if(!product) {
            throw new Error(`No existe un producto con el id ${id}`);
        }
        return product;
    }

    updateProduct(id, { title, description, price, thumbnail, code, stock }) {
        let index = this.products.findIndex(p => p.id === id);
        if(index == -1) {
            throw new Error(`No existe un producto con el id ${id}`);
        }

        if(code && this.isSameCode(code)) {
            throw new Error(`Ya existe un producto con el código ${code}`);
        }

        const data = { title, description, price, thumbnail, code, stock };
        const values = Object.values(data);

        Object.keys(data).forEach((key, i) => {
            if(values[i]) {
                this.products[index][key] = values[i];
            }
        });
        
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2, "\t"));

        return id;
    }

    deleteProduct(id) {
        let product = this.products.find(p => p.id === id);
        if(!product) {
            throw new Error(`No existe un producto con el id ${id}`);
        }
        
        this.products = this.products.filter(p => p.id !== id);
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2, "\t"));

        return id;
    }
}

try {
    const productManager = new ProductManager();
    console.log("******** Arreglo vacío *********");
    console.log(productManager.getProducts());

    productManager.addProduct(new Product("producto prueba", "Este es un producto de prueba", 200, "sin imagen", "abc123", 25));
    productManager.addProduct(new Product("producto prueba2", "Este es un producto de prueba2", 200, "sin imagen", "abc1234", 25));
    productManager.addProduct(new Product("producto prueba3", "Este es un producto de prueba3", 200, "sin imagen", "abc1235", 25));
    productManager.addProduct(new Product("producto prueba4", "Este es un producto de prueba4", 200, "sin imagen", "abc1236", 25));
    productManager.addProduct(new Product("producto prueba5", "Este es un producto de prueba5", 200, "sin imagen", "abc1237", 25));
    productManager.addProduct(new Product("producto prueba6", "Este es un producto de prueba6", 200, "sin imagen", "abc1238", 25));

    console.log("\n");
    console.log("******** Productos agregados *********");
    console.table(productManager.getProducts());

    console.log("\n");
    console.log("******** Búsqueda por id *********");
    console.log(productManager.getProductById(3));

    console.log("\n");
    console.log("******** Actualización *********");
    console.log("ID actualizado: " + productManager.updateProduct(3, { title: "Manzana", description: "Una manzana verde", price:100, stock: 12 }));

    console.log("\n");
    console.log("******** Estado de la tabla *********");
    console.table(productManager.getProducts());

    console.log("\n");
    console.log("******** Eliminación *********");
    console.log("ID eliminado: " + productManager.deleteProduct(5));
    
    console.log("\n");
    console.log("******** Estado de la tabla *********");
    console.table(productManager.getProducts());

} catch(error) {
    console.log(error);
}

