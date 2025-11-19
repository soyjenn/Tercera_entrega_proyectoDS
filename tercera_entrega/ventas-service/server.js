const express = require('express');
const axios = require('axios');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());

const DB_HOST = process.env.DB_HOST || 'db_ventas';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'rootpwd';
const DB_NAME = process.env.DB_NAME || 'ventas_db';

let pool;
(async () => {
  pool = await mysql.createPool({
    host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME,
    waitForConnections: true, connectionLimit: 10
  });
})();

// GET ventas (opcional, para ver ventas)
app.get('/ventas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id,cliente_id,producto_id,cantidad,total,fecha FROM ventas');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error consultando ventas' });
  }
});

// POST /ventas -> valida clientes y productos por HTTP
app.post('/ventas', async (req, res) => {
  const { cliente_id, producto_id, cantidad } = req.body;
  if (!cliente_id || !producto_id || !cantidad) return res.status(400).json({ error: 'Datos incompletos' });

  try {
    // 1) validar cliente (llamada HTTP) — dentro de Docker usar service name 'clientes'
    const clienteResp = await axios.get(`http://clientes:4001/clientes/${cliente_id}`, { timeout: 3000 });
    if (clienteResp.status !== 200) return res.status(400).json({ error: 'Cliente inválido' });

    // 2) validar producto (llamada HTTP)
    const productoResp = await axios.get(`http://productos:4002/productos/${producto_id}`, { timeout: 3000 });
    const producto = productoResp.data;
    if (producto.stock < cantidad) return res.status(400).json({ error: 'Stock insuficiente' });

    // 3) descontar stock
    await axios.put(`http://productos:4002/productos/${producto_id}/descontar`, { cantidad }, { timeout: 5000 });

    // 4) registrar venta en BD local
    const total = producto.precio * cantidad;
    const [result] = await pool.query('INSERT INTO ventas (cliente_id, producto_id, cantidad, total) VALUES (?,?,?,?)', [cliente_id, producto_id, cantidad, total]);

    res.status(201).json({
      mensaje: 'Venta registrada con éxito',
      venta: { id: result.insertId, cliente_id, producto_id, cantidad, total }
    });

  } catch (err) {
    console.error('Error en /ventas:', err.response?.data || err.message);
    const detalle = err.response?.data || err.message;
    return res.status(500).json({ error: 'No se pudo procesar la venta', detalle });
  }
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Ventas service en puerto ${PORT}`));
