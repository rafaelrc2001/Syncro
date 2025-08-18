// Autocompletado de planta dinámico desde /api/areas
let plantSuggestions = [];

async function fetchPlantSuggestions() {
    try {
        const response = await fetch('http://localhost:3000/api/areas');
        if (!response.ok) throw new Error('Error al obtener áreas');
        const areas = await response.json();
        plantSuggestions = areas.map(area => area.nombre);
        console.log('Áreas para autocompletado:', plantSuggestions);
    } catch (err) {
        console.error('No se pudieron cargar las áreas para autocompletado:', err);
    }
}

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

function initPlantAutocomplete() {
    const plantInput = document.getElementById('plant');
    const suggestionsContainer = document.getElementById('plant-suggestions');

    if (!plantInput || !suggestionsContainer) return;

    plantInput.addEventListener('input', function () {
        showPlantSuggestions(this, suggestionsContainer);
    });

    document.addEventListener('click', function (e) {
        if (e.target !== plantInput && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });

    plantInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPlantSuggestions().then(() => {
        initPlantAutocomplete();
    });

    // Poblar sucursales dinámicamente
    async function populateSucursales() {
    // NOTA IMPORTANTE:
    // Si cambias el nombre de la columna id_area en tu tabla sucursales,
    // debes actualizar el nombre de la propiedad en este archivo (seccion1.js)
    // y también en el endpoint de listas.js donde se hace el SELECT.
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
                // Soporta ambos formatos: {id_sucursal, nombre} o {id, nombre}
                sucursales.forEach(sucursal => {
                    const option = document.createElement('option');
                    option.value = sucursal.id_sucursal|| sucursal.id;
                    option.textContent = sucursal.nombre;
                    areaSelect.appendChild(option);
                });
            }
        } catch (err) {
            console.error('No se pudieron cargar las sucursales:', err);
        }
    }
    populateSucursales();

    // Botón volver
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Limpiar el estado de inserción de estatus
            sessionStorage.removeItem('statusInserted');
            // Redirigir a la página de inicio
            window.location.href = '/Modules/Usuario/CrearPT.html';
        });
    }

    // Fecha por defecto
    const dateField = document.getElementById('permit-date');
    if (dateField) {
        const today = new Date();
        dateField.value = today.toISOString().split('T')[0];
    }

    // Hora por defecto
    const timeField = document.getElementById('start-time');
    if (timeField) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeField.value = `${hours}:${minutes}`;
    }
});
