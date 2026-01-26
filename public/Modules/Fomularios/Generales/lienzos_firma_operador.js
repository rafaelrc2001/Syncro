// Handler para guardar la firma del operador en la base de datos
document.addEventListener('DOMContentLoaded', async function() {
    const firmaAreaDiv = document.getElementById('firma-area-operador');
    const btnGuardar = document.getElementById('guardarFirmaOperador');
    const mensaje = document.getElementById('mensajeFirmaOperador');
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get('id') || window.idPermisoActual;

    // Validar si ya existe firma en la base de datos o si no se requiere operador_area
    if (idPermiso && firmaAreaDiv) {
        try {
            const resp = await fetch(`/api/autorizaciones/ver-firma-operador-area/${idPermiso}`);
            if (resp.ok) {
                const data = await resp.json();
                // Ocultar si ya hay firma O si operador_area es null, vacío o solo espacios
                if (
                    (data && data.success && data.data && data.data.firma_operador_area) ||
                    (!data.data.operador_area || String(data.data.operador_area).trim() === "")
                ) {
                    firmaAreaDiv.style.display = 'none';
                } else {
                    firmaAreaDiv.style.display = '';
                }
            }
        } catch (err) {
            // Si hay error, mostrar el área por defecto
            firmaAreaDiv.style.display = '';
        }
    }

    if (btnGuardar) {
        btnGuardar.onclick = async function() {
            const params = new URLSearchParams(window.location.search);
            const idPermiso = params.get('id') || window.idPermisoActual;
            const output = document.getElementById('outputBase64FirmaOperador');
            if (!idPermiso) {
                if (mensaje) mensaje.textContent = 'No se encontró el id del permiso.';
                return;
            }
          /*  if (!output || !output.value) {
                if (mensaje) mensaje.textContent = 'Por favor, firma antes de guardar.';
                return;
            }*/
            try {
                const resp = await fetch('/api/autorizaciones/firma-operador-area', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_permiso: idPermiso,
                        firma_operador_area: output.value
                    })
                });
                const data = await resp.json();
                if (resp.ok && data.success) {
                    if (mensaje) mensaje.textContent = 'Firma guardada exitosamente.';
                    // Limpiar canvas y output
                    const canvas = document.getElementById('canvasFirmaOperador');
                    if (canvas && canvas.getContext) {
                        const ctx = canvas.getContext('2d');
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                    output.value = '';
                    // Recargar la página para actualizar la firma
                    window.location.reload();
                } else {
                    if (mensaje) mensaje.textContent = data.error || 'Error al guardar la firma.';
                }
            } catch (err) {
                if (mensaje) mensaje.textContent = 'Error de red o del servidor al guardar la firma.';
            }
        };
    }
});
// lienzos_firma_operador.js
// Canvas especial para la firma del operador del área (id: canvasFirmaOperador)

document.addEventListener('DOMContentLoaded', function() {
    // Función para validar si el canvas está en blanco
    function isCanvasBlank(c) {
        const blank = document.createElement('canvas');
        blank.width = c.width;
        blank.height = c.height;
        return c.toDataURL() === blank.toDataURL();
    }

    const canvas = document.getElementById('canvasFirmaOperador');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const output = document.getElementById('outputBase64FirmaOperador');
    const limpiarBtn = document.getElementById('limpiarFirmaOperador');
    let dibujando = false;

    if (!canvas || !ctx) {
        console.error('[FIRMA OPERADOR] No se encontró el canvasFirmaOperador');
        return;
    }
    if (!output) {
        console.error('[FIRMA OPERADOR] No se encontró el input outputBase64FirmaOperador');
    }

    // Ajustes de línea
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    const obtenerPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left,
            y: (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
        }
    }

    const iniciar = (e) => {
        dibujando = true;
        dibujar(e);
    }
    const parar = () => {
        dibujando = false;
        ctx.beginPath();
    }
    const dibujar = (e) => {
        if (!dibujando) return;
        const pos = obtenerPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    canvas.addEventListener('mousedown', iniciar);
    canvas.addEventListener('mousemove', dibujar);
    window.addEventListener('mouseup', parar);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); iniciar(e); });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); dibujar(e); });
    canvas.addEventListener('touchend', parar);

    if (limpiarBtn) {
        limpiarBtn.onclick = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if (output) output.value = "";
        };
    }

    // Guardar la firma en base64 al cambiar el canvas (opcional, solo si quieres guardar automáticamente)
    canvas.addEventListener('mouseup', () => {
        if (output) output.value = canvas.toDataURL('image/png');
    });
    canvas.addEventListener('touchend', () => {
        if (output) output.value = canvas.toDataURL('image/png');
    });
});
