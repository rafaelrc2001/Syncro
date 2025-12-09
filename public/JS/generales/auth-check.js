// Verificación de autenticación en el frontend
// Este archivo debe ser incluido en TODAS las páginas protegidas

// Función para verificar si el usuario tiene sesión activa
async function verificarSesionActiva() {
  try {
    const response = await fetch("/api/verificar-sesion", {
      method: "GET",
      credentials: "include", // Importante: incluir cookies
    });

    const data = await response.json();

    if (!data.success || !data.usuario) {
      // No hay sesión activa, redirigir al login
      alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
      window.location.href = "/login.html";
      return null;
    }

    return data.usuario;
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    alert("Error de conexión. Redirigiendo al login...");
    window.location.href = "/login.html";
    return null;
  }
}

// Función para verificar el rol del usuario
async function verificarRol(rolesPermitidos) {
  const usuario = await verificarSesionActiva();
  
  if (!usuario) {
    return false;
  }

  if (!rolesPermitidos.includes(usuario.rol)) {
    alert(`Acceso denegado. No tienes permisos para acceder a esta página.`);
    // Redirigir según el rol
    if (usuario.rol === "usuario") {
      window.location.href = "/Modules/Usuario/Dash-Usuario.html";
    } else if (usuario.rol === "supervisor") {
      window.location.href = "/Modules/SupSeguridad/Dash-Supervisor.html";
    } else if (usuario.rol === "jefe") {
      window.location.href = "/Modules/JefeSeguridad/Dash-Jefe.html";
    } else {
      window.location.href = "/login.html";
    }
    return false;
  }

  return usuario;
}

// Función para cerrar sesión
async function cerrarSesion() {
  try {
    const response = await fetch("/api/cerrar-sesion", {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      // Limpiar localStorage (por si acaso)
      localStorage.removeItem("usuario");
      // Redirigir al login
      window.location.href = "/login.html";
    } else {
      alert("Error al cerrar sesión");
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    // Aunque haya error, limpiar y redirigir
    localStorage.removeItem("usuario");
    window.location.href = "/login.html";
  }
}

// Función para obtener datos del usuario actual
async function obtenerUsuarioActual() {
  return await verificarSesionActiva();
}

// Interceptor para todas las peticiones fetch
// Esto agrega automáticamente las credenciales a todas las llamadas API
const originalFetch = window.fetch;
window.fetch = function(...args) {
  // Si es una llamada a /api/, agregar credentials
  if (args[0] && args[0].includes('/api/')) {
    if (!args[1]) {
      args[1] = {};
    }
    args[1].credentials = 'include';
  }
  return originalFetch.apply(this, args);
};
