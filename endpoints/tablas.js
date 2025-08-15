const express = require('express');
const router = express.Router();
const db = require('./database');

// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto

router.post('/estatus/default', async (req, res) => {
  console.log('Solicitud recibida en /estatus/default');
  const ESTATUS_DEFAULT = 'en espera del área';
  
  try {
    console.log('Intentando insertar en la base de datos...');
    const result = await db.query(
      'INSERT INTO estatus (estatus) VALUES ($1) RETURNING id_estatus as id, estatus',
      [ESTATUS_DEFAULT]
    );
    
    console.log('Inserción exitosa:', result.rows[0]);
    res.status(201).json({
      success: true,
      message: 'Estatus creado exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).json({
      success: false,
      error: 'Error al crear el estatus',
      details: err.message
    });
  }
});









module.exports = router;