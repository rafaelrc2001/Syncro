// Autocompletado de planta dinámico desde /api/areas
let plantSuggestions = [];

// === Cargar sugerencias de áreas ===
async function fetchPlantSuggestions() {
    try {
        // Al obtener las áreas del backend
        const response = await fetch('/api/areas');
        const areas = await response.json();
        window.areas = areas; // Guardar áreas globalmente para buscar el id
        plantSuggestions = areas.map(area => area.nombre);
        console.log('Áreas para autocompletado:', plantSuggestions);
    } catch (err) {
        console.error('No se pudieron cargar las áreas para autocompletado:', err);
    }
}

// === Mostrar sugerencias dinámicas ===
function showPlantSuggestions(input, suggestionsContainer) {
    const inputValue = input.value.toLowerCase();
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';

    if (inputValue.length === 0) return;

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

        suggestionElement.addEventListener('click', function () {
            input.value = suggestion;
            document.getElementById('plant-value').value = suggestion;
            suggestionsContainer.style.display = 'none';
        });

        suggestionsContainer.appendChild(suggestionElement);
    });

    suggestionsContainer.style.display = 'block';
}

// === Inicializar el autocompletado ===
function initPlantAutocomplete() {
    const plantInput = document.getElementById('plant');
    const suggestionsContainer = document.getElementById('plant-suggestions');

    if (!plantInput || !suggestionsContainer) return;



    const plantIdHidden = document.getElementById('plant-id-hidden');
    plantInput.addEventListener('input', function () {
        showPlantSuggestions(this, suggestionsContainer);
        const selectedArea = (window.areas || []).find(a => a.nombre === this.value);
        const warningId = 'plant-warning';
        let warning = document.getElementById(warningId);
        if (selectedArea) {
            sessionStorage.setItem('plant_value', selectedArea.id_area || selectedArea.id);
            if (plantIdHidden) plantIdHidden.value = selectedArea.id_area || selectedArea.id;
            console.log('[DEBUG] plant_value guardado:', selectedArea.id_area || selectedArea.id);
            if (warning) warning.remove();
        } else {
            sessionStorage.setItem('plant_value', '');
            if (plantIdHidden) plantIdHidden.value = '';
            console.log('[DEBUG] plant_value guardado: vacío');
            // Solo mostrar advertencia si el input no está vacío
            if (this.value.trim() && !warning) {
                warning = document.createElement('div');
                warning.id = warningId;
                warning.style.color = '#d9534f';
                warning.style.fontSize = '0.95em';
                warning.style.marginTop = '4px';
                warning.textContent = 'Debe seleccionar un área válida de la lista.';
                plantInput.parentNode.insertBefore(warning, plantInput.nextSibling);
            } else if (!this.value.trim() && warning) {
                warning.remove();
            }
        }
    });

    // Al perder el foco, si el valor no es válido, limpiar el input y advertencia
    plantInput.addEventListener('blur', function () {
        setTimeout(() => { // Esperar a que termine el click en sugerencia
            const selectedArea = (window.areas || []).find(a => a.nombre === this.value);
            const warning = document.getElementById('plant-warning');
            if (!selectedArea) {
                this.value = '';
                sessionStorage.setItem('plant_value', '');
                if (!warning) {
                    const w = document.createElement('div');
                    w.id = 'plant-warning';
                    w.style.color = '#d9534f';
                    w.style.fontSize = '0.95em';
                    w.style.marginTop = '4px';
                    w.textContent = 'Debe seleccionar un área válida de la lista.';
                    plantInput.parentNode.insertBefore(w, plantInput.nextSibling);
                }
            } else if (warning) {
                warning.remove();
            }
        }, 150);
    });

    // Al hacer click en sugerencia, guardar el id y limpiar advertencia
    suggestionsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('autocomplete-suggestion')) {
            const selectedArea = (window.areas || []).find(a => a.nombre === e.target.textContent);
            if (selectedArea) {
                plantInput.value = selectedArea.nombre;
                sessionStorage.setItem('plant_value', selectedArea.id_area || selectedArea.id);
                if (plantIdHidden) plantIdHidden.value = selectedArea.id_area || selectedArea.id;
                console.log('[DEBUG] plant_value guardado (click):', selectedArea.id_area || selectedArea.id);
                const warning = document.getElementById('plant-warning');
                if (warning) warning.remove();
            }
        }
    });
    // Quitar advertencia si se selecciona una sugerencia válida
    suggestionsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('autocomplete-suggestion')) {
            const selectedArea = (window.areas || []).find(a => a.nombre === plantInput.value);
            if (selectedArea) {
                sessionStorage.setItem('plant_value', selectedArea.id);
                const warning = document.getElementById('plant-warning');
                if (warning) warning.remove();
            } else {
                sessionStorage.setItem('plant_value', '');
            }
        }
    });

    // También guardar el valor cuando se selecciona una sugerencia
    suggestionsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('autocomplete-suggestion')) {
            const selectedArea = (window.areas || []).find(a => a.nombre === plantInput.value);
            if (selectedArea) {
                sessionStorage.setItem('plant_value', selectedArea.id);
            } else {
                sessionStorage.setItem('plant_value', '');
            }
        }
    });

    // Cerrar sugerencias al hacer click afuera
    document.addEventListener('click', function (e) {
        if (e.target !== plantInput && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// === Poblar sucursales dinámicamente ===
async function populateSucursales() {
    const sucursalSelect = document.getElementById('sucursal');
    if (!sucursalSelect) {
        console.warn('No se encontró el select con id="sucursal"');
        return;
    }

    try {
        const response = await fetch('/api/sucursales');
        if (!response.ok) throw new Error('Error al obtener sucursales');
        const sucursales = await response.json();
        console.log('Sucursales recibidas:', sucursales);

        // Limpiar opciones excepto el placeholder
        sucursalSelect.innerHTML = '<option value="" disabled selected>Seleccione una sucursal</option>';

        if (sucursales.length === 0) {
            const option = document.createElement('option');
            option.value = "";
            option.disabled = true;
            option.textContent = 'No hay sucursales registradas';
            sucursalSelect.appendChild(option);
        } else {
            sucursales.forEach(sucursal => {
                const option = document.createElement('option');
                option.value = sucursal.id_sucursal || sucursal.id;
                option.textContent = sucursal.nombre;
                sucursalSelect.appendChild(option);
            });
        }

        // Guardar el id de sucursal seleccionado en sessionStorage
        sucursalSelect.addEventListener('change', function() {
            sessionStorage.setItem('id_sucursal', this.value);
        });
    } catch (err) {
        console.error('No se pudieron cargar las sucursales:', err);
    }
}

// === Botón volver ===
function initBackButton() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Redirigir a la página de inicio sin lógica de bloqueo
            window.location.href = '/modules/Usuario/CrearPT.html';
        });
    }
}

// === Fecha y hora por defecto ===
function setDefaultDateTime() {
    const dateField = document.getElementById('permit-date');
    if (dateField) {
        const today = new Date();
        dateField.value = today.toISOString().split('T')[0];
    }

    const timeField = document.getElementById('start-time');
    if (timeField) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeField.value = `${hours}:${minutes}`;
    }
}

// === Inicializar todo ===
document.addEventListener('DOMContentLoaded', async () => {
    await fetchPlantSuggestions();
    initPlantAutocomplete();
    populateSucursales();
    initBackButton();
    setDefaultDateTime();

    // Lógica para enviar estatus al hacer click en siguiente de sección 1
    const nextBtn = document.querySelector('.next-step[data-next="2"]');
    if (nextBtn) {
        nextBtn.addEventListener('click', async function (e) {
            // Validar campos requeridos antes de enviar estatus
            const section = document.querySelector('.form-section[data-section="1"]');
            let isValid = true;
            if (section) {
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
            }
            if (!isValid) {
                alert('Por favor complete todos los campos requeridos antes de continuar.');
                e.preventDefault();
                return;
            }

            // Mostrar indicador de carga
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="ri-loader-4-line spin"></i> Procesando...';
            this.disabled = true;

            try {
                // Realizar la petición al endpoint de estatus
                const response = await fetch('/api/estatus/default', {
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

                // Después de recibir la respuesta exitosa del fetch
                const data = await response.json();
                if (data && data.data && data.data.id) {
                    sessionStorage.setItem('id_estatus', data.data.id);
                    poblarSelectParticipantes(); // <-- Llama aquí la función de la sección 4
                }

                // Si todo sale bien, dejar que navegacion.js cambie de sección
            } catch (error) {
                console.error('Error en la petición de estatus:', error);
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
                alert(errorMessage);
                e.preventDefault();
            } finally {
                this.innerHTML = originalHTML;
                this.disabled = false;
            }
        });
    }
});

