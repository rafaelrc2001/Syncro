
const express = require("express");
const router = express.Router();
const pool = require("./database");
// Endpoint para exportar datos detallados para supervisores
router.get("/exportar-supervisor", async (req, res) => {
  try {
    // Consulta SQL base
    let sql = `
SELECT 
    pt.id_permiso,
    pt.fecha_hora,
    pt.id_area,
    d.nombre AS id_departamento,
    s.nombre AS id_sucursal,
    pt.prefijo,
    pt.contrato,
    u.nombre AS id_usuario,
    e.id_estatus,
    e.estatus,
    e.comentarios,
    e.subestatus,
    e.id_permiso AS estatus_id_permiso,
    pt.tipo_mantenimiento,
    pt.ot_numero,
    pt.tag,
    pt.hora_inicio,
    pt.equipo_intervenir,
    pt.descripcion_trabajo,
    pt.nombre_solicitante,
    pt.empresa,
    pt.pal_epp_1,
    pt.pal_epp_2,
    pt.pal_fa_1,
    pt.pal_fa_2,
    pt.pal_epc_1,
    pt.pal_epc_2,
    pt.pal_cr_1,
    pt.pco_eh_1,
    pt.pco_ma_1,
    pt.pco_ma_2,
    pt.pco_ma_3,
    pt.pco_ma_4,
    pt.pco_ma_5,
    pt.pco_era_1,
    pt.pfg_cr_1,
    pt.pfg_cr_1a,
    pt.pfg_eppe_1,
    pt.pfg_eppe_2,
    pt.pfg_ma_1,
    pt.pfg_ma_2,
    pt.pfg_ma_3,
    pt.pap_ce_1,
    pt.pap_ce_2,
    pt.pap_epe_1,
    pt.nombre_departamento,
    pt.columna_fuego_valor,
    pt.columna_altura_valor,
    pt.columna_apertura_valor,
    pt.columna_confinado_valor,
    pt.pno_cr_1,
    pt.pno_cr_2,
    pt.pno_cr_3,
    pt.pno_cr_4,
    pt.pno_cr_5,
    pt.pno_cr_6,
    pt.pno_cr_7,
    pt.pno_cr_8,
    pt.pno_cr_9,
    pt.pno_cr_10,
    pt.pno_cr_11,
    pt.pno_cr_12,
    pt.pno_cr_13,
    pt.pno_epe_1,
    pt.pno_epe_2,
    pt.pno_epe_3,
    pt.pno_epe_4,
    pt.pno_epe_5,
    pt.pno_epe_6,
    pt.pno_epe_7,
    pt.pno_epe_8,
    pt.pno_epe_9,
    pt.columna_nopeligrosovalor_valor,
    pt.firma_creacion,
    pt.ip_creacion,
    pt.dispositivo_creacion,
    pt.localizacion_creacion,
    pt.temp_fuego,
    pt.fluido_fuego,
    pt.presion_fuego,
    pt.temp_apertura,
    pt.fluido_apertura,
    pt.presion_apertura,
    pt.temp_confinado,
    pt.fluido_confinado,
    pt.presion_confinado,
    pt.temp_no_peligroso,
    pt.fluido_no_peligroso,
    pt.presion_no_peligroso
FROM permisos_trabajo pt
LEFT JOIN departamentos d ON pt.id_departamento = d.id_departamento
LEFT JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
LEFT JOIN usuarios u ON pt.id_usuario = u.id_usuario
LEFT JOIN estatus e ON pt.id_permiso = e.id_permiso
ORDER BY pt.id_permiso;
    `;

    // Ejecutar la consulta y obtener los resultados
    const result = await pool.query(sql);

    // Debug opcional
    if (process.env.EXPORT_DEBUG === "1") {
      console.log(`exportar-supervisor: returned ${result.rows.length} rows`);
      if (result.rows.length > 0) {
        console.log(
          "exportar-supervisor: sample columns=",
          Object.keys(result.rows[0])
        );
      }
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error en exportar-supervisor:", error);
    res.status(500).json({ error: "Error al exportar datos para supervisor" });
  }
});

module.exports = router;



// Endpoint para exportar datos detallados filtrados por departamento (autorizar)
router.get("/exportar-autorizar-departamento/:id_departamento", async (req, res) => {
  try {
    const { id_departamento } = req.params;
    const params = [];

    // Validar que el parámetro sea un número
    const idDeptoInt = parseInt(id_departamento, 10);
    if (isNaN(idDeptoInt)) {
      return res.status(400).json({ error: "id_departamento debe ser un número válido" });
    }

    let sql = `
  SELECT 
    pt.id_permiso,
    pt.fecha_hora,
    pt.id_area,
    d.nombre AS id_departamento,
    s.nombre AS id_sucursal,
    pt.prefijo,
    pt.contrato,
    u_creador.nombre AS id_usuario,
    e.id_estatus,
    e.estatus,
    e.comentarios,
    e.subestatus,
    e.id_permiso AS estatus_id_permiso,
    pt.tipo_mantenimiento,
    pt.ot_numero,
    pt.tag,
    pt.hora_inicio,
    pt.equipo_intervenir,
    pt.descripcion_trabajo,
    pt.nombre_solicitante,
    pt.empresa,
    pt.pal_epp_1,
    pt.pal_epp_2,
    pt.pal_fa_1,
    pt.pal_fa_2,
    pt.pal_epc_1,
    pt.pal_epc_2,
    pt.pal_cr_1,
    pt.pco_eh_1,
    pt.pco_ma_1,
    pt.pco_ma_2,
    pt.pco_ma_3,
    pt.pco_ma_4,
    pt.pco_ma_5,
    pt.pco_era_1,
    pt.pfg_cr_1,
    pt.pfg_cr_1a,
    pt.pfg_eppe_1,
    pt.pfg_eppe_2,
    pt.pfg_ma_1,
    pt.pfg_ma_2,
    pt.pfg_ma_3,
    pt.pap_ce_1,
    pt.pap_ce_2,
    pt.pap_epe_1,
    pt.nombre_departamento,
    pt.columna_fuego_valor,
    pt.columna_altura_valor,
    pt.columna_apertura_valor,
    pt.columna_confinado_valor,
    pt.pno_cr_1,
    pt.pno_cr_2,
    pt.pno_cr_3,
    pt.pno_cr_4,
    pt.pno_cr_5,
    pt.pno_cr_6,
    pt.pno_cr_7,
    pt.pno_cr_8,
    pt.pno_cr_9,
    pt.pno_cr_10,
    pt.pno_cr_11,
    pt.pno_cr_12,
    pt.pno_cr_13,
    pt.pno_epe_1,
    pt.pno_epe_2,
    pt.pno_epe_3,
    pt.pno_epe_4,
    pt.pno_epe_5,
    pt.pno_epe_6,
    pt.pno_epe_7,
    pt.pno_epe_8,
    pt.pno_epe_9,
    pt.columna_nopeligrosovalor_valor,
    pt.firma_creacion,
    pt.ip_creacion,
    pt.dispositivo_creacion,
    pt.localizacion_creacion,
    pt.temp_fuego,
    pt.fluido_fuego,
    pt.presion_fuego,
    pt.temp_apertura,
    pt.fluido_apertura,
    pt.presion_apertura,
    pt.temp_confinado,
    pt.fluido_confinado,
    pt.presion_confinado,
    pt.temp_no_peligroso,
    pt.fluido_no_peligroso,
    pt.presion_no_peligroso
  FROM permisos_trabajo pt
  LEFT JOIN departamentos d ON pt.id_departamento = d.id_departamento
  LEFT JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
  LEFT JOIN usuarios u_creador ON pt.id_usuario = u_creador.id_usuario
  LEFT JOIN estatus e ON pt.id_permiso = e.id_permiso
  WHERE pt.id_departamento = $1
  ORDER BY pt.fecha_hora DESC, pt.id_permiso;
    `;

    params.push(idDeptoInt);
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en exportar-autorizar:", error);
    res.status(500).json({ error: "Error al exportar datos para autorizar" });
  }
});




// Endpoint para exportar datos detallados filtrados por departamento (autorizar)
router.get("/exportar-crear-usuario/:id_usuario", async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const params = [];

    // Validar que el parámetro sea un número
    const idUsuarioInt = parseInt(id_usuario, 10);
    if (isNaN(idUsuarioInt)) {
      return res.status(400).json({ error: "id_usuario debe ser un número válido" });
    }

    let sql = `
SELECT 
    pt.id_permiso,
    pt.fecha_hora,
    pt.id_area,
    d.nombre AS id_departamento,
    s.nombre AS id_sucursal,
    pt.prefijo,
    pt.contrato,
    u.nombre AS id_usuario,
    e.id_estatus,
    e.estatus,
    e.comentarios,
    e.subestatus,
    e.id_permiso AS estatus_id_permiso,
    pt.tipo_mantenimiento,
    pt.ot_numero,
    pt.tag,
    pt.hora_inicio,
    pt.equipo_intervenir,
    pt.descripcion_trabajo,
    pt.nombre_solicitante,
    pt.empresa,
    pt.pal_epp_1,
    pt.pal_epp_2,
    pt.pal_fa_1,
    pt.pal_fa_2,
    pt.pal_epc_1,
    pt.pal_epc_2,
    pt.pal_cr_1,
    pt.pco_eh_1,
    pt.pco_ma_1,
    pt.pco_ma_2,
    pt.pco_ma_3,
    pt.pco_ma_4,
    pt.pco_ma_5,
    pt.pco_era_1,
    pt.pfg_cr_1,
    pt.pfg_cr_1a,
    pt.pfg_eppe_1,
    pt.pfg_eppe_2,
    pt.pfg_ma_1,
    pt.pfg_ma_2,
    pt.pfg_ma_3,
    pt.pap_ce_1,
    pt.pap_ce_2,
    pt.pap_epe_1,
    pt.nombre_departamento,
    pt.columna_fuego_valor,
    pt.columna_altura_valor,
    pt.columna_apertura_valor,
    pt.columna_confinado_valor,
    pt.pno_cr_1,
    pt.pno_cr_2,
    pt.pno_cr_3,
    pt.pno_cr_4,
    pt.pno_cr_5,
    pt.pno_cr_6,
    pt.pno_cr_7,
    pt.pno_cr_8,
    pt.pno_cr_9,
    pt.pno_cr_10,
    pt.pno_cr_11,
    pt.pno_cr_12,
    pt.pno_cr_13,
    pt.pno_epe_1,
    pt.pno_epe_2,
    pt.pno_epe_3,
    pt.pno_epe_4,
    pt.pno_epe_5,
    pt.pno_epe_6,
    pt.pno_epe_7,
    pt.pno_epe_8,
    pt.pno_epe_9,
    pt.columna_nopeligrosovalor_valor,
    pt.firma_creacion,
    pt.ip_creacion,
    pt.dispositivo_creacion,
    pt.localizacion_creacion,
    pt.temp_fuego,
    pt.fluido_fuego,
    pt.presion_fuego,
    pt.temp_apertura,
    pt.fluido_apertura,
    pt.presion_apertura,
    pt.temp_confinado,
    pt.fluido_confinado,
    pt.presion_confinado,
    pt.temp_no_peligroso,
    pt.fluido_no_peligroso,
    pt.presion_no_peligroso
FROM permisos_trabajo pt
LEFT JOIN departamentos d ON pt.id_departamento = d.id_departamento
LEFT JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
LEFT JOIN usuarios u ON pt.id_usuario = u.id_usuario
LEFT JOIN estatus e ON pt.id_permiso = e.id_permiso
WHERE pt.id_usuario = $1
ORDER BY pt.fecha_hora DESC;
    `;

    params.push(idUsuarioInt);
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en exportar-crear-usuario:", error);
    res.status(500).json({ error: "Error al exportar datos para crear" });
  }
});



// Endpoint alternativo para exportar datos detallados filtrados por departamento (autorizar) con ruta /exportar-autorizar/:id_departamento
router.get("/exportar-autorizar/:id_departamento", async (req, res) => {
  try {
    const { id_departamento } = req.params;
    const params = [];

    // Validar que el parámetro sea un número
    const idDeptoInt = parseInt(id_departamento, 10);
    if (isNaN(idDeptoInt)) {
      return res.status(400).json({ error: "id_departamento debe ser un número válido" });
    }

    let sql = `
  
SELECT 
    pt.id_permiso,
    pt.fecha_hora,
    pt.id_area,
    -- Nombre del departamento
    d.nombre AS id_departamento,
    -- Nombre de la sucursal
    s.nombre AS id_sucursal,
    pt.prefijo,
    pt.contrato,
    -- Nombre del usuario (el que creó el permiso)
    u_creador.nombre AS id_usuario,
    -- TODAS LAS COLUMNAS DE ESTATUS
    e.id_estatus,
    e.estatus,
    e.comentarios,
    e.subestatus,
    e.id_permiso AS estatus_id_permiso,
    -- Continúan las columnas de permisos_trabajo
    pt.tipo_mantenimiento,
    pt.ot_numero,
    pt.tag,
    pt.hora_inicio,
    pt.equipo_intervenir,
    pt.descripcion_trabajo,
    pt.nombre_solicitante,
    pt.empresa,
    pt.pal_epp_1,
    pt.pal_epp_2,
    pt.pal_fa_1,
    pt.pal_fa_2,
    pt.pal_epc_1,
    pt.pal_epc_2,
    pt.pal_cr_1,
    pt.pco_eh_1,
    pt.pco_ma_1,
    pt.pco_ma_2,
    pt.pco_ma_3,
    pt.pco_ma_4,
    pt.pco_ma_5,
    pt.pco_era_1,
    pt.pfg_cr_1,
    pt.pfg_cr_1a,
    pt.pfg_eppe_1,
    pt.pfg_eppe_2,
    pt.pfg_ma_1,
    pt.pfg_ma_2,
    pt.pfg_ma_3,
    pt.pap_ce_1,
    pt.pap_ce_2,
    pt.pap_epe_1,
    pt.nombre_departamento,
    pt.columna_fuego_valor,
    pt.columna_altura_valor,
    pt.columna_apertura_valor,
    pt.columna_confinado_valor,
    pt.pno_cr_1,
    pt.pno_cr_2,
    pt.pno_cr_3,
    pt.pno_cr_4,
    pt.pno_cr_5,
    pt.pno_cr_6,
    pt.pno_cr_7,
    pt.pno_cr_8,
    pt.pno_cr_9,
    pt.pno_cr_10,
    pt.pno_cr_11,
    pt.pno_cr_12,
    pt.pno_cr_13,
    pt.pno_epe_1,
    pt.pno_epe_2,
    pt.pno_epe_3,
    pt.pno_epe_4,
    pt.pno_epe_5,
    pt.pno_epe_6,
    pt.pno_epe_7,
    pt.pno_epe_8,
    pt.pno_epe_9,
    pt.columna_nopeligrosovalor_valor,
    pt.firma_creacion,
    pt.ip_creacion,
    pt.dispositivo_creacion,
    pt.localizacion_creacion,
    pt.temp_fuego,
    pt.fluido_fuego,
    pt.presion_fuego,
    pt.temp_apertura,
    pt.fluido_apertura,
    pt.presion_apertura,
    pt.temp_confinado,
    pt.fluido_confinado,
    pt.presion_confinado,
    pt.temp_no_peligroso,
    pt.fluido_no_peligroso,
    pt.presion_no_peligroso
FROM usuarios u_filtro
INNER JOIN departamentos d_filtro ON u_filtro.departamento = d_filtro.nombre  
INNER JOIN permisos_trabajo pt ON d_filtro.id_departamento = pt.id_departamento
LEFT JOIN departamentos d ON pt.id_departamento = d.id_departamento
LEFT JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
LEFT JOIN usuarios u_creador ON pt.id_usuario = u_creador.id_usuario
LEFT JOIN estatus e ON pt.id_permiso = e.id_permiso
WHERE u_filtro.id_usuario = $1 
ORDER BY pt.fecha_hora DESC, pt.id_permiso;

    `;

    params.push(idDeptoInt);
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en exportar-autorizar (api):", error);
    res.status(500).json({ error: "Error al exportar datos para autorizar (api)" });
  }
});