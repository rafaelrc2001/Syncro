
// Mostrar comentario solo si el estatus corresponde a ciertos valores
async function mostrarComentarioSiCorresponde(id_permiso, elementoComentario) {
  try {
    const response = await fetch(`/api/estatus-comentarios/${id_permiso}`);
    const data = await response.json();
    if (!data.success) return;
    const estatusPermitidos = [
      "cierre"
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

// Lógica automática: si existe un div con id 'comentarios-permiso' y hay id en la URL, mostrar el comentario
document.addEventListener('DOMContentLoaded', function() {
  const comentarioDiv = document.getElementById('comentarios-permiso');
  if (comentarioDiv) {
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get('id');
    if (idPermiso) {
      mostrarComentarioSiCorresponde(idPermiso, comentarioDiv);
    }
  }
});
