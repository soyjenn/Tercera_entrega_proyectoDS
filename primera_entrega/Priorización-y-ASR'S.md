|Atributo de Calidad|Descripción|Escenario de Calidad|Prioridad|
|-|-|-|-|
|Disponibilidad|El sistema debe estar siempre operativo para registrar ventas.|Un vendedor intenta registrar una venta durante horas laborales y el sistema responde correctamente.|Alta|
|Rendimiento|El sistema debe responder rápido incluso con varios registros.|Consulta de inventario con más de 500 productos tarda menos de 2 segundos.|Alta|
|Seguridad|Acceso restringido a usuarios autenticados.|Un usuario sin permisos intenta eliminar una venta y el sistema lo bloquea.|Alta|
|Escalabilidad|Debe poder migrarse a una base de datos más robusta en el futuro.|El sistema pasa de usar archivos locales a una base de datos SQL sin reescribir toda la lógica.|Media|
|Mantenibilidad|El código debe ser claro y modular.|Un nuevo desarrollador puede agregar un reporte sin afectar las demás funciones.|Media|
