const express = require("express");
const router = express.Router();
const pool = require("../database");

// Crear nuevo registro de izaje
router.post("/pt_izaje", async (req, res) => {
  try {
    const {
      // Campos principales
      id_permiso,
      tipo_mantenimiento,
      ot_numero,
      tag,
      hora_inicio,
      equipo_intervenir,
      descripcion_trabajo,
      nombre_solicitante,
      empresa,

      // datos 1
      hora_inicio_prevista,
      responsable_operacion,
      hora_fin_prevista,

      // datos 2
      empresa_grua,
      identificacion_grua,
      declaracion_conformidad,
      inspeccion_periodica,
      mantenimiento_preventivo,
      inspeccion_diaria,
      diagrama_cargas,
      libro_instrucciones,
      limitador_carga,
      final_carrera,

      // datos 3
      nombre_operador,
      empresa_operador,
      licencia_operador,
      numero_licencia,
      fecha_emision_licencia,
      vigencia_licencia,
      tipo_licencia,
      comentarios_operador,

      // datos 4
      estrobos_eslingas,
      grilletes,
      otros_elementos_auxiliares,
      especificacion_otros_elementos,
      requiere_eslingado_especifico,
      especificacion_eslingado,

      // datos 5
      extension_gatos,
      sobre_ruedas,
      especificacion_sobre_ruedas,
      utiliza_plumin_si,
      especificacion_plumin,
      longitud_pluma,
      radio_trabajo,

      // datos 6
      contrapeso,
      sector_trabajo,
      carga_segura_diagrama,
      peso_carga,
      determinada_por,
      carga_trabajo,

      // datos 7
      peso_gancho_eslingas,
      relacion_carga_carga_segura,
      asentamiento,
      calzado,
      extension_gatos_check,
      nivelacion,
      contrapeso_check,
      sector_trabajo_check,
      comprobado_por,

      // últimos campos
      balizamiento_operacion,
      reunion_previa,
      especificacion_reunion_previa,
      presentacion_supervisor,
      nombre_supervisor,
      permiso_adicional,
      especificacion_permiso_adicional,
      otras_medidas_seguridad,
      especificacion_otras_medidas,
      observaciones_generales,
    } = req.body;

    // Validar campos obligatorios
    if (!id_permiso) {
      return res.status(400).json({
        success: false,
        message: "El campo id_permiso es obligatorio",
      });
    }

    // Insertar en la base de datos
    // Lista de columnas y valores alineados
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
      "hora_inicio_prevista",
      "responsable_operacion",
      "hora_fin_prevista",
      "empresa_grua",
      "identificacion_grua",
      "declaracion_conformidad",
      "inspeccion_periodica",
      "mantenimiento_preventivo",
      "inspeccion_diaria",
      "diagrama_cargas",
      "libro_instrucciones",
      "limitador_carga",
      "final_carrera",
      "nombre_operador",
      "empresa_operador",
      "licencia_operador",
      "numero_licencia",
      "fecha_emision_licencia",
      "vigencia_licencia",
      "tipo_licencia",
      "comentarios_operador",
      "estrobos_eslingas",
      "grilletes",
      "otros_elementos_auxiliares",
      "especificacion_otros_elementos",
      "requiere_eslingado_especifico",
      "especificacion_eslingado",
      "extension_gatos",
      "sobre_ruedas",
      "especificacion_sobre_ruedas",
      "utiliza_plumin_si",
      "especificacion_plumin",
      "longitud_pluma",
      "radio_trabajo",
      "contrapeso",
      "sector_trabajo",
      "carga_segura_diagrama",
      "peso_carga",
      "determinada_por",
      "carga_trabajo",
      "peso_gancho_eslingas",
      "relacion_carga_carga_segura",
      "asentamiento",
      "calzado",
      "extension_gatos_check",
      "nivelacion",
      "contrapeso_check",
      "sector_trabajo_check",
      "comprobado_por",
      "balizamiento_operacion",
      "reunion_previa",
      "especificacion_reunion_previa",
      "presentacion_supervisor",
      "nombre_supervisor",
      "permiso_adicional",
      "especificacion_permiso_adicional",
      "otras_medidas_seguridad",
      "especificacion_otras_medidas",
      "observaciones_generales",
    ];

    const values = columns.map((col) => eval(col));

    const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO pt_izaje (${columns.join(
      ", "
    )}) VALUES (${placeholders}) RETURNING *`;

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Permiso de trabajo de izaje creado exitosamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear permiso de trabajo de izaje:", error);

    // Manejar error de clave foránea
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
