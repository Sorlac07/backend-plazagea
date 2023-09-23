const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Importa el middleware CORS

const app = express();
const port = 3000; // Puedes elegir cualquier puerto disponible

// Configura el middleware CORS
app.use(cors());

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

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


