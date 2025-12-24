const express = require("express");
const router = express.Router();
const pool = require("./database");

// Endpoint para obtener la información general de un permiso por id (solo permisos_trabajo)
router.get("/verformularios", async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return res.status(400).json({ error: "Falta el parámetro id" });

    // Consulta simple a permisos_trabajo (ajusta los campos según tu estructura actual)
    const queryGeneral = `
      SELECT * FROM permisos_trabajo WHERE id_permiso = $1
    `;
    const resultGeneral = await pool.query(queryGeneral, [id]);

    // Puedes agregar aquí más consultas si tienes otras tablas relacionadas que sí existan

    res.json({
      general: resultGeneral.rows[0] || {},
      // Si tienes más datos relacionados, agrégalos aquí
    });
  } catch (error) {
    console.error("Error en la consulta de permisos:", error);
    res.status(500).json({ error: "Error en la consulta de permisos" });
  }
});

module.exports = router;
