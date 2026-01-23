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
  console.log("[ACTUALIZAR CONTRASEÑA] Datos recibidos:", { usuario, password, passwordNueva });
  if (!usuario || !passwordNueva) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }
  try {
    // Si password está vacío, permitir solo si es la primera vez
    if (!password) {
      const result = await db.query(
        `SELECT no_empleado, primera_entrada FROM usuarios WHERE LOWER(usuario) = LOWER($1)`,
        [usuario]
      );
      if (result.rows.length === 0) {
        return res.json({ success: false, message: "Usuario no encontrado" });
      }
      const noEmpleado = result.rows[0].no_empleado;
      const primeraEntrada = result.rows[0].primera_entrada;
      if (!primeraEntrada) {
        return res.status(400).json({ success: false, message: "No autorizado para cambiar sin contraseña actual" });
      }
      await db.query(
        `UPDATE usuarios SET contrasena = crypt($1, gen_salt('bf')), primera_entrada = false WHERE no_empleado = $2`,
        [passwordNueva, noEmpleado]
      );
      return res.json({ success: true, message: "Contraseña actualizada correctamente (primera vez)" });
    }
    // Si password no está vacío, flujo normal
    const result = await db.query(
      `SELECT no_empleado, primera_entrada FROM usuarios WHERE LOWER(usuario) = LOWER($1) AND contrasena = crypt($2, contrasena)`,
      [usuario, password]
    );
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Usuario o contraseña actual incorrectos" });
    }
    const noEmpleado = result.rows[0].no_empleado;
    const primeraEntrada = result.rows[0].primera_entrada;
    if (primeraEntrada) {
      await db.query(
        `UPDATE usuarios SET contrasena = crypt($1, gen_salt('bf')), primera_entrada = false WHERE no_empleado = $2`,
        [passwordNueva, noEmpleado]
      );
    } else {
      await db.query(
        `UPDATE usuarios SET contrasena = crypt($1, gen_salt('bf')) WHERE no_empleado = $2`,
        [passwordNueva, noEmpleado]
      );
    }
    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en actualizarContrasena:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Endpoint para saber si es la primera vez que entra el usuario
router.post("/usuario/primeraVez", async (req, res) => {
  const { id_usuario } = req.body;
  console.log("[PRIMERA VEZ] id_usuario recibido:", id_usuario);
  if (!id_usuario) {
    console.warn("[PRIMERA VEZ] FALTA id_usuario en body");
    return res.status(400).json({ success: false, message: "Falta id_usuario" });
  }
  try {
    const result = await db.query(
      `SELECT primera_entrada FROM usuarios WHERE id_usuario = $1`,
      [id_usuario]
    );
    console.log("[PRIMERA VEZ] Resultado SQL:", result.rows);
    if (result.rows.length === 0) {
      console.warn("[PRIMERA VEZ] Usuario no encontrado para id_usuario:", id_usuario);
      return res.json({ success: false, message: "Usuario no encontrado" });
    }
    res.json({ success: true, primeraVez: !!result.rows[0].primera_entrada });
  } catch (error) {
    console.error("[PRIMERA VEZ] Error en /usuario/primeraVez:", error);
    res.status(500).json({ success: false, message: "Error en el servidor", error: error.message });
  }
});

module.exports = router;
