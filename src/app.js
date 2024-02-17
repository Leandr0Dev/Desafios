import express from "express";
import {ProductManager} from "./ProductManager.js";

const app = express();
const productManager = new ProductManager();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({
    message:
    "Productos: http://localhost:8080/products ||  5 Pruductos: http://localhost:8080/products?limit=5 || Producto por id: http://localhost:8080/products/2 ",  
  });
});


app.get("/products", async (req, res) => {
  const products = await productManager.getProducts()
  let limit = parseInt(req.query.limit)
  if (limit) {
    const limitedProducts = products.slice(0, limit);
    res.send(limitedProducts)
    return
  }
  res.send(products)
})


app.get("/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductById(Number(pid));

    if (product === undefined) {
      res.status(404).json("Id No Encontrada");
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.listen(PORT, () => {
  console.log(`Escuchando en el Puerto: ${PORT}`);
});