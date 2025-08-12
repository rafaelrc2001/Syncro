document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const registerBtn = document.getElementById('register-sucursal-btn');
    const modal = document.getElementById('sucursal-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const sucursalForm = document.getElementById('sucusal-form');

    // Open modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
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

    // Form submission
    if (sucursalForm) {
        sucursalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const sucursalName = document.getElementById('sucursal-name').value;
            const currentDate = new Date().toLocaleDateString();

            // Here you would typically send this data to a server
            console.log('Registrando Sucursal:', sucursalName);

            // For demo purposes, we'll just add to the table
            const tableBody = document.querySelector('#table-body');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${sucursalName}</td>
                <td>${currentDate}</td>
                <td>
                    <button class="action-btn edit"><i class="ri-edit-line"></i></button>
                    <button class="action-btn delete"><i class="ri-delete-bin-line"></i></button>
                </td>
            `;
            
            tableBody.appendChild(newRow);
            
            // Update records count
            const recordsCount = document.getElementById('records-count');
            const currentCount = parseInt(recordsCount.textContent);
            recordsCount.textContent = currentCount + 1;

            // Reset form and close modal
            sucursalForm.reset();
            closeModal();

            // Show success message
            alert('Sucursal registrada exitosamente');
        });
    }

    // Edit and delete functionality (delegated events)
    document.addEventListener('click', function(e) {
        // Edit button
        if (e.target.closest('.action-btn.edit')) {
            const row = e.target.closest('tr');
            const sucursalName = row.querySelector('td:first-child').textContent;
            
            // Fill modal with current values
            document.getElementById('sucursal-name').value = sucursalName;
            
            // Change modal title and button
            document.querySelector('.modal-header h3').innerHTML = '<i class="ri-edit-line"></i> Editar Área';
            document.querySelector('.modal-body button[type="submit"]').textContent = 'Guardar Cambios';
            
            // Open modal
            modal.classList.add('active');
            
            // Store reference to row being edited
            modal.dataset.editingRow = row.rowIndex;
        }
        
        // Delete button
        if (e.target.closest('.action-btn.delete')) {
            if (confirm('¿Estás seguro que deseas eliminar esta área?')) {
                const row = e.target.closest('tr');
                row.remove();
                
                // Update records count
                const recordsCount = document.getElementById('records-count');
                const currentCount = parseInt(recordsCount.textContent);
                recordsCount.textContent = currentCount - 1;
                
                alert('Sucursal eliminada exitosamente');
            }
        }
    });

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