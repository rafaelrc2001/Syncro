// Almacenar sugerencias de TAGs
let tagSuggestions = [];

// === Cargar sugerencias de TAGs ===
async function fetchTagSuggestions() {
    try {
        const response = await fetch('/api/equipo/tags');
        const equipos = await response.json();
        window.equipos = equipos; // Guardar equipos globalmente
        tagSuggestions = equipos.map(equipo => equipo.tag);
    } catch (err) {
        console.error('No se pudieron cargar los tags para autocompletado:', err);
    }
}

// === Mostrar sugerencias dinámicas de TAG ===
function showTagSuggestions(input, suggestionsContainer) {
    const inputValue = input.value.toLowerCase();
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';

    if (inputValue.length === 0) return;

    const filteredSuggestions = tagSuggestions.filter(suggestion =>
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
            suggestionsContainer.style.display = 'none';
            
            // Buscar automáticamente la descripción
            const equipo = (window.equipos || []).find(e => e.tag === suggestion);
            if (equipo) {
                const equipmentInput = document.getElementById('equipment');
                if (equipmentInput) {
                    equipmentInput.value = equipo.descripcion;
                }
            }
        });

        suggestionsContainer.appendChild(suggestionElement);
    });

    suggestionsContainer.style.display = 'block';
}

// Función para buscar equipo por TAG
async function buscarEquipoPorTag(tag) {
    tag = tag ? tag.trim() : '';
    
    if (!tag || tag === '') {
        return null;
    }

    try {
        const response = await fetch(`/api/equipo/buscar-por-tag?tag=${encodeURIComponent(tag)}`);
        const data = await response.json();
        
        if (response.ok && data.descripcion) {
            return data.descripcion;
        } else {
            return null;
        }
    } catch (error) {
       
        return null;
    }
}

// Inicializar funcionalidad de búsqueda por TAG
function initTagSearch() {
    const tagInput = document.getElementById('tag');
    const equipmentInput = document.getElementById('equipment');
    const suggestionsContainer = document.getElementById('tag-suggestions');
    
    if (!tagInput || !equipmentInput) {
        console.warn('No se encontraron los campos tag o equipment');
        return;
    }

    // Crear contenedor de sugerencias si no existe
    if (!suggestionsContainer) {
        const container = document.createElement('div');
        container.id = 'tag-suggestions';
        container.className = 'autocomplete-suggestions';
        container.style.cssText = `
            position: absolute;
            border: 1px solid #ddd;
            background: white;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            width: ${tagInput.offsetWidth}px;
            display: none;
        `;
        tagInput.parentNode.style.position = 'relative';
        tagInput.parentNode.appendChild(container);
    }

    const finalSuggestionsContainer = document.getElementById('tag-suggestions');

    // Evento para mostrar sugerencias mientras se escribe
    tagInput.addEventListener('input', function () {
        showTagSuggestions(this, finalSuggestionsContainer);
    });

    // Evento cuando el usuario termina de escribir el TAG (blur o Enter)
    const buscarPorTag = async function() {
        const tag = tagInput.value.trim();
        
        if (tag === '') {
            equipmentInput.value = '';
            return;
        }

        // Primero verificar si existe en la lista cargada
        const selectedEquipo = (window.equipos || []).find(e => e.tag.toUpperCase() === tag.toUpperCase());
        
        if (selectedEquipo) {
            equipmentInput.value = selectedEquipo.descripcion;
            return;
        }

        // Si no está en la lista, buscar en el API
        equipmentInput.value = 'Buscando...';
        equipmentInput.disabled = true;

        try {
            const response = await fetch(`/api/equipo/buscar-por-tag?tag=${encodeURIComponent(tag)}`);
            const data = await response.json();
            
            equipmentInput.disabled = false;
            
            if (response.ok && data.descripcion) {
                equipmentInput.value = data.descripcion;
            } else {
                equipmentInput.value = '';
                alert('No se encontró ningún equipo con el TAG: ' + tag);
            }
        } catch (error) {
           
            equipmentInput.disabled = false;
            equipmentInput.value = '';
          
        }
    };

    // Buscar al perder el foco
    tagInput.addEventListener('blur', function() {
        setTimeout(buscarPorTag, 150);
    });

    // Al hacer click en sugerencia
    finalSuggestionsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('autocomplete-suggestion')) {
            const selectedEquipo = (window.equipos || []).find(eq => eq.tag === e.target.textContent);
            if (selectedEquipo) {
                tagInput.value = selectedEquipo.tag;
                equipmentInput.value = selectedEquipo.descripcion;
            }
        }
    });

    // También buscar cuando se presiona Enter
    tagInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            finalSuggestionsContainer.style.display = 'none';
            buscarPorTag();
        }
    });

    // Cerrar sugerencias al hacer click afuera
    document.addEventListener('click', function (e) {
        if (e.target !== tagInput && !finalSuggestionsContainer.contains(e.target)) {
            finalSuggestionsContainer.style.display = 'none';
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    await fetchTagSuggestions();
    initTagSearch();
});
