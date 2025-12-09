const express = require("express");
const router = express.Router();
const pool = require("../database");

// Endpoint para obtener conteo de permisos por tipo de permiso en un departamento
router.get("/permisos-tipo/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          tp.nombre AS tipo_permiso,
          COUNT(pt.id_permiso) AS cantidad_trabajos
        FROM permisos_trabajo pt
        INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
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
        WHERE pt.id_departamento = $1
          AND (ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL 
               OR ptc.id_permiso IS NOT NULL OR ptf.id_permiso IS NOT NULL 
               OR pte.id_permiso IS NOT NULL OR ptr.id_permiso IS NOT NULL 
               OR pta2.id_permiso IS NOT NULL OR pti.id_permiso IS NOT NULL
               OR ptex.id_permiso IS NOT NULL OR ptce.id_permiso IS NOT NULL)
        GROUP BY tp.nombre
        ORDER BY tp.nombre;
      `,
      [id_departamento]
    );
    res.json({ tipos: result.rows });
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
          tp.nombre AS tipo_permiso,
          COUNT(pt.id_permiso) AS cantidad_trabajos
        FROM permisos_trabajo pt
        INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
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
        WHERE pt.id_usuario = $1
          AND (ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL 
               OR ptc.id_permiso IS NOT NULL OR ptf.id_permiso IS NOT NULL 
               OR pte.id_permiso IS NOT NULL OR ptr.id_permiso IS NOT NULL 
               OR pta2.id_permiso IS NOT NULL OR pti.id_permiso IS NOT NULL
               OR ptex.id_permiso IS NOT NULL OR ptce.id_permiso IS NOT NULL)
        GROUP BY tp.nombre
        ORDER BY tp.nombre;
      `,
      [id_usuario]
    );
    res.json({ tipos: result.rows });
  } catch (error) {
    console.error("❌ Error al consultar permisos por tipo (usuario):", error);
    res
      .status(500)
      .json({ error: "Error al consultar permisos por tipo (usuario)" });
  }
});
module.exports = router;
