// Lógica para mostrar/ocultar botones de autorización según la firma de creación


document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get('id') || window.idPermisoActual;
    if (!idPermiso) return;

    try {
        const resp = await fetch(`/api/autorizaciones/detalle/${idPermiso}`);
        const data = await resp.json();
        const firma = data?.data?.firma_creacion;

        const btnAutorizar = document.getElementById('btn-pregunta-autorizar');
        const btnNoAutorizar = document.getElementById('btn-no-autorizar');

        let infoMsg = document.getElementById('msg-firma-creacion');
        if (!infoMsg && btnAutorizar) {
            infoMsg = document.createElement('div');
            infoMsg.id = 'msg-firma-creacion';
            infoMsg.style.cssText = `
                margin:12px auto;
                color:#e53935;
                font-size:0.85em;
                text-align:center;
                max-width:340px;
                font-weight:bold;
            `;
            btnAutorizar.parentNode.insertBefore(infoMsg, btnAutorizar);
        }

        if (!firma) {
            btnAutorizar?.classList.add('hidden-force');
            btnNoAutorizar?.classList.add('hidden-force');

            if (infoMsg) {
                infoMsg.textContent =
                    'No se puede continuar hasta que el usuario que creó el permiso firme.';
                infoMsg.style.display = 'block';
            }
        } else {
            btnAutorizar?.classList.remove('hidden-force');
            btnNoAutorizar?.classList.remove('hidden-force');

            if (infoMsg) {
                infoMsg.style.display = 'none';
            }
        }
    } catch (e) {
        console.error('Error validando firma:', e);
    }
});
