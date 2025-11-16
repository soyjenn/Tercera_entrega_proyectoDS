const clientesRepo = require("../repositories/clientesRepository");

const create = (data) => clientesRepo.save(data);
const list = () => clientesRepo.findAll();

const update = (id, data) => {
  const cliente = clientesRepo.findById(id);
  if (!cliente) throw new Error("Cliente no encontrado");
  return clientesRepo.save({ ...cliente, ...data });
};

const remove = (id) => clientesRepo.remove(id);

module.exports = { create, list, update, remove };
