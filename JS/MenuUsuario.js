document.addEventListener('DOMContentLoaded', function() {
    // 1. Mapeo de rutas para el menú
    const menuRoutes = {
        'dashboard': '/Modules/Usuario/Dash-Usuario.html',
        'crear permisos': '/Modules/Usuario/CrearPT.html',
        'autorizar permisos': '/Modules/Usuario/AutorizarPT.html'
        // Agregar más rutas según sea necesario
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
    
    // 4. Print Button Functionality
    const printButtons = document.querySelectorAll('.action-btn.print');
    printButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const permitId = this.closest('tr').querySelector('td:first-child').textContent;
            alert(`Imprimiendo permiso: ${permitId}`);
        });
    });
    
    // 5. Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                localStorage.removeItem('sidebarCollapsed');
                window.location.href = '/login.html';
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