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

// Endpoint para actualizar requisitos del área en PT eléctrico
router.put("/pt-electrico/requisitos_area/:id", async (req, res) => {
  const id_permiso = req.params.id;
  const {
    identifico_equipo,
    verifico_identifico_equipo,
    fuera_operacion_desenergizado,
    verifico_fuera_operacion_desenergizado,
    candado_etiqueta,
    verifico_candado_etiqueta,
    suspender_adyacentes,
    verifico_suspender_adyacentes,
    area_limpia_libre_obstaculos,
    verifico_area_limpia_libre_obstaculos,
    libranza_electrica,
    verifico_libranza_electrica,
    nivel_tension,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE pt_electrico SET
        identifico_equipo = $1,
        verifico_identifico_equipo = $2,
        fuera_operacion_desenergizado = $3,
        verifico_fuera_operacion_desenergizado = $4,
        candado_etiqueta = $5,
        verifico_candado_etiqueta = $6,
        suspender_adyacentes = $7,
        verifico_suspender_adyacentes = $8,
        area_limpia_libre_obstaculos = $9,
        verifico_area_limpia_libre_obstaculos = $10,
        libranza_electrica = $11,
        verifico_libranza_electrica = $12,
        nivel_tension = $13,
        fecha_actualizacion = NOW()
       WHERE id_permiso = $14
       RETURNING *`,
      [
        identifico_equipo,
        verifico_identifico_equipo,
        fuera_operacion_desenergizado,
        verifico_fuera_operacion_desenergizado,
        candado_etiqueta,
        verifico_candado_etiqueta,
        suspender_adyacentes,
        verifico_suspender_adyacentes,
        area_limpia_libre_obstaculos,
        verifico_area_limpia_libre_obstaculos,
        libranza_electrica,
        verifico_libranza_electrica,
        nivel_tension,
        id_permiso,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el permiso eléctrico para actualizar",
      });
    }

    res.json({
      success: true,
      message: "Requisitos del área actualizados correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Error al actualizar requisitos del área en pt_electrico:",
      error
    );
    res.status(500).json({
      success: false,
      error: "Error al actualizar requisitos del área",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
