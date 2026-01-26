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

    console.log(
      `Entraste al departamento ${usuario.nombre} con el id_usuario: ${usuario.id_usuario}`
    );
  }

  // ===============================
  // 2. LOGOUT (MODAL UNIFICADO)
  // ===============================
  if (!document.getElementById('logout-modal')) {
    const modal = document.createElement('div');
    modal.id = 'logout-modal';
    modal.innerHTML = `
      <div class="modal-overlay" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:9999;justify-content:center;align-items:center;">
        <div class="modal-content" style="background:#fff;padding:2rem 1.5rem;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.2);max-width:90vw;width:350px;text-align:center;">
          <h3 style="margin-bottom:1rem;">Cerrar sesión</h3>
          <p style="margin-bottom:2rem;">¿Estás seguro que deseas cerrar sesión?</p>
          <button id="logout-confirm-btn" style="margin-right:1rem;padding:0.5rem 1.5rem;background:#d9534f;color:#fff;border:none;border-radius:4px;cursor:pointer;">Sí, cerrar</button>
          <button id="logout-cancel-btn" style="padding:0.5rem 1.5rem;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function showLogoutModal(onConfirm) {
    const overlay = document.querySelector('#logout-modal .modal-overlay');
    overlay.style.display = 'flex';
    const confirmBtn = document.getElementById('logout-confirm-btn');
    const cancelBtn = document.getElementById('logout-cancel-btn');

    function cleanup() {
      overlay.style.display = 'none';
      confirmBtn.removeEventListener('click', confirmHandler);
      cancelBtn.removeEventListener('click', cancelHandler);
    }
    function confirmHandler() {
      cleanup();
      onConfirm();
    }
    function cancelHandler() {
      cleanup();
    }
    confirmBtn.addEventListener('click', confirmHandler);
    cancelBtn.addEventListener('click', cancelHandler);
  }

  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      showLogoutModal(async function () {
        console.log(
          `Saliste del departamento ${usuario?.nombre || ""}`
        );
        localStorage.removeItem("sidebarCollapsed");
        if (typeof cerrarSesion === "function") {
          await cerrarSesion();
        } else {
          localStorage.removeItem("usuario");
          window.location.href = "/login.html";
        }
      });
    });
  }

  // ===============================
  // 3. RUTAS DEL MENÚ (DEPARTAMENTO)
  // ===============================
  const menuRoutes = {
    "tablero": "/Modules/Departamentos/Dash-Usuario.html",
    "mis permisos": "/Modules/Departamentos/CrearPT.html",
    "autorizar permisos": "/Modules/Departamentos/AutorizarPT.html",
  };

  const menuItems = document.querySelectorAll(".sidebar-nav a");
  const currentPath = window.location.pathname.toLowerCase();

  menuItems.forEach((item) => {
    const span = item.querySelector("span");
    if (!span) return;

    const menuText = span.textContent
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

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
