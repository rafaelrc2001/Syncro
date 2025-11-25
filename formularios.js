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
    verificacion_epp,
    verificacion_herramientas,
    verificacion_observaciones,
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
        trabajo_area_riesgo_controlado, necesita_entrega_fisica, necesita_ppe_adicional, area_circundante_riesgo, necesita_supervision, observaciones_analisis_previo,
        verificacion_epp, verificacion_herramientas, verificacion_observaciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
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
        verificacion_epp || null,
        verificacion_herramientas || null,
        verificacion_observaciones || null,
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

// Ruta para actualizar solo los requisitos de apertura (SI/NO/N/A)
router.put("/pt-apertura/requisitos_area/:id_permiso", async (req, res) => {
  const { id_permiso } = req.params;
  const {
    fuera_operacion,
    fuera_operacion_nombre,
    despresurizado_purgado,
    despresurizado_purgado_nombre,
    necesita_aislamiento,
    necesita_aislamiento_nombre,
    con_valvulas,
    con_valvulas_nombre,
    con_juntas_ciegas,
    con_juntas_ciegas_nombre,
    producto_entrampado,
    producto_entrampado_nombre,
    requiere_lavado,
    requiere_lavado_nombre,
    requiere_neutralizado,
    requiere_neutralizado_nombre,
    requiere_vaporizado,
    requiere_vaporizado_nombre,
    suspender_trabajos_adyacentes,
    suspender_trabajos_adyacentes_nombre,
    acordonar_area,
    acordonar_area_nombre,
    prueba_gas_toxico_inflamable,
    prueba_gas_toxico_inflamable_nombre,
    equipo_electrico_desenergizado,
    equipo_electrico_desenergizado_nombre,
    tapar_purgas_drenajes,
    tapar_purgas_drenajes_nombre,
    fluido,
    presion,
    temperatura,
    gas_lel,
    gas_co2,
    gas_nh3,
    gas_oxigeno,
  } = req.body;

  const query = `
    UPDATE pt_apertura SET
      fuera_operacion = $1,
      fuera_operacion_nombre = $2,
      despresurizado_purgado = $3,
      despresurizado_purgado_nombre = $4,
      necesita_aislamiento = $5,
      necesita_aislamiento_nombre = $6,
      con_valvulas = $7,
      con_valvulas_nombre = $8,
      con_juntas_ciegas = $9,
      con_juntas_ciegas_nombre = $10,
      producto_entrampado = $11,
      producto_entrampado_nombre = $12,
      requiere_lavado = $13,
      requiere_lavado_nombre = $14,
      requiere_neutralizado = $15,
      requiere_neutralizado_nombre = $16,
      requiere_vaporizado = $17,
      requiere_vaporizado_nombre = $18,
      suspender_trabajos_adyacentes = $19,
      suspender_trabajos_adyacentes_nombre = $20,
      acordonar_area = $21,
      acordonar_area_nombre = $22,
      prueba_gas_toxico_inflamable = $23,
      prueba_gas_toxico_inflamable_nombre = $24,
      equipo_electrico_desenergizado = $25,
      equipo_electrico_desenergizado_nombre = $26,
      tapar_purgas_drenajes = $27,
      tapar_purgas_drenajes_nombre = $28,
      fluido = $29,
      presion = $30,
      temperatura = $31,
      gas_lel = $32,
      gas_co2 = $33,
      gas_nh3 = $34,
      gas_oxigeno = $35
    WHERE id_permiso = $36
    RETURNING *;
  `;

  const values = [
    fuera_operacion,
    fuera_operacion_nombre,
    despresurizado_purgado,
    despresurizado_purgado_nombre,
    necesita_aislamiento,
    necesita_aislamiento_nombre,
    con_valvulas,
    con_valvulas_nombre,
    con_juntas_ciegas,
    con_juntas_ciegas_nombre,
    producto_entrampado,
    producto_entrampado_nombre,
    requiere_lavado,
    requiere_lavado_nombre,
    requiere_neutralizado,
    requiere_neutralizado_nombre,
    requiere_vaporizado,
    requiere_vaporizado_nombre,
    suspender_trabajos_adyacentes,
    suspender_trabajos_adyacentes_nombre,
    acordonar_area,
    acordonar_area_nombre,
    prueba_gas_toxico_inflamable,
    prueba_gas_toxico_inflamable_nombre,
    equipo_electrico_desenergizado,
    equipo_electrico_desenergizado_nombre,
    tapar_purgas_drenajes,
    tapar_purgas_drenajes_nombre,
    fluido,
    presion,
    temperatura,
    gas_lel,
    gas_co2,
    gas_nh3,
    gas_oxigeno,
    id_permiso,
  ];

  try {
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Permiso no encontrado" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar requisitos de apertura:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar requisitos de apertura",
    });
  }
});

// Ruta para actualizar los requisitos de supervisor y pruebas
router.put(
  "/pt-apertura/requisitos_supervisor/:id_permiso",
  async (req, res) => {
    const { id_permiso } = req.params;
    console.log("ID recibido:", id_permiso); // <-- Aquí
    console.log("Body recibido:", req.body); // <-- Aquí

    const {
      proteccion_especial_recomendada,
      proteccion_piel_cuerpo,
      proteccion_respiratoria,
      proteccion_ojos_cara,
      proteccion_contra_incendio,
      tipo_proteccion_incendio,
      requiere_barreras,
      observaciones,
      nivel_co2,
      nivel_nh3,
      nivel_oxigeno,
      nivel_lel,
      aprobado_co2,
      aprobado_nh3,
      aprobado_oxigeno,
      aprobado_lel,
    } = req.body;

    const query = `
      UPDATE pt_apertura SET
        proteccion_especial_recomendada = $1,
        proteccion_piel_cuerpo = $2,
        proteccion_respiratoria = $3,
        proteccion_ocular = $4,
        proteccion_contraincendio = $5,
        tipo_proteccion_contraincendio = $6,
        instalacion_barreras = $7,
        observaciones_riesgos = $8,
        co2_nivel = $9,
        nh3_nivel = $10,
        oxigeno_nivel = $11,
        lel_nivel = $12,
        aprobado_co2 = $13,
        aprobado_nh3 = $14,
        aprobado_oxigeno = $15,
        aprobado_lel = $16
      WHERE id_permiso = $17
      RETURNING *;
    `;

    const values = [
      proteccion_especial_recomendada,
      proteccion_piel_cuerpo,
      proteccion_respiratoria,
      proteccion_ojos_cara,
      proteccion_contra_incendio,
      tipo_proteccion_incendio,
      requiere_barreras,
      observaciones,
      nivel_co2,
      nivel_nh3,
      nivel_oxigeno,
      nivel_lel,
      aprobado_co2,
      aprobado_nh3,
      aprobado_oxigeno,
      aprobado_lel,
      id_permiso,
    ];

    try {
      const result = await db.query(query, values);
      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Permiso no encontrado" });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error("Error al actualizar requisitos supervisor:", error);
      res.status(500).json({
        success: false,
        error: "Error al actualizar requisitos supervisor",
      });
    }
  }
);

//este es para el pt no peligroso
//crea un api con el mismo formato que los otros pero para este en especifico

// Ruta para actualizar solo los requisitos de PT No Peligroso (fluido, presión, temperatura, análisis previo, etc)
router.put("/pt-no-peligroso/requisitos_area/:id_permiso", async (req, res) => {
  const { id_permiso } = req.params;
  console.log("ID recibido:", id_permiso);
  console.log("Body recibido:", req.body);
  const {
    fluido,
    presion,
    temperatura,
    trabajo_area_riesgo_controlado,
    necesita_entrega_fisica,
    necesita_ppe_adicional,
    area_circundante_riesgo,
    necesita_supervision,
    observaciones_analisis_previo,
  } = req.body;

  const query = `
    UPDATE pt_no_peligroso SET
      fluido = $1,
      presion = $2,
      temperatura = $3,
      trabajo_area_riesgo_controlado = $4,
      necesita_entrega_fisica = $5,
      necesita_ppe_adicional = $6,
      area_circundante_riesgo = $7,
      necesita_supervision = $8,
      observaciones_analisis_previo = $9
    WHERE id_permiso = $10
    RETURNING *;
  `;

  const values = [
    fluido,
    presion,
    temperatura,
    trabajo_area_riesgo_controlado,
    necesita_entrega_fisica,
    necesita_ppe_adicional,
    area_circundante_riesgo,
    necesita_supervision,
    observaciones_analisis_previo,
    id_permiso,
  ];

  try {
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Permiso no encontrado" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar requisitos PT No Peligroso:", error);
    res.status(500).json({
      success: false,
      error: "Error al actualizar requisitos PT No Peligroso",
    });
  }
});

// Ruta para obtener un permiso de apertura por id_permiso
router.get("/pt-apertura/:id_permiso", async (req, res) => {
  const { id_permiso } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM pt_apertura WHERE id_permiso = $1",
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Permiso no encontrado" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al obtener PT Apertura:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al obtener PT Apertura" });
  }
});

module.exports = router;
