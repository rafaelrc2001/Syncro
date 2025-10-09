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
  const resp = await fetch(
    `http://localhost:3000/api/verformularios?id=${idPermiso}`
  );
  const data = await resp.json();
  console.log("[n8nFormHandler] Datos recibidos:", data);

  // 2. Obtener el valor del comentario de cierre del textarea
  console.log("[n8nFormHandler] Obteniendo comentario de cierre...");
  let comentario = "";
  const comentarioInput = document.getElementById("comentarioCerrarPermiso");
  if (comentarioInput) {
    comentario = comentarioInput.value.trim();
    console.log("[n8nFormHandler] Comentario de cierre:", comentario);
  }

  // 3. Armar el objeto formData con los datos recibidos y el comentario
  console.log("[n8nFormHandler] Preparando datos para consulta de correo...");
  const departamentoNombre = data.general?.departamento || "";
  console.log("[n8nFormHandler] Nombre del departamento:", departamentoNombre);
  console.log(
    `[n8nFormHandler] Con este departamento se va a hacer la búsqueda de correo: '${departamentoNombre}'`
  );
  let correoDepartamento = "";
  if (departamentoNombre) {
    console.log("[n8nFormHandler] Consultando correo en backend...");
    try {
      const respCorreo = await fetch(
        `http://localhost:3000/api/buscar_departamentos/correo?nombre=${encodeURIComponent(
          departamentoNombre
        )}`
      );
      const dataCorreo = await respCorreo.json();
      console.log("[n8nFormHandler] Respuesta de correo:", dataCorreo);
      correoDepartamento = dataCorreo.correo || "";
      console.log("[n8nFormHandler] Correo obtenido:", correoDepartamento);
    } catch (err) {
      console.error("Error al consultar correo del departamento:", err);
    }
  }

  console.log("[n8nFormHandler] Armando objeto formData...");
  const formData = {
    numeroPermiso: data.general?.prefijo || data.general?.id_permiso || "",
    fechaPermiso: data.general?.fecha || "",
    empresa: data.general?.empresa || "",
    subcontrata: data.general?.subcontrata || "",
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
    equipo: data.detalles?.equipo || "",
    tag: data.detalles?.tag || "",
    ot: data.detalles?.ot || "",
    horario: data.detalles?.horario || "",
    fluido: data.detalles?.fluido || "",
    presion: data.detalles?.presion || "",
    temperatura: data.detalles?.temperatura || "",
    observaciones:
      data.general?.observaciones_analisis_previo ||
      data.detalles?.observaciones_analisis_previo ||
      "",
    comentario,
  };

  console.log("[n8nFormHandler] formData final:", formData);
  console.log(
    "Datos que se enviarán a N8N:",
    JSON.stringify(formData, null, 2)
  );

  console.log("[n8nFormHandler] Enviando datos a N8N...");
  await fetch("https://7mhxkntt-5678.usw3.devtunnels.ms/webhook/cierre-pt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  console.log("[n8nFormHandler] FIN FLUJO");
};

// Inicialización si es necesario
document.addEventListener("DOMContentLoaded", function () {
  // Inicialización si es necesaria
});
