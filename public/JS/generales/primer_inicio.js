// General logic for first login and password update modal for all roles
// Usage: Include this script in all Dash-*.html files after the modal HTML

(function() {
  // Helper: Get user from localStorage
  function getUsuarioLocal() {
    try {
      const usuario = localStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    } catch (e) { return null; }
  }

  // Show password toggle logic for all password fields with .toggle-password-btn
  function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password-btn').forEach(btn => {
      btn.onclick = function() {
        const input = btn.parentElement.querySelector('input[type="password"], input[type="text"]');
        if (input) {
          if (input.type === 'password') {
            input.type = 'text';
            btn.querySelector('i').className = 'bx bx-hide';
          } else {
            input.type = 'password';
            btn.querySelector('i').className = 'bx bx-show';
          }
        }
      };
    });
  }

  // Show modal if first login
  function checkPrimeraEntrada() {
    const usuario = getUsuarioLocal();
    if (usuario && usuario.primera_entrada === true) {
      const modal = document.getElementById('actualizar-contraseña');
      if (modal) modal.style.display = 'flex';
    }
  }

  // Password update logic (shared for all roles)
  function setupActualizarContrasena() {
    const btnGuardar = document.getElementById('btn-guardar-actualizar');
    const modal = document.getElementById('actualizar-contraseña');
    const closeBtn = document.getElementById('close-actualizar-modal');
    if (btnGuardar && modal) {
      btnGuardar.onclick = async function() {
        const usuario = document.getElementById('username-actualizar').value.trim();
        const password = document.getElementById('password-actualizar').value.trim();
        const passwordNueva = document.getElementById('password_nueva').value.trim();
        if (!usuario || !password || !passwordNueva) {
          alert('Completa todos los campos.');
          return;
        }
        btnGuardar.classList.add('loading');
        try {
          let response = await fetch('/endpoints/actualizarContrasena', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password, passwordNueva })
          });
          let data = await response.json();
          btnGuardar.classList.remove('loading');
          if (data.success) {
            alert('Contraseña actualizada correctamente');
            modal.style.display = 'none';
            // Update primera_entrada in localStorage
            try {
              const usuarioLocal = localStorage.getItem('usuario');
              if (usuarioLocal) {
                const usuarioObj = JSON.parse(usuarioLocal);
                usuarioObj.primera_entrada = false;
                localStorage.setItem('usuario', JSON.stringify(usuarioObj));
              }
            } catch (e) {}
            // Redirect by role
            const usuarioLocal2 = localStorage.getItem('usuario');
            if (usuarioLocal2) {
              const usuarioObj2 = JSON.parse(usuarioLocal2);
              if (usuarioObj2.rol === 'usuario') {
                window.location.href = '/Modules/Usuario/Dash-Usuario.html';
              } else if (usuarioObj2.rol === 'supervisor') {
                window.location.href = '/Modules/SupSeguridad/Dash-Supervisor.html';
              } else if (usuarioObj2.rol === 'jefe') {
                window.location.href = '/Modules/JefeSeguridad/Dash-Jefe.html';
              } else if (usuarioObj2.rol === 'departamentos') {
                window.location.href = '/Modules/Departamentos/Dash-Usuario.html';
              }
            }
          } else {
            alert(data.message || 'No se pudo actualizar la contraseña');
          }
        } catch (err) {
          btnGuardar.classList.remove('loading');
          alert('Error al actualizar la contraseña');
        }
      };
    }
    if (closeBtn && modal) {
      closeBtn.onclick = function() {
        modal.style.display = 'none';
      };
    }
  }

  // Run on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggles();
    checkPrimeraEntrada();
    setupActualizarContrasena();
  });
})();
