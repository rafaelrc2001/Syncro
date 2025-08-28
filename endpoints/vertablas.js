const express = require('express');
const router = express.Router();
const pool = require('./database');


//estas son para el usuario
//**************************


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
            INNER JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
            ORDER BY pt.fecha_hora DESC;
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
            WHERE pt.id_departamento = $1
            ORDER BY pt.fecha_hora DESC;
        `, [id_departamento]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al consultar permisos:', error);
        res.status(500).json({ error: 'Error al consultar permisos' });
    }
});

// Nueva función para obtener permisos por departamento
async function obtenerPermisosPorDepartamento(id_departamento) {
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
WHERE pt.id_departamento = $1
ORDER BY pt.fecha_hora DESC;
    `, [id_departamento]);
        return result.rows;
    } catch (error) {
        console.error('Error al consultar permisos por departamento:', error);
        throw error;
    }
}

router.get('/autorizar/:id_departamento', async (req, res) => {
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
            WHERE a.id_departamento = $1
            ORDER BY pt.fecha_hora DESC;
        `, [id_departamento]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al consultar permisos para autorizar:', error);
        res.status(500).json({ error: 'Error al consultar permisos para autorizar' });
    }
});



//estas son para el  JEFE
//**************************

// Nueva función para el jefe: obtener todos los permisos generales (sin filtrar por departamento)
router.get('/autorizar-jefe', async (req, res) => {
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
            ORDER BY pt.fecha_hora DESC;
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al consultar permisos generales para el jefe:', error);
        res.status(500).json({ error: 'Error al consultar permisos generales para el jefe' });
    }
});


module.exports = router;
