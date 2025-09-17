const express = require("express");
const router = express.Router();
const db = require("../database");

// Insertar nuevo registro en pt_altura
router.post("/pt_altura", async (req, res) => {
  try {
    const {
      id_permiso,
      tipo_mantenimiento,
      ot_numero,
      tag,
      hora_inicio,
      equipo_intervenir,
      descripcion_trabajo,
      nombre_solicitante,
      empresa,
      requiere_escalera,
      requiere_canastilla_grua,
      aseguramiento_estrobo,
      requiere_andamio_cama_completa,
      otro_tipo_acceso,
      acceso_libre_obstaculos,
      canastilla_asegurada,
      andamio_completo,
      andamio_seguros_zapatas,
      escaleras_buen_estado,
      linea_vida_segura,
      arnes_completo_buen_estado,
      suspender_trabajos_adyacentes,
      numero_personas_autorizadas,
      trabajadores_aptos_evaluacion,
      requiere_barreras,
      observaciones,
    } = req.body;

    const query = `INSERT INTO public.pt_altura (
            id_permiso,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervenir,
            descripcion_trabajo,
            nombre_solicitante,
            empresa,
            requiere_escalera,
            requiere_canastilla_grua,
            aseguramiento_estrobo,
            requiere_andamio_cama_completa,
            otro_tipo_acceso,
            acceso_libre_obstaculos,
            canastilla_asegurada,
            andamio_completo,
            andamio_seguros_zapatas,
            escaleras_buen_estado,
            linea_vida_segura,
            arnes_completo_buen_estado,
            suspender_trabajos_adyacentes,
            numero_personas_autorizadas,
            trabajadores_aptos_evaluacion,
            requiere_barreras,
            observaciones
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
        ) RETURNING *;`;

    const values = [
      id_permiso,
      tipo_mantenimiento,
      ot_numero,
      tag,
      hora_inicio,
      equipo_intervenir,
      descripcion_trabajo,
      nombre_solicitante,
      empresa,
      requiere_escalera,
      requiere_canastilla_grua,
      aseguramiento_estrobo,
      requiere_andamio_cama_completa,
      otro_tipo_acceso,
      acceso_libre_obstaculos,
      canastilla_asegurada,
      andamio_completo,
      andamio_seguros_zapatas,
      escaleras_buen_estado,
      linea_vida_segura,
      arnes_completo_buen_estado,
      suspender_trabajos_adyacentes,
      numero_personas_autorizadas,
      trabajadores_aptos_evaluacion,
      requiere_barreras,
      observaciones,
    ];

    const result = await db.query(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al insertar en pt_altura:", error);
    res
      .status(500)
      .json({ success: false, error: "Error al insertar en pt_altura" });
  }
});

module.exports = router;
