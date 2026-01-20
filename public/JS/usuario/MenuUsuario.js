document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // 1. USUARIO, AVATAR Y DATOS
  // ===============================
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario && usuario.nombre && usuario.id_usuario) {
    // Nombre del usuario
    document.querySelectorAll(".user-info .name").forEach((el) => {
      el.textContent = `${usuario.nombre} ${usuario.apellidop || ""} ${usuario.apellidom || ""}`.trim();
    });

    // Avatar con iniciales
    const avatarDiv = document.querySelector(".user-profile .avatar");
    if (avatarDiv) {
      const partes = usuario.nombre.trim().split(" ");
      avatarDiv.textContent =
        partes.length === 1
          ? partes[0].substring(0, 2).toUpperCase()
          : (partes[0][0] + partes[1][0]).toUpperCase();
    }

    // Rol (si aplica)
    document.querySelectorAll(".user-info .role").forEach((el) => {
      el.textContent = usuario.apellidoP || "";
    });

    console.log(
      `Entraste como usuario ${usuario.nombre} con el id_usuario: ${usuario.id_usuario}`
    );
  }

  // ===============================
  // 2. LOGOUT (UNA SOLA VEZ)
  // ===============================
  const logoutBtn = document.querySelector(".logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
      const confirmar = confirm("¿Estás seguro que deseas cerrar sesión?");
      if (!confirmar) return;

      console.log("Cerrando sesión...");

      localStorage.removeItem("sidebarCollapsed");

      if (typeof cerrarSesion === "function") {
        await cerrarSesion();
      } else {
        localStorage.removeItem("usuario");
        window.location.href = "/login.html";
      }
    });
  }

  // ===============================
  // 3. RUTAS DEL MENÚ
  // ===============================
  const menuRoutes = {
    "tablero": "/Modules/Usuario/Dash-Usuario.html",
    "permisos": "/Modules/Usuario/CrearPT.html",
    "autorizar permisos": "/Modules/Usuario/AutorizarPT.html",
  };

  const menuItems = document.querySelectorAll(".sidebar-nav a");
  const currentPath = window.location.pathname.toLowerCase();

  menuItems.forEach((item) => {
    const span = item.querySelector("span");
    if (!span) return;

    const menuText = span.textContent.toLowerCase();

    if (menuRoutes[menuText]) {
      item.setAttribute("href", menuRoutes[menuText]);

      if (menuRoutes[menuText].toLowerCase() === currentPath) {
        item.parentElement.classList.add("active");
      }
    } else {
      item.addEventListener("click", (e) => e.preventDefault());
    }
  });

  // ===============================
  // 4. COLLAPSE SIDEBAR
  // ===============================
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

    if (localStorage.getItem("sidebarCollapsed") === "true") {
      sidebar.classList.add("collapsed");
    }
  }

  // ===============================
  // 5. FILTRO DE ESTATUS
  // ===============================
  const statusFilter = document.getElementById("status-filter");
  const tableBody = document.getElementById("table-body");
  const recordsCount = document.getElementById("records-count");

  if (statusFilter && tableBody && recordsCount) {
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    updateRecordsCount(rows.length);

    statusFilter.addEventListener("change", function () {
      const selectedStatus = this.value;

      rows.forEach((row) => {
        const statusBadge = row.querySelector(".status-badge");
        const rowStatus = statusBadge ? statusBadge.classList[1] : "";

        row.style.display =
          selectedStatus === "all" || rowStatus === selectedStatus
            ? ""
            : "none";
      });

      const visibles = rows.filter((row) => row.style.display !== "none");
      updateRecordsCount(visibles.length);
    });

    function updateRecordsCount(count) {
      recordsCount.textContent = count;
    }
  }

});

