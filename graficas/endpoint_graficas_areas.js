const express = require("express");
const router = express.Router();
const pool = require("../database");

// 🔹 API para obtener conteo de permisos por área filtrados por departamento
router.get("/grafica-departamento/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          a.nombre AS area,
          COUNT(pt.id_permiso) AS cantidad_trabajos
        FROM permisos_trabajo pt
        INNER JOIN areas a ON pt.id_area = a.id_area
        WHERE pt.id_departamento = $1
        GROUP BY a.id_area, a.nombre
        ORDER BY a.nombre;
      `,
      [id_departamento]
    );

    const total = result.rows.reduce(
      (acc, row) => acc + Number(row.cantidad_trabajos),
      0
    );

    res.json({
      total,
      areas: result.rows,
    });
  } catch (error) {
    console.error("❌ Error al consultar permisos por área:", error);
    res.status(500).json({ error: "Error al consultar permisos por área" });
  }
});

// 🔹 API para obtener conteo de permisos por área filtrados por usuario
router.get("/grafica-usuario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          a.nombre AS area,
          COUNT(pt.id_permiso) AS cantidad_trabajos
        FROM permisos_trabajo pt
        INNER JOIN areas a ON pt.id_area = a.id_area
        WHERE pt.id_usuario = $1
        GROUP BY a.id_area, a.nombre
        ORDER BY a.nombre;
      `,
      [id_usuario]
    );

    const total = result.rows.reduce(
      (acc, row) => acc + Number(row.cantidad_trabajos),
      0
    );

    res.json({
      total,
      areas: result.rows,
    });
  } catch (error) {
    console.error("❌ Error al consultar permisos por área (usuario):", error);
    res
      .status(500)
      .json({ error: "Error al consultar permisos por área (usuario)" });
  }
});

module.exports = router;
