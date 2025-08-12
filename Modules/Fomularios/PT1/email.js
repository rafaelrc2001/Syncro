document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.querySelector('#complete-permit-form button[type="submit"]');
    const mensajeDiv = document.getElementById('mensaje');
    
    // Crear mensaje div si no existe
    if (!mensajeDiv) {
        const msgDiv = document.createElement('div');
        msgDiv.id = 'mensaje';
        msgDiv.style.display = 'none';
        document.body.appendChild(msgDiv);
    }

    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();
       
        // Mostrar estado de carga
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Enviando...';
       
        // Recopilar datos del formulario (Sección 1)
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
       
        try {
            // Configuración de la solicitud al webhook de n8n
            const response = await fetch('https://nngestor.app.n8n.cloud/webhook-test/formulario-PT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
           
            if (response.ok) {
                // Mostrar mensaje de éxito en el modal existente o crear uno
                const modal = document.getElementById('confirmation-modal');
                if (modal) {
                    modal.querySelector('p').innerHTML += '<br><br>Se ha enviado una notificación por correo.';
                    modal.classList.add('active');
                } else {
                    alert('Solicitud enviada correctamente. Se ha enviado una notificación por correo.');
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = 'Error al enviar la solicitud: ' + error.message;
            
            // Mostrar error en el modal o como alerta
            const modal = document.getElementById('confirmation-modal');
            if (modal) {
                modal.querySelector('h3').textContent = 'Error al enviar';
                modal.querySelector('p').textContent = errorMsg;
                modal.classList.add('active');
            } else {
                alert(errorMsg);
            }
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="ri-save-line"></i> Guardar Permiso Completo';
        }
    });
});