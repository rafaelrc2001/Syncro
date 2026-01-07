document.addEventListener("DOMContentLoaded", function () {
  // Inicializar partículas


  // Animación del botón de login
  const loginBtn = document.querySelector(".login-btn");
  const loginForm = document.querySelector(".login-form");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    loginBtn.classList.add("loading");

    const departamentoNombre = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      // 1. Intentar login de departamento
      let response = await fetch("/endpoints/loginDepartamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: departamentoNombre, password }),
      });
      let data = await response.json();

      // 2. Si falla, intentar login de usuario (tabla usuarios)
      if (!data.success || !data.usuario) {
        response = await fetch("/endpoints/loginUsuario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: departamentoNombre, password }),
        });
        data = await response.json();
      }

      // 3. Si falla, intentar login de jefe
      if (!data.success || !data.usuario) {
        response = await fetch("/endpoints/loginJefe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ usuario: departamentoNombre, password }),
        });
        data = await response.json();
      }

      // 4. Si falla, intentar login de supervisor
      if (!data.success || !data.usuario) {
        response = await fetch("/endpoints/loginSupervisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ usuario: departamentoNombre, password }),
        });
        data = await response.json();
      }

      loginBtn.classList.remove("loading");
      if (data.success && data.usuario) {
        // Mostrar el objeto usuario antes de guardar
        console.log("[LOGIN] Usuario recibido:", data.usuario);
        // Guardar en localStorage (compatibilidad con código existente)
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        // Redirección segura post-login
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        // Protecciones: solo URLs internas permitidas
        function isSafeInternalUrl(url) {
          try {
            const allowedBase = window.location.origin;
            const u = new URL(url, allowedBase);
            // Solo permite rutas internas bajo el mismo origen y rutas conocidas
            if (u.origin !== allowedBase) return false;
            // Opcional: solo permite rutas que empiecen por /Modules/Fomularios/PT1/
            if (!u.pathname.startsWith("/Modules/Fomularios/PT1/")) return false;
            return true;
          } catch (e) {
            return false;
          }
        }
        if (redirectUrl && isSafeInternalUrl(redirectUrl)) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
        } else {
          // Fallback seguro por rol
          if (data.usuario.rol === "usuario") {
            window.location.href = "Modules/Usuario/Dash-Usuario.html";
          } else if (data.usuario.rol === "supervisor") {
            window.location.href = "Modules/SupSeguridad/Dash-Supervisor.html";
          } else if (data.usuario.rol === "jefe") {
            window.location.href = "Modules/JefeSeguridad/Dash-Jefe.html";
          } else if (data.usuario.rol === "departamentos") {
            window.location.href = "Modules/Departamentos/Dash-Usuario.html";
          } else {
            alert("Rol no reconocido.");
          }
        }
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      loginBtn.classList.remove("loading");
      alert("Error de conexión con el servidor");
    }
  });

  // Efecto hover en inputs
  const inputs = document.querySelectorAll(".input-group input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.querySelector("i").style.color = "#262626";
    });
    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.querySelector("i").style.color = "#262626";
      }
    });
  });

  // Modal recuperación de contraseña
  const forgotLink = document.querySelector(".login-footer a");
  const forgotModal = document.getElementById("forgot-modal");
  const closeForgotModal = document.getElementById("close-forgot-modal");

  if (forgotLink && forgotModal && closeForgotModal) {
    forgotLink.addEventListener("click", function (e) {
      e.preventDefault();
      forgotModal.style.display = "flex";
    });
    closeForgotModal.addEventListener("click", function () {
      forgotModal.style.display = "none";
    });
  }
});
