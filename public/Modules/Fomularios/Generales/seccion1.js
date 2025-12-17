// Autocompletado de planta dinámico desde /api/areas
let plantSuggestions = [];

// Autocompletado de departamento dinámico desde /api/departamentos
let departamentoSuggestions = [];

// === Cargar sugerencias de departamentos ===
async function fetchDepartamentoSuggestions() {
    try {
        const response = await fetch('/api/departamentos');
        const departamentos = await response.json();
        console.log('[FETCH DEPTOS] Departamentos recibidos:', departamentos);
        window.departamentos = departamentos; // Guardar departamentos globalmente para buscar el id
        departamentoSuggestions = departamentos.map(depto => depto.nombre);
        console.log('[FETCH DEPTOS] Sugerencias mapeadas:', departamentoSuggestions);
    } catch (err) {
        console.error('No se pudieron cargar los departamentos para autocompletado:', err);
    }
}

// === Cargar sugerencias de áreas ===
async function fetchPlantSuggestions(id_departamento = null) {
    try {
        // Al obtener las áreas del backend, filtrar por departamento si se proporciona
        let url = '/api/areas';
        if (id_departamento) {
            url = `/api/areas?id_departamento=${id_departamento}`;
        }
        console.log('[FETCH AREAS] URL:', url);
        const response = await fetch(url);
        console.log('[FETCH AREAS] Response status:', response.status);
        const areas = await response.json();
        console.log('[FETCH AREAS] Áreas recibidas:', areas);
        window.areas = areas; // Guardar áreas globalmente para buscar el id
        plantSuggestions = areas.map(area => area.nombre);
        console.log('[FETCH AREAS] Sugerencias mapeadas:', plantSuggestions);
    } catch (err) {
        console.error('[FETCH AREAS ERROR] No se pudieron cargar las áreas:', err);
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

// === Mostrar sugerencias dinámicas de departamento ===
function showDepartamentoSuggestions(input, suggestionsContainer) {
    const inputValue = input.value.toLowerCase();
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';

    if (inputValue.length === 0) return;

    const filteredSuggestions = departamentoSuggestions.filter(suggestion =>
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
            document.getElementById('departamento-value').value = suggestion;
            suggestionsContainer.style.display = 'none';
        });

        suggestionsContainer.appendChild(suggestionElement);
    });

    suggestionsContainer.style.display = 'block';
}

// === Inicializar el autocompletado de departamento ===
function initDepartamentoAutocomplete() {
    const departamentoInput = document.getElementById('departamento');
    const suggestionsContainer = document.getElementById('departamento-suggestions');

    if (!departamentoInput || !suggestionsContainer) return;

    const departamentoIdHidden = document.getElementById('departamento-id-hidden');

    departamentoInput.addEventListener('input', async function () {
        showDepartamentoSuggestions(this, suggestionsContainer);
        const selectedDepartamento = (window.departamentos || []).find(d => d.nombre === this.value);
        const warningId = 'departamento-warning';
        let warning = document.getElementById(warningId);
        
        if (selectedDepartamento) {
            sessionStorage.setItem('departamento_value', selectedDepartamento.id);
            if (departamentoIdHidden) departamentoIdHidden.value = selectedDepartamento.id;
            console.log('[DEBUG] departamento_value guardado:', selectedDepartamento.id);
            if (warning) warning.remove();
            
            // Recargar áreas filtradas por departamento
            await fetchPlantSuggestions(selectedDepartamento.id);
            
            // Limpiar el campo de ubicación ya que cambió el departamento
            const plantInput = document.getElementById('plant');
            if (plantInput) {
                plantInput.value = '';
                sessionStorage.setItem('plant_value', '');
                const plantIdHidden = document.getElementById('plant-id-hidden');
                if (plantIdHidden) plantIdHidden.value = '';
            }
        } else {
            sessionStorage.setItem('departamento_value', '');
            if (departamentoIdHidden) departamentoIdHidden.value = '';
            console.log('[DEBUG] departamento_value guardado: vacío');
            
            // Si no hay departamento válido, cargar todas las áreas
            await fetchPlantSuggestions();
            
            if (this.value.trim() && !warning) {
                warning = document.createElement('div');
                warning.id = warningId;
                warning.style.color = '#d9534f';
                warning.style.fontSize = '0.95em';
                warning.style.marginTop = '4px';
                warning.textContent = 'Debe seleccionar un departamento válido de la lista.';
                departamentoInput.parentNode.insertBefore(warning, departamentoInput.nextSibling);
            } else if (!this.value.trim() && warning) {
                warning.remove();
            }
        }
    });

    // Al perder el foco, si el valor no es válido, limpiar el input y advertencia
    departamentoInput.addEventListener('blur', function () {
        setTimeout(() => {
            const selectedDepartamento = (window.departamentos || []).find(d => d.nombre === this.value);
            const warning = document.getElementById('departamento-warning');
            
            if (!selectedDepartamento && this.value.trim()) {
                if (!warning) {
                    const w = document.createElement('div');
                    w.id = 'departamento-warning';
                    w.style.color = '#d9534f';
                    w.style.fontSize = '0.95em';
                    w.style.marginTop = '4px';
                    w.textContent = 'Debe seleccionar un departamento válido de la lista.';
                    departamentoInput.parentNode.insertBefore(w, departamentoInput.nextSibling);
                }
            } else if (warning && selectedDepartamento) {
                warning.remove();
            }
        }, 150);
    });

    // Al hacer click en sugerencia, guardar el id y limpiar advertencia
    suggestionsContainer.addEventListener('click', async function (e) {
        if (e.target.classList.contains('autocomplete-suggestion')) {
            const selectedDepartamento = (window.departamentos || []).find(d => d.nombre === e.target.textContent);
            if (selectedDepartamento) {
                departamentoInput.value = selectedDepartamento.nombre;
                sessionStorage.setItem('departamento_value', selectedDepartamento.id);
                if (departamentoIdHidden) departamentoIdHidden.value = selectedDepartamento.id;
                console.log('[DEBUG] departamento_value guardado (click):', selectedDepartamento.id);
                const warning = document.getElementById('departamento-warning');
                if (warning) warning.remove();
                
                // Recargar áreas filtradas por departamento
                await fetchPlantSuggestions(selectedDepartamento.id);
                
                // Limpiar el campo de ubicación ya que cambió el departamento
                const plantInput = document.getElementById('plant');
                if (plantInput) {
                    plantInput.value = '';
                    sessionStorage.setItem('plant_value', '');
                    const plantIdHidden = document.getElementById('plant-id-hidden');
                    if (plantIdHidden) plantIdHidden.value = '';
                }
            }
        }
    });

    // Cerrar sugerencias al hacer click afuera
    document.addEventListener('click', function (e) {
        if (e.target !== departamentoInput && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
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
            // Consultar correo por id_area y mostrar en consola
            obtenerCorreoPorArea(selectedArea.id_area || selectedArea.id);
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
                // Consultar correo por id_area y mostrar en consola
                obtenerCorreoPorArea(selectedArea.id_area || selectedArea.id);
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
                // Consultar correo por id_area y mostrar en consola
                obtenerCorreoPorArea(selectedArea.id_area || selectedArea.id);
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
                // Consultar correo por id_area y mostrar en consola
                obtenerCorreoPorArea(selectedArea.id_area || selectedArea.id);
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

// === Función para consultar correo por id_area ===
async function obtenerCorreoPorArea(id_area) {
    if (!id_area) {
        console.warn('No se proporcionó id_area para consultar correo');
        return;
    }
    try {
        const response = await fetch(`/api/correo-area?id_area=${id_area}`);
        if (!response.ok) throw new Error('No se pudo obtener el correo');
        const data = await response.json();
        if (data && data.correo) {
            window.correoDepartamento = data.correo;
            console.log('[CORREO DEPARTAMENTO]', data.correo);
        } else {
            window.correoDepartamento = null;
            console.warn('No se encontró correo para el área seleccionada');
        }
    } catch (err) {
        window.correoDepartamento = null;
        console.error('Error al consultar correo por área:', err);
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

// === Llenar automáticamente el nombre del responsable ===
function setDefaultApplicant() {
    const applicantField = document.getElementById('applicant');
    if (!applicantField) return;

    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario && usuario.nombre) {
            // Construir nombre completo: nombre + apellidop + apellidom
            const nombreCompleto = `${usuario.nombre} ${usuario.apellidop || ''} ${usuario.apellidom || ''}`.trim();
            applicantField.value = nombreCompleto;
            console.log('Responsable del trabajo establecido:', nombreCompleto);
        }
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
    }
}

// === Llenar automáticamente el nombre del departamento ===
async function setDefaultDepartment() {
    const departmentField = document.getElementById('subcontract');
    if (!departmentField) return;

    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (usuario && usuario.id_departamento) {
            // Consultar el nombre del departamento desde el backend
            const response = await fetch(`/api/departamento/${usuario.id_departamento}`);
            if (response.ok) {
                const data = await response.json();
                departmentField.value = data.nombre;
                console.log('Departamento establecido:', data.nombre);
            }
        }
    } catch (error) {
        console.error('Error al obtener departamento del usuario:', error);
    }
}

// === Inicializar todo ===
document.addEventListener('DOMContentLoaded', async () => {
    await fetchPlantSuggestions();
    await fetchDepartamentoSuggestions();
    initPlantAutocomplete();
    initDepartamentoAutocomplete();
    populateSucursales();
    initBackButton();
    setDefaultDateTime();
    setDefaultApplicant(); // Llenar automáticamente el responsable del trabajo
   // await setDefaultDepartment(); // Llenar automáticamente el nombre del departamento

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

