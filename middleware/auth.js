// Middleware de autenticación
// Este middleware verifica que el usuario tenga una sesión válida

// Middleware para verificar si el usuario está autenticado
function verificarAutenticacion(req, res, next) {
  if (req.session && req.session.usuario) {
    // El usuario tiene una sesión válida
    return next();
  }
  // No hay sesión válida
  return res.status(401).json({
    success: false,
    message: "No autorizado. Debes iniciar sesión.",
    requiereLogin: true,
  });
}

// Middleware para verificar roles específicos
function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.session || !req.session.usuario) {
      return res.status(401).json({
        success: false,
        message: "No autorizado. Debes iniciar sesión.",
        requiereLogin: true,
      });
    }

    const rolUsuario = req.session.usuario.rol;
    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(", ")}`,
      });
    }

    next();
  };
}

// Endpoint para verificar sesión desde el frontend
function verificarSesion(req, res) {
  if (req.session && req.session.usuario) {
    res.json({
      success: true,
      usuario: req.session.usuario,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "No hay sesión activa",
      requiereLogin: true,
    });
  }
}

// Endpoint para cerrar sesión
function cerrarSesion(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al cerrar sesión",
      });
    }
    res.clearCookie("connect.sid"); // Nombre por defecto de la cookie de sesión
    res.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  });
}

module.exports = {
  verificarAutenticacion,
  verificarRol,
  verificarSesion,
  cerrarSesion,
};
