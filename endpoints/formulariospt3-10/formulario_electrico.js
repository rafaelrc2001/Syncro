const express = require("express");
const router = express.Router();
const db = require("../../endpoints/database");

// Endpoint para insertar un nuevo permiso de trabajo eléctrico
router.post("/pt-electrico", async (req, res) => {
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
    nombre_solicitante,
    equipo_desenergizado,
    interruptores_abiertos,
    verificar_ausencia_voltaje,
    candados_equipo,
    tarjetas_alerta,
    aviso_personal_area,
    tapetes_dielectricos,
    herramienta_aislante,
    pertiga_telescopica,
    equipo_proteccion_especial,
    tipo_equipo_proteccion,
    aterrizar_equipo,
    barricadas_area,
    observaciones_adicionales,
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO pt_electrico (
        id_permiso,
        tipo_mantenimiento,
        tipo_mantenimiento_otro,
        ot_numero,
        tag,
        hora_inicio,
        equipo_intervenir,
        empresa,
        descripcion_trabajo,
        nombre_solicitante,
        equipo_desenergizado,
        interruptores_abiertos,
        verificar_ausencia_voltaje,
        candados_equipo,
        tarjetas_alerta,
        aviso_personal_area,
        tapetes_dielectricos,
        herramienta_aislante,
        pertiga_telescopica,
        equipo_proteccion_especial,
        tipo_equipo_proteccion,
        aterrizar_equipo,
        barricadas_area,
        observaciones_adicionales
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24
      ) RETURNING *`,
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
        nombre_solicitante,
        equipo_desenergizado,
        interruptores_abiertos,
        verificar_ausencia_voltaje,
        candados_equipo,
        tarjetas_alerta,
        aviso_personal_area,
        tapetes_dielectricos,
        herramienta_aislante,
        pertiga_telescopica,
        equipo_proteccion_especial,
        tipo_equipo_proteccion,
        aterrizar_equipo,
        barricadas_area,
        observaciones_adicionales,
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al insertar en pt_electrico:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para consultar permiso de trabajo eléctrico por id
router.get("/pt-electrico/:id", async (req, res) => {
  const id_permiso = req.params.id;
  try {
    const result = await db.query(
      `SELECT * FROM pt_electrico WHERE id_permiso = $1 LIMIT 1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró apertura para este permiso (eléctrico)",
      });
    }
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar apertura de PT Eléctrico:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar apertura de PT Eléctrico",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
