| Componente | Descripción |
|-------------|-------------|
| **Cliente (navegador / Postman)** | Interfaz desde la cual los usuarios (vendedores o administradores) realizan las solicitudes al sistema a través de peticiones HTTP. |
| **Servidor de Aplicaciones (Node.js + Express)** | Contiene la lógica del sistema dividida en capas (rutas, controladores, servicios y repositorios). Se encarga de procesar las peticiones y gestionar los datos. |
| **Base de Datos (SQLite)** | Almacena de forma local la información de clientes, productos y ventas. Se utiliza un archivo `.sqlite` liviano, ideal para desarrollo o ejecución local. |
| **Entorno de Ejecución Local** | El sistema se ejecuta en el equipo del desarrollador mediante Node.js.|