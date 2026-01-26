// ==============================
// MODAL: CANCELAR PERMISO
// ==============================

const btnCancelarPermiso = document.getElementById("btn-cancelar-permiso");
const modalCancelarPermisoUnico = document.getElementById(
  "modalCancelarPermisoUnico"
);
const btnGuardarCancelarPermiso = document.getElementById(
  "btnGuardarCancelarPermiso"
);
const btnCancelarCancelarPermiso = document.getElementById(
  "btnCancelarCancelarPermiso"
);

// Abrir modal
if (btnCancelarPermiso && modalCancelarPermisoUnico) {
  btnCancelarPermiso.addEventListener("click", function () {
    console.log(
      "🟥 [CANCELAR] Botón de cancelar permiso presionado → abre modalCancelarPermisoUnico"
    );
    modalCancelarPermisoUnico.style.display = "flex";
    document.getElementById("comentarioCancelarPermiso").value = "";
  });
}

// Cerrar modal sin acción
if (btnCancelarCancelarPermiso) {
  btnCancelarCancelarPermiso.addEventListener("click", function () {
    console.log(
      "🟥 [CANCELAR] Modal cancelado por el usuario (cerrado sin acción)."
    );
    modalCancelarPermisoUnico.style.display = "none";
  });
}

// Guardar cancelación
if (btnGuardarCancelarPermiso) {
  btnGuardarCancelarPermiso.addEventListener("click", async function () {
    console.log("🟥 [CANCELAR] Guardar cancelación PRESIONADO");

    if (modalCancelarPermisoUnico.style.display !== "flex") {
      console.warn(
        "⚠️ [CANCELAR] El modalCancelarPermisoUnico NO está visible. Abortando."
      );
      return;
    }

    const comentario = document
      .getElementById("comentarioCancelarPermiso")
      .value.trim();
    if (!comentario) {
      // Modal de advertencia: motivo de cancelación requerido
      let modal = document.getElementById('modalMotivoCancelacionRequerido');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalMotivoCancelacionRequerido';
        modal.innerHTML = `
          <div class="modal-overlay" style="display:flex;position:fixed;top:0;left:0;width:100vw;height:100vh;padding-top:40px;background:rgba(0,0,0,0.3);z-index:2147483647;justify-content:center;align-items:flex-start;">
            <div class="modal-content" style="background:#fff;padding:2rem 1.5rem;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.2);max-width:90vw;width:350px;text-align:center;z-index:2147483647;">
              <h3 style=\"margin-bottom:1rem;color:#e53935;\">Campo requerido</h3>
              <p style=\"margin-bottom:2rem;\">Debes escribir el motivo de la cancelación.</p>
              <button id=\"btnCerrarModalMotivoCancelacionRequerido\" style=\"padding:0.5rem 1.5rem;background:#e53935;color:#fff;border:none;border-radius:4px;cursor:pointer;\">Aceptar</button>
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
      const btnCerrar = document.getElementById('btnCerrarModalMotivoCancelacionRequerido');
      if (btnCerrar) {
        btnCerrar.onclick = function() {
          modal.style.display = 'none';
        };
      }
      return;
    }
    console.log("📝 [CANCELAR] Comentario:", comentario);

    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get("id") || window.idPermisoActual;
    console.log("🔑 [CANCELAR] ID del permiso:", idPermiso);
    if (!idPermiso) return alert("No se pudo obtener el ID del permiso.");

    let idEstatus = null;
    try {
      console.log(
      
        idPermiso
      );
      const respEstatus = await fetch(
       `/api/estatus/permiso/${idPermiso}`
      );
      const permisoData = await respEstatus.json();
      idEstatus =
        permisoData.id_estatus ||
        (permisoData.data && permisoData.data.id_estatus);
    } catch (err) {
      console.error("❌ [CANCELAR] Error al consultar id_estatus:", err);
    }

   

    try {
      console.log(
        "💾 [CANCELAR] Guardando comentario → /api/estatus/comentario"
      );
      const respComentario = await fetch(
        "/api/estatus/comentario",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus, comentario }),
        }
      );
      const dataComentario = await respComentario.json();

      if (!dataComentario.success) {
        alert("Error al guardar el comentario de cancelación.");
        return;
      }

        // --- Cierre de usuario: enviar nombre completo y fecha/hora actual ---
      // Obtener el usuario desde localStorage como en los otros módulos
      const usuarioObj = JSON.parse(localStorage.getItem("usuario"));
      const usuario = usuarioObj && usuarioObj.usuario ? usuarioObj.usuario : "";
      const fechaHoraCierre = new Date().toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).replace(' ', 'T');
      const respCierreUsuario = await fetch("/api/autorizaciones/cierre-usuario", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          cierre_usuario: usuario,
          fecha_hora_cierre_usuario: fechaHoraCierre
        })
      });
      let dataCierreUsuario = {};
      try {
        dataCierreUsuario = await respCierreUsuario.json();
      } catch (e) {}
      if (!respCierreUsuario.ok || !dataCierreUsuario.success) {
        alert("No se pudo guardar el cierre de usuario.");
        return;
      }
      

      console.log(
        "🔄 [CANCELAR] Actualizando estatus → /api/estatus/cancelado"
      );
      const respEstatusCancelado = await fetch(
        "/api/estatus/cancelado",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus }),
        }
      );
      const dataEstatusCancelado = await respEstatusCancelado.json();

      if (!respEstatusCancelado.ok || !dataEstatusCancelado.success) {
        alert("Error al actualizar el estatus a cancelado.");
        return;
      }

      // Quitar integración con n8n por ahora
      // Modal de éxito en vez de alert
      let modal = document.getElementById('modalPermisoCanceladoExito');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalPermisoCanceladoExito';
        modal.innerHTML = `
          <div class="modal-overlay" style="display:flex;position:fixed;top:0;left:0;width:100vw;height:100vh;padding-top:40px;background:rgba(0,0,0,0.3);z-index:2147483647;justify-content:center;align-items:flex-start;">
            <div class="modal-content" style="background:#fff;padding:2rem 1.5rem;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.2);max-width:90vw;width:350px;text-align:center;z-index:2147483647;">
              <h3 style=\"margin-bottom:1rem;color:#388e3c;\">Éxito</h3>
              <p style=\"margin-bottom:2rem;\">Permiso cancelado correctamente.</p>
              <button id=\"btnCerrarModalPermisoCanceladoExito\" style=\"padding:0.5rem 1.5rem;background:#388e3c;color:#fff;border:none;border-radius:4px;cursor:pointer;\">Aceptar</button>
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
      const btnCerrar = document.getElementById('btnCerrarModalPermisoCanceladoExito');
      if (btnCerrar) {
        btnCerrar.onclick = function() {
          modal.style.display = 'none';
          modalCancelarPermisoUnico.style.display = "none";
          window.location.href = "/Modules/Usuario/CrearPT.html";
        };
      } else {
        // fallback: redirige después de 2s si no hay botón
        setTimeout(function() {
          modalCancelarPermisoUnico.style.display = "none";
          window.location.href = "/Modules/Usuario/CrearPT.html";
        }, 2000);
      }
    } catch (err) {
     
    }
  });
}
