const express = require("express");
const router = express.Router();
const db = require("./database");
const { pool } = require("./database");

//ruta para traer el estaus de un permiso por id
router.get("/estatus/permiso/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT 
          pt.id_permiso,
          pt.id_estatus,
          e.estatus
        FROM permisos_trabajo pt
        INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
        WHERE pt.id_permiso = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permiso no encontrado",
      });
    }
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Nueva ruta para actualizar el estatus a 'activo' usando el id_estatus recibido
router.post("/estatus/activo", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "activo";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus",
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el estatus para actualizar",
      });
    }
    res.status(200).json({
      success: true,
      message: "Estatus activo actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus activo",
      details: err.message,
    });
  }
});

// Nueva ruta para actualizar el estatus a 'espera seguridad' usando el id_estatus recibido
router.post("/estatus/seguridad", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "espera seguridad";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus",
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el estatus para actualizar",
      });
    }
    res.status(200).json({
      success: true,
      message: "Estatus de seguridad actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus de seguridad",
      details: err.message,
    });
  }
});

// Nueva ruta para actualizar el estatus a 'continua' usando el id_estatus recibido
router.post("/estatus/continua", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "continua";

  if (!id_estatus) {
    console.log("[BACKEND] id_estatus no recibido");
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus",
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      console.log("[BACKEND] No se encontró el estatus para actualizar");
      return res.status(404).json({
        success: false,
        error: "No se encontró el estatus para actualizar",
      });
    }
    res.status(200).json({
      success: true,
      message: "Estatus de continua actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("[BACKEND] Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus de continua",
      details: err.message,
    });
  }
});

// Nueva ruta para actualizar el estatus a 'cancelado' usando el id_estatus recibido
router.post("/estatus/cancelado", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "cancelado";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus",
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el estatus para actualizar",
      });
    }
    res.status(200).json({
      success: true,
      message: "Estatus de cancelado actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus de cancelado",
      details: err.message,
    });
  }
});

// Nueva ruta para actualizar el estatus a 'terminado' usando el id_estatus recibido
router.post("/estatus/terminado", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "terminado";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus",
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el estatus para actualizar",
      });
    }
    res.status(200).json({
      success: true,
      message: "Estatus de terminado actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus de terminado",
      details: err.message,
    });
  }
});

// Nueva ruta para actualizar el estatus a 'cierre sin incidentes' usando el id_estatus recibido
router.post("/estatus/cierre_sin_incidentes", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "cierre sin incidentes";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus",
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el estatus para actualizar",
      });
    }
    res.status(200).json({
      success: true,
      message: "Estatus de cierre sin incidentes actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus de cierre sin incidentes",
      details: err.message,
    });
  }
});

// Nueva ruta para actualizar el estatus a 'cierre con incidentes' usando el id_estatus recibido
router.post("/estatus/cierre_con_incidentes", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "cierre con incidentes";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus",
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el estatus para actualizar",
      });
    }
    res.status(200).json({
      success: true,
      message: "Estatus de cierre con incidentes actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus de cierre con incidentes",
      details: err.message,
    });
  }
});

// Nueva ruta para actualizar el estatus a 'cierre con accidentes' usando el id_estatus recibido
router.post("/estatus/cierre_con_accidentes", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "cierre con accidentes";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus",
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el estatus para actualizar",
      });
    }
    res.status(200).json({
      success: true,
      message: "Estatus de cierre con accidentes actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus de cierre con accidentes",
      details: err.message,
    });
  }
});

// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones
// Ruta para insertar autorizaciones

// Nueva ruta para insertar en la tabla de autorizaciones según requerimiento del usuario
router.post("/autorizaciones/area", async (req, res) => {
  const { id_permiso, responsable_area, encargado_area, fecha_hora_area } =
    req.body;

  // Validar que los campos requeridos estén presentes
  if (!id_permiso || !responsable_area) {
    return res.status(400).json({
      success: false,
      error: "id_permiso y responsable_area son requeridos",
    });
  }

  // Verificar si ya existe un registro con ese id_permiso
  try {
    const existe = await db.query(
      "SELECT 1 FROM autorizaciones WHERE id_permiso = $1 LIMIT 1",
      [id_permiso]
    );
    if (existe.rows.length > 0) {
      // Si ya existe, actualizamos (upsert) los campos que lleguen
      try {
        const result = await db.query(
          `UPDATE autorizaciones
             SET responsable_area = $1,
                operador_area = COALESCE($2, operador_area),
                fecha_hora_area = COALESCE($3, fecha_hora_area)
             WHERE id_permiso = $4
             RETURNING *`,
          [
            responsable_area,
            encargado_area || null,
            fecha_hora_area || null,
            id_permiso,
          ]
        );
        return res.status(200).json({
          success: true,
          message: "Autorización de área actualizada exitosamente",
          data: result.rows[0],
        });
      } catch (err) {
        console.error("Error actualizando autorizacion existente:", err);
        return res.status(500).json({
          success: false,
          error: "Error al actualizar la autorización de área",
          details:
            process.env.NODE_ENV === "development" ? err.message : undefined,
        });
      }
    }
  } catch (err) {
    console.error("Error verificando duplicado:", err);
    return res.status(500).json({
      success: false,
      error: "Error al verificar duplicado",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  // Si no existe, insertamos el registro incluyendo fecha_hora_area y comentario si vienen
  try {
    const result = await db.query(
      `INSERT INTO autorizaciones (
        id_permiso, id_supervisor, id_categoria, responsable_area, operador_area, fecha_hora_area
      ) VALUES ($1, $2, $3, $4, $5, COALESCE($6, NOW()))
      RETURNING *`,
      [
        id_permiso,
        null,
        null,
        responsable_area,
        encargado_area || null,
        fecha_hora_area || null,
      ]
    );
    res.status(201).json({
      success: true,
      message: "Autorización de área registrada exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al registrar la autorización de área",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Ruta para obtener el id_estatus de permisos_trabajo por id_permiso
router.get("/permisos-trabajo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT id_estatus FROM permisos_trabajo WHERE id_permiso = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Permiso no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//no autorizado
//no autorizado
//no autorizado
//no autorizado
// Nueva ruta para actualizar el estatus a 'no autorizado' usando el id_estatus recibido
router.post("/estatus/no_autorizado", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "no autorizado";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING id_estatus as id, estatus",
      [ESTATUS, id_estatus]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el estatus para actualizar",
      });
    }
    res.status(200).json({
      success: true,
      message: "Estatus de no autorizado actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus de no autorizado",
      details: err.message,
    });
  }
});

// Endpoint para actualizar supervisor y categoría (solo nombres) en autorizaciones
router.put("/autorizaciones/supervisor-categoria", async (req, res) => {
  const { id_permiso, supervisor, categoria, fecha_hora_supervisor } = req.body;

  if (!id_permiso || !supervisor || !categoria) {
    return res.status(400).json({
      success: false,
      error: "id_permiso, supervisor y categoria son requeridos",
    });
  }

  try {
    // Buscar el ID del supervisor por nombre
    const supResult = await db.query(
      "SELECT id_supervisor FROM supervisores WHERE nombre = $1 LIMIT 1",
      [supervisor]
    );
    if (supResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Supervisor no encontrado",
      });
    }
    const idSupervisor = supResult.rows[0].id_supervisor;

    // Buscar el ID de la categoría por nombre en categorias_seguridad
    const catResult = await db.query(
      "SELECT id_categoria FROM categorias_seguridad WHERE nombre = $1 LIMIT 1",
      [categoria]
    );
    if (catResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Categoría no encontrada",
      });
    }
    const idCategoria = catResult.rows[0].id_categoria;

    // Verificar si ya existe una fila de autorizacion para id_permiso
    const existe = await db.query(
      "SELECT 1 FROM autorizaciones WHERE id_permiso = $1 LIMIT 1",
      [id_permiso]
    );

    if (existe.rows.length > 0) {
      // Si existe, actualizar los campos y la fecha del supervisor (sin sobreescribir si no se envía)
      const result = await db.query(
        `UPDATE autorizaciones
         SET id_supervisor = $1,
             id_categoria = $2,
             fecha_hora_supervisor = COALESCE($3, fecha_hora_supervisor)
         WHERE id_permiso = $4
         RETURNING *`,
        [idSupervisor, idCategoria, fecha_hora_supervisor || null, id_permiso]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No se encontró la autorización para actualizar",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Supervisor, categoría y hora actualizados exitosamente",
        data: result.rows[0],
      });
    } else {
      // Si no existe, insertar una nueva fila incluyendo la fecha (si no se envía, usar NOW())
      const insert = await db.query(
        `INSERT INTO autorizaciones (
          id_permiso, id_supervisor, id_categoria, responsable_area, operador_area, fecha_hora_supervisor
        ) VALUES ($1, $2, $3, $4, $5, COALESCE($6, NOW()))
        RETURNING *`,
        [
          id_permiso,
          idSupervisor,
          idCategoria,
          null,
          null,
          fecha_hora_supervisor || null,
        ]
      );
      return res.status(201).json({
        success: true,
        message: "Autorización creada con supervisor y hora",
        data: insert.rows[0],
      });
    }
  } catch (err) {
    console.error("Error actualizando supervisor y categoría:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar supervisor y categoría",
      details: err.message,
    });
  }
});

//comentarios

router.post("/estatus/comentario", async (req, res) => {
  const { id_estatus, comentario } = req.body;
  if (!id_estatus || !comentario) {
    return res.status(400).json({
      success: false,
      error: "id_estatus y comentario son requeridos",
    });
  }
  try {
    await db.query(
      "UPDATE estatus SET comentarios = $1 WHERE id_estatus = $2",
      [comentario, id_estatus]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error al guardar comentario:", err);
    res.status(500).json({
      success: false,
      error: "Error al guardar comentario",
      details: err.message,
    });
  }
});

// Endpoint para consultar los nombres de las personas que han autorizado un permiso
// Ruta alternativa para compatibilidad con diferentes parámetros
router.get("/autorizaciones/personas/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      error: "id es requerido",
    });
  }

  try {
    const result = await db.query(
      `SELECT 
    s.nombre as nombre_supervisor,
    a.operador_area,
    a.responsable_area
  FROM autorizaciones a
  LEFT JOIN supervisores s ON a.id_supervisor = s.id_supervisor
  WHERE a.id_permiso = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron autorizaciones para este permiso",
      });
    }

    res.status(200).json({
      success: true,
      message: "Personas autorizadoras obtenidas exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar personas autorizadoras:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar las personas que han autorizado",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Endpoint para consultar los nombres de las personas que han autorizado un permiso
router.get("/autorizaciones/personas/:id_permiso", async (req, res) => {
  const { id_permiso } = req.params;

  if (!id_permiso) {
    return res.status(400).json({
      success: false,
      error: "id_permiso es requerido",
    });
  }

  try {
    const result = await db.query(
      `SELECT 
    s.nombre as nombre_supervisor,
    a.operador_area,
    a.responsable_area
  FROM autorizaciones a
  LEFT JOIN supervisores s ON a.id_supervisor = s.id_supervisor
  WHERE a.id_permiso = $1`,
      [id_permiso]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron autorizaciones para este permiso",
      });
    }

    res.status(200).json({
      success: true,
      message: "Personas autorizadoras obtenidas exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar personas autorizadoras:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar las personas que han autorizado",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Endpoint para consultar el estatus y comentarios de un permiso
router.get("/api/permiso-estatus", async (req, res) => {
  const idPermiso = req.query.id;
  if (!idPermiso) {
    return res.status(400).json({ error: "Falta el parámetro id" });
  }
  try {
    const query = `
      SELECT pt.id_permiso, e.estatus, e.comentarios
      FROM permisos_trabajo pt
      INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
      WHERE pt.id_permiso = ?
    `;
    db.query(query, [idPermiso], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error en la consulta", details: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Permiso no encontrado" });
      }
      res.json(results[0]);
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno", details: error });
  }
});

// Dejar solo un module.exports al final
module.exports = router;
