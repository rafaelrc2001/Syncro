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

document.addEventListener('DOMContentLoaded', function () {
    // Inicialización de componentes
    initBackButton();
    initDateTimeFields();
    initMaintenanceTypeToggle();
    initEquipmentHandling();
    initNavigation();
    initAutocomplete();
    initParticipantsManagement();
    initActivitiesManagement();
    initFormSubmission();
    initModalHandling();
    initPrintButton();
    initCancelButton();
    initTableToggles();
    initRiskManagementToggles(); // Nueva función para los toggles de riesgo
});

// Función para manejar el botón de volver
function initBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            window.location.href = '/Modules/Usuario/CrearPT.html';
        });
    }
}

// Configurar fecha y hora actual por defecto
function initDateTimeFields() {
    // Configurar fecha actual
    const dateField = document.getElementById('permit-date');
    if (dateField) {
        const today = new Date();
        dateField.value = today.toISOString().split('T')[0];
    }

    // Configurar hora actual
    const timeField = document.getElementById('start-time');
    if (timeField) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeField.value = `${hours}:${minutes}`;
    }
}

// Manejar el campo de texto para "OTRO:" en "Tipo de Mantenimiento"
function initMaintenanceTypeToggle() {
    const otherMaintenanceRadio = document.getElementById('other-maintenance-radio');
    const otherMaintenanceTypeInput = document.getElementById('other-maintenance-type');

    if (otherMaintenanceRadio && otherMaintenanceTypeInput) {
        otherMaintenanceRadio.addEventListener('change', function () {
            if (this.checked) {
                otherMaintenanceTypeInput.disabled = false;
                otherMaintenanceTypeInput.focus();
            }
        });

        // Deshabilitar el campo si se selecciona otra opción
        document.querySelectorAll('input[name="maintenance-type"]:not([value="OTRO"])').forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.checked) {
                    otherMaintenanceTypeInput.disabled = true;
                    otherMaintenanceTypeInput.value = '';
                }
            });
        });
    }
}

// Manejar la lógica relacionada con equipos
function initEquipmentHandling() {
    const hasEquipmentYes = document.getElementById('has-equipment-yes');
    const equipmentDescriptionInput = document.getElementById('equipment-description');
    const equipmentToggle = document.getElementById('equipment-toggle');
    const equipmentConditions = document.getElementById('equipment-conditions');

    // Manejar campo de descripción de equipo
    if (hasEquipmentYes && equipmentDescriptionInput) {
        hasEquipmentYes.addEventListener('change', function () {
            if (this.checked) {
                equipmentDescriptionInput.disabled = false;
                equipmentDescriptionInput.focus();
            }
        });

        const hasEquipmentNo = document.querySelector('input[name="has-equipment"][value="no"]');
        if (hasEquipmentNo) {
            hasEquipmentNo.addEventListener('change', function () {
                if (this.checked) {
                    equipmentDescriptionInput.disabled = true;
                    equipmentDescriptionInput.value = '';
                }
            });
        }
    }

    // Manejar visibilidad de condiciones del equipo
    if (equipmentToggle && equipmentConditions) {
        equipmentToggle.addEventListener('change', function (event) {
            if (event.target.name === 'has-equipment') {
                equipmentConditions.style.display = event.target.value === 'no' ? 'none' : 'block';
            }
        });

        // Inicialmente ocultar si "No" está seleccionado
        const selectedOption = document.querySelector('input[name="has-equipment"]:checked');
        if (selectedOption && selectedOption.value === 'no') {
            equipmentConditions.style.display = 'none';
        }
    }
}

// Nueva función para manejar los toggles de riesgo
function initRiskManagementToggles() {
    // Toggle para protección contraincendio
    const fireProtectionRadios = document.querySelectorAll('input[name="fire-protection"]');
    const fireProtectionTypeInput = document.getElementById('fire-protection-type');
    
    if (fireProtectionRadios.length && fireProtectionTypeInput) {
        fireProtectionRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'SI' && this.checked) {
                    fireProtectionTypeInput.disabled = false;
                    fireProtectionTypeInput.focus();
                } else {
                    fireProtectionTypeInput.disabled = true;
                    if (!this.checked || this.value !== 'SI') {
                        fireProtectionTypeInput.value = '';
                    }
                }
            });
        });
        
        // Estado inicial
        const selectedFireProtection = document.querySelector('input[name="fire-protection"]:checked');
        if (selectedFireProtection && selectedFireProtection.value === 'SI') {
            fireProtectionTypeInput.disabled = false;
        } else {
            fireProtectionTypeInput.disabled = true;
            fireProtectionTypeInput.value = '';
        }
    }

    // Toggle para herramientas especiales
    const specialToolsRadios = document.querySelectorAll('input[name="special-tools"]');
    const specialToolsTypeInput = document.getElementById('special-tools-type');
    
    if (specialToolsRadios.length && specialToolsTypeInput) {
        specialToolsRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'SI' && this.checked) {
                    specialToolsTypeInput.disabled = false;
                    specialToolsTypeInput.focus();
                } else {
                    specialToolsTypeInput.disabled = true;
                    if (!this.checked || this.value !== 'SI') {
                        specialToolsTypeInput.value = '';
                    }
                }
            });
        });
        
        // Estado inicial
        const selectedSpecialTools = document.querySelector('input[name="special-tools"]:checked');
        if (selectedSpecialTools && selectedSpecialTools.value === 'SI') {
            specialToolsTypeInput.disabled = false;
        } else {
            specialToolsTypeInput.disabled = true;
            specialToolsTypeInput.value = '';
        }
    }
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

        // Desplazarse al inicio del formulario
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        return true;
    }
    return false;
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

// Inicializar la navegación entre secciones
function initNavigation() {
    // Navegación entre pasos (siguiente)
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', function (e) {
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
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const prevSectionNumber = this.getAttribute('data-prev');
            showSection(prevSectionNumber);
        });
    });
}

// Inicializar autocompletado para plantas
function initAutocomplete() {
    const plantInput = document.getElementById('plant');
    const suggestionsContainer = document.getElementById('plant-suggestions');
    const plantValue = document.getElementById('plant-value');
    
    if (!plantInput || !suggestionsContainer) return;
    
    plantInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        suggestionsContainer.innerHTML = '';
        
        if (value.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const filtered = plantSuggestions.filter(plant => 
            plant.toLowerCase().includes(value)
        );
        
        if (filtered.length > 0) {
            suggestionsContainer.style.display = 'block';
            filtered.forEach(plant => {
                const div = document.createElement('div');
                div.textContent = plant;
                div.addEventListener('click', function() {
                    plantInput.value = plant;
                    plantValue.value = plant;
                    suggestionsContainer.style.display = 'none';
                });
                suggestionsContainer.appendChild(div);
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!plantInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Ocultar sugerencias al presionar Escape
    plantInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Manejar añadir y eliminar participantes
function initParticipantsManagement() {
    const addParticipantBtn = document.getElementById('add-participant');
    const participantsContainer = document.querySelector('.participants-table');
    
    if (!addParticipantBtn || !participantsContainer) return;
    
    addParticipantBtn.addEventListener('click', function() {
        const participantCount = document.querySelectorAll('.participant-row').length;
        const newIndex = participantCount + 1;
        
        if (newIndex > 15) {
            alert('Máximo 15 participantes permitidos');
            return;
        }
        
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
    
    // Agregar eventos de eliminación a participantes existentes
    document.querySelectorAll('.remove-participant').forEach(btn => {
        btn.addEventListener('click', function() {
            const participantRow = this.closest('.participant-row');
            if (confirm('¿Está seguro de eliminar este participante?')) {
                participantRow.remove();
                renumberParticipants();
            }
        });
    });
}

// Manejar añadir y eliminar actividades AST
function initActivitiesManagement() {
    const addActivityBtn = document.getElementById('add-activity');
    const astActivitiesContainer = document.querySelector('.ast-activities');
    
    if (!addActivityBtn || !astActivitiesContainer) return;
    
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
                <textarea name="ast-activity-${newIndex}" rows="2" placeholder="Describa la actividad"></textarea>
            </div>
            <div class="ast-activity-field">
                <input type="text" name="ast-executor-${newIndex}" placeholder="Personal ejecutor">
            </div>
            <div class="ast-activity-field">
                <textarea name="ast-hazards-${newIndex}" rows="2" placeholder="Peligros potenciales"></textarea>
            </div>
            <div class="ast-activity-field">
                <textarea name="ast-preventions-${newIndex}" rows="2" placeholder="Acciones preventivas"></textarea>
            </div>
            <div class="ast-activity-field">
                <input type="text" name="ast-responsible-${newIndex}" placeholder="Responsable">
            </div>
            <div class="ast-activity-actions">
                <button type="button" class="action-btn remove-activity" title="Eliminar">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;
        
        astActivitiesContainer.appendChild(newActivity);
        
        // Agregar evento de eliminación
        newActivity.querySelector('.remove-activity').addEventListener('click', function() {
            if (confirm('¿Eliminar esta actividad?')) {
                newActivity.remove();
                renumberActivities();
            }
        });
    });
    
    // Función para renumerar actividades
    function renumberActivities() {
        document.querySelectorAll('.ast-activity').forEach((activity, index) => {
            const newIndex = index + 1;
            activity.setAttribute('data-index', newIndex);
            activity.querySelector('.ast-activity-number').textContent = newIndex;
            
            // Actualizar los nombres de los campos
            const fields = ['activity', 'executor', 'hazards', 'preventions', 'responsible'];
            fields.forEach(field => {
                const input = activity.querySelector(`[name^="ast-${field}"]`);
                if (input) {
                    input.name = `ast-${field}-${newIndex}`;
                }
            });
        });
    }
    
    // Agregar eventos de eliminación a actividades existentes
    document.querySelectorAll('.remove-activity').forEach(btn => {
        btn.addEventListener('click', function() {
            const activity = this.closest('.ast-activity');
            if (confirm('¿Eliminar esta actividad?')) {
                activity.remove();
                renumberActivities();
            }
        });
    });
}

// Generar número de permiso (función auxiliar)
function generatePermitNumber() {
    // Implementación básica - ajustar según necesidades
    const timestamp = new Date().getTime().toString().slice(-6);
    return `PT-${timestamp}`;
}

// Manejar envío del formulario
function initFormSubmission() {
    const form = document.getElementById('complete-permit-form');
    if (!form) return;
    
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
function initModalHandling() {
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
}

// Manejar botón de impresión en el formulario
function initPrintButton() {
    const printBtn = document.getElementById('print-complete-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            alert('Vista previa de impresión a implementar');
        });
    }
}

// Manejar botón de cancelar
function initCancelButton() {
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('¿Está seguro de cancelar este permiso? Todos los datos se perderán.')) {
                window.location.href = 'CrearPT.html';
            }
        });
    }
}

// Manejar contraer y desplegar secciones
function initTableToggles() {
    const toggleIcons = document.querySelectorAll('.toggle-icon');

    toggleIcons.forEach(icon => {
        // Iniciar expandidas por defecto (sin clase collapsed)
        const sectionTitle = icon.closest('.form-section-title');
        const targetId = sectionTitle.getAttribute('data-toggle-target');
        const targetSection = document.getElementById(targetId);
        
        // Remover clase collapsed si existe
        if (targetSection) {
            targetSection.classList.remove('collapsed');
        }
        
        icon.addEventListener('click', function() {
            const sectionTitle = this.closest('.form-section-title');
            const targetId = sectionTitle.getAttribute('data-toggle-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Alternar la clase collapsed para mostrar/ocultar
                targetSection.classList.toggle('collapsed');
                
                // Agregar clase de animación de giro
                this.classList.add('spin');
                
                // Remover la clase después de la animación
                setTimeout(() => {
                    this.classList.remove('spin');
                }, 300); // Mismo tiempo que la transición CSS
            }
        });
    });

    // Si quieres que inicien contraídas por defecto, cambia a:
    toggleIcons.forEach(icon => {
        const sectionTitle = icon.closest('.form-section-title');
        const targetId = sectionTitle.getAttribute('data-toggle-target');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.classList.add('collapsed');
            icon.classList.add('collapsed');
        }
    });
}