const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Agrega esta línea para analizar solicitudes en formato JSON

// Configura la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: '20.232.9.117', // Dirección IP de tu servidor PostgreSQL
    database: 'plazagea',
    password: 'password',
    port: 5432,
});

// Define una ruta de ejemplo para obtener datos de la base de datos
app.get('/obtener-datos', async (req, res) => {
  try {
    const consulta = 'SELECT * FROM productos';
    const resultado = await pool.query(consulta);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Define una ruta para enviar un usuario a la base de datos -> ejemplo
// INSERT INTO usuarios (nombre, correo_electronico, contrasena)
// VALUES ('Nombre del Usuario', 'correo@example.com', 'contrasena123');
const bcrypt = require('bcrypt');

app.post('/agregar-usuario', async (req, res) => {
  try {
    // Obtén el nombre, correo electrónico y contraseña del cuerpo de la solicitud
    const { nombre, correo_electronico, contrasena } = req.body;

    // Encripta la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(contrasena, 10); // El segundo argumento es el costo de encriptación (ajústalo según tus necesidades)

    // Ahora que tienes la contraseña encriptada, puedes realizar la inserción en la base de datos
    const consulta = 'INSERT INTO usuarios (nombre, correo_electronico, contrasena) VALUES ($1, $2, $3)';
    await pool.query(consulta, [nombre, correo_electronico, hashedPassword]);

    // Responde con un mensaje de éxito o lo que consideres necesario
    res.json({ mensaje: 'Usuario agregado con éxito:' + hashedPassword});
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


app.post('/login', async (req, res) => {
  try {
    // Obtén el correo electrónico y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;

    // Realiza la autenticación aquí, por ejemplo, utilizando Firebase Authentication
    // Puedes llamar a Firebase Authentication para autenticar al usuario
    
    // Si la autenticación es exitosa, puedes responder con un token de sesión u otra información relevante
    res.json({ mensaje: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// Ruta para agregar una compra a la base de datos
/* 
CREATE TABLE compras (
    id serial PRIMARY KEY,
    usuario_id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad integer NOT NULL,
    total numeric(10, 2) NOT NULL,
    fecha timestamp DEFAULT current_timestamp
);
INSERT INTO compras (usuario_id, producto_id, cantidad, total)
VALUES (1, 101, 3, 50.00);
*/
app.post('/agregar-compra', async (req, res) => {
  try {
    // obtengo los datos del cuerpo de la solicitud
    const { usuario_id, producto_id, cantidad, total } = req.body;
    const consulta = 'INSERT INTO compras (usuario_id, producto_id, cantidad, total) VALUES ($1, $2, $3, $4)';
    await pool.query(consulta, [usuario_id, producto_id, cantidad, total]);
    // respondo con un mensaje de éxito o lo que consideres necesario
    res.json({ mensaje: 'Compra agregada con éxito' });   
  } catch (error) {
    console.error('Error al agregar compra:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

    

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// ejemplo de como llamar agregar compra desde postman 
// {
//   "usuario_id": 1,
//   "producto_id": 101,
//   "cantidad": 3,
//   "total": 50.00
// }

// ejemplo de como llamar agregar usuario desde postman
// {
//   "nombre": "Nombre del Usuario",
//   "correo_electronico": "correo@example",
//   "contrasena": "contrasena123"
// }

