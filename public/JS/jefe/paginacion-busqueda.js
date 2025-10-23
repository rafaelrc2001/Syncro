// paginacion-busqueda.js
// Funciones reutilizables para paginación y búsqueda en tablas

/**
 * Filtra un array de objetos por un término de búsqueda en campos específicos.
 * @param {Array} data - Array de objetos a filtrar.
 * @param {string} term - Término de búsqueda.
 * @param {Array} fields - Campos a buscar (ej: ['nombre']).
 * @returns {Array} - Array filtrado.
 */
export function filtrarPorBusqueda(data, term, fields) {
    if (!term) return data;
    const lowerTerm = term.toLowerCase();
    return data.filter(item =>
        fields.some(field =>
            (item[field] || '').toString().toLowerCase().includes(lowerTerm)
        )
    );
}

/**
 * Devuelve los datos paginados para la página actual.
 * @param {Array} data - Array de objetos a paginar.
 * @param {number} paginaActual - Número de página (1-based).
 * @param {number} registrosPorPagina - Registros por página.
 * @returns {Array} - Array de objetos para la página.
 */
export function obtenerPagina(data, paginaActual, registrosPorPagina) {
    const inicio = (paginaActual - 1) * registrosPorPagina;
    return data.slice(inicio, inicio + registrosPorPagina);
}

/**
 * Renderiza los controles de paginación.
 * @param {HTMLElement} contenedor - Elemento donde poner los botones.
 * @param {number} totalRegistros - Total de registros.
 * @param {number} registrosPorPagina - Registros por página.
 * @param {number} paginaActual - Página actual.
 * @param {function} onPageChange - Callback al cambiar de página.
 */
export function renderizarPaginacion(contenedor, totalRegistros, registrosPorPagina, paginaActual, onPageChange) {
    contenedor.innerHTML = '';
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
    if (totalPaginas <= 1) return;
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = (i === paginaActual) ? 'active' : '';
        btn.addEventListener('click', () => onPageChange(i));
        contenedor.appendChild(btn);
    }
}
