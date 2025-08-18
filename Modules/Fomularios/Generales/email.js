// Función para manejar el envío del formulario a n8n
window.n8nFormHandler = async function() {
    // Recopilar datos del formulario
    const formData = {
        numeroPermiso: document.getElementById('permit-number').value,
        fechaPermiso: document.getElementById('permit-date').value,
        empresa: document.getElementById('company').value,
        subcontrata: document.getElementById('subcontract').value,
        sucursal: document.getElementById('area').value,
        planta: document.getElementById('plant').value,
        solicitante: document.getElementById('applicant').value,
        descripcionTrabajo: document.getElementById('work-description').value,
        fechaSolicitud: new Date().toISOString(),
        mantenimiento: document.getElementById('maintenance-type').value,
        tipopermiso: document.getElementById('PermisoNP').value,
    };

    // Enviar datos a n8n
    const response = await fetch('https://nngestor.app.n8n.cloud/webhook-test/formulario-PT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error en la respuesta del servidor n8n');
    }

    return true;
};

// Inicialización si es necesario
document.addEventListener('DOMContentLoaded', function() {
    // Inicialización si es necesaria
});