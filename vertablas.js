const express = require("express");
const router = express.Router();
const pool = require("./database");

//estas son para el usuario
//**************************

// Consulta para obtener los permisos y sus datos relacionados
router.get("/vertablas", async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT 
      pt.id_permiso,
      pt.prefijo,
      pt.contrato,
      pt.id_area AS area,
      pt.fecha_hora,
      pt.descripcion_trabajo AS descripcion,
      pt.nombre_solicitante AS solicitante,
      e.estatus,
      e.subestatus
    FROM permisos_trabajo pt
    INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
    ORDER BY pt.fecha_hora DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar permisos:", error);
    res.status(500).json({ error: "Error al consultar permisos" });
  }
});

router.get("/vertablas/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          pt.id_permiso,
          pt.prefijo,
          pt.contrato,
          pt.id_area AS area,
          pt.fecha_hora,
          pt.descripcion_trabajo AS descripcion,
          pt.nombre_solicitante AS solicitante,
          e.estatus,
          e.subestatus
        FROM permisos_trabajo pt
        INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
        WHERE pt.id_departamento = $1
        ORDER BY pt.fecha_hora DESC;
      `,
      [id_departamento]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar permisos:", error);
    res.status(500).json({ error: "Error al consultar permisos" });
  }
});
// Nuevo endpoint para obtener permisos por id_usuario
router.get("/vertablasUsuarios/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          pt.id_permiso,
          pt.prefijo,
          pt.contrato,
          pt.id_area AS area,
          pt.fecha_hora,
          pt.descripcion_trabajo AS descripcion,
          pt.nombre_solicitante AS solicitante,
          e.estatus,
          e.subestatus
        FROM permisos_trabajo pt
        INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
        WHERE pt.id_usuario = $1
        ORDER BY pt.fecha_hora DESC;
      `,
      [id_usuario]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar permisos por usuario:", error);
    res.status(500).json({ error: "Error al consultar permisos por usuario" });
  }
});

// Nueva función para obtener permisos por departamento
async function obtenerPermisosPorDepartamento(id_departamento) {
  try {
    const result = await pool.query(
      `
        SELECT 
          pt.id_permiso,
          pt.prefijo,
          pt.contrato,
          pt.id_area AS area,
          pt.fecha_hora,
          pt.descripcion_trabajo AS descripcion,
          pt.nombre_solicitante AS solicitante,
          e.estatus,
          e.subestatus
        FROM permisos_trabajo pt
        INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
        WHERE pt.id_departamento = $1
        ORDER BY pt.fecha_hora DESC;
      `,
      [id_departamento]
    );
    return result.rows;
  } catch (error) {
    console.error("Error al consultar permisos por departamento:", error);
    throw error;
  }
}

router.get("/autorizar/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    // 1. Obtener el nombre del departamento del usuario
    const usuarioResult = await pool.query(
      `SELECT departamento FROM usuarios WHERE id_usuario = $1`,
      [id_departamento]
    );
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const nombreDepartamentoUsuario = usuarioResult.rows[0].departamento;

    // 2. Buscar el id_departamento correspondiente en departamentos (ignorando mayúsculas/minúsculas y espacios)
    const depResult = await pool.query(
      `SELECT id_departamento FROM departamentos WHERE REPLACE(LOWER(nombre), ' ', '') = REPLACE(LOWER($1), ' ', '')`,
      [nombreDepartamentoUsuario]
    );
    if (depResult.rows.length === 0) {
      return res.status(404).json({ error: "Departamento no encontrado" });
    }
    const idDepartamento = depResult.rows[0].id_departamento;

    // 3. Buscar los permisos de ese departamento (por id)
    const result = await pool.query(
      `
        SELECT 
          pt.id_permiso,
          pt.prefijo,
          pt.contrato,
          pt.id_area AS area,
          pt.fecha_hora,
          pt.descripcion_trabajo AS descripcion,
          pt.nombre_solicitante AS solicitante,
          e.estatus,
          e.subestatus
        FROM permisos_trabajo pt
        INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
        WHERE pt.id_departamento = $1
        ORDER BY pt.fecha_hora DESC;
      `,
      [idDepartamento]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar permisos para autorizar:", error);
    res
      .status(500)
      .json({ error: "Error al consultar permisos para autorizar" });
  }
});

//estas son para el  JEFE Y EL SUPERVISOR PORQUE VEN LOS PERMISOS GENERALES
//**************************

// Nueva función para el jefe: obtener todos los permisos generales (sin filtrar por departamento)
router.get("/autorizar-jefe", async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
          pt.id_permiso,
          pt.prefijo,
          pt.contrato,
          pt.id_area AS area,
          pt.fecha_hora,
          pt.descripcion_trabajo AS descripcion,
          pt.nombre_solicitante AS solicitante,
          e.estatus,
          e.subestatus
        FROM permisos_trabajo pt
        INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
        ORDER BY pt.fecha_hora DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al consultar permisos generales para el jefe:", error);
    res
      .status(500)
      .json({ error: "Error al consultar permisos generales para el jefe" });
  }
});




router.get('/usuario-por-credencial', async (req, res) => {
  const { no_empleado } = req.query;

  if (!no_empleado) {
    return res.status(400).json({ success: false, error: 'El parámetro no_empleado es requerido' });
  }

  const query = `
    SELECT nombre, apellidop, apellidom, cargo, no_empleado
    FROM usuarios
    WHERE TRIM(no_empleado) = TRIM($1)
    LIMIT 1
  `;

  try {
    const results = await pool.query(query, [no_empleado]);
    const rows = results.rows || results;
    if (rows.length === 0) {
      return res.json({ success: false, usuario: null, mensaje: 'No se encontró usuario con ese número de credencial' });
    }
    res.json({ success: true, usuario: rows[0] });
  } catch (err) {
    console.error('Error al buscar usuario por credencial:', err);
    return res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
});



module.exports = router;
