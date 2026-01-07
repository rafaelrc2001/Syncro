document.addEventListener('DOMContentLoaded', function() {
    // 1. Mapeo de rutas para el menú del supervisor
    const menuRoutes = {
        'tablero': '/Modules/SupSeguridad/Dash-Supervisor.html',
        'autorizar permisos': '/Modules/SupSeguridad/SupSeguridad.html'
        // Rutas específicas para el rol de supervisor
    };

    // 2. Configuración dinámica del menú
    const menuItems = document.querySelectorAll('.sidebar-nav a');
    const currentPath = window.location.pathname.toLowerCase();
    
    menuItems.forEach(item => {
        const menuText = item.querySelector('span').textContent.toLowerCase();
        
        // Configurar la ruta si existe en menuRoutes
        if (menuRoutes[menuText]) {
            item.setAttribute('href', menuRoutes[menuText]);
            
            // Marcar como activo si coincide con la ruta actual
            if (menuRoutes[menuText].toLowerCase() === currentPath) {
                item.parentElement.classList.add('active');
            }
        } else {
            // Si no existe en menuRoutes, prevenir el comportamiento por defecto
            item.addEventListener('click', function(e) {
                e.preventDefault();
            });
        }
    });

    // 3. Sidebar Collapse Functionality
    const collapseBtn = document.querySelector('.collapse-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
        
        // Check localStorage for collapsed state
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            sidebar.classList.add('collapsed');
        }
    }
    
    // 4. Print Button Functionality - Manejado por LogicaImprimir.js
    // El manejo de los botones de impresión se ha movido a LogicaImprimir.js
    
    // 5. Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                localStorage.removeItem('sidebarCollapsed');
                // Llamar a la función cerrarSesion de auth-check.js
                if (typeof cerrarSesion === 'function') {
                    await cerrarSesion();
                } else {
                    // Fallback si auth-check.js no está cargado
                    window.location.href = '/login.html';
                }
            }
        });
    }
    
    // 6. Status filter functionality
    const statusFilter = document.getElementById('status-filter');
    const tableBody = document.getElementById('table-body');
    const recordsCount = document.getElementById('records-count');
    
    if (statusFilter && tableBody && recordsCount) {
        const rows = Array.from(tableBody.querySelectorAll('tr'));
        
        // Initialize counter
        updateRecordsCount(rows.length);
        
        statusFilter.addEventListener('change', function() {
            const selectedStatus = this.value;
            
            rows.forEach(row => {
                const statusBadge = row.querySelector('.status-badge');
                const rowStatus = statusBadge ? statusBadge.classList[1] : '';
                
                if (selectedStatus === 'all' || rowStatus === selectedStatus) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Update counter
            const visibleRows = rows.filter(row => row.style.display !== 'none');
            updateRecordsCount(visibleRows.length);
        });
        
        function updateRecordsCount(count) {
            recordsCount.textContent = count;
        }
    }
});