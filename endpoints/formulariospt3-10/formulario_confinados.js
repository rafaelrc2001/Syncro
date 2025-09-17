const express = require("express");
const router = express.Router();
const db = require("../../endpoints/database");

// Ruta para insertar en la tabla pt_confinados
router.post("/pt-confinados", async (req, res) => {
  const {
    id_permiso,
    tipo_mantenimiento,
    ot_numero,
    tag,
    hora_inicio,
    equipo_intervenir,
    avisos_trabajos,
    iluminacion_prueba_explosion,
    ventilacion_forzada,
    evaluacion_medica_aptos,
    cable_vida_trabajadores,
    vigilancia_exterior,
    nombre_vigilante,
    personal_rescatista,
    nombre_rescatista,
    instalar_barreras,
    equipo_especial,
    tipo_equipo_especial,
    numero_personas_autorizadas,
    tiempo_permanencia_min,
    tiempo_recuperacion_min,
    clase_espacio_confinado,
    observaciones_adicionales,
    descripcion_trabajo, // <-- NUEVO
    nombre_solicitante,
  } = req.body;

  // Validar campos obligatorios mínimos (puedes ajustar según tus necesidades)
  if (!id_permiso || !tipo_mantenimiento || !hora_inicio) {
    return res.status(400).json({
      success: false,
      error: "Faltan campos obligatorios para pt_confinados",
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO pt_confinados (
        id_permiso, tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir,
        avisos_trabajos, iluminacion_prueba_explosion, ventilacion_forzada, evaluacion_medica_aptos, cable_vida_trabajadores,
        vigilancia_exterior, nombre_vigilante, personal_rescatista, nombre_rescatista, instalar_barreras, equipo_especial, tipo_equipo_especial,
        numero_personas_autorizadas, tiempo_permanencia_min, tiempo_recuperacion_min, clase_espacio_confinado, observaciones_adicionales,
        descripcion_trabajo, nombre_solicitante      -- <-- NUEVO
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) RETURNING *`,
      [
        id_permiso,
        tipo_mantenimiento,
        ot_numero || null,
        tag || null,
        hora_inicio,
        equipo_intervenir || null,
        avisos_trabajos || null,
        iluminacion_prueba_explosion || null,
        ventilacion_forzada || null,
        evaluacion_medica_aptos || null,
        cable_vida_trabajadores || null,
        vigilancia_exterior || null,
        nombre_vigilante || null,
        personal_rescatista || null,
        nombre_rescatista || null,
        instalar_barreras || null,
        equipo_especial || null,
        tipo_equipo_especial || null,
        numero_personas_autorizadas || null,
        tiempo_permanencia_min || null,
        tiempo_recuperacion_min || null,
        clase_espacio_confinado || null,
        observaciones_adicionales || null,
        descripcion_trabajo || null, // <-- NUEVO
        nombre_solicitante || null, // <-- NUEVO
      ]
    );
    res.status(201).json({
      success: true,
      message: "Registro de PT Confinados creado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al registrar PT Confinados",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Endpoint para consultar  permiso tipo confinados (PT3)
router.get("/pt-confinado/:id", async (req, res) => {
  const id_permiso = req.params.id;
  try {
    const result = await db.query(
      `SELECT * FROM pt_confinados WHERE id_permiso = $1 LIMIT 1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró apertura para este permiso (confinados)",
      });
    }
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar apertura de PT Confinados:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar apertura de PT Confinados",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
