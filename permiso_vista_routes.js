const express = require("express");
const router = express.Router();
const db = require("./database");

// Obtener permiso de trabajo por id

router.get("/permiso", async (req, res) => {
  const id_permiso = parseInt(req.query.id_permiso, 10);
  if (!Number.isInteger(id_permiso) || id_permiso <= 0) {
    return res.status(400).json({ error: "id_permiso inválido" });
  }
  try {
    const result = await db.query(
      `SELECT 
        pt.*,
        pt.id_area AS area,
        d.nombre AS nombre_departamento_id,
        s.nombre AS nombre_sucursal_id
      FROM permisos_trabajo pt
      LEFT JOIN departamentos d ON pt.id_departamento = d.id_departamento
      LEFT JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
      WHERE pt.id_permiso = $1
      LIMIT 1`,
      [id_permiso]
    );
    if (result.rows && result.rows.length > 0) {
      res.json({ data: result.rows[0] });
    } else {
      res.status(404).json({ error: "Permiso no encontrado" });
    }
  } catch (err) {
    console.error("Error al consultar permiso:", err);
    res.status(500).json({ error: "Error en la consulta" });
  }
});


// Obtener participantes AST por id_permiso
router.get("/ast_participan", async (req, res) => {
  const id_permiso = parseInt(req.query.id_permiso, 10);
  if (!Number.isInteger(id_permiso) || id_permiso <= 0) {
    return res.status(400).json({ error: "id_permiso inválido" });
  }
  try {
    const result = await db.query(
      "SELECT * FROM ast_participan WHERE id_permiso = $1",
      [id_permiso]
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error("Error al consultar ast_participan:", err);
    res.status(500).json({ error: "Error en la consulta" });
  }
});

// Obtener actividades AST por id_permiso
router.get("/ast_actividades", async (req, res) => {
  const id_permiso = parseInt(req.query.id_permiso, 10);
  if (!Number.isInteger(id_permiso) || id_permiso <= 0) {
    return res.status(400).json({ error: "id_permiso inválido" });
  }
  try {
    const result = await db.query(
      "SELECT * FROM ast_actividades WHERE id_permiso = $1",
      [id_permiso]
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error("Error al consultar ast_actividades:", err);
    res.status(500).json({ error: "Error en la consulta" });
  }
});

// Obtener autorizaciones por id_permiso
router.get("/autorizaciones", async (req, res) => {
  const id_permiso = parseInt(req.query.id_permiso, 10);
  if (!Number.isInteger(id_permiso) || id_permiso <= 0) {
    return res.status(400).json({ error: "id_permiso inválido" });
  }
  try {
    const result = await db.query(
      "SELECT * FROM autorizaciones WHERE id_permiso = $1",
      [id_permiso]
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error("Error al consultar autorizaciones:", err);
    res.status(500).json({ error: "Error en la consulta" });
  }
});

module.exports = router;
