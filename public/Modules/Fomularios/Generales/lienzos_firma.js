const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const output = document.getElementById('outputBase64');
let dibujando = false;

if (!canvas) {
    console.error('[FIRMA] No se encontró el canvas');
} else {
    console.log('[FIRMA] Canvas encontrado');
}
if (!output) {
    console.error('[FIRMA] No se encontró el input outputBase64');
} else {
    console.log('[FIRMA] input outputBase64 encontrado');
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
    console.log('[FIRMA] Inicia dibujo');
}
const parar = () => {
    dibujando = false;
    ctx.beginPath();
    console.log('[FIRMA] Fin dibujo');
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

document.getElementById('limpiar').onclick = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (output) output.value = "";
    console.log('[FIRMA] Canvas limpiado, outputBase64 vaciado');
};

document.getElementById('guardar').onclick = () => {
    // Validar que el canvas no esté en blanco
    const isCanvasBlank = (c) => {
        const blank = document.createElement('canvas');
        blank.width = c.width;
        blank.height = c.height;
        return c.toDataURL() === blank.toDataURL();
    };
    if (isCanvasBlank(canvas)) {
      /*  alert('Por favor, firma antes de guardar.');*/
        console.warn('[FIRMA] Intento de guardar firma en blanco');
        // Bloquear el flujo: no guardar, no continuar, no enviar nada
        if (output) output.value = "";
        return;
    }
    const dataURL = canvas.toDataURL("image/png"); // AQUÍ SE CREA LA CADENA
    if (output) {
        output.value = dataURL; // Solo guardar en variable oculta
        console.log('[FIRMA] Se guardó en outputBase64:', output.value);
    } else {
        console.error('[FIRMA] No se pudo guardar en outputBase64');
    }
    localStorage.setItem('firma_data', dataURL); // Opcional: guardar en memoria
    // Continuar flujo automáticamente SOLO si hay firma
    const btnContinuar = document.getElementById('btnAgregarFirmaContinuar');
    if (btnContinuar) {
        console.log('[FIRMA] Click automático en btnAgregarFirmaContinuar');
        btnContinuar.click();
    } else {
        console.warn('[FIRMA] No se encontró btnAgregarFirmaContinuar');
    }
};


