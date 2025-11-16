let ventas = [];
let nextId = 1;

const save = (venta) => {
  venta.id = nextId++;
  ventas.push(venta);
  return venta;
};

const findAll = () => ventas;

module.exports = { save, findAll };
