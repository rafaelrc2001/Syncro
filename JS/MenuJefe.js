document.addEventListener('DOMContentLoaded', function() {
    // 1. Mapeo de rutas para el menú del supervisor
    const menuRoutes = {
        'dashboard': '/Modules/JefeSeguridad/Dash-Jefe.html',
        'autorizar permisos': '/Modules/JefeSeguridad/JefeSeguridad.html',
        'registrar área': '/Modules/JefeSeguridad/CrearArea.html',
        'registrar departamento': '/Modules/JefeSeguridad/CrearDepartamento.html',
        'registrar supervisor': '/Modules/JefeSeguridad/CrearSupervisor.html'
    };
    

    // 2. Configuración dinámica del menú
    const menuItems = document.querySelectorAll('.sidebar-nav a');
    const currentPath = window.location.pathname.toLowerCase();
    
    // Función para marcar el ítem del menú activo basado en la ruta actual
    function setActiveMenuItem() {
        // Primero, quitar la clase 'active' de todos los elementos del menú
        menuItems.forEach(item => {
            const menuText = item.querySelector('span')?.textContent.toLowerCase();
            if (menuText && menuRoutes[menuText]) {
                const parentLi = item.parentElement;
                parentLi.classList.remove('active');
                
                // Si la ruta actual coincide con la ruta del menú, marcar como activo
                if (menuRoutes[menuText].toLowerCase() === currentPath) {
                    parentLi.classList.add('active');
                    
                    // Si es un submenú, marcar también el menú padre como activo
                    const parentMenu = parentLi.closest('.has-submenu');
                    if (parentMenu) {
                        parentMenu.classList.add('active');
                    }
                }
            }
        });
    }
    
    // Llamar a la función para marcar el ítem activo al cargar la página
    setActiveMenuItem();
    
    // Función para manejar la selección de elementos del menú
    function handleMenuItemClick(e) {
        const menuItem = e.currentTarget;
        const menuText = menuItem.querySelector('span')?.textContent.toLowerCase();
        const parentLi = menuItem.parentElement;
        const parentMenu = parentLi.closest('.has-submenu');
        
        // Si es el menú principal 'Registro', solo abrir/cerrar el submenú sin marcar como activo
        if (menuText === 'registro') {
            e.preventDefault();
            
            // Cerrar otros menús abiertos
            document.querySelectorAll('.has-submenu').forEach(menu => {
                if (menu !== parentLi) {
                    menu.classList.remove('active');
                }
            });
            
            // Solo alternar la visibilidad del submenú, no marcar como activo
            parentLi.classList.toggle('active');
            return;
        }
        
        // Para las opciones del menú que no son 'Registro'
        if (menuText && menuRoutes[menuText]) {
            // Quitar 'active' de todos los elementos del menú
            menuItems.forEach(item => {
                item.parentElement.classList.remove('active');
            });
            
            // Marcar el elemento actual como activo
            parentLi.classList.add('active');
            
            // Si es un submenú, marcar también el menú padre
            if (parentMenu) {
                // No marcar el menú 'Registro' como activo, solo el submenú
                parentMenu.classList.add('active');
                
                // Si el menú padre es 'Registro', quitamos la clase 'active' del enlace principal
                const registroLink = parentMenu.querySelector('a[href*="registro"]');
                if (registroLink) {
                    registroLink.parentElement.classList.remove('active');
                }
            }
        }
    }

    // Configurar los listeners para los elementos del menú
    menuItems.forEach(item => {
        const menuText = item.querySelector('span')?.textContent.toLowerCase();
        if (!menuText) return;
        
        // Configurar la ruta si existe en menuRoutes
        if (menuRoutes[menuText]) {
            item.setAttribute('href', menuRoutes[menuText]);
            item.addEventListener('click', handleMenuItemClick);
        } else {
            // Si no existe en menuRoutes, prevenir el comportamiento por defecto
            item.addEventListener('click', function(e) {
                if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                    e.preventDefault();
                }
            });
        }
    });

    // 2.1. Submenu toggle functionality
    const submenuToggles = document.querySelectorAll('.has-submenu > a');
    submenuToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            const parentLi = this.parentElement;
            const isActive = parentLi.classList.contains('active');
            
            // Cerrar otros submenús abiertos
            document.querySelectorAll('.has-submenu').forEach(item => {
                if (item !== parentLi) {
                    item.classList.remove('active');
                }
            });
            
            // Alternar el submenú actual
            parentLi.classList.toggle('active');
            
            // Prevenir la navegación si no hay href o es '#'
            if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
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