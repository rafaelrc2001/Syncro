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
      a.nombre AS area,
      pt.fecha_hora,
      pt.descripcion_trabajo,
      e.estatus
    FROM permisos_trabajo pt
    INNER JOIN areas a ON pt.id_area = a.id_area
    INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
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
          a.nombre AS area,
          pt.fecha_hora,
          pt.descripcion_trabajo,
          e.estatus
        FROM permisos_trabajo pt
        INNER JOIN areas a ON pt.id_area = a.id_area
        INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
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
          a.nombre AS area,
          pt.fecha_hora,
          pt.descripcion_trabajo,
          e.estatus
        FROM permisos_trabajo pt
        INNER JOIN areas a ON pt.id_area = a.id_area
        INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
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
          a.nombre AS area,
          pt.fecha_hora,
          pt.descripcion_trabajo,
          e.estatus
        FROM permisos_trabajo pt
        INNER JOIN areas a ON pt.id_area = a.id_area
        INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
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
    const result = await pool.query(
      `
        SELECT 
          pt.id_permiso,
          pt.prefijo,
          pt.contrato,
          a.nombre AS area,
          pt.fecha_hora,
          e.estatus
        FROM permisos_trabajo pt
        INNER JOIN areas a ON pt.id_area = a.id_area
        INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
        WHERE a.id_departamento = $1
        ORDER BY pt.fecha_hora DESC;
      `,
      [id_departamento]
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
          a.nombre AS area,
          pt.fecha_hora,
          pt.descripcion_trabajo,
          e.estatus
        FROM permisos_trabajo pt
        INNER JOIN areas a ON pt.id_area = a.id_area
        INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
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

module.exports = router;
