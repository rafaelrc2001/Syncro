document.addEventListener("DOMContentLoaded", function () {
  // Variables para paginación y búsqueda
  let sucursalesGlobal = [];
  let paginaActual = 1;
  const registrosPorPagina = 5;
  let terminoBusqueda = "";
  let paginacionContainer = document.getElementById("paginacion-container");
  let searchInput = document.getElementById("search-bar");
  // Event listener para búsqueda
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      terminoBusqueda = searchInput.value;
      paginaActual = 1;
      renderizarTablaSucursales();
    });
  }
  // URL base de la API
  const API_URL = "/api";

  // Elementos del DOM
  const registerBtn = document.getElementById("register-sucursal-btn");
  const modal = document.getElementById("sucursal-modal");
  const closeModalBtn = document.querySelector(".close-modal");
  const cancelBtn = document.querySelector(".cancel-btn");
  const sucursalForm = document.getElementById("sucursal-form");
  const sucursalNameInput = document.getElementById("sucursal-name");
  const submitBtn = document.querySelector('.modal-body button[type="submit"]');

  // Estado global para controlar si estamos editando
  let editando = false;
  let sucursalId = null;

  // Open modal
  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      modal.classList.add("active");
    });
  }

  // Close modal
  function closeModal() {
    modal.classList.remove("active");
    if (sucursalForm) {
      sucursalForm.reset();
    }

    // Restaurar estado de edición
    if (editando) {
      editando = false;
      sucursalId = null;
      if (submitBtn) {
        submitBtn.textContent = "Registrar Sucursal";
      }
    }
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
  }

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Función para cargar las sucursales desde la API
  async function cargarSucursales() {
    try {
      const response = await fetch(`${API_URL}/sucursales`);
      if (!response.ok) throw new Error("Error al cargar las sucursales");
      sucursalesGlobal = await response.json();
      renderizarTablaSucursales();
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
      alert("Error al cargar las sucursales: " + error.message);
    }
  }

  // Renderizar tabla con paginación y búsqueda
  function renderizarTablaSucursales() {
    let filtradas = sucursalesGlobal;
    if (terminoBusqueda) {
      const lowerTerm = terminoBusqueda.toLowerCase();
      filtradas = sucursalesGlobal.filter((suc) =>
        (suc.nombre || "").toLowerCase().includes(lowerTerm)
      );
    }
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const pagina = filtradas.slice(inicio, inicio + registrosPorPagina);

    const tableBody = document.querySelector("#table-body");
    tableBody.innerHTML = "";
    pagina.forEach((sucursal) => {
      const row = document.createElement("tr");
      row.dataset.id = sucursal.id_sucursal;
      row.innerHTML = `
                <td>${sucursal.nombre}</td>
                <td>
                    <button class="action-btn edit" data-id="${sucursal.id_sucursal}"><i class="ri-edit-line"></i></button>
                    <button class="action-btn delete" data-id="${sucursal.id_sucursal}"><i class="ri-delete-bin-line"></i></button>
                </td>
            `;
      tableBody.appendChild(row);
    });
    // Actualizar contador
    document.getElementById("records-count").textContent = filtradas.length;
    // Renderizar paginación
    renderizarPaginacion(filtradas.length);
    agregarEventListenersBotones();
  }

  // Renderizar controles de paginación
  function renderizarPaginacion(totalRegistros) {
    if (!paginacionContainer) return;
    paginacionContainer.innerHTML = "";
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
    if (totalPaginas <= 1) return;
    // Botón anterior
    const btnPrev = document.createElement("button");
    btnPrev.className = "pagination-btn";
    btnPrev.innerHTML = '<i class="ri-arrow-left-s-line"></i>';
    btnPrev.disabled = paginaActual === 1;
    btnPrev.addEventListener("click", () => {
      if (paginaActual > 1) {
        paginaActual--;
        renderizarTablaSucursales();
      }
    });
    paginacionContainer.appendChild(btnPrev);
    // Botones de página
    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement("button");
      btn.className = "pagination-btn" + (i === paginaActual ? " active" : "");
      btn.textContent = i;
      btn.addEventListener("click", () => {
        paginaActual = i;
        renderizarTablaSucursales();
      });
      paginacionContainer.appendChild(btn);
    }
    // Botón siguiente
    const btnNext = document.createElement("button");
    btnNext.className = "pagination-btn";
    btnNext.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
    btnNext.disabled = paginaActual === totalPaginas || totalPaginas === 0;
    btnNext.addEventListener("click", () => {
      if (paginaActual < totalPaginas) {
        paginaActual++;
        renderizarTablaSucursales();
      }
    });
    paginacionContainer.appendChild(btnNext);
  }

  // Función para agregar event listeners a los botones de editar/eliminar
  function agregarEventListenersBotones() {
    // Eliminar event listeners anteriores
    document.querySelectorAll(".action-btn").forEach((btn) => {
      btn.replaceWith(btn.cloneNode(true));
    });
    // Eliminar listeners previos para evitar duplicados
    document.removeEventListener("click", manejarAccionesSucursal);
    // Agregar nuevos event listeners
    document.addEventListener("click", manejarAccionesSucursal);
  }

  // --- MODAL DE ADVERTENCIA PARA ELIMINAR SUCURSAL ---
  let idSucursalAEliminar = null;
  let deleteWarningModal = document.getElementById("delete-warning-modal");
  let cancelDeleteBtn = document.getElementById("cancel-delete-btn");
  let confirmDeleteBtn = document.getElementById("confirm-delete-btn");

  if (!deleteWarningModal) {
    deleteWarningModal = document.createElement("div");
    deleteWarningModal.id = "delete-warning-modal";
    deleteWarningModal.className = "modal";
    deleteWarningModal.innerHTML = `
          <div class="modal-content warning-modal-content">
            <div class="modal-header warning-modal-header">
              <h3><i class="ri-error-warning-line warning-icon"></i> Advertencia</h3>
            </div>
            <div class="modal-body warning-modal-body">
              <p class="warning-text">
                ¡Esta acción <b>no tiene vuelta atrás</b>!<br>¿Estás seguro de que deseas <span style='color:#c0392b;font-weight:bold;'>eliminar</span> este registro?
              </p>
            </div>
            <div class="modal-footer warning-modal-footer">
              <button id="cancel-delete-btn" class="cancel-btn warning-cancel">Cancelar</button>
              <button id="confirm-delete-btn" class="delete-btn warning-delete">Eliminar</button>
            </div>
          </div>
        `;
    document.body.appendChild(deleteWarningModal);
    cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    confirmDeleteBtn = document.getElementById("confirm-delete-btn");
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", function () {
      deleteWarningModal.classList.remove("active");
      idSucursalAEliminar = null;
    });
  }
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async function () {
      if (idSucursalAEliminar) {
        try {
          const response = await fetch(
            `${API_URL}/sucursales/hide/${idSucursalAEliminar}`,
            {
              method: "PUT",
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar la sucursal");
          }
          await cargarSucursales();
          alert("Sucursal ocultada exitosamente");
        } catch (error) {
          alert("Error al eliminar la sucursal: " + error.message);
        }
      }
      deleteWarningModal.classList.remove("active");
      idSucursalAEliminar = null;
    });
  }

  // Función para manejar las acciones de las sucursales (editar/eliminar)
  async function manejarAccionesSucursal(e) {
    // Editar
    if (e.target.closest(".action-btn.edit")) {
      e.preventDefault();
      const btn = e.target.closest(".action-btn.edit");
      const id = btn.dataset.id;

      try {
        const response = await fetch(`${API_URL}/sucursales/${id}`);
        if (!response.ok) throw new Error("Error al cargar la sucursal");

        const sucursal = await response.json();

        // Llenar el formulario
        sucursalNameInput.value = sucursal.nombre;

        // Cambiar el estado a edición
        editando = true;
        sucursalId = id;

        // Cambiar texto del botón
        submitBtn.textContent = "Actualizar Sucursal";

        // Abrir el modal
        modal.classList.add("active");
      } catch (error) {
        console.error("Error al cargar la sucursal:", error);
        alert("Error al cargar la sucursal: " + error.message);
      }
    }
    // Eliminar
    if (e.target.closest(".action-btn.delete")) {
      e.preventDefault();
      const btn = e.target.closest(".action-btn.delete");
      const id = btn.dataset.id;
      idSucursalAEliminar = id;
      deleteWarningModal.classList.add("active");
    }
  }

  // Form submission
  if (sucursalForm) {
    sucursalForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nombre = sucursalNameInput.value.trim();

      if (!nombre) {
        alert("El nombre de la sucursal es requerido");
        return;
      }

      try {
        let url = `${API_URL}/sucursales`;
        let method = "POST";

        // Si estamos editando, cambiamos la URL y el método
        if (editando && sucursalId) {
          url += `/${sucursalId}`;
          method = "PUT";
        }

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al guardar la sucursal");
        }

        // Cerrar el modal y limpiar el formulario
        closeModal();
        sucursalForm.reset();

        // Recargar la lista de sucursales
        await cargarSucursales();

        // Mostrar mensaje de éxito
        alert(
          editando
            ? "Sucursal actualizada exitosamente"
            : "Sucursal registrada exitosamente"
        );

        // Resetear estado de edición
        editando = false;
        sucursalId = null;
        submitBtn.textContent = "Registrar Sucursal";
      } catch (error) {
        console.error("Error al guardar la sucursal:", error);
        alert("Error al guardar la sucursal: " + error.message);
      }
    });
  }

  // Cargar las sucursales al iniciar
  cargarSucursales();

  // Update MenuJefe.js functionality for this page
  const currentPath = window.location.pathname.toLowerCase();
  const menuRoutes = {
    dashboard: "/Modules/JefeSeguridad/Dash-Jefe.html",
    "autorizar permisos": "/Modules/JefeSeguridad/JefeSeguridad.html",
    área: "/Modules/JefeSeguridad/CrearArea.html",
    categoria: "/Modules/JefeSeguridad/CrearCategoria.html",
    sucursal: "/Modules/JefeSeguridad/CrearSucursal.html",
    departamento: "/Modules/JefeSeguridad/CrearDepartamento.html",
    supervisor: "/Modules/JefeSeguridad/CrearSupervisor.html",
  };

  // Mark active menu item
  const menuItems = document.querySelectorAll(".sidebar-nav a");
  menuItems.forEach((item) => {
    const menuText = item.querySelector("span")?.textContent.toLowerCase();
    if (!menuText) return;

    if (
      menuRoutes[menuText] &&
      menuRoutes[menuText].toLowerCase() === currentPath
    ) {
      item.parentElement.classList.add("active");

      // If it's a submenu, open the parent menu
      const submenuItem = item.closest(".submenu");
      if (submenuItem) {
        const parentMenu = submenuItem.closest(".has-submenu");
        if (parentMenu) {
          parentMenu.classList.add("active");
        }
      }
    }
  });
});
