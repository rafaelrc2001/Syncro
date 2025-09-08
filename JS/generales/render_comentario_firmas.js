export function renderComentario(comentario = "") {
  return `
    <div class="comentario-render">
      <label><strong>Comentario:</strong></label>
      <div class="comentario-texto">${comentario ? comentario : "Sin comentario"}</div>
    </div>
  `;
}