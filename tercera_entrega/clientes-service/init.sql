CREATE DATABASE IF NOT EXISTS clientes_db;
USE clientes_db;

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100),
  estado VARCHAR(20),
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO clientes (id,nombre,correo,estado) VALUES (1,'Jennifer Salazar','jennifer@example.com','activo');
