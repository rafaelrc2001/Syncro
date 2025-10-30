const express = require("express");
const router = express.Router();
const pool = require("./database");

// Endpoint para obtener la información general de un permiso por id (solo permisos_trabajo)
router.get("/verformularios", async (req, res) => {
  try {
    const id = parseInt(req.query.id, 10);
    if (!id) return res.status(400).json({ error: "Falta el parámetro id" });

    const tipoQuery = `
            SELECT tp.nombre AS tipo_permiso
            FROM permisos_trabajo pt
            INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
            WHERE pt.id_permiso = $1
        `;
    const tipoResult = await pool.query(tipoQuery, [id]);
    console.log("Tipo de permiso encontrado:", tipoResult.rows[0]);
    const tipo_permiso = tipoResult.rows[0]?.tipo_permiso;

    let resultGeneral, resultDetalles;
    // Consulta dinámica según el tipo
    if (tipo_permiso === "PT No Peligroso") {
      console.log("Entrando a bloque PT No Peligroso");
      // Consulta para pt_no_peligroso
      const queryGeneralNoPeligroso = `
                SELECT 
                    pt.id_permiso,
                    TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
                    pt.prefijo,
                    tp.nombre AS tipo_permiso,
                    pt.contrato,
                    ptnp.empresa,
                    s.nombre AS sucursal,
                    a.nombre AS area, 
                    d.nombre AS departamento,
                    ptnp.nombre_solicitante AS solicitante,
                    ptnp.descripcion_trabajo,
                    ptnp.trabajo_area_riesgo_controlado,
                    ptnp.necesita_entrega_fisica,
                    ptnp.necesita_ppe_adicional,
                    ptnp.area_circundante_riesgo,
                    ptnp.necesita_supervision,
                    ptnp.observaciones_analisis_previo
                FROM permisos_trabajo pt
                INNER JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
                INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
                INNER JOIN areas a ON pt.id_area = a.id_area
                INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
                INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
                WHERE pt.id_permiso = $1
            `;
      resultGeneral = await pool.query(queryGeneralNoPeligroso, [id]);

      const queryDetallesNoPeligroso = `
                SELECT 
                    a.nombre AS planta,
                    pnp.tipo_mantenimiento AS tipo_actividad,
                    pnp.ot_no AS ot,
                    pnp.equipo_intervencion AS equipo,
                    pnp.tag,
                    TO_CHAR(pnp.hora_inicio, 'HH24:MI') || ' hrs' AS horario,
                    pnp.fluido,
                    pnp.presion,
                    pnp.temperatura,
                    pnp.trabajo_area_riesgo_controlado,
                    pnp.necesita_entrega_fisica,
                    pnp.necesita_ppe_adicional,
                    pnp.area_circundante_riesgo,
                    pnp.necesita_supervision,
                    pnp.observaciones_analisis_previo
                FROM permisos_trabajo pt
                LEFT JOIN pt_no_peligroso pnp ON pt.id_permiso = pnp.id_permiso
                LEFT JOIN areas a ON pt.id_area = a.id_area
                WHERE pt.id_permiso = $1
            `;
      resultDetalles = await pool.query(queryDetallesNoPeligroso, [id]);
    } else if (tipo_permiso === "PT para Apertura Equipo Línea") {
      console.log("Entrando a bloque PT para Apertura Equipo Línea");
      // Consulta correcta para pt_apertura

      // ...existing code...
      const queryGeneralApertura = `
    SELECT 
        pt.id_permiso,
        TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
        pt.prefijo,
        tp.nombre AS tipo_permiso,
        pt.contrato,
        pa.empresa,
        s.nombre AS sucursal,
        a.nombre AS area, 
        d.nombre AS departamento,
        pa.nombre_solicitante AS solicitante,
        pa.descripcion_trabajo,
        pa.tipo_mantenimiento,
        pa.ot_numero,
        pa.tag,
        TO_CHAR(pa.hora_inicio, 'HH24:MI') AS hora_inicio,
        pa.fluido,
        pa.presion,
        pa.temperatura,
        pa.antecedentes,
        pa.requiere_herramientas_especiales,
        pa.tipo_herramientas_especiales,
        pa.herramientas_adecuadas,
        pa.requiere_verificacion_previa,
        pa.requiere_conocer_riesgos,
        pa.observaciones_medidas,
        pa.fuera_operacion,
        pa.despresurizado_purgado,
        pa.necesita_aislamiento,
        pa.con_valvulas,
        pa.con_juntas_ciegas,
        pa.producto_entrampado,
        pa.requiere_lavado,
        pa.requiere_neutralizado,
        pa.requiere_vaporizado,
        pa.suspender_trabajos_adyacentes,
        pa.acordonar_area,
        pa.prueba_gas_toxico_inflamable,
        pa.equipo_electrico_desenergizado,
        pa.tapar_purgas_drenajes,
        pa.proteccion_especial_recomendada,
        pa.proteccion_piel_cuerpo,
        pa.proteccion_respiratoria,
        pa.proteccion_ocular,
        pa.proteccion_contraincendio,
        pa.tipo_proteccion_contraincendio,
        pa.instalacion_barreras,
        pa.observaciones_riesgos,
        pa.co2_nivel,
        pa.nh3_nivel,
        pa.oxigeno_nivel,
        pa.lel_nivel,
        pa.aprobado_co2,
        pa.aprobado_nh3,
        pa.aprobado_oxigeno,
        pa.aprobado_lel,
        -- Columnas comentadas temporalmente hasta verificar esquema de BD
        -- pa.aprobado_co2,
        -- pa.aprobado_nh3,
        -- pa.aprobado_oxigeno,
        -- pa.aprobado_lel,
        pa.tiene_equipo_intervenir
    FROM permisos_trabajo pt
    INNER JOIN pt_apertura pa ON pt.id_permiso = pa.id_permiso
    INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
    INNER JOIN areas a ON pt.id_area = a.id_area
    INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
    INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
    WHERE pt.id_permiso = $1
`;
      // ...existing code...
      resultGeneral = await pool.query(queryGeneralApertura, [id]);
      console.log("Resultado general apertura:", resultGeneral.rows);

      resultDetalles = { rows: [] }; // Si no tienes detalles separados, puedes dejarlo vacío.
    } else if (tipo_permiso === "PT de Entrada a Espacio Confinado") {
      // Consulta para pt_confinados

      const queryGeneralConfinados = `
         SELECT
    pt.id_permiso,
    TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
    pt.prefijo,
    tp.nombre AS tipo_permiso,
    pt.contrato,
    pec.empresa,
    s.nombre AS sucursal,
    a.nombre AS area,
    d.nombre AS departamento,
    pec.nombre_solicitante,
    pec.descripcion_trabajo,
    pec.tipo_mantenimiento,
    pec.ot_numero,
    pec.tag,
    TO_CHAR(pec.hora_inicio, 'HH24:MI') AS hora_inicio,
    pec.equipo_intervenir,
    pec.avisos_trabajos,
    pec.iluminacion_prueba_explosion,
    pec.ventilacion_forzada,
    pec.evaluacion_medica_aptos,
    pec.cable_vida_trabajadores,
    pec.vigilancia_exterior,
    pec.vigilancia_exterior_opcion,
    pec.nombre_vigilante,
    pec.personal_rescatista,
    pec.nombre_rescatista,
    pec.instalar_barreras,
    pec.equipo_especial,
    pec.tipo_equipo_especial,
    pec.numero_personas_autorizadas,
    pec.tiempo_permanencia_min,
    pec.tiempo_recuperacion_min,
    pec.clase_espacio_confinado,
    pec.observaciones_adicionales,
    pec.verificar_explosividad,
    pec.verificar_gas_toxico,
    pec.verificar_deficiencia_oxigeno,
    pec.verificar_enriquecimiento_oxigeno,
    pec.verificar_polvo_humos_fibras,
    pec.verificar_amoniaco,
    pec.verificar_material_piel,
    pec.verificar_temperatura,
    pec.verificar_lel,
    pec.suspender_trabajos_adyacentes,
    pec.acordonar_area,
    pec.prueba_gas_toxico_inflamable,
    pec.porcentaje_lel,
    pec.nh3,
    pec.porcentaje_oxigeno,
    pec.equipo_despresionado_fuera_operacion,
    pec.equipo_aislado,
    pec.equipo_aislado_valvula,
    pec.equipo_aislado_junta_ciega,
    pec.equipo_lavado,
    pec.equipo_neutralizado,
    pec.equipo_vaporizado,
    pec.aislar_purgas_drenaje_venteo,
    pec.abrir_registros_necesarios,
    pec.observaciones_requisitos,
    pec.fluido,
    pec.presion,
    pec.temperatura,
    pec.proteccion_piel_cuerpo,
    pec.proteccion_piel_detalle,
    pec.proteccion_respiratoria,
    pec.proteccion_respiratoria_detalle,
    pec.proteccion_ocular,
    pec.proteccion_ocular_detalle,
    pec.arnes_seguridad,
    pec.cable_vida,
    pec.ventilacion_forzada_opcion,
    pec.ventilacion_forzada_detalle,
    pec.iluminacion_explosion,
    pec.prueba_gas_aprobado,
    pec.param_co2,
    pec.valor_co2,
    pec.param_amoniaco,
    pec.valor_amoniaco,
    pec.param_oxigeno,
    pec.valor_oxigeno,
    pec.param_explosividad_lel,
    pec.valor_explosividad_lel,
    pec.param_otro,
    pec.param_otro_detalle,
    pec.valor_otro,
    pec.observaciones,
    pec.fecha_creacion,
    pec.fecha_actualizacion
FROM permisos_trabajo pt
INNER JOIN pt_confinados pec ON pt.id_permiso = pec.id_permiso
INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
INNER JOIN areas a ON pt.id_area = a.id_area
INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
WHERE pt.id_permiso = $1
      `;

      resultGeneral = await pool.query(queryGeneralConfinados, [id]);
      resultDetalles = { rows: [] };
    } else if (tipo_permiso === "PT en Altura") {
      const queryGeneralAltura = `
  SELECT 
    pt.id_permiso,
    TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
    pt.prefijo,
    tp.nombre AS tipo_permiso,
    pt.contrato,
    pa.empresa,
    s.nombre AS sucursal,
    a.nombre AS area, 
    d.nombre AS departamento,
    pa.nombre_solicitante AS solicitante,
    pa.descripcion_trabajo,
    pa.tipo_mantenimiento,
    pa.ot_numero,
    pa.tag,
    TO_CHAR(pa.hora_inicio, 'HH24:MI') AS hora_inicio,
    pa.equipo_intervenir,
    pa.fluido,
    pa.presion,
    pa.temperatura,
    pa.requiere_escalera,
    pa.requiere_canastilla_grua,
    pa.aseguramiento_estrobo,
    pa.requiere_andamio_cama_completa,
    pa.otro_tipo_acceso,
    pa.acceso_libre_obstaculos,
    pa.canastilla_asegurada,
    pa.andamio_completo,
    pa.andamio_seguros_zapatas,
    pa.escaleras_buen_estado,
    pa.linea_vida_segura,
    pa.arnes_completo_buen_estado,
    pa.suspender_trabajos_adyacentes,
    pa.numero_personas_autorizadas,
    pa.trabajadores_aptos_evaluacion,
    pa.requiere_barreras,
    pa.observaciones,
  TO_CHAR(pa.fecha_creacion, 'DD/MM/YYYY') AS fecha_creacion,
  TO_CHAR(pa.fecha_actualizacion, 'DD/MM/YYYY') AS fecha_actualizacion,
  pa.proteccion_especial,
    pa.proteccion_especial_cual,
    pa.equipo_caidas,
    pa.equipo_caidas_cual,
    pa.linea_amortiguador,
    pa.punto_fijo,
    pa.linea_vida,
    pa.andamio_completo_opcion,
    pa.tarjeta_andamio,
    pa.viento_permitido,
    pa.escalera_condicion
  FROM permisos_trabajo pt
  INNER JOIN pt_altura pa ON pt.id_permiso = pa.id_permiso
  INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
  INNER JOIN areas a ON pt.id_area = a.id_area
  INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
  INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
  WHERE pt.id_permiso = $1
`;

      // Consulta para pt_altura
      resultGeneral = await pool.query(queryGeneralAltura, [id]);
      resultDetalles = { rows: [] };
    } else if (tipo_permiso === "PT de Fuego Abierto") {
      // Consulta para pt_fuego

      const queryGeneralFuego = `
    SELECT 
        pt.id_permiso,
        TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
        pt.prefijo,
        tp.nombre AS tipo_permiso,
        pt.contrato,
        pf.empresa,
        s.nombre AS sucursal,
        a.nombre AS area, 
        d.nombre AS departamento,
        pf.nombre_solicitante AS solicitante,
        pf.descripcion_trabajo,
        pf.tipo_mantenimiento,
        pf.tipo_mantenimiento_otro,
        pf.ot_numero,
        pf.tag,
        TO_CHAR(pf.hora_inicio, 'HH24:MI') AS hora_inicio,
        pf.equipo_intervenir,
        TO_CHAR(pf.fecha_creacion, 'DD/MM/YYYY') AS fecha_creacion,
        TO_CHAR(pf.fecha_actualizacion, 'DD/MM/YYYY') AS fecha_actualizacion
    FROM permisos_trabajo pt
    INNER JOIN pt_fuego pf ON pt.id_permiso = pf.id_permiso
    INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
    INNER JOIN areas a ON pt.id_area = a.id_area
    INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
    INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
    WHERE pt.id_permiso = $1
`;
      resultGeneral = await pool.query(queryGeneralFuego, [id]);
      resultDetalles = { rows: [] };
    } else if (tipo_permiso === "PT con Energía Eléctrica") {
      // Consulta para pt_electrico

      const queryGeneralElectrico = `
    SELECT 
        pt.id_permiso,
        TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
        pt.prefijo,
        tp.nombre AS tipo_permiso,
        pt.contrato,
        pe.empresa,
        s.nombre AS sucursal,
        a.nombre AS area, 
        d.nombre AS departamento,
        pe.nombre_solicitante AS solicitante,
        pe.descripcion_trabajo,
        pe.tipo_mantenimiento,
        pe.tipo_mantenimiento_otro,
        pe.ot_numero,
        pe.tag,
        TO_CHAR(pe.hora_inicio, 'HH24:MI') AS hora_inicio,
        pe.equipo_intervenir,
        pe.equipo_desenergizado,
        pe.interruptores_abiertos,
        pe.verificar_ausencia_voltaje,
        pe.candados_equipo,
        pe.tarjetas_alerta,
        pe.aviso_personal_area,
        pe.tapetes_dielectricos,
        pe.herramienta_aislante,
        pe.pertiga_telescopica,
        pe.equipo_proteccion_especial,
        pe.tipo_equipo_proteccion,
        pe.aterrizar_equipo,
        pe.barricadas_area,
        pe.observaciones_adicionales,
        TO_CHAR(pe.fecha_creacion, 'DD/MM/YYYY') AS fecha_creacion,
        TO_CHAR(pe.fecha_actualizacion, 'DD/MM/YYYY') AS fecha_actualizacion
    FROM permisos_trabajo pt
    INNER JOIN pt_electrico pe ON pt.id_permiso = pe.id_permiso
    INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
    INNER JOIN areas a ON pt.id_area = a.id_area
    INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
    INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
    WHERE pt.id_permiso = $1
`;
      resultGeneral = await pool.query(queryGeneralElectrico, [id]);
      resultDetalles = { rows: [] };
    } else if (tipo_permiso === "PT con Fuentes Radioactivas") {
      // Consulta para pt_radiacion

      const queryGeneralRadiacion = `
    SELECT 
        pt.id_permiso,
        TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
        pt.prefijo,
        tp.nombre AS tipo_permiso,
        pt.contrato,
        pr.empresa,
        s.nombre AS sucursal,
        a.nombre AS area, 
        d.nombre AS departamento,
        pr.nombre_solicitante AS solicitante,
        pr.descripcion_trabajo,
        pr.tipo_mantenimiento,
        pr.tipo_mantenimiento_otro,
        pr.ot_numero,
        pr.tag,
        TO_CHAR(pr.hora_inicio, 'HH24:MI') AS hora_inicio,
        pr.equipo_intervenir,
        pr.tipo_fuente_radiactiva,
        pr.actividad_radiactiva,
        pr.numero_serial_fuente,
        pr.distancia_trabajo,
        pr.tiempo_exposicion,
        pr.dosis_estimada,
        pr.equipo_proteccion_radiologica,
        pr.dosimetros_personales,
        pr.monitores_radiacion_area,
        pr.senalizacion_area,
        pr.barricadas,
        pr.protocolo_emergencia,
        pr.personal_autorizado,
        pr.observaciones_radiacion,
        TO_CHAR(pr.fecha_creacion, 'DD/MM/YYYY') AS fecha_creacion,
        TO_CHAR(pr.fecha_actualizacion, 'DD/MM/YYYY') AS fecha_actualizacion
    FROM permisos_trabajo pt
    INNER JOIN pt_radiacion pr ON pt.id_permiso = pr.id_permiso
    INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
    INNER JOIN areas a ON pt.id_area = a.id_area
    INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
    INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
    WHERE pt.id_permiso = $1
`;
      resultGeneral = await pool.query(queryGeneralRadiacion, [id]);
      resultDetalles = { rows: [] };
    } else {
      console.log("Tipo de permiso no soportado:", tipo_permiso);
      return res.status(400).json({ error: "Tipo de permiso no soportado" });
    }

    // Consulta parte 3: AST (EPP, Maquinaria, Materiales)
    const queryASTInfo = `
            SELECT 
                ast.epp AS epp_requerido,
                ast.maquinaria_equipo_herramientas AS maquinaria_herramientas,
                ast.materiales_accesorios AS material_accesorios
            FROM permisos_trabajo pt
            INNER JOIN ast ON pt.id_ast = ast.id_ast
            WHERE pt.id_permiso = $1;
        `;
    const resultAST = await pool.query(queryASTInfo, [id]);

    // Consulta parte 4: Actividades AST
    const queryActividadesAST = `
            SELECT 
                aa.num_actividad AS no,
                aa.secuencia_actividad,
                pe.nombre AS personal_ejecutor,
                aa.peligros_potenciales,
                aa.acciones_preventivas AS descripcion,
                r.nombre AS responsable
            FROM permisos_trabajo pt
            JOIN ast a ON pt.id_ast = a.id_ast
            JOIN ast_actividades aa ON a.id_ast = aa.id_ast
            LEFT JOIN ast_participan pe ON aa.personal_ejecutor::INT = pe.id_ast_participan
            LEFT JOIN ast_participan r  ON aa.responsable::INT = r.id_ast_participan
            WHERE pt.id_permiso = $1
            ORDER BY aa.num_actividad::INT;
        `;
    const resultActividades = await pool.query(queryActividadesAST, [id]);

    // Consulta parte 5: Participantes AST por estatus
    // Primero obtenemos el id_estatus del permiso
    const queryEstatus =
      "SELECT id_estatus FROM permisos_trabajo WHERE id_permiso = $1";
    const resultEstatus = await pool.query(queryEstatus, [id]);
    let participantesRows = [];
    if (resultEstatus.rows.length > 0) {
      const id_estatus = resultEstatus.rows[0].id_estatus;
      const queryParticipantesAST = `
                SELECT 
                    ap.nombre AS nombre,
                    ap.funcion AS funcion,
                    ap.credencial AS credencial,
                    ap.cargo AS cargo
                FROM ast_participan ap
                WHERE ap.id_estatus = $1;
            `;
      const resultParticipantes = await pool.query(queryParticipantesAST, [
        id_estatus,
      ]);
      participantesRows = resultParticipantes.rows || [];
    }

    // Consulta parte 6: responsable_area y operador_area
    const queryResponsables = `
            SELECT 
                a.responsable_area, 
                a.operador_area
            FROM permisos_trabajo pt
            INNER JOIN autorizaciones a ON pt.id_permiso = a.id_permiso
            WHERE pt.id_permiso = $1
        `;
    const resultResponsables = await pool.query(queryResponsables, [id]);

    res.json({
      tipo_permiso,
      general: resultGeneral.rows[0] || {},
      detalles: resultDetalles.rows[0] || {},
      ast: resultAST.rows[0] || {},
      actividades_ast: resultActividades.rows || [],
      participantes_ast: participantesRows,
      responsables_area: resultResponsables.rows[0] || {},
    });
  } catch (error) {
    console.error("Error en la consulta de permisos:", error);
    res.status(500).json({ error: "Error en la consulta de permisos" });
  }
});

module.exports = router;
