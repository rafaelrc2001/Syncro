const express = require("express");
const router = express.Router();
const db = require("../../endpoints/database");

// Endpoint para insertar un nuevo permiso de fuego abierto
router.post("/pt-fuego", async (req, res) => {
  const {
    id_permiso,
    tipo_mantenimiento,
    tipo_mantenimiento_otro,
    ot_numero,
    tag,
    hora_inicio,
    equipo_intervenir,
    empresa,
    descripcion_trabajo,
    nombre_solicitante, // <-- NUEVO
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO pt_fuego (
        id_permiso,
        tipo_mantenimiento,
        tipo_mantenimiento_otro,
        ot_numero,
        tag,
        hora_inicio,
        equipo_intervenir,
        empresa,
        descripcion_trabajo,
        nombre_solicitante -- <-- NUEVO
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        id_permiso,
        tipo_mantenimiento,
        tipo_mantenimiento_otro,
        ot_numero,
        tag,
        hora_inicio,
        equipo_intervenir,
        empresa,
        descripcion_trabajo,
        nombre_solicitante, // <-- NUEVO
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al insertar en pt_fuego:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para consultar permiso de fuego abierto por id
router.get("/pt-fuego/:id", async (req, res) => {
  const id_permiso = req.params.id;
  try {
    const result = await db.query(
      `SELECT * FROM pt_fuego WHERE id_permiso = $1 LIMIT 1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró apertura para este permiso (fuego)",
      });
    }
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar apertura de PT Fuego:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar apertura de PT Fuego",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
