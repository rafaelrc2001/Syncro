// === Inicializar autocompletado combinado ===
async function initSubcontractAutocomplete() {
    const subcontractInput = document.getElementById('subcontract');
    if (!subcontractInput) {
        console.error('[SUBCONTRACT] No se encontró el input con id="subcontract"');
        return;
    }

    console.log('[SUBCONTRACT] Inicializando autocompletado...');

    // 1. Configurar atributos del input
    subcontractInput.setAttribute('autocomplete', 'off');
    subcontractInput.setAttribute('spellcheck', 'false');

    // 2. Crear contenedor de sugerencias si no existe
    let suggestionsContainer = document.getElementById('subcontract-suggestions');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'subcontract-suggestions';
        suggestionsContainer.className = 'autocomplete-suggestions';
        // Insertar después del input
        subcontractInput.parentNode.appendChild(suggestionsContainer);
    }

    // 3. Cargar datos combinados
    await fetchCombinedSuggestions();

    // 4. Establecer valor por defecto si no tiene
    if (!subcontractInput.value) {
        await setDefaultDepartment();
    }

    // Marcar si es valor por defecto
    if (subcontractInput.value) {
        subcontractInput.dataset.default = 'true';
        subcontractInput.dataset.originalValue = subcontractInput.value;
    }

    // 5. Evento de input - manejar escritura del usuario
    subcontractInput.addEventListener('input', function () {
        const currentValue = this.value.trim();
        const originalValue = this.dataset.originalValue || '';
        // Si el usuario empieza a modificar el valor por defecto
        if (this.dataset.default === 'true' && currentValue !== originalValue) {
            delete this.dataset.default;
            delete this.dataset.originalValue;
        }
        // Mostrar sugerencias
        showCombinedSuggestions(this, suggestionsContainer);
    });

    // 6. Evento de focus - seleccionar texto si es valor por defecto
    subcontractInput.addEventListener('focus', function () {
        if (this.dataset.default === 'true') {
            this.select();
        }
        // Si ya hay texto, mostrar sugerencias
        if (this.value.trim().length > 0 && this.dataset.default !== 'true') {
            showCombinedSuggestions(this, suggestionsContainer);
        }
    });

    // 7. Evento de blur - limpiar si está vacío o manejar texto libre
    subcontractInput.addEventListener('blur', function () {
        setTimeout(() => {
            const value = this.value.trim();
            // Si el usuario escribió algo pero no seleccionó sugerencia
            if (value && !allSuggestionsData.some(item => item.displayName === value)) {
                // Texto libre - guardar como proveedor por defecto
                sessionStorage.setItem('subcontract_type', 'texto_libre');
                sessionStorage.setItem('subcontract_nombre', value);
                console.log('[SUBCONTRACT] Texto libre guardado:', value);
            }
            // Ocultar sugerencias
            suggestionsContainer.style.display = 'none';
        }, 200);
    });

    // 8. Navegación con teclado
    subcontractInput.addEventListener('keydown', function (e) {
        const suggestions = suggestionsContainer.querySelectorAll('.autocomplete-suggestion');
        if (suggestions.length === 0) return;

        let activeSuggestion = suggestionsContainer.querySelector('.autocomplete-suggestion.active');
        let activeIndex = Array.from(suggestions).indexOf(activeSuggestion);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (activeSuggestion) activeSuggestion.classList.remove('active');
                const nextIndex = activeIndex < suggestions.length - 1 ? activeIndex + 1 : 0;
                suggestions[nextIndex].classList.add('active');
                suggestions[nextIndex].scrollIntoView({ block: 'nearest' });
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (activeSuggestion) activeSuggestion.classList.remove('active');
                const prevIndex = activeIndex > 0 ? activeIndex - 1 : suggestions.length - 1;
                suggestions[prevIndex].classList.add('active');
                suggestions[prevIndex].scrollIntoView({ block: 'nearest' });
                break;
            case 'Enter':
                e.preventDefault();
                if (activeSuggestion) {
                    activeSuggestion.click();
                }
                break;
            case 'Escape':
                suggestionsContainer.style.display = 'none';
                break;
        }
    });

    // 9. Cerrar al hacer click fuera
    document.addEventListener('click', function (e) {
        if (!subcontractInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });

    console.log('[SUBCONTRACT] Autocompletado inicializado correctamente');
}
// === Mostrar sugerencias combinadas de departamento o contratista ===
function showCombinedSuggestions(input, suggestionsContainer) {
    const inputValue = input.value.toLowerCase().trim();
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';

    // Si el input está vacío o es el valor por defecto, no mostrar
    if (inputValue.length === 0 || input.dataset.default === 'true') {
        return;
    }

    // Filtrar sugerencias
    const filteredData = allSuggestionsData.filter(item =>
        item.displayName.toLowerCase().includes(inputValue)
    );

    console.log('[SUBCONTRACT] Filtrado:', {
        inputValue,
        totalSugerencias: filteredData.length,
        sugerencias: filteredData.map(f => f.displayName)
    });

    // Si no hay resultados
    if (filteredData.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'autocomplete-suggestion no-results';
        noResults.textContent = 'No se encontraron resultados';
        suggestionsContainer.appendChild(noResults);
        suggestionsContainer.style.display = 'block';
        return;
    }

    // Agrupar por tipo
    const groupedByType = {
        departamento: filteredData.filter(item => item.tipo === 'departamento'),
        proveedor: filteredData.filter(item => item.tipo === 'proveedor')
    };

    // Crear sugerencias con agrupación visual
    Object.keys(groupedByType).forEach(tipo => {
        const items = groupedByType[tipo];
        if (items.length === 0) return;

        // Encabezado de grupo
        const groupHeader = document.createElement('div');
        groupHeader.className = 'autocomplete-group-header';
        groupHeader.textContent = tipo === 'departamento' ? 'Departamentos' : 'Proveedores';
        suggestionsContainer.appendChild(groupHeader);

        // Items del grupo
        items.forEach(item => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'autocomplete-suggestion';
            suggestionElement.dataset.tipo = item.tipo;
            suggestionElement.dataset.id = item.id || item.id_departamento || item.id_proveedor;
            // Crear contenido con icono según tipo
            const icon = item.tipo === 'departamento' ? '🏢' : '👨‍💼';
            suggestionElement.innerHTML = `
                <span class="suggestion-icon">${icon}</span>
                <span class="suggestion-text">${item.displayName}</span>
              
            `;


         /*   suggestionElement.innerHTML = `
                
                <span class="suggestion-text">${item.displayName}</span>
                <span class="suggestion-type">${item.tipo}</span>
            `;*/

            suggestionElement.addEventListener('click', function () {
                input.value = item.displayName;
                // Eliminar marca de valor por defecto
                delete input.dataset.default;
                // Guardar información según tipo
                if (item.tipo === 'departamento') {
                    sessionStorage.setItem('subcontract_type', 'departamento');
                    sessionStorage.setItem('subcontract_id', item.id || item.id_departamento);
                    sessionStorage.setItem('subcontract_nombre', item.displayName);
                } else {
                    sessionStorage.setItem('subcontract_type', 'proveedor');
                    sessionStorage.setItem('subcontract_id', item.id || item.id_proveedor);
                    sessionStorage.setItem('subcontract_nombre', item.displayName);
                }
                suggestionsContainer.style.display = 'none';
                console.log(`[SUBCONTRACT] ${item.tipo} seleccionado:`, item.displayName);
            });

            suggestionsContainer.appendChild(suggestionElement);
        });
    });

    suggestionsContainer.style.display = 'block';
}
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
        // Mostrar explícitamente los valores que se van a mapear
        departamentos.forEach((depto, idx) => {
            console.log(`[MAPEO DEPARTAMENTO][${idx}] id:`, depto.id || depto.id_departamento, ', nombre:', depto.nombre);
        });
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
      /*      const plantInput = document.getElementById('plant');
            if (plantInput) {
                plantInput.value = '';
                sessionStorage.setItem('plant_value', '');
                const plantIdHidden = document.getElementById('plant-id-hidden');
                if (plantIdHidden) plantIdHidden.value = '';
            }*/
        } else {
            sessionStorage.setItem('departamento_value', '');
            if (departamentoIdHidden) departamentoIdHidden.value = '';
            console.log('[DEBUG] departamento_value guardado: vacío');
            
            // Si no hay departamento válido, cargar todas las áreas
            await fetchPlantSuggestions();
          /*  
            if (this.value.trim() && !warning) {
                warning = document.createElement('div');
                warning.id = warningId;
                warning.style.color = '#d9534f';
                warning.style.fontSize = '0.95em';
                warning.style.marginTop = '4px';
                warning.textContent = 'Debe seleccionar un area de trabajo válida de la lista.';
                departamentoInput.parentNode.insertBefore(warning, departamentoInput.nextSibling);
            } else if (!this.value.trim() && warning) {
                warning.remove();
            }*/
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
            
            // Actualizar todos los campos que muestran el nombre del solicitante en los templates
            updateSolicitanteNombre(nombreCompleto);
            
            console.log('Responsable del trabajo establecido:', nombreCompleto);
        }
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
    }
}

// === Actualizar nombre del solicitante en todos los templates ===
function updateSolicitanteNombre(nombreCompleto) {
    // Actualizar todos los elementos con la clase 'solicitante-nombre'
    const elementos = document.querySelectorAll('.solicitante-nombre');
    elementos.forEach(elemento => {
        elemento.textContent = nombreCompleto;
    });
    
    // También observar cambios futuros cuando se agreguen formularios dinámicamente
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Es un elemento
                    const nuevosSolicitantes = node.querySelectorAll('.solicitante-nombre');
                    nuevosSolicitantes.forEach(elemento => {
                        elemento.textContent = nombreCompleto;
                    });
                }
            });
        });
    });
    
    // Observar cambios en la zona de drop donde se agregan formularios
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        observer.observe(dropZone, { childList: true, subtree: true });
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


const departmentField = document.getElementById('subcontract');
if (departmentField && !departmentField.value) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.departamento) {
        departmentField.value = usuario.departamento;
    }
}



// === Cargar sugerencias combinadas de departamentos y proveedores ===
async function fetchCombinedSuggestions() {
    try {
        console.log('[SUBCONTRACT] Cargando sugerencias combinadas...');
        
        // Cargar departamentos
        const deptResponse = await fetch('/api/departamentos');
        const departamentos = await deptResponse.json();
        
        // Cargar proveedores
        const provResponse = await fetch('/api/proveedores');
        const proveedores = await provResponse.json();
        
        console.log('[SUBCONTRACT] Departamentos cargados:', departamentos.length);
        console.log('[SUBCONTRACT] Proveedores cargados:', proveedores.length);
        
        // Guardar datos individualmente
        window.departamentos = departamentos;
        window.proveedores = proveedores;
        departamentoSuggestions = departamentos.map(d => d.nombre);
        proveedorSuggestions = proveedores.map(p => p.nombre);
        
        // Combinar y marcar tipo
        allSuggestionsData = [
            ...departamentos.map(depto => ({
                ...depto,
                tipo: 'departamento',
                displayName: depto.nombre
            })),
            ...proveedores.map(prov => ({
                ...prov,
                tipo: 'proveedor',
                displayName: prov.nombre
            }))
        ];
        
        subcontractSuggestions = allSuggestionsData.map(item => item.displayName);
        
        console.log('[SUBCONTRACT] Sugerencias combinadas:', subcontractSuggestions);
        console.log('[SUBCONTRACT] Datos completos:', allSuggestionsData);
        
        return allSuggestionsData;
        
    } catch (err) {
        console.error('[SUBCONTRACT] Error cargando sugerencias combinadas:', err);
        return [];
    }
}






// === Inicializar todo ===
document.addEventListener('DOMContentLoaded', async () => {
    await fetchPlantSuggestions();
    await fetchDepartamentoSuggestions();
    //initPlantAutocomplete(); // Autocompletado de ubicación deshabilitado para permitir texto libre
    initDepartamentoAutocomplete();
    populateSucursales();
    initBackButton();
    setDefaultDateTime();
    setDefaultApplicant(); // Llenar automáticamente el responsable del trabajo
    // await setDefaultDepartment(); // Llenar automáticamente el nombre del departamento
    await initSubcontractAutocomplete(); // Inicializar autocompletado combinado para subcontract
});




/* 
=============================
Funcion para consultar la aprte de los tags
=============================
*/


