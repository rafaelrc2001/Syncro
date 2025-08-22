const express = require('express');
const router = express.Router();
const pool = require('./database');

// Consulta para obtener los permisos y sus datos relacionados
router.get('/vertablas', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                pt.id_permiso,
                pt.prefijo,
                tp.nombre AS tipo_permiso,
                ptnp.descripcion_trabajo AS descripcion,
                a.nombre AS area,
                ptnp.nombre_solicitante AS solicitante,
                pt.fecha_hora,
                e.estatus
            FROM permisos_trabajo pt
            INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
            INNER JOIN areas a ON pt.id_area = a.id_area
            INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
            INNER JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al consultar permisos:', error);
        res.status(500).json({ error: 'Error al consultar permisos' });
    }
});

router.get('/vertablas/:id_departamento', async (req, res) => {
    const { id_departamento } = req.params;
    try {
        const result = await pool.query(`
            SELECT 
                pt.id_permiso,
                pt.prefijo,
                tp.nombre AS tipo_permiso,
                ptnp.descripcion_trabajo AS descripcion,
                a.nombre AS area,
                ptnp.nombre_solicitante AS solicitante,
                pt.fecha_hora,
                e.estatus
            FROM permisos_trabajo pt
            INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
            INNER JOIN areas a ON pt.id_area = a.id_area
            INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
            INNER JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
            WHERE pt.id_departamento = $1;
        `, [id_departamento]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al consultar permisos:', error);
        res.status(500).json({ error: 'Error al consultar permisos' });
    }
});

module.exports = router;
