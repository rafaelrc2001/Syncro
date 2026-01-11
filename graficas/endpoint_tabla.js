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
          a.nombre AS Area,
          pt.contrato AS Contrato,
          pt.fecha_hora AS Fecha,
          s.nombre AS Supervisor,
          e.estatus AS Estado
        FROM permisos_trabajo pt
        INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
        INNER JOIN areas a ON pt.id_area = a.id_area
        LEFT JOIN autorizaciones aut ON pt.id_permiso = aut.id_permiso
        LEFT JOIN usuarios s ON aut.usuario_supervisor = s.id_usuario AND s.rol = 'supervisor'
        WHERE pt.id_departamento = $1
        GROUP BY pt.id_permiso, a.nombre, s.nombre, e.estatus, pt.prefijo, pt.contrato
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

// Nuevo endpoint para obtener la tabla de permisos filtrada por usuario
router.get("/tabla-permisos-usuario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          pt.id_permiso,
          pt.prefijo AS Permiso,
          a.nombre AS Area,
          pt.contrato AS Contrato,
          pt.fecha_hora AS Fecha,
          s.nombre AS Supervisor,
          e.estatus AS Estado
        FROM permisos_trabajo pt
        INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
        INNER JOIN areas a ON pt.id_area = a.id_area
        LEFT JOIN autorizaciones aut ON pt.id_permiso = aut.id_permiso
        LEFT JOIN usuarios s ON aut.usuario_supervisor = s.id_usuario AND s.rol = 'supervisor'
        WHERE pt.id_usuario = $1
        GROUP BY pt.id_permiso, a.nombre, s.nombre, e.estatus, pt.prefijo, pt.contrato
        ORDER BY pt.fecha_hora DESC;
      `,
      [id_usuario]
    );
    res.json({ permisos: result.rows });
  } catch (error) {
    console.error(
      "❌ Error al consultar la tabla de permisos por usuario:",
      error
    );
    res
      .status(500)
      .json({ error: "Error al consultar la tabla de permisos por usuario" });
  }
});

module.exports = router;
