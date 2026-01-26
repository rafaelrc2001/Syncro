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
        showGeneralErrorModal('Por favor complete todos los campos requeridos antes de continuar.');
    }

// Modal reutilizable para errores generales
function showGeneralErrorModal(msg) {
    let modal = document.getElementById("general-error-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "general-error-modal";
        modal.style.position = "fixed";
        modal.style.top = 0;
        modal.style.left = 0;
        modal.style.width = "100vw";
        modal.style.height = "100vh";
        modal.style.background = "rgba(0,0,0,0.6)";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.style.zIndex = 9999;
        modal.innerHTML = `
            <div style="background:#222;padding:2rem 2.5rem;border-radius:12px;box-shadow:0 2px 16px #0008;max-width:90vw;min-width:260px;text-align:center;">
              <div style="font-size:1.2rem;margin-bottom:1rem;color:#fff;">${msg}</div>
              <button id="close-general-error-modal" style="padding:0.5rem 1.5rem;font-size:1rem;background:#e74c3c;color:#fff;border:none;border-radius:5px;cursor:pointer;">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById("close-general-error-modal").onclick = () => {
            modal.remove();
        };
    } else {
        modal.querySelector("div").firstChild.textContent = msg;
        modal.style.display = "flex";
    }
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
                        showGeneralErrorModal('Debe seleccionar al menos un permiso en el constructor de formato antes de continuar.');
                        return;
                    }
                }
            }

            // Validación especial: en sección 3, debe haber al menos un participante antes de pasar a la 4
            if (parseInt(currentSectionNumber) === 3 && parseInt(nextSectionNumber) === 4) {
                const participantes = document.querySelectorAll('.participant-row');
                if (!participantes || participantes.length === 0) {
                    showGeneralErrorModal('Debe agregar al menos un participante antes de continuar.');
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
