import fs from "fs";

class CartManager {
  static #path = "./carts.json";
  constructor() {
    this.carts = [];
    CartManager.#path;
  }

  getNextId = () => {
    const data = fs.readFileSync(CartManager.#path);
    const carts = JSON.parse(data);

    const count = carts.length;
    const nextId = count > 0 ? carts[count - 1].id + 1 : 1;

    return nextId;
  };

  

  createFile = async () => {
    try {
      await fs.promises.access(CartManager.#path);
    } catch (error) {
      await fs.promises.writeFile(CartManager.#path, "[]");

      console.log(`Archivo creado exitosamente.`);
    }
  };

  saveData = async (data) => {
    try {
      await fs.promises.writeFile(
        CartManager.#path,
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.log(err);
    }
  };

  readData = async () => {
    try {
      const data = await fs.promises.readFile(CartManager.#path, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    } catch (error) {
      console.log(err);
    }
  };

  createCart = async () => {
    const carts = await this.getCarts();

    try {
      const cart = {
        id: this.getNextId(),
        products: [],
      };

      carts.push(cart);
      await this.saveData(carts);

      console.log(`El carrito se cargó exitosamente`);
      return carts;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getCarts = async () => {
    try {
      const fileExist = fs.existsSync(CartManager.#path);

      if (!fileExist) {
        await this.createFile();

        console.log(`[]`);
        return undefined;
      }

      const carts = await this.readData();

      return carts;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  getCartById = async (id) => {
    try {
      const carts = await this.getCarts();
      const cart = Object.values(carts).find((i) => i.id === id);

      if (cart === undefined) {
        console.log(`Error: Id no encontrada`);
        return undefined;
      } else {
        console.log(cart);
        return cart;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  updateCart = async (idC, idP, quantity) => {
    try {
      const carts = await this.getCarts();

      const cart = await carts.find((cart) => cart.id === idC);

      if (cart === undefined) {
        console.log(`Error: Al editar `);

        return undefined;
      }

      const produtExist = cart.products.find((product) => product.id === idP);

      if (produtExist) {
        produtExist.quantity += quantity;
      } else {
        cart.products.push({
          id: idP,
          quantity,
        });
      }

      await this.saveData(carts);

      return cart;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  deleteCart = async (id) => {
    try {
      let carts = await this.getCarts();

      const cart = Object.values(carts).find((i) => i.id === id);

      if (cart !== undefined) {
        carts = carts.filter((i) => i.id !== id);
        const save = await this.saveData(carts);

        console.log(`Carrito elimidado`);
        return true;
      } else {
        console.log(`El carrito no existe`);
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };
}

export default CartManager;