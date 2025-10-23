document.addEventListener('DOMContentLoaded', function() {
    // Configurar fecha actual por defecto para los campos de fecha en la sección 2
    const section2DateFields = document.querySelectorAll('section[data-section="2"] input[type="date"]');
    section2DateFields.forEach(field => {
        const today = new Date();
        field.value = today.toISOString().split('T')[0];
    });

    // Habilitar campos de texto cuando se selecciona "Otro" en radio buttons
    document.querySelectorAll('section[data-section="2"] input[type="radio"][value="OTRO"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherInput = this.closest('.other-option').querySelector('.other-input');
            otherInput.disabled = !this.checked;
            if (this.checked) {
                otherInput.focus();
            }
        });
    });

    // Mostrar/ocultar campos adicionales según selección de radio buttons
    const toggleDependentFields = (radioName, dependentSelector) => {
        document.querySelectorAll(`section[data-section="2"] input[name="${radioName}"]`).forEach(radio => {
            radio.addEventListener('change', function() {
                const dependentFields = document.querySelectorAll(dependentSelector);
                if (this.value === 'SI') {
                    dependentFields.forEach(field => field.style.display = 'block');
                } else {
                    dependentFields.forEach(field => field.style.display = 'none');
                }
            });
        });
    };

    // Configurar campos dependientes
    toggleDependentFields('slope-required', '.slope-dependent-fields');
    toggleDependentFields('berms-required', '.berms-dependent-fields');
    toggleDependentFields('shoring-required', '.shoring-dependent-fields');
    toggleDependentFields('fall-protection', '.fall-protection-fields');
    toggleDependentFields('special-signage', '.signage-details-field');

    // Validación específica para la sección 2
    function validateSection2() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('section[data-section="2"] [required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ff4444';
                field.addEventListener('input', function() {
                    this.style.borderColor = '#dee2e6';
                }, { once: true });
            }
        });

        // Validación adicional para campos condicionales
        const collapseRisk = document.querySelector('section[data-section="2"] input[name="collapse-risk"]:checked');
        if (collapseRisk && collapseRisk.value === 'SI') {
            const slopeRequired = document.querySelector('section[data-section="2"] input[name="slope-required"]:checked');
            if (!slopeRequired) {
                isValid = false;
                alert('Debe especificar si se requiere talud cuando hay riesgo de derrumbe');
            }
        }

        return isValid;
    }

    // Configurar navegación específica para la sección 2
    const section2NextBtn = document.querySelector('section[data-section="2"] .next-step');
    if (section2NextBtn) {
        section2NextBtn.addEventListener('click', function(e) {
            if (!validateSection2()) {
                e.preventDefault();
                alert('Por favor complete todos los campos requeridos en la sección 2 antes de continuar.');
            }
        });
    }

    // Manejar campos de instalaciones subterráneas
    document.querySelectorAll('section[data-section="2"] .facility-item input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const facilityItem = this.closest('.facility-item');
            const textInputs = facilityItem.querySelectorAll('input[type="text"]');
            
            if (this.value === 'SI') {
                textInputs.forEach(input => input.required = true);
            } else {
                textInputs.forEach(input => {
                    input.required = false;
                    input.value = '';
                });
            }
        });
    });

    // Configurar campos de fechas relacionadas
    const startDateField = document.querySelector('section[data-section="2"] input[name="start-date"]');
    const expectedEndField = document.querySelector('section[data-section="2"] input[name="expected-end"]');
    const validUntilField = document.querySelector('section[data-section="2"] input[name="valid-until"]');

    if (startDateField && expectedEndField && validUntilField) {
        startDateField.addEventListener('change', function() {
            const startDate = new Date(this.value);
            
            // Establecer fecha esperada de fin (1 día después por defecto)
            const expectedEndDate = new Date(startDate);
            expectedEndDate.setDate(expectedEndDate.getDate() + 1);
            expectedEndField.valueAsDate = expectedEndDate;
            
            // Establecer fecha de validez (7 días después por defecto)
            const validUntilDate = new Date(startDate);
            validUntilDate.setDate(validUntilDate.getDate() + 7);
            validUntilField.valueAsDate = validUntilDate;
        });
    }

    // Configurar campo de ampliación de permiso
    const extendedUntilField = document.querySelector('section[data-section="2"] input[name="extended-until"]');
    const extendedByField = document.querySelector('section[data-section="2"] input[name="extended-by"]');

    if (extendedUntilField && extendedByField) {
        extendedUntilField.addEventListener('focus', function() {
            if (!this.value) {
                const validUntil = new Date(validUntilField.value);
                validUntil.setDate(validUntil.getDate() + 1);
                this.valueAsDate = validUntil;
            }
        });
        
        extendedUntilField.addEventListener('change', function() {
            if (this.value && !extendedByField.value) {
                extendedByField.focus();
            }
        });
    }

    // Configurar campos de dimensiones
    const averageDepthField = document.querySelector('section[data-section="2"] input[name="average-depth"]');
    const maxDepthField = document.querySelector('section[data-section="2"] input[name="max-depth"]');

    if (averageDepthField && maxDepthField) {
        averageDepthField.addEventListener('change', function() {
            if (!maxDepthField.value || parseFloat(maxDepthField.value) < parseFloat(this.value)) {
                maxDepthField.value = this.value;
            }
        });
    }
});