document.addEventListener('DOMContentLoaded', function() {
    // Inicialización específica para la Sección 2 (Entrada a Espacios Confinados)
    const section2 = document.querySelector('.form-section[data-section="2"]');
    if (!section2) return;

    // Habilitar campos "OTRO" en radio buttons
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
        
        // Validar campos requeridos estándar
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ff4444';
                field.addEventListener('input', function() {
                    this.style.borderColor = '#dee2e6';
                }, { once: true });
            }
        });

        // Validación para radio buttons
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

        // Validar campos "OTRO" si están seleccionados
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

        // Validar campos de protección específica
        const protectionFields = ['skin-protection', 'respiratory-protection'];
        protectionFields.forEach(field => {
            const selected = section2.querySelector(`input[name="${field}"]:checked`);
            if (selected && selected.value === 'SI') {
                const typeField = section2.querySelector(`input[name="${field}-type"]`);
                if (typeField && !typeField.value.trim()) {
                    isValid = false;
                    typeField.style.borderColor = '#ff4444';
                    typeField.addEventListener('input', function() {
                        this.style.borderColor = '#dee2e6';
                    }, { once: true });
                }
            }
        });

        if (!isValid) {
            alert('Por favor complete todos los campos requeridos en la sección de Entrada a Espacios Confinados.');
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
                    equipment: section2.querySelector('#equipment').value,
                    gasTests: {
                        co2: section2.querySelector('#co2-level').value,
                        nh3: section2.querySelector('#nh3-level').value,
                        oxygen: section2.querySelector('#oxygen-level').value,
                        lel: section2.querySelector('#lel-level').value
                    }
                });
                
                // Continuar con la navegación normal
                const nextSectionNumber = this.getAttribute('data-next');
                showSection(nextSectionNumber);
            }
        });
    }

    // Función para mostrar sección (debe estar definida en el scope global o en navegacion.js)
    function showSection(sectionNumber) {
        // Implementación de la función showSection
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
        if (targetSection) {
            targetSection.classList.add('active');
            // Actualizar barra de progreso si es necesario
        }
    }
});