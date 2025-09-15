const express = require("express");
const router = express.Router();
const db = require("../../endpoints/database");

// Endpoint para insertar un nuevo permiso de fuentes radioactivas
router.post("/pt-radiacion", async (req, res) => {
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
    tipo_fuente_radiactiva,
    actividad_radiactiva,
    numero_serial_fuente,
    distancia_trabajo,
    tiempo_exposicion,
    dosis_estimada,
    equipo_proteccion_radiologica,
    dosimetros_personales,
    monitores_radiacion_area,
    senalizacion_area,
    barricadas,
    protocolo_emergencia,
    personal_autorizado,
    observaciones_radiacion
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO pt_radiacion (
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
        tipo_fuente_radiactiva,
        actividad_radiactiva,
        numero_serial_fuente,
        distancia_trabajo,
        tiempo_exposicion,
        dosis_estimada,
        equipo_proteccion_radiologica,
        dosimetros_personales,
        monitores_radiacion_area,
        senalizacion_area,
        barricadas,
        protocolo_emergencia,
        personal_autorizado,
        observaciones_radiacion
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
        tipo_fuente_radiactiva,
        actividad_radiactiva,
        numero_serial_fuente,
        distancia_trabajo,
        tiempo_exposicion,
        dosis_estimada,
        equipo_proteccion_radiologica,
        dosimetros_personales,
        monitores_radiacion_area,
        senalizacion_area,
        barricadas,
        protocolo_emergencia,
        personal_autorizado,
        observaciones_radiacion
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al insertar en pt_radiacion:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;