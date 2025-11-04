// Valida que ambos campos estén seleccionados antes de autorizar
function validarSupervisorYCategoria() {
  const supervisorInput = document.getElementById("responsable-aprobador");
  const categoriaInput = document.getElementById("responsable-aprobador2");
  const supervisor = supervisorInput ? supervisorInput.value.trim() : "";
  const categoria = categoriaInput ? categoriaInput.value.trim() : "";
  if (!supervisor || !categoria) {
    alert("Debes seleccionar el supervisor y la categoría antes de autorizar.");
    if (!supervisor && supervisorInput) supervisorInput.focus();
    else if (!categoria && categoriaInput) categoriaInput.focus();
    return false;
  }
  return true;
}
// Mostrar nombres de responsable y operador del área en la sección de aprobaciones
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (!idPermiso) return;
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.success && data.data) {
        const responsable = document.getElementById("nombre-responsable-area");
        const operador = document.getElementById("nombre-operador-area");
        if (responsable)
          responsable.textContent = data.data.responsable_area || "-";
        if (operador) operador.textContent = data.data.operador_area || "-";
      }
    })
    .catch((err) => {
      console.error("Error al obtener responsables de área:", err);
    });
});
document.addEventListener("DOMContentLoaded", function () {
  // Inicializa los listeners del modal de comentarios al cargar la página
  setupModalComentario();
  // --- Lógica para el botón "Autorizar" ---
  const btnAutorizar = document.getElementById("btn-guardar-campos");
  if (btnAutorizar) {
    // Función que ejecuta la autorización real (guardada aquí para llamarla desde el modal)
    async function ejecutarAutorizacionSupervisor() {
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";

      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      try {
        const nowSupervisor = new Date();
        const fechaHoraAutorizacionSupervisor = new Date(
          nowSupervisor.getTime() - nowSupervisor.getTimezoneOffset() * 60000
        ).toISOString();

        await fetch("/api/autorizaciones/supervisor-categoria", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            supervisor,
            categoria,
            fecha_hora_supervisor: fechaHoraAutorizacionSupervisor,
          }),
        });
      } catch (err) {
        console.error("Error al actualizar supervisor y categoría:", err);
      }

      // Consultar id_estatus
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
        }
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }

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

      // Mostrar modal de confirmación y número de permiso
      let confirmationModal = document.getElementById("confirmation-modal");
      if (!confirmationModal) {
        confirmationModal = document.createElement("div");
        confirmationModal.id = "confirmation-modal";
        confirmationModal.style.display = "flex";
        confirmationModal.style.position = "fixed";
        confirmationModal.style.top = 0;
        confirmationModal.style.left = 0;
        confirmationModal.style.width = "100vw";
        confirmationModal.style.height = "100vh";
        confirmationModal.style.background = "rgba(44,62,80,0.25)";
        confirmationModal.style.zIndex = 1000;
        confirmationModal.style.justifyContent = "center";
        confirmationModal.style.alignItems = "center";
        confirmationModal.innerHTML = `
          <div style="background:#fff; border-radius:12px; max-width:400px; width:90vw; padding:2em 1.5em; box-shadow:0 4px 24px rgba(44,62,80,0.18); display:flex; flex-direction:column; gap:1em; align-items:center;">
            <h3 style="margin:0 0 0.5em 0; font-size:1.2em; color:#27ae60;"><i class="ri-checkbox-circle-line" style="margin-right:8px;"></i>Permiso autorizado correctamente</h3>
            <div style="font-size:1em; color:#2c3e50; margin-bottom:1em;">El permiso de trabajo es el número: <span id="generated-permit">-</span></div>
            <button id="modal-close-btn" style="background:#2980b9; color:#fff; border:none; border-radius:4px; padding:8px 24px; cursor:pointer; font-size:1em;">Cerrar</button>
          </div>
        `;
        document.body.appendChild(confirmationModal);
      } else {
        confirmationModal.style.display = "flex";
      }
      const permitNumber = document.getElementById("generated-permit");
      if (permitNumber) permitNumber.textContent = idPermiso || "-";

      const modalCloseBtn = document.getElementById("modal-close-btn");
      if (modalCloseBtn) {
        modalCloseBtn.setAttribute("type", "button");
        modalCloseBtn.onclick = function (e) {
          e.preventDefault();
          confirmationModal.style.display = "none";
          window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
        };
      }
    }

    // Mostrar confirmación antes de autorizar: abrimos un modal y al confirmar ejecutamos la autorización
    btnAutorizar.addEventListener("click", function (e) {
      e.preventDefault();
      // Validar ambos campos antes de mostrar el modal
      if (!validarSupervisorYCategoria()) return;
      // Rellenar campos del modal con datos canónicos si existen
      const data = window.currentPermisoData || {};
      const params = new URLSearchParams(window.location.search);
      // ID: prefer prefijo (general.prefijo), then data.prefijo, then URL id
      const idPermisoLocal =
        (data &&
          ((data.general &&
            (data.general.prefijo || data.general.prefijo_label)) ||
            data.prefijo ||
            (data.data && data.data.prefijo))) ||
        params.get("id") ||
        (data && ((data.general && data.general.id) || data.id)) ||
        "-";
      // Tipo: prefer data.tipo_permiso, then general.tipo_permiso, then detalles.tipo_actividad, fallback to tipo_mantenimiento
      const tipo =
        (data &&
          ((data.data && data.data.tipo_permiso) ||
            (data.general && data.general.tipo_permiso) ||
            (data.detalles && data.detalles.tipo_actividad) ||
            (data.data && data.data.tipo_mantenimiento) ||
            (data.general && data.general.tipo_mantenimiento))) ||
        document.getElementById("activity-type-label")?.textContent ||
        "-";
      // Solicitante: prefer general.solicitante then detalles.solicitante
      const solicitante =
        (data && data.general && data.general.solicitante) ||
        (data && data.detalles && data.detalles.solicitante) ||
        document.getElementById("nombre-solicitante-label")?.textContent ||
        "-";
      // Departamento: prefer detalles.departamento -> general.departamento -> detalles.planta -> general.planta -> DOM
      const departamento =
        (data &&
          ((data.detalles && data.detalles.departamento) ||
            (data.general && data.general.departamento) ||
            (data.detalles && data.detalles.planta) ||
            (data.general && data.general.planta))) ||
        document.getElementById("plant-label")?.textContent ||
        document.getElementById("sucursal-label")?.textContent ||
        "-";

      // Buscar modal existente o crear uno simple
      let modal = document.getElementById("modalConfirmarAutorizar");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "modalConfirmarAutorizar";
        modal.style.position = "fixed";
        modal.style.inset = "0";
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.background = "rgba(0,0,0,0.25)";
        modal.style.zIndex = 2000;
        modal.innerHTML = `
          <div style="background:#fff; border-radius:8px; padding:20px; max-width:450px; width:90%; box-shadow:0 8px 32px rgba(0,0,0,0.12);">
            <h3 style="margin:0 0 12px 0">Confirmar Autorización</h3>
            <p style="margin:0 0 8px 0; color:#333">¿Estás seguro que deseas autorizar este permiso? No tendrá opción para deshacer esta acción.</p>
            <p style="margin:8px 0"><strong>ID del Permiso:</strong> <span id="modal-permit-id">-</span></p>
            <p style="margin:8px 0"><strong>Tipo de Permiso:</strong> <span id="modal-permit-type">-</span></p>
            <p style="margin:8px 0"><strong>Solicitante:</strong> <span id="modal-solicitante">-</span></p>
            <p style="margin:8px 0"><strong>Departamento:</strong> <span id="modal-departamento">-</span></p>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
              <button id="btnCancelarConfirmar" style="padding:8px 12px;">Cancelar</button>
              <button id="btnConfirmarAutorizar" style="padding:8px 12px; background:#2c3e50; color:#fff; border:none; border-radius:4px;">Continuar</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      }

      // Rellenar los campos del modal
      try {
        const elId =
          document.getElementById("modal-permit-id") ||
          modal.querySelector("#modal-permit-id");
        const elTipo =
          document.getElementById("modal-permit-type") ||
          modal.querySelector("#modal-permit-type");
        const elSolicitante =
          document.getElementById("modal-solicitante") ||
          modal.querySelector("#modal-solicitante");
        const elDepto =
          document.getElementById("modal-departamento") ||
          modal.querySelector("#modal-departamento");
        if (elId) elId.textContent = idPermisoLocal;
        if (elTipo) elTipo.textContent = tipo;
        if (elSolicitante) elSolicitante.textContent = solicitante;
        if (elDepto) elDepto.textContent = departamento;
      } catch (e) {
        console.warn("No se pudo rellenar modalConfirmarAutorizar:", e);
      }

      modal.style.display = "flex";

      // Enlazar botones (asegurarnos de no duplicar handlers)
      const btnConfirm = document.getElementById("btnConfirmarAutorizar");
      const btnCancel = document.getElementById("btnCancelarConfirmar");

      function clearHandlers() {
        if (btnConfirm) btnConfirm.onclick = null;
        if (btnCancel) btnCancel.onclick = null;
      }

      if (btnCancel) {
        btnCancel.onclick = function () {
          modal.style.display = "none";
          clearHandlers();
        };
      }

      if (btnConfirm) {
        btnConfirm.onclick = async function () {
          modal.style.display = "none";
          clearHandlers();
          // Ejecutar la autorización real
          try {
            // Reuse existing authorization flow: trigger click on original handler by calling the same async logic
            // We'll call the original logic function if present, else fallback to submitting directly here.
            if (typeof ejecutarAutorizacionSupervisor === "function") {
              await ejecutarAutorizacionSupervisor();
            } else {
              // fallback: submit the original button's click handler by triggering it
              btnAutorizar.removeEventListener("click", arguments.callee);
              btnAutorizar.click();
            }
          } catch (err) {
            console.error("Error al autorizar desde modal supervisor:", err);
          }
        };
      }
    });
  }

  // --- Lógica para el botón "No Autorizar" ---
  const btnNoAutorizar = document.getElementById("btn-no-autorizar");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", async function () {
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!supervisor) {
        alert("Debes seleccionar el supervisor antes de rechazar.");
        return;
      }
      // Antes de abrir el modal de comentario, mostrar un modal de confirmación igual que en 'area'
      try {
        const data = window.currentPermisoData || {};
        // ID: prefer prefijo (general.prefijo) then data.prefijo then URL id
        const idPermisoLocal =
          (data &&
            ((data.general &&
              (data.general.prefijo || data.general.prefijo_label)) ||
              data.prefijo ||
              (data.data && data.data.prefijo))) ||
          idPermiso ||
          "-";
        // Tipo: prefer data.tipo_permiso, then general.tipo_permiso, then detalles.tipo_actividad, fallback to tipo_mantenimiento
        const tipo =
          (data &&
            ((data.data && data.data.tipo_permiso) ||
              (data.general && data.general.tipo_permiso) ||
              (data.detalles && data.detalles.tipo_actividad) ||
              (data.data && data.data.tipo_mantenimiento) ||
              (data.general && data.general.tipo_mantenimiento))) ||
          document.getElementById("activity-type-label")?.textContent ||
          "-";
        // Solicitante
        const solicitante =
          (data && data.general && data.general.solicitante) ||
          (data && data.detalles && data.detalles.solicitante) ||
          document.getElementById("nombre-solicitante-label")?.textContent ||
          "-";
        // Departamento: prefer detalles.departamento -> general.departamento -> planta -> DOM
        const departamento =
          (data &&
            ((data.detalles && data.detalles.departamento) ||
              (data.general && data.general.departamento) ||
              (data.detalles && data.detalles.planta) ||
              (data.general && data.general.planta))) ||
          document.getElementById("plant-label")?.textContent ||
          document.getElementById("sucursal-label")?.textContent ||
          "-";

        const noModal = document.getElementById("modalConfirmarNoAutorizar");
        if (noModal) {
          const elId =
            document.getElementById("modal-permit-id-no") ||
            noModal.querySelector("#modal-permit-id-no");
          const elTipo =
            document.getElementById("modal-permit-type-no") ||
            noModal.querySelector("#modal-permit-type-no");
          const elSolicitante =
            document.getElementById("modal-solicitante-no") ||
            noModal.querySelector("#modal-solicitante-no");
          const elDepto =
            document.getElementById("modal-departamento-no") ||
            noModal.querySelector("#modal-departamento-no");
          if (elId) elId.textContent = idPermisoLocal;
          if (elTipo) elTipo.textContent = tipo;
          if (elSolicitante) elSolicitante.textContent = solicitante;
          if (elDepto) elDepto.textContent = departamento;
          noModal.style.display = "flex";
          return; // mostramos confirmación primero
        }
      } catch (e) {
        console.warn(
          "No se pudo rellenar modalConfirmarNoAutorizar (supervisor):",
          e
        );
      }

      // Fallback: abrir directamente el modalComentario si no hay modalConfirmarNoAutorizar
      const modal = document.getElementById("modalComentario");
      if (modal) {
        modal.style.display = "flex";
        const ta = document.getElementById("comentarioNoAutorizar");
        if (ta) ta.value = "";
      }

      // Lógica para guardar el comentario y actualizar estatus a No Autorizado
      const btnGuardarComentario = document.getElementById(
        "btnGuardarComentario"
      );
      if (btnGuardarComentario) {
        btnGuardarComentario.onclick = async function () {
          const comentario = document
            .getElementById("comentarioNoAutorizar")
            .value.trim();
          if (!comentario) {
            alert("Debes escribir un motivo de rechazo.");
            return;
          }
          // 1. Actualizar supervisor y categoría en autorizaciones
          try {
            // Generar timestamp automático para rechazo supervisor PT1 (hora local)
            const nowRechazoSupervisor = new Date();
            const fechaHoraRechazoSupervisor = new Date(
              nowRechazoSupervisor.getTime() -
                nowRechazoSupervisor.getTimezoneOffset() * 60000
            ).toISOString();
            console.log(
              "[NO AUTORIZAR SUPERVISOR PT1] Timestamp generado (hora local):",
              fechaHoraRechazoSupervisor
            );

            await fetch("/api/autorizaciones/supervisor-categoria", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id_permiso: idPermiso,
                supervisor,
                categoria,
                comentario_no_autorizar: comentario,
                fecha_hora_supervisor: fechaHoraRechazoSupervisor,
              }),
            });
          } catch (err) {
            console.error("Error al actualizar supervisor y categoría:", err);
          }
          // 2. Consultar el id_estatus desde permisos_trabajo
          let idEstatus = null;
          try {
            const respEstatus = await fetch(
              `/api/permisos-trabajo/${idPermiso}`
            );
            if (respEstatus.ok) {
              const permisoData = await respEstatus.json();
              idEstatus =
                permisoData.id_estatus ||
                (permisoData.data && permisoData.data.id_estatus);
            }
          } catch (err) {
            console.error("Error al consultar id_estatus:", err);
          }
          // 3. Actualizar el estatus a "no autorizado" y guardar el comentario en la tabla estatus
          if (idEstatus) {
            try {
              await fetch("/api/estatus/no_autorizado", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_estatus: idEstatus }),
              });
              // Guardar el comentario en la tabla estatus
              await fetch("/api/estatus/comentario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_estatus: idEstatus, comentario }),
              });
            } catch (err) {
              console.error("Error al actualizar estatus no autorizado:", err);
            }
          }
          // 4. Cerrar el modal y mostrar mensaje de éxito
          const modal = document.getElementById("modalComentario");
          if (modal) modal.style.display = "none";
          alert("Permiso no autorizado correctamente");
          window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
        };
      }
      // Lógica para cerrar/cancelar el modal
      const btnCancelarComentario = document.getElementById(
        "btnCancelarComentario"
      );
      if (btnCancelarComentario) {
        btnCancelarComentario.onclick = function () {
          const modal = document.getElementById("modalComentario");
          if (modal) modal.style.display = "none";
        };
      }
    });
  }
  // Llenar select de supervisores desde la base de datos
  fetch("/api/supervisores")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador");
      if (select) {
        select.innerHTML =
          '<option value="" disabled selected>Seleccione un supervisor...</option>';
        data.forEach((sup) => {
          const option = document.createElement("option");
          option.value = sup.nombre;
          option.textContent = sup.nombre;
          select.appendChild(option);
        });
      }
    });

  // Llenar select de categorías desde la base de datos
  fetch("/api/categorias")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador2");
      if (select) {
        select.innerHTML =
          '<option value="" disabled selected>Seleccione una categoria...</option>';
        data.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.nombre;
          option.textContent = cat.nombre;
          select.appendChild(option);
        });
      }
    });
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    });
  }
});

// Handlers globales para modalConfirmarNoAutorizar (supervisor)
document.addEventListener("DOMContentLoaded", function () {
  const btnCancelarConfirmarNo = document.getElementById(
    "btnCancelarConfirmarNo"
  );
  const btnConfirmarNoAutorizar = document.getElementById(
    "btnConfirmarNoAutorizar"
  );
  if (btnCancelarConfirmarNo) {
    btnCancelarConfirmarNo.addEventListener("click", function () {
      const noModal = document.getElementById("modalConfirmarNoAutorizar");
      if (noModal) noModal.style.display = "none";
    });
  }
  if (btnConfirmarNoAutorizar) {
    btnConfirmarNoAutorizar.addEventListener("click", function () {
      const noModal = document.getElementById("modalConfirmarNoAutorizar");
      if (noModal) noModal.style.display = "none";
      const comentarioModal = document.getElementById("modalComentario");
      if (comentarioModal) {
        comentarioModal.style.display = "flex";
        const ta = document.getElementById("comentarioNoAutorizar");
        if (ta) {
          ta.value = "";
          ta.focus();
        }
      }
    });
  }
});

// Nuevo botón salir: vuelve a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  });
}
// Mostrar solo la sección 2 al cargar y ocultar las demás
document.addEventListener("DOMContentLoaded", function () {
  // --- FUNCIONES PARA RELLENAR AST Y PARTICIPANTES ---
  function mostrarAST(ast) {
    const eppList = document.getElementById("modal-epp-list");
    if (eppList) {
      eppList.innerHTML = "";
      if (ast.epp_requerido) {
        ast.epp_requerido.split(",").forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.trim();
          eppList.appendChild(li);
        });
      }
    }
    const maqList = document.getElementById("modal-maquinaria-list");
    if (maqList) {
      maqList.innerHTML = "";
      if (ast.maquinaria_herramientas) {
        ast.maquinaria_herramientas.split(",").forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.trim();
          maqList.appendChild(li);
        });
      }
    }
    const matList = document.getElementById("modal-materiales-list");
    if (matList) {
      matList.innerHTML = "";
      if (ast.material_accesorios) {
        ast.material_accesorios.split(",").forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.trim();
          matList.appendChild(li);
        });
      }
    }
  }

  function mostrarActividadesAST(actividades) {
    const tbody = document.getElementById("modal-ast-actividades-body");
    if (tbody) {
      tbody.innerHTML = "";
      if (Array.isArray(actividades)) {
        actividades.forEach((act) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                <td>${act.no || ""}</td>
                <td>${act.secuencia_actividad || ""}</td>
                <td>${act.personal_ejecutor || ""}</td>
                <td>${act.peligros_potenciales || ""}</td>
                <td>${act.descripcion || ""}</td>
                <td>${act.responsable || ""}</td>
            `;
          tbody.appendChild(tr);
        });
      }
    }
  }

  function mostrarParticipantesAST(participantes) {
    const tbody = document.getElementById("modal-ast-participantes-body");
    if (tbody) {
      tbody.innerHTML = "";
      if (Array.isArray(participantes)) {
        participantes.forEach((p) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                <td>${p.nombre || ""}</td>
                <td><span class="role-badge">${p.funcion || ""}</span></td>
                <td>${p.credencial || ""}</td>
                <td>${p.cargo || ""}</td>
            `;
          tbody.appendChild(tr);
        });
      }
    }
  }

  document.querySelectorAll(".form-section").forEach(function (section) {
    if (section.getAttribute("data-section") === "2") {
      section.style.display = "";
      section.classList.add("active");
    } else {
      section.style.display = "none";
      section.classList.remove("active");
    }
  });

  // Botón regresar: vuelve a AutorizarPT.html
  const btnRegresar = document.getElementById("btn-regresar");
  if (btnRegresar) {
    btnRegresar.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    });
  }

  // Botón salir: vuelve a AutorizarPT.html
  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    });
  }

  // Leer el id del permiso de la URL
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    // Llamar a la API para obtener los datos del permiso
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos recibidos para el permiso:", data);
        // Guardar globalmente para que los modales usen la misma fuente canónica que la vista de área
        try {
          window.currentPermisoData = data;
        } catch (e) {
          /* ignore */
        }
        // Prefijo en el título y descripción del trabajo
        if (data && data.general) {
          const h3 = document.querySelector(".section-header h3");
          if (h3) {
            h3.textContent = data.general.prefijo || "NP-XXXXXX";
          }
        }
        if (data && (data.detalles || data.general)) {
          const detalles = data.detalles || {};
          const general = data.general || {};

          document.getElementById("start-time-label").textContent =
            detalles.horario ||
            detalles.hora_inicio ||
            general.horario ||
            general.hora_inicio ||
            "-";
          document.getElementById("fecha-label").textContent =
            detalles.fecha || general.fecha || "-";
          document.getElementById("activity-type-label").textContent =
            detalles.tipo_actividad || general.tipo_actividad || "-";
          // Prefer planta from detalles, then general.planta (do NOT fallback to general.area which contains 'Site')
          document.getElementById("plant-label").textContent =
            detalles.planta || general.planta || "-";
          document.getElementById("descripcion-trabajo-label").textContent =
            detalles.descripcion_trabajo || general.descripcion_trabajo || "-";
          document.getElementById("empresa-label").textContent =
            detalles.empresa || general.empresa || "-";
          document.getElementById("nombre-solicitante-label").textContent =
            detalles.solicitante || general.solicitante || "-";
          document.getElementById("sucursal-label").textContent =
            detalles.sucursal || general.sucursal || "-";
          document.getElementById("contrato-label").textContent =
            detalles.contrato || general.contrato || "-";
          document.getElementById("work-order-label").textContent =
            detalles.ot || general.ot || "-";
          document.getElementById("equipment-label").textContent =
            detalles.equipo || general.equipo || "-";
          document.getElementById("tag-label").textContent =
            detalles.tag || general.tag || "-";
          // Condiciones actuales del equipo: mostrar fluido, presion, temperatura si existen
          let condiciones = [];
          if (data.detalles.fluido)
            condiciones.push(`Fluido: ${data.detalles.fluido}`);
          if (data.detalles.presion)
            condiciones.push(`Presión: ${data.detalles.presion}`);
          if (data.detalles.temperatura)
            condiciones.push(`Temperatura: ${data.detalles.temperatura}`);
          if (document.getElementById("equipment-conditions-label")) {
            document.getElementById("equipment-conditions-label").textContent =
              condiciones.length > 0
                ? condiciones.join(" | ")
                : data.detalles.condiciones_equipo || "-";
          }

          // Rellenar Condiciones del Proceso (inputs y <p> para vista solo lectura)
          if (document.getElementById("fluid")) {
            if (document.getElementById("fluid").tagName === "INPUT") {
              document.getElementById("fluid").value =
                data.detalles.fluido || "";
            } else {
              document.getElementById("fluid").textContent =
                data.detalles.fluido || "-";
            }
          }
          if (document.getElementById("pressure")) {
            if (document.getElementById("pressure").tagName === "INPUT") {
              document.getElementById("pressure").value =
                data.detalles.presion || "";
            } else {
              document.getElementById("pressure").textContent =
                data.detalles.presion || "-";
            }
          }
          if (document.getElementById("temperature")) {
            if (document.getElementById("temperature").tagName === "INPUT") {
              document.getElementById("temperature").value =
                data.detalles.temperatura || "";
            } else {
              document.getElementById("temperature").textContent =
                data.detalles.temperatura || "-";
            }
          }

          // Rellenar radios del análisis previo (modo edición)
          function marcarRadio(name, value) {
            if (!value) return;
            const radio = document.querySelector(
              `input[name='${name}'][value='${value.toLowerCase()}']`
            );
            if (radio) radio.checked = true;
          }
          marcarRadio(
            "risk-area",
            data.detalles.trabajo_area_riesgo_controlado
          );
          marcarRadio(
            "physical-delivery",
            data.detalles.necesita_entrega_fisica
          );
          marcarRadio("additional-ppe", data.detalles.necesita_ppe_adicional);
          marcarRadio(
            "surrounding-risk",
            data.detalles.area_circundante_riesgo
          );
          marcarRadio("supervision-needed", data.detalles.necesita_supervision);
          if (
            document.getElementById("pre-work-observations") &&
            document.getElementById("pre-work-observations").tagName ===
              "TEXTAREA"
          ) {
            document.getElementById("pre-work-observations").value =
              data.detalles.observaciones_analisis_previo || "";
          }

          // Rellenar campos de solo lectura (modo vista)
          if (document.getElementById("resp-risk-area"))
            document.getElementById("resp-risk-area").textContent =
              data.detalles.trabajo_area_riesgo_controlado || "-";
          if (document.getElementById("resp-physical-delivery"))
            document.getElementById("resp-physical-delivery").textContent =
              data.detalles.necesita_entrega_fisica || "-";
          if (document.getElementById("resp-additional-ppe"))
            document.getElementById("resp-additional-ppe").textContent =
              data.detalles.necesita_ppe_adicional || "-";
          if (document.getElementById("resp-surrounding-risk"))
            document.getElementById("resp-surrounding-risk").textContent =
              data.detalles.area_circundante_riesgo || "-";
          if (document.getElementById("resp-supervision-needed"))
            document.getElementById("resp-supervision-needed").textContent =
              data.detalles.necesita_supervision || "-";
          if (
            document.getElementById("pre-work-observations") &&
            document.getElementById("pre-work-observations").tagName === "P"
          )
            document.getElementById("pre-work-observations").textContent =
              data.detalles.observaciones_analisis_previo || "-";

          // Rellenar AST y Participantes
          mostrarAST(data.ast);
          mostrarActividadesAST(data.actividades_ast);
          mostrarParticipantesAST(data.participantes_ast);
        } else {
          alert(
            "No se encontraron datos para este permiso o el backend no responde con la estructura esperada."
          );
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (!idPermiso) return;
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.success && data.data) {
        const responsable = document.getElementById("nombre-responsable-area");
        const operador = document.getElementById("nombre-operador-area");
        if (responsable)
          responsable.textContent = data.data.responsable_area || "-";
        if (operador) operador.textContent = data.data.operador_area || "-";
      }
    })
    .catch((err) => {
      console.error("Error al obtener responsables de área:", err);
    });
});

function setupModalComentario() {
  const modal = document.getElementById("modalComentario");
  const btnCancelar = document.getElementById("btnCancelarComentario");
  const btnGuardar = document.getElementById("btnGuardarComentario");
  const textarea = document.getElementById("comentarioNoAutorizar");

  if (!modal || !btnCancelar || !btnGuardar || !textarea) {
    console.error("No se encontraron elementos del modal de comentarios");
    return;
  }

  // Limpiar event listeners previos
  btnCancelar.replaceWith(btnCancelar.cloneNode(true));
  btnGuardar.replaceWith(btnGuardar.cloneNode(true));

  // Obtener los nuevos elementos después del clon
  const newBtnCancelar = document.getElementById("btnCancelarComentario");
  const newBtnGuardar = document.getElementById("btnGuardarComentario");

  // Event listener para Cancelar
  newBtnCancelar.addEventListener("click", function () {
    modal.style.display = "none";
    textarea.value = "";
  });

  // Event listener para Guardar
  newBtnGuardar.addEventListener("click", async function () {
    const comentario = textarea.value.trim();
    if (!comentario) {
      alert("Debes escribir un motivo de rechazo.");
      return;
    }

    try {
      // Generar timestamp automático para rechazo supervisor PT1 (hora local)
      const nowRechazoSupervisor = new Date();
      const fechaHoraRechazoSupervisor = new Date(
        nowRechazoSupervisor.getTime() -
          nowRechazoSupervisor.getTimezoneOffset() * 60000
      ).toISOString();
      console.log(
        "[NO AUTORIZAR SUPERVISOR PT1] Timestamp generado (hora local):",
        fechaHoraRechazoSupervisor
      );

      await fetch("/api/autorizaciones/supervisor-categoria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          supervisor,
          categoria,
          comentario_no_autorizar: comentario,
          fecha_hora_supervisor: fechaHoraRechazoSupervisor,
        }),
      });
    } catch (err) {
      console.error("Error al actualizar supervisor y categoría:", err);
    }
    // 2. Consultar el id_estatus desde permisos_trabajo
    let idEstatus = null;
    try {
      const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
      if (respEstatus.ok) {
        const permisoData = await respEstatus.json();
        idEstatus =
          permisoData.id_estatus ||
          (permisoData.data && permisoData.data.id_estatus);
      }
    } catch (err) {
      console.error("Error al consultar id_estatus:", err);
    }
    // 3. Actualizar el estatus a "no autorizado" y guardar el comentario en la tabla estatus
    if (idEstatus) {
      try {
        await fetch("/api/estatus/no_autorizado", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus }),
        });
        // Guardar el comentario en la tabla estatus
        await fetch("/api/estatus/comentario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus, comentario }),
        });
      } catch (err) {
        console.error("Error al actualizar estatus no autorizado:", err);
      }
    }
    // 4. Cerrar el modal y mostrar mensaje de éxito
    const modal = document.getElementById("modalComentario");
    if (modal) modal.style.display = "none";
    alert("Permiso no autorizado correctamente");
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  });
}
