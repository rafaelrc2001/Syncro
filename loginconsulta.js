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
		// Consulta la tabla departamentos (ajusta los nombres de columnas según tu BD)
		const result = await db.query(
			'SELECT id_departamento as id, nombre, correo, contraseña, extension FROM departamentos WHERE correo = $1',
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

module.exports = router;