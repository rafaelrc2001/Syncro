document.addEventListener('DOMContentLoaded', function() {
    // URL base de la API
    const API_URL = '/api';
    
    // Elementos del DOM
    const registerBtn = document.getElementById('register-department-btn');
    const modal = document.getElementById('department-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const departmentForm = document.getElementById('department-form');
    const submitBtn = document.querySelector('.modal-body button[type="submit"]');
    
    // Estado global para controlar si estamos editando
    let editando = false;
    let departamentoId = null;

    // Open modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        if (departmentForm) {
            departmentForm.reset();
        }
        
        // Restaurar estado de edición
        if (editando) {
            editando = false;
            departamentoId = null;
            if (submitBtn) {
                submitBtn.textContent = 'Registrar Departamento';
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

    // Función para cargar los departamentos desde la API
    async function cargarDepartamentos() {
        try {
            const response = await fetch(`${API_URL}/departamentos`);
            if (!response.ok) throw new Error('Error al cargar los departamentos');
            
            const departamentos = await response.json();
            const tableBody = document.querySelector('#table-body');
            
            // Limpiar tabla
            tableBody.innerHTML = '';
            
            // Actualizar contador
            document.getElementById('records-count').textContent = departamentos.length;
            
            // Llenar tabla
            departamentos.forEach(depto => {
                const row = document.createElement('tr');
                row.dataset.id = depto.id;
                row.innerHTML = `
                    <td>${depto.nombre}</td>
                    <td>${depto.correo || ''}</td>
                    <td>${depto.extension || ''}</td>
                    <td>
                        <button class="action-btn edit" data-id="${depto.id}"><i class="ri-edit-line"></i></button>
                        <button class="action-btn delete" data-id="${depto.id}"><i class="ri-delete-bin-line"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Agregar event listeners a los botones
            agregarEventListenersBotones();
            
        } catch (error) {
            console.error('Error al cargar departamentos:', error);
            alert('Error al cargar los departamentos: ' + error.message);
        }
    }
    
    // Función para agregar event listeners a los botones de editar/eliminar
    function agregarEventListenersBotones() {
        // Eliminar event listeners anteriores
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Agregar nuevos event listeners
        document.addEventListener('click', manejarAccionesDepartamento);
    }
    
    // Función para manejar las acciones de los departamentos (editar/eliminar)
    async function manejarAccionesDepartamento(e) {
        // Editar
        if (e.target.closest('.action-btn.edit')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn.edit');
            const id = btn.dataset.id;
            
            try {
                const response = await fetch(`${API_URL}/departamentos/${id}`);
                if (!response.ok) throw new Error('Error al cargar el departamento');
                
                const departamento = await response.json();
                
                // Llenar el formulario
                document.getElementById('name').value = departamento.nombre || '';
                document.getElementById('email').value = departamento.correo || '';
                document.getElementById('extension').value = departamento.extension || '';
                
                // Cambiar el estado a edición
                editando = true;
                departamentoId = id;
                
                // Cambiar texto del botón
                submitBtn.textContent = 'Actualizar Departamento';
                
                // Abrir el modal
                modal.classList.add('active');
                
            } catch (error) {
                console.error('Error al cargar el departamento:', error);
                alert('Error al cargar el departamento: ' + error.message);
            }
        }
        
        // Eliminar
        if (e.target.closest('.action-btn.delete')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn.delete');
            const id = btn.dataset.id;
            
            if (confirm('¿Estás seguro que deseas eliminar este departamento?')) {
                try {
                    const response = await fetch(`${API_URL}/departamentos/${id}`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al eliminar el departamento');
                    }
                    
                    // Recargar la lista de departamentos
                    await cargarDepartamentos();
                    alert('Departamento eliminado exitosamente');
                    
                } catch (error) {
                    console.error('Error al eliminar el departamento:', error);
                    alert('Error al eliminar el departamento: ' + error.message);
                }
            }
        }
    }
    
    // Form submission
    if (departmentForm) {
        console.log('Formulario encontrado, agregando event listener...');
        
        departmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulario enviado');
            
            // Obtener valores del formulario
            const nombre = document.getElementById('name').value.trim();
            const correo = document.getElementById('email').value.trim();
            const extension = document.getElementById('extension').value.trim();
            // Cambiado de 'phone' a 'password' para que coincida con el ID correcto
            const contraseña = document.getElementById('password') ? document.getElementById('password').value : '';
            
            // Validaciones
            if (!nombre) {
                alert('El nombre del departamento es requerido');
                return;
            }
            
            if (!editando && !contraseña) {
                alert('La contraseña es requerida para nuevos departamentos');
                return;
            }
            
            try {
                let url = `${API_URL}/departamentos`;
                let method = 'POST';
                let bodyData = { nombre };
                
                // Agregar campos opcionales si tienen valor
                if (correo) bodyData.correo = correo;
                if (extension) bodyData.extension = extension;
                
                // Si estamos editando, actualizamos la URL, método y datos
                if (editando && departamentoId) {
                    url += `/${departamentoId}`;
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
                    throw new Error(errorData.error || 'Error al guardar el departamento');
                }
                
                // Cerrar el modal y limpiar el formulario
                closeModal();
                departmentForm.reset();
                
                // Recargar la lista de departamentos
                await cargarDepartamentos();
                
                // Mostrar mensaje de éxito
                alert(editando ? 'Departamento actualizado exitosamente' : 'Departamento registrado exitosamente');
                
                // Resetear estado de edición
                editando = false;
                departamentoId = null;
                submitBtn.textContent = 'Registrar Departamento';
                
            } catch (error) {
                console.error('Error al guardar el departamento:', error);
                alert('Error al guardar el departamento: ' + error.message);
            }
        });
    }

    // Cargar los departamentos al iniciar
    console.log('Iniciando carga de departamentos...');
    cargarDepartamentos().catch(error => {
        console.error('Error al cargar departamentos:', error);
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