import fs from "fs";

export class ProductManager {
  static #path = "./products.json";
  constructor() {
    this.products = [];
    ProductManager.#path;
  }

  getNextId = () => {
    const data = fs.readFileSync(ProductManager.#path);
    const products = JSON.parse(data);

    const count = products.length;
    const nextId = count > 0 ? products[count - 1].id + 1 : 1;

    return nextId;
  };

  createFile = async () => {
    try {
      await fs.promises.access(ProductManager.#path);
    } catch (error) {
      await fs.promises.writeFile(ProductManager.#path, "[]");

      console.log(`Archivo Creado.`);
    }
  };

  saveData = async (data) => {
    try {
      await fs.promises.writeFile(
        ProductManager.#path,
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.log(err);
    }
  };

  readProduct = async () => {
    try {
      const data = await fs.promises.readFile(ProductManager.#path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      console.log("Error al leer el archivo.");
    }
  };

  addProduct = async (
    title ,
    description,
    code,
    price,
    status = true,
    stock ,
    category,
    thumbnail ,
    
    
  ) => {
    try {
      const fileExist = fs.existsSync(ProductManager.#path);

      if (!fileExist) {
        await this.createFile();
      }

      const products = await this.getProducts();

      const product = {
        id: this.getNextId(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      };

      if (!title || !description || !code || !price || !stock ) {
        console.log(`Error: Todos los campos son obligatorios`);
        return false;
      } else if (products.find((product) => product.code === code)) {
        console.log(`Error: Producto con code: ${product.code} ya existe.`);
        return undefined;
      } else {
        products.push(product);
        await this.saveData(products);

        console.log(`Producto Agregado exitosamente`);

        const Reproducts = await this.getProducts();

        console.log(Reproducts);
        return Reproducts;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getProducts = async () => {
    try {
      const fileExist = fs.existsSync(ProductManager.#path);

      if (!fileExist) {
        await this.createFile();

        console.log(`[]`);
        return undefined;
      }

      const products = await this.readProduct();

      return products;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getProductById = async (id) => {
    try {
      const products = await this.getProducts();
      const product = Object.values(products).find((i) => i.id === id);

      if (product === undefined) {
        console.log(`Error: ID No Encontrada`);
        return undefined;
      } else {
        console.log(product);
        return product;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  updateProduct = async (id, props) => {
    try {
      const products = await this.getProducts();

      const ix = await products.findIndex((product) => product.id === id);

      if (ix === -1) {
        console.log(`ERROR: EL Producto No Existe`);
        return undefined;
      } else if (props.hasOwnProperty("id") || props.hasOwnProperty("code")) {
        console.log("ERROR: No se puede actualizar la propiedad 'id' o 'código'");
        return false;
      } else {
        Object.assign(products[ix], props);
        const updatedProduct = products[ix];
        await this.saveData(products);

        console.log(updatedProduct);
        return updatedProduct;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  deleteProduct = async (id) => {
    try {
      let products = await this.getProducts();

      const product = Object.values(products).find((i) => i.id === id);

      if (product !== undefined) {
        products = products.filter((i) => i.id !== id);
        const save = await this.saveData(products);

        console.log(`Producto Eliminado.`);
        return true;
      } else {
        console.log(`ERROR: El Producto No Existe.`);
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };
}

export default ProductManager;