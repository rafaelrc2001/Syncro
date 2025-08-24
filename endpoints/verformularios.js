const express = require('express');
const router = express.Router();
const pool = require('./database');

// Endpoint para obtener la información general de un permiso por id (solo permisos_trabajo)
router.get('/verformularios', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) return res.status(400).json({ error: 'Falta el parámetro id' });
        // Consulta extendida para obtener todos los datos de la sección 1, incluyendo el departamento
        const queryGeneral = `
            SELECT 
                pt.id_permiso,
                TO_CHAR(pt.fecha_hora, 'DD/MM/YYYY') AS fecha,
                pt.prefijo,
                tp.nombre AS tipo_permiso,
                ptnp.empresa,
                s.nombre AS sucursal,
                a.nombre AS area, 
                d.nombre AS departamento,   -- 👈 aquí se agrega el nombre del departamento
                ptnp.nombre_solicitante AS solicitante,
                ptnp.descripcion_trabajo
            FROM permisos_trabajo pt
            INNER JOIN pt_no_peligroso ptnp 
                ON pt.id_permiso = ptnp.id_permiso
            INNER JOIN sucursales s 
                ON pt.id_sucursal = s.id_sucursal
            INNER JOIN areas a 
                ON pt.id_area = a.id_area
            INNER JOIN departamentos d
                ON pt.id_departamento = d.id_departamento  -- 👈 unión con departamentos
            INNER JOIN tipos_permisos tp 
                ON pt.id_tipo_permiso = tp.id_tipo_permiso
            WHERE pt.id_permiso = $1
        `;
        const resultGeneral = await pool.query(queryGeneral, [id]);
        if (resultGeneral.rows.length === 0) return res.status(404).json({ error: 'Permiso no encontrado' });

        // Consulta parte 2: Detalles Técnicos
        const queryDetalles = `
            SELECT 
                a.nombre AS planta,
                pnp.tipo_mantenimiento AS tipo_actividad,
                pnp.ot_no AS ot,
                pnp.equipo_intervencion AS equipo,
                pnp.tag,
                TO_CHAR(pnp.hora_inicio, 'HH24:MI') || ' hrs' AS horario,
                pnp.fluido,
                pnp.presion,
                pnp.temperatura
            FROM permisos_trabajo pt
            LEFT JOIN pt_no_peligroso pnp ON pt.id_permiso = pnp.id_permiso
            LEFT JOIN areas a ON pt.id_area = a.id_area
            WHERE pt.id_permiso = $1
        `;
        const resultDetalles = await pool.query(queryDetalles, [id]);

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

        res.json({
            general: resultGeneral.rows[0],
            detalles: resultDetalles.rows[0] || {},
            ast: resultAST.rows[0] || {},
            actividades_ast: resultActividades.rows || [],
            participantes_ast: participantesRows
        });
    } catch (error) {
        console.error('Error en la consulta de permisos:', error);
        res.status(500).json({ error: 'Error en la consulta de permisos' });
    }
});

module.exports = router;