const btnCancelarEspecial = document.getElementById("btn-cancelar-especial");
if (btnCancelarEspecial) {
  btnCancelarEspecial.addEventListener("click", function () {
    const modal = document.getElementById("modalComentarioCancelarEspecial");
    if (idPermisoSeleccionado && modal) {
      modal.setAttribute("data-idpermiso", idPermisoSeleccionado);
      modal.classList.add("active");
      console.log(
        "modalComentarioCancelarEspecial abierto con id_permiso:",
        idPermisoSeleccionado
      );
    } else {
      alert("Selecciona un permiso primero");
    }
  });
}

// Botón especial para terminar permisos
const btnTerminarEspecial = document.getElementById("btn-terminar-especial");
if (btnTerminarEspecial) {
  btnTerminarEspecial.addEventListener("click", function () {
    const modal = document.getElementById("modalComentarioTerminarEspecial");
    if (idPermisoSeleccionado && modal) {
      modal.setAttribute("data-idpermiso", idPermisoSeleccionado);
      modal.classList.add("active");
      console.log(
        "modalComentarioTerminarEspecial abierto con id_permiso:",
        idPermisoSeleccionado
      );
    } else {
      alert("Selecciona un permiso primero");
    }
  });
}
import { asignarEventosVer } from "../generales/LogicaVerFormularios.js";

// funcionesusuario.js
// Centraliza la lógica de tarjetas y tabla de permisos para el usuario

let permisosGlobal = [];
let paginaActual = 1;
const registrosPorPagina = 7;
let filtroBusqueda = "";
let idPermisoSeleccionado = null;

async function cargarTargetasDesdePermisos() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id_departamento = usuario && usuario.id ? usuario.id : null;
    if (!id_departamento)
      throw new Error("No se encontró el id de departamento del usuario");
    const response = await fetch(
      `http://localhost:3000/api/vertablas/${id_departamento}`
    );
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

async function cargarPermisosTabla() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id_departamento = usuario && usuario.id ? usuario.id : null;
    if (!id_departamento)
      throw new Error("No se encontró el id de departamento del usuario");
    const response = await fetch(
      `http://localhost:3000/api/vertablas/${id_departamento}`
    );
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

document.addEventListener("DOMContentLoaded", function () {
  // Cancelar Especial
  const btnCancelarEspecial = document.getElementById("btn-cancelar-especial");
  const modalCancelarEspecial = document.getElementById(
    "modalComentarioCancelarEspecial"
  );
  const cancelarEspecialBtn = document.getElementById(
    "cancelarEspecial-cancelar-btn"
  );
  const enviarCancelarEspecialBtn = document.getElementById(
    "cancelarEspecial-enviar-btn"
  );

  if (btnCancelarEspecial && modalCancelarEspecial) {
    btnCancelarEspecial.addEventListener("click", function () {
      if (idPermisoSeleccionado) {
        modalCancelarEspecial.setAttribute(
          "data-idpermiso",
          idPermisoSeleccionado
        );
        modalCancelarEspecial.classList.add("active");
        console.log(
          "modalComentarioCancelarEspecial abierto con id_permiso:",
          idPermisoSeleccionado
        );
      } else {
        alert("Selecciona un permiso primero");
      }
    });
  }
  if (cancelarEspecialBtn && modalCancelarEspecial) {
    cancelarEspecialBtn.addEventListener("click", function () {
      modalCancelarEspecial.classList.remove("active");
      console.log("modalComentarioCancelarEspecial cerrado");
    });
  }
  if (enviarCancelarEspecialBtn && modalCancelarEspecial) {
    enviarCancelarEspecialBtn.addEventListener("click", async function () {
      try {
        // 1. Obtener el id_estatus del permiso seleccionado
        const id_permiso = idPermisoSeleccionado;
        if (!id_permiso) throw new Error("No hay permiso seleccionado");
        const urlEstatus = `http://localhost:3000/api/permisos-trabajo/${id_permiso}`;
        const resEstatus = await fetch(urlEstatus);
        if (!resEstatus.ok) throw new Error("Error obteniendo id_estatus");
        const dataEstatus = await resEstatus.json();
        if (!dataEstatus.id_estatus)
          throw new Error("No se encontró el estatus");
        // 2. Actualizar el estatus a 'cancelado'
        const urlCancelado = "http://localhost:3000/api/estatus/cancelado";
        const resUpdate = await fetch(urlCancelado, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: dataEstatus.id_estatus }),
        });
        const dataUpdate = await resUpdate.json();
        if (!dataUpdate.success)
          throw new Error(dataUpdate.error || "Error al actualizar");
        modalCancelarEspecial.classList.remove("active");
        // Cerrar otros modales relacionados si están abiertos
        const modalComentario = document.getElementById("modalComentario");
        if (modalComentario && modalComentario.classList.contains("active")) {
          modalComentario.classList.remove("active");
        }
        // Mostrar mensaje de éxito
        alert("Permiso cancelado con éxito");
        console.log("Estatus cancelado actualizado");
        // Aquí puedes refrescar la tabla si lo necesitas
      } catch (err) {
        alert("Error al cancelar: " + err.message);
        console.error(err);
      }
    });
  }

  // Terminar Especial
  const btnTerminarEspecial = document.getElementById("btn-terminar-especial");
  const modalTerminarEspecial = document.getElementById(
    "modalComentarioTerminarEspecial"
  );
  const cancelarTerminarEspecialBtn = modalTerminarEspecial
    ? modalTerminarEspecial.querySelector(".cancelar-btn")
    : null;
  const enviarTerminarEspecialBtn = modalTerminarEspecial
    ? modalTerminarEspecial.querySelector(".terminar_enviar_especial-btn")
    : null;

  if (btnTerminarEspecial && modalTerminarEspecial) {
    btnTerminarEspecial.addEventListener("click", function () {
      if (idPermisoSeleccionado) {
        modalTerminarEspecial.setAttribute(
          "data-idpermiso",
          idPermisoSeleccionado
        );
        modalTerminarEspecial.classList.add("active");
        console.log(
          "modalComentarioTerminarEspecial abierto con id_permiso:",
          idPermisoSeleccionado
        );
      } else {
        alert("Selecciona un permiso primero");
      }
    });
  }
  if (cancelarTerminarEspecialBtn && modalTerminarEspecial) {
    cancelarTerminarEspecialBtn.addEventListener("click", function () {
      modalTerminarEspecial.classList.remove("active");
      console.log("modalComentarioTerminarEspecial cerrado");
    });
  }
  if (enviarTerminarEspecialBtn && modalTerminarEspecial) {
    enviarTerminarEspecialBtn.addEventListener("click", async function () {
      try {
        // 1. Obtener el id_estatus del permiso seleccionado
        const id_permiso = idPermisoSeleccionado;
        if (!id_permiso) throw new Error("No hay permiso seleccionado");
        const urlEstatus = `http://localhost:3000/api/permisos-trabajo/${id_permiso}`;
        const resEstatus = await fetch(urlEstatus);
        if (!resEstatus.ok) throw new Error("Error obteniendo id_estatus");
        const dataEstatus = await resEstatus.json();
        if (!dataEstatus.id_estatus)
          throw new Error("No se encontró el estatus");
        // 2. Actualizar el estatus a 'terminado'
        const urlTerminado = "http://localhost:3000/api/estatus/terminado";
        const resUpdate = await fetch(urlTerminado, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: dataEstatus.id_estatus }),
        });
        const dataUpdate = await resUpdate.json();
        if (!dataUpdate.success)
          throw new Error(dataUpdate.error || "Error al actualizar");
        // Cerrar el modal
        modalTerminarEspecial.classList.remove("active");
        // Mostrar mensaje de éxito
        alert("Permiso terminado con éxito");
        console.log("Estatus terminado actualizado");
        // Aquí puedes refrescar la tabla si lo necesitas
      } catch (err) {
        alert("Error al terminar: " + err.message);
        console.error(err);
      }
    });
  }
  // Nueva lógica para el botón 'Enviar Nuevo' con clase encviar_continuar-btn
  const btnEnviarNuevo = document.querySelector(".encviar_continuar-btn");
  console.log("[DEBUG] btnEnviarNuevo:", btnEnviarNuevo);
  if (btnEnviarNuevo) {
    btnEnviarNuevo.addEventListener("click", async function () {
      console.log("Click en btnEnviarNuevo");
      const modalComentarioContinuar = document.getElementById(
        "modalComentarioContinuar"
      );
      const id_permiso = modalComentarioContinuar
        ? modalComentarioContinuar.getAttribute("data-idpermiso")
        : null;
      const url = `http://localhost:3000/api/permisos-trabajo/${id_permiso}`;
      console.log("[FETCH] id_permiso:", id_permiso, "URL:", url);
      if (!id_permiso) {
        alert("No se encontró el id del permiso en el modal");
        return;
      }
      try {
        // 1. Obtener el id_estatus
        const resEstatus = await fetch(url);
        if (!resEstatus.ok) {
          const text = await resEstatus.text();
          console.error("Respuesta no válida:", text);
          alert("Error en el servidor o ruta incorrecta");
          return;
        }
        const dataEstatus = await resEstatus.json();
        console.log("[FETCH] id_estatus obtenido:", dataEstatus.id_estatus);
        if (!dataEstatus.id_estatus)
          throw new Error("No se encontró el estatus");
        // 2. Actualizar el estatus a 'continua'
        const urlContinua = "http://localhost:3000/api/estatus/continua";
        console.log(
          "[POST] Actualizando estatus a 'continua' con id_estatus:",
          dataEstatus.id_estatus,
          "URL:",
          urlContinua
        );
        const resUpdate = await fetch(urlContinua, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: dataEstatus.id_estatus }),
        });
        const textUpdate = await resUpdate.text();
        console.log("[POST] Respuesta cruda:", textUpdate);
        let dataUpdate;
        try {
          dataUpdate = JSON.parse(textUpdate);
        } catch (e) {
          throw new Error(
            "La respuesta del servidor no es JSON: " + textUpdate
          );
        }
        if (!dataUpdate.success)
          throw new Error(dataUpdate.error || "Error al actualizar");
        // 3. Refrescar la tabla mostrando solo los permisos con estatus 'En espera del área'
        // Cerrar ambos modales: modalComentarioContinuar y modalVer
        modalComentarioContinuar.classList.remove("active");
        const modalVer = document.getElementById("modalVer");
        if (modalVer && modalVer.classList.contains("active")) {
          modalVer.classList.remove("active");
        }
        mostrarPermisosFiltrados("En espera del área");
        alert("Estatus actualizado a 'continua'");
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  } else {
    console.warn("[CHECK] btnEnviarNuevo NO encontrado en el DOM");
  }
  cargarTargetasDesdePermisos();
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

  // Asignar el id del permiso al hacer click en el botón de ver
  document.addEventListener("click", function (e) {
    if (e.target.closest(".action-btn.view")) {
      const btn = e.target.closest(".action-btn.view");
      idPermisoSeleccionado = btn.getAttribute("data-idpermiso");
      console.log("[VER] idPermisoSeleccionado:", idPermisoSeleccionado);
    }
  });

  // Al abrir el modal de continuar, asigna el id al modal
  const btnContinuar = document.getElementById("btn-continuar-pt");
  if (btnContinuar) {
    btnContinuar.addEventListener("click", function () {
      const modal = document.getElementById("modalComentarioContinuar");
      if (idPermisoSeleccionado && modal) {
        modal.setAttribute("data-idpermiso", idPermisoSeleccionado);
        modal.classList.add("active");
        console.log(
          "modalComentarioContinuar abierto con id_permiso:",
          idPermisoSeleccionado
        );
      } else {
        alert("Selecciona un permiso primero");
      }
    });
  }

  // Para cerrar el modal con el botón cancelar
  const cancelarBtn = document.querySelector(
    "#modalComentarioContinuar .cancelar-btn"
  );
  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", function () {
      const modal = document.getElementById("modalComentarioContinuar");
      if (modal) {
        modal.classList.remove("active");
        console.log("modalComentarioContinuar cerrado");
      }
    });
  }
});

// Lógica para el botón 'Cancelar Permiso' (abre el modal de comentario cancelar)
const btnCancelarPermisoPT = document.getElementById("btn-cancelarpermiso-pt");
if (btnCancelarPermisoPT) {
  btnCancelarPermisoPT.addEventListener("click", function () {
    const modal = document.getElementById("modalComentarioCancelar");
    if (idPermisoSeleccionado && modal) {
      modal.setAttribute("data-idpermiso", idPermisoSeleccionado);
      modal.classList.add("active");
      console.log(
        "modalComentarioCancelar abierto con id_permiso:",
        idPermisoSeleccionado
      );
    } else {
      alert("Selecciona un permiso primero");
    }
  });
}

// Lógica para el botón 'Enviar' del modal de comentario cancelar
const btnCancelarEnviar = document.querySelector(".cancelar_enviar-btn");
if (btnCancelarEnviar) {
  btnCancelarEnviar.addEventListener("click", async function () {
    const modalComentarioCancelar = document.getElementById(
      "modalComentarioCancelar"
    );
    const id_permiso = modalComentarioCancelar
      ? modalComentarioCancelar.getAttribute("data-idpermiso")
      : null;
    const url = `http://localhost:3000/api/permisos-trabajo/${id_permiso}`;
    console.log("[FETCH] id_permiso:", id_permiso, "URL:", url);
    if (!id_permiso) {
      alert("No se encontró el id del permiso en el modal");
      return;
    }
    try {
      // 1. Obtener el id_estatus
      const resEstatus = await fetch(url);
      if (!resEstatus.ok) {
        const text = await resEstatus.text();
        console.error("Respuesta no válida:", text);
        alert("Error en el servidor o ruta incorrecta");
        return;
      }
      const dataEstatus = await resEstatus.json();
      console.log("[FETCH] id_estatus obtenido:", dataEstatus.id_estatus);
      if (!dataEstatus.id_estatus) throw new Error("No se encontró el estatus");
      // 2. Actualizar el estatus a 'cancelado'
      const urlCancelado = "http://localhost:3000/api/estatus/cancelado";
      console.log(
        "[POST] Actualizando estatus a 'cancelado' con id_estatus:",
        dataEstatus.id_estatus,
        "URL:",
        urlCancelado
      );
      const resUpdate = await fetch(urlCancelado, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_estatus: dataEstatus.id_estatus }),
      });
      const textUpdate = await resUpdate.text();
      console.log("[POST] Respuesta cruda:", textUpdate);
      let dataUpdate;
      try {
        dataUpdate = JSON.parse(textUpdate);
      } catch (e) {
        throw new Error("La respuesta del servidor no es JSON: " + textUpdate);
      }
      if (!dataUpdate.success)
        throw new Error(dataUpdate.error || "Error al actualizar");
      // 3. Refrescar la tabla mostrando solo los permisos con estatus 'En espera del área'
      modalComentarioCancelar.classList.remove("active");
      const modalVer = document.getElementById("modalVer");
      if (modalVer) {
        console.log("modalVer estado:", {
          classList: [...modalVer.classList],
          styleDisplay: modalVer.style.display,
          computedDisplay: window.getComputedStyle(modalVer).display,
          computedVisibility: window.getComputedStyle(modalVer).visibility,
        });
      }
      // Para cerrar el modalComentarioCancelar con el botón cancelar
      const cancelarBtnCancelar = document.querySelector(
        "#modalComentarioCancelar .cancelar-btn"
      );
      if (cancelarBtnCancelar) {
        cancelarBtnCancelar.addEventListener("click", function () {
          const modal = document.getElementById("modalComentarioCancelar");
          if (modal) {
            modal.classList.remove("active");
            console.log("modalComentarioCancelar cerrado");
          }
        });
      }
      mostrarPermisosFiltrados("En espera del área");
      alert("Estatus actualizado a 'cancelado'");
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
} else {
  console.warn("[CHECK] btnCancelarEnviar NO encontrado en el DOM");
}

const permisoRenderers = {
  "PT No Peligroso": renderNoPeligroso,
  "PT para Apertura Equipo Línea": renderApertura,
  // Aquí agregas más tipos en el futuro
};

// Mostrar modal por ID
function mostrarModalComentarioCancelar() {
  document.getElementById("modalComentarioCancelar").style.display = "flex";
}
function ocultarModalComentarioCancelar() {
  document.getElementById("modalComentarioCancelar").style.display = "none";
}

function mostrarModalComentarioTerminar() {
  document.getElementById("modalComentarioTerminar").style.display = "flex";
}
function ocultarModalComentarioTerminar() {
  document.getElementById("modalComentarioTerminar").style.display = "none";
}

function mostrarModalComentarioContinuar() {
  document.getElementById("modalComentarioContinuar").style.display = "flex";
}
function ocultarModalComentarioContinuar() {
  document.getElementById("modalComentarioContinuar").style.display = "none";
}

// Mostrar el modal al hacer clic en "Continuar"
document
  .getElementById("btn-continuar-pt")
  .addEventListener("click", function () {
    console.log("[DEBUG] Botón Continuar presionado");
    document.getElementById("modalComentarioContinuar").style.display = "flex";
  });

// Ocultar el modal al hacer clic en "Cancelar"
document
  .querySelector("#modalComentarioContinuar .cancelar-btn")
  .addEventListener("click", function () {
    document.getElementById("modalComentarioContinuar").style.display = "none";
    console.log("[DEBUG] Modal Continuar ocultado");
  });

// Mensaje al hacer clic en "Enviar"

//Lo que hace es enviar el comentario al servidor ya aztualizar el estatus

document;
/*

document.addEventListener("DOMContentLoaded", function () {
  cargarTargetasDesdePermisos();
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

  const btnContinuar = document.getElementById("btn-continuar-pt");
  if (btnContinuar) {
    btnContinuar.addEventListener("click", function () {
      const modal = document.getElementById("modalComentarioContinuar");
      if (modal) {
        modal.classList.add("active");
        console.log("modalComentarioContinuar abierto");
      }
    });
  }

  // Para cerrar el modal con el botón cancelar
  const cancelarBtn = document.querySelector(
    "#modalComentarioContinuar .cancelar-btn"
  );
  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", function () {
      const modal = document.getElementById("modalComentarioContinuar");
      if (modal) {
        modal.classList.remove("active");
        console.log("modalComentarioContinuar cerrado");
      }
    });
  }

  // ...existing code...
});
*/
const permisoSeleccionado = document.querySelector("tr.selected");
const modal = document.getElementById("modalComentarioContinuar");
if (permisoSeleccionado && modal) {
  const id_permiso = permisoSeleccionado.getAttribute("data-idpermiso");
  modal.setAttribute("data-idpermiso", id_permiso);
  modal.classList.add("active");
  console.log("modalComentarioContinuar abierto con id_permiso:", id_permiso);
} else {
  alert("Selecciona un permiso primero");
}

function mostrarModalComentarioCancelarEspecial() {
  const modal = document.getElementById("modalComentarioCancelarEspecial");
  if (modal) modal.classList.add("active");
}
function ocultarModalComentarioCancelarEspecial() {
  const modal = document.getElementById("modalComentarioCancelarEspecial");
  if (modal) modal.classList.remove("active");
}

// Terminar Especial
function mostrarModalComentarioTerminarEspecial() {
  const modal = document.getElementById("modalComentarioTerminarEspecial");
  if (modal) modal.classList.add("active");
}
function ocultarModalComentarioTerminarEspecial() {
  const modal = document.getElementById("modalComentarioTerminarEspecial");
  if (modal) modal.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {
  // Cancelar Especial
  const btnCancelarEspecial = document.getElementById("btn-cancelar-especial");
  const modalCancelarEspecial = document.getElementById(
    "modalComentarioCancelarEspecial"
  );
  const cancelarBtn = document.getElementById("cancelarEspecial-cancelar-btn");
  const enviarBtn = document.getElementById("cancelarEspecial-enviar-btn");

  if (btnCancelarEspecial && modalCancelarEspecial) {
    btnCancelarEspecial.addEventListener("click", function () {
      if (idPermisoSeleccionado) {
        modalCancelarEspecial.setAttribute(
          "data-idpermiso",
          idPermisoSeleccionado
        );
        modalCancelarEspecial.classList.add("active");
        console.log(
          "modalComentarioCancelarEspecial abierto con id_permiso:",
          idPermisoSeleccionado
        );
      } else {
        alert("Selecciona un permiso primero");
      }
    });
  }
  if (cancelarBtn && modalCancelarEspecial) {
    cancelarBtn.addEventListener("click", function () {
      modalCancelarEspecial.classList.remove("active");
      console.log("modalComentarioCancelarEspecial cerrado");
    });
  }
  if (enviarBtn && modalCancelarEspecial) {
    enviarBtn.addEventListener("click", function () {
      // Aquí va la lógica de envío
      modalCancelarEspecial.classList.remove("active");
      console.log("modalComentarioCancelarEspecial enviado y cerrado");
    });
  }
  // Repite para Terminar Especial si lo necesitas
});
