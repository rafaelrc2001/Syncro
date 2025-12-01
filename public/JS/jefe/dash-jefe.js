document.addEventListener("DOMContentLoaded", function () {
  // Botones de gráficas
  const btn1 = document.getElementById("btn-ver-graficas-1");
  const btn2 = document.getElementById("btn-ver-graficas-2");
  const btn3 = document.getElementById("btn-ver-graficas-3");
  const btn4 = document.getElementById("btn-ver-graficas-meses");
  if (btn1)
    btn1.onclick = () =>
      (window.location.href = "/Modules/JefeSeguridad/Dash-Jefe1.html");
  if (btn2)
    btn2.onclick = () =>
      (window.location.href = "/Modules/JefeSeguridad/Dash-Jefe2.html");
  if (btn3)
    btn3.onclick = () =>
      (window.location.href = "/Modules/JefeSeguridad/Dash-Jefe.html");
  if (btn4)
    btn4.onclick = () =>
      (window.location.href = "/Modules/JefeSeguridad/Dash-Jefe3.html");

  // Mostrar fecha actual
  function mostrarFecha() {
    const fecha = new Date();
    const opciones = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const fechaFormateada = fecha.toLocaleDateString("es-ES", opciones);
    const fechaElem = document.getElementById("current-date");
    if (fechaElem) fechaElem.textContent = fechaFormateada;
  }
  mostrarFecha();

  // Sidebar colapsable (comentado para evitar conflicto con MenuJefe.js)
  // const collapseBtn = document.querySelector(".collapse-btn");
  // if (collapseBtn) {
  //   collapseBtn.addEventListener("click", function () {
  //     const sidebar = document.querySelector(".sidebar");
  //     if (sidebar) sidebar.classList.toggle("collapsed");
  //   });
  // }

  // Tooltips mejorados
  // Tooltips mejorados: manejo global para evitar tooltips clavados
  function removeAllTooltips() {
    document.querySelectorAll(".custom-tooltip").forEach((t) => t.remove());
    // Limpiar referencia en todos los elementos
    document.querySelectorAll("[data-tooltip]").forEach((el) => {
      el.tooltip = null;
    });
  }

  document.querySelectorAll("[data-tooltip]").forEach((element) => {
    element.addEventListener("mouseenter", function (e) {
      removeAllTooltips();
      const tooltip = document.createElement("div");
      tooltip.className = "custom-tooltip";
      tooltip.innerHTML = this.getAttribute("data-tooltip");
      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // Posicionar tooltip centrado arriba del elemento
      let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      let top = rect.top - tooltipRect.height - 8;

      // Ajustar si se sale de la pantalla
      if (left < 10) left = 10;
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      if (top < 10) top = rect.bottom + 8;

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";

      this.tooltip = tooltip;
    });
    element.addEventListener("mouseleave", function () {
      removeAllTooltips();
    });
  });
});
// Llenar la tabla de permisos en Dash-Jefe.html usando el endpoint /api/graficas_jefes/permisos-jefes con paginación

let permisosJefe = [];
let permisosJefeFiltrados = [];
let paginaActualJefe = 1;
const registrosPorPaginaJefe = 7;
let textoBusquedaJefe = "";
let fechaInicioJefe = null;
let fechaFinalJefe = null;
window.permisosJefeFiltrados = permisosJefeFiltrados;

function formatHoraJefe(fecha) {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (isNaN(d)) return "-";
  // Mostrar fecha y hora en UTC, formato: 19/11/2025, 13:19
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  const hour = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hour}:${min}`;
}

function renderTablaPermisosJefe() {
  // Actualizar contador de registros
  const recordsCounter = document.querySelector(".records-counter");
  if (recordsCounter) {
    recordsCounter.textContent = `${permisosJefeFiltrados.length} registros`;
  }
  const tbody = document.querySelector(".permits-table tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  const inicio = (paginaActualJefe - 1) * registrosPorPaginaJefe;
  const fin = inicio + registrosPorPaginaJefe;
  const pagina = permisosJefeFiltrados.slice(inicio, fin);
  pagina.forEach((permiso) => {
    // Calcular tiempo total
    let total = "-";
    if (
      permiso.fecha_hora &&
      (permiso.fecha_hora_area || permiso.fecha_hora_supervisor)
    ) {
      const inicio = new Date(permiso.fecha_hora);
      let fin = permiso.fecha_hora_supervisor
        ? new Date(permiso.fecha_hora_supervisor)
        : new Date(permiso.fecha_hora_area);
      if (!isNaN(inicio) && !isNaN(fin)) {
        let diff = Math.floor((fin - inicio) / 60000); // minutos
        if (diff >= 0) {
          const horas = Math.floor(diff / 60);
          const mins = diff % 60;
          total = `${horas > 0 ? horas + "h " : ""}${mins}m`;
        }
      }
    }

    // Lógica de badges para el estatus (igual que en tabla-jefe.js)
    let estatusNorm = (permiso.estatus || "").toLowerCase().trim();
    let badgeClass = "";
    switch (estatusNorm) {
      case "por autorizar":
        badgeClass = "wait-area";
        break;
      case "espera area":
        badgeClass = "wait-area2";
        break;
      case "en espera del área":
        badgeClass = "wait-area3";
        break;
      case "activo":
        badgeClass = "active";
        break;
      case "terminado":
        badgeClass = "completed";
        break;
      case "cierre sin incidentes":
        badgeClass = "cierre-sin-incidentes";
        break;
      case "cierre con incidentes":
        badgeClass = "cierre-con-incidentes";
        break;
      case "cierre con accidentes":
        badgeClass = "cierre-con-accidentes";
        break;
      case "completed":
        badgeClass = "completed2";
        break;
      case "cancelado":
        badgeClass = "canceled";
        break;
      case "canceled":
        badgeClass = "canceled2";
        break;
      case "continua":
        badgeClass = "continua";
        break;
      case "espera seguridad":
        badgeClass = "wait-security";
        break;
      case "no autorizado":
        badgeClass = "wait-security2";
        break;
      case "wait-security":
        badgeClass = "wait-security3";
        break;
      default:
        badgeClass = "";
    }

    // Tooltip con supervisor y responsable de área
    const supervisor = permiso.supervisor || "No asignado";
    const responsableArea = permiso.responsable_area || "No asignado";
    const tooltip = `<b>SupervisorSeg:</b> ${supervisor}<br><b>ResponsableA.:</b> ${responsableArea}`;
    tbody.innerHTML += `
      <tr data-tooltip="${tooltip}">
        <td>${permiso.prefijo || permiso.id_permiso || "-"}</td>
        <td>${permiso.tipo_permiso || "-"}</td>
        <td>${permiso.descripcion || "-"}</td>
        <td>${permiso.solicitante || "-"}</td>
        <td>${permiso.departamento || "-"}</td>
        <td><span class="status-badge${badgeClass ? " " + badgeClass : ""}">${
      permiso.estatus || "-"
    }</span></td>
        <td>${formatHoraJefe(permiso.fecha_hora)}</td>
        <td>${formatHoraJefe(permiso.fecha_hora_area)}</td>
        <td>${formatHoraJefe(permiso.fecha_hora_supervisor)}</td>
        <td>${total}</td>
      </tr>
    `;
  });
  renderPaginacionPermisosJefe();
  // Reasignar eventos de tooltip a las filas nuevas
  document
    .querySelectorAll(".permits-table tbody tr[data-tooltip]")
    .forEach((element) => {
      element.addEventListener("mouseenter", function (e) {
        // Eliminar cualquier tooltip previo
        if (this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
        const tooltip = document.createElement("div");
        tooltip.className = "custom-tooltip";
        tooltip.innerHTML = this.getAttribute("data-tooltip");
        document.body.appendChild(tooltip);

        const rect = this.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // Posicionar tooltip centrado arriba del elemento
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - 8;

        // Ajustar si se sale de la pantalla
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
          left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) top = rect.bottom + 8;

        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";

        this.tooltip = tooltip;
      });
      element.addEventListener("mouseleave", function () {
        // Eliminar el tooltip aunque el mouse entre y salga rápido
        if (this.tooltip) {
          this.tooltip.remove();
          this.tooltip = null;
        }
      });
    });
  document
    .querySelectorAll(".permits-table tbody tr[data-tooltip]")
    .forEach((element) => {
      element.addEventListener("mouseenter", function (e) {
        removeAllTooltips();
        const tooltip = document.createElement("div");
        tooltip.className = "custom-tooltip";
        tooltip.innerHTML = this.getAttribute("data-tooltip");
        document.body.appendChild(tooltip);

        const rect = this.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // Posicionar tooltip centrado arriba del elemento
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - 8;

        // Ajustar si se sale de la pantalla
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
          left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) top = rect.bottom + 8;

        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";

        this.tooltip = tooltip;
      });
      element.addEventListener("mouseleave", function () {
        removeAllTooltips();
      });
    });
}

function renderPaginacionPermisosJefe() {
  const pagContainer = document.querySelector(".permits-table .pagination");
  if (!pagContainer) return;
  pagContainer.innerHTML = "";
  const totalPaginas = Math.ceil(
    permisosJefeFiltrados.length / registrosPorPaginaJefe
  );

  // Botón anterior
  const btnPrev = document.createElement("button");
  btnPrev.className = "pagination-btn";
  btnPrev.innerHTML = '<i class="ri-arrow-left-s-line"></i>';
  btnPrev.disabled = paginaActualJefe === 1;
  btnPrev.onclick = () => {
    if (paginaActualJefe > 1) {
      paginaActualJefe--;
      renderTablaPermisosJefe();
    }
  };
  pagContainer.appendChild(btnPrev);

  // Paginación compacta
  const maxVisible = 2;
  let pages = [];
  if (totalPaginas <= 7) {
    for (let i = 1; i <= totalPaginas; i++) pages.push(i);
  } else {
    pages.push(1);
    if (paginaActualJefe > maxVisible + 2) pages.push("...");
    let start = Math.max(2, paginaActualJefe - maxVisible);
    let end = Math.min(totalPaginas - 1, paginaActualJefe + maxVisible);
    for (let i = start; i <= end; i++) pages.push(i);
    if (paginaActualJefe < totalPaginas - maxVisible - 1) pages.push("...");
    pages.push(totalPaginas);
  }

  pages.forEach((p) => {
    if (p === "...") {
      const span = document.createElement("span");
      span.textContent = "...";
      span.className = "pagination-ellipsis";
      pagContainer.appendChild(span);
    } else {
      const btn = document.createElement("button");
      btn.className =
        "pagination-btn" + (p === paginaActualJefe ? " active" : "");
      btn.textContent = p;
      btn.onclick = () => {
        paginaActualJefe = p;
        renderTablaPermisosJefe();
      };
      pagContainer.appendChild(btn);
    }
  });

  // Botón siguiente
  const btnNext = document.createElement("button");
  btnNext.className = "pagination-btn";
  btnNext.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
  btnNext.disabled = paginaActualJefe === totalPaginas || totalPaginas === 0;
  btnNext.onclick = () => {
    if (paginaActualJefe < totalPaginas) {
      paginaActualJefe++;
      renderTablaPermisosJefe();
    }
  };
  pagContainer.appendChild(btnNext);
}

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector(".permits-table tbody");
  if (!tbody) return;

  fetch("/api/graficas_jefes/permisos-jefes")
    .then((res) => res.json())
    .then((data) => {
      permisosJefe = data;
      aplicarFiltroPermisosJefe();
    })
    .catch((err) => {
      tbody.innerHTML = `<tr><td colspan="10">Error al cargar permisos</td></tr>`;
      console.error("Error al cargar permisos:", err);
    });

  // Lógica de filtrado en tiempo real
  const inputBusqueda = document.querySelector(".search-bar input");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", function () {
      textoBusquedaJefe = this.value.trim().toLowerCase();
      paginaActualJefe = 1;
      aplicarFiltroPermisosJefe();
    });
  }

  // Filtros de fecha
  const fechaInicioInput = document.getElementById("fecha-inicio");
  const fechaFinalInput = document.getElementById("fecha-final");
  if (fechaInicioInput) {
    fechaInicioInput.addEventListener("change", function () {
      fechaInicioJefe = this.value ? this.value : null;
      paginaActualJefe = 1;
      aplicarFiltroPermisosJefe();
    });
  }
  if (fechaFinalInput) {
    fechaFinalInput.addEventListener("change", function () {
      fechaFinalJefe = this.value ? this.value : null;
      paginaActualJefe = 1;
      aplicarFiltroPermisosJefe();
    });
  }
});

function aplicarFiltroPermisosJefe() {
  // Filtrado por búsqueda y por fecha
  permisosJefeFiltrados = permisosJefe.filter((permiso) => {
    // Filtrar por texto de búsqueda
    let coincideBusqueda = true;
    if (textoBusquedaJefe) {
      const campos = [
        permiso.prefijo,
        permiso.id_permiso,
        permiso.tipo_permiso,
        permiso.descripcion,
        permiso.solicitante,
        permiso.departamento,
        permiso.estatus,
        permiso.contrato,
      ];
      coincideBusqueda = campos.some(
        (campo) =>
          campo && campo.toString().toLowerCase().includes(textoBusquedaJefe)
      );
    }

    // Filtrar por rango de fechas (usa campo fecha_hora)
    let coincideFecha = true;
    if (fechaInicioJefe || fechaFinalJefe) {
      let fechaPermiso = permiso.fecha_hora;
      if (!fechaPermiso) return false;
      let fechaStr = fechaPermiso.split("T")[0];
      if (fechaInicioJefe && fechaStr < fechaInicioJefe) return false;
      if (fechaFinalJefe && fechaStr > fechaFinalJefe) return false;
    }

    return coincideBusqueda && coincideFecha;
  });
  window.permisosJefeFiltrados = permisosJefeFiltrados;
  renderTablaPermisosJefe();
  if (window.actualizarTarjetasJefe) window.actualizarTarjetasJefe();
}
