const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/meses", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT tp.nombre AS tipo_permiso_nombre, pt.fecha_hora
      FROM permisos_trabajo pt
      JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso;
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
