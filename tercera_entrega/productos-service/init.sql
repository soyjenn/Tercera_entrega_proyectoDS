CREATE DATABASE IF NOT EXISTS productos_db;
USE productos_db;

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150),
  precio DECIMAL(10,2),
  stock INT,
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO productos (id,nombre,precio,stock) VALUES
(1,'Aceite Premium',30000,10),
(2,'Aceite Standard',20000,5);
