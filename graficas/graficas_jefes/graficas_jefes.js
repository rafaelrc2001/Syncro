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
				d.nombre AS departamento,
				s.nombre AS sucursal,
				pt.descripcion_trabajo AS descripcion,
				a.nombre AS area,
				pt.nombre_solicitante AS solicitante,
				pt.fecha_hora,
				e.estatus,
				sup.nombre AS supervisor,
				cat.nombre AS categoria,
				aut.fecha_hora_area,
				aut.fecha_hora_supervisor,
				aut.responsable_area
			FROM permisos_trabajo pt
			INNER JOIN areas a ON pt.id_area = a.id_area
			INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
			INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
			INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
			LEFT JOIN autorizaciones aut ON pt.id_permiso = aut.id_permiso
			LEFT JOIN supervisores sup ON aut.id_supervisor = sup.id_supervisor
			LEFT JOIN categorias_seguridad cat ON aut.id_categoria = cat.id_categoria
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
