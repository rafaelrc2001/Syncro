const express = require('express');
const router = express.Router();
const db = require('./database');
const { pool } = require('./database');




// Nueva ruta para actualizar el estatus a 'activo' usando el id_estatus recibido
router.post('/estatus/activo', async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = 'activo';

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: 'id_estatus es requerido'
    });
  }

  try {
    const result = await db.query(
      'UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus',
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró el estatus para actualizar'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Estatus activo actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estatus activo',
      details: err.message
    });
  }
});


// Nueva ruta para actualizar el estatus a 'espera seguridad' usando el id_estatus recibido
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
      'UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus',
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró el estatus para actualizar'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Estatus de seguridad actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estatus de seguridad',
      details: err.message
    });
  }
});










// Nueva ruta para actualizar el estatus a 'continua' usando el id_estatus recibido
router.post('/estatus/continua', async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = 'continua';

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: 'id_estatus es requerido'
    });
  }

  try {
    const result = await db.query(
      'UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus',
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró el estatus para actualizar'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Estatus de continua actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estatus de continua',
      details: err.message
    });
  }
});



// Nueva ruta para actualizar el estatus a 'cancelado' usando el id_estatus recibido
router.post('/estatus/cancelado', async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = 'cancelado';

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: 'id_estatus es requerido'
    });
  }

  try {
    const result = await db.query(
      'UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus',
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró el estatus para actualizar'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Estatus de cancelado actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estatus de cancelado',
      details: err.message
    });
  }
});




// Nueva ruta para actualizar el estatus a 'terminado' usando el id_estatus recibido
router.post('/estatus/terminado', async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = 'terminado';

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: 'id_estatus es requerido'
    });
  }

  try {
    const result = await db.query(
      'UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus',
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró el estatus para actualizar'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Estatus de terminado actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estatus de terminado',
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
  if (!id_permiso || !responsable_area) {
    return res.status(400).json({
      success: false,
      error: 'id_permiso y responsable_area son requeridos'
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
        id_permiso, id_supervisor, id_categoria, responsable_area, operador_area
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

// Ruta para obtener el id_estatus de permisos_trabajo por id_permiso
router.get('/permisos-trabajo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT id_estatus FROM permisos_trabajo WHERE id_permiso = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Permiso no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});




//no autorizado
//no autorizado
//no autorizado
//no autorizado
// Nueva ruta para actualizar el estatus a 'no autorizado' usando el id_estatus recibido
router.post('/estatus/no_autorizado', async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = 'no autorizado';

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: 'id_estatus es requerido'
    });
  }

  try {
    const result = await db.query(
      'UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus',
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró el estatus para actualizar'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Estatus de no autorizado actualizado exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error en la base de datos:', err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el estatus de no autorizado',
      details: err.message
    });
  }
});

// Endpoint para actualizar supervisor y categoría (solo nombres) en autorizaciones
router.put('/autorizaciones/supervisor-categoria', async (req, res) => {
  const { id_permiso, supervisor, categoria } = req.body;

  if (!id_permiso || !supervisor || !categoria) {
    return res.status(400).json({
      success: false,
      error: 'id_permiso, supervisor y categoria son requeridos'
    });
  }

  try {
    // Buscar el ID del supervisor por nombre
    const supResult = await db.query(
      'SELECT id_supervisor FROM supervisores WHERE nombre = $1 LIMIT 1',
      [supervisor]
    );
    if (supResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Supervisor no encontrado'
      });
    }
    const idSupervisor = supResult.rows[0].id_supervisor;

    // Buscar el ID de la categoría por nombre en categorias_seguridad
    const catResult = await db.query(
      'SELECT id_categoria FROM categorias_seguridad WHERE nombre = $1 LIMIT 1',
      [categoria]
    );
    if (catResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Categoría no encontrada'
      });
    }
    const idCategoria = catResult.rows[0].id_categoria;

    // Actualizar la tabla autorizaciones con los IDs
    const result = await db.query(
      `UPDATE autorizaciones
       SET id_supervisor = $1, id_categoria = $2
       WHERE id_permiso = $3
       RETURNING *`,
      [idSupervisor, idCategoria, id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró la autorización para actualizar'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Supervisor y categoría actualizados exitosamente',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error actualizando supervisor y categoría:', err);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar supervisor y categoría',
      details: err.message
    });
  }
});

// Dejar solo un module.exports al final
module.exports = router;
