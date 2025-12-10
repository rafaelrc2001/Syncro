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

  try {
    const result = await db.query(
      "INSERT INTO estatus (estatus) VALUES ($1) RETURNING id_estatus as id, estatus",
      [ESTATUS_DEFAULT]
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

    // Insertar cada participante sin transacción
    for (const participant of participants) {
      if (!participant.nombre || !participant.credencial) {
        throw new Error("Nombre y credencial son campos obligatorios");
      }

      const result = await db.query(
        `INSERT INTO ast_participan 
         (nombre, credencial, cargo, funcion, id_estatus) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          participant.nombre,
          participant.credencial,
          participant.cargo || null,
          participant.funcion || null,
          participant.id_estatus || 1,
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

// Ruta para insertar el ast
// Ruta para insertar el ast
// Ruta para insertar el ast
// Ruta para insertar el ast
// Ruta para insertar el ast
// Ruta para insertar el ast

// Ruta para insertar en la tabla ast

router.post("/ast", async (req, res) => {
  const { epp, maquinaria_equipo_herramientas, materiales_accesorios } =
    req.body;

  // Validaciones básicas
  if (!epp && !maquinaria_equipo_herramientas && !materiales_accesorios) {
    return res.status(400).json({
      success: false,
      error: "Se requiere al menos un campo para guardar en la tabla AST",
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO ast 
       (epp, maquinaria_equipo_herramientas, materiales_accesorios) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [
        epp || null,
        maquinaria_equipo_herramientas || null,
        materiales_accesorios || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Datos de AST guardados exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al guardar los datos de AST",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

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
    id_tipo_permiso,
    id_estatus,
    id_ast,
    contrato, // Nuevo campo opcional
    fecha_hora, // Nuevo campo para la hora normalizada
    id_usuario,
  } = req.body;

  // Validar que los campos obligatorios existan
  if (
    [
      id_area,
      id_departamento,
      id_sucursal,
      id_tipo_permiso,
      id_estatus,
      id_ast,
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
        id_area, id_departamento, id_sucursal, id_tipo_permiso, id_estatus, id_ast, contrato, fecha_hora, id_usuario
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        id_area,
        id_departamento,
        id_sucursal,
        id_tipo_permiso,
        id_estatus,
        id_ast,
        contrato || null,
        fecha_hora || null,
        id_usuario,
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
  // ...existing code...

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
    // Validar campos obligatorios
    if (
      !act.id_ast ||
      !act.secuencia ||
      !act.personal_ejecutor ||
      !act.peligros_potenciales ||
      !act.acciones_preventivas ||
      !act.responsable
    ) {
      return res.status(400).json({
        success: false,
        error: `Faltan campos obligatorios en la actividad ${i + 1}`,
      });
    }
    try {
      const result = await db.query(
        `INSERT INTO ast_actividades (
          id_ast, num_actividad, secuencia_actividad, personal_ejecutor, peligros_potenciales, acciones_preventivas, responsable
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          act.id_ast,
          i + 1,
          act.secuencia,
          act.personal_ejecutor,
          act.peligros_potenciales,
          act.acciones_preventivas,
          act.responsable,
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
