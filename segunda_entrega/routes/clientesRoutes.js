const express = require("express");
const router = express.Router();
const controller = require("../controllers/clientesController");

router.post("/", controller.createCliente);
router.get("/", controller.listClientes);
router.put("/:id", controller.updateCliente);
router.delete("/:id", controller.deleteCliente);

module.exports = router;
