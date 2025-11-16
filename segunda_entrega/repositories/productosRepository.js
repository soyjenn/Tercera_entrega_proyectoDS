let productos = [];
let nextId = 1;

const save = (producto) => {
  if (!producto.id) {
    producto.id = nextId++;
    productos.push(producto);
  } else {
    const index = productos.findIndex(p => p.id === producto.id);
    productos[index] = producto;
  }
  return producto;
};

const findAll = () => productos;

const findById = (id) => productos.find(p => p.id === id);

const remove = (id) => {
  productos = productos.filter(p => p.id !== id);
};

module.exports = { save, findAll, findById, remove };
