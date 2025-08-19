// Autocompletado de planta dinámico desde /api/areas
let plantSuggestions = [];

// === Cargar sugerencias de áreas ===
async function fetchPlantSuggestions() {
    try {
        // Al obtener las áreas del backend
        const response = await fetch('http://localhost:3000/api/areas');
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

    plantInput.addEventListener('input', function () {
        showPlantSuggestions(this, suggestionsContainer);
        // Guardar el valor actual de planta en sessionStorage
        sessionStorage.setItem('plant_value', this.value);
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
    const areaSelect = document.getElementById('area');
    if (!areaSelect) {
        console.warn('No se encontró el select con id="area"');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/sucursales');
        if (!response.ok) throw new Error('Error al obtener sucursales');
        const sucursales = await response.json();
        console.log('Sucursales recibidas:', sucursales);

        // Limpiar opciones excepto el placeholder
        areaSelect.innerHTML = '<option value="" disabled selected>Seleccione una sucursal</option>';

        if (sucursales.length === 0) {
            const option = document.createElement('option');
            option.value = "";
            option.disabled = true;
            option.textContent = 'No hay sucursales registradas';
            areaSelect.appendChild(option);
        } else {
            sucursales.forEach(sucursal => {
                const option = document.createElement('option');
                option.value = sucursal.id_sucursal || sucursal.id;
                option.textContent = sucursal.nombre;
                areaSelect.appendChild(option);
            });
        }
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
            window.location.href = '/Modules/Usuario/CrearPT.html';
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

    const areaSelect = document.getElementById('area-select');
    areaSelect.addEventListener('change', function() {
        sessionStorage.setItem('plant_value', this.value); // this.value debe ser el id numérico
    });
});

