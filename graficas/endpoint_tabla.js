const express = require("express");
const router = express.Router();
const pool = require("../database");

// Endpoint para obtener la tabla de permisos filtrada por departamento
router.get("/tabla-permisos/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const result = await pool.query(
      `
				SELECT 
						pt.id_permiso,
						pt.prefijo AS Permiso,
						tp.nombre AS Tipo,
						a.nombre AS Area,
						pt.contrato AS Contrato,
						COALESCE(
								ptnp.descripcion_trabajo, 
								pta.descripcion_trabajo, 
								ptc.descripcion_trabajo, 
								ptf.descripcion_trabajo, 
								pte.descripcion_trabajo, 
								ptr.descripcion_trabajo, 
								pta2.descripcion_trabajo
						) AS Actividad,
						s.nombre AS Supervisor,
						e.estatus AS Estado
				FROM permisos_trabajo pt
				INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
				INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
				INNER JOIN areas a ON pt.id_area = a.id_area
				LEFT JOIN autorizaciones aut ON pt.id_permiso = aut.id_permiso
				LEFT JOIN supervisores s ON aut.id_supervisor = s.id_supervisor
				LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
				LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
				LEFT JOIN pt_confinados ptc ON pt.id_permiso = ptc.id_permiso
				LEFT JOIN pt_fuego ptf ON pt.id_permiso = ptf.id_permiso
				LEFT JOIN pt_electrico pte ON pt.id_permiso = pte.id_permiso
				LEFT JOIN pt_radiacion ptr ON pt.id_permiso = ptr.id_permiso
				LEFT JOIN pt_altura pta2 ON pt.id_permiso = pta2.id_permiso
								WHERE pt.id_departamento = $1
									AND (ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL 
									 OR ptc.id_permiso IS NOT NULL OR ptf.id_permiso IS NOT NULL 
									 OR pte.id_permiso IS NOT NULL OR ptr.id_permiso IS NOT NULL 
									 OR pta2.id_permiso IS NOT NULL)
								GROUP BY pt.id_permiso, tp.nombre, a.nombre, s.nombre, e.estatus, pt.prefijo, pt.contrato, ptnp.descripcion_trabajo, pta.descripcion_trabajo, ptc.descripcion_trabajo, ptf.descripcion_trabajo, pte.descripcion_trabajo, ptr.descripcion_trabajo, pta2.descripcion_trabajo
								ORDER BY pt.fecha_hora DESC;
			`,
      [id_departamento]
    );
    res.json({ permisos: result.rows });
  } catch (error) {
    console.error("❌ Error al consultar la tabla de permisos:", error);
    res.status(500).json({ error: "Error al consultar la tabla de permisos" });
  }
});

module.exports = router;
