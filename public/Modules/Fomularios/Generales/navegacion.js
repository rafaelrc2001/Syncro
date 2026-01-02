// --- Funciones de navegación global ---

// Mostrar sección específica
function showSection(sectionNumber) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
    if (targetSection) {
        targetSection.classList.add('active');
        updateProgressBar(parseInt(sectionNumber));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
    }
    return false;
}

// Actualizar barra de progreso
function updateProgressBar(currentStep) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    for (let i = 1; i <= currentStep; i++) {
        const step = document.querySelector(`.step[data-step="${i}"]`);
        if (step) step.classList.add('active');
    }
}

// Validar campos requeridos en sección actual
function validateCurrentSection(sectionNumber) {
    const section = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
    if (!section) return true;

    let isValid = true;
    const requiredFields = section.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ff4444';
            field.addEventListener('input', function () {
                this.style.borderColor = '#dee2e6';
            }, { once: true });
        }
    });

    if (!isValid) {
        alert('Por favor complete todos los campos requeridos antes de continuar.');
    }

    return isValid;
}



// Esta va a ser la de insercion del estatus en automatico solo para la parte de la seccion 1 y con el id correspondiente
function initNavigation() {
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', async function (e) {
            e.preventDefault();
            const currentSection = this.closest('.form-section');
            const currentSectionNumber = currentSection.getAttribute('data-section');
            const nextSectionNumber = this.getAttribute('data-next');

            // Validar la sección actual
            if (!validateCurrentSection(currentSectionNumber)) {
                return;
            }

            // Validación especial: en sección 2, debe haber al menos un permiso seleccionado en el drag and drop
            if (parseInt(currentSectionNumber) === 2 && parseInt(nextSectionNumber) === 3) {
                const dropZone = document.getElementById('dropZone');
                if (dropZone) {
                    const permisosSeleccionados = dropZone.querySelectorAll('.added-form');
                    if (!permisosSeleccionados || permisosSeleccionados.length === 0) {
                        alert('Debe seleccionar al menos un permiso en el constructor de formato antes de continuar.');
                        return;
                    }
                }
            }

            // Validación especial: en sección 3, debe haber al menos un participante antes de pasar a la 4
            if (parseInt(currentSectionNumber) === 3 && parseInt(nextSectionNumber) === 4) {
                const participantes = document.querySelectorAll('.participant-row');
                if (!participantes || participantes.length === 0) {
                    alert('Debe agregar al menos un participante antes de continuar.');
                    return;
                }
            }

            // Solo cambiar de sección al hacer click en siguiente
            showSection(nextSectionNumber);
        });
    });

    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const prevSectionNumber = this.getAttribute('data-prev');
            showSection(prevSectionNumber);
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    updateProgressBar(1);
    initNavigation();
});
