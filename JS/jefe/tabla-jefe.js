import {
  mostrarInformacionGeneral,
  mostrarDetallesTecnicos,
  mostrarAST,
  mostrarActividadesAST,
  mostrarParticipantesAST,
  renderApertura,
} from "../generales/LogicaVerFormularios.js";

// --- Tarjetas desde autorizar ---
async function cargarTargetasDesdeAutorizar() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id_departamento = usuario && usuario.id ? usuario.id : null;
    if (!id_departamento)
      throw new Error("No se encontró el id de departamento del usuario");
    const response = await fetch("http://localhost:3000/api/autorizar-jefe");
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
  document.querySelectorAll(".action-btn.view").forEach((btn) => {
    btn.addEventListener("click", async function () {
      const idPermiso = this.getAttribute("data-idpermiso");
      // Reinicia el select de supervisor y el campo visual cada vez que se abre el modal
      const supervisorSelect = document.getElementById("responsable-aprobador");
      if (supervisorSelect) supervisorSelect.selectedIndex = 0;
      const nombreAprobador = document.getElementById("nombre-aprobador");
      if (nombreAprobador)
        nombreAprobador.textContent = "Seleccione un supervisor";

      // Reinicia el select de categoría cada vez que se abre el modal
      const categoriaSelect = document.getElementById("responsable-aprobador2");
      if (categoriaSelect) categoriaSelect.selectedIndex = 0;
      window.idPermisoActual = idPermiso; // Guardar el ID globalmente
      console.log("ID del permiso consultado:", idPermiso);
      try {
        const response = await fetch(
          `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
            idPermiso
          )}`
        );
        if (!response.ok) throw new Error("Error al obtener datos del permiso");
        const data = await response.json();
        console.log("Respuesta de /api/verformularios:", data);
        // Llenar sección 1: Información General
        if (data.general) mostrarInformacionGeneral(data.general);
        // Llenar sección 2: Detalles Técnicos
        if (typeof mostrarDetallesTecnicos === "function" && data.detalles) {
          mostrarDetallesTecnicos(data.detalles);
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
        // Asignar responsables de área
        const responsables = data.responsables_area || {};

        // Selecciona los elementos .stamp-name correspondientes
        const responsableAreaElem = document
          .querySelectorAll(".stamp")[0]
          .querySelector(".stamp-name");
        const operadorAreaElem = document
          .querySelectorAll(".stamp")[1]
          .querySelector(".stamp-name");

        // Asigna los valores
        responsableAreaElem.textContent = responsables.responsable_area || "";
        operadorAreaElem.textContent = responsables.operador_area || "";

        // Abrir el modal
        document.getElementById("modalVer").classList.add("active");
      } catch (err) {
        console.error("Error al obtener datos del permiso:", err);
      }
    });
  });
}

async function cargarPermisosTabla() {
  try {
    const response = await fetch("http://localhost:3000/api/autorizar-jefe");
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
      return (permiso.prefijo || "").toLowerCase().includes(filtroBusqueda);
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
            <td>${permiso.fecha_hora}</td>
            <td><span class="status-badge${
              badgeClass ? " " + badgeClass : ""
            }">${permiso.estatus}</span></td>
            <td>
                <button class="action-btn view" data-idpermiso="${
                  permiso.id_permiso
                }"><i class="ri-eye-line"></i></button>
                <button class="action-btn print"><i class="ri-printer-line"></i></button>
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
  // Botones de página
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.className = "pagination-btn" + (i === paginaActual ? " active" : "");
    btn.textContent = i;
    btn.onclick = () => {
      paginaActual = i;
      mostrarPermisosFiltrados(document.getElementById("status-filter").value);
    };
    pagContainer.appendChild(btn);
  }
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
  // --- Botón No autorizar ---
  const btnNoAutorizar = document.getElementById("btn-noautorizar-pt");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", async function () {
      // Validar supervisor y categoría antes de abrir el modal de comentario
      const supervisorInput = document.getElementById("responsable-aprobador");
      const categoriaInput = document.getElementById("responsable-aprobador2");
      const supervisor = supervisorInput ? supervisorInput.value.trim() : "";
      const categoria = categoriaInput ? categoriaInput.value.trim() : "";
      if (!supervisor || !categoria) {
        alert(
          "Debes seleccionar el supervisor y la categoría antes de continuar."
        );
        if (!supervisor && supervisorInput) supervisorInput.focus();
        if (!categoria && categoriaInput) categoriaInput.focus();
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
          const resp = await fetch(
            `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
          );
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

  // --- Botón Enviar comentario ---
  const btnEnviarComentario = document.querySelector(
    "#modalComentario .enviar-btn"
  );
  if (btnEnviarComentario) {
    btnEnviarComentario.addEventListener("click", async function () {
      const idPermiso = window.idPermisoActual;
      const idEstatus = window.idEstatusNoAutorizado;
      const supervisorInput = document.getElementById("responsable-aprobador");
      const categoriaInput = document.getElementById("responsable-aprobador2");
      const comentarioInput = document.getElementById("comentario");
      const supervisor = supervisorInput ? supervisorInput.value.trim() : "";
      const categoria = categoriaInput ? categoriaInput.value.trim() : "";
      const comentario = comentarioInput ? comentarioInput.value.trim() : "";
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
        if (!supervisor && supervisorInput) supervisorInput.focus();
        if (!categoria && categoriaInput) categoriaInput.focus();
        return;
      }
      if (!comentario) {
        alert("Debes agregar un comentario antes de continuar.");
        if (comentarioInput) comentarioInput.focus();
        return;
      }
      // 1. Actualizar supervisor y categoría en autorizaciones
      let autorizacionExitosa = false;
      try {
        const resp = await fetch(
          "http://localhost:3000/api/autorizaciones/supervisor-categoria",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              supervisor,
              categoria,
            }),
          }
        );
        if (!resp.ok) {
          autorizacionExitosa = false;
          alert("Error al actualizar supervisor y categoría.");
          return;
        } else {
          autorizacionExitosa = true;
        }
      } catch (err) {
        console.error("Error al actualizar supervisor y categoría:", err);
        autorizacionExitosa = false;
        alert("Error al actualizar supervisor y categoría.");
        return;
      }

      // 2. Actualizar el estatus si se obtuvo el id_estatus
      if (autorizacionExitosa && idEstatus) {
        try {
          await fetch("http://localhost:3000/api/estatus/no_autorizado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
        } catch (err) {
          console.error("Error al actualizar estatus de no_autorizado:", err);
        }
        // 3. Guardar el comentario en la columna nueva
        try {
          await fetch("http://localhost:3000/api/estatus/comentario", {
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

document.addEventListener("DOMContentLoaded", () => {
  // Supervisores
  fetch("http://localhost:3000/api/supervisores")
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
  fetch("http://localhost:3000/api/categorias")
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

      // 1. Actualizar supervisor y categoría en autorizaciones
      try {
        await fetch(
          "http://localhost:3000/api/autorizaciones/supervisor-categoria",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              supervisor,
              categoria,
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
          `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
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
          await fetch("http://localhost:3000/api/estatus/activo", {
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
          "http://localhost:3000/api/autorizaciones/supervisor-categoria",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              supervisor,
              categoria,
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
          `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
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
          await fetch("http://localhost:3000/api/estatus/no_autorizado", {
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
});
