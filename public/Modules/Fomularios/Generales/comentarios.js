// Mostrar comentario solo si el estatus corresponde a ciertos valores
async function mostrarComentarioSiCorresponde(id_permiso, elementoComentario) {
  try {
    const response = await fetch(`/api/estatus-comentarios/${id_permiso}`);
    const data = await response.json();
    if (!data.success) return;
    const estatusPermitidos = [
      "no autorizado",
      "cierre sin incidentes",
      "cierre con accidentes",
      "cierre con incidentes",
      "cancelado",
    ];
    if (estatusPermitidos.includes((data.estatus || "").toLowerCase())) {
      // Mostrar el contenedor principal
      elementoComentario.style.display = "block";
      // Buscar el elemento del texto del comentario
      const textoComentario =
        elementoComentario.querySelector("#comentario-texto");
      if (textoComentario) {
        textoComentario.textContent = data.comentarios || "Sin comentarios";
      }
    } else {
      elementoComentario.style.display = "none";
    }
  } catch (err) {
    elementoComentario.style.display = "none";
  }
}

// Ejemplo de uso:
// const id_permiso = ...; // El id del permiso
// const comentarioDiv = document.getElementById("comentarios-permiso");
// mostrarComentarioSiCorresponde(id_permiso, comentarioDiv);
