document.addEventListener("DOMContentLoaded", function () {

  // Modal reutilizable para confirmaciones
  function showConfirmModal(msg, onConfirm, onCancel) {
    let modal = document.getElementById("confirm-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "confirm-modal";
      modal.style.position = "fixed";
      modal.style.top = 0;
      modal.style.left = 0;
      modal.style.width = "100vw";
      modal.style.height = "100vh";
      modal.style.background = "rgba(0,0,0,0.6)";
      modal.style.display = "flex";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
      modal.style.zIndex = 10000;
      modal.innerHTML = `
        <div style="background:#222;padding:2rem 2.5rem;border-radius:12px;box-shadow:0 2px 16px #0008;max-width:90vw;min-width:260px;text-align:center;">
          <div style="font-size:1.2rem;margin-bottom:1.5rem;color:#fff;">${msg}</div>
          <button id="confirm-yes" style="margin-right:1.5rem;padding:0.5rem 1.5rem;font-size:1rem;background:#27ae60;color:#fff;border:none;border-radius:5px;cursor:pointer;">Sí</button>
          <button id="confirm-no" style="padding:0.5rem 1.5rem;font-size:1rem;background:#e74c3c;color:#fff;border:none;border-radius:5px;cursor:pointer;">No</button>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      modal.querySelector("div").firstChild.textContent = msg;
      modal.style.display = "flex";
    }
    document.getElementById("confirm-yes").onclick = () => {
      modal.style.display = "none";
      if (onConfirm) onConfirm();
    };
    document.getElementById("confirm-no").onclick = () => {
      modal.style.display = "none";
      if (onCancel) onCancel();
    };
  }

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
    logoutBtn.addEventListener("click", function () {
      showConfirmModal(
        "¿Estás seguro que deseas cerrar sesión?",
        async function () {
          console.log("Cerrando sesión...");
          localStorage.removeItem("sidebarCollapsed");
          if (typeof cerrarSesion === "function") {
            await cerrarSesion();
          } else {
            localStorage.removeItem("usuario");
            window.location.href = "/login.html";
          }
        },
        function () {
          // Cancelado, no hacer nada
        }
      );
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

