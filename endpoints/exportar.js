const express = require("express");
const router = express.Router();
const pool = require("./database");
// Endpoint para exportar datos detallados para supervisores
router.get("/exportar-supervisor", async (req, res) => {
  try {
    // Query params for filtering
    const { q, status } = req.query;
    const params = [];
    // Base query
    let sql = `SELECT DISTINCT ON (pt.id_permiso)
    pt.id_permiso,
    pt.prefijo,
    tp.nombre AS tipo_permiso,
    DATE(pt.fecha_hora) AS fecha,
    COALESCE(
        TO_CHAR(ptnp.hora_inicio, 'HH24:MI'), 
        TO_CHAR(pta.hora_inicio, 'HH24:MI'), 
        TO_CHAR(ptc.hora_inicio, 'HH24:MI'), 
        TO_CHAR(ptf.hora_inicio, 'HH24:MI'), 
        TO_CHAR(pte.hora_inicio, 'HH24:MI'), 
        TO_CHAR(ptr.hora_inicio, 'HH24:MI'), 
        TO_CHAR(pta2.hora_inicio, 'HH24:MI')
    ) AS hora_inicio,
    COALESCE(ptnp.tipo_mantenimiento, pta.tipo_mantenimiento, ptc.tipo_mantenimiento, ptf.tipo_mantenimiento, pte.tipo_mantenimiento, ptr.tipo_mantenimiento, pta2.tipo_mantenimiento) AS tipo_actividad,
    a.nombre AS planta_lugar_trabajo,
    COALESCE(ptnp.descripcion_trabajo, pta.descripcion_trabajo, ptc.descripcion_trabajo, ptf.descripcion_trabajo, pte.descripcion_trabajo, ptr.descripcion_trabajo, pta2.descripcion_trabajo) AS descripcion_trabajo,
    COALESCE(ptnp.empresa, pta.empresa, ptc.empresa, ptf.empresa, pte.empresa, ptr.empresa, pta2.empresa) AS empresa,
    COALESCE(ptnp.nombre_solicitante, pta.nombre_solicitante, ptc.nombre_solicitante, ptf.nombre_solicitante, pte.nombre_solicitante, ptr.nombre_solicitante, pta2.nombre_solicitante) AS nombre_solicitante,
    s.nombre AS sucursal,
    pt.contrato,
    COALESCE(ptnp.ot_no, pta.ot_numero, ptc.ot_numero, ptf.ot_numero, pte.ot_numero, ptr.ot_numero, pta2.ot_numero) AS ot_numero,
    COALESCE(ptnp.equipo_intervencion, pta.descripcion_equipo, ptc.equipo_intervenir, ptf.equipo_intervenir, pte.equipo_intervenir, ptr.equipo_intervenir, pta2.equipo_intervenir) AS equipo_intervenir,
    COALESCE(ptnp.tag, pta.tag, ptc.tag, ptf.tag, pte.tag, ptr.tag, pta2.tag) AS tag,
    az.responsable_area,
    sup.nombre AS responsable_seguridad,
    az.operador_area AS operador_responsable,
    a.nombre AS area,
    e.estatus,
    pt.fecha_hora
FROM permisos_trabajo pt
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
INNER JOIN areas a ON pt.id_area = a.id_area
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
LEFT JOIN pt_confinados ptc ON pt.id_permiso = ptc.id_permiso
LEFT JOIN pt_fuego ptf ON pt.id_permiso = ptf.id_permiso
LEFT JOIN pt_electrico pte ON pt.id_permiso = pte.id_permiso
LEFT JOIN pt_radiacion ptr ON pt.id_permiso = ptr.id_permiso
LEFT JOIN pt_altura pta2 ON pt.id_permiso = pta2.id_permiso
LEFT JOIN autorizaciones az ON pt.id_permiso = az.id_permiso
LEFT JOIN supervisores sup ON az.id_supervisor = sup.id_supervisor
WHERE (
    ptnp.id_permiso IS NOT NULL 
    OR pta.id_permiso IS NOT NULL 
    OR ptc.id_permiso IS NOT NULL 
    OR ptf.id_permiso IS NOT NULL 
    OR pte.id_permiso IS NOT NULL 
    OR ptr.id_permiso IS NOT NULL 
    OR pta2.id_permiso IS NOT NULL
)
`;

    // Status filter
    if (status && status.toLowerCase() !== "all") {
      params.push(status);
      sql += ` AND lower(e.estatus) = lower($${params.length})`;
    }

    // Search query across prefijo, contrato, solicitante, tipo_permiso
    if (q && q.trim() !== "") {
      const like = `%${q}%`;
      params.push(like);
      sql += ` AND (
        pt.prefijo::text ILIKE $${params.length} OR
        pt.contrato::text ILIKE $${params.length} OR
        COALESCE(ptnp.nombre_solicitante, pta.nombre_solicitante, ptc.nombre_solicitante, ptf.nombre_solicitante, pte.nombre_solicitante, ptr.nombre_solicitante, pta2.nombre_solicitante) ILIKE $${params.length} OR
        tp.nombre ILIKE $${params.length}
      )`;
    }

    sql += ` ORDER BY pt.id_permiso, pt.fecha_hora DESC;`;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en exportar-supervisor:", error);
    res.status(500).json({ error: "Error al exportar datos para supervisor" });
  }
});

module.exports = router;
