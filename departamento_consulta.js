const express = require('express');
const router = express.Router();
const db = require('./database');

// Endpoint para obtener nombre de departamento por ID
router.get('/departamento/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT nombre FROM departamentos WHERE id_departamento = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }
        
        res.json({ nombre: result.rows[0].nombre });
    } catch (error) {
        console.error('Error al consultar departamento:', error);
        res.status(500).json({ error: 'Error al consultar departamento' });
    }
});

module.exports = router;