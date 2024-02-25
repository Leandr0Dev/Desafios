import ProductManager from "../manager/ProductManager.js";
import { Router } from "express";

const productManager = new ProductManager();
const router = Router();

router.post("/", async (req, res) => {
  const { title, description, code, price, status, stock, category} = req.body;
  const thumbnail = req.body.thumbnail ? req.body.thumbnail : [];

  try {
    const createProduct = await productManager.addProduct(
        title ,
        description,
        code,
        price,
        status,
        stock ,
        category,
        thumbnail
    );

    if (createProduct === false) {
      res.status(400).json("Error: Los campos son obligatorios");
    } else if (createProduct === undefined) {
      res.status(400).json("Error: El producto ya existe");
    } else {
      res.status(201).json("Producto creado exitosamente");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const { limit } = req.query;

  try {
    const products = await productManager.getProducts();

    if (products === undefined) {
      res.status(200).json([]);
    }

    if (!limit || limit < 1) {
      res.status(200).json(products);
    } else {
      const limitedProducts = products.slice(0, limit);
      res.status(206).json(limitedProducts);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productManager.getProductById(Number(pid));

    if (product === undefined) {
      res.status(404).json("Error: ID No Encontrada");
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const props = req.body;

  try {
    const updatedProduct = await productManager.updateProduct(
      Number(pid),
      props
    );

    if (updatedProduct === undefined) {
      res.status(404).json(`Error : EL Producto No Existe`);
    } else if (updatedProduct === false) {
      res.status(404).json("Error: No se puede actualizar la propiedad 'id' o 'código");
    } else {
      res.status(200).json(updatedProduct);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productManager.deleteProduct(Number(pid));

    if (product === undefined) {
      res.status(404).json("Errr: El Producto No Existe.");
    } else {
      res.status(200).json(`Producto Eliminado.`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;