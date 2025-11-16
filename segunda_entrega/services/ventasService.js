const ventasRepo = require("../repositories/ventasRepository");
const clientesRepo = require("../repositories/clientesRepository");
const productosService = require("./productosService");

const create = (data) => {
  const cliente = clientesRepo.findById(data.clienteId);
  if (!cliente) throw new Error("Cliente no encontrado");

  let total = 0;
  const productos = data.productos.map(p => {
    const producto = productosService.list().find(pr => pr.id === p.id);
    if (!producto) throw new Error("Producto no encontrado");
    productosService.reducirStock(p.id, p.cantidad);
    const subtotal = producto.precio * p.cantidad;
    total += subtotal;
    return { ...producto, cantidad: p.cantidad, subtotal };
  });

  const venta = { clienteId: cliente.id, productos, total, fecha: new Date() };
  return ventasRepo.save(venta);
};

const list = () => ventasRepo.findAll();

module.exports = { create, list };
