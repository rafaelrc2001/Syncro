document.addEventListener('DOMContentLoaded', function() {
    // Configurar fecha actual por defecto
    const permitDateField = document.getElementById('permit-date');
    if (permitDateField) {
        const today = new Date();
        permitDateField.value = today.toISOString().split('T')[0];
    }

    // Mostrar/ocultar campo de detalles del plomín según selección
    const usePlummetRadios = document.querySelectorAll('input[name="use-plummet"]');
    const plummetDetailsGroup = document.getElementById('plummet-details-group');
    
    usePlummetRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'SI') {
                plummetDetailsGroup.style.display = 'block';
                document.getElementById('plummet-details').required = true;
            } else {
                plummetDetailsGroup.style.display = 'none';
                document.getElementById('plummet-details').required = false;
            }
        });
    });

    // Calcular carga de prueba automáticamente cuando cambia la carga máxima
    const maxLoadField = document.getElementById('max-load');
    const testLoadField = document.getElementById('test-load');
    
    if (maxLoadField && testLoadField) {
        maxLoadField.addEventListener('input', function() {
            const maxLoad = parseFloat(this.value);
            if (!isNaN(maxLoad)) {
                const testLoad = Math.round(maxLoad * 1.25 * 100) / 100; // 1.25 x Carga Máxima
                testLoadField.value = testLoad;
            } else {
                testLoadField.value = '';
            }
        });
    }

    // Validar que la carga de trabajo no exceda la carga segura
    const safeLoadField = document.getElementById('safe-load');
    const workLoadField = document.getElementById('work-load');
    
    if (safeLoadField && workLoadField) {
        workLoadField.addEventListener('change', function() {
            const safeLoad = parseFloat(safeLoadField.value);
            const workLoad = parseFloat(this.value);
            
            if (!isNaN(safeLoad) && !isNaN(workLoad)) {
                if (workLoad > safeLoad) {
                    alert('¡ADVERTENCIA! La carga de trabajo excede la carga segura indicada en el diagrama de cargas.');
                    this.style.borderColor = '#ff4444';
                } else {
                    this.style.borderColor = '#dee2e6';
                }
            }
        });
    }

    // Validar que el peso de la carga no exceda la capacidad máxima de la cesta
    const basketMaxLoadField = document.getElementById('max-load');
    const loadWeightField = document.getElementById('load-weight');
    
    if (basketMaxLoadField && loadWeightField) {
        loadWeightField.addEventListener('change', function() {
            const maxLoad = parseFloat(basketMaxLoadField.value);
            const loadWeight = parseFloat(this.value);
            
            if (!isNaN(maxLoad) && !isNaN(loadWeight)) {
                if (loadWeight > maxLoad) {
                    alert('¡ADVERTENCIA! El peso de la carga (incluyendo ocupantes) excede la capacidad máxima de la cesta.');
                    this.style.borderColor = '#ff4444';
                } else {
                    this.style.borderColor = '#dee2e6';
                }
            }
        });
    }

    // Validar campos requeridos en la sección 2
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

        // Validar que se haya seleccionado si se usa plomín
        const usePlummetSelected = document.querySelector('input[name="use-plummet"]:checked');
        if (!usePlummetSelected) {
            isValid = false;
            alert('Por favor indique si se utiliza plomín.');
        }

        // Validar que se haya seleccionado la relación carga de trabajo/carga segura
        const loadRatioSelected = document.querySelector('input[name="load-ratio"]:checked');
        if (!loadRatioSelected) {
            isValid = false;
            alert('Por favor seleccione la relación carga de trabajo/carga segura.');
        }

        // Validar que la prueba previa haya sido realizada
        const testPerformedSelected = document.querySelector('input[name="test-performed"]:checked');
        if (!testPerformedSelected) {
            isValid = false;
            alert('Por favor indique si se realizó la prueba previa.');
        }

        if (!isValid) {
            alert('Por favor complete todos los campos requeridos antes de continuar.');
        }

        return isValid;
    }

    // Asignar validación al botón de siguiente de la sección 2
    const nextBtnSection2 = document.querySelector('.form-section[data-section="2"] .next-step');
    if (nextBtnSection2) {
        nextBtnSection2.addEventListener('click', function(e) {
            if (!validateSection2()) {
                e.preventDefault();
            }
        });
    }

    // Validar formato de números decimales
    const decimalFields = document.querySelectorAll('input[type="number"][step="0.01"]');
    decimalFields.forEach(field => {
        field.addEventListener('change', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value)) {
                this.value = Math.round(value * 100) / 100; // Redondear a 2 decimales
            }
        });
    });

    // Validar que las fechas sean coherentes
    const lastReviewField = document.getElementById('last-review');
    const testDateField = document.getElementById('test-date');
    
    if (lastReviewField && testDateField) {
        lastReviewField.addEventListener('change', function() {
            const reviewDate = new Date(this.value);
            const today = new Date();
            
            if (reviewDate > today) {
                alert('La fecha de última revisión no puede ser futura.');
                this.value = '';
            }
        });
        
        testDateField.addEventListener('change', function() {
            const testDate = new Date(this.value);
            const today = new Date();
            
            if (testDate > today) {
                alert('La fecha de prueba no puede ser futura.');
                this.value = '';
            }
        });
    }
});