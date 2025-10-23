console.log('Script LogicaCrearPermiso.js cargado correctamente');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM completamente cargado');
    // Elementos del DOM
    const modal = document.getElementById('modalPermisos');
    const btnNuevoPermiso = document.getElementById('btnNuevoPermiso');
    const closeModal = document.querySelector('.close-modal');
    const cardsPermiso = document.querySelectorAll('.permiso-card');
    const btnsSeleccionar = document.querySelectorAll('.seleccionar-permiso');

    // Mostrar modal al hacer clic en el botón principal
    console.log('Buscando botón con ID btnNuevoPermiso');
    console.log('Elemento encontrado:', btnNuevoPermiso);
    
    if (btnNuevoPermiso) {
        console.log('Agregando event listener al botón');
        btnNuevoPermiso.addEventListener('click', function(e) {
            console.log('Botón clickeado');
            e.preventDefault();
            console.log('Modal antes de mostrar:', modal);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
            console.log('Modal después de intentar mostrar:', modal.style.display);
        });
    } else {
        console.error('No se encontró el botón con ID btnNuevoPermiso');
    }

    // Cerrar modal al hacer clic en la X
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Navegar al formulario correspondiente al seleccionar un permiso
    btnsSeleccionar.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default action for debugging
            
            console.log('Botón clickeado');
            const card = this.closest('.permiso-card');
            const ptId = card.getAttribute('data-pt');
            console.log('Data-pt value:', ptId);
            
            const ptUpper = ptId.toUpperCase();
            // Note: The folder is 'Fomularios' (with one 'r')
            const path = `/modules/Fomularios/${ptUpper}/${ptUpper}.html`;
            console.log('Intentando navegar a:', path);
            
            // Try with both absolute and relative paths
            const baseUrl = window.location.origin;
            const absolutePath = baseUrl + path;
            console.log('Ruta absoluta:', absolutePath);
            
            // Try navigating after a short delay to see the logs
            setTimeout(() => {
                window.location.href = path;
            }, 1000);
        });
    });

    // Efecto hover para las tarjetas
    cardsPermiso.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
    });
});
