// esta va en los endpoints

const express = require('express');
const router = express.Router();
const db = require('./database');
// Middleware para parsear JSON en este router
router.use(express.json());

// Endpoint para login de usuarios de departamento
router.post('/loginDepartamento', async (req, res) => {
	const { email, password } = req.body;
	try {
		// Consulta la tabla departamentos usando el nombre en vez de correo, ignorando mayúsculas/minúsculas
		const result = await db.query(
			'SELECT id_departamento as id, nombre, correo, contraseña, extension FROM departamentos WHERE LOWER(nombre) = LOWER($1)',
			[email]
		);
		if (result.rows.length === 0) {
			return res.json({ success: false, message: 'Usuario no encontrado' });
		}
		const usuario = result.rows[0];
		// Validar contraseña (en producción, usa hash)
		if (usuario.contraseña !== password) {
			return res.json({ success: false, message: 'Contraseña incorrecta' });
		}
		// Puedes agregar el campo rol si lo tienes en la tabla, aquí lo forzamos a 'usuario'
		usuario.rol = 'usuario';
		// No enviar la contraseña al frontend
		delete usuario.contraseña;
		res.json({ success: true, usuario });
	} catch (error) {
		console.error('Error en loginDepartamento:', error);
		res.status(500).json({ success: false, message: 'Error en el servidor' });
	}
});

// Endpoint para login de usuarios de jefe
router.post('/loginJefe', async (req, res) => {
    const { usuario, password } = req.body;
    try {
        // Consulta la tabla jefe usando la columna usuario, ignorando mayúsculas/minúsculas
		const result = await db.query(
			'SELECT id_jefe as id, usuario, contraseña FROM jefe WHERE LOWER(usuario) = LOWER($1)',
			[usuario]
		);
        if (result.rows.length === 0) {
            return res.json({ success: false, message: 'Usuario no encontrado' });
        }
        const jefe = result.rows[0];
        // Validar contraseña (en producción, usa hash)
        if (jefe.contraseña !== password) {
            return res.json({ success: false, message: 'Contraseña incorrecta' });
        }
        jefe.rol = 'jefe';
        // No enviar la contraseña al frontend
        delete jefe.contraseña;
        res.json({ success: true, usuario: jefe });
    } catch (error) {
        console.error('Error en loginJefe:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Endpoint para login de usuarios de supervisor
router.post('/loginSupervisor', async (req, res) => {
    const { usuario, password } = req.body;
    try {
        // Consulta la tabla supervisores usando la columna usuario, ignorando mayúsculas/minúsculas
        const result = await db.query(
            'SELECT id_supervisor as id, usuario, contraseña FROM supervisores WHERE LOWER(usuario) = LOWER($1)',
            [usuario]
        );
        if (result.rows.length === 0) {
            return res.json({ success: false, message: 'Usuario no encontrado' });
        }
        const supervisor = result.rows[0];
        // Validar contraseña (en producción, usa hash)
        if (supervisor.contraseña !== password) {
            return res.json({ success: false, message: 'Contraseña incorrecta' });
        }
        supervisor.rol = 'supervisor';
        // No enviar la contraseña al frontend
        delete supervisor.contraseña;
        res.json({ success: true, usuario: supervisor });
    } catch (error) {
        console.error('Error en loginSupervisor:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

module.exports = router;