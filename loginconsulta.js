// esta va en los endpoints

const express = require("express");
const router = express.Router();
const db = require("./database");
// Middleware para parsear JSON en este router
router.use(express.json());

// Endpoint para login de usuarios de departamento
router.post("/loginUsuario", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Login usando la tabla usuarios
    const result = await db.query(
      "SELECT id_usuario as id, usuario, nombre, apellidoM, apellidoP, contrasena, id_departamento FROM usuarios WHERE LOWER(usuario) = LOWER($1)",
      [email]
    );
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }
    const usuario = result.rows[0];
    if (usuario.contrasena !== password) {
      return res.json({ success: false, message: "Contraseña incorrecta" });
    }
    usuario.rol = "usuario";
    delete usuario.contrasena;
    res.json({ success: true, usuario });
  } catch (error) {
    console.error("Error en loginDepartamento:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Endpoint para login de usuarios de jefe
router.post("/loginJefe", async (req, res) => {
  const { usuario, password } = req.body;
  try {
    // Consulta la tabla jefe usando la columna usuario, ignorando mayúsculas/minúsculas
    const result = await db.query(
      "SELECT id_jefe as id, usuario, contraseña FROM jefe WHERE LOWER(usuario) = LOWER($1)",
      [usuario]
    );
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }
    const jefe = result.rows[0];
    // Validar contraseña (en producción, usa hash)
    if (jefe.contraseña !== password) {
      return res.json({ success: false, message: "Contraseña incorrecta" });
    }
    jefe.rol = "jefe";
    // No enviar la contraseña al frontend
    delete jefe.contraseña;
    res.json({ success: true, usuario: jefe });
  } catch (error) {
    console.error("Error en loginJefe:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Endpoint para login de usuarios de supervisor
router.post("/loginSupervisor", async (req, res) => {
  const { usuario, password } = req.body;
  try {
    // Solo permite login si el supervisor está visible
    const result = await db.query(
      "SELECT id_supervisor as id, usuario, contraseña FROM supervisores WHERE LOWER(usuario) = LOWER($1) AND visibilidad = true",
      [usuario]
    );
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }
    const supervisor = result.rows[0];
    if (supervisor.contraseña !== password) {
      return res.json({ success: false, message: "Contraseña incorrecta" });
    }
    supervisor.rol = "supervisor";
    delete supervisor.contraseña;
    res.json({ success: true, usuario: supervisor });
  } catch (error) {
    console.error("Error en loginSupervisor:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

module.exports = router;
