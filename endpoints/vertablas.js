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
    tp.nombre AS tipo_permiso,
    COALESCE(ptnp.descripcion_trabajo, pta.descripcion_trabajo, ptc.descripcion_trabajo, ptf.descripcion_trabajo, pte.descripcion_trabajo, ptr.descripcion_trabajo, pta2.descripcion_trabajo) AS descripcion,
    a.nombre AS area,
    COALESCE(ptnp.nombre_solicitante, pta.nombre_solicitante, ptc.nombre_solicitante, ptf.nombre_solicitante, pte.nombre_solicitante, ptr.nombre_solicitante, pta2.nombre_solicitante) AS solicitante,
    pt.fecha_hora,
    e.estatus
FROM permisos_trabajo pt
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
INNER JOIN areas a ON pt.id_area = a.id_area
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
LEFT JOIN pt_confinados ptc ON pt.id_permiso = ptc.id_permiso
LEFT JOIN pt_fuego ptf ON pt.id_permiso = ptf.id_permiso
LEFT JOIN pt_electrico pte ON pt.id_permiso = pte.id_permiso
LEFT JOIN pt_radiacion ptr ON pt.id_permiso = ptr.id_permiso
LEFT JOIN pt_altura pta2 ON pt.id_permiso = pta2.id_permiso
WHERE ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL OR ptc.id_permiso IS NOT NULL OR ptf.id_permiso IS NOT NULL OR pte.id_permiso IS NOT NULL OR ptr.id_permiso IS NOT NULL OR pta2.id_permiso IS NOT NULL
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
        tp.nombre AS tipo_permiso,
        COALESCE(ptnp.descripcion_trabajo, pta.descripcion_trabajo, ptc.descripcion_trabajo, ptf.descripcion_trabajo, pte.descripcion_trabajo, ptr.descripcion_trabajo, pta2.descripcion_trabajo) AS descripcion,
        a.nombre AS area,
        COALESCE(ptnp.nombre_solicitante, pta.nombre_solicitante, ptc.nombre_solicitante, ptf.nombre_solicitante, pte.nombre_solicitante, ptr.nombre_solicitante, pta2.nombre_solicitante) AS solicitante,
        pt.fecha_hora,
        e.estatus
FROM permisos_trabajo pt
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
INNER JOIN areas a ON pt.id_area = a.id_area
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
LEFT JOIN pt_confinados ptc ON pt.id_permiso = ptc.id_permiso
LEFT JOIN pt_fuego ptf ON pt.id_permiso = ptf.id_permiso
LEFT JOIN pt_electrico pte ON pt.id_permiso = pte.id_permiso
LEFT JOIN pt_radiacion ptr ON pt.id_permiso = ptr.id_permiso
LEFT JOIN pt_altura pta2 ON pt.id_permiso = pta2.id_permiso
WHERE pt.id_departamento = $1
    AND (ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL OR ptc.id_permiso IS NOT NULL OR ptf.id_permiso IS NOT NULL OR pte.id_permiso IS NOT NULL OR ptr.id_permiso IS NOT NULL OR pta2.id_permiso IS NOT NULL)
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

// Nueva función para obtener permisos por departamento
async function obtenerPermisosPorDepartamento(id_departamento) {
  try {
    const result = await pool.query(
      `
SELECT 
  pt.id_permiso,
  pt.prefijo,
  pt.contrato,
        tp.nombre AS tipo_permiso,
        COALESCE(ptnp.descripcion_trabajo, pta.descripcion_trabajo, ptc.descripcion_trabajo, ptf.descripcion_trabajo, pte.descripcion_trabajo, ptr.descripcion_trabajo, pta2.descripcion_trabajo) AS descripcion,
        a.nombre AS area,
        COALESCE(ptnp.nombre_solicitante, pta.nombre_solicitante, ptc.nombre_solicitante, ptf.nombre_solicitante, pte.nombre_solicitante, ptr.nombre_solicitante, pta2.nombre_solicitante) AS solicitante,
        pt.fecha_hora,
        e.estatus
FROM permisos_trabajo pt
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
INNER JOIN areas a ON pt.id_area = a.id_area
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
LEFT JOIN pt_confinados ptc ON pt.id_permiso = ptc.id_permiso
LEFT JOIN pt_fuego ptf ON pt.id_permiso = ptf.id_permiso
LEFT JOIN pt_electrico pte ON pt.id_permiso = pte.id_permiso
LEFT JOIN pt_radiacion ptr ON pt.id_permiso = ptr.id_permiso
LEFT JOIN pt_altura pta2 ON pt.id_permiso = pta2.id_permiso
WHERE pt.id_departamento = $1
    AND (ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL OR ptc.id_permiso IS NOT NULL OR ptf.id_permiso IS NOT NULL OR pte.id_permiso IS NOT NULL OR ptr.id_permiso IS NOT NULL OR pta2.id_permiso IS NOT NULL)
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
    tp.nombre AS tipo_permiso,
    COALESCE(ptnp.descripcion_trabajo, pta.descripcion_trabajo, ptc.descripcion_trabajo, ptf.descripcion_trabajo, pte.descripcion_trabajo, ptr.descripcion_trabajo, pta2.descripcion_trabajo) AS descripcion,
    a.nombre AS area,
    COALESCE(ptnp.nombre_solicitante, pta.nombre_solicitante, ptc.nombre_solicitante, ptf.nombre_solicitante, pte.nombre_solicitante, ptr.nombre_solicitante, pta2.nombre_solicitante) AS solicitante,
    pt.fecha_hora,
    e.estatus
FROM permisos_trabajo pt
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
INNER JOIN areas a ON pt.id_area = a.id_area
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
LEFT JOIN pt_confinados ptc ON pt.id_permiso = ptc.id_permiso
LEFT JOIN pt_fuego ptf ON pt.id_permiso = ptf.id_permiso
LEFT JOIN pt_electrico pte ON pt.id_permiso = pte.id_permiso
LEFT JOIN pt_radiacion ptr ON pt.id_permiso = ptr.id_permiso
LEFT JOIN pt_altura pta2 ON pt.id_permiso = pta2.id_permiso
WHERE a.id_departamento = $1
  AND (ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL OR ptc.id_permiso IS NOT NULL OR ptf.id_permiso IS NOT NULL OR pte.id_permiso IS NOT NULL OR ptr.id_permiso IS NOT NULL OR pta2.id_permiso IS NOT NULL)
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
    tp.nombre AS tipo_permiso,
    COALESCE(ptnp.descripcion_trabajo, pta.descripcion_trabajo, ptc.descripcion_trabajo, ptf.descripcion_trabajo, pte.descripcion_trabajo, ptr.descripcion_trabajo, pta2.descripcion_trabajo) AS descripcion,
    a.nombre AS area,
    COALESCE(ptnp.nombre_solicitante, pta.nombre_solicitante, ptc.nombre_solicitante, ptf.nombre_solicitante, pte.nombre_solicitante, ptr.nombre_solicitante, pta2.nombre_solicitante) AS solicitante,
    pt.fecha_hora,
    e.estatus
FROM permisos_trabajo pt
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
INNER JOIN areas a ON pt.id_area = a.id_area
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
LEFT JOIN pt_confinados ptc ON pt.id_permiso = ptc.id_permiso
LEFT JOIN pt_fuego ptf ON pt.id_permiso = ptf.id_permiso
LEFT JOIN pt_electrico pte ON pt.id_permiso = pte.id_permiso
LEFT JOIN pt_radiacion ptr ON pt.id_permiso = ptr.id_permiso
LEFT JOIN pt_altura pta2 ON pt.id_permiso = pta2.id_permiso
WHERE ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL OR ptc.id_permiso IS NOT NULL OR ptf.id_permiso IS NOT NULL OR pte.id_permiso IS NOT NULL OR ptr.id_permiso IS NOT NULL OR pta2.id_permiso IS NOT NULL
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
