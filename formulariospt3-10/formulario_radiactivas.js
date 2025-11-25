const express = require("express");
const router = express.Router();
const db = require("../database");

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
    observaciones_radiacion,
    tecnico_radialogo, // Nuevo campo para nombre de quien firma
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
        observaciones_radiacion,
        tecnico_radialogo
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25
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
        observaciones_radiacion,
        tecnico_radialogo,
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al insertar en pt_radiacion:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para consultar permiso de fuentes radioactivas por id
router.get("/pt-radiacion/:id", async (req, res) => {
  const id_permiso = req.params.id;
  try {
    const result = await db.query(
      `SELECT * FROM pt_radiacion WHERE id_permiso = $1 LIMIT 1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró apertura para este permiso (radiación)",
      });
    }
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar apertura de PT Radiación:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar apertura de PT Radiación",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Endpoint para actualizar requisitos del área en PT radiactivo
router.put("/pt-radiacion/requisitos_area/:id", async (req, res) => {
  const id_permiso = req.params.id;
  const {
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
    observaciones_radiacion,
    fluido,
    presion,
    temperatura,
    observaciones, // Nuevo campo para la columna agregada
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE pt_radiacion SET
        tipo_fuente_radiactiva = $1,
        actividad_radiactiva = $2,
        numero_serial_fuente = $3,
        distancia_trabajo = $4,
        tiempo_exposicion = $5,
        dosis_estimada = $6,
        equipo_proteccion_radiologica = $7,
        dosimetros_personales = $8,
        monitores_radiacion_area = $9,
        senalizacion_area = $10,
        barricadas = $11,
        protocolo_emergencia = $12,
        personal_autorizado = $13,
        observaciones_radiacion = $14,
        fluido = $15,
        presion = $16,
        temperatura = $17,
        observaciones = $18,
        fecha_actualizacion = NOW()
      WHERE id_permiso = $19
      RETURNING *`,
      [
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
        observaciones_radiacion,
        fluido,
        presion,
        temperatura,
        observaciones,
        id_permiso,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el permiso radiactivo para actualizar",
      });
    }

    res.json({
      success: true,
      message: "Requisitos del área actualizados correctamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Error al actualizar requisitos del área en pt_radiacion:",
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

// Endpoint para actualizar identificación de la fuente en permiso de radiactivas
router.put(
  "/radiactivas/identificacion_fuente/:id_permiso",
  async (req, res) => {
    const id_permiso = req.params.id_permiso;
    const {
      marca_modelo,
      marca_modelo_check,
      tipo_isotopo,
      tipo_isotopo_check,
      numero_fuente,
      numero_fuente_check,
      actividad_fuente,
      actividad_fuente_check,
      fecha_dia,
      fecha_mes,
      fecha_anio,
      tecnico_radialogo, // Nuevo campo para nombre de quien firma
    } = req.body;

    // Mostrar en consola los datos recibidos
    console.log(
      "[PT7 radiactivas] Datos recibidos para identificación de la fuente:",
      {
        marca_modelo,
        marca_modelo_check,
        tipo_isotopo,
        tipo_isotopo_check,
        numero_fuente,
        numero_fuente_check,
        actividad_fuente,
        actividad_fuente_check,
        fecha_dia,
        fecha_mes,
        fecha_anio,
        id_permiso,
      }
    );

    try {
      const result = await db.query(
        `UPDATE pt_radiacion SET
        marca_modelo = $1,
        marca_modelo_check = $2,
        tipo_isotopo = $3,
        tipo_isotopo_check = $4,
        numero_fuente = $5,
        numero_fuente_check = $6,
        actividad_fuente = $7,
        actividad_fuente_check = $8,
        fecha_dia = $9,
        fecha_mes = $10,
        fecha_anio = $11,
        tecnico_radialogo = $12
      WHERE id_permiso = $13
      RETURNING *`,
        [
          marca_modelo,
          marca_modelo_check,
          tipo_isotopo,
          tipo_isotopo_check,
          numero_fuente,
          numero_fuente_check,
          actividad_fuente,
          actividad_fuente_check,
          fecha_dia,
          fecha_mes,
          fecha_anio,
          tecnico_radialogo,
          id_permiso,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontró el permiso de radiactivas para actualizar",
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
        message: "Identificación de la fuente actualizada correctamente",
      });
    } catch (error) {
      console.error(
        "Error al actualizar identificación de la fuente en pt_radiacion:",
        error
      );
      res.status(500).json({
        success: false,
        error: "Error al actualizar identificación de la fuente",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

module.exports = router;
