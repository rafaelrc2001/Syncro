document.addEventListener('DOMContentLoaded', function() {
    // URL base de la API
    const API_URL = '/api';
    
    // Elementos del DOM
    const registerBtn = document.getElementById('register-supervisor-btn');
    const modal = document.getElementById('supervisor-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const supervisorForm = document.getElementById('supervisor-form');
    const submitBtn = document.querySelector('.modal-body button[type="submit"]');
    
    // Estado global para controlar si estamos editando
    let editando = false;
    let supervisorId = null;

    // Open modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        if (supervisorForm) {
            supervisorForm.reset();
        }
        
        // Restaurar estado de edición
        if (editando) {
            editando = false;
            supervisorId = null;
            if (submitBtn) {
                submitBtn.textContent = 'Registrar Supervisor';
            }
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Función para cargar los supervisores desde la API
    async function cargarSupervisores() {
        try {
            const response = await fetch(`${API_URL}/supervisores`);
            if (!response.ok) throw new Error('Error al cargar los supervisores');
            
            const supervisores = await response.json();
            const tableBody = document.querySelector('#table-body');
            
            // Limpiar tabla
            tableBody.innerHTML = '';
            
            // Actualizar contador
            document.getElementById('records-count').textContent = supervisores.length;
            
            // Llenar tabla
            supervisores.forEach(supervisor => {
                const row = document.createElement('tr');
                row.dataset.id = supervisor.id;
                row.innerHTML = `
                    <td>${supervisor.nombre}</td>
                    <td>${supervisor.correo || ''}</td>
                    <td>${supervisor.extension || ''}</td>
                    <td>
                        <button class="action-btn edit" data-id="${supervisor.id}"><i class="ri-edit-line"></i></button>
                        <button class="action-btn delete" data-id="${supervisor.id}"><i class="ri-delete-bin-line"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Agregar event listeners a los botones
            agregarEventListenersBotones();
            
        } catch (error) {
            console.error('Error al cargar supervisores:', error);
            alert('Error al cargar los supervisores: ' + error.message);
        }
    }
    
    // Función para agregar event listeners a los botones de editar/eliminar
    function agregarEventListenersBotones() {
        // Eliminar event listeners anteriores
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Agregar nuevos event listeners
        document.addEventListener('click', manejarAccionesSupervisor);
    }
    
    // Función para manejar las acciones de los supervisores (editar/eliminar)
    async function manejarAccionesSupervisor(e) {
        // Editar
        if (e.target.closest('.action-btn.edit')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn.edit');
            const id = btn.dataset.id;
            
            try {
                const response = await fetch(`${API_URL}/supervisores/${id}`);
                if (!response.ok) throw new Error('Error al cargar el supervisor');
                
                const supervisor = await response.json();
                
                // Llenar el formulario
                document.getElementById('name').value = supervisor.nombre || '';
                document.getElementById('email').value = supervisor.correo || '';
                document.getElementById('extension').value = supervisor.extension || '';
                
                // Cambiar el estado a edición
                editando = true;
                supervisorId = id;
                
                // Cambiar texto del botón
                submitBtn.textContent = 'Actualizar Supervisor';
                
                // Abrir el modal
                modal.classList.add('active');
                
            } catch (error) {
                console.error('Error al cargar el supervisor:', error);
                alert('Error al cargar el supervisor: ' + error.message);
            }
        }
        
        // Eliminar
        if (e.target.closest('.action-btn.delete')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn.delete');
            const id = btn.dataset.id;
            
            if (confirm('¿Estás seguro que deseas eliminar este supervisor?')) {
                try {
                    const response = await fetch(`${API_URL}/supervisores/${id}`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al eliminar el supervisor');
                    }
                    
                    // Recargar la lista de supervisores
                    await cargarSupervisores();
                    alert('Supervisor eliminado exitosamente');
                    
                } catch (error) {
                    console.error('Error al eliminar el supervisor:', error);
                    alert('Error al eliminar el supervisor: ' + error.message);
                }
            }
        }
    }
    
    // Form submission
    if (supervisorForm) {
        supervisorForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombre = document.getElementById('name').value.trim();
            const correo = document.getElementById('email').value.trim();
            const extension = document.getElementById('extension').value.trim();
            const contraseña = document.getElementById('password').value;
            
            // Validaciones
            if (!nombre) {
                alert('El nombre del supervisor es requerido');
                return;
            }
            
            if (!editando && !contraseña) {
                alert('La contraseña es requerida para nuevos supervisores');
                return;
            }
            
            try {
                let url = `${API_URL}/supervisores`;
                let method = 'POST';
                let bodyData = { nombre };
                
                // Agregar campos opcionales si tienen valor
                if (correo) bodyData.correo = correo;
                if (extension) bodyData.extension = extension;
                
                // Si estamos editando, actualizamos la URL, método y datos
                if (editando && supervisorId) {
                    url += `/${supervisorId}`;
                    method = 'PUT';
                    // Solo incluimos la contraseña si se proporcionó una nueva
                    if (contraseña) {
                        bodyData.contraseña = contraseña;
                    }
                } else {
                    // Para creación, la contraseña es obligatoria
                    bodyData.contraseña = contraseña;
                }
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyData)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al guardar el supervisor');
                }
                
                // Cerrar el modal y limpiar el formulario
                closeModal();
                supervisorForm.reset();
                
                // Recargar la lista de supervisores
                await cargarSupervisores();
                
                // Mostrar mensaje de éxito
                alert(editando ? 'Supervisor actualizado exitosamente' : 'Supervisor registrado exitosamente');
                
                // Resetear estado de edición
                editando = false;
                supervisorId = null;
                submitBtn.textContent = 'Registrar Supervisor';
                
            } catch (error) {
                console.error('Error al guardar el supervisor:', error);
                alert('Error al guardar el supervisor: ' + error.message);
            }
        });
    }

    // Cargar los supervisores al iniciar
    cargarSupervisores().catch(error => {
        console.error('Error al cargar supervisores:', error);
    });
    
    // Update MenuJefe.js functionality for this page
    const currentPath = window.location.pathname.toLowerCase();
    const menuRoutes = {
       'dashboard': '/modules/JefeSeguridad/Dash-Jefe.html',
        'autorizar permisos': '/modules/JefeSeguridad/JefeSeguridad.html',
        'área': '/modules/JefeSeguridad/CrearArea.html',
        'categoria': '/modules/JefeSeguridad/CrearCategoria.html',
        'sucursal': '/modules/JefeSeguridad/CrearSucursal.html',
        'departamento': '/modules/JefeSeguridad/CrearDepartamento.html',
        'supervisor': '/modules/JefeSeguridad/CrearSupervisor.html'
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