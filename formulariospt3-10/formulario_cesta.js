const express = require("express");
const router = express.Router();
const pool = require("../database");

// Crear nuevo registro de cesta
router.post("/cesta", async (req, res) => {
  try {
    const data = req.body;
    // Validar campo obligatorio
    if (!data.id_permiso) {
      return res.status(400).json({
        success: false,
        message: "El campo id_permiso es obligatorio",
      });
    }

    const columns = [
      "id_permiso",
      "tipo_mantenimiento",
      "ot_numero",
      "tag",
      "hora_inicio",
      "equipo_intervenir",
      "descripcion_trabajo",
      "nombre_solicitante",
      "empresa",
      "identificacion_grua_cesta",
      "empresa_grua_cesta",
      "identificacion_cesta",
      "carga_maxima_cesta",
      "empresa_cesta",
      "peso_cesta",
      "ultima_revision_cesta",
      "condicion",
      "especificacion_ext_gatos",
      "utiliza_plumin_cesta",
      "especificacion_plumin_cesta",
      "longitud_pluma_cesta",
      "radio_trabajo_cesta",
      "carga_segura_cesta",
      "peso_carga_cesta",
      "peso_gancho_elementos",
      "carga_trabajo_cesta",
      "relacion_carga_segura_cesta",
      "carga_prueba",
      "prueba_realizada",
      "prueba_presenciada_por",
      "firma_prueba",
      "fecha_prueba",
      "mascaras_escape_cesta",
      "especificacion_mascaras",
      "equipo_proteccion_cesta",
      "especificacion_equipo_proteccion",
      "equipo_contra_incendios_cesta",
      "especificacion_equipo_incendios",
      "final_carrera_cesta",
      "otras_medidas_cesta",
      "especificacion_otras_medidas_cesta",
      "observaciones_generales_cesta",
    ];
    const values = columns.map((col) => data[col]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO pt_cesta (${columns.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`;
    const result = await pool.query(query, values);
    res.status(201).json({
      success: true,
      message: "Permiso de trabajo de cesta creado exitosamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear permiso de trabajo de cesta:", error);
    if (error.code === "23503") {
      // Foreign key violation
      return res.status(400).json({
        success: false,
        message: "El id_permiso no existe en la tabla permisos_trabajo",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
