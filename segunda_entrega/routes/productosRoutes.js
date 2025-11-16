const express = require("express");
const router = express.Router();
const controller = require("../controllers/productosController");

router.post("/", controller.createProducto);
router.get("/", controller.listProductos);
router.put("/:id", controller.updateProducto);

module.exports = router;
