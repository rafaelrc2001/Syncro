// Configuración específica para la Sección 2
function initSection2() {
    // Manejar campos "OTRO" en radio buttons
    const section2 = document.querySelector('.form-section[data-section="2"]');
    if (!section2) return;

    // Habilitar campos "OTRO" cuando se seleccionan
    section2.querySelectorAll('input[type="radio"][value="OTRO"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherInput = this.closest('.other-option').querySelector('.other-input');
            otherInput.disabled = !this.checked;
            if (this.checked) {
                otherInput.focus();
            }
        });
    });

    // Validación específica para la sección 2
    function validateSection2() {
        let isValid = true;
        const requiredFields = section2.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ff4444';
                field.addEventListener('input', function() {
                    this.style.borderColor = '#dee2e6';
                }, { once: true });
            }
        });

        // Validación adicional para radio buttons
        const radioGroups = ['plant', 'maintenance-type'];
        radioGroups.forEach(groupName => {
            const selected = section2.querySelector(`input[name="${groupName}"]:checked`);
            if (!selected) {
                isValid = false;
                const firstRadio = section2.querySelector(`input[name="${groupName}"]`);
                if (firstRadio) {
                    firstRadio.closest('.radio-group').style.border = '1px solid #ff4444';
                }
            }
        });

        // Validar campo "OTRO" si está seleccionado
        section2.querySelectorAll('input[type="radio"][value="OTRO"]:checked').forEach(radio => {
            const otherInput = radio.closest('.other-option').querySelector('.other-input');
            if (otherInput && !otherInput.value.trim()) {
                isValid = false;
                otherInput.style.borderColor = '#ff4444';
                otherInput.addEventListener('input', function() {
                    this.style.borderColor = '#dee2e6';
                }, { once: true });
            }
        });

        if (!isValid) {
            alert('Por favor complete todos los campos requeridos en la sección de Permiso para Apertura de Equipo o Línea.');
        }

        return isValid;
    }

    // Modificar el evento next-step para la sección 2
    const nextButtonSection2 = section2.querySelector('.next-step');
    if (nextButtonSection2) {
        nextButtonSection2.addEventListener('click', function(e) {
            if (validateSection2()) {
                // Guardar datos específicos de la sección 2 si es necesario
                console.log('Datos de la sección 2 validados:', {
                    plant: section2.querySelector('input[name="plant"]:checked')?.value,
                    maintenanceType: section2.querySelector('input[name="maintenance-type"]:checked')?.value,
                    workOrder: section2.querySelector('#work-order').value,
                    equipment: section2.querySelector('#equipment').value
                });
                
                // Continuar con la navegación normal
                const nextSectionNumber = this.getAttribute('data-next');
                showSection(nextSectionNumber);
            }
        });
    }
}

// Llamar a la inicialización de la sección 2 cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initSection2();
});