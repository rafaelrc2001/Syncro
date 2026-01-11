
const express = require("express");
const router = express.Router();
const db = require("./database");
const { pool } = require("./database");

// Nueva ruta para obtener todos los estatus distintos
//
router.get("/estatus/lista", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT estatus 
       FROM estatus 
       WHERE estatus IS NOT NULL 
       ORDER BY estatus ASC`
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => row.estatus),
    });
  } catch (err) {
    console.error("Error al obtener lista de estatus:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

//ruta para traer el estaus de un permiso por id
router.get("/estatus/permiso/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Ahora el id_estatus está en la tabla estatus y se relaciona por id_permiso
    const result = await db.query(
      `SELECT 
          e.id_permiso,
          e.id_estatus,
          e.estatus,
          e.comentarios,
          e.subestatus
        FROM estatus e
        WHERE e.id_permiso = $1`,
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
    // Actualiza por id_estatus, pero ahora puedes usar id_permiso si lo prefieres
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING *",
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


// Nueva ruta para actualizar el estatus a 'cierre' usando el id_estatus recibido 
//este solo afecta la columna de estatus y no la de subestatus
router.post("/estatus/cierre", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "cierre";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1 WHERE id_estatus = $2 RETURNING *",
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
      message: "Estatus de cierre actualizado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al actualizar el estatus de cierre",
      details: err.message,
    });
  }
});

// Nueva ruta para actualizar el estatus a 'espera seguridad' usando el id_estatus recibido
router.post("/estatus/seguridad", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "validado por seguridad";

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
  const ESTATUS = "cierre";
  const SUBESTATUS = "cancelado";
  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1, subestatus = $2 WHERE id_estatus = $3 RETURNING id_estatus as id, estatus, subestatus",
      [ESTATUS, SUBESTATUS, id_estatus]
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
  const ESTATUS = "espera liberacion del area";
  const SUBESTATUS = "cierre sin incidentes";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1, subestatus = $2 WHERE id_estatus = $3 RETURNING id_estatus as id, estatus, subestatus",
      [ESTATUS, SUBESTATUS, id_estatus]
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
  const ESTATUS = "espera liberacion del area";
   const SUBESTATUS = "cierre con incidentes";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1, subestatus = $2 WHERE id_estatus = $3 RETURNING id_estatus as id, estatus, subestatus",
      [ESTATUS, SUBESTATUS, id_estatus]
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
  const ESTATUS = "espera liberacion del area";
   const SUBESTATUS = "cierre con accidentes";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1, subestatus = $2 WHERE id_estatus = $3 RETURNING id_estatus as id, estatus, subestatus",
      [ESTATUS, SUBESTATUS, id_estatus]
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
  const {
    id_permiso,
    responsable_area,
    encargado_area,
    fecha_hora_area,
    ip_area,
    localizacion_area,
    firma,
    dispositivo_area,
    usuario_departamento,
    firma_operador_area,
  } = req.body;

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
                 fecha_hora_area = COALESCE($3, fecha_hora_area),
                 ip_area = COALESCE($4, ip_area),
                 localizacion_area = COALESCE($5, localizacion_area),
                 firma = COALESCE($6, firma),
                 dispositivo_area = COALESCE($7, dispositivo_area),
                 usuario_departamento = COALESCE($8, usuario_departamento),
                 firma_operador_area = COALESCE($9, firma_operador_area)
             WHERE id_permiso = $10
             RETURNING *`,
          [
            responsable_area,
            encargado_area || null,
            fecha_hora_area || null,
            ip_area || null,
            localizacion_area || null,
            firma || null,
            dispositivo_area || null,
            usuario_departamento || null,
            firma_operador_area || null,
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

  // Si no existe, insertamos el registro incluyendo fecha_hora_area, firma, dispositivo_area y comentario si vienen
  try {
    const result = await db.query(
      `INSERT INTO autorizaciones (
        id_permiso, usuario_supervisor, id_categoria, responsable_area, operador_area, fecha_hora_area, ip_area, localizacion_area, firma, dispositivo_area, usuario_departamento, firma_operador_area
      ) VALUES ($1, $2, $3, $4, $5, COALESCE($6, NOW()), $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        id_permiso,
        null,
        null,
        responsable_area,
        encargado_area || null,
        fecha_hora_area || null,
        ip_area || null,
        localizacion_area || null,
        firma || null,
        dispositivo_area || '/',
        usuario_departamento || null,
        firma_operador_area || null,
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




// NOTA: Ya no existe lógica para guardar requisitos del área en una tabla específica de permiso.
// Toda la lógica de guardado y actualización debe hacerse en la tabla general (autorizaciones).
// Si necesitas guardar campos adicionales de requisitos, agrégalos a la tabla autorizaciones y adapta aquí.

//no autorizado
//no autorizado
//no autorizado
//no autorizado
// Nueva ruta para actualizar el estatus a 'no autorizado' usando el id_estatus recibido
router.post("/estatus/no_autorizado", async (req, res) => {
  const { id_estatus } = req.body;
  const ESTATUS = "cierre";
  const SUBESTATUS = "no autorizado";

  if (!id_estatus) {
    return res.status(400).json({
      success: false,
      error: "id_estatus es requerido",
    });
  }

  try {
    const result = await db.query(
      "UPDATE estatus SET estatus = $1, subestatus = $2 WHERE id_estatus = $3 RETURNING id_estatus as id, estatus, subestatus",
      [ESTATUS, SUBESTATUS, id_estatus]
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
// Ahora acepta usuario_supervisor
router.put("/autorizaciones/supervisor-categoria", async (req, res) => {
  const { id_permiso, supervisor, categoria, fecha_hora_supervisor, ip_supervisor, localizacion_supervisor, firma_supervisor, dispositivo_supervisor } = req.body;

  if (!id_permiso || !supervisor || !categoria) {
    return res.status(400).json({
      success: false,
      error: "id_permiso, supervisor y categoria son requeridos",
    });
  }

  try {
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
         SET supervisor = $1,
             id_categoria = $2,
             fecha_hora_supervisor = COALESCE($3, fecha_hora_supervisor),
             ip_supervisor = COALESCE($4, ip_supervisor),
             localizacion_supervisor = COALESCE($5, localizacion_supervisor),
             firma_supervisor = COALESCE($6, firma_supervisor),
             dispositivo_supervisor = COALESCE($7, dispositivo_supervisor)
         WHERE id_permiso = $8
         RETURNING *`,
        [
          supervisor,
          idCategoria,
          fecha_hora_supervisor || null,
          ip_supervisor || null,
          localizacion_supervisor || null,
          firma_supervisor || null,
          dispositivo_supervisor || null,
          id_permiso
        ]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No se encontró la autorización para actualizar",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Supervisor, categoría, hora y datos extra actualizados exitosamente",
        data: result.rows[0],
      });
    } else {
      // Si no existe, insertar una nueva fila incluyendo la fecha (si no se envía, usar NOW())
      const insert = await db.query(
        `INSERT INTO autorizaciones (
          id_permiso, supervisor, id_categoria, responsable_area, operador_area, fecha_hora_supervisor, ip_supervisor, localizacion_supervisor, firma_supervisor, dispositivo_supervisor
        ) VALUES ($1, $2, $3, $4, $5, COALESCE($6, NOW()), $7, $8, $9, $10)
        RETURNING *`,
        [
          id_permiso,
          supervisor,
          idCategoria,
          null,
          null,
          fecha_hora_supervisor || null,
          ip_supervisor || null,
          localizacion_supervisor || null,
          firma_supervisor || null,
          dispositivo_supervisor || null
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
  a.responsable_area,
  a.fecha_hora_area,
  a.fecha_hora_supervisor,
  a.ip_area,
  a.localizacion_area
FROM autorizaciones a
LEFT JOIN usuarios s ON a.usuario_supervisor = s.id_usuario AND s.rol = 'supervisor'
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
  a.responsable_area,
  a.fecha_hora_area,
  a.fecha_hora_supervisor,
  a.ip_area,
  a.localizacion_area
FROM autorizaciones a
LEFT JOIN usuarios s ON a.usuario_supervisor = s.id_usuario AND s.rol = 'supervisor'
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

//Para traerme el estatus y el comentario de un permiso por id_permiso
//Para traerme el estatus y el comentario de un permiso por id_permiso
//Para traerme el estatus y el comentario de un permiso por id_permiso
//Para traerme el estatus y el comentario de un permiso por id_permiso
// Endpoint para obtener estatus y comentarios de un permiso por id_permiso
router.get("/estatus-comentarios/:id_permiso", async (req, res) => {
  const { id_permiso } = req.params;
  try {
    // Ahora la relación es directa por id_permiso en estatus
    const result = await db.query(
      `SELECT estatus, comentarios, subestatus FROM estatus WHERE id_permiso = $1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permiso no encontrado",
      });
    }
    res.json({
      success: true,
      estatus: result.rows[0].estatus,
      comentarios: result.rows[0].comentarios,
      subestatus: result.rows[0].subestatus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Endpoint para obtener solo el estatus de un permiso por id_permiso
// Endpoint para obtener solo el estatus de un permiso por id_permiso
// Endpoint para obtener solo el estatus de un permiso por id_permiso
// Endpoint para obtener solo el estatus de un permiso por id_permiso
// Endpoint para obtener solo el estatus de un permiso por id_permiso
router.get("/estatus-solo/:id_permiso", async (req, res) => {
  const { id_permiso } = req.params;
  try {
    // Ahora la relación es directa por id_permiso en estatus
    const result = await db.query(
      `SELECT estatus FROM estatus WHERE id_permiso = $1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permiso no encontrado",
      });
    }
    res.json({
      success: true,
      estatus: result.rows[0].estatus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});




// Endpoint para obtener datos de autorizaciones junto con nombre_solicitante y firma_creacion por id_permiso
router.get("/autorizaciones/detalle/:id_permiso", async (req, res) => {
  const { id_permiso } = req.params;
  if (!id_permiso) {
    return res.status(400).json({
      success: false,
      error: "id_permiso es requerido",
    });
  }
  try {
    const result = await db.query(
      `
            SELECT 
    a.*,                              
    p.id_permiso,
    p.nombre_solicitante,
    p.firma_creacion,
    p.fecha_hora,
    p.dispositivo_creacion,
    p.ip_creacion,
    p.localizacion_creacion,
    s.nombre AS nombre_supervisor,
    s.usuario AS usuario_supervisor,
    u.usuario AS usuario_usuario,
    -- Nombre del departamento basado en usuario_departamento
    d_usuario.nombre AS nombre_usuario_departamento,
    -- Usuario del supervisor desde usuario_supervisor
    s2.usuario AS nombre_usuario_supervisor,
    -- Nombre del departamento del permiso (opcional)
    d_permiso.nombre AS nombre_departamento_permiso
FROM permisos_trabajo p
LEFT JOIN autorizaciones a 
    ON a.id_permiso = p.id_permiso
-- Primer JOIN con usuarios para usuario_supervisor
LEFT JOIN usuarios s
  ON a.usuario_supervisor = s.id_usuario AND s.rol = 'supervisor'
-- Segundo JOIN con usuarios para usuario_supervisor
LEFT JOIN usuarios s2
  ON a.usuario_supervisor = s2.id_usuario AND s2.rol = 'supervisor'
-- JOIN para departamento del permiso
LEFT JOIN departamentos d_permiso
    ON p.id_departamento = d_permiso.id_departamento
-- JOIN para usuario_departamento de autorizaciones
LEFT JOIN departamentos d_usuario
    ON a.usuario_departamento = d_usuario.id_departamento
-- JOIN con usuarios
LEFT JOIN usuarios u
    ON p.id_usuario = u.id_usuario
WHERE p.id_permiso = $1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró información para ese permiso",
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar detalle de autorización:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar detalle de autorización",
      details: err.message,
    });
  }
});


router.post("/autorizaciones/firma-operador-area", async (req, res) => {
  const { id_permiso, firma_operador_area } = req.body;
  if (!id_permiso) {
    return res.status(400).json({
      success: false,
      error: "id_permiso es requerido",
    });
  }
  try {
    const result = await db.query(
      `UPDATE autorizaciones SET firma_operador_area = $1 WHERE id_permiso = $2 RETURNING id_permiso, firma_operador_area`,
      [typeof firma_operador_area !== "undefined" ? firma_operador_area : null, id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el permiso para actualizar la firma",
      });
    }
    res.status(200).json({
      success: true,
      message: "Firma del operador de área guardada exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al guardar firma_operador_area:", err);
    res.status(500).json({
      success: false,
      error: "Error al guardar la firma del operador de área",
      details: err.message,
    });
  }
});

// Nuevo endpoint GET para obtener la firma del operador de área por id_permiso




// Endpoint alternativo para obtener la firma del operador de área por id_permiso con la ruta solicitada
router.get("/autorizaciones/ver-firma-operador-area/:id_permiso", async (req, res) => {
  const { id_permiso } = req.params;
  if (!id_permiso) {
    return res.status(400).json({
      success: false,
      error: "id_permiso es requerido",
    });
  }
  try {
    const result = await db.query(
      `SELECT id_permiso, firma_operador_area,operador_area  FROM autorizaciones WHERE id_permiso = $1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No se encontró el permiso para consultar la firma",
      });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar firma_operador_area:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar la firma del operador de área",
      details: err.message,
    });
  }
});





// Dejar solo un module.exports al final
module.exports = router;
