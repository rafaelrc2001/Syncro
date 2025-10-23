const express = require('express');
const router = express.Router();
const pool = require('./database');

// API para obtener el conteo de permisos por estatus
router.get('/targetas', async (req, res) => {
    console.log('GET /api/targetas llamado');
    try {
        // Solo contar permisos que están dados de alta (con todos los JOINs)
        const result = await pool.query(`
            SELECT e.estatus, COUNT(*) AS cantidad
            FROM permisos_trabajo pt
            INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
            INNER JOIN areas a ON pt.id_area = a.id_area
            INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
            INNER JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
            GROUP BY e.estatus
        `);
        // El total ahora es solo de permisos dados de alta
        const totalResult = await pool.query(`
            SELECT COUNT(*) AS total
            FROM permisos_trabajo pt
            INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
            INNER JOIN areas a ON pt.id_area = a.id_area
            INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
            INNER JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
        `);
        res.json({
            total: totalResult.rows[0].total,
            estatus: result.rows
        });
    } catch (error) {
        console.error('Error al consultar targetas:', error);
        res.status(500).json({ error: 'Error al consultar targetas' });
    }
});

module.exports = router;
