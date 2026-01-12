// Función para mostrar revalidaciones en una tabla similar a responsables
async function cargarRevalidaciones(id_permiso) {
    try {
        const response = await fetch(`/api/mostrar-revalidaciones/${id_permiso}`);
        const data = await response.json();
        console.log('[DEBUG] Respuesta endpoint revalidaciones:', data);
        const contenedor = document.getElementById('contenedor-revalidaciones');
        if (!contenedor) return;
        if (!data.success || !data.revalidaciones || data.revalidaciones.length === 0) {
            contenedor.innerHTML = '';
            return;
        }
        let html = `<div class="section-header"><i class="ri-refresh-line"></i><h3>Revalidaciones</h3></div>`;
        html += `<div class="ast-summary"><table class="ast-table ast-table-revalidaciones"><thead><tr><th>#</th><th>Usuario</th><th>Hora</th><th>Comentario</th><th>Firma</th></tr></thead><tbody>`;
        data.revalidaciones.forEach((rev, idx) => {
            html += `<tr>`;
            html += `<td>${idx + 1}</td>`;
            html += `<td>${rev.usuario_fecha ? rev.usuario_fecha : "<span style=\"color:#c0392b;font-weight:600;\">Sin dato</span>"}</td>`;
            html += `<td>${rev.hora ? rev.hora : "<span style=\"color:#c0392b;font-weight:600;\">Sin dato</span>"}</td>`;
            html += `<td>${rev.comentario ? rev.comentario : "<span style=\"color:#c0392b;font-weight:600;\">Sin comentario</span>"}</td>`;
                html += `<td>${rev.firma ? `<img src=\"${rev.firma}\" alt=\"Firma\" style=\"max-width:160px;max-height:100px;\">` : "<span style=\"color:#c0392b;font-weight:600;\">Sin firma</span>"}</td>`;
            html += `</tr>`;
        });
        html += `</tbody></table></div>`;
        contenedor.innerHTML = html;
    } catch (error) {
        const contenedor = document.getElementById('contenedor-revalidaciones');
        if (contenedor) {
            contenedor.innerHTML = `<div style='color:#c0392b;font-weight:600;'>Error al cargar revalidaciones</div>`;
        }
        console.error('Error al cargar revalidaciones:', error);
    }
}

// Llama a la función con el id_permiso que desees mostrar
// Ejemplo: cargarRevalidaciones(561);
