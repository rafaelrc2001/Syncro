const express = require("express");
const router = express.Router();
const db = require("../database");

// Endpoint para filtrar por departamento
// Endpoint para filtrar por departamento con la misma lógica de joins
router.get("/meses/departamento/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const result = await db.query(
      `
     SELECT 
    pt.fecha_hora,
    pt.id_estatus,
    e.estatus,
    pt.id_area
FROM permisos_trabajo pt
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
WHERE pt.id_departamento = $1;
    `,
      [id_departamento]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para filtrar por usuario con la misma lógica de joins
router.get("/meses/usuario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await db.query(
      `
     SELECT 
    pt.fecha_hora,
    pt.id_estatus,
    e.estatus,
    pt.id_area
FROM permisos_trabajo pt
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
WHERE pt.id_usuario = $1;
    `,
      [id_usuario]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/meses", async (req, res) => {
  try {
    const result = await db.query(`
     
  SELECT 
    pt.fecha_hora,
    pt.id_estatus,
    e.estatus,
    pt.id_area
  FROM permisos_trabajo pt
  INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
