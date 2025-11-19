const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());

// Variables de entorno (Docker o local)
const DB_HOST = process.env.DB_HOST || 'db_clientes';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'rootpwd';
const DB_NAME = process.env.DB_NAME || 'clientes_db';

let pool;

// 🔄 Conexión con reintentos (ideal para Docker)
async function conectarDB() {
  const intentosIniciales = parseInt(process.env.DB_RETRIES, 10) || 30;
  let intentos = intentosIniciales;

  // Espera corta antes de comenzar reintentos para dar tiempo a MySQL a inicializar
  await new Promise(res => setTimeout(res, 5000));

  while (intentos > 0) {
    try {
      pool = await mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10
      });

      await pool.query('SELECT 1');
      console.log("💚 Conexión a MySQL establecida (clientes)");
      return;
    } catch (err) {
      console.log(`⏳ MySQL no está listo... reintentando (quedan ${intentos})`);
      console.error('Error de conexión MySQL:', err && err.message ? err.message : err);
      intentos--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  console.error("❌ No se pudo conectar a MySQL después de varios intentos");
  process.exit(1);
}

conectarDB();

// ===================== RUTAS =====================

// GET: todos los clientes
app.get('/clientes', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, correo, estado FROM clientes');
    res.json(rows);
  } catch (err) {
    console.error('Error consultando clientes', err);
    res.status(500).json({ error: 'Error consultando clientes' });
  }
});

// GET: cliente por id
app.get('/clientes/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, correo, estado FROM clientes WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error consultando cliente', err);
    res.status(500).json({ error: 'Error consultando cliente' });
  }
});

// POST: crear cliente
app.post('/clientes', async (req, res) => {
  try {
    const { nombre, correo, estado = 'activo' } = req.body;

    // Validaciones básicas
    if (!nombre || !correo) {
      return res.status(400).json({ error: 'Nombre y correo son obligatorios' });
    }

    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, correo, estado) VALUES (?, ?, ?)',
      [nombre, correo, estado]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      correo,
      estado
    });
  } catch (err) {
    console.error('Error creando cliente', err);
    res.status(500).json({ error: 'Error creando cliente' });
  }
});

// ===================== SERVIDOR =====================
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Clientes service en puerto ${PORT}`));
