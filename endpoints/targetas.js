const express = require('express');
const router = express.Router();
const pool = require('./database');

// API para obtener el conteo de permisos por estatus
router.get('/targetas', async (req, res) => {
    console.log('GET /api/targetas llamado');
    try {
        const result = await pool.query(`
            SELECT e.estatus, COUNT(*) AS cantidad
            FROM permisos_trabajo pt
            JOIN estatus e ON pt.id_estatus = e.id_estatus
            GROUP BY e.estatus
        `);
        // También obtener el total de permisos
        const totalResult = await pool.query('SELECT COUNT(*) AS total FROM permisos_trabajo');
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
