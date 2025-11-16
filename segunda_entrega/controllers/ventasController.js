const ventasService = require("../services/ventasService");

const createVenta = (req, res) => {
  try {
    const venta = ventasService.create(req.body);
    res.json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listVentas = (req, res) => res.json(ventasService.list());

module.exports = { createVenta, listVentas };
