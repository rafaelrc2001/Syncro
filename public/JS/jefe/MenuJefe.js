document.addEventListener('DOMContentLoaded', function() {
    // 1. Mapeo de rutas para el menú del supervisor
    const menuRoutes = {
        'tablero': '/Modules/JefeSeguridad/Dash-Jefe.html',
        'autorizar permisos': '/Modules/JefeSeguridad/JefeSeguridad.html',
        'área': '/Modules/JefeSeguridad/CrearArea.html',
        'categoria': '/Modules/JefeSeguridad/CrearCategoria.html',
        'sucursal': '/Modules/JefeSeguridad/CrearSucursal.html',
        'departamento': '/Modules/JefeSeguridad/CrearDepartamento.html',
        'supervisor': '/Modules/JefeSeguridad/CrearSupervisor.html',
        'usuario': '/Modules/JefeSeguridad/CrearUsuario.html',
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

            // Si es un submenú, solo expandir el menú padre (sin marcarlo como activo)
            if (parentMenu) {
                parentMenu.classList.add('active'); // Solo para expandir, no para resaltar
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
    
    document.querySelectorAll('.submenu li a').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.submenu li').forEach(li => li.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });
});

