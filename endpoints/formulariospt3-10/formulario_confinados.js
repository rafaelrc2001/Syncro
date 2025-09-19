const express = require("express");
const router = express.Router();
const db = require("../../endpoints/database");

// Ruta para insertar en la tabla pt_confinados
router.post("/pt-confinados", async (req, res) => {
  const {
    id_permiso,
    tipo_mantenimiento,
    ot_numero,
    tag,
    hora_inicio,
    equipo_intervenir,
    avisos_trabajos,
    iluminacion_prueba_explosion,
    ventilacion_forzada,
    evaluacion_medica_aptos,
    cable_vida_trabajadores,
    vigilancia_exterior,
    nombre_vigilante,
    personal_rescatista,
    nombre_rescatista,
    instalar_barreras,
    equipo_especial,
    tipo_equipo_especial,
    numero_personas_autorizadas,
    tiempo_permanencia_min,
    tiempo_recuperacion_min,
    clase_espacio_confinado,
    observaciones_adicionales,
    descripcion_trabajo, // <-- NUEVO
    nombre_solicitante,
  } = req.body;

  // Validar campos obligatorios mínimos (puedes ajustar según tus necesidades)
  if (!id_permiso || !tipo_mantenimiento || !hora_inicio) {
    return res.status(400).json({
      success: false,
      error: "Faltan campos obligatorios para pt_confinados",
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO pt_confinados (
        id_permiso, tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir,
        avisos_trabajos, iluminacion_prueba_explosion, ventilacion_forzada, evaluacion_medica_aptos, cable_vida_trabajadores,
        vigilancia_exterior, nombre_vigilante, personal_rescatista, nombre_rescatista, instalar_barreras, equipo_especial, tipo_equipo_especial,
        numero_personas_autorizadas, tiempo_permanencia_min, tiempo_recuperacion_min, clase_espacio_confinado, observaciones_adicionales,
        descripcion_trabajo, nombre_solicitante      -- <-- NUEVO
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) RETURNING *`,
      [
        id_permiso,
        tipo_mantenimiento,
        ot_numero || null,
        tag || null,
        hora_inicio,
        equipo_intervenir || null,
        avisos_trabajos || null,
        iluminacion_prueba_explosion || null,
        ventilacion_forzada || null,
        evaluacion_medica_aptos || null,
        cable_vida_trabajadores || null,
        vigilancia_exterior || null,
        nombre_vigilante || null,
        personal_rescatista || null,
        nombre_rescatista || null,
        instalar_barreras || null,
        equipo_especial || null,
        tipo_equipo_especial || null,
        numero_personas_autorizadas || null,
        tiempo_permanencia_min || null,
        tiempo_recuperacion_min || null,
        clase_espacio_confinado || null,
        observaciones_adicionales || null,
        descripcion_trabajo || null, // <-- NUEVO
        nombre_solicitante || null, // <-- NUEVO
      ]
    );
    res.status(201).json({
      success: true,
      message: "Registro de PT Confinados creado exitosamente",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    res.status(500).json({
      success: false,
      error: "Error al registrar PT Confinados",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Endpoint para consultar  permiso tipo confinados (PT3)
router.get("/pt-confinado/:id", async (req, res) => {
  const id_permiso = req.params.id;
  try {
    const result = await db.query(
      `SELECT * FROM pt_confinados WHERE id_permiso = $1 LIMIT 1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró apertura para este permiso (confinados)",
      });
    }
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar apertura de PT Confinados:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar apertura de PT Confinados",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Actualiza los requisitos del área para un permiso específico
router.put("/requisitos_area/:id", async (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  try {
    // Actualiza los campos necesarios en la tabla pt_confinados
    await db.query(
      `UPDATE pt_confinados SET
        verificar_explosividad = $1,
        verificar_gas_toxico = $2,
        verificar_deficiencia_oxigeno = $3,
        verificar_enriquecimiento_oxigeno = $4,
        verificar_polvo_humos_fibras = $5,
        verificar_amoniaco = $6,
        verificar_material_piel = $7,
        verificar_temperatura = $8,
        verificar_lel = $9,
        suspender_trabajos_adyacentes = $10,
        acordonar_area = $11,
        prueba_gas_toxico_inflamable = $12,
        porcentaje_lel = $13,
        nh3 = $14,
        porcentaje_oxigeno = $15,
        equipo_despresionado_fuera_operacion = $16,
        equipo_aislado = $17,
        equipo_aislado_valvula = $18,
        equipo_aislado_junta_ciega = $19,
        equipo_lavado = $20,
        equipo_neutralizado = $21,
        equipo_vaporizado = $22,
        aislar_purgas_drenaje_venteo = $23,
        abrir_registros_necesarios = $24,
        observaciones_requisitos = $25,
        fluido = $26,
        presion = $27,
        temperatura = $28
      WHERE id_permiso = $29`,
      [
        datos.verificar_explosividad,
        datos.verificar_gas_toxico,
        datos.verificar_deficiencia_oxigeno,
        datos.verificar_enriquecimiento_oxigeno,
        datos.verificar_polvo_humos_fibras,
        datos.verificar_amoniaco,
        datos.verificar_material_piel,
        datos.verificar_temperatura,
        datos.verificar_lel,
        datos.suspender_trabajos_adyacentes,
        datos.acordonar_area,
        datos.prueba_gas_toxico_inflamable,
        datos.porcentaje_lel,
        datos.nh3,
        datos.porcentaje_oxigeno,
        datos.equipo_despresionado_fuera_operacion,
        datos.equipo_aislado,
        datos.equipo_aislado_valvula,
        datos.equipo_aislado_junta_ciega,
        datos.equipo_lavado,
        datos.equipo_neutralizado,
        datos.equipo_vaporizado,
        datos.aislar_purgas_drenaje_venteo,
        datos.abrir_registros_necesarios,
        datos.observaciones_requisitos,
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
