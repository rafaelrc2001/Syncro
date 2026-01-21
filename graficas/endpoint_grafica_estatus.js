const express = require("express");
const router = express.Router();
const pool = require("../database");

// Endpoint para obtener conteo de permisos por estatus en un departamento
router.get("/grafica-estatus-departamento/:id_departamentos", async (req, res) => {
  const { id_departamento } = req.params;
  console.log("[LOG] Valor recibido en /grafica-estatus-departamento:", id_departamento);
  try {
    const result = await pool.query(
      `
        SELECT
          e.estatus,
          COUNT(p.id_permiso) AS cantidad_trabajos
      FROM usuarios u
      INNER JOIN departamentos d
          ON u.departamento = d.nombre
      INNER JOIN permisos_trabajo p
          ON d.id_departamento = p.id_departamento
      INNER JOIN estatus e
          ON p.id_permiso = e.id_permiso
      WHERE u.id_usuario = $1
      GROUP BY e.estatus
      ORDER BY e.estatus;
      `,
      [id_departamento]
    );
    console.log("[LOG] Resultados SQL /grafica-estatus-departamento:", result.rows);
    res.json({ estatus: result.rows });
  } catch (error) {
    console.error("❌ Error al consultar permisos por estatus:", error);
    res.status(500).json({ error: "Error al consultar permisos por estatus" });
  }
});

// Endpoint para obtener conteo de permisos por estatus de un usuario específico
router.get("/grafica-estatus-usuario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          e.estatus,
          COUNT(pt.id_permiso) AS cantidad_trabajos
        FROM permisos_trabajo pt
        INNER JOIN estatus e ON pt.id_permiso = e.id_permiso
        WHERE pt.id_usuario = $1
        GROUP BY e.estatus
        ORDER BY e.estatus;
      `,
      [id_usuario]
    );
    res.json({ estatus: result.rows });
  } catch (error) {
    console.error(
      "❌ Error al consultar permisos por estatus (usuario):",
      error
    );
    res
      .status(500)
      .json({ error: "Error al consultar permisos por estatus (usuario)" });
  }
});

module.exports = router;
