const express = require("express");
const router = express.Router();
const db = require("./database");
const { pool } = require("./database");

// Ruta para insertar en la tabla pt_no_peligroso
// Ruta para insertar en la tabla pt_no_peligroso
// Ruta para insertar en la tabla pt_no_peligroso
// Ruta para insertar en la tabla pt_no_peligroso
// Ruta para insertar en la tabla pt_no_peligroso

router.post("/pt-no-peligroso", async (req, res) => {
  const {
    id_permiso,
    nombre_solicitante,
    descripcion_trabajo,
    tipo_mantenimiento,
    ot_no,
    equipo_intervencion,
    hora_inicio,
    tag,
    fluido,
    presion,
    temperatura,
    empresa,
    trabajo_area_riesgo_controlado,
    necesita_entrega_fisica,
    necesita_ppe_adicional,
    area_circundante_riesgo,
    necesita_supervision,
    observaciones_analisis_previo,
  } = req.body;

  // Mostrar por consola los datos recibidos

  // Validar campos obligatorios
  if (
    !id_permiso ||
    !nombre_solicitante ||
    !descripcion_trabajo ||
    !tipo_mantenimiento ||
    !hora_inicio ||
    !empresa
  ) {
    return res.status(400).json({
      success: false,
      error: "Faltan campos obligatorios para pt_no_peligroso",
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO pt_no_peligroso (
        id_permiso, nombre_solicitante, descripcion_trabajo, tipo_mantenimiento, ot_no, equipo_intervencion, hora_inicio, tag, fluido, presion, temperatura, empresa,
        trabajo_area_riesgo_controlado, necesita_entrega_fisica, necesita_ppe_adicional, area_circundante_riesgo, necesita_supervision, observaciones_analisis_previo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        id_permiso,
        nombre_solicitante,
        descripcion_trabajo,
        tipo_mantenimiento,
        ot_no || null,
        equipo_intervencion,
        hora_inicio,
        tag || null,
        fluido || null,
        presion || null,
        temperatura || null,
        empresa,
        trabajo_area_riesgo_controlado || null,
        necesita_entrega_fisica || null,
        necesita_ppe_adicional || null,
        area_circundante_riesgo || null,
        necesita_supervision || null,
        observaciones_analisis_previo || null,
      ]
    );
    res.status(201).json({
      success: true,
      message: "Registro de PT No Peligroso creado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al registrar PT No Peligroso",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Ruta para insertar en el formulario pt-apertura
// Ruta para insertar en el formulario pt-apertura
// Ruta para insertar en el formulario pt-apertura
// Ruta para insertar en el formulario pt-apertura
// Ruta para insertar en el formulario pt-apertura
router.post("/pt-apertura", async (req, res) => {
  const {
    id_permiso,
    tipo_mantenimiento,
    otro_tipo_mantenimiento,
    ot_numero,
    tag,
    hora_inicio,
    tiene_equipo_intervenir,
    descripcion_equipo,
    fluido,
    presion,
    temperatura,
    antecedentes,
    requiere_herramientas_especiales,
    tipo_herramientas_especiales,
    herramientas_adecuadas,
    requiere_verificacion_previa,
    requiere_conocer_riesgos,
    observaciones_medidas,
    fuera_operacion,
    despresurizado_purgado,
    necesita_aislamiento,
    con_valvulas,
    con_juntas_ciegas,
    producto_entrampado,
    requiere_lavado,
    requiere_neutralizado,
    requiere_vaporizado,
    suspender_trabajos_adyacentes,
    acordonar_area,
    prueba_gas_toxico_inflamable,
    equipo_electrico_desenergizado,
    tapar_purgas_drenajes,
    proteccion_especial_recomendada,
    proteccion_piel_cuerpo,
    proteccion_respiratoria,
    proteccion_ocular,
    proteccion_contraincendio,
    tipo_proteccion_contraincendio,
    instalacion_barreras,
    observaciones_riesgos,
    co2_nivel,
    nh3_nivel,
    oxigeno_nivel,
    lel_nivel,
    empresa,
    nombre_solicitante,
    descripcion_trabajo, // <-- AGREGAR ESTOS
  } = req.body;

  const query = `
   INSERT INTO pt_apertura (
  id_permiso, tipo_mantenimiento, otro_tipo_mantenimiento, ot_numero, tag, hora_inicio, tiene_equipo_intervenir, descripcion_equipo,
  fluido, presion, temperatura, antecedentes, requiere_herramientas_especiales, tipo_herramientas_especiales, herramientas_adecuadas,
  requiere_verificacion_previa, requiere_conocer_riesgos, observaciones_medidas, fuera_operacion, despresurizado_purgado,
  necesita_aislamiento, con_valvulas, con_juntas_ciegas, producto_entrampado, requiere_lavado, requiere_neutralizado,
  requiere_vaporizado, suspender_trabajos_adyacentes, acordonar_area, prueba_gas_toxico_inflamable, equipo_electrico_desenergizado,
  tapar_purgas_drenajes, proteccion_especial_recomendada, proteccion_piel_cuerpo, proteccion_respiratoria, proteccion_ocular,
  proteccion_contraincendio, tipo_proteccion_contraincendio, instalacion_barreras, observaciones_riesgos, co2_nivel, nh3_nivel,
  oxigeno_nivel, lel_nivel, empresa, nombre_solicitante, descripcion_trabajo
)
VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47
)
RETURNING *;
    `;
  const values = [
    id_permiso,
    tipo_mantenimiento,
    otro_tipo_mantenimiento,
    ot_numero,
    tag,
    hora_inicio,
    tiene_equipo_intervenir,
    descripcion_equipo,
    fluido,
    presion,
    temperatura,
    antecedentes,
    requiere_herramientas_especiales,
    tipo_herramientas_especiales,
    herramientas_adecuadas,
    requiere_verificacion_previa,
    requiere_conocer_riesgos,
    observaciones_medidas,
    fuera_operacion,
    despresurizado_purgado,
    necesita_aislamiento,
    con_valvulas,
    con_juntas_ciegas,
    producto_entrampado,
    requiere_lavado,
    requiere_neutralizado,
    requiere_vaporizado,
    suspender_trabajos_adyacentes,
    acordonar_area,
    prueba_gas_toxico_inflamable,
    equipo_electrico_desenergizado,
    tapar_purgas_drenajes,
    proteccion_especial_recomendada,
    proteccion_piel_cuerpo,
    proteccion_respiratoria,
    proteccion_ocular,
    proteccion_contraincendio,
    tipo_proteccion_contraincendio,
    instalacion_barreras,
    observaciones_riesgos,
    co2_nivel,
    nh3_nivel,
    oxigeno_nivel,
    lel_nivel,
    empresa,
    nombre_solicitante,
    descripcion_trabajo,
  ];

  // Validar campos obligatorios
  if (!id_permiso || !tipo_mantenimiento || !hora_inicio) {
    return res.status(400).json({
      success: false,
      error: "Faltan campos obligatorios para pt_apertura",
    });
  }

  try {
    const result = await db.query(query, values);
    const newEntry = result.rows[0];
    res.status(201).json({
      success: true,
      data: newEntry,
    });
  } catch (error) {
    console.error("Error al insertar PT Apertura:", error);
    res.status(500).json({
      success: false,
      error: "Error al insertar PT Apertura",
    });
  }
});

// ...existing code...
module.exports = router;
