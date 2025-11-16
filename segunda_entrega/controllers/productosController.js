const productosService = require("../services/productosService");

const createProducto = (req, res) => {
  try {
    const producto = productosService.create(req.body);
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listProductos = (req, res) => res.json(productosService.list());

const updateProducto = (req, res) => {
  try {
    const id = Number(req.params.id);
    const producto = productosService.update(id, req.body);
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createProducto, listProductos, updateProducto };
