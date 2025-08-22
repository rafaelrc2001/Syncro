document.addEventListener('DOMContentLoaded', function() {
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

    // Función para cargar las áreas desde la API
    async function cargarAreas() {
        try {
            const response = await fetch(`${API_URL}/areas`);
            if (!response.ok) throw new Error('Error al cargar las áreas');
            const areas = await response.json();
            
            tableBody.innerHTML = ''; // Limpiar tabla
            
            areas.forEach(area => {
                const newRow = document.createElement('tr');
                newRow.dataset.id = area.id;
                newRow.innerHTML = `
                    <td>${area.nombre}</td>
                    <td>
                        <button class="action-btn edit" data-id="${area.id}">
                            <i class="ri-edit-line"></i>
                        </button>
                        <button class="action-btn delete" data-id="${area.id}">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(newRow);
            });

            // Actualizar contador de registros
            if (recordsCount) {
                recordsCount.textContent = areas.length;
            }

            // Agregar event listeners a los botones
            agregarEventListenersBotones();
            
        } catch (error) {
            console.error('Error al cargar áreas:', error);
            alert('Error al cargar las áreas: ' + error.message);
        }
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
        // Botones de editar
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                try {
                    const response = await fetch(`${API_URL}/areas/${id}`);
                    if (!response.ok) throw new Error('Error al cargar el área');
                    const area = await response.json();
                    
                    // Llenar el formulario con los datos del área
                    areaIdInput.value = area.id;
                    areaNameInput.value = area.nombre;
                    
                    // Cambiar el texto del botón
                    submitBtn.textContent = 'Actualizar Área';
                    
                    // Mostrar el modal
                    modal.classList.add('active');
                } catch (error) {
                    console.error('Error al cargar el área:', error);
                    alert('Error al cargar el área: ' + error.message);
                }
            });
        });
        
        // Botones de eliminar
        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('¿Estás seguro de que quieres eliminar esta área?')) {
                    const id = e.currentTarget.dataset.id;
                    try {
                        const response = await fetch(`${API_URL}/areas/${id}`, {
                            method: 'DELETE'
                        });
                        
                        if (!response.ok) {
                            const error = await response.json();
                            throw new Error(error.error || 'Error al eliminar el área');
                        }
                        
                        // Recargar la lista de áreas
                        await cargarAreas();
                        alert('Área eliminada correctamente');
                    } catch (error) {
                        console.error('Error al eliminar el área:', error);
                        alert('Error al eliminar el área: ' + error.message);
                    }
                }
            });
        });
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