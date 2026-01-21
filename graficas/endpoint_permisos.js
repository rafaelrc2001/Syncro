const express = require("express");
const router = express.Router();
const pool = require("../database");

// Endpoint para obtener conteo de permisos por tipo de permiso en un departamento
router.get("/permisos-tipo-departamento/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
            COUNT(pt.id_permiso) AS cantidad_trabajos
        FROM usuarios u
        INNER JOIN departamentos d
            ON u.departamento = d.nombre
        INNER JOIN permisos_trabajo pt
            ON d.id_departamento = pt.id_departamento
        WHERE u.id_usuario = $1;
      `,
      [id_departamento]
    );
    res.json({ total: result.rows[0]?.cantidad_trabajos || 0 });
  } catch (error) {
    console.error("❌ Error al consultar permisos por tipo:", error);
    res.status(500).json({ error: "Error al consultar permisos por tipo" });
  }
});

// Endpoint para obtener conteo de permisos por tipo de permiso de un usuario específico
router.get("/permisos-tipo-usuario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          COUNT(pt.id_permiso) AS cantidad_trabajos
        FROM permisos_trabajo pt
        WHERE pt.id_usuario = $1;
      `,
      [id_usuario]
    );
    res.json({ total: result.rows[0]?.cantidad_trabajos || 0 });
  } catch (error) {
    console.error("❌ Error al consultar permisos por tipo (usuario):", error);
    res
      .status(500)
      .json({ error: "Error al consultar permisos por tipo (usuario)" });
  }
});
module.exports = router;
