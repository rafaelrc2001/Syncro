const express = require('express');
const router = express.Router();
const db = require('./database');

// Endpoint para obtener todos los departamentos (para autocompletado)
router.get('/departamentos', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id_departamento as id, nombre FROM departamentos ORDER BY nombre'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al consultar departamentos:', error);
        res.status(500).json({ error: 'Error al consultar departamentos' });
    }
});

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

// Endpoint para obtener áreas, con filtro opcional por departamento
router.get('/areas', async (req, res) => {
    try {
        const { id_departamento } = req.query;
        
        let query = 'SELECT id_area as id, nombre, id_departamento FROM areas';
        let params = [];
        
        if (id_departamento) {
            query += ' WHERE id_departamento = $1';
            params.push(id_departamento);
        }
        
        query += ' ORDER BY nombre';
        
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener áreas:', error);
        res.status(500).json({ error: 'Error al obtener áreas' });
    }
});

module.exports = router;