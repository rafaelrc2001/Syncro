const express = require("express");
const router = express.Router();
const pool = require("../database");

// Endpoint para obtener la tabla de permisos filtrada por departamento
router.get("/tabla-permisos-departamentos/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const result = await pool.query(
      `           
      SELECT 
          pt.id_permiso,
          pt.prefijo AS Permiso,
          pt.contrato AS Contrato,
          pt.fecha_hora AS Fecha,
          pt.descripcion_trabajo AS descripcion,
          s.nombre AS Supervisor,
          e.estatus AS Estado,
          e.subestatus AS Subestatus
      FROM usuarios u
      INNER JOIN departamentos d
          ON u.departamento = d.nombre
      INNER JOIN permisos_trabajo pt
          ON d.id_departamento = pt.id_departamento
      INNER JOIN estatus e
          ON pt.id_permiso = e.id_permiso
      LEFT JOIN autorizaciones aut
          ON pt.id_permiso = aut.id_permiso
      LEFT JOIN usuarios s
          ON aut.usuario_supervisor = s.id_usuario
          AND s.rol = 'supervisor'
      WHERE u.id_usuario = $1
      GROUP BY 
          pt.id_permiso,
          pt.prefijo,
          pt.contrato,
          pt.fecha_hora,
          pt.descripcion_trabajo,
          s.nombre,
          e.estatus,
          e.subestatus
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
        pt.contrato AS Contrato,
        pt.fecha_hora AS Fecha,
        pt.descripcion_trabajo as descripcion,
        s.nombre AS Supervisor,
        e.estatus AS Estado,
        e.subestatus AS Subestatus
      FROM permisos_trabajo pt
      INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
      LEFT JOIN autorizaciones aut ON pt.id_permiso = aut.id_permiso
      LEFT JOIN usuarios s ON aut.usuario_supervisor = s.id_usuario AND s.rol = 'supervisor'
        WHERE pt.id_usuario = $1
        GROUP BY pt.id_permiso, s.nombre, e.estatus, e.subestatus, pt.prefijo, pt.contrato, pt.descripcion_trabajo
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
