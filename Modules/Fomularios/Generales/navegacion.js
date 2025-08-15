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

            // Verificar si ya se insertó el estatus en esta sesión
            const statusInserted = sessionStorage.getItem('statusInserted') === 'true';
            
            // Si no es la sección 1 o ya se insertó el estatus, solo cambiar de sección
            if (this.id !== 'seccion1' || statusInserted) {
                showSection(nextSectionNumber);
                return;
            }
            
            // Mostrar indicador de carga
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="ri-loader-4-line spin"></i> Procesando...';
            this.disabled = true;

            try {
                // Realizar la petición al endpoint
                const response = await fetch('http://localhost:3000/api/estatus/default', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                // Marcar como insertado en sessionStorage
                sessionStorage.setItem('statusInserted', 'true');
                // Cambiar a la siguiente sección después de una respuesta exitosa
                showSection(nextSectionNumber);
                return data;
            } catch (error) {
                console.error('Error en la petición:', error);
                let errorMessage = 'Error de conexión. ';
                
                if (error.name === 'TypeError') {
                    errorMessage += 'No se pudo conectar al servidor. Verifique que el servidor esté en ejecución.';
                } else if (error.message && error.message.includes('Failed to fetch')) {
                    errorMessage += 'No se pudo realizar la petición. Verifique su conexión a internet.';
                } else if (typeof error === 'string') {
                    errorMessage = error;
                } else {
                    errorMessage += `Detalles: ${error.message || error}`;
                }
                
                console.error('Detalles del error:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                
                throw errorMessage;
            } finally {
                this.innerHTML = originalHTML;
                this.disabled = false;
            }
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
