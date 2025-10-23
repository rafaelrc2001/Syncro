// ==============================
// MODAL: TERMINAR (CERRAR) PERMISO
// ==============================

const btnCerrarPermiso = document.getElementById("btn-cerrar-permiso");
const modalCerrarPermiso = document.getElementById("modalCerrarPermiso");
const btnGuardarCerrarPermiso = document.getElementById(
  "btnGuardarCerrarPermiso"
);
const btnCancelarCerrarPermiso = document.getElementById(
  "btnCancelarCerrarPermiso"
);

// Abrir modal
if (btnCerrarPermiso && modalCerrarPermiso) {
  btnCerrarPermiso.addEventListener("click", function () {
    console.log(
      "🟦 [CERRAR] Botón de cierre presionado → abre modalCerrarPermiso"
    );
    modalCerrarPermiso.style.display = "flex";
    document.getElementById("comentarioCerrarPermiso").value = "";
  });
}

// Cerrar modal sin acción
if (btnCancelarCerrarPermiso) {
  btnCancelarCerrarPermiso.addEventListener("click", function () {
    console.log("🟦 [CERRAR] Modal cerrado por el usuario (sin acción).");
    modalCerrarPermiso.style.display = "none";
  });
}

// Guardar cierre
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
    // CORREGIDO: Usar la misma lógica que en cancelar.js
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
        `/api/permisos-trabajo/${idPermiso}`
      );
      const permisoData = await respEstatus.json();
      idEstatus =
        permisoData.id_estatus ||
        (permisoData.data && permisoData.data.id_estatus);
    } catch (err) {
      console.error("❌ [CERRAR] Error al consultar id_estatus:", err);
    }

    if (!idEstatus) return alert("No se pudo obtener el estatus del permiso.");

    try {
      console.log("💾 [CERRAR] Guardando comentario → /api/estatus/comentario");
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
        alert("Error al guardar el comentario de cierre.");
        return;
      }

      console.log("🔄 [CERRAR] Actualizando estatus → /api/estatus/terminado");
      const respEstatusTerminado = await fetch(
        "/api/estatus/terminado",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus }),
        }
      );
      const dataEstatusTerminado = await respEstatusTerminado.json();

      if (!respEstatusTerminado.ok || !dataEstatusTerminado.success) {
        alert("Error al actualizar el estatus a terminado.");
        return;
      }

      if (window.n8nFormHandlerFinalizado) {
        console.log(
          "📨 [CERRAR] Ejecutando n8nFormHandlerFinalizado() para enviar correo..."
        );
        await window.n8nFormHandlerFinalizado();
        alert("Permiso cerrado y correo enviado correctamente.");
        modalCerrarPermiso.style.display = "none";
        window.location.href = "/Modules/usuario/crearPT.html";
      } else {
        console.warn(
          "⚠️ [CERRAR] No se encontró window.n8nFormHandlerFinalizado"
        );
        // Añadir redirección incluso si no hay función de email
        alert("Permiso cerrado correctamente.");
        modalCerrarPermiso.style.display = "none";
        window.location.href = "/Modules/usuario/crearPT.html";
      }
    } catch (err) {
      console.error("❌ [CERRAR] Error en el flujo de cierre:", err);
      alert("Error al cerrar el permiso. Ver consola para más detalles.");
    }
  });
}
