const express = require('express');
const router = express.Router();
const pool = require('./database');

// Endpoint para obtener la información general de un permiso por id (solo permisos_trabajo)
router.get('/verformularios', async (req, res) => {
    try {
        const id = parseInt(req.query.id, 10);
        if (!id) return res.status(400).json({ error: 'Falta el parámetro id' });
        
        const tipoQuery = `
            SELECT tp.nombre AS tipo_permiso
            FROM permisos_trabajo pt
            INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
            WHERE pt.id_permiso = $1
        `;
        const tipoResult = await pool.query(tipoQuery, [id]);
        console.log('Tipo de permiso encontrado:', tipoResult.rows[0]);
        const tipo_permiso = tipoResult.rows[0]?.tipo_permiso;

        let resultGeneral, resultDetalles;
        // Consulta dinámica según el tipo
        if (tipo_permiso === 'PT No Peligroso') {
            console.log('Entrando a bloque PT No Peligroso');
            // Consulta para pt_no_peligroso
            const queryGeneralNoPeligroso = `
                SELECT 
                    pt.id_permiso,
                    TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
                    pt.prefijo,
                    tp.nombre AS tipo_permiso,
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
        } else if (tipo_permiso === 'PT para Apertura Equipo Línea') {
            console.log('Entrando a bloque PT para Apertura Equipo Línea');
            // Consulta correcta para pt_apertura
            const queryGeneralApertura = `
                SELECT 
                    pt.id_permiso,
                    TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
                    pt.prefijo,
                    tp.nombre AS tipo_permiso,
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
                    pa.lel_nivel
                FROM permisos_trabajo pt
                INNER JOIN pt_apertura pa ON pt.id_permiso = pa.id_permiso
                INNER JOIN sucursales s ON pt.id_sucursal = s.id_sucursal
                INNER JOIN areas a ON pt.id_area = a.id_area
                INNER JOIN departamentos d ON pt.id_departamento = d.id_departamento
                INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
                WHERE pt.id_permiso = $1
            `;
            resultGeneral = await pool.query(queryGeneralApertura, [id]);
            console.log('Resultado general apertura:', resultGeneral.rows);

            resultDetalles = { rows: [] }; // Si no tienes detalles separados, puedes dejarlo vacío.
        } else {
            console.log('Tipo de permiso no soportado:', tipo_permiso);
            return res.status(400).json({ error: 'Tipo de permiso no soportado' });
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
        const queryEstatus = 'SELECT id_estatus FROM permisos_trabajo WHERE id_permiso = $1';
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
            const resultParticipantes = await pool.query(queryParticipantesAST, [id_estatus]);
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
            responsables_area: resultResponsables.rows[0] || {}
        });
    } catch (error) {
        console.error('Error en la consulta de permisos:', error);
        res.status(500).json({ error: 'Error en la consulta de permisos' });
    }
});










module.exports = router;