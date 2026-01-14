document.addEventListener("DOMContentLoaded", function () {
  // --- Lógica de usuario, avatar y logout ---
  // Muestra el nombre del usuario, iniciales en el avatar y gestiona el cierre de sesión
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario && usuario.nombre && usuario.id_usuario) {
    // Nombre en el sidebar/footer
    document.querySelectorAll(".user-info .name").forEach((el) => {
      // Si tiene nombre y apellidos, úsalos; si no, usa usuario
      el.textContent = usuario.nombre
        ? `${usuario.nombre} ${usuario.apellidop || ""} ${
            usuario.apellidom || ""
          }`.trim()
        : usuario.usuario || "";
    });
    // Avatar con iniciales
    const avatarDiv = document.querySelector(".user-profile .avatar");
    if (avatarDiv && usuario.nombre) {
      const partes = usuario.nombre.trim().split(" ");
      let iniciales = "";
      if (partes.length === 1) {
        iniciales = partes[0].substring(0, 2).toUpperCase();
      } else {
        iniciales = (partes[0][0] + partes[1][0]).toUpperCase();
      }
      avatarDiv.textContent = iniciales;
    }
    // Mostrar el rol en la sidebar
    document.querySelectorAll(".user-info .role").forEach((el) => {
      el.textContent = usuario.apellidoP ? usuario.apellidoP : "";
    });
    // Mensaje de entrada por consola
    console.log(
      `Entraste como usuario ${usuario.nombre} con el id_usuario: ${usuario.id_usuario}`
    );
  }
  // Botón cerrar sesión
  const btnLogout = document.querySelector(".logout-btn");
  if (btnLogout) {
    btnLogout.addEventListener("click", async function () {
      if (usuario && usuario.nombre && usuario.id) {
        console.log(
          `Saliste del departamento ${usuario.nombre} con el id: ${usuario.id}`
        );
      }
      // Llamar a la función cerrarSesion de auth-check.js
      if (typeof cerrarSesion === "function") {
        await cerrarSesion();
      } else {
        // Fallback si auth-check.js no está cargado
        localStorage.removeItem("usuario");
        window.location.href = "/login.html";
      }
    });
  }
  // 1. Mapeo de rutas para el menú
  const menuRoutes = {
    "tablero": "/Modules/Usuario/Dash-Usuario.html",
    "permisos": "/Modules/Usuario/CrearPT.html",
    "autorizar permisos": "/Modules/Usuario/AutorizarPT.html",
    // Agregar más rutas según sea necesario
  };

  // 2. Configuración dinámica del menú
  const menuItems = document.querySelectorAll(".sidebar-nav a");
  const currentPath = window.location.pathname.toLowerCase();

  menuItems.forEach((item) => {
    const menuText = item.querySelector("span").textContent.toLowerCase();

    // Configurar la ruta si existe en menuRoutes
    if (menuRoutes[menuText]) {
      item.setAttribute("href", menuRoutes[menuText]);

      // Marcar como activo si coincide con la ruta actual
      if (menuRoutes[menuText].toLowerCase() === currentPath) {
        item.parentElement.classList.add("active");
      }
    } else {
      // Si no existe en menuRoutes, prevenir el comportamiento por defecto
      item.addEventListener("click", function (e) {
        e.preventDefault();
      });
    }
  });

  // 3. Sidebar Collapse Functionality
  const collapseBtn = document.querySelector(".collapse-btn");
  const sidebar = document.querySelector(".sidebar");

  if (collapseBtn && sidebar) {
    collapseBtn.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      localStorage.setItem(
        "sidebarCollapsed",
        sidebar.classList.contains("collapsed")
      );
    });

    // Check localStorage for collapsed state
    if (localStorage.getItem("sidebarCollapsed") === "true") {
      sidebar.classList.add("collapsed");
    }
  }

  // 4. Print Button Functionality - Manejado por LogicaImprimir.js
  // El manejo de los botones de impresión se ha movido a LogicaImprimir.js

  // 5. Logout button
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
        localStorage.removeItem("sidebarCollapsed");
        window.location.href = "/login.html";
      }
    });
  }

  // 6. Status filter functionality
  const statusFilter = document.getElementById("status-filter");
  const tableBody = document.getElementById("table-body");
  const recordsCount = document.getElementById("records-count");

  if (statusFilter && tableBody && recordsCount) {
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    // Initialize counter
    updateRecordsCount(rows.length);

    statusFilter.addEventListener("change", function () {
      const selectedStatus = this.value;

      rows.forEach((row) => {
        const statusBadge = row.querySelector(".status-badge");
        const rowStatus = statusBadge ? statusBadge.classList[1] : "";

        if (selectedStatus === "all" || rowStatus === selectedStatus) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });

      // Update counter
      const visibleRows = rows.filter((row) => row.style.display !== "none");
      updateRecordsCount(visibleRows.length);
    });

    function updateRecordsCount(count) {
      recordsCount.textContent = count;
    }
  }
});
