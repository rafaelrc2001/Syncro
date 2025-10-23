const express = require('express');
const router = express.Router();
const pool = require('../../database');

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
LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
WHERE ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL
GROUP BY e.estatus
        `);
        // El total ahora es solo de permisos dados de alta
        const totalResult = await pool.query(`
           SELECT COUNT(*) AS total
FROM permisos_trabajo pt
INNER JOIN tipos_permisos tp ON pt.id_tipo_permiso = tp.id_tipo_permiso
INNER JOIN areas a ON pt.id_area = a.id_area
INNER JOIN estatus e ON pt.id_estatus = e.id_estatus
LEFT JOIN pt_no_peligroso ptnp ON pt.id_permiso = ptnp.id_permiso
LEFT JOIN pt_apertura pta ON pt.id_permiso = pta.id_permiso
WHERE ptnp.id_permiso IS NOT NULL OR pta.id_permiso IS NOT NULL
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


//ESTA ES MI FUNCION PARA LAS TARGETAS EN tabla-crearpt.js


async function cargarTargetasDesdePermisos() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const id_departamento = usuario && usuario.id ? usuario.id : null;
        if (!id_departamento) throw new Error('No se encontró el id de departamento del usuario');
        const response = await fetch(`/api/vertablas/${id_departamento}`);
        if (!response.ok) throw new Error('Error al consultar permisos');
        const permisos = await response.json();

        // Conteos por estatus
        let total = permisos.length;
        let porAutorizar = 0;
        let activos = 0;
        let terminados = 0;
        let noAutorizados = 0;

        permisos.forEach(item => {
            const estatus = item.estatus.toLowerCase();
            if (estatus === 'espera area' || estatus === 'espera seguridad' || estatus === 'en espera del área') {
                porAutorizar++;
            } else if (estatus === 'activo') {
                activos++;
            } else if (estatus === 'terminado') {
                terminados++;
            } else if (estatus === 'no autorizado') {
                noAutorizados++;
            }
        });

        // Actualiza las tarjetas en el HTML
        const counts = document.querySelectorAll('.card-content .count');
        counts[0].textContent = total;
        counts[1].textContent = porAutorizar;
        counts[2].textContent = activos;
        counts[3].textContent = terminados;
        counts[4].textContent = noAutorizados;
    } catch (err) {
        console.error('Error al cargar targetas desde permisos:', err);
    }
}



//esta va aser la que se va a uzar en tabla-autorizar.js por el momento es igual pero le hare unos ajustes

async function cargarTargetasDesdeAutorizar() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const id_departamento = usuario && usuario.id ? usuario.id : null;
        if (!id_departamento) throw new Error('No se encontró el id de departamento del usuario');
        // Cambia el endpoint aquí:
        const response = await fetch(`/api/autorizar/${id_departamento}`);
        if (!response.ok) throw new Error('Error al consultar permisos');
        const permisos = await response.json();

        // Conteos por estatus
        let total = permisos.length;
        let porAutorizar = 0;
        let activos = 0;
        let terminados = 0;
        let noAutorizados = 0;

        permisos.forEach(item => {
            const estatus = item.estatus.toLowerCase();
            if (estatus === 'espera area' || estatus === 'espera seguridad' || estatus === 'en espera del área') {
                porAutorizar++;
            } else if (estatus === 'activo') {
                activos++;
            } else if (estatus === 'terminado') {
                terminados++;
            } else if (estatus === 'no autorizado') {
                noAutorizados++;
            }
        });

        // Actualiza las tarjetas en el HTML
        const counts = document.querySelectorAll('.card-content .count');
        counts[0].textContent = total;
        counts[1].textContent = porAutorizar;
        counts[2].textContent = activos;
        counts[3].textContent = terminados;
        counts[4].textContent = noAutorizados;
    } catch (err) {
        console.error('Error al cargar targetas desde permisos:', err);
    }
}


module.exports = router;
