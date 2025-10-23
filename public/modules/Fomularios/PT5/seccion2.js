document.addEventListener('DOMContentLoaded', function() {
    // Configurar hora actual por defecto
    const timeField = document.getElementById('start-time');
    if (timeField) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeField.value = `${hours}:${minutes}`;
    }

    // Habilitar campos "OTRO" cuando se selecciona la opción
    document.querySelectorAll('input[type="radio"][value="OTRO"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherInput = this.closest('.other-option').querySelector('.other-input');
            otherInput.disabled = !this.checked;
            if (this.checked) {
                otherInput.focus();
            }
        });
    });

    // Validación de campos requeridos para la sección 2
    function validateSection2() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('.form-section[data-section="2"] [required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ff4444';
                field.addEventListener('input', function() {
                    this.style.borderColor = '#dee2e6';
                }, { once: true });
            }
        });

        // Validar que al menos un radio button esté seleccionado en los grupos requeridos
        const radioGroups = [
            { name: 'plant', message: 'Por favor seleccione una planta o lugar de trabajo' },
            { name: 'maintenance-type', message: 'Por favor seleccione un tipo de mantenimiento' }
        ];

        radioGroups.forEach(group => {
            const selected = document.querySelector(`input[name="${group.name}"]:checked`);
            if (!selected) {
                isValid = false;
                alert(group.message);
            }
        });

        // Validación especial para campos condicionales
        document.querySelectorAll('.yes-no-na input[type="radio"][value="SI"]:checked').forEach(radio => {
            const parentGroup = radio.closest('.form-group');
            if (parentGroup) {
                const textInput = parentGroup.querySelector('input[type="text"]');
                if (textInput && !textInput.disabled && !textInput.value.trim()) {
                    isValid = false;
                    textInput.style.borderColor = '#ff4444';
                    textInput.addEventListener('input', function() {
                        this.style.borderColor = '#dee2e6';
                    }, { once: true });
                }
            }
        });

        // Validación para pruebas de gas
        const gasTestApproved = document.querySelector('input[name="gas-test-approved"]:checked');
        if (!gasTestApproved) {
            isValid = false;
            alert('Por favor indique si la prueba de gas fue aprobada');
        }

        return isValid;
    }

    // Manejar el botón siguiente de la sección 2
    const nextBtnSection2 = document.querySelector('.form-section[data-section="2"] .next-step');
    if (nextBtnSection2) {
        nextBtnSection2.addEventListener('click', function(e) {
            if (!validateSection2()) {
                e.preventDefault();
            }
        });
    }

    // Manejar campos de medidas de seguridad
    document.querySelectorAll('.yes-no-na input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const parentGroup = this.closest('.form-group');
            if (parentGroup) {
                // Habilitar campo de texto asociado si es necesario
                const textInput = parentGroup.querySelector('input[type="text"]');
                if (textInput) {
                    textInput.disabled = this.value !== 'SI';
                    if (this.value === 'SI') {
                        textInput.focus();
                    }
                }
            }
        });
    });

    // Validación de campos numéricos para pruebas de gas
    const gasTestFields = ['co2-level', 'nh3-level', 'oxygen-level', 'lel-level'];
    gasTestFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                if (this.value && isNaN(this.value)) {
                    this.style.borderColor = '#ff4444';
                    alert('Por favor ingrese un valor numérico válido');
                    this.focus();
                } else {
                    this.style.borderColor = '#dee2e6';
                }
            });
        }
    });

    // Manejar el botón de cancelar específico para la sección 2
    const cancelBtnSection2 = document.querySelector('.form-section[data-section="2"] .secondary');
    if (cancelBtnSection2) {
        cancelBtnSection2.addEventListener('click', function() {
            if (confirm('¿Está seguro de cancelar este permiso? Todos los datos se perderán.')) {
                window.location.href = '/modules/Usuario/CrearPT.html';
            }
        });
    }
});