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
			pt.id_area AS area,
			pt.nombre_solicitante AS solicitante,
			pt.fecha_hora,
			e.estatus,
			e.subestatus,
			aut.supervisor AS supervisor,  
			aut.fecha_hora_area,
			aut.fecha_hora_supervisor,
			aut.fecha_hora_cierre_usuario,
			aut.fecha_hora_cierre_area,
			aut.responsable_area,
			COUNT(rv.id_revalidacion) AS total_revalidaciones
		FROM permisos_trabajo pt
		INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
		INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
		INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
		LEFT JOIN autorizaciones aut ON pt.id_permiso = aut.id_permiso
		LEFT JOIN categorias_seguridad cat ON aut.id_categoria = cat.id_categoria
		LEFT JOIN revalidaciones rv ON pt.id_permiso = rv.id_permiso
		GROUP BY 
			pt.id_permiso,
			pt.prefijo,
			pt.contrato,
			d.nombre,
			s.nombre,
			pt.descripcion_trabajo,
			pt.id_area,
			pt.nombre_solicitante,
			pt.fecha_hora,
			e.estatus,
			e.subestatus,
			aut.supervisor,
			aut.fecha_hora_area,
			aut.fecha_hora_supervisor,
			aut.fecha_hora_cierre_usuario,
			aut.fecha_hora_cierre_area,
			aut.responsable_area
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
