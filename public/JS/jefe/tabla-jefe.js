// imports for modal view removed (modal functionality stripped)

// --- Tarjetas desde autorizar ---
async function cargarTargetasDesdeAutorizar() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id_departamento = usuario && usuario.id ? usuario.id : null;
    if (!id_departamento)
      throw new Error("No se encontró el id de departamento del usuario");
    const response = await fetch("/api/autorizar-jefe");
    if (!response.ok) throw new Error("Error al consultar permisos");
    const permisos = await response.json();

    // Conteos por estatus
    let total = permisos.length;
    let porAutorizar = 0;
    let activos = 0;
    let terminados = 0;
    let noAutorizados = 0;

    permisos.forEach((item) => {
      const estatus = item.estatus.toLowerCase();
      if (
        estatus === "espera area" ||
        estatus === "espera seguridad" ||
        estatus === "en espera del área"
      ) {
        porAutorizar++;
      } else if (estatus === "activo") {
        activos++;
      } else if (estatus === "terminado") {
        terminados++;
      } else if (estatus === "no autorizado") {
        noAutorizados++;
      }
    });

    // Actualiza las tarjetas en el HTML
    const counts = document.querySelectorAll(".card-content .count");
    counts[0].textContent = total;
    counts[1].textContent = porAutorizar;
    counts[2].textContent = activos;
    counts[3].textContent = terminados;
    counts[4].textContent = noAutorizados;
  } catch (err) {
    console.error("Error al cargar targetas desde permisos:", err);
  }
}
// funcionesusuario.js
// Centraliza la lógica de tarjetas y tabla de permisos para el usuario

let permisosGlobal = [];
let paginaActual = 1;
const registrosPorPagina = 7;
let filtroBusqueda = "";

// --- Tabla de permisos ---
function asignarEventosVer() {
  // Vista/Imprimir: funcionalidad removida intencionalmente.
  // Los botones `.action-btn.view` y `.action-btn.print` permanecen en el DOM
  // (para mantener la estructura de la tabla), pero no se les adjuntan
  // manejadores aquí. Si en el futuro quieres restaurar la funcionalidad,
  // reimplementar los listeners en esta función.

  // (misma lógica de mapeo que en `tabla-crearpt.js`).
  document.querySelectorAll(".action-btn.view").forEach((btn) => {
    // evitar múltiples attaches
    if (btn.__viewAttached) return;
    btn.__viewAttached = true;
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const tipoPermiso = row ? row.children[1].textContent.trim() : "";
      const idPermiso = this.getAttribute("data-idpermiso") || "";

      try {
        if (tipoPermiso === "PT No Peligroso") {
          window.location.href = `/Modules/Fomularios/PT1/PT1imprimirsup.html?tipo=PT1&id=${idPermiso}`;
        } else if (tipoPermiso === "PT para Apertura Equipo Línea") {
          window.location.href = `/Modules/Fomularios/PT2/PT2imprimirsup.html?tipo=PT2&id=${idPermiso}`;
        } else if (tipoPermiso === "PT de Entrada a Espacio Confinado") {
          window.location.href = `/Modules/Fomularios/PT3/PT3imprimirsup.html?tipo=PT3&id=${idPermiso}`;
        } else if (tipoPermiso === "PT en Altura") {
          window.location.href = `/Modules/Fomularios/PT4/PT4imprimirsup.html?tipo=PT4&id=${idPermiso}`;
        } else if (tipoPermiso === "PT de Fuego Abierto") {
          window.location.href = `/Modules/Fomularios/PT5/PT5imprimirsup.html?tipo=PT5&id=${idPermiso}`;
        } else if (tipoPermiso === "PT con Energía Eléctrica") {
          window.location.href = `/Modules/Fomularios/PT6/PT6imprimirsup.html?tipo=PT6&id=${idPermiso}`;
        } else if (tipoPermiso === "PT con Fuentes Radioactivas") {
          window.location.href = `/Modules/Fomularios/PT7/PT7imprimirsup.html?tipo=PT7&id=${idPermiso}`;
        } else if (tipoPermiso === "PT para Izaje con Hiab con Grúa") {
          window.location.href = `/Modules/Fomularios/PT8/PT8imprimirsup.html?tipo=PT8&id=${idPermiso}`;
        } else {
          // fallback a la misma página de impresión genérica usada en crearpt
          window.location.href = `/JS/usuario/LogicaImprimir.html?tipo=OTRO&id=${idPermiso}`;
        }
      } catch (err) {
        console.error("Error redirigiendo al permiso:", err);
      }
    });
  });
}

async function cargarPermisosTabla() {
  try {
    const response = await fetch("/api/autorizar-jefe");
    if (!response.ok) throw new Error("Error al consultar permisos");
    permisosGlobal = await response.json();
    mostrarPermisosFiltrados("all");
  } catch (err) {
    console.error("Error al cargar permisos:", err);
  }
}

function mostrarPermisosFiltrados(filtro) {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";
  let filtrados = permisosGlobal;

  // Filtrado por estatus
  if (filtro !== "all") {
    filtrados = filtrados.filter((permiso) => {
      const estatus = permiso.estatus.toLowerCase().trim();
      const filtroNorm = filtro.toLowerCase().trim();
      if (filtroNorm === "continua") {
        return estatus === "continua";
      }
      return estatus === filtroNorm;
    });
  }

  // Filtrado por folio
  if (filtroBusqueda) {
    filtrados = filtrados.filter((permiso) => {
      const prefijo = (permiso.prefijo || "").toString().toLowerCase();
      const contrato = (
        permiso.contrato ||
        permiso.contrato_df ||
        permiso.ot_numero ||
        permiso.ot_no ||
        ""
      )
        .toString()
        .toLowerCase();
      const solicitante = (permiso.solicitante || "").toString().toLowerCase();
      return (
        prefijo.includes(filtroBusqueda) ||
        contrato.includes(filtroBusqueda) ||
        solicitante.includes(filtroBusqueda)
      );
    });
  }

  // Paginación
  const totalPaginas = Math.ceil(filtrados.length / registrosPorPagina);
  if (paginaActual > totalPaginas) paginaActual = totalPaginas || 1;
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const paginaDatos = filtrados.slice(inicio, fin);

  paginaDatos.forEach((permiso) => {
    const row = document.createElement("tr");
    let estatusNorm = permiso.estatus.toLowerCase().trim();
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
    row.innerHTML = `
            <td>${permiso.prefijo}</td>
            <td>${permiso.tipo_permiso}</td>
            <td>${permiso.descripcion}</td>
            <td>${permiso.area}</td>
            <td>${permiso.solicitante}</td>
           <td>${formatearFecha(permiso.fecha_hora)}</td>
            <td><span class="status-badge${
              badgeClass ? " " + badgeClass : ""
            }">${permiso.estatus}</span></td>
            <td>
                <button class="action-btn view" data-idpermiso="${
                  permiso.id_permiso
                }"><i class="ri-eye-line"></i></button>
            </td>
        `;
    tbody.appendChild(row);
  });

  const recordsCount = document.getElementById("records-count");
  if (recordsCount) {
    let texto = filtrados.length;
    recordsCount.parentElement.innerHTML = `<span id="records-count">${texto}</span>`;
  }
  asignarEventosVer();
  actualizarPaginacion(totalPaginas, filtro);
}

function actualizarPaginacion(totalPaginas, filtro) {
  const pagContainer = document.querySelector(".pagination");
  if (!pagContainer) return;
  pagContainer.innerHTML = "";

  // Botón anterior
  const btnPrev = document.createElement("button");
  btnPrev.className = "pagination-btn";
  btnPrev.innerHTML = '<i class="ri-arrow-left-s-line"></i>';
  btnPrev.disabled = paginaActual === 1;
  btnPrev.onclick = () => {
    if (paginaActual > 1) {
      paginaActual--;
      mostrarPermisosFiltrados(document.getElementById("status-filter").value);
    }
  };
  pagContainer.appendChild(btnPrev);

  // Paginación compacta (primera, ..., cercanas, ..., última)
  const maxVisible = 2; // páginas antes/después de la actual
  let pages = [];
  if (totalPaginas <= 7) {
    for (let i = 1; i <= totalPaginas; i++) pages.push(i);
  } else {
    pages.push(1);
    if (paginaActual > maxVisible + 2) pages.push("...");
    let start = Math.max(2, paginaActual - maxVisible);
    let end = Math.min(totalPaginas - 1, paginaActual + maxVisible);
    for (let i = start; i <= end; i++) pages.push(i);
    if (paginaActual < totalPaginas - maxVisible - 1) pages.push("...");
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
      btn.className = "pagination-btn" + (p === paginaActual ? " active" : "");
      btn.textContent = p;
      btn.onclick = () => {
        paginaActual = p;
        mostrarPermisosFiltrados(
          document.getElementById("status-filter").value
        );
      };
      pagContainer.appendChild(btn);
    }
  });

  // Botón siguiente
  const btnNext = document.createElement("button");
  btnNext.className = "pagination-btn";
  btnNext.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
  btnNext.disabled = paginaActual === totalPaginas || totalPaginas === 0;
  btnNext.onclick = () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      mostrarPermisosFiltrados(document.getElementById("status-filter").value);
    }
  };
  pagContainer.appendChild(btnNext);
}

// Evento del select
document
  .getElementById("status-filter")
  .addEventListener("change", function () {
    paginaActual = 1;
    mostrarPermisosFiltrados(this.value);
  });

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización mínima: cargar tarjetas y tabla, y enlazar búsqueda
  cargarTargetasDesdeAutorizar();
  cargarPermisosTabla();
  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filtroBusqueda = searchInput.value.trim().toLowerCase();
      paginaActual = 1;
      mostrarPermisosFiltrados(document.getElementById("status-filter").value);
    });
  }
});

// Removed modal-related DOMContentLoaded block (supervisores/categorias and modal handlers)

function formatearFecha(fechaISO) {
  if (!fechaISO) return "-";
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Exponer función para que la lógica de exportar pueda obtener los permisos
// actualmente filtrados (sin paginación). Copiado/adaptado desde tabla-supervisor.js
window.getPermisosFiltrados = function () {
  if (!Array.isArray(permisosGlobal)) return [];

  let filtrados = permisosGlobal.slice();

  // Aplicar filtro por estatus tal como en mostrarPermisosFiltrados
  const statusSelect = document.getElementById("status-filter");
  const filtroStatus = statusSelect ? statusSelect.value : "all";
  if (filtroStatus !== "all") {
    filtrados = filtrados.filter((permiso) => {
      const estatus = (permiso.estatus || "").toLowerCase().trim();
      const filtroNorm = (filtroStatus || "").toLowerCase().trim();
      if (filtroNorm === "continua") {
        return estatus === "continua";
      }
      return estatus === filtroNorm;
    });
  }

  // Aplicar búsqueda de texto (folio, contrato, solicitante)
  if (filtroBusqueda) {
    const q = filtroBusqueda;
    filtrados = filtrados.filter((permiso) => {
      const prefijo = (permiso.prefijo || "").toString().toLowerCase();
      const contrato = (
        permiso.contrato ||
        permiso.contrato_df ||
        permiso.ot_numero ||
        permiso.ot_no ||
        ""
      )
        .toString()
        .toLowerCase();
      const solicitante = (permiso.solicitante || "").toString().toLowerCase();
      return (
        prefijo.includes(q) || contrato.includes(q) || solicitante.includes(q)
      );
    });
  }

  return filtrados;
};
