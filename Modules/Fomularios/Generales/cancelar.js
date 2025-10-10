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
      alert("Debes escribir el motivo de la cancelación.");
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
        "🌐 [CANCELAR] Consultando id_estatus en /api/permisos-trabajo/",
        idPermiso
      );
      const respEstatus = await fetch(
        `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
      );
      const permisoData = await respEstatus.json();
      idEstatus =
        permisoData.id_estatus ||
        (permisoData.data && permisoData.data.id_estatus);
    } catch (err) {
      console.error("❌ [CANCELAR] Error al consultar id_estatus:", err);
    }

    if (!idEstatus) return alert("No se pudo obtener el estatus del permiso.");

    try {
      console.log(
        "💾 [CANCELAR] Guardando comentario → /api/estatus/comentario"
      );
      const respComentario = await fetch(
        "http://localhost:3000/api/estatus/comentario",
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

      console.log(
        "🔄 [CANCELAR] Actualizando estatus → /api/estatus/cancelado"
      );
      const respEstatusCancelado = await fetch(
        "http://localhost:3000/api/estatus/cancelado",
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

      if (window.n8nFormHandlerCancelado) {
        console.log(
          "📨 [CANCELAR] Ejecutando n8nFormHandlerCancelado() para enviar correo..."
        );
        await window.n8nFormHandlerCancelado();
        alert("Permiso cancelado y correo enviado correctamente.");
        modalCancelarPermisoUnico.style.display = "none";
        window.location.href = "/Modules/usuario/crearPT.html";
      } else {
        console.warn(
          "⚠️ [CANCELAR] No se encontró window.n8nFormHandlerCancelado"
        );
      }
    } catch (err) {
      console.error("❌ [CANCELAR] Error en el flujo de cancelación:", err);
    }
  });
}
