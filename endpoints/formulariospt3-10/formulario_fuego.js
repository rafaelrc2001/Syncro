const express = require("express");
const router = express.Router();
const db = require("../../endpoints/database");

// Endpoint para insertar un nuevo permiso de fuego abierto
router.post("/pt-fuego", async (req, res) => {
  const {
    id_permiso,
    tipo_mantenimiento,
    tipo_mantenimiento_otro,
    ot_numero,
    tag,
    hora_inicio,
    equipo_intervenir,
    empresa,
    descripcion_trabajo,
    nombre_solicitante, // <-- NUEVO
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO pt_fuego (
        id_permiso,
        tipo_mantenimiento,
        tipo_mantenimiento_otro,
        ot_numero,
        tag,
        hora_inicio,
        equipo_intervenir,
        empresa,
        descripcion_trabajo,
        nombre_solicitante -- <-- NUEVO
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        id_permiso,
        tipo_mantenimiento,
        tipo_mantenimiento_otro,
        ot_numero,
        tag,
        hora_inicio,
        equipo_intervenir,
        empresa,
        descripcion_trabajo,
        nombre_solicitante, // <-- NUEVO
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error al insertar en pt_fuego:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint para consultar permiso de fuego abierto por id
router.get("/pt-fuego/:id", async (req, res) => {
  const id_permiso = req.params.id;
  try {
    const result = await db.query(
      `SELECT * FROM pt_fuego WHERE id_permiso = $1 LIMIT 1`,
      [id_permiso]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró apertura para este permiso (fuego)",
      });
    }
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error al consultar apertura de PT Fuego:", err);
    res.status(500).json({
      success: false,
      error: "Error al consultar apertura de PT Fuego",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Endpoint para actualizar requisitos del área en permiso de fuego
router.put("/pt-fuego/requisitos_area/:id", async (req, res) => {
  const id_permiso = req.params.id;
  const {
    fuera_operacion,
    despresurizado_purgado,
    producto_entrampado,
    necesita_aislamiento,
    con_valvulas,
    con_juntas_ciegas,
    requiere_lavado,
    requiere_neutralizado,
    requiere_vaporizado,
    suspender_trabajos_adyacentes,
    acordonar_area,
    prueba_gas_toxico_inflamable,
    equipo_electrico_desenergizado,
    tapar_purgas_drenajes,
    // Medidas/requisitos del ejecutor
    ventilacion_forzada,
    limpieza_interior,
    instalo_ventilacion_forzada,
    equipo_conectado_tierra,
    cables_pasan_drenajes,
    cables_uniones_intermedias,
    equipo_proteccion_personal,
    // Condiciones del proceso
    fluido,
    presion,
    temperatura,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE pt_fuego SET 
        fuera_operacion = $1,
        despresurizado_purgado = $2,
        producto_entrampado = $3,
        necesita_aislamiento = $4,
        con_valvulas = $5,
        con_juntas_ciegas = $6,
        requiere_lavado = $7,
        requiere_neutralizado = $8,
        requiere_vaporizado = $9,
        suspender_trabajos_adyacentes = $10,
        acordonar_area = $11,
        prueba_gas_toxico_inflamable = $12,
        equipo_electrico_desenergizado = $13,
        tapar_purgas_drenajes = $14,
        ventilacion_forzada = $15,
        limpieza_interior = $16,
        instalo_ventilacion_forzada = $17,
        equipo_conectado_tierra = $18,
        cables_pasan_drenajes = $19,
        cables_uniones_intermedias = $20,
        equipo_proteccion_personal = $21,
        fluido = $22,
        presion = $23,
        temperatura = $24
      WHERE id_permiso = $25
      RETURNING *`,
      [
        fuera_operacion,
        despresurizado_purgado,
        producto_entrampado,
        necesita_aislamiento,
        con_valvulas,
        con_juntas_ciegas,
        requiere_lavado,
        requiere_neutralizado,
        requiere_vaporizado,
        suspender_trabajos_adyacentes,
        acordonar_area,
        prueba_gas_toxico_inflamable,
        equipo_electrico_desenergizado,
        tapar_purgas_drenajes,
        ventilacion_forzada,
        limpieza_interior,
        instalo_ventilacion_forzada,
        equipo_conectado_tierra,
        cables_pasan_drenajes,
        cables_uniones_intermedias,
        equipo_proteccion_personal,
        fluido,
        presion,
        temperatura,
        id_permiso,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el permiso de fuego para actualizar",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Requisitos del área actualizados correctamente",
    });
  } catch (error) {
    console.error(
      "Error al actualizar requisitos del área en pt_fuego:",
      error
    );
    res.status(500).json({
      success: false,
      error: "Error al actualizar requisitos del área",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Endpoint para actualizar requisitos del supervisor en permiso de fuego
router.put("/fuego/requisitos_supervisor/:id_permiso", async (req, res) => {
  const id_permiso = req.params.id_permiso;
  const {
    // Campos existentes
    ventilacion_forzada,
    limpieza_interior,
    instalo_ventilacion_forzada,
    equipo_conectado_tierra,
    cables_pasan_drenajes,
    cables_uniones_intermedias,
    equipo_proteccion_personal,

    // Nuevos campos - Verificación para administrar los riesgos
    explosividad_interior,
    explosividad_exterior,
    vigia_contraincendio,
    manguera_contraincendio,
    cortina_agua,
    extintor_contraincendio,
    cubrieron_drenajes,

    // Nuevos campos - Prueba de gas
    co2,
    amoniaco,
    oxigeno,
    explosividad_lel,
    otro_gas_cual,
    observaciones_gas,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE pt_fuego SET 
        ventilacion_forzada = $1,
        limpieza_interior = $2,
        instalo_ventilacion_forzada = $3,
        equipo_conectado_tierra = $4,
        cables_pasan_drenajes = $5,
        cables_uniones_intermedias = $6,
        equipo_proteccion_personal = $7,
        explosividad_interior = $8,
        explosividad_exterior = $9,
        vigia_contraincendio = $10,
        manguera_contraincendio = $11,
        cortina_agua = $12,
        extintor_contraincendio = $13,
        cubrieron_drenajes = $14,
        co2 = $15,
        amoniaco = $16,
        oxigeno = $17,
        explosividad_lel = $18,
        otro_gas_cual = $19,
        observaciones_gas = $20
      WHERE id_permiso = $21
      RETURNING *`,
      [
        ventilacion_forzada,
        limpieza_interior,
        instalo_ventilacion_forzada,
        equipo_conectado_tierra,
        cables_pasan_drenajes,
        cables_uniones_intermedias,
        equipo_proteccion_personal,
        explosividad_interior,
        explosividad_exterior,
        vigia_contraincendio,
        manguera_contraincendio,
        cortina_agua,
        extintor_contraincendio,
        cubrieron_drenajes,
        co2,
        amoniaco,
        oxigeno,
        explosividad_lel,
        otro_gas_cual,
        observaciones_gas,
        id_permiso,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el permiso de fuego para actualizar",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Requisitos del supervisor actualizados correctamente",
    });
  } catch (error) {
    console.error(
      "Error al actualizar requisitos del supervisor en pt_fuego:",
      error
    );
    res.status(500).json({
      success: false,
      error: "Error al actualizar requisitos del supervisor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
