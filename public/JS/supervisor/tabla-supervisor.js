import {
  mostrarInformacionGeneral,
  mostrarDetallesTecnicos,
  mostrarAST,
  mostrarActividadesAST,
  mostrarParticipantesAST,
  asignarEventosVer,
  renderApertura,
} from "../generales/LogicaVerFormularios.js";

import { renderAperturaSupervisor } from "../generales/render_pt_apertura.js";
import { renderNoPeligrosoAreaVer } from "../generales/render_pt_no.js";

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
      if (estatus === "espera seguridad") {
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

  // Filtrado por texto (folio, contrato, solicitante, tipo_permiso)
  if (filtroBusqueda) {
    filtrados = filtrados.filter((permiso) => {
      const prefijo = (permiso.prefijo || "").toLowerCase();
      const contrato = (permiso.contrato || "").toString().toLowerCase();
      const solicitante = (permiso.solicitante || "").toLowerCase();
      const tipo = (permiso.tipo_permiso || "").toLowerCase();
      return (
        prefijo.includes(filtroBusqueda) ||
        contrato.includes(filtroBusqueda) ||
        solicitante.includes(filtroBusqueda) ||
        tipo.includes(filtroBusqueda)
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
               
                <button class="action-btn edit"><i class="ri-edit-line"></i></button>
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

  // Botón imprimir y ver: ambos redirigen a imprimir
  document
    .querySelectorAll(".action-btn.print, .action-btn.view")
    .forEach((btn) => {
      btn.addEventListener("click", function () {
        const row = this.closest("tr");
        const tipoPermiso = row ? row.children[1].textContent.trim() : "";
        const idPermiso = row
          ? row
              .querySelector(".action-btn.view, .action-btn.print")
              .getAttribute("data-idpermiso")
          : "";

        if (tipoPermiso === "PT No Peligroso") {
          window.location.href = `/Modules/Fomularios/PT1/PT1imprimir.html?tipo=PT1&id=${idPermiso}`;
        } else if (tipoPermiso === "PT para Apertura Equipo Línea") {
          window.location.href = `/Modules/Fomularios/PT2/PT2imprimir.html?tipo=PT2&id=${idPermiso}`;
        } else if (tipoPermiso === "PT de Entrada a Espacio Confinado") {
          window.location.href = `/Modules/Fomularios/PT3/PT3imprimir.html?tipo=PT3&id=${idPermiso}`;
        } else if (tipoPermiso === "PT en Altura") {
          window.location.href = `/Modules/Fomularios/PT4/PT4imprimir.html?tipo=PT4&id=${idPermiso}`;
        } else if (tipoPermiso === "PT de Fuego Abierto") {
          window.location.href = `/Modules/Fomularios/PT5/PT5imprimir.html?tipo=PT5&id=${idPermiso}`;
        } else if (tipoPermiso === "PT con Energía Eléctrica") {
          window.location.href = `/Modules/Fomularios/PT6/PT6imprimir.html?tipo=PT6&id=${idPermiso}`;
        } else if (tipoPermiso === "PT con Fuentes Radioactivas") {
          window.location.href = `/Modules/Fomularios/PT7/PT7imprimir.html?tipo=PT7&id=${idPermiso}`;
        } else if (tipoPermiso === "PT para Izaje con Hiab con Grúa") {
          window.location.href = `/Modules/Fomularios/PT8/PT8imprimir.html?tipo=PT8&id=${idPermiso}`;
        } else {
          window.location.href = `/JS/usuario/LogicaImprimir.html?tipo=OTRO&id=${idPermiso}`;
        }
      });
    });
}

// Evento del select
document
  .getElementById("status-filter")
  .addEventListener("change", function () {
    paginaActual = 1;
    mostrarPermisosFiltrados(this.value);
  });

document.addEventListener("DOMContentLoaded", () => {
  cargarTargetasDesdeAutorizar();
  cargarPermisosTabla();
  // Búsqueda por folio compatible con paginación
  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filtroBusqueda = searchInput.value.trim().toLowerCase();
      paginaActual = 1;
      mostrarPermisosFiltrados(document.getElementById("status-filter").value);
    });
  }

  // Botón cerrar del modalAceptado
  const btnCerrarAceptado = document.querySelector(
    "#modalAceptado .cerrar-btn"
  );
  if (btnCerrarAceptado) {
    btnCerrarAceptado.addEventListener("click", function () {
      const modalAceptado = document.getElementById("modalAceptado");
      if (modalAceptado) {
        modalAceptado.classList.remove("active");
        modalAceptado.setAttribute("hidden", "");
      }
    });
  }
});

// Cierra el modal de ver y el de comentario al dar clic en el botón 'Aceptar' exclusivo de AutorizarPT

document.addEventListener("DOMContentLoaded", () => {
  // Supervisores
  fetch("/api/supervisores")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador");
      select.innerHTML =
        '<option value="" disabled selected>Seleccione un supervisor...</option>';
      data.forEach((sup) => {
        const option = document.createElement("option");
        option.value = sup.nombre;
        option.textContent = sup.nombre;
        select.appendChild(option);
      });
    });

  // Categorías
  fetch("/api/categorias")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador2");
      select.innerHTML =
        '<option value="" disabled selected>Seleccione una categoria...</option>';
      data.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.nombre;
        option.textContent = cat.nombre;
        select.appendChild(option);
      });
    });

  //BOTONES DE INSERTAR:

  // --- Lógica exclusiva para los botones de AutorizarPT ---
  const btnAceptar = document.getElementById("btn-autorizar-pt");
  if (btnAceptar) {
    btnAceptar.addEventListener("click", async function () {
      const idPermiso = window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";
      if (!idPermiso) {
        alert(
          "No se pudo obtener el ID del permiso. Selecciona un permiso válido."
        );
        return;
      }
      if (!supervisor || !categoria) {
        alert(
          "Debes seleccionar el supervisor y la categoría antes de autorizar."
        );
        return;
      }

      // Captura datos del formulario de supervisor si existe
      let datosSupervisor = {};
      const formSup = document.getElementById("form-apertura-supervisor");
      if (formSup) {
        const fd = new FormData(formSup);
        fd.forEach((value, key) => {
          datosSupervisor[key] = value;
        });
        // Observaciones textarea
        if (formSup.querySelector('[name="observations"]')) {
          datosSupervisor["observations"] = formSup.querySelector(
            '[name="observations"]'
          ).value;
        }
      }
      // Captura datos de pruebas si existe
      const formPruebas = document.getElementById("form-pruebas-supervisor");
      if (formPruebas) {
        const fd2 = new FormData(formPruebas);
        fd2.forEach((value, key) => {
          datosSupervisor[key] = value;
        });
      }

      // 1. Actualizar supervisor y categoría en autorizaciones
      try {
        await fetch(
          "/api/autorizaciones/supervisor-categoria",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              supervisor,
              categoria,
              fecha_hora_supervisor: new Date().toISOString(),
            }),
          }
        );
      } catch (err) {
        console.error("Error al actualizar supervisor y categoría:", err);
      }

      // 1.5 Guardar datos de apertura supervisor si existen
      if (Object.keys(datosSupervisor).length > 0) {
        // Mapeo de nombres del frontend al backend
        const datosSupervisorMapped = {
          special_protection: datosSupervisor["special-protection"],
          skin_protection: datosSupervisor["skin-protection"],
          respiratory_protection: datosSupervisor["respiratory-protection"],
          eye_protection: datosSupervisor["eye-protection"],
          fire_protection: datosSupervisor["fire-protection"],
          fire_protection_type: datosSupervisor["fire-protection-type"],
          barriers_required: datosSupervisor["barriers-required"],
          observations: datosSupervisor["observations"],
          co2_level: datosSupervisor["co2-level"],
          nh3_level: datosSupervisor["nh3-level"],
          oxygen_level: datosSupervisor["oxygen-level"],
          lel_level: datosSupervisor["lel-level"],
        };

        try {
          await fetch(
            `/api/pt-apertura/requisitos_supervisor/${idPermiso}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(datosSupervisorMapped),
            }
          );
        } catch (err) {
          console.error("Error al guardar datos de apertura supervisor:", err);
        }
      }

      // 2. Consultar el id_estatus desde permisos_trabajo
      let idEstatus = null;
      try {
        const resp = await fetch(
          `/api/permisos-trabajo/${idPermiso}`
        );
        if (resp.ok) {
          const permisoData = await resp.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
        }
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }

      // 3. Actualizar el estatus a "activo"
      if (idEstatus) {
        try {
          await fetch("/api/estatus/activo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
        } catch (err) {
          console.error("Error al actualizar estatus activo:", err);
        }
      }

      // Oculta el modalVer y muestra el modalAceptado
      document.getElementById("modalVer").classList.remove("active");
      const modalComentario = document.getElementById("modalComentario");
      if (modalComentario) {
        modalComentario.classList.remove("active");
        modalComentario.setAttribute("hidden", "");
      }
      const modalAceptado = document.getElementById("modalAceptado");
      if (modalAceptado) {
        modalAceptado.classList.add("active");
        modalAceptado.removeAttribute("hidden");
      }
      cargarPermisosTabla();
      cargarTargetasDesdeAutorizar();
    });
  }

  const btnNoAutorizar = document.getElementById("btn-noautorizar-pt");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", async function () {
      const idPermiso = window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";
      if (!idPermiso) {
        alert(
          "No se pudo obtener el ID del permiso. Selecciona un permiso válido."
        );
        return;
      }
      if (!supervisor || !categoria) {
        alert(
          "Debes seleccionar el supervisor y la categoría antes de continuar."
        );
        return;
      }

      // 1. Actualizar supervisor y categoría en autorizaciones
      try {
        await fetch(
          "/api/autorizaciones/supervisor-categoria",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              supervisor,
              categoria,
              fecha_hora_supervisor: new Date().toISOString(),
            }),
          }
        );
      } catch (err) {
        console.error("Error al actualizar supervisor y categoría:", err);
      }

      // 2. Consultar el id_estatus desde permisos_trabajo
      let idEstatus = null;
      try {
        const resp = await fetch(
          `/api/permisos-trabajo/${idPermiso}`
        );
        if (resp.ok) {
          const permisoData = await resp.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
        }
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }

      // 3. Actualizar el estatus a "no autorizado"
      if (idEstatus) {
        try {
          await fetch("/api/estatus/no_autorizado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
        } catch (err) {
          console.error("Error al actualizar estatus no autorizado:", err);
        }
      }

      // Oculta el modalVer y muestra el modalComentario
      document.getElementById("modalVer").classList.remove("active");
      const modalAceptado = document.getElementById("modalAceptado");
      if (modalAceptado) {
        modalAceptado.classList.remove("active");
        modalAceptado.setAttribute("hidden", "");
      }
      const modalComentario = document.getElementById("modalComentario");
      if (modalComentario) {
        modalComentario.classList.add("active");
        modalComentario.removeAttribute("hidden");
      }
      cargarPermisosTabla();
      cargarTargetasDesdeAutorizar();
    });
  }

  document.getElementById("contenedor-apertura-supervisor").innerHTML =
    renderAperturaSupervisor(mapSupervisorFields(data.general));
});

// Delegación de eventos para los botones editar (edit)
const tableBody = document.getElementById("table-body");
if (tableBody) {
  tableBody.addEventListener("click", function (e) {
    // Editar
    const editBtn = e.target.closest(".action-btn.edit");
    if (editBtn) {
      const row = editBtn.closest("tr");
      const tipoPermiso = row ? row.children[1].textContent.trim() : "";
      const viewBtn = row ? row.querySelector(".action-btn.view") : null;
      const idPermiso = viewBtn ? viewBtn.getAttribute("data-idpermiso") : "";
      if (tipoPermiso === "PT No Peligroso") {
        window.location.href = `/Modules/Fomularios/PT1/PT1supervisor.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT para Apertura Equipo Línea") {
        window.location.href = `/Modules/Fomularios/PT2/PT2supervisor.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Entrada a Espacio Confinado") {
        window.location.href = `/Modules/Fomularios/PT3/PT3supervisor.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT en Altura") {
        window.location.href = `/Modules/Fomularios/PT4/PT4supervisor.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Fuego Abierto") {
        window.location.href = `/Modules/Fomularios/PT5/PT5supervisor.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Energía Eléctrica") {
        window.location.href = `/Modules/Fomularios/PT6/PT6supervisor.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Fuentes Radioactivas") {
        window.location.href = `/Modules/Fomularios/PT7/PT7supervisor.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT para Izaje con Hiab con Grúa") {
        window.location.href = `/Modules/Fomularios/PT8/PT8supervisor.html?id=${idPermiso}`;
      } else {
        window.location.href = `/Modules/Fomularios/OTRO/OTROsupervisor.html?id=${idPermiso}`;
      }
    }

    // Ver/Imprimir
    const printOrViewBtn = e.target.closest(
      ".action-btn.print, .action-btn.view"
    );
    if (printOrViewBtn) {
      const row = printOrViewBtn.closest("tr");
      const tipoPermiso = row ? row.children[1].textContent.trim() : "";
      const idPermiso = row
        ? row.querySelector(".action-btn.view").getAttribute("data-idpermiso")
        : "";

      if (tipoPermiso === "PT No Peligroso") {
        window.location.href = `/Modules/Fomularios/PT1/PT1imprimirseg.html?tipo=PT1&id=${idPermiso}`;
      } else if (tipoPermiso === "PT para Apertura Equipo Línea") {
        window.location.href = `/Modules/Fomularios/PT2/PT2imprimirseg.html?tipo=PT2&id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Entrada a Espacio Confinado") {
        window.location.href = `/Modules/Fomularios/PT3/PT3imprimirseg.html?tipo=PT3&id=${idPermiso}`;
      } else if (tipoPermiso === "PT en Altura") {
        window.location.href = `/Modules/Fomularios/PT4/PT4imprimirseg.html?tipo=PT4&id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Fuego Abierto") {
        window.location.href = `/Modules/Fomularios/PT5/PT5imprimirseg.html?tipo=PT5&id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Energía Eléctrica") {
        window.location.href = `/Modules/Fomularios/PT6/PT6imprimirseg.html?tipo=PT6&id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Fuentes Radioactivas") {
        window.location.href = `/Modules/Fomularios/PT7/PT7imprimirseg.html?tipo=PT7&id=${idPermiso}`;
      } else if (tipoPermiso === "PT para Izaje con Hiab con Grúa") {
        window.location.href = `/Modules/Fomularios/PT8/PT8imprimirseg.html?tipo=PT8&id=${idPermiso}`;
      } else {
        window.location.href = `/JS/usuario/LogicaImprimir.html?tipo=OTRO&id=${idPermiso}`;
      }
    }
  });
}

// Si no tienes la función de mapeo, agrégala:
function mapSupervisorFields(general) {
  return {
    "special-protection": general.proteccion_especial_recomendada,
    "skin-protection": general.proteccion_piel_cuerpo,
    "respiratory-protection": general.proteccion_respiratoria,
    "eye-protection": general.proteccion_ocular,
    "fire-protection": general.proteccion_contraincendio,
    "fire-protection-type": general.tipo_proteccion_contraincendio,
    "barriers-required": general.instalacion_barreras,
    observations: general.observaciones_riesgos,
    "co2-level": general.co2_nivel,
    "nh3-level": general.nh3_nivel,
    "oxygen-level": general.oxigeno_nivel,
    "lel-level": general.lel_nivel,
  };
}

// Elimina o comenta este bloque para que el botón "ver" ya no abra el modal de ver
/*
const tbody = document.getElementById("table-body");
tbody.addEventListener("click", async function (e) {
  if (e.target.closest(".view")) {
    // ... abre modal ...
  }
});
*/

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

// Paginación compacta con flechas y puntos suspensivos
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

  // Paginación compacta
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

// Devuelve los permisos actualmente filtrados (sin paginación).
// Esto se expone en `window` para que otros scripts (p. ej. export) puedan obtener
// exactamente los registros que el usuario está viendo/filtrando.
window.getPermisosFiltrados = function () {
  // Si aún no se cargó nada
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

  // Aplicar búsqueda de texto (folio, contrato, solicitante, tipo_permiso)
  if (filtroBusqueda) {
    const q = filtroBusqueda;
    filtrados = filtrados.filter((permiso) => {
      const prefijo = (permiso.prefijo || "").toLowerCase();
      const contrato = (permiso.contrato || "").toString().toLowerCase();
      const solicitante = (permiso.solicitante || "").toLowerCase();
      const tipo = (permiso.tipo_permiso || "").toLowerCase();
      return (
        prefijo.includes(q) ||
        contrato.includes(q) ||
        solicitante.includes(q) ||
        tipo.includes(q)
      );
    });
  }

  return filtrados;
};
