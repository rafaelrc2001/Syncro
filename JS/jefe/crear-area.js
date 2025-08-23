document.addEventListener('DOMContentLoaded', function() {
    // Importar funciones reutilizables
    // Si usas módulos ES6, descomenta la siguiente línea y usa type="module" en tu HTML
    // import { filtrarPorBusqueda, obtenerPagina, renderizarPaginacion } from './paginacion-busqueda.js';

    // Variables para paginación y búsqueda
    let areasGlobal = [];
    let paginaActual = 1;
    const registrosPorPagina = 5;
    let terminoBusqueda = '';
    let paginacionContainer = document.getElementById('paginacion-container');
    let searchInput = document.getElementById('search-bar');
    // Elementos del DOM
    const registerBtn = document.getElementById('register-area-btn');
    const modal = document.getElementById('area-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const areaForm = document.getElementById('area-form');
    const tableBody = document.querySelector('#table-body');
    const areaNameInput = document.getElementById('area-name');
    const areaIdInput = document.getElementById('area-id');
    const submitBtn = document.getElementById('submit-btn');
    const recordsCount = document.getElementById('records-count');
    const departamentoSelect = document.getElementById('departamento-select');

    // URL base de la API
    const API_URL = 'http://localhost:3000/api';

    // Abrir modal para nueva área
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            areaForm.reset();
            areaIdInput.value = '';
            submitBtn.textContent = 'Registrar Área';
            modal.classList.add('active');
        });
    }

    // Cerrar modal
    function closeModal() {
        modal.classList.remove('active');
        areaForm.reset();
    }

    // Event listeners para cerrar modal
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // Cargar áreas al iniciar
    cargarAreas();

    // Event listener para búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            terminoBusqueda = searchInput.value;
            paginaActual = 1;
            renderizarTablaAreas();
        });
    }

    // Función para cargar las áreas desde la API
    async function cargarAreas() {
        try {
            const response = await fetch(`${API_URL}/areas`);
            if (!response.ok) throw new Error('Error al cargar las áreas');
            areasGlobal = await response.json();
            renderizarTablaAreas();
        } catch (error) {
            console.error('Error al cargar áreas:', error);
            alert('Error al cargar las áreas: ' + error.message);
        }
    }

    // Renderizar tabla con paginación y búsqueda
    function renderizarTablaAreas() {
        // Si usas módulos, importa filtrarPorBusqueda y obtenerPagina
        // const filtradas = filtrarPorBusqueda(areasGlobal, terminoBusqueda, ['nombre']);
        // const pagina = obtenerPagina(filtradas, paginaActual, registrosPorPagina);
        // ---
        // Como ejemplo sin import, replico la lógica aquí:
        let filtradas = areasGlobal;
        if (terminoBusqueda) {
            const lowerTerm = terminoBusqueda.toLowerCase();
            filtradas = areasGlobal.filter(area =>
                (area.nombre || '').toLowerCase().includes(lowerTerm)
            );
        }
        const inicio = (paginaActual - 1) * registrosPorPagina;
        const pagina = filtradas.slice(inicio, inicio + registrosPorPagina);

        tableBody.innerHTML = '';
        pagina.forEach(area => {
            const id = area.id_area !== undefined ? area.id_area : area.id;
            const newRow = document.createElement('tr');
            newRow.setAttribute('data-id', id);
            newRow.innerHTML = `
                <td>${area.nombre}</td>
                <td>
                    <button class="action-btn edit" data-id="${id}">
                        <i class="ri-edit-line"></i>
                    </button>
                    <button class="action-btn delete" data-id="${id}">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </td>
            `;
            // Refuerza que los botones tengan el data-id correcto
            const editBtn = newRow.querySelector('.action-btn.edit');
            const deleteBtn = newRow.querySelector('.action-btn.delete');
            if (editBtn) editBtn.setAttribute('data-id', id);
            if (deleteBtn) deleteBtn.setAttribute('data-id', id);
            tableBody.appendChild(newRow);
        });
        // Actualizar contador
        if (recordsCount) recordsCount.textContent = filtradas.length;
        // Renderizar paginación
        renderizarPaginacion(filtradas.length);
        agregarEventListenersBotones();
    }

    // Renderizar controles de paginación
    function renderizarPaginacion(totalRegistros) {
        if (!paginacionContainer) return;
        paginacionContainer.innerHTML = '';
        const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
        if (totalPaginas <= 1) return;
        // Botón anterior
        const btnPrev = document.createElement('button');
        btnPrev.className = 'pagination-btn';
        btnPrev.innerHTML = '<i class="ri-arrow-left-s-line"></i>';
        btnPrev.disabled = paginaActual === 1;
        btnPrev.addEventListener('click', () => {
            if (paginaActual > 1) {
                paginaActual--;
                renderizarTablaAreas();
            }
        });
        paginacionContainer.appendChild(btnPrev);
        // Botones de página
        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement('button');
            btn.className = 'pagination-btn' + (i === paginaActual ? ' active' : '');
            btn.textContent = i;
            btn.addEventListener('click', () => {
                paginaActual = i;
                renderizarTablaAreas();
            });
            paginacionContainer.appendChild(btn);
        }
        // Botón siguiente
        const btnNext = document.createElement('button');
        btnNext.className = 'pagination-btn';
        btnNext.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
        btnNext.disabled = paginaActual === totalPaginas || totalPaginas === 0;
        btnNext.addEventListener('click', () => {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizarTablaAreas();
            }
        });
        paginacionContainer.appendChild(btnNext);
    }

    // Cargar departamentos en el desplegable
    async function cargarDepartamentosDesplegable() {
        try {
            const response = await fetch(`${API_URL}/departamentos`);
            if (!response.ok) throw new Error('Error al cargar los departamentos');
            const departamentos = await response.json();
            departamentoSelect.innerHTML = '<option value="">-- Selecciona --</option>';
            departamentos.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep.id_departamento;
                option.textContent = dep.nombre;
                departamentoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar departamentos en el desplegable:', error);
            alert('Error al cargar los departamentos: ' + error.message);
        }
    }

    cargarDepartamentosDesplegable();

    // Función para manejar el envío del formulario
    if (areaForm) {
        areaForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nombre = areaNameInput.value.trim();
            const id_departamento = parseInt(departamentoSelect.value, 10);
            
            if (!nombre) {
                alert('El nombre del área es obligatorio');
                return;
            }
            if (!id_departamento) {
                alert('Debes seleccionar un departamento');
                return;
            }
            
            try {
                const url = `${API_URL}/areas`;
                const body = { nombre, id_departamento };
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Error al guardar el área');
                }
                
                // Recargar la lista de áreas
                await cargarAreas();
                
                // Cerrar el modal y limpiar el formulario
                closeModal();
                
                // Mostrar mensaje de éxito
                alert('Área creada correctamente');
                
            } catch (error) {
                console.error('Error al guardar el área:', error);
                alert('Error al guardar el área: ' + error.message);
            }
        });
    }
    
    // Función para agregar event listeners a los botones de editar/eliminar
    function agregarEventListenersBotones() {
        // Limpiar listeners previos
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        document.removeEventListener('click', manejarAccionesArea);
        document.addEventListener('click', manejarAccionesArea);
    }

    // Manejo global de acciones editar/eliminar área
    async function manejarAccionesArea(e) {
        // Editar
        if (e.target.closest('.action-btn.edit')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn.edit');
            const id = btn.dataset.id || btn.closest('tr')?.dataset.id;
            if (!id) {
                alert('No se pudo obtener el ID del área.');
                return;
            }
            try {
                const response = await fetch(`${API_URL}/areas/${id}`);
                if (!response.ok) throw new Error('Error al cargar el área');
                const area = await response.json();
                areaIdInput.value = area.id_area !== undefined ? area.id_area : area.id;
                areaNameInput.value = area.nombre;
                submitBtn.textContent = 'Actualizar Área';
                modal.classList.add('active');
            } catch (error) {
                console.error('Error al cargar el área:', error);
                alert('Error al cargar el área: ' + error.message);
            }
        }
        // Eliminar
        if (e.target.closest('.action-btn.delete')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn.delete');
            const id = btn.dataset.id || btn.closest('tr')?.dataset.id;
            console.log('Eliminar área:', { btn, id });
            if (!id || id === 'undefined' || id === '') {
                alert('No se pudo obtener el ID del área.');
                return;
            }
            if (confirm('¿Estás seguro de que quieres eliminar esta área?')) {
                try {
                    const response = await fetch(`${API_URL}/areas/${id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Error al eliminar el área');
                    }
                    await cargarAreas();
                    alert('Área eliminada correctamente');
                } catch (error) {
                    console.error('Error al eliminar el área:', error);
                    alert('Error al eliminar el área: ' + error.message);
                }
            }
        }
    }

    // Update MenuJefe.js functionality for this page
    const currentPath = window.location.pathname.toLowerCase();
    const menuRoutes = {
         'dashboard': '/Modules/JefeSeguridad/Dash-Jefe.html',
        'autorizar permisos': '/Modules/JefeSeguridad/JefeSeguridad.html',
        'área': '/Modules/JefeSeguridad/CrearArea.html',
        'categoria': '/Modules/JefeSeguridad/CrearCategoria.html',
        'sucursal': '/Modules/JefeSeguridad/CrearSucursal.html',
        'departamento': '/Modules/JefeSeguridad/CrearDepartamento.html',
        'supervisor': '/Modules/JefeSeguridad/CrearSupervisor.html'
    };

    // Mark active menu item
    const menuItems = document.querySelectorAll('.sidebar-nav a');
    menuItems.forEach(item => {
        const menuText = item.querySelector('span')?.textContent.toLowerCase();
        if (!menuText) return;
        
        if (menuRoutes[menuText] && menuRoutes[menuText].toLowerCase() === currentPath) {
            item.parentElement.classList.add('active');
            
            // If it's a submenu, open the parent menu
            const submenuItem = item.closest('.submenu');
            if (submenuItem) {
                const parentMenu = submenuItem.closest('.has-submenu');
                if (parentMenu) {
                    parentMenu.classList.add('active');
                }
            }
        }
    });
});