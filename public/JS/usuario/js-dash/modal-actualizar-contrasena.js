// Este script muestra un modal para actualizar contraseña si es la primera vez que el usuario ingresa

(async function() {
  // Esperar a que el usuario esté autenticado y disponible en localStorage
  let usuario = null;
  try {
    usuario = JSON.parse(localStorage.getItem("usuario"));
    console.log("[MODAL CONTRASEÑA] Usuario en localStorage:", usuario);
  } catch (e) {
    console.warn("[MODAL CONTRASEÑA] Error parseando usuario localStorage", e);
  }
  if (!usuario || !usuario.id_usuario) {
    console.log("[MODAL CONTRASEÑA] No hay usuario válido en localStorage");
    return;
  }

  // Consultar al endpoint si es la primera vez
  try {
    console.log("[MODAL CONTRASEÑA] Consultando endpoint primera vez...");
    const resp = await fetch("/endpoints/usuario/primeraVez", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: usuario.id_usuario })
    });
    const data = await resp.json();
    console.log("[MODAL CONTRASEÑA] Respuesta endpoint primera vez:", data);
    if (data.primeraVez) {
      console.log("[MODAL CONTRASEÑA] Es primera vez, mostrando modal");
      mostrarModalActualizarContrasena(usuario.usuario);
    } else {
      console.log("[MODAL CONTRASEÑA] No es primera vez, no se muestra modal");
    }
  } catch (e) {
    console.error("[MODAL CONTRASEÑA] Error consultando endpoint primera vez", e);
  }

  // Función para mostrar el modal de actualizar contraseña
  function mostrarModalActualizarContrasena(nombreUsuario) {
    // Si ya existe el modal, solo mostrarlo
    let modal = document.getElementById("modal-actualizar-contrasena");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-actualizar-contrasena";
      modal.className = "modal";
      modal.style.display = "flex";
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Actualizar contraseña</h2>
          <div class="input-group">
            <label for="nueva-contrasena">Nueva contraseña</label>
            <input type="password" id="nueva-contrasena" required autocomplete="new-password" />
          </div>
          <ul id="password-requisitos" style="list-style:none; padding-left:0; margin-bottom:12px; font-size:14px;">
            <li id="req-length">❌ Mínimo 8 caracteres</li>
            <li id="req-mayus">❌ Al menos una mayúscula</li>
            <li id="req-minus">❌ Al menos una minúscula</li>
            <li id="req-num">❌ Al menos un número</li>
            <li id="req-special">❌ Al menos un caracter especial</li>
          </ul>
          <div class="input-group">
            <label for="confirmar-contrasena">Confirmar contraseña</label>
            <input type="password" id="confirmar-contrasena" required autocomplete="new-password" />
          </div>
          <button id="btn-guardar-nueva-contrasena" disabled>Guardar</button>
        </div>
      `;
      document.body.appendChild(modal);
      console.log("[MODAL CONTRASEÑA] Modal creado y mostrado");
    } else {
      modal.style.display = "flex";
      console.log("[MODAL CONTRASEÑA] Modal ya existía, solo se muestra");
    }
    // Validación visual y habilitación del botón
    const inputNueva = document.getElementById("nueva-contrasena");
    const inputConfirmar = document.getElementById("confirmar-contrasena");
    const btnGuardar = document.getElementById("btn-guardar-nueva-contrasena");
    const reqLength = document.getElementById("req-length");
    const reqMayus = document.getElementById("req-mayus");
    const reqMinus = document.getElementById("req-minus");
    const reqNum = document.getElementById("req-num");
    const reqSpecial = document.getElementById("req-special");

    function validarRequisitos(pass) {
      let valid = true;
      // Mínimo 8 caracteres
      if (pass.length >= 8) {
        reqLength.textContent = "✔️ Mínimo 8 caracteres";
        reqLength.style.color = "#2e7d32";
      } else {
        reqLength.textContent = "❌ Mínimo 8 caracteres";
        reqLength.style.color = "#c62828";
        valid = false;
      }
      // Al menos una mayúscula
      if (/[A-Z]/.test(pass)) {
        reqMayus.textContent = "✔️ Al menos una mayúscula";
        reqMayus.style.color = "#2e7d32";
      } else {
        reqMayus.textContent = "❌ Al menos una mayúscula";
        reqMayus.style.color = "#c62828";
        valid = false;
      }
      // Al menos una minúscula
      if (/[a-z]/.test(pass)) {
        reqMinus.textContent = "✔️ Al menos una minúscula";
        reqMinus.style.color = "#2e7d32";
      } else {
        reqMinus.textContent = "❌ Al menos una minúscula";
        reqMinus.style.color = "#c62828";
        valid = false;
      }
      // Al menos un número
      if (/[0-9]/.test(pass)) {
        reqNum.textContent = "✔️ Al menos un número";
        reqNum.style.color = "#2e7d32";
      } else {
        reqNum.textContent = "❌ Al menos un número";
        reqNum.style.color = "#c62828";
        valid = false;
      }
      // Al menos un caracter especial
      if (/[^A-Za-z0-9]/.test(pass)) {
        reqSpecial.textContent = "✔️ Al menos un caracter especial";
        reqSpecial.style.color = "#2e7d32";
      } else {
        reqSpecial.textContent = "❌ Al menos un caracter especial";
        reqSpecial.style.color = "#c62828";
        valid = false;
      }
      return valid;
    }

    function checkAll() {
      const nueva = inputNueva.value.trim();
      const confirmar = inputConfirmar.value.trim();
      const requisitosOk = validarRequisitos(nueva);
      const coincide = nueva && confirmar && nueva === confirmar;
      btnGuardar.disabled = !(requisitosOk && coincide);
    }

    inputNueva.addEventListener("input", checkAll);
    inputConfirmar.addEventListener("input", checkAll);

    // Evento guardar
    btnGuardar.onclick = async function() {
      const nueva = inputNueva.value.trim();
      const confirmar = inputConfirmar.value.trim();
      console.log("[MODAL CONTRASEÑA] Click guardar, nueva:", nueva, "confirmar:", confirmar);
      if (!nueva || !confirmar) {
        alert("Completa ambos campos");
        return;
      }
      if (nueva !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
      }
      if (!validarRequisitos(nueva)) {
        alert("La contraseña no cumple con los requisitos de seguridad.");
        return;
      }
      // Llamar endpoint para actualizar contraseña
      try {
        console.log("[MODAL CONTRASEÑA] Llamando endpoint actualizarContrasena...");
        const resp = await fetch("/endpoints/actualizarContrasena", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario: nombreUsuario, password: '', passwordNueva: nueva })
        });
        const data = await resp.json();
        console.log("[MODAL CONTRASEÑA] Respuesta actualizarContrasena:", data);
        if (data.success) {
          alert("Contraseña actualizada correctamente");
          modal.style.display = "none";
        } else {
          alert(data.message || "No se pudo actualizar la contraseña");
        }
      } catch (e) {
        console.error("[MODAL CONTRASEÑA] Error al actualizar la contraseña", e);
        alert("Error al actualizar la contraseña");
      }
    };
  }
})();


