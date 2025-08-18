document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.querySelector('#complete-permit-form button[type="submit"]');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Mostrar estado de carga
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Procesando...';
            
            // Simular procesamiento (sin n8n)
            try {
                // Simular retraso de red
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Mostrar confirmación directamente
                // Mostrar mensaje de éxito en el modal
                const modal = document.getElementById('confirmation-modal');
                if (modal) {
                    modal.querySelector('p').innerHTML = 'El permiso de trabajo con AST ha sido registrado en el sistema con el número: <strong id="generated-permit">GSI-SI-FO-002-XXXX</strong>';
                    modal.querySelector('h3').textContent = 'Permiso creado exitosamente';
                    modal.classList.add('active');
                }
            } catch (error) {
                console.error('Error:', error);
                const modal = document.getElementById('confirmation-modal');
                if (modal) {
                    modal.querySelector('h3').textContent = 'Error al enviar';
                    modal.querySelector('p').textContent = 'Error al procesar la solicitud: ' + error.message;
                    modal.classList.add('active');
                } else {
                    alert('Error al procesar la solicitud: ' + error.message);
                }
            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }
        });
    }
});

// Función simulada para compatibilidad
window.handleN8NFormSubmission = async function() {
    console.log('Modo de prueba: No se está usando n8n');
    return true; // Siempre retorna éxito
};