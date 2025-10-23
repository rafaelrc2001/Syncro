// URL base de la API
const API_URL = '/api';

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    alert(message); // Muestra un popup simple como en los otros archivos
}

// Función para cargar las categorías desde la API
async function loadCategorias() {
    try {
        const response = await fetch(`${API_URL}/categorias`);
        if (!response.ok) throw new Error('Error al cargar las categorías');
        
        const categorias = await response.json();
        const tableBody = document.querySelector('#table-body');
        tableBody.innerHTML = ''; // Limpiar tabla
        
        categorias.forEach(categoria => {
            const row = document.createElement('tr');
            row.dataset.id = categoria.id;
            row.innerHTML = `
                <td>${categoria.nombre}</td>
                <td class="actions-cell">
                    <button class="action-btn edit" data-id="${categoria.id}"><i class="ri-edit-line"></i></button>
                    <button class="action-btn delete" data-id="${categoria.id}"><i class="ri-delete-bin-line"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Actualizar contador de registros
        document.getElementById('records-count').textContent = categorias.length;
        
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        showNotification('Error al cargar las categorías', 'error');
    }
}

// Función para crear o actualizar una categoría
async function saveCategoria(id, nombre) {
    const url = id ? `${API_URL}/categorias/${id}` : `${API_URL}/categorias`;
    const method = id ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre })
        });
        
        if (!response.ok) throw new Error('Error al guardar la categoría');
        
        const result = await response.json();
        showNotification(`Categoría ${id ? 'actualizada' : 'creada'} exitosamente`);
        loadCategorias(); // Recargar la lista
        return result;
        
    } catch (error) {
        console.error('Error al guardar categoría:', error);
        showNotification('Error al guardar la categoría', 'error');
        throw error;
    }
}

// Función para eliminar una categoría
async function deleteCategoria(id) {
    try {
        const response = await fetch(`${API_URL}/categorias/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar la categoría');
        
        showNotification('Categoría eliminada exitosamente');
        loadCategorias(); // Recargar la lista
        
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        showNotification('Error al eliminar la categoría', 'error');
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const registerBtn = document.getElementById('register-categoria-btn');
    const modal = document.getElementById('categoria-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const categoriaForm = document.getElementById('categoria-form');
    let isEditing = false;
    let currentId = null;

    // Cargar categorías al iniciar
    loadCategorias();

    // Abrir modal para nueva categoría
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            isEditing = false;
            currentId = null;
            document.querySelector('.modal-header h3').innerHTML = '<i class="ri-list-check"></i> Registrar Nueva Categoría';
            document.querySelector('.modal-body button[type="submit"]').innerHTML = '<i class="ri-save-line"></i> Registrar';
            categoriaForm.reset();
            modal.classList.add('active');
        });
    }

    // Cerrar modal
    function closeModal() {
        modal.classList.remove('active');
        categoriaForm.reset();
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // Enviar formulario
    if (categoriaForm) {
        categoriaForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('categoria-name').value.trim();
            if (!nombre) {
                showNotification('El nombre de la categoría es requerido', 'error');
                return;
            }
            
            try {
                await saveCategoria(currentId, nombre);
                closeModal();
            } catch (error) {
                // El error ya se maneja en la función saveCategoria
            }
        });
    }

    // Manejar clics en botones de editar y eliminar
    document.addEventListener('click', async function(e) {
        const editBtn = e.target.closest('.action-btn.edit');
        const deleteBtn = e.target.closest('.action-btn.delete');
        
        // Botón de editar
        if (editBtn) {
            e.preventDefault();
            const row = editBtn.closest('tr');
            currentId = row.dataset.id;
            const categoriaName = row.querySelector('td:first-child').textContent;
            
            document.getElementById('categoria-name').value = categoriaName;
            document.querySelector('.modal-header h3').innerHTML = '<i class="ri-edit-line"></i> Editar Categoría';
            document.querySelector('.modal-body button[type="submit"]').innerHTML = '<i class="ri-save-line"></i> Guardar Cambios';
            modal.classList.add('active');
        }
        
        // Botón de eliminar
        if (deleteBtn) {
            e.preventDefault();
            if (confirm('¿Estás seguro que deseas eliminar esta categoría?')) {
                const row = deleteBtn.closest('tr');
                const id = row.dataset.id;
                await deleteCategoria(id);
                recordsCount.textContent = currentCount - 1;
                
                alert('Categoria eliminada exitosamente');
            }
        }
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