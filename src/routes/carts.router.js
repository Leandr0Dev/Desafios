import CartManager from "../manager/CartManager.js";
import { Router } from "express";

const cartManager = new CartManager();
const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json("Nuevo carrito creado");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;

  try {
    const updatedCart = await cartManager.updateCart(
      Number(cid),
      Number(pid),
      quantity
    );

    if (updatedCart === undefined) {
      res.status(404).json("Error al agregar al carrito");
    } else {
      res.status(200).json("El producto fue agregado exitosamente");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(Number(cid));

    if (cart === undefined) {
      res.status(404).json("Error: ID No Encontrada");
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.deleteCart(Number(cid));

    if (cart === undefined) {
      res.status(404).json("Error: Al borrar el carrito");
    } else {
      res.status(200).json(`Carrito Eliminado.`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;