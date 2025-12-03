const express = require("express");
const router = express.Router();
const db = require("../database");

// Endpoint para filtrar por departamento
// Endpoint para filtrar por departamento con la misma lógica de joins
router.get("/meses/departamento/:id_departamento", async (req, res) => {
  const { id_departamento } = req.params;
  try {
    const result = await db.query(
      `
     SELECT 
    pt.fecha_hora,
    pt.id_estatus,
    e.estatus,
    tp.nombre AS tipo_permiso
FROM permisos_trabajo pt
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
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
WHERE (
    ptnp.id_permiso IS NOT NULL 
    OR pta.id_permiso IS NOT NULL 
    OR ptc.id_permiso IS NOT NULL 
    OR ptf.id_permiso IS NOT NULL 
    OR pte.id_permiso IS NOT NULL 
    OR ptr.id_permiso IS NOT NULL 
    OR pta2.id_permiso IS NOT NULL
    OR pti.id_permiso IS NOT NULL
    OR ptex.id_permiso IS NOT NULL
    OR ptce.id_permiso IS NOT NULL
)
AND pt.id_departamento = $1;
    `,
      [id_departamento]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/meses", async (req, res) => {
  try {
    const result = await db.query(`
     
SELECT 
    pt.fecha_hora,
    pt.id_estatus,
    e.estatus,  -- Columna de la tabla estatus
    tp.nombre AS tipo_permiso
FROM permisos_trabajo pt
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus  -- JOIN con la tabla estatus
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
    OR ptce.id_permiso IS NOT NULL;

		

    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
