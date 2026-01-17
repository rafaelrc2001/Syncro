// Lógica para mostrar/ocultar botones de autorización según la firma de creación

document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el id del permiso de la URL
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get('id') || window.idPermisoActual;
    if (!idPermiso) return;

    try {
        const resp = await fetch(`/api/permiso/obtener-firma-creacion/${idPermiso}`);
        const data = await resp.json();
        const firma = data && data.success ? data.firma_creacion : null;
        const btnAutorizar = document.getElementById('btn-pregunta-autorizar');
        const btnNoAutorizar = document.getElementById('btn-no-autorizar');
        // Mensaje informativo
        let infoMsg = document.getElementById('msg-firma-creacion');
        if (!infoMsg) {
            infoMsg = document.createElement('div');
            infoMsg.id = 'msg-firma-creacion';
            infoMsg.style = 'margin: 12px auto; color: #e53935; font-size: 0.85em; font-weight: 100; text-align: center; max-width: 340px; line-height: 1.3; display: block;';
            btnAutorizar && btnAutorizar.parentNode.insertBefore(infoMsg, btnAutorizar);
        }
        if (!firma || firma === '' || firma === null || firma === undefined) {
            // Ocultar botones
            if (btnAutorizar) btnAutorizar.style.display = 'none';
            if (btnNoAutorizar) btnNoAutorizar.style.display = 'none';
            infoMsg.textContent = 'No se puede continuar hasta que el usuario que creó el permiso firme. Cuando la firma esté registrada, podrás autorizar o no autorizar el permiso.';
        } else {
            // Mostrar botones y ocultar mensaje
            if (btnAutorizar) btnAutorizar.style.display = '';
            if (btnNoAutorizar) btnNoAutorizar.style.display = '';
            infoMsg.textContent = '';
            infoMsg.style.display = 'none';
        }
    } catch (err) {
        console.error('Error consultando firma_creacion:', err);
    }
});
