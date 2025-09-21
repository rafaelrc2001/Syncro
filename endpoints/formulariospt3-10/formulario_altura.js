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

// Endpoint para consultar permiso de trabajo en altura por id
router.get("/pt-altura/:id", async (req, res) => {
  const id_permiso = req.params.id;
  try {
    const result = await db.query(
      `SELECT * FROM pt_altura WHERE id_permiso = $1 LIMIT 1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró apertura para este permiso (altura)",
      });
    }
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar apertura de PT Altura:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar apertura de PT Altura",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});







// Actualiza los requisitos del área para un permiso específico
router.put("/pt-altura/requisitos_area/:id", async (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  try {
    // Actualiza los campos necesarios en la tabla pt_altura
    await db.query(
      `UPDATE pt_altura SET
        fluido = $1,
        presion = $2,
        temperatura = $3
      WHERE id_permiso = $4`,
      [
        datos.fluido,
        datos.presion,
        datos.temperatura,
        id,
      ]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error al actualizar requisitos:", error);
    res.status(500).json({ error: "Error al actualizar requisitos" });
  }
});









module.exports = router;
