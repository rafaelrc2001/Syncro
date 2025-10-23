document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.querySelector('#complete-permit-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            window.location.href = '/Modules/Usuario/CrearPT.html';
        });
    }
});

// Función simulada para compatibilidad
window.handleN8NFormSubmission = async function() {
    console.log('Modo de prueba: No se está usando n8n');
    return true; // Siempre retorna éxito
};