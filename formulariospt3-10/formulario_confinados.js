const express = require("express");
console.log("[DEBUG] formulario_confinados.js router cargado");
const router = express.Router();
const db = require("../database");

// ...existing code...
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
    descripcion_trabajo,
    nombre_solicitante,
    empresa,
    contrato,
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
        descripcion_trabajo, nombre_solicitante, empresa, contrato
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
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
        descripcion_trabajo || null,
        nombre_solicitante || null,
        empresa || null,
        contrato || null,
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
        temperatura = $28,
        nombre_verificar_explosividad = $29,
        nombre_verificar_gas_toxico = $30,
        nombre_verificar_deficiencia_oxigeno = $31,
        nombre_verificar_enriquecimiento_oxigeno = $32,
        nombre_verificar_polvo_humos_fibras = $33,
        nombre_verificar_amoniaco = $34,
        nombre_verificar_material_piel = $35,
        nombre_verificar_temperatura = $36,
        nombre_verificar_lel = $37,
        nombre_suspender_trabajos_adyacentes = $38,
        nombre_acordonar_area = $39,
        nombre_prueba_gas_toxico_inflamable = $40,
        nombre_porcentaje_lel = $41,
        nombre_nh3 = $42,
        nombre_porcentaje_oxigeno = $43,
        nombre_equipo_despresionado_fuera_operacion = $44,
        nombre_equipo_aislado = $45,
        nombre_equipo_lavado = $46,
        nombre_equipo_neutralizado = $47,
        nombre_equipo_vaporizado = $48,
        nombre_aislar_purgas_drenaje_venteo = $49,
        nombre_abrir_registros_necesarios = $50,
        nombre_observaciones_requisitos = $51
      WHERE id_permiso = $52`,
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
        datos.nombre_verificar_explosividad,
        datos.nombre_verificar_gas_toxico,
        datos.nombre_verificar_deficiencia_oxigeno,
        datos.nombre_verificar_enriquecimiento_oxigeno,
        datos.nombre_verificar_polvo_humos_fibras,
        datos.nombre_verificar_amoniaco,
        datos.nombre_verificar_material_piel,
        datos.nombre_verificar_temperatura,
        datos.nombre_verificar_lel,
        datos.nombre_suspender_trabajos_adyacentes,
        datos.nombre_acordonar_area,
        datos.nombre_prueba_gas_toxico_inflamable,
        datos.nombre_porcentaje_lel,
        datos.nombre_nh3,
        datos.nombre_porcentaje_oxigeno,
        datos.nombre_equipo_despresionado_fuera_operacion,
        datos.nombre_equipo_aislado,
        datos.nombre_equipo_lavado,
        datos.nombre_equipo_neutralizado,
        datos.nombre_equipo_vaporizado,
        datos.nombre_aislar_purgas_drenaje_venteo,
        datos.nombre_abrir_registros_necesarios,
        datos.nombre_observaciones_requisitos,
        id,
      ]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error al actualizar requisitos:", error);
    res.status(500).json({ error: "Error al actualizar requisitos" });
  }
});

// Ruta PUT para actualizar los requisitos de supervisor y pruebas en pt_confinados
router.put("/requisitos_supervisor/:id_permiso", async (req, res) => {
  console.log(
    `[DEBUG] PUT /requisitos_supervisor/${req.params.id_permiso} llamado`
  );
  console.log("[DEBUG] Body recibido:", req.body);
  const { id_permiso } = req.params;
  const {
    proteccion_piel_cuerpo,
    proteccion_piel_detalle,
    proteccion_respiratoria,
    proteccion_respiratoria_detalle,
    proteccion_ocular,
    proteccion_ocular_detalle,
    arnes_seguridad,
    cable_vida,
    ventilacion_forzada_opcion,
    ventilacion_forzada_detalle,
    iluminacion_explosion,
    prueba_gas_aprobado,
    param_co2,
    valor_co2,
    param_amoniaco,
    valor_amoniaco,
    param_oxigeno,
    valor_oxigeno,
    param_explosividad_lel,
    valor_explosividad_lel,
    param_otro,
    param_otro_detalle,
    valor_otro,
    observaciones,
    vigilancia_exterior_opcion,
  } = req.body;

  const query = `
    UPDATE pt_confinados SET
      proteccion_piel_cuerpo = $1,
      proteccion_piel_detalle = $2,
      proteccion_respiratoria = $3,
      proteccion_respiratoria_detalle = $4,
      proteccion_ocular = $5,
      proteccion_ocular_detalle = $6,
      arnes_seguridad = $7,
      cable_vida = $8,
      ventilacion_forzada_opcion = $9,
      ventilacion_forzada_detalle = $10,
      iluminacion_explosion = $11,
      prueba_gas_aprobado = $12,
      param_co2 = $13,
      valor_co2 = $14,
      param_amoniaco = $15,
      valor_amoniaco = $16,
      param_oxigeno = $17,
      valor_oxigeno = $18,
      param_explosividad_lel = $19,
      valor_explosividad_lel = $20,
      param_otro = $21,
      param_otro_detalle = $22,
      valor_otro = $23,
      observaciones = $24,
      vigilancia_exterior_opcion = $25
    WHERE id_permiso = $26
    RETURNING *;
  `;

  const values = [
    proteccion_piel_cuerpo,
    proteccion_piel_detalle,
    proteccion_respiratoria,
    proteccion_respiratoria_detalle,
    proteccion_ocular,
    proteccion_ocular_detalle,
    arnes_seguridad,
    cable_vida,
    ventilacion_forzada_opcion,
    ventilacion_forzada_detalle,
    iluminacion_explosion,
    prueba_gas_aprobado,
    param_co2,
    valor_co2,
    param_amoniaco,
    valor_amoniaco,
    param_oxigeno,
    valor_oxigeno,
    param_explosividad_lel,
    valor_explosividad_lel,
    param_otro,
    param_otro_detalle,
    valor_otro,
    observaciones,
    vigilancia_exterior_opcion,
    id_permiso,
  ];

  try {
    const result = await db.query(query, values);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Permiso no encontrado" });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(
      "Error al actualizar requisitos supervisor confinados:",
      error
    );
    res.status(500).json({
      success: false,
      error: "Error al actualizar requisitos supervisor confinados",
    });
  }
});

module.exports = router;
