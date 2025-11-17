const express = require("express");
const router = express.Router();
const db = require("../../database");

// Endpoint para obtener permisos de trabajo con detalles de supervisor y categoría
router.get("/permisos-jefes", async (req, res) => {
  try {
    const query = `
			SELECT 
				pt.id_permiso,
				pt.prefijo,
				pt.contrato,
				tp.nombre AS tipo_permiso,
				d.nombre AS departamento,
				s.nombre AS sucursal,
				COALESCE(ptnp.descripcion_trabajo, pta.descripcion_trabajo, ptc.descripcion_trabajo, ptf.descripcion_trabajo, pte.descripcion_trabajo, ptr.descripcion_trabajo, pta2.descripcion_trabajo, pti.descripcion_trabajo, ptex.descripcion_trabajo, ptce.descripcion_trabajo) AS descripcion,
				a.nombre AS area,
				COALESCE(ptnp.nombre_solicitante, pta.nombre_solicitante, ptc.nombre_solicitante, ptf.nombre_solicitante, pte.nombre_solicitante, ptr.nombre_solicitante, pta2.nombre_solicitante, pti.nombre_solicitante, ptex.nombre_solicitante, ptce.nombre_solicitante) AS solicitante,
				pt.fecha_hora,
				e.estatus,
				sup.nombre AS supervisor,
				cat.nombre AS categoria,
				aut.fecha_hora_area,
				aut.fecha_hora_supervisor,
				aut.responsable_area
			FROM permisos_trabajo pt
			INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
			INNER JOIN areas a ON pt.id_area = a.id_area
			INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
			INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
			INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
			LEFT JOIN autorizaciones aut ON pt.id_permiso = aut.id_permiso
			LEFT JOIN supervisores sup ON aut.id_supervisor = sup.id_supervisor
			LEFT JOIN categorias_seguridad cat ON aut.id_categoria = cat.id_categoria
			LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
			LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
			LEFT JOIN pt_confinados ptc ON pt.id_permiso = ptc.id_permiso
			LEFT JOIN pt_fuego ptf ON pt.id_permiso = ptf.id_permiso
			LEFT JOIN pt_electrico pte ON pt.id_permiso = pte.id_permiso
			LEFT JOIN pt_radiacion ptr ON pt.id_permiso = ptr.id_permiso
			LEFT JOIN pt_altura pta2 ON pt.id_permiso = pta2.id_permiso
			LEFT JOIN pt_izaje pti ON pt.id_permiso = pti.id_permiso
			LEFT JOIN pt_excavacion ptex ON pt.id_permiso = ptex.id_permiso
			LEFT JOIN pt_cesta ptce ON pt.id_permiso = ptce.id_permiso
			WHERE ptnp.id_permiso IS NOT NULL 
			   OR pta.id_permiso IS NOT NULL 
			   OR ptc.id_permiso IS NOT NULL 
			   OR ptf.id_permiso IS NOT NULL 
			   OR pte.id_permiso IS NOT NULL 
			   OR ptr.id_permiso IS NOT NULL 
			   OR pta2.id_permiso IS NOT NULL
			   OR pti.id_permiso IS NOT NULL
			   OR ptex.id_permiso IS NOT NULL
			   OR ptce.id_permiso IS NOT NULL
			ORDER BY pt.fecha_hora DESC;
		`;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener permisos-jefes:", error);
    res.status(500).json({ error: "Error al obtener los datos" });
  }
});

// Mostrar en consola la URL del endpoint para pruebas
console.log("Endpoint activo: GET /graficas_jefes/permisos-jefes");

module.exports = router;
