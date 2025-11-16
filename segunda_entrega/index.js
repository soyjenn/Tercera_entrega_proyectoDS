const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

const clientesRoute = require("./routes/clientesRoutes");
const productosRoute = require("./routes/productosRoutes");
const ventasRoute = require("./routes/ventasRoutes");

app.use("/clientes", clientesRoute);
app.use("/productos", productosRoute);
app.use("/ventas", ventasRoute);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
