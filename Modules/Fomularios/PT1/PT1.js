
// Datos de ejemplo para el autocompletado de plantas
const plantSuggestions = [
    "Planta de Producción Principal",
    "Planta de Almacenamiento Norte",
    "Planta de Procesamiento Secundario",
    "Área de Mantenimiento General",
    "Sala de Máquinas 1",
    "Sala de Máquinas 2",
    "Zona de Almacenamiento de Materiales",
    "Área de Servicios Generales",
    "Planta de Tratamiento de Aguas",
    "Subestación Eléctrica"
];

// Función para mostrar sugerencias de autocompletado
function showPlantSuggestions(input, suggestionsContainer) {
    const inputValue = input.value.toLowerCase();
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none'; // Ocultar por defecto

    if (inputValue.length === 0) {
        return;
    }

    const filteredSuggestions = plantSuggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(inputValue)
    );

    if (filteredSuggestions.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'autocomplete-suggestion';
        noResults.textContent = 'No se encontraron resultados';
        suggestionsContainer.appendChild(noResults);
        suggestionsContainer.style.display = 'block';
        return;
    }

    filteredSuggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'autocomplete-suggestion';
        suggestionElement.textContent = suggestion;
        
        suggestionElement.addEventListener('click', function() {
            input.value = suggestion;
            document.getElementById('plant-value').value = suggestion;
            suggestionsContainer.style.display = 'none';
        });
        
        suggestionsContainer.appendChild(suggestionElement);
    });
    
    suggestionsContainer.style.display = 'block';
}

// Inicializar autocompletado para el campo de planta
function initPlantAutocomplete() {
    const plantInput = document.getElementById('plant');
    const suggestionsContainer = document.getElementById('plant-suggestions');
    
    if (!plantInput || !suggestionsContainer) return;

    // Mostrar sugerencias al escribir
    plantInput.addEventListener('input', function() {
        showPlantSuggestions(this, suggestionsContainer);
    });

    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (e.target !== plantInput && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });

    // Manejar teclado
    plantInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
        }
    });
}



// Manejar el toggle de equipo a intervenir con esto se esconden las etiquetas de equipo
function initEquipmentToggle() {
    const equipmentToggle = document.getElementById('equipment-toggle');
    const equipmentDetails = document.getElementById('equipment-details');
    const equipmentFields = [
        document.getElementById('equipment'),
        document.getElementById('tag'),
        document.getElementById('fluid'),
        document.getElementById('pressure'),
        document.getElementById('temperature')
    ];

    if (!equipmentToggle || !equipmentDetails || !equipmentFields.every(field => field)) return;
    
    const radioButtons = equipmentToggle.querySelectorAll('input[type="radio"]');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'no') {
                // Deshabilitar campos
                equipmentFields.forEach(field => {
                    field.disabled = true;
                    field.value = ''; // Limpiar los valores
                    field.required = false; // Quitar el requerido si lo tiene
                });
                
                // Cambiar estilo visual
                equipmentDetails.style.opacity = '0.6';
            } else {
                // Habilitar campos
                equipmentFields.forEach(field => {
                    field.disabled = false;
                    if (field.id === 'equipment') {
                        field.required = true; // Volver a poner requerido si es necesario
                    }
                });
                
                // Restaurar estilo visual
                equipmentDetails.style.opacity = '1';
            }
        });
    });
    
    // Ejecutar al cargar la página por si 'no' está seleccionado por defecto
    const selectedRadio = equipmentToggle.querySelector('input[type="radio"]:checked');
    if (selectedRadio && selectedRadio.value === 'no') {
        equipmentFields.forEach(field => {
            field.disabled = true;
            field.value = '';
            field.required = false;
        });
        equipmentDetails.style.opacity = '0.6';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const equipmentRadios = document.querySelectorAll('input[name="has-equipment"]');
    
    const equipmentFields = [
        document.getElementById('equipment').closest('.form-group'),
        document.getElementById('tag').closest('.form-group'),
        document.getElementById('equipment-conditions-title'),
        document.getElementById('equipment-conditions-grid')
    ];

    function toggleEquipmentFields() {
        const showEquipment = document.querySelector('input[name="has-equipment"]:checked').value === 'si';

        equipmentFields.forEach(element => {
            if (element) {
                element.style.display = showEquipment ? 'block' : 'none';
            }
        });

        const equipmentField = document.getElementById('equipment');
        if (equipmentField) {
            equipmentField.required = showEquipment;
        }
    }

    equipmentRadios.forEach(radio => {
        radio.addEventListener('change', toggleEquipmentFields);
    });

    toggleEquipmentFields();
});













document.addEventListener('DOMContentLoaded', function() {
    // Inicializar autocompletado de plantas
    initPlantAutocomplete();
    
    // Inicializar toggle de equipo
    initEquipmentToggle();
    
    // Manejar el botón de volver
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '/Modules/Usuario/CrearPT.html';
        });
    }

    // Configurar fecha actual por defecto
    const dateField = document.getElementById('permit-date');
    if (dateField) {
        const today = new Date();
        dateField.value = today.toISOString().split('T')[0];
    }

    // Configurar hora actual por defecto
    const timeField = document.getElementById('start-time');
    if (timeField) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeField.value = `${hours}:${minutes}`;
    }

    // Habilitar campos "OTRO" cuando se selecciona la opcións
    document.querySelectorAll('input[type="radio"][value="OTRO"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const otherInput = this.closest('.other-option').querySelector('.other-input');
            otherInput.disabled = !this.checked;
            if (this.checked) {
                otherInput.focus();
            }
        });
    });

    // Generar número de permiso (simulado)
    function generatePermitNumber() {
        const prefix = 'GSI-SI-FO-002';
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${randomNum}`;
    }

    // Función para mostrar una sección específica
    function showSection(sectionNumber) {
        // Ocultar todas las secciones
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección solicitada
        const targetSection = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Actualizar la barra de progreso
            updateProgressBar(parseInt(sectionNumber));
            
            // Desplazarse al inicio del formulario
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            return true;
        }
        return false;
    }

    // Función para actualizar la barra de progreso
    function updateProgressBar(currentStep) {
        // Remover la clase 'active' de todos los pasos
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Marcar como activos los pasos hasta el actual
        for (let i = 1; i <= currentStep; i++) {
            const step = document.querySelector(`.step[data-step="${i}"]`);
            if (step) {
                step.classList.add('active');
            }
        }
    }

    // Función para validar campos requeridos en la sección actual
    function validateCurrentSection(sectionNumber) {
        const section = document.querySelector(`.form-section[data-section="${sectionNumber}"]`);
        if (!section) return true;

        let isValid = true;
        const requiredFields = section.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ff4444';
                field.addEventListener('input', function() {
                    this.style.borderColor = '#dee2e6';
                }, { once: true });
            }
        });

        if (!isValid) {
            alert('Por favor complete todos los campos requeridos antes de continuar.');
        }

        return isValid;
    }

    // Inicializar la barra de progreso
    updateProgressBar(1);

    // Función para inicializar la navegación
    function initNavigation() {
        // Navegación entre pasos (siguiente)
        document.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const currentSection = this.closest('.form-section');
                const currentSectionNumber = currentSection.getAttribute('data-section');
                const nextSectionNumber = this.getAttribute('data-next');
                
                if (validateCurrentSection(currentSectionNumber)) {
                    showSection(nextSectionNumber);
                }
            });
        });

        // Navegación entre pasos (anterior)
        document.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const prevSectionNumber = this.getAttribute('data-prev');
                showSection(prevSectionNumber);
            });
        });
    }
    
    // Inicializar la navegación
    initNavigation();

    // Objeto para almacenar el valor actual de los campos de personal
    let currentPersonnelValue = '';

    // Función para actualizar todos los campos de personal
    function updateAllPersonnelFields(value) {
        // Actualizar el valor actual
        currentPersonnelValue = value;
        
        // Actualizar todos los campos existentes
        document.querySelectorAll('input[name^="ast-personnel-"]').forEach(input => {
            if (input.value !== value) {
                input.value = value;
            }
        });
    }

    // Función para sincronizar un campo individual
    function syncPersonnelField(input) {
        // Sincronizar con el valor actual si hay uno
        if (currentPersonnelValue) {
            input.value = currentPersonnelValue;
        }
        
        // Escuchar cambios en el campo
        input.addEventListener('input', function() {
            updateAllPersonnelFields(this.value);
        });
        
        // Sincronizar también cuando se pierde el foco
        input.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                updateAllPersonnelFields(this.value);
            }
        });
    }

    // Observador de mutaciones para detectar cuando se agregan nuevos campos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Verificar que es un nodo de elemento
                    // Buscar campos de personal en el nuevo nodo
                    const newInputs = node.querySelectorAll ? 
                        node.querySelectorAll('input[name^="ast-personnel-"]') : [];
                    
                    // Sincronizar cualquier campo nuevo encontrado
                    newInputs.forEach(input => {
                        if (!input.hasAttribute('data-synced')) {
                            input.setAttribute('data-synced', 'true');
                            syncPersonnelField(input);
                        }
                    });
                }
            });
        });
    });

    // Iniciar la observación del contenedor de actividades
    const activitiesContainer = document.querySelector('.ast-activities');
    if (activitiesContainer) {
        observer.observe(activitiesContainer, {
            childList: true,
            subtree: true
        });
    }

    // Sincronizar campos existentes al cargar la página
    document.querySelectorAll('input[name^="ast-personnel-"]').forEach(input => {
        input.setAttribute('data-synced', 'true');
        syncPersonnelField(input);
    });

    // Manejar añadir actividades AST
    const addActivityBtn = document.getElementById('add-activity');
    const astActivitiesContainer = document.querySelector('.ast-activities');
    
    if (addActivityBtn && astActivitiesContainer) {
        addActivityBtn.addEventListener('click', function() {
            const activityCount = document.querySelectorAll('.ast-activity').length;
            const newIndex = activityCount + 1;
            
            if (newIndex > 10) {
                alert('Máximo 10 actividades permitidas');
                return;
            }
            
            const newActivity = document.createElement('div');
            newActivity.className = 'ast-activity';
            newActivity.setAttribute('data-index', newIndex);
            newActivity.innerHTML = `
                <div class="ast-activity-number">${newIndex}</div>
                <div class="ast-activity-field">
                    <textarea name="ast-activity-${newIndex}" rows="2"></textarea>
                </div>
                <div class="ast-activity-field">
                                    <select name="ast-personnel-1">
                                        <option value="">-- Seleccione --</option>
                                        <option value="juan">Juan Pérez</option>
                                        <option value="maria">María López</option>
                                        <option value="carlos">Carlos Gómez</option>
                                        <option value="ana">Ana Martínez</option>
                                    </select>
                                </div>
                <div class="ast-activity-field">
                    <textarea name="ast-hazards-${newIndex}" rows="2"></textarea>
                </div>
                <div class="ast-activity-field">
                    <textarea name="ast-preventions-${newIndex}" rows="2"></textarea>
                </div>
                <div class="ast-activity-field">
                                    <select name="ast-personnel-1">
                                        <option value="">-- Seleccione --</option>
                                        <option value="juan">Juan Pérez</option>
                                        <option value="maria">María López</option>
                                        <option value="carlos">Carlos Gómez</option>
                                        <option value="ana">Ana Martínez</option>
                                    </select>
                                </div>
                <div class="ast-activity-actions">
                    <button type="button" class="action-btn remove-activity" title="Eliminar">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            `;
            
            astActivitiesContainer.appendChild(newActivity);
        });
    }

    // Manejar añadir participantes
    const addParticipantBtn = document.getElementById('add-participant');
    const participantsContainer = document.querySelector('.participants-table');
    
    if (addParticipantBtn && participantsContainer) {
        addParticipantBtn.addEventListener('click', function() {
            const participantCount = document.querySelectorAll('.participant-row').length;
            const newIndex = participantCount + 1;
            
  
            
            const newParticipant = document.createElement('div');
            newParticipant.className = 'participant-row';
            newParticipant.setAttribute('data-index', newIndex);
            newParticipant.innerHTML = `
                <div class="participant-number">${newIndex}</div>
                <div class="participant-field">
                    <input type="text" name="participant-name-${newIndex}" required>
                </div>
                <div class="participant-field">
                    <input type="text" name="participant-credential-${newIndex}">
                </div>
                <div class="participant-field">
                    <input type="text" name="participant-position-${newIndex}">
                </div>
                <div class="participant-field">
                    <select name="participant-role-${newIndex}" required>
                        <option value="">Seleccione...</option>
                        <option value="PARTICIPA">Participa</option>
                        <option value="REVISA">Revisa</option>
                        <option value="ANALIZA">Analiza</option>
                        <option value="AUTORIZA">Autoriza</option>
                    </select>
                </div>
                <div class="participant-actions">
                    <button type="button" class="action-btn remove-participant" title="Eliminar">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            `;
            
            participantsContainer.appendChild(newParticipant);
            
            // Agregar evento al botón de eliminar
            newParticipant.querySelector('.remove-participant').addEventListener('click', function() {
                if (confirm('¿Está seguro de eliminar este participante?')) {
                    newParticipant.remove();
                    // Renumerar los participantes restantes
                    renumberParticipants();
                }
            });
        });
        
        // Función para renumerar participantes
        function renumberParticipants() {
            document.querySelectorAll('.participant-row').forEach((row, index) => {
                const newIndex = index + 1;
                row.setAttribute('data-index', newIndex);
                row.querySelector('.participant-number').textContent = newIndex;
                
                // Actualizar los nombres de los campos
                const fields = ['name', 'credential', 'position', 'role'];
                fields.forEach(field => {
                    const input = row.querySelector(`input[name^="participant-${field}"], select[name^="participant-${field}"]`);
                    if (input) {
                        input.name = `participant-${field}-${newIndex}`;
                    }
                });
            });
        }
    }

    // Manejar envío del formulario
    const form = document.getElementById('complete-permit-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar toda la sección actual antes de enviar
            const currentSection = document.querySelector('.form-section.active');
            const currentSectionNumber = currentSection.getAttribute('data-section');
            
            if (!validateCurrentSection(currentSectionNumber)) {
                return;
            }
            
            // Generar número de permiso
            const permitNumber = generatePermitNumber();
            document.getElementById('generated-permit').textContent = permitNumber;
            
            // Mostrar modal de confirmación
            const modal = document.getElementById('confirmation-modal');
            modal.classList.add('active');
        });
    }

    // Manejar botones del modal
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalPrintBtn = document.getElementById('modal-print-btn');
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            document.getElementById('confirmation-modal').classList.remove('active');
        });
    }
    
    if (modalPrintBtn) {
        modalPrintBtn.addEventListener('click', function() {
            alert('Funcionalidad de impresión a implementar');
        });
    }

    // Manejar botón de impresión en el formulario
    const printBtn = document.getElementById('print-complete-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            alert('Vista previa de impresión a implementar');
        });
    }

    // Manejar botón de cancelar
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('¿Está seguro de cancelar este permiso? Todos los datos se perderán.')) {
                window.location.href = 'CrearPT.html';
            }
        });
    }

    // ESTA PARTE ES PARA EL BOTON DE ELIMINAR ESPECIFICAMENTE PARA LA PARTE DE LAS ACTIVIDADES
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-activity')) {
            const activityRow = e.target.closest('.ast-activity');
            if (activityRow) {
                activityRow.remove();
                // Renumber remaining activities
                document.querySelectorAll('.ast-activity').forEach((row, index) => {
                    row.setAttribute('data-index', index + 1);
                    row.querySelector('.ast-activity-number').textContent = index + 1;
                    // Update all input names with new index
                    row.querySelectorAll('[name^="ast-"]').forEach(input => {
                        const name = input.getAttribute('name');
                        const newName = name.replace(/ast-([a-z]+)-(\d+)/, (match, p1, p2) => `ast-${p1}-${index + 1}`);
                        input.setAttribute('name', newName);
                    });
                });
            }
        }
    });
});

