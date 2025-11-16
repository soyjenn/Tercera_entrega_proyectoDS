let clientes = [];
let nextId = 1;

const save = (cliente) => {
  if (!cliente.id) {
    cliente.id = nextId++;
    clientes.push(cliente);
  } else {
    const index = clientes.findIndex(c => c.id === cliente.id);
    clientes[index] = cliente;
  }
  return cliente;
};

const findAll = () => clientes;

const findById = (id) => clientes.find(c => c.id === id);

const remove = (id) => {
  clientes = clientes.filter(c => c.id !== id);
};

module.exports = { save, findAll, findById, remove };
