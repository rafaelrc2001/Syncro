const express = require("express");
const router = express.Router();
const pool = require("../database");

// Crear nuevo registro de cesta
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const result = await pool.query(
      `
			INSERT INTO pt_cesta (
				id_permiso, tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir, descripcion_trabajo, nombre_solicitante, empresa,
				identificacion_grua_cesta, empresa_grua_cesta, identificacion_cesta, carga_maxima_cesta, empresa_cesta, peso_cesta, ultima_revision_cesta,
				condicion, especificacion_ext_gatos, utiliza_plumin_cesta, especificacion_plumin_cesta, longitud_pluma_cesta, radio_trabajo_cesta, carga_segura_cesta,
				peso_carga_cesta, peso_gancho_elementos, carga_trabajo_cesta, relacion_carga_segura_cesta,
				carga_prueba, prueba_realizada, prueba_presenciada_por, firma_prueba, fecha_prueba,
				mascaras_escape_cesta, especificacion_mascaras, equipo_proteccion_cesta, especificacion_equipo_proteccion, equipo_contra_incendios_cesta, especificacion_equipo_incendios, final_carrera_cesta, otras_medidas_cesta, especificacion_otras_medidas_cesta, observaciones_generales_cesta
			) VALUES (
				$1,$2,$3,$4,$5,$6,$7,$8,$9,
				$10,$11,$12,$13,$14,$15,$16,
				$17,$18,$19,$20,$21,$22,$23,
				$24,$25,$26,$27,
				$28,$29,$30,$31,$32,
				$33,$34,$35,$36,$37,$38,$39,$40,$41,$42
			) RETURNING id
		`,
      [
        data.id_permiso,
        data.tipo_mantenimiento,
        data.ot_numero,
        data.tag,
        data.hora_inicio,
        data.equipo_intervenir,
        data.descripcion_trabajo,
        data.nombre_solicitante,
        data.empresa,
        data.identificacion_grua_cesta,
        data.empresa_grua_cesta,
        data.identificacion_cesta,
        data.carga_maxima_cesta,
        data.empresa_cesta,
        data.peso_cesta,
        data.ultima_revision_cesta,
        data.condicion,
        data.especificacion_ext_gatos,
        data.utiliza_plumin_cesta,
        data.especificacion_plumin_cesta,
        data.longitud_pluma_cesta,
        data.radio_trabajo_cesta,
        data.carga_segura_cesta,
        data.peso_carga_cesta,
        data.peso_gancho_elementos,
        data.carga_trabajo_cesta,
        data.relacion_carga_segura_cesta,
        data.carga_prueba,
        data.prueba_realizada,
        data.prueba_presenciada_por,
        data.firma_prueba,
        data.fecha_prueba,
        data.mascaras_escape_cesta,
        data.especificacion_mascaras,
        data.equipo_proteccion_cesta,
        data.especificacion_equipo_proteccion,
        data.equipo_contra_incendios_cesta,
        data.especificacion_equipo_incendios,
        data.final_carrera_cesta,
        data.otras_medidas_cesta,
        data.especificacion_otras_medidas_cesta,
        data.observaciones_generales_cesta,
      ]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el permiso de cesta" });
  }
});

module.exports = router;
