const productosRepo = require("../repositories/productosRepository");

const create = (data) => productosRepo.save(data);
const list = () => productosRepo.findAll();

const update = (id, data) => {
  const producto = productosRepo.findById(id);
  if (!producto) throw new Error("Producto no encontrado");
  return productosRepo.save({ ...producto, ...data });
};

const reducirStock = (id, cantidad) => {
  const producto = productosRepo.findById(id);
  if (!producto) throw new Error("Producto no encontrado");
  if (producto.stock < cantidad) throw new Error("Stock insuficiente");
  producto.stock -= cantidad;
  return productosRepo.save(producto);
};

module.exports = { create, list, update, reducirStock };
