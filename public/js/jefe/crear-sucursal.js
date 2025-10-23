document.addEventListener('DOMContentLoaded', function() {
    // URL base de la API
    const API_URL = '/api';
    
    // Elementos del DOM
    const registerBtn = document.getElementById('register-sucursal-btn');
    const modal = document.getElementById('sucursal-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const sucursalForm = document.getElementById('sucursal-form');
    const sucursalNameInput = document.getElementById('sucursal-name');
    const submitBtn = document.querySelector('.modal-body button[type="submit"]');
    
    // Estado global para controlar si estamos editando
    let editando = false;
    let sucursalId = null;

    // Open modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        if (sucursalForm) {
            sucursalForm.reset();
        }
        
        // Restaurar estado de edición
        if (editando) {
            editando = false;
            sucursalId = null;
            if (submitBtn) {
                submitBtn.textContent = 'Registrar Sucursal';
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

    // Función para cargar las sucursales desde la API
    async function cargarSucursales() {
        try {
            const response = await fetch(`${API_URL}/sucursales`);
            if (!response.ok) throw new Error('Error al cargar las sucursales');
            
            const sucursales = await response.json();
            const tableBody = document.querySelector('#table-body');
            
            // Limpiar tabla
            tableBody.innerHTML = '';
            
            // Actualizar contador
            document.getElementById('records-count').textContent = sucursales.length;
            
            // Llenar tabla
            sucursales.forEach(sucursal => {
                const row = document.createElement('tr');
                row.dataset.id = sucursal.id_sucursal;
                row.innerHTML = `
                    <td>${sucursal.nombre}</td>
                    <td>
                        <button class="action-btn edit" data-id="${sucursal.id_sucursal}"><i class="ri-edit-line"></i></button>
                        <button class="action-btn delete" data-id="${sucursal.id_sucursal}"><i class="ri-delete-bin-line"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Agregar event listeners a los botones
            agregarEventListenersBotones();
            
        } catch (error) {
            console.error('Error al cargar sucursales:', error);
            alert('Error al cargar las sucursales: ' + error.message);
        }
    }
    
    // Función para agregar event listeners a los botones de editar/eliminar
    function agregarEventListenersBotones() {
        // Eliminar event listeners anteriores
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Agregar nuevos event listeners
        document.addEventListener('click', manejarAccionesSucursal);
    }
    
    // Función para manejar las acciones de las sucursales (editar/eliminar)
    async function manejarAccionesSucursal(e) {
        // Editar
        if (e.target.closest('.action-btn.edit')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn.edit');
            const id = btn.dataset.id;
            
            try {
                const response = await fetch(`${API_URL}/sucursales/${id}`);
                if (!response.ok) throw new Error('Error al cargar la sucursal');
                
                const sucursal = await response.json();
                
                // Llenar el formulario
                sucursalNameInput.value = sucursal.nombre;
                
                // Cambiar el estado a edición
                editando = true;
                sucursalId = id;
                
                // Cambiar texto del botón
                submitBtn.textContent = 'Actualizar Sucursal';
                
                // Abrir el modal
                modal.classList.add('active');
                
            } catch (error) {
                console.error('Error al cargar la sucursal:', error);
                alert('Error al cargar la sucursal: ' + error.message);
            }
        }
        
        // Eliminar
        if (e.target.closest('.action-btn.delete')) {
            e.preventDefault();
            const btn = e.target.closest('.action-btn.delete');
            const id = btn.dataset.id;
            
            if (confirm('¿Estás seguro que deseas eliminar esta sucursal?')) {
                try {
                    const response = await fetch(`${API_URL}/sucursales/${id}`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Error al eliminar la sucursal');
                    }
                    
                    // Recargar la lista de sucursales
                    await cargarSucursales();
                    alert('Sucursal eliminada exitosamente');
                    
                } catch (error) {
                    console.error('Error al eliminar la sucursal:', error);
                    alert('Error al eliminar la sucursal: ' + error.message);
                }
            }
        }
    }
    
    // Form submission
    if (sucursalForm) {
        sucursalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nombre = sucursalNameInput.value.trim();
            
            if (!nombre) {
                alert('El nombre de la sucursal es requerido');
                return;
            }
            
            try {
                let url = `${API_URL}/sucursales`;
                let method = 'POST';
                
                // Si estamos editando, cambiamos la URL y el método
                if (editando && sucursalId) {
                    url += `/${sucursalId}`;
                    method = 'PUT';
                }
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nombre })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al guardar la sucursal');
                }
                
                // Cerrar el modal y limpiar el formulario
                closeModal();
                sucursalForm.reset();
                
                // Recargar la lista de sucursales
                await cargarSucursales();
                
                // Mostrar mensaje de éxito
                alert(editando ? 'Sucursal actualizada exitosamente' : 'Sucursal registrada exitosamente');
                
                // Resetear estado de edición
                editando = false;
                sucursalId = null;
                submitBtn.textContent = 'Registrar Sucursal';
                
            } catch (error) {
                console.error('Error al guardar la sucursal:', error);
                alert('Error al guardar la sucursal: ' + error.message);
            }
        });
    }

    // Cargar las sucursales al iniciar
    cargarSucursales();

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