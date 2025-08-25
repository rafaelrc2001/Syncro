
const express = require('express');
const router = express.Router();
const db = require('./database');
const { pool } = require('./database');


// Nueva ruta para insertar un estatus personalizado 'espera seguridad' con id_estatus recibido
// Nueva ruta para insertar un estatus personalizado 'espera seguridad' con id_estatus recibido
// Nueva ruta para insertar un estatus personalizado 'espera seguridad' con id_estatus recibido
// Nueva ruta para insertar un estatus personalizado 'espera seguridad' con id_estatus recibido
// Nueva ruta para insertar un estatus personalizado 'espera seguridad' con id_estatus recibido
router.post('/estatus/seguridad', async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = 'espera seguridad';

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: 'id_estatus es requerido'
    });
  }

  try {
    const result = await db.query(
      'INSERT INTO estatus (id_estatus, estatus) VALUES ($1, $2) RETURNING id_estatus as id, estatus',
      [id_estatus, ESTATUS]
    );
    res.status(201).json({
      success: true,
      message: 'Estatus de seguridad creado exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).json({
      success: false,
      error: 'Error al crear el estatus de seguridad',
      details: err.message
    });
  }
});


// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones

// Nueva ruta para insertar en la tabla de autorizaciones según requerimiento del usuario
router.post('/autorizaciones/area', async (req, res) => {
  const { id_permiso, responsable_area, encargado_area } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_permiso || !responsable_area || !encargado_area) {
    return res.status(400).json({
      success: false,
      error: 'id_permiso, responsable_area y encargado_area son requeridos'
    });
  }

  // Verificar si ya existe un registro con ese id_permiso
  try {
    const existe = await db.query(
      'SELECT 1 FROM autorizaciones WHERE id_permiso = $1 LIMIT 1',
      [id_permiso]
    );
    if (existe.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Ya existe una autorización para este id_permiso'
      });
    }
  } catch (err) {
    console.error('Error verificando duplicado:', err);
    return res.status(500).json({
      success: false,
      error: 'Error al verificar duplicado',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO autorizaciones (
        id_permiso, id_supervisor, id_categoria, responsable_area, encargado_area
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [id_permiso, null, null, responsable_area, encargado_area]
    );
    res.status(201).json({
      success: true,
      message: 'Autorización de área registrada exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).json({
      success: false,
      error: 'Error al registrar la autorización de área',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});



// ...existing code...
// Dejar solo un module.exports al final
module.exports = router;
