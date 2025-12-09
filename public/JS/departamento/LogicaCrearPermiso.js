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

    // Relación entre data-pt y número de permiso
    const permisoNumeros = {
        pt1: 1,
        pt2: 2,
        pt3: 3,
        pt4: 4,
        pt5: 5,
        pt6: 6,
        pt7: 7,
        pt8: 8,
        pt9: 9,
        pt10: 10
    };

    btnsSeleccionar.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.permiso-card');
            const ptId = card.getAttribute('data-pt');
            const numeroPermiso = permisoNumeros[ptId];
            console.log('Número de permiso seleccionado:', numeroPermiso);

            // Guardar en sessionStorage
            sessionStorage.setItem('id_tipo_permiso', numeroPermiso);

            const ptUpper = ptId.toUpperCase();
            const path = `/Modules/Fomularios/${ptUpper}/${ptUpper}.html`;
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
