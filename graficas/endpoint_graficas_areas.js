const express = require("express");
const router = express.Router();
const pool = require("../database");

// 🔹 API para obtener conteo de permisos por área filtrados por departamento
router.get("/grafica/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          a.nombre AS area,
          COUNT(pt.id_permiso) AS cantidad_trabajos
        FROM permisos_trabajo pt
        INNER JOIN areas a ON pt.id_area = a.id_area
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

module.exports = router;
