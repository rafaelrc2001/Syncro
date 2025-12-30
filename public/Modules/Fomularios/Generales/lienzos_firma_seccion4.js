// lienzos_firma_seccion4.js
// Canvas especial para la firma en la sección 4 (id: canvasFirma)

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvasFirma');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const output = document.getElementById('outputBase64Firma');
    const limpiarBtn = document.getElementById('limpiarFirma');
    let dibujando = false;

    if (!canvas || !ctx) {
        console.error('[FIRMA S4] No se encontró el canvasFirma');
        return;
    }
    if (!output) {
        console.error('[FIRMA S4] No se encontró el input outputBase64Firma');
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
