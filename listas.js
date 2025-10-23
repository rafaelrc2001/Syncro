const express = require('express');
const router = express.Router();
const db = require('./database');

// Endpoint para obtener todas las sucursales
// Endpoint para obtener todas las sucursales
// Endpoint para obtener todas las sucursales
router.get('/sucursales', async (req, res) => {
  try {
    const result = await db.query('SELECT id_sucursal, nombre FROM sucursales ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener sucursales:', err);
    res.status(500).json({ error: 'Error al obtener sucursales' });
  }
});


// Endpoint para obtener todas las áreas
// Endpoint para obtener todas las áreas
// Endpoint para obtener todas las áreas
router.get('/areas', async (req, res) => {
  try {
    const result = await db.query('SELECT id_area, nombre FROM areas ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener áreas:', err);
    res.status(500).json({ error: 'Error al obtener áreas' });
  }
});


// Endpoint para obtener todos los participantes de AST
// Endpoint para obtener todos los participantes de AST
// Endpoint para obtener todos los participantes de AST
router.get('/participantes', async (req, res) => {
  const id_estatus = parseInt(req.query.id_estatus, 10);
  if (!Number.isInteger(id_estatus) || id_estatus <= 0) {
    return res.json([]);
  }
  try {
    const result = await db.query('SELECT * FROM ast_participan WHERE id_estatus = $1', [id_estatus]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener participantes:', err);
    res.status(500).json({ error: 'Error al obtener participantes' });
  }
});



module.exports = router;