const express = require("express");
const router = express.Router();
const pool = require("../database");

// Crear nuevo registro de excavación
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const result = await pool.query(
      `
			INSERT INTO pt_excavacion (
				id_permiso, tipo_mantenimiento, ot_numero, tag, hora_inicio, equipo_intervenir, descripcion_trabajo, nombre_solicitante, empresa,
				profundidad_media, profundidad_maxima, anchura, longitud, tipo_terreno,
				tuberia_gas, tipo_gas, comprobado_gas, fecha_gas,
				linea_electrica, voltaje_linea, comprobado_electrica, fecha_electrica,
				tuberia_incendios, presion_incendios, comprobado_incendios, fecha_incendios,
				alcantarillado, diametro_alcantarillado, comprobado_alcantarillado, fecha_alcantarillado,
				otras_instalaciones, especificacion_otras_instalaciones, comprobado_otras, fecha_otras,
				requiere_talud, angulo_talud,
				requiere_bermas, longitud_meseta, altura_contrameseta,
				requiere_entibacion, tipo_entibacion, condiciones_terreno_entibacion,
				otros_requerimientos, especificacion_otros_requerimientos,
				distancia_seguridad_estatica, distancia_seguridad_dinamica,
				requiere_balizamiento, distancia_balizamiento,
				requiere_proteccion_rigida, distancia_proteccion_rigida,
				requiere_senalizacion_especial, especificacion_senalizacion,
				requiere_proteccion_anticaida, tipo_proteccion_anticaida, tipo_anclaje,
				excavacion_espacio_confinado,
				excavacion_manual_aproximacion, medidas_aproximacion,
				herramienta_antichispa, guantes_calzado_dielectrico, epp_especial, otras_medidas_especiales, especificacion_otras_medidas_especiales,
				aplicar_bloqueo_fisico, especificacion_bloqueo_fisico, drenar_limpiar_lavar, inundar_anegar_atmosfera_inerte, vigilante_continuo, especificacion_vigilante_continuo, otras_medidas_adicionales, especificacion_otras_medidas_adicionales, observaciones_generales_excavacion
			) VALUES (
				$1,$2,$3,$4,$5,$6,$7,$8,$9,
				$10,$11,$12,$13,$14,
				$15,$16,$17,$18,
				$19,$20,$21,$22,
				$23,$24,$25,$26,
				$27,$28,$29,$30,
				$31,$32,
				$33,$34,$35,
				$36,$37,$38,
				$39,$40,
				$41,$42,
				$43,$44,
				$45,$46,
				$47,$48,$49,
				$50,$51,
				$52,$53,$54,$55,$56,
				$57,$58,$59,$60,$61,$62,$63,$64,$65
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
        data.profundidad_media,
        data.profundidad_maxima,
        data.anchura,
        data.longitud,
        data.tipo_terreno,
        data.tuberia_gas,
        data.tipo_gas,
        data.comprobado_gas,
        data.fecha_gas,
        data.linea_electrica,
        data.voltaje_linea,
        data.comprobado_electrica,
        data.fecha_electrica,
        data.tuberia_incendios,
        data.presion_incendios,
        data.comprobado_incendios,
        data.fecha_incendios,
        data.alcantarillado,
        data.diametro_alcantarillado,
        data.comprobado_alcantarillado,
        data.fecha_alcantarillado,
        data.otras_instalaciones,
        data.especificacion_otras_instalaciones,
        data.comprobado_otras,
        data.fecha_otras,
        data.requiere_talud,
        data.angulo_talud,
        data.requiere_bermas,
        data.longitud_meseta,
        data.altura_contrameseta,
        data.requiere_entibacion,
        data.tipo_entibacion,
        data.condiciones_terreno_entibacion,
        data.otros_requerimientos,
        data.especificacion_otros_requerimientos,
        data.distancia_seguridad_estatica,
        data.distancia_seguridad_dinamica,
        data.requiere_balizamiento,
        data.distancia_balizamiento,
        data.requiere_proteccion_rigida,
        data.distancia_proteccion_rigida,
        data.requiere_senalizacion_especial,
        data.especificacion_senalizacion,
        data.requiere_proteccion_anticaida,
        data.tipo_proteccion_anticaida,
        data.tipo_anclaje,
        data.excavacion_espacio_confinado,
        data.excavacion_manual_aproximacion,
        data.medidas_aproximacion,
        data.herramienta_antichispa,
        data.guantes_calzado_dielectrico,
        data.epp_especial,
        data.otras_medidas_especiales,
        data.especificacion_otras_medidas_especiales,
        data.aplicar_bloqueo_fisico,
        data.especificacion_bloqueo_fisico,
        data.drenar_limpiar_lavar,
        data.inundar_anegar_atmosfera_inerte,
        data.vigilante_continuo,
        data.especificacion_vigilante_continuo,
        data.otras_medidas_adicionales,
        data.especificacion_otras_medidas_adicionales,
        data.observaciones_generales_excavacion,
      ]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al guardar el permiso de excavación" });
  }
});

module.exports = router;
