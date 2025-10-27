const express = require("express");
const router = express.Router();
const db = require("./database");

/**
 * Endpoint para obtener las fechas de creación y autorización de un permiso
 * GET /api/fechas-autorizacion/:id
 */
router.get("/fechas-autorizacion/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID del permiso es requerido",
    });
  }

  try {
    // Consulta que une las tablas permisos_trabajo y autorizaciones
    const query = `
            SELECT 
                pt.fecha_hora as fecha_creacion,
                a.fecha_hora_area,
                a.fecha_hora_supervisor
            FROM permisos_trabajo pt
            LEFT JOIN autorizaciones a ON pt.id_permiso = a.id_permiso
            WHERE pt.id_permiso = $1
        `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Permiso no encontrado",
      });
    }

    const row = result.rows[0];

    // Formatear las fechas obtenidas
    const fechas = {
      creacion: row.fecha_creacion || null,
      area: row.fecha_hora_area || null,
      supervisor: row.fecha_hora_supervisor || null,
    };

    res.json({
      success: true,
      fechas: fechas,
      message: "Fechas obtenidas exitosamente",
    });
  } catch (error) {
    console.error("Error al consultar fechas de autorización:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
