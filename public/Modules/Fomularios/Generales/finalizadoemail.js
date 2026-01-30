// Función para manejar el envío del formulario a n8n
window.n8nFormHandlerFinalizado = async function () {
  console.log("[n8nFormHandler] INICIO FLUJO");
  const params = new URLSearchParams(window.location.search);
  const idPermiso =
    params.get("id") ||
    sessionStorage.getItem("id_permiso") ||
    sessionStorage.getItem("id_tipo_permiso");
  console.log("[n8nFormHandler] idPermiso:", idPermiso);

  // 1. Obtener datos del permiso desde tu API
  console.log("[n8nFormHandler] Consultando datos del permiso...");
  let data = null;
  let apiError = false;
  try {
    const resp = await fetch(`/api/verformularios?id=${idPermiso}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    data = await resp.json();
    console.log("[n8nFormHandler] Datos recibidos:", data);
  } catch (err) {
    console.error(
      "❌ [n8nFormHandler] Error al obtener datos del permiso:",
      err
    );
    apiError = true;
  }

  // 2. Obtener el valor del comentario de cierre del textarea y el tipo de cierre
  console.log("[n8nFormHandler] Obteniendo comentario y tipo de cierre...");
  let comentario = "";
  let tipoCierre = "";

  const comentarioInput = document.getElementById("comentarioCerrarPermiso");
  if (comentarioInput) {
    comentario = comentarioInput.value.trim();
    console.log("[n8nFormHandler] Comentario de cierre:", comentario);
  }

  const tipoCierreSelect = document.getElementById("tipoCierrePermiso");
  if (tipoCierreSelect) {
    tipoCierre = tipoCierreSelect.value;
    console.log("[n8nFormHandler] Tipo de cierre seleccionado:", tipoCierre);
  }

  // 3. Armar el objeto formData con los datos recibidos, el comentario y el tipo de cierre
  let formData = {};
  let correoDepartamento = "";
  let departamentoNombre = "";
  if (
    !apiError &&
    data &&
    data.general &&
    Object.keys(data.general).length > 0
  ) {
    // Usar datos de la API si están completos
    departamentoNombre = data.general?.departamento || "";
    if (departamentoNombre) {
      try {
        const respCorreo = await fetch(
          `/api/buscar_departamentos/correo?nombre=${encodeURIComponent(
            departamentoNombre
          )}`
        );
        const dataCorreo = await respCorreo.json();
        correoDepartamento = dataCorreo.correo || "";
      } catch (err) {
        console.error("Error al consultar correo del departamento:", err);
      }
    }
    formData = {
      numeroPermiso: data.general?.prefijo || data.general?.id_permiso || "",
      fechaPermiso: data.general?.fecha || "",
      empresa: data.general?.empresa || "",
      sucursal: data.general?.sucursal || "",
      planta: data.detalles?.planta || data.general?.area || "",
      solicitante: data.general?.solicitante || "",
      descripcionTrabajo:
        data.general?.descripcion_trabajo ||
        data.detalles?.descripcion_trabajo ||
        "",
      fechaSolicitud: new Date().toISOString(),
      mantenimiento: data.general?.mantenimiento || "",
      tipopermiso: data.general?.tipo_permiso || data.tipo_permiso || "",
      correo: correoDepartamento,
      contrato: data.general?.contrato || "",
      departamento: data.general?.departamento || "",
      horario: data.detalles?.horario || "",
      observaciones:
        data.general?.observaciones_analisis_previo ||
        data.detalles?.observaciones_analisis_previo ||
        "",
      comentario,
      tipoCierre,
    };
    console.log(
      "[n8nFormHandler] Usando datos de la API para formData:",
      formData
    );
  } else {
    // Fallback: recolectar datos del DOM
    console.warn(
      "[n8nFormHandler] API vacía o error, recolectando datos del DOM"
    );
    // Recolección usando los IDs reales del HTML de PT1
    formData = {
      numeroPermiso:
        document.querySelector(".section-header h3")?.textContent.trim() || "",
      fechaPermiso:
        document.getElementById("fecha-label")?.textContent.trim() || "",
      empresa:
        document.getElementById("empresa-label")?.textContent.trim() || "",
      subcontrata: "", // No existe en el HTML
      sucursal:
        document.getElementById("sucursal-label")?.textContent.trim() || "",
      planta: document.getElementById("plant-label")?.textContent.trim() || "",
      solicitante:
        document
          .getElementById("nombre-solicitante-label")
          ?.textContent.trim() || "",
      descripcionTrabajo:
        document
          .getElementById("descripcion-trabajo-label")
          ?.textContent.trim() || "",
      fechaSolicitud: new Date().toISOString(),
      mantenimiento: "", // No existe en el HTML
      tipopermiso:
        document.getElementById("activity-type-label")?.textContent.trim() ||
        "",
      correo: "",
      contrato:
        document.getElementById("contrato-label")?.textContent.trim() || "",
      departamento: "",
      horario:
        document.getElementById("start-time-label")?.textContent.trim() || "",

      observaciones:
        document.getElementById("pre-work-observations")?.textContent.trim() ||
        "",
      comentario,
      tipoCierre,
    };
    console.log(
      "[n8nFormHandler] Usando datos del DOM para formData:",
      formData
    );
  }

  console.log("[n8nFormHandler] formData final:", formData);
  console.log(
    "Datos que se enviarán a N8N:",
    JSON.stringify(formData, null, 2)
  );

  try {
    const response = await fetch(
      "/api/notificar-finalizado-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    console.log("[n8nFormHandler] Respuesta del webhook:", response.status);
  } catch (err) {
    console.error("[n8nFormHandler] ❌ Error al enviar datos a N8N:", err);
  }
  console.log("[n8nFormHandler] FIN FLUJO");
};

// Inicialización si es necesario
document.addEventListener("DOMContentLoaded", function () {
  // Inicialización si es necesaria
});
