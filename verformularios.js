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
                    ptnp.observaciones_analisis_previo,
                    ptnp.verificacion_epp,
                    ptnp.verificacion_herramientas,
                    ptnp.verificacion_observaciones
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
                    pnp.observaciones_analisis_previo,
                    pnp.verificacion_epp,
                    pnp.verificacion_herramientas,
                    pnp.verificacion_observaciones
                FROM permisos_trabajo pt
                LEFT JOIN pt_no_peligroso pnp ON pt.id_permiso = pnp.id_permiso
                LEFT JOIN areas a ON pt.id_area = a.id_area
                WHERE pt.id_permiso = $1
            `;
      resultDetalles = await pool.query(queryDetallesNoPeligroso, [id]);
    } else if (tipo_permiso === "PT para Apertura Equipo o Línea") {
      console.log("Entrando a bloque PT para Apertura Equipo o Línea");
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
    pa.fuera_operacion_nombre,
    pa.despresurizado_purgado,
    pa.despresurizado_purgado_nombre,
    pa.necesita_aislamiento,
    pa.necesita_aislamiento_nombre,
    pa.con_valvulas,
    pa.con_valvulas_nombre,
    pa.con_juntas_ciegas,
    pa.con_juntas_ciegas_nombre,
    pa.producto_entrampado,
    pa.producto_entrampado_nombre,
    pa.requiere_lavado,
    pa.requiere_lavado_nombre,
    pa.requiere_neutralizado,
    pa.requiere_neutralizado_nombre,
    pa.requiere_vaporizado,
    pa.requiere_vaporizado_nombre,
    pa.suspender_trabajos_adyacentes,
    pa.suspender_trabajos_adyacentes_nombre,
    pa.acordonar_area,
    pa.acordonar_area_nombre,
    pa.prueba_gas_toxico_inflamable,
    pa.prueba_gas_toxico_inflamable_nombre,
    pa.equipo_electrico_desenergizado,
    pa.equipo_electrico_desenergizado_nombre,
    pa.tapar_purgas_drenajes,
    pa.tapar_purgas_drenajes_nombre,
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
    pa.gas_lel,
    pa.gas_co2,
    pa.gas_nh3,
    pa.gas_oxigeno,
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
    pec.nombre_verificar_explosividad,
    pec.nombre_verificar_gas_toxico,
    pec.nombre_verificar_deficiencia_oxigeno,
    pec.nombre_verificar_enriquecimiento_oxigeno,
    pec.nombre_verificar_polvo_humos_fibras,
    pec.nombre_verificar_amoniaco,
    pec.nombre_verificar_material_piel,
    pec.nombre_verificar_temperatura,
    pec.nombre_verificar_lel,
    pec.nombre_suspender_trabajos_adyacentes,
    pec.nombre_acordonar_area,
    pec.nombre_prueba_gas_toxico_inflamable,
    pec.nombre_porcentaje_lel,
    pec.nombre_nh3,
    pec.nombre_porcentaje_oxigeno,
    pec.nombre_equipo_despresionado_fuera_operacion,
    pec.nombre_equipo_aislado,
    pec.nombre_equipo_lavado,
    pec.nombre_equipo_neutralizado,
    pec.nombre_equipo_vaporizado,
    pec.nombre_aislar_purgas_drenaje_venteo,
    pec.nombre_abrir_registros_necesarios,
    pec.nombre_observaciones_requisitos,
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
    pa.equipo_intervencion,
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
    pa.cantidad_personas_autorizadas,
    pa.trabajadores_aptos_evaluacion,
    pa.requiere_barreras,
    pa.observaciones,
    pa.observaciones_riesgos,
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
    pa.escalera_condicion,
    pa.tipo_escalera,
    pa.cual_acceso,
    pa.cantidad_personas_autorizadas
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
      TO_CHAR(pf.fecha_actualizacion, 'DD/MM/YYYY') AS fecha_actualizacion,
      pf.observaciones_area,
      pf.nombre_equipo_fuera_operacion,
      pf.nombre_equipo_despresionado_purgado,
      pf.nombre_producto_entrampado,
      pf.nombre_equipo_tuberia_fuera_operacion,
      pf.nombre_equipo_tuberia_aislado_junta_ciega,
      pf.nombre_equipo_tuberia_lavado_vaporizado,
      pf.nombre_residuos_interior,
      pf.nombre_prueba_explosividad_interior,
      pf.nombre_prueba_explosividad_exterior,
      pf.nombre_acumulacion_gases_combustion,
      pf.nombre_permisos_trabajos_adicionales,
      pf.nombre_acordonar_area,
      pf.nombre_equipo_contraincendio,
      pf.observaciones_seguridad
        ,pf.cual_permiso
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
        pr.fluido,
        pr.presion,
        pr.temperatura,
        pr.tecnico_radialogo,
        pr.observaciones, -- Nuevo campo agregado
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
    } else if (tipo_permiso === "PT para Izaje con Hiab con Grúa") {
      console.log("Entrando a bloque PT para Izaje con Hiab con Grúa");
      const queryGeneralIzaje = `
        SELECT 
          pt.id_permiso,
          TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
          pt.prefijo,
          tp.nombre AS tipo_permiso,
          pt.contrato,
          pi.empresa,
          s.nombre AS sucursal,
          a.nombre AS area,
          d.nombre AS departamento,
          pi.nombre_solicitante,
          pi.descripcion_trabajo,
          pi.tipo_mantenimiento,
          pi.ot_numero,
          pi.tag,
          TO_CHAR(pi.hora_inicio, 'HH24:MI') AS hora_inicio,
          pi.equipo_intervenir,
          pi.hora_inicio_prevista,
          pi.responsable_operacion,
          pi.hora_fin_prevista,
          pi.empresa_grua,
          pi.identificacion_grua,
          pi.declaracion_conformidad,
          pi.inspeccion_periodica,
          pi.mantenimiento_preventivo,
          pi.inspeccion_diaria,
          pi.diagrama_cargas,
          pi.libro_instrucciones,
          pi.limitador_carga,
          pi.final_carrera,
          pi.nombre_operador,
          pi.empresa_operador,
          pi.licencia_operador,
          pi.numero_licencia,
          TO_CHAR(pi.fecha_emision_licencia, 'DD/MM/YYYY') AS fecha_emision_licencia,
          pi.vigencia_licencia,
          pi.tipo_licencia,
          pi.comentarios_operador,
          pi.estrobos_eslingas,
          pi.grilletes,
          pi.otros_elementos_auxiliares,
          pi.especificacion_otros_elementos,
          pi.requiere_eslingado_especifico,
          pi.especificacion_eslingado,
          pi.extension_gatos,
          pi.sobre_ruedas,
          pi.especificacion_sobre_ruedas,
          pi.utiliza_plumin_si,
          pi.especificacion_plumin,
          pi.longitud_pluma,
          pi.radio_trabajo,
          pi.contrapeso,
          pi.sector_trabajo,
          pi.carga_segura_diagrama,
          pi.peso_carga,
          pi.determinada_por,
          pi.carga_trabajo,
          pi.peso_gancho_eslingas,
          pi.relacion_carga_carga_segura,
          pi.asentamiento,
          pi.calzado,
          pi.extension_gatos_check,
          pi.nivelacion,
          pi.contrapeso_check,
          pi.sector_trabajo_check,
          pi.comprobado_por,
          pi.balizamiento_operacion,
          pi.reunion_previa,
          pi.especificacion_reunion_previa,
          pi.presentacion_supervisor,
          pi.nombre_supervisor,
          pi.permiso_adicional,
          pi.especificacion_permiso_adicional,
          pi.otras_medidas_seguridad,
          pi.especificacion_otras_medidas,
          pi.observaciones_generales
        FROM permisos_trabajo pt
        INNER JOIN pt_izaje pi ON pt.id_permiso = pi.id_permiso
        INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
        INNER JOIN areas a ON pt.id_area = a.id_area
        INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
        INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
        WHERE pt.id_permiso = $1
      `;
      resultGeneral = await pool.query(queryGeneralIzaje, [id]);
      resultDetalles = { rows: [] };
    } else if (tipo_permiso === "PT con Cesta Izada") {
      console.log("Entrando a bloque PT con Cesta Izada");
      const queryGeneralCesta = `
        SELECT 
          pt.id_permiso,
          TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
          pt.prefijo,
          tp.nombre AS tipo_permiso,
          pt.contrato,
          pc.empresa,
          s.nombre AS sucursal,
          a.nombre AS area,
          d.nombre AS departamento,
          pc.nombre_solicitante,
          pc.descripcion_trabajo,
          pc.tipo_mantenimiento,
          pc.ot_numero,
          pc.tag,
          TO_CHAR(pc.hora_inicio, 'HH24:MI') AS hora_inicio,
          pc.equipo_intervenir,
          pc.identificacion_grua_cesta,
          pc.empresa_grua_cesta,
          pc.identificacion_cesta,
          pc.carga_maxima_cesta,
          pc.empresa_cesta,
          pc.peso_cesta,
          TO_CHAR(pc.ultima_revision_cesta, 'DD/MM/YYYY') AS ultima_revision_cesta,
          pc.condicion,
          pc.especificacion_ext_gatos,
          pc.ext_gatos,
          pc.asentamiento,
          pc.calzado,
          pc.nivelacion,
          pc.utiliza_plumin_cesta,
          pc.especificacion_plumin_cesta,
          pc.longitud_pluma_cesta,
          pc.radio_trabajo_cesta,
          pc.carga_segura_cesta,
          pc.peso_carga_cesta,
          pc.peso_gancho_elementos,
          pc.carga_trabajo_cesta,
          pc.relacion_carga_segura_cesta,
          pc.carga_prueba,
          pc.prueba_realizada,
          pc.prueba_presenciada_por,
          pc.firma_prueba,
          TO_CHAR(pc.fecha_prueba, 'DD/MM/YYYY') AS fecha_prueba,
          pc.mascaras_escape_cesta,
          pc.especificacion_mascaras,
          pc.equipo_proteccion_cesta,
          pc.especificacion_equipo_proteccion,
          pc.equipo_contra_incendios_cesta,
          pc.especificacion_equipo_incendios,
          pc.final_carrera_cesta,
          pc.otras_medidas_cesta,
          pc.especificacion_otras_medidas_cesta,
          pc.observaciones_generales_cesta
        FROM permisos_trabajo pt
        INNER JOIN pt_cesta pc ON pt.id_permiso = pc.id_permiso
        INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
        INNER JOIN areas a ON pt.id_area = a.id_area
        INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
        INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
        WHERE pt.id_permiso = $1
      `;
      resultGeneral = await pool.query(queryGeneralCesta, [id]);
      resultDetalles = { rows: [] };
    } else if (tipo_permiso === "PT de Excavacion") {
      console.log("Entrando a bloque PT de Excavacion");
      const queryGeneralExcavacion = `
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
          pe.nombre_solicitante,
          pe.descripcion_trabajo,
          pe.tipo_mantenimiento,
          pe.ot_numero,
          pe.tag,
          TO_CHAR(pe.hora_inicio, 'HH24:MI') AS hora_inicio,
          pe.equipo_intervenir,
          pe.profundidad_media,
          pe.profundidad_maxima,
          pe.anchura,
          pe.longitud,
          pe.tipo_terreno,
          pe.tuberia_gas,
          pe.tipo_gas,
          pe.comprobado_gas,
          TO_CHAR(pe.fecha_gas, 'DD/MM/YYYY') AS fecha_gas,
          pe.linea_electrica,
          pe.voltaje_linea,
          pe.comprobado_electrica,
          TO_CHAR(pe.fecha_electrica, 'DD/MM/YYYY') AS fecha_electrica,
          pe.tuberia_incendios,
          pe.presion_incendios,
          pe.comprobado_incendios,
          TO_CHAR(pe.fecha_incendios, 'DD/MM/YYYY') AS fecha_incendios,
          pe.alcantarillado,
          pe.diametro_alcantarillado,
          pe.comprobado_alcantarillado,
          TO_CHAR(pe.fecha_alcantarillado, 'DD/MM/YYYY') AS fecha_alcantarillado,
          pe.otras_instalaciones,
          pe.especificacion_otras_instalaciones,
          pe.comprobado_otras,
          TO_CHAR(pe.fecha_otras, 'DD/MM/YYYY') AS fecha_otras,
          pe.requiere_talud,
          pe.angulo_talud,
          pe.requiere_bermas,
          pe.longitud_meseta,
          pe.altura_contrameseta,
          pe.requiere_entibacion,
          pe.tipo_entibacion,
          pe.condiciones_terreno_entibacion,
          pe.otros_requerimientos,
          pe.especificacion_otros_requerimientos,
          pe.distancia_seguridad_estatica,
          pe.distancia_seguridad_dinamica,
          pe.requiere_balizamiento,
          pe.distancia_balizamiento,
          pe.requiere_proteccion_rigida,
          pe.distancia_proteccion_rigida,
          pe.requiere_senalizacion_especial,
          pe.especificacion_senalizacion,
          pe.requiere_proteccion_anticaida,
          pe.tipo_proteccion_anticaida,
          pe.tipo_anclaje,
          pe.excavacion_espacio_confinado,
          pe.numero_permiso_confinado,
          pe.excavacion_manual_aproximacion,
          pe.medidas_aproximacion,
          pe.herramienta_antichispa,
          pe.guantes_calzado_dielectrico,
          pe.epp_especial,
          pe.otras_medidas_especiales,
          pe.especificacion_otras_medidas_especiales,
          pe.aplicar_bloqueo_fisico,
          pe.especificacion_bloqueo_fisico,
          pe.drenar_limpiar_lavar,
          pe.inundar_anegar_atmosfera_inerte,
          pe.vigilante_continuo,
          pe.especificacion_vigilante_continuo,
          pe.otras_medidas_adicionales,
          pe.especificacion_otras_medidas_adicionales,
          pe.observaciones_generales_excavacion
        FROM permisos_trabajo pt
        INNER JOIN pt_excavacion pe ON pt.id_permiso = pe.id_permiso
        INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
        INNER JOIN areas a ON pt.id_area = a.id_area
        INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
        INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
        WHERE pt.id_permiso = $1
      `;
      resultGeneral = await pool.query(queryGeneralExcavacion, [id]);
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
