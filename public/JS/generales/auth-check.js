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
      // No hay sesión activa, mostrar modal y redirigir al login
      let modal = document.getElementById('modalSesionExpirada');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalSesionExpirada';
        modal.innerHTML = `
          <div class="modal-overlay" style="display:flex;position:fixed;top:0;left:0;width:100vw;height:100vh;padding-top:40px;background:rgba(0,0,0,0.3);z-index:2147483647;justify-content:center;align-items:flex-start;">
            <div class="modal-content" style="background:#fff;padding:2rem 1.5rem;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.2);max-width:90vw;width:350px;text-align:center;z-index:2147483647;">
              <h3 style="margin-bottom:1rem;">Sesión expirada</h3>
              <p style="margin-bottom:2rem;">Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</p>
              <button id="btnCerrarModalSesionExpirada" style="padding:0.5rem 1.5rem;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer;">Aceptar</button>
            </div>
          </div>
        `;
        if (document.body.firstChild) {
          document.body.insertBefore(modal, document.body.firstChild);
        } else {
          document.body.appendChild(modal);
        }
      }
      modal.style.display = 'flex';
      const btnCerrar = document.getElementById('btnCerrarModalSesionExpirada');
      if (btnCerrar) {
        btnCerrar.onclick = function() {
          modal.style.display = 'none';
          window.location.href = "/login.html";
        };
      } else {
        // Fallback: redirigir si no se encuentra el botón
        setTimeout(function(){ window.location.href = "/login.html"; }, 2000);
      }
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
