const express = require("express");
const router = express.Router();
const db = require("./database");
const { pool } = require("./database");

console.log("[DEBUG] tablas.js cargado");

// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto
// Ruta para insertar el estatus por defecto

router.post("/estatus/default", async (req, res) => {
  const ESTATUS_DEFAULT = "en espera del área";
  const { id_permiso } = req.body;

  if (!id_permiso) {
    return res.status(400).json({
      success: false,
      error: "id_permiso es requerido",
    });
  }

  try {
    const result = await db.query(
      "INSERT INTO estatus (estatus, id_permiso, comentarios, subestatus) VALUES ($1, $2, $3, $4) RETURNING id_estatus as id, estatus",
      [ESTATUS_DEFAULT, id_permiso, null, null]
    );

    res.status(201).json({
      success: true,
      message: "Estatus creado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al crear el estatus",
      details: err.message,
    });
  }
});

// Ruta para insertar el ast_participan
// Ruta para insertar el ast_participan
// Ruta para insertar el ast_participan
// Ruta para insertar el ast_participan
// Ruta para insertar el ast_participan
// Ruta para insertar el ast_participan

router.post("/ast-participan", async (req, res) => {
  const { participants } = req.body;

  // Validaciones
  if (!Array.isArray(participants)) {
    return res.status(400).json({
      success: false,
      error: "El formato de participantes debe ser un arreglo",
    });
  }

  if (participants.length === 0) {
    return res.status(400).json({
      success: false,
      error: "No se recibieron participantes",
    });
  }

  try {
    const results = [];

    // Insertar cada participante con id_permiso
    for (const participant of participants) {
      if (!participant.nombre || !participant.credencial) {
        throw new Error("Nombre y credencial son campos obligatorios");
      }
      if (!participant.id_permiso) {
        throw new Error("id_permiso es obligatorio para cada participante");
      }

      const result = await db.query(
        `INSERT INTO ast_participan 
         (nombre, credencial, cargo, funcion, id_permiso) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          participant.nombre,
          participant.credencial,
          participant.cargo || null,
          participant.funcion || null,
          participant.id_permiso
        ]
      );

      results.push(result.rows[0]);
    }

    res.status(201).json({
      success: true,
      message: "Participantes registrados exitosamente",
      data: results,
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al registrar los participantes",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// ...existing code...

// Ruta para insertar un registro en permisos_trabajo
// Ruta para insertar un registro en permisos_trabajo
// Ruta para insertar un registro en permisos_trabajo
// Ruta para insertar un registro en permisos_trabajo

// TENER EN CUENTA QUE ESTA TABLA SE NECESITA INSERTAR CON VALORES POR DEFAULT PARA PODER TENER
// Ruta para insertar un registro en permisos_trabajo con datos recibidos por body
router.post("/permisos-trabajo", async (req, res) => {
  const {
    id_area,
    id_departamento,
    id_sucursal,
    contrato,
    fecha_hora,
    id_usuario,
    tipo_mantenimiento,
    ot_numero,
    tag,
    hora_inicio,
    equipo_intervenir,
    descripcion_trabajo,
    nombre_solicitante,
    empresa,
    PAL_EPP_1,
    PAL_EPP_2,
    PAL_FA_1,
    PAL_FA_2,
    PAL_EPC_1,
    PAL_EPC_2,
    PAL_CR_1,
    PCO_EH_1,
    PCO_MA_1,
    PCO_MA_2,
    PCO_MA_3,
    PCO_MA_4,
    PCO_MA_5,
    PCO_ERA_1,
    PFG_CR_1,
    PFG_CR_1A,
    PFG_EPPE_1,
    PFG_EPPE_2,
    PFG_MA_1,
    PFG_MA_2,
    PFG_MA_3,
    PAP_CE_1,
    PAP_CE_2,
    PAP_EPE_1,
    nombre_departamento,
    columna_fuego_valor,
    columna_altura_valor,
    columna_apertura_valor,
    columna_confinado_valor,
    // Nuevas columnas para Permiso No Peligroso
    pno_cr_1,
    pno_cr_2,
    pno_cr_3,
    pno_cr_4,
    pno_cr_5,
    pno_cr_6,
    pno_cr_7,
    pno_cr_8,
    pno_cr_9,
    pno_cr_10,
    pno_cr_11,
    pno_cr_12,
    pno_cr_13,
    pno_epe_1,
    pno_epe_2,
    pno_epe_3,
    pno_epe_4,
    pno_epe_5,
    pno_epe_6,
    pno_epe_7,
    pno_epe_8,
    pno_epe_9,
    columna_nopeligrosovalor_valor
  } = req.body;

  // Validar que los campos obligatorios existan
  if (
    [
      id_area,
      id_departamento,
      id_sucursal,
      id_usuario,
    ].some((v) => typeof v === "undefined")
  ) {
    return res.status(400).json({
      success: false,
      error: "Todos los campos son requeridos para permisos_trabajo",
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO permisos_trabajo (
        id_area, id_departamento, id_sucursal, contrato, fecha_hora, id_usuario,
        tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir, descripcion_trabajo, nombre_solicitante, empresa,
        PAL_EPP_1, PAL_EPP_2, PAL_FA_1, PAL_FA_2, PAL_EPC_1, PAL_EPC_2, PAL_CR_1,
        PCO_EH_1, PCO_MA_1, PCO_MA_2, PCO_MA_3, PCO_MA_4, PCO_MA_5, PCO_ERA_1,
        PFG_CR_1, PFG_CR_1A, PFG_EPPE_1, PFG_EPPE_2, PFG_MA_1, PFG_MA_2, PFG_MA_3,
        PAP_CE_1, PAP_CE_2, PAP_EPE_1, nombre_departamento,
        columna_fuego_valor, columna_altura_valor, columna_apertura_valor, columna_confinado_valor,
        pno_cr_1, pno_cr_2, pno_cr_3, pno_cr_4, pno_cr_5, pno_cr_6, pno_cr_7, pno_cr_8, pno_cr_9, pno_cr_10, pno_cr_11, pno_cr_12, pno_cr_13,
        pno_epe_1, pno_epe_2, pno_epe_3, pno_epe_4, pno_epe_5, pno_epe_6, pno_epe_7, pno_epe_8, pno_epe_9, columna_nopeligrosovalor_valor
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22,
        $23, $24, $25, $26, $27, $28, $29,
        $30, $31, $32, $33, $34, $35, $36,
        $37, $38, $39, $40, $41, $42, $43,
        $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56,
        $57, $58, $59, $60, $61, $62, $63, $64, $65, $66
      )
      RETURNING *`,
      [
        id_area,
        id_departamento,
        id_sucursal,
        contrato || null,
        fecha_hora || null,
        id_usuario,
        tipo_mantenimiento || null,
        ot_numero || null,
        tag || null,
        hora_inicio || null,
        equipo_intervenir || null,
        descripcion_trabajo || null,
        nombre_solicitante || null,
        empresa || null,
        PAL_EPP_1 || null,
        PAL_EPP_2 || null,
        PAL_FA_1 || null,
        PAL_FA_2 || null,
        PAL_EPC_1 || null,
        PAL_EPC_2 || null,
        PAL_CR_1 || null,
        PCO_EH_1 || null,
        PCO_MA_1 || null,
        PCO_MA_2 || null,
        PCO_MA_3 || null,
        PCO_MA_4 || null,
        PCO_MA_5 || null,
        PCO_ERA_1 || null,
        PFG_CR_1 || null,
        PFG_CR_1A || null,
        PFG_EPPE_1 || null,
        PFG_EPPE_2 || null,
        PFG_MA_1 || null,
        PFG_MA_2 || null,
        PFG_MA_3 || null,
        PAP_CE_1 || null,
        PAP_CE_2 || null,
        PAP_EPE_1 || null,
        nombre_departamento || null,
        columna_fuego_valor || null,
        columna_altura_valor || null,
        columna_apertura_valor || null,
        columna_confinado_valor || null,
        pno_cr_1 || null,
        pno_cr_2 || null,
        pno_cr_3 || null,
        pno_cr_4 || null,
        pno_cr_5 || null,
        pno_cr_6 || null,
        pno_cr_7 || null,
        pno_cr_8 || null,
        pno_cr_9 || null,
        pno_cr_10 || null,
        pno_cr_11 || null,
        pno_cr_12 || null,
        pno_cr_13 || null,
        pno_epe_1 || null,
        pno_epe_2 || null,
        pno_epe_3 || null,
        pno_epe_4 || null,
        pno_epe_5 || null,
        pno_epe_6 || null,
        pno_epe_7 || null,
        pno_epe_8 || null,
        pno_epe_9 || null,
        columna_nopeligrosovalor_valor || null,
      ]
    );
    const id_permiso = result.rows[0].id_permiso;
    const prefijo = `GSI-PT-N${id_permiso}`;
    console.log("[DEBUG] id_permiso generado:", id_permiso);
    console.log("[DEBUG] prefijo a guardar:", prefijo);
    const updateQuery =
      "UPDATE permisos_trabajo SET prefijo = $1 WHERE id_permiso = $2";
    const updateParams = [prefijo, id_permiso];
    console.log("[DEBUG] Ejecutando UPDATE:", updateQuery, updateParams);
    const updateResult = await db.query(updateQuery, updateParams);
    console.log(
      "[DEBUG] Resultado UPDATE:",
      updateResult.rowCount,
      "filas actualizadas"
    );
    // Actualizar el objeto de respuesta con el prefijo
    result.rows[0].prefijo = prefijo;
    res.status(201).json({
      success: true,
      message: "Permiso de trabajo registrado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al registrar el permiso de trabajo",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});
// LA TABLA Y MAS ADELANTE PODER HACER LA SUSTITUCION

// Ruta para insertar en la tabla autorizaciones
// Ruta para insertar en la tabla autorizaciones
// Ruta para insertar en la tabla autorizaciones
// Ruta para insertar en la tabla autorizaciones
// Ruta para insertar en la tabla autorizaciones

router.post("/autorizaciones", async (req, res) => {
  let { id_permiso, id_supervisor, id_categoria, responsable_area } = req.body;

  // Asignar valores por defecto si no vienen en el body
  if (!id_permiso)
    return res
      .status(400)
      .json({ success: false, error: "id_permiso es requerido" });
  if (!id_supervisor) id_supervisor = 2; // Cambia este valor por el que corresponda
  if (!id_categoria) id_categoria = 7; // Cambia este valor por el que corresponda
  if (!responsable_area) responsable_area = "Por Defecto"; // Cambia este valor por el que corresponda

  try {
    const result = await db.query(
      `INSERT INTO autorizaciones (id_permiso, id_supervisor, id_categoria, responsable_area)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_permiso, id_supervisor, id_categoria, responsable_area]
    );
    res.status(201).json({
      success: true,
      message: "Autorización registrada exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al registrar la autorización",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Ruta para insertar en la tabla ast_actividades
// Ruta para insertar en la tabla ast_actividades
// Ruta para insertar en la tabla ast_actividades
// Ruta para insertar en la tabla ast_actividades
// Ruta para insertar en la tabla ast_actividades
router.post("/ast-actividades", async (req, res) => {
  const { actividades } = req.body;
  if (!Array.isArray(actividades) || actividades.length === 0) {
    return res.status(400).json({
      success: false,
      error:
        "El formato de actividades debe ser un arreglo y no puede estar vacío",
    });
  }

  const results = [];
  for (let i = 0; i < actividades.length; i++) {
    const act = actividades[i];
    // Validar campos obligatorios según las nuevas columnas
    if (
      !act.id_permiso ||
      !act.secuencia_actividad ||
      !act.peligros_potenciales ||
      !act.acciones_preventivas
    ) {
      return res.status(400).json({
        success: false,
        error: `Faltan campos obligatorios en la actividad ${i + 1}`,
      });
    }
    try {
      const result = await db.query(
        `INSERT INTO ast_actividades (
          id_permiso, num_actividad, secuencia_actividad, peligros_potenciales, acciones_preventivas
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          act.id_permiso,
          String(i + 1),
          act.secuencia_actividad,
          act.peligros_potenciales,
          act.acciones_preventivas
        ]
      );
      results.push(result.rows[0]);
    } catch (err) {
      console.error("Error en la base de datos:", err);
      return res.status(500).json({
        success: false,
        error: "Error al registrar la actividad AST",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  }
  res.status(201).json({
    success: true,
    message: "Actividades AST creadas exitosamente",
    data: results,
  });
});

// Ejemplo en Express
router.get("/api/participantes", async (req, res) => {
  const id_estatus = parseInt(req.query.id_estatus, 10);
  console.log("[DEBUG] id_estatus recibido:", id_estatus);
  if (!Number.isInteger(id_estatus) || id_estatus <= 0) {
    console.log(
      "[DEBUG] id_estatus inválido, devolviendo array vacío:",
      id_estatus
    );
    return res.json([]);
  }
  let query = "SELECT * FROM ast_participan WHERE id_estatus = $1";
  let params = [id_estatus];
  console.log("[DEBUG] Query ejecutada:", query, params);
  try {
    const result = await pool.query(query, params);
    console.log("[DEBUG] Resultados:", result.rows);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  console.log("[DEBUG] Entrando a /api/participantes");
});

// Endpoint para consultar participantes por id_estatus (confirmación de inserción)
router.get("/ast-participan/estatus/:id_estatus", async (req, res) => {
  const id_estatus = parseInt(req.params.id_estatus, 10);
  if (!Number.isInteger(id_estatus) || id_estatus <= 0) {
    return res.status(400).json({
      success: false,
      error: "id_estatus inválido",
    });
  }
  try {
    const result = await db.query(
      "SELECT * FROM ast_participan WHERE id_estatus = $1",
      [id_estatus]
    );
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar participantes",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
