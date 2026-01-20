const express = require("express");
const router = express.Router();
const pool = require("../database");




// Endpoint para obtener conteo de permisos por estatus de un usuario específico
router.get("/grafica-sub-estatus-usuario/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT e.* 
        FROM estatus e
        WHERE e.id_permiso IN (
          SELECT pt.id_permiso 
          FROM permisos_trabajo pt 
          WHERE pt.id_usuario = $1
        )
      `,
      [id_usuario]
    );
    res.json({ estatus: result.rows });
  } catch (error) {
    console.error(
      "❌ Error al consultar permisos por sub-estatus (usuario):",
      error
    );
    res
      .status(500)
      .json({ error: "Error al consultar permisos por sub-estatus (usuario)" });
  }
});



module.exports = router;