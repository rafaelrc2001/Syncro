// esta va en los endpoints

const express = require("express");
const router = express.Router();
const db = require("./database");
// Middleware para parsear JSON en este router
router.use(express.json());


// Nuevo endpoint único para login
router.post("/loginUsuario", async (req, res) => {
  // Permite recibir "email" o "usuario" indistintamente
  const { email, usuario, password } = req.body;
  const userField = email || usuario;
  try {
    // Consulta la tabla usuarios por nombre de usuario y visibilidad
    const result = await db.query(
      "SELECT id_usuario, usuario, nombre, apellidop, apellidom, contrasena, departamento, visibilidad, rol FROM usuarios WHERE LOWER(usuario) = LOWER($1) AND visibilidad = true",
      [userField]
    );
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }
    const usuarioDb = result.rows[0];
    if (usuarioDb.contrasena !== password) {
      return res.json({ success: false, message: "Contraseña incorrecta" });
    }
    // No enviar la contraseña al frontend
    delete usuarioDb.contrasena;

    // Crear sesión del usuario
    req.session.usuario = usuarioDb;

    res.json({ success: true, usuario: usuarioDb });
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

module.exports = router;
