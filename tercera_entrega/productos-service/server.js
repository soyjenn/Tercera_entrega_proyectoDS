const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());

const DB_HOST = process.env.DB_HOST || 'db_productos';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'rootpwd';
const DB_NAME = process.env.DB_NAME || 'productos_db';

let pool;
(async () => {
  pool = await mysql.createPool({
    host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME,
    waitForConnections: true, connectionLimit: 10
  });
})();

// GET todos los productos
app.get('/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id,nombre,precio,stock FROM productos');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error consultando productos' });
  }
});

// GET producto por id
app.get('/productos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id,nombre,precio,stock FROM productos WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error consultando producto' });
  }
});

// POST crear producto (para pruebas)
app.post('/productos', async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    const [result] = await pool.query('INSERT INTO productos (nombre,precio,stock) VALUES (?,?,?)', [nombre, precio, stock]);
    res.status(201).json({ id: result.insertId, nombre, precio, stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creando producto' });
  }
});

// PUT descontar stock
app.put('/productos/:id/descontar', async (req, res) => {
  const id = req.params.id;
  const cantidad = parseInt(req.body.cantidad || 0, 10);
  if (cantidad <= 0) return res.status(400).json({ error: 'Cantidad inválida' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT stock FROM productos WHERE id = ? FOR UPDATE', [id]);
    if (!rows.length) { await conn.rollback(); return res.status(404).json({ error: 'Producto no encontrado' }); }
    const stock = rows[0].stock;
    if (stock < cantidad) { await conn.rollback(); return res.status(400).json({ error: 'Stock insuficiente' }); }
    await conn.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [cantidad, id]);
    await conn.commit();
    res.json({ mensaje: 'Stock descontado', cantidad, nuevo_stock: stock - cantidad });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ error: 'Error interno productos' });
  } finally {
    conn.release();
  }
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Productos service en puerto ${PORT}`));
