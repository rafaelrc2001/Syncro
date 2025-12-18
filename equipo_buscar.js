const express = require('express');
const router = express.Router();
const db = require('./database');

// Endpoint para obtener todos los tags
router.get('/equipo/tags', (req, res) => {
    const query = 'SELECT tag, descripcion FROM equipos ORDER BY tag';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener tags:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        res.json(results.rows || results);
    });
});

// Endpoint para buscar equipo por TAG (devuelve id_equipo y descripcion)
router.get('/equipo/buscar-por-tag', (req, res) => {
    const { tag } = req.query;
    
    if (!tag) {
        return res.status(400).json({ error: 'El parámetro TAG es requerido' });
    }

    // Búsqueda flexible: trim, case-insensitive
    const query = 'SELECT id_equipo, descripcion FROM equipos WHERE TRIM(UPPER(tag)) = UPPER(TRIM($1))';
    
    db.query(query, [tag], (err, results) => {
        if (err) {
            console.error('Error al buscar equipo por TAG:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        
        const rows = results.rows || results;
        
        if (rows.length === 0) {
            console.log(`TAG no encontrado: "${tag}"`);
            return res.json({ id_equipo: null, descripcion: null, mensaje: 'No se encontró equipo con ese TAG' });
        }
        
        console.log(`TAG encontrado: "${tag}" -> ID: ${rows[0].id_equipo}, Descripción: ${rows[0].descripcion}`);
        res.json({ 
            id_equipo: rows[0].id_equipo, 
            descripcion: rows[0].descripcion 
        });
    });
});

module.exports = router;
