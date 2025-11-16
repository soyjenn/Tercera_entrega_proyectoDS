const clientesService = require("../services/clientesService");

const createCliente = (req, res) => {
  try {
    const cliente = clientesService.create(req.body);
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listClientes = (req, res) => res.json(clientesService.list());

const updateCliente = (req, res) => {
  try {
    const id = Number(req.params.id);
    const cliente = clientesService.update(id, req.body);
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCliente = (req, res) => {
  const id = Number(req.params.id);
  clientesService.remove(id);
  res.send("Cliente eliminado correctamente");
};

module.exports = { createCliente, listClientes, updateCliente, deleteCliente };
