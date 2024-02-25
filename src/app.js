import express from "express";
import router from "./routes/index.js";

const app = express();


const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router(app);

app.get("/", (req, res) => {
  res.json({
    rutasProducts:
    "Productos: http://localhost:8080/api/products ||  5 Pruductos: http://localhost:8080/api/products?limit=5 || Producto por id: http://localhost:8080/api/products/2 ",
    rutasCarts:
    "Productos: http://localhost:8080/api/carts || carrito por id: http://localhost:8080/api/carts/2 || post de productos al carrito http://localhost:8080/api/carts/1/product/2 ",

  });
});


app.listen(PORT, () => {
  console.log(`Escuchando en el Puerto: ${PORT}`);
});