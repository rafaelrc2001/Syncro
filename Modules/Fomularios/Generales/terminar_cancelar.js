// ==============================
// DEPURACIÓN DE MODALES
// ==============================

const btnCancelarPermiso = document.getElementById("btn-cancelar-permiso");
const btnCerrarPermiso = document.getElementById("btn-cerrar-permiso");

// --- CANCELAR PERMISO (modalCancelarPermisoUnico) ---
const modalCancelarPermisoUnico = document.getElementById(
  "modalCancelarPermisoUnico"
);
const btnGuardarCancelarPermiso = document.getElementById(
  "btnGuardarCancelarPermiso"
);
const btnCancelarCancelarPermiso = document.getElementById(
  "btnCancelarCancelarPermiso"
);

if (btnCancelarPermiso && modalCancelarPermisoUnico) {
  btnCancelarPermiso.addEventListener("click", function () {
    console.log(
      "🟥 [CANCELAR] Botón de cancelar permiso presionado → abre modalCancelarPermisoUnico"
    );
    modalCancelarPermisoUnico.style.display = "flex";
    document.getElementById("comentarioCancelarPermiso").value = "";
  });
}

if (btnCancelarCancelarPermiso) {
  btnCancelarCancelarPermiso.addEventListener("click", function () {
    console.log(
      "🟥 [CANCELAR] Modal cancelado por el usuario (cerrado sin acción)."
    );
    modalCancelarPermisoUnico.style.display = "none";
  });
}

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
      console.log("📦 [CANCELAR] Respuesta permisoData:", permisoData);
      idEstatus =
        permisoData.id_estatus ||
        (permisoData.data && permisoData.data.id_estatus);
    } catch (err) {
      console.error("❌ [CANCELAR] Error al consultar id_estatus:", err);
    }
    console.log("📊 [CANCELAR] id_estatus obtenido:", idEstatus);

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
      console.log("📦 [CANCELAR] Respuesta de comentario:", dataComentario);

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
      console.log(
        "📦 [CANCELAR] Respuesta estatus cancelado:",
        dataEstatusCancelado
      );

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
        window.location.href = "/Modules/usuario/autorizarPT.html";
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

// --- CERRAR PERMISO (modalCerrarPermiso) ---
const modalCerrarPermiso = document.getElementById("modalCerrarPermiso");
const btnGuardarCerrarPermiso = document.getElementById(
  "btnGuardarCerrarPermiso"
);
const btnCancelarCerrarPermiso = document.getElementById(
  "btnCancelarCerrarPermiso"
);

if (btnCerrarPermiso && modalCerrarPermiso) {
  btnCerrarPermiso.addEventListener("click", function () {
    console.log(
      "🟦 [CERRAR] Botón de cierre presionado → abre modalCerrarPermiso"
    );
    modalCerrarPermiso.style.display = "flex";
    document.getElementById("comentarioCerrarPermiso").value = "";
  });
}

if (btnCancelarCerrarPermiso) {
  btnCancelarCerrarPermiso.addEventListener("click", function () {
    console.log("🟦 [CERRAR] Modal cerrado por el usuario (sin acción).");
    modalCerrarPermiso.style.display = "none";
  });
}

if (btnGuardarCerrarPermiso) {
  btnGuardarCerrarPermiso.addEventListener("click", async function () {
    console.log("🟦 [CERRAR] Guardar cierre PRESIONADO");
    if (modalCerrarPermiso.style.display !== "flex") {
      console.warn(
        "⚠️ [CERRAR] El modalCerrarPermiso NO está visible. Abortando."
      );
      return;
    }

    const comentario = document
      .getElementById("comentarioCerrarPermiso")
      .value.trim();
    if (!comentario) {
      alert("Debes escribir el motivo del cierre.");
      return;
    }
    console.log("📝 [CERRAR] Comentario:", comentario);

    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get("id") || window.idPermisoActual;
    console.log("🔑 [CERRAR] ID del permiso:", idPermiso);
    if (!idPermiso) return alert("No se pudo obtener el ID del permiso.");

    let idEstatus = null;
    try {
      console.log(
        "🌐 [CERRAR] Consultando id_estatus en /api/permisos-trabajo/",
        idPermiso
      );
      const respEstatus = await fetch(
        `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
      );
      const permisoData = await respEstatus.json();
      console.log("📦 [CERRAR] Respuesta permisoData:", permisoData);
      idEstatus =
        permisoData.id_estatus ||
        (permisoData.data && permisoData.data.id_estatus);
    } catch (err) {
      console.error("❌ [CERRAR] Error al consultar id_estatus:", err);
    }
    console.log("📊 [CERRAR] id_estatus obtenido:", idEstatus);

    if (!idEstatus) return alert("No se pudo obtener el estatus del permiso.");

    try {
      console.log("💾 [CERRAR] Guardando comentario → /api/estatus/comentario");
      const respComentario = await fetch(
        "http://localhost:3000/api/estatus/comentario",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus, comentario }),
        }
      );
      const dataComentario = await respComentario.json();
      console.log("📦 [CERRAR] Respuesta de comentario:", dataComentario);

      if (!dataComentario.success) {
        alert("Error al guardar el comentario de cierre.");
        return;
      }

      console.log("🔄 [CERRAR] Actualizando estatus → /api/estatus/terminado");
      const respEstatusTerminado = await fetch(
        "http://localhost:3000/api/estatus/terminado",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus }),
        }
      );
      const dataEstatusTerminado = await respEstatusTerminado.json();
      console.log(
        "📦 [CERRAR] Respuesta estatus terminado:",
        dataEstatusTerminado
      );

      if (!respEstatusTerminado.ok || !dataEstatusTerminado.success) {
        alert("Error al actualizar el estatus a Terminado.");
        return;
      }

      if (window.n8nFormHandlerFinalizado) {
        console.log(
          "📨 [CERRAR] Ejecutando n8nFormHandlerFinalizado() para enviar correo..."
        );
        await window.n8nFormHandlerFinalizado();
        alert("Permiso cerrado y correo enviado correctamente.");
        modalCerrarPermiso.style.display = "none";
        window.location.href = "/Modules/usuario/autorizarPT.html";
      } else {
        console.warn(
          "⚠️ [CERRAR] No se encontró window.n8nFormHandlerFinalizado"
        );
      }
    } catch (err) {
      console.error("❌ [CERRAR] Error en el flujo de cierre:", err);
    }
  });
}
