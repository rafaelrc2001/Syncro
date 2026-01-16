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
    // Consulta la tabla usuarios por nombre de usuario, visibilidad y contraseña hasheada
    const result = await db.query(
      `SELECT id_usuario, usuario, nombre, apellidop, apellidom, departamento, visibilidad, rol
       FROM usuarios
       WHERE LOWER(usuario) = LOWER($1)
         AND visibilidad = true
         AND contrasena = crypt($2, contrasena)`,
      [userField, password]
    );
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
    const usuarioDb = result.rows[0];
    // Crear sesión del usuario
    req.session.usuario = usuarioDb;
    res.json({ success: true, usuario: usuarioDb });
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Endpoint para actualizar contraseña
router.post("/actualizarContrasena", async (req, res) => {
  const { usuario, password, passwordNueva } = req.body;
  if (!usuario || !password || !passwordNueva) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }
  try {
    // Verificar usuario y contraseña actual
    const result = await db.query(
      `SELECT no_empleado FROM usuarios WHERE LOWER(usuario) = LOWER($1) AND contrasena = crypt($2, contrasena)`,
      [usuario, password]
    );
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Usuario o contraseña actual incorrectos" });
    }
    const noEmpleado = result.rows[0].no_empleado;
    // Actualizar la contraseña
    await db.query(
      `UPDATE usuarios SET contrasena = crypt($1, gen_salt('bf')) WHERE no_empleado = $2`,
      [passwordNueva, noEmpleado]
    );
    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en actualizarContrasena:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

module.exports = router;
