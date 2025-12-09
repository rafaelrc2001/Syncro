import {
  mostrarInformacionGeneral,
  mostrarDetallesTecnicos,
  mostrarAST,
  mostrarActividadesAST,
  mostrarParticipantesAST,
} from "../generales/LogicaVerFormularios.js";

import { renderApertura } from "/JS/generales/LogicaVerFormularios.js";
import { renderAperturaArea } from "../generales/render_pt_apertura.js";
import {
  renderNoPeligroso,
  renderNoPeligrosoArea,
} from "../generales/render_pt_no.js";

// --- Tarjetas desde autorizar ---
async function cargarTargetasDesdeAutorizar() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id_departamento = usuario && usuario.id ? usuario.id : null;
    if (!id_departamento)
      throw new Error("No se encontró el id de departamento del usuario");
    const response = await fetch(`/api/autorizar/${id_departamento}`);
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
      if (estatus === "espera area" || estatus === "en espera del área") {
        porAutorizar++;
      } else if (estatus === "activo") {
        activos++;
      } else if (
        estatus === "terminado" ||
        estatus === "cierre sin incidentes" ||
        estatus === "cierre con incidentes" ||
        estatus === "cierre con accidentes"
      ) {
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
  document.querySelectorAll(".action-btn.print").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const idPermiso = this.getAttribute("data-idpermiso");
      window.idPermisoActual = idPermiso; // Guardar el ID globalmente
      console.log("ID del permiso consultado:", idPermiso);
      try {
        const response = await fetch(
          `/api/verformularios?id=${encodeURIComponent(idPermiso)}`
        );
        if (!response.ok) throw new Error("Error al obtener datos del permiso");
        const data = await response.json();
        console.log("Respuesta de /api/verformularios:", data);
        // Llenar sección 1: Información General
        if (data.general) mostrarInformacionGeneral(data.general);
        // Mostrar el render personalizado solo para PT No Peligroso
        if (data.general && data.general.tipo_permiso === "PT No Peligroso") {
          permisoHandlers["PT No Peligroso"].render(data);
        } else {
          // Limpiar el formulario de No Peligroso si no corresponde
          const noPeligrosoArea = document.getElementById(
            "modal-no-peligroso-area"
          );
          if (noPeligrosoArea) noPeligrosoArea.innerHTML = "";
          if (typeof mostrarDetallesTecnicos === "function" && data.detalles) {
            mostrarDetallesTecnicos(data.detalles);
          }
        }
        // Llenar AST y Participantes si tienes los datos y funciones
        if (typeof mostrarAST === "function" && data.ast) {
          mostrarAST(data.ast);
        }
        if (typeof mostrarActividadesAST === "function") {
          mostrarActividadesAST(data.actividades_ast || []);
        }
        if (typeof mostrarParticipantesAST === "function") {
          mostrarParticipantesAST(data.participantes_ast || []);
        }
        // Mostrar/ocultar bloque de No Peligroso
        const bloqueNoPeligroso = document.getElementById("modal-no-peligroso");
        if (data.general && data.general.tipo_permiso === "PT No Peligroso") {
          if (bloqueNoPeligroso) bloqueNoPeligroso.style.display = "";
          document.getElementById("modal-especifica").innerHTML = "";
          document.getElementById("modal-apertura-area").innerHTML = "";
        } else {
          if (bloqueNoPeligroso) bloqueNoPeligroso.style.display = "none";
          if (
            data.general &&
            data.general.tipo_permiso === "PT para Apertura Equipo o Línea"
          ) {
            document.getElementById("modal-especifica").innerHTML =
              renderApertura(data.general);
            // Mostrar tabla de requisitos de apertura en el área correspondiente
            document.getElementById("modal-apertura-area").innerHTML =
              renderAperturaArea(data.general);
          } else {
            document.getElementById("modal-especifica").innerHTML = "";
            document.getElementById("modal-apertura-area").innerHTML = "";
          }
        }
        // Abrir el modal
        document.getElementById("modalVer").classList.add("active");
        // Dentro de asignarEventosVer, después de obtener data.general:
        window.tipoPermisoActual = data.general.tipo_permiso;
      } catch (err) {
        console.error("Error al obtener datos del permiso:", err);
      }
    });
  });
}

async function cargarPermisosTabla() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id_departamento = usuario && usuario.id ? usuario.id : null;
    if (!id_departamento)
      throw new Error("No se encontró el id de departamento del usuario");
    const response = await fetch(`/api/autorizar/${id_departamento}`);
    if (!response.ok) throw new Error("Error al consultar permisos");
    permisosGlobal = await response.json();
    mostrarPermisosFiltrados("En espera del área");
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
    const puedeEditar = estatusNorm === "en espera del área";
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

    row.innerHTML = `
    <td>${permiso.prefijo}</td>
    <td>${permiso.tipo_permiso}</td>
    <td>${permiso.descripcion}</td>
    <td>${permiso.area}</td>
    <td>${permiso.solicitante}</td>
    <td>${formatearFecha(permiso.fecha_hora)}</td>
    <td><span class="status-badge${badgeClass ? " " + badgeClass : ""}">${
      permiso.estatus
    }</span></td>
    <td>
    <button class="action-btn print" data-idpermiso="${permiso.id_permiso}">
        <i class="ri-eye-line"></i>
      </button>
      <button class="action-btn edit${!puedeEditar ? " edit-disabled" : ""}"${
      !puedeEditar ? " disabled" : ""
    }>
        <i class="ri-edit-line"></i>
      </button>
    </td>
  `;
    tbody.appendChild(row);
  });

  // Asignar evento click a los botones editar después de generar la tabla
  document.querySelectorAll(".action-btn.edit").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const tipoPermiso = row ? row.children[1].textContent.trim() : "";
      const idPermiso = row
        ? row.querySelector(".action-btn.print").getAttribute("data-idpermiso")
        : "";

      if (tipoPermiso === "PT No Peligroso") {
        window.location.href = `/Modules/Fomularios/PT1/PT1area.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT para Apertura Equipo o Línea") {
        window.location.href = `/Modules/Fomularios/PT2/PT2area.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Entrada a Espacio Confinado") {
        window.location.href = `/Modules/Fomularios/PT3/PT3area.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT en Altura") {
        window.location.href = `/Modules/Fomularios/PT4/PT4area.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Fuego Abierto") {
        window.location.href = `/Modules/Fomularios/PT5/PT5area.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Energía Eléctrica") {
        window.location.href = `/Modules/Fomularios/PT6/PT6area.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Fuentes Radioactivas") {
        window.location.href = `/Modules/Fomularios/PT7/PT7area.html?id=${idPermiso}`;
      } else if (tipoPermiso === "PT para Izaje con Hiab con Grúa") {
        window.location.href = `/Modules/Fomularios/PT8/PT8area.html?tipo=PT8&id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Cesta Izada") {
        window.location.href = `/Modules/Fomularios/PT9/PT9area.html?tipo=PT9&id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Excavacion") {
        window.location.href = `/Modules/Fomularios/PT10/PT10area.html?tipo=PT10&id=${idPermiso}`;
      } else {
        window.location.href = `/Modules/Fomularios/OTRO/OTROarea.html?id=${idPermiso}`;
      }
    });
  });

  // Asignar evento click a los botones imprimir después de generar la tabla
  document.querySelectorAll(".action-btn.print").forEach((btn) => {
    btn.addEventListener("click", function () {
      const row = this.closest("tr");
      const tipoPermiso = row ? row.children[1].textContent.trim() : "";
      const idPermiso = row
        ? row.querySelector(".action-btn.print").getAttribute("data-idpermiso")
        : "";

      if (tipoPermiso === "PT No Peligroso") {
        window.location.href = `/Modules/Fomularios/PT1/PT1imprimir2.html?tipo=PT1&id=${idPermiso}`;
      } else if (tipoPermiso === "PT para Apertura Equipo o Línea") {
        window.location.href = `/Modules/Fomularios/PT2/PT2imprimir2.html?tipo=PT2&id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Entrada a Espacio Confinado") {
        window.location.href = `/Modules/Fomularios/PT3/PT3imprimir2.html?tipo=PT3&id=${idPermiso}`;
      } else if (tipoPermiso === "PT en Altura") {
        window.location.href = `/Modules/Fomularios/PT4/PT4imprimir2.html?tipo=PT4&id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Fuego Abierto") {
        window.location.href = `/Modules/Fomularios/PT5/PT5imprimir2.html?tipo=PT5&id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Energía Eléctrica") {
        window.location.href = `/Modules/Fomularios/PT6/PT6imprimir2.html?tipo=PT6&id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Fuentes Radioactivas") {
        window.location.href = `/Modules/Fomularios/PT7/PT7imprimir2.html?tipo=PT7&id=${idPermiso}`;
      } else if (tipoPermiso === "PT para Izaje con Hiab con Grúa") {
        window.location.href = `/Modules/Fomularios/PT8/PT8imprimir2.html?tipo=PT8&id=${idPermiso}`;
      } else if (tipoPermiso === "PT con Cesta Izada") {
        window.location.href = `/Modules/Fomularios/PT9/PT9imprimir2.html?tipo=PT9&id=${idPermiso}`;
      } else if (tipoPermiso === "PT de Excavacion") {
        window.location.href = `/Modules/Fomularios/PT10/PT10imprimir2.html?tipo=PT10&id=${idPermiso}`;
      } else {
        window.location.href = `/JS/usuario/LogicaImprimir.html?tipo=OTRO&id=${idPermiso}`;
      }
    });
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
});

// Cierra el modal de ver y el de comentario al dar clic en el botón 'Aceptar' exclusivo de AutorizarPT

// --- Lógica exclusiva para los botones de AutorizarPT ---
document.addEventListener("DOMContentLoaded", () => {
  // Botón "Aceptar" (abre modalAceptado)
  const btnAceptar = document.getElementById("btn-autorizar-pt");
  if (btnAceptar) {
    btnAceptar.addEventListener("click", async function () {
      const idPermiso = window.idPermisoActual;
      const tipoPermiso = window.tipoPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";
      const operador_area = operadorInput ? operadorInput.value.trim() : "";

      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!responsable_area) {
        alert("Debes ingresar el nombre del responsable.");
        return;
      }

      // --- Escalable: Guardar requisitos según el tipo de permiso ---
      if (
        permisoHandlers[tipoPermiso] &&
        permisoHandlers[tipoPermiso].guardarRequisitos
      ) {
        const ok = await permisoHandlers[tipoPermiso].guardarRequisitos(
          idPermiso
        );
        if (!ok) return;
      }

      // 1. Insertar autorización de área
      try {
        const resp = await fetch("/api/autorizaciones/area", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            responsable_area,
            encargado_area: operador_area,
          }),
        });
        if (!resp.ok) {
          const data = await resp.json();
          if (resp.status === 409) {
            alert("Este permiso ya fue autorizado previamente.");
            return;
          } else {
            alert(data.error || "Error al autorizar el permiso.");
            return;
          }
        }
      } catch (err) {
        console.error("Error al insertar autorización de área:", err);
      }

      // 2. Consultar el id_estatus desde permisos_trabajo
      let idEstatus = null;
      try {
        const resp = await fetch(`/api/permisos-trabajo/${idPermiso}`);
        if (resp.ok) {
          const permisoData = await resp.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
        }
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }

      // 3. Actualizar el estatus si se obtuvo el id_estatus
      if (idEstatus) {
        try {
          await fetch("/api/estatus/seguridad", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
        } catch (err) {
          console.error("Error al actualizar estatus de seguridad:", err);
        }
      }

      // ...lógica original...
      document.getElementById("modalVer").classList.remove("active");
      // Oculta el modalComentario si estuviera abierto
      const modalComentario = document.getElementById("modalComentario");
      if (modalComentario) {
        modalComentario.classList.remove("active");
        modalComentario.setAttribute("hidden", "");
      }
      // Muestra el modalAceptado correctamente
      const modalAceptado = document.getElementById("modalAceptado");
      if (modalAceptado) {
        modalAceptado.classList.add("active");
        modalAceptado.removeAttribute("hidden");
      }
    });
  }

  // Botón "No autorizar" (abre modalComentario)
  const btnNoAutorizar = document.getElementById("btn-noautorizar-pt");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", async function () {
      // Validar nombre del responsable antes de abrir el modal de comentario
      const responsableInput = document.getElementById("responsable-aprobador");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";
      if (!responsable_area) {
        alert(
          "Debes ingresar el nombre del responsable del área antes de continuar."
        );
        if (responsableInput) responsableInput.focus();
        return;
      }
      // Solo cierra el modal de ver y abre el de comentario
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
      // Consulta el id_estatus y lo guarda en variable global
      const idPermiso = window.idPermisoActual;
      window.idEstatusNoAutorizado = null;
      if (idPermiso) {
        try {
          const resp = await fetch(`/api/permisos-trabajo/${idPermiso}`);
          if (resp.ok) {
            const permisoData = await resp.json();
            window.idEstatusNoAutorizado =
              permisoData.id_estatus ||
              (permisoData.data && permisoData.data.id_estatus);
          }
        } catch (err) {
          console.error("Error al consultar id_estatus:", err);
        }
      }
    });
  }

  // Botón "Cerrar" en modalAceptado (cierra modal y regresa a la página)
  const btnCerrarAceptado = document.querySelector(
    "#modalAceptado .cerrar-btn"
  );
  if (btnCerrarAceptado) {
    btnCerrarAceptado.addEventListener("click", function () {
      document.getElementById("modalAceptado").classList.remove("active");
      // Redirigir o recargar la página (ajusta si quieres otro comportamiento)
      window.location.reload();
    });
  }

  // Botón "Enviar" en modalComentario (cierra el modalComentario y el modalVer)
  const btnEnviarComentario = document.querySelector(
    "#modalComentario .enviar-btn"
  );
  if (btnEnviarComentario) {
    btnEnviarComentario.addEventListener("click", async function () {
      const idPermiso = window.idPermisoActual;
      const idEstatus = window.idEstatusNoAutorizado;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const comentarioInput = document.getElementById("comentario");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";
      const operador_area = operadorInput ? operadorInput.value.trim() : "";
      const comentario = comentarioInput ? comentarioInput.value.trim() : "";
      if (!idPermiso) {
        alert(
          "No se pudo obtener el ID del permiso. Selecciona un permiso válido."
        );
        return;
      }
      if (!responsable_area) {
        alert(
          "Debes ingresar el nombre del responsable del área antes de continuar."
        );
        if (responsableInput) responsableInput.focus();
        return;
      }
      if (!comentario) {
        alert("Debes agregar un comentario antes de continuar.");
        if (comentarioInput) comentarioInput.focus();
        return;
      }
      // 1. Insertar autorización de área
      let autorizacionExitosa = false;
      try {
        const resp = await fetch("/api/autorizaciones/area", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            responsable_area,
            encargado_area: operador_area,
          }),
        });
        if (!resp.ok) {
          const data = await resp.json();
          if (resp.status === 409) {
            alert("Este permiso ya fue autorizado previamente.");
            autorizacionExitosa = false;
            return;
          } else {
            alert(data.error || "Error al registrar la autorización.");
            autorizacionExitosa = false;
            return;
          }
        } else {
          autorizacionExitosa = true;
        }
      } catch (err) {
        console.error("Error al insertar autorización de área:", err);
        alert("Error al insertar autorización de área.");
        autorizacionExitosa = false;
        return;
      }

      // 2. Actualizar el estatus si se obtuvo el id_estatus
      if (autorizacionExitosa && idEstatus) {
        try {
          await fetch("/api/estatus/no_autorizado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
        } catch (err) {
          console.error("Error al actualizar estatus de no_autorizado:", err);
        }
        // 3. Guardar el comentario en la columna nueva
        try {
          await fetch("/api/estatus/comentario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus, comentario }),
          });
        } catch (err) {
          alert("No se pudo guardar el comentario.");
          console.error("Error al guardar el comentario:", err);
        }
      }

      // Oculta el modalComentario y el modalVer
      const modalComentario = document.getElementById("modalComentario");
      if (modalComentario) {
        modalComentario.classList.remove("active");
        modalComentario.setAttribute("hidden", "");
      }
      const modalVer = document.getElementById("modalVer");
      if (modalVer) {
        modalVer.classList.remove("active");
        modalVer.setAttribute("hidden", "");
      }

      // Actualiza la tabla y tarjetas
      cargarPermisosTabla();
      cargarTargetasDesdeAutorizar();
    });
  }

  // Botón "Cancelar" en modalComentario (cierra modalComentario y regresa a modalVer)
  const btnCancelarComentario = document.querySelector(
    "#modalComentario .cancelar-btn"
  );
  if (btnCancelarComentario) {
    btnCancelarComentario.addEventListener("click", function () {
      document.getElementById("modalComentario").classList.remove("active");
      document.getElementById("modalVer").classList.add("active");
    });
  }
});

const permisoHandlers = {
  "PT para Apertura Equipo o Línea": {
    render: (data) => {
      document.getElementById("modal-especifica").innerHTML = renderApertura(
        data.general
      );
      document.getElementById("modal-apertura-area").innerHTML =
        renderAperturaArea(data.general);
    },
    guardarRequisitos: async (idPermiso) => {
      const formApertura = document.getElementById("form-apertura-area");
      if (formApertura) {
        const requiredFields = formApertura.querySelectorAll(
          "select[required], input[required]"
        );
        let allFilled = true;
        requiredFields.forEach((field) => {
          if (!field.value || field.value.trim() === "") {
            allFilled = false;
            field.classList.add("campo-incompleto");
          } else {
            field.classList.remove("campo-incompleto");
          }
        });
        if (!allFilled) {
          alert(
            "Por favor, llena todos los campos obligatorios antes de continuar."
          );
          return false;
        }
        const formData = new FormData(formApertura);
        const requisitos = {};
        for (let [key, value] of formData.entries()) {
          requisitos[key] = value;
        }
        try {
          const resp = await fetch(
            `/api/pt-apertura/requisitos_area/${idPermiso}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requisitos),
            }
          );
          if (!resp.ok) {
            const data = await resp.json();
            alert(data.error || "Error al guardar los requisitos de apertura.");
            return false;
          }
        } catch (err) {
          alert("Error al actualizar requisitos de apertura.");
          return false;
        }
      }
      return true;
    },
  },
  "PT No Peligroso": {
    render: (data) => {
      // Renderiza el formulario en el nuevo contenedor
      if (data.general && data.general.tipo_permiso === "PT No Peligroso") {
        document.getElementById("modal-no-peligroso-area").innerHTML =
          renderNoPeligrosoArea(data.general);
      } else {
        document.getElementById("modal-no-peligroso-area").innerHTML = "";
      }
    },
    guardarRequisitos: async (idPermiso) => {
      /* ... */
    },
  },
  // Aquí irán los otros tipos de permisos...
};

function formatearFecha(fechaISO) {
  if (!fechaISO) return "-";
  const fecha = new Date(fechaISO);
  if (isNaN(fecha.getTime())) return "Fecha inválida";
  // Mostrar en UTC igual que en la base de datos
  const year = fecha.getUTCFullYear();
  const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const day = String(fecha.getUTCDate()).padStart(2, "0");
  const hour = String(fecha.getUTCHours()).padStart(2, "0");
  const minute = String(fecha.getUTCMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hour}:${minute}`;
}

// Devuelve los permisos actualmente filtrados (sin paginación).
// Se expone en `window` para que otros scripts (p. ej. export) puedan obtener
// exactamente los registros que el usuario está viendo/filtrando.
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
      if (filtroNorm === "continua") return estatus === "continua";
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

// Exportar a Excel (intenta usar SheetJS si está cargado en la página; si no, cae a CSV)
function exportPermisosToExcel(rows, filename = "export-permisos.xlsx") {
  if (!rows || !rows.length) {
    alert("No hay registros para exportar.");
    return;
  }

  // Mapea los campos a columnas más legibles si se desea
  const mapped = rows.map((p) => ({
    Prefijo: p.prefijo || "",
    Tipo: p.tipo_permiso || "",
    Descripcion: p.descripcion || "",
    Area: p.area || "",
    Solicitante: p.solicitante || "",
    Contrato: p.contrato || "",
    Fecha: formatearFecha(p.fecha_hora) || "",
    Estatus: p.estatus || "",
    ID: p.id_permiso || "",
  }));

  // Si SheetJS (XLSX) está disponible, usarlo
  if (window.XLSX && typeof window.XLSX.utils !== "undefined") {
    try {
      const ws = window.XLSX.utils.json_to_sheet(mapped);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, "Permisos");
      window.XLSX.writeFile(wb, filename);
      return;
    } catch (err) {
      console.error("Error exportando con SheetJS:", err);
      // fallback a CSV
    }
  }

  // Fallback: CSV download
  const keys = Object.keys(mapped[0]);
  const lines = [keys.join(",")];
  mapped.forEach((row) => {
    const vals = keys.map((k) => {
      const v = row[k] == null ? "" : String(row[k]);
      // escapado simple
      return '"' + v.replace(/"/g, '""') + '"';
    });
    lines.push(vals.join(","));
  });
  const csv = lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.replace(/\.xlsx$|\.csv$/i, "") + ".csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Export wiring removed for AutorizarPT page. If export functionality is
// required for other pages, implement it in their scripts separately.
