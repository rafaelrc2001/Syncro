// --- Funciones de utilidad ---
function getRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (let r of radios) {
    if (r.checked) return r.value;
  }
  return "";
}

function getInputValue(name) {
  return document.querySelector(`[name="${name}"]`)?.value || "";
}

// Nueva función para manejar checkboxes de SI/NO/NA
function getCheckboxValue(baseName) {
  if (document.querySelector(`[name="${baseName}_si"]`)?.checked) return "SI";
  if (document.querySelector(`[name="${baseName}_no"]`)?.checked) return "NO";
  if (document.querySelector(`[name="${baseName}_na"]`)?.checked) return "N/A";
  return "";
}

// --- AST, Actividades, Participantes, Supervisores y Categorías ---
function mostrarAST(ast) {
  const eppList = document.getElementById("modal-epp-list");
  if (eppList) {
    eppList.innerHTML = "";
    if (ast && ast.epp_requerido) {
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
    if (ast && ast.maquinaria_herramientas) {
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
    if (ast && ast.material_accesorios) {
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

function rellenarSupervisoresYCategorias() {
  fetch("/api/supervisores")
    .then((resp) => resp.json())
    .then((data) => {
      const selectSupervisor = document.getElementById("responsable-aprobador");
      if (selectSupervisor) {
        selectSupervisor.innerHTML =
          '<option value="" disabled selected>Seleccione un supervisor...</option>';
        (Array.isArray(data) ? data : data.supervisores).forEach((sup) => {
          const option = document.createElement("option");
          option.value = sup.nombre || sup.id;
          option.textContent = sup.nombre;
          selectSupervisor.appendChild(option);
        });
      }
    });

  fetch("/api/categorias")
    .then((resp) => resp.json())
    .then((data) => {
      const selectCategoria = document.getElementById("responsable-aprobador2");
      if (selectCategoria) {
        selectCategoria.innerHTML =
          '<option value="" disabled selected>Seleccione una categoria...</option>';
        (Array.isArray(data) ? data : data.categorias).forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.nombre || cat.id;
          option.textContent = cat.nombre;
          selectCategoria.appendChild(option);
        });
      }
    });
}
// Utilidad para asignar texto en un elemento por id
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "-";
}

// Lógica para mostrar los datos en las etiquetas (igual que sección área)
function mostrarDatosSupervisor(permiso) {
  // Mapeo de campos generales igual que en área
  const data = permiso.general ? permiso.general : permiso;

  setText("start-time-label", data.hora_inicio || "-");
  setText("fecha-label", data.fecha || data.fecha_creacion || "-");
  // Preferir tipo_permiso (canónico) antes que tipo_mantenimiento
  setText(
    "activity-type-label",
    data.tipo_permiso || data.tipo_mantenimiento || "-"
  );
  // Rellenar tanto plant-label como departamento-label usando prioridad departamento -> planta -> area
  const deptOrPlant = data.departamento || data.planta || data.area || "-";
  setText("plant-label", deptOrPlant);
  setText("departamento-label", deptOrPlant);
  setText("descripcion-trabajo-label", data.descripcion_trabajo || "-");
  setText("fecha_hora_supervisor-label", new Date().toISOString() || "-");
  setText("empresa-label", data.empresa || "-");
  setText(
    "nombre-solicitante-label",
    data.solicitante || data.nombre_solicitante || "-"
  );
  setText(
    "sucursal-label",
    data.sucursal && data.sucursal.trim() !== "" ? data.sucursal : "-"
  );
  setText(
    "contrato-label",
    data.contrato && data.contrato.trim() !== "" ? data.contrato : "-"
  );
  setText("work-order-label", data.ot_numero || "-");
  setText(
    "equipment-label",
    data.equipo_intervencion && data.equipo_intervencion.trim() !== ""
      ? data.equipo_intervencion
      : "-"
  );
  setText("tag-label", data.tag && data.tag.trim() !== "" ? data.tag : "-");

  setText("requiere-escalera-label", permiso.requiere_escalera || "-");
  setText("tipo-escalera-label", permiso.tipo_escalera || "-");
  setText("requiere-canastilla-label", permiso.requiere_canastilla_grua || "-");
  setText("aseguramiento-estrobo-label", permiso.aseguramiento_estrobo || "-");
  setText(
    "requiere-andamio-label",
    permiso.requiere_andamio_cama_completa || "-"
  );
  setText("requiere-otro-acceso-label", permiso.otro_tipo_acceso || "-");
  setText("cual-acceso-label", permiso.cual_acceso || "-");
  setText(
    "acceso-libre-obstaculos-label",
    permiso.acceso_libre_obstaculos || "-"
  );
  setText("canastilla-asegurada-label", permiso.canastilla_asegurada || "-");
  setText("andamio-completo-label", permiso.andamio_completo || "-");
  setText(
    "andamio-seguros-zapatas-label",
    permiso.andamio_seguros_zapatas || "-"
  );
  setText("escaleras-buen-estado-label", permiso.escaleras_buen_estado || "-");
  setText("linea-vida-segura-label", permiso.linea_vida_segura || "-");
  setText(
    "arnes-completo-buen-estado-label",
    permiso.arnes_completo_buen_estado || "-"
  );
  setText(
    "suspender-trabajos-adyacentes-label",
    permiso.suspender_trabajos_adyacentes || "-"
  );
  setText(
    "numero-personas-autorizadas-label",
    permiso.numero_personas_autorizadas || "-"
  );
  setText(
    "trabajadores-aptos-evaluacion-label",
    permiso.trabajadores_aptos_evaluacion || "-"
  );
  setText("requiere-barreras-label", permiso.requiere_barreras || "-");
  setText("observaciones-label", permiso.observaciones || "-");

  // Mapeo del área.

  setText("fluid", data.fluido || "-");
  setText("pressure", data.presion || "-");
  setText("temperature", data.temperatura || "-");
  // Mapeo eliminado. Puedes pegar aquí el mapeo correcto desde el área.
}

// Al cargar la página, obtener el id y mostrar los datos

document.addEventListener("DOMContentLoaded", function () {
  // Asignar listeners del modal de comentarios una sola vez
  const btnGuardarComentario = document.getElementById("btnGuardarComentario");
  if (btnGuardarComentario) {
    btnGuardarComentario.addEventListener("click", async function () {
      const comentario = document
        .getElementById("comentarioNoAutorizar")
        .value.trim();
      if (!comentario) {
        alert("Debes escribir un motivo de rechazo.");
        return;
      }
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
        // Generar timestamp automático para rechazo supervisor PT4 (hora local)
        const nowRechazoSupervisor = new Date();
        const year = nowRechazoSupervisor.getFullYear();
        const month = String(nowRechazoSupervisor.getMonth() + 1).padStart(
          2,
          "0"
        );
        const day = String(nowRechazoSupervisor.getDate()).padStart(2, "0");
        const hours = String(nowRechazoSupervisor.getHours()).padStart(2, "0");
        const minutes = String(nowRechazoSupervisor.getMinutes()).padStart(
          2,
          "0"
        );
        const seconds = String(nowRechazoSupervisor.getSeconds()).padStart(
          2,
          "0"
        );
        const milliseconds = String(
          nowRechazoSupervisor.getMilliseconds()
        ).padStart(3, "0");
        const fechaHoraRechazoSupervisor = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
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
        // Consultar el id_estatus desde permisos_trabajo
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
        // Actualizar el estatus a "no autorizado" y guardar el comentario
        if (idEstatus) {
          await fetch("/api/estatus/no_autorizado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
          await fetch("/api/estatus/comentario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus, comentario }),
          });
        }
        // Cerrar el modal y mostrar mensaje de éxito
        document.getElementById("modalComentario").style.display = "none";
        alert("Permiso no autorizado correctamente");
        window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
      } catch (err) {
        console.error("Error al procesar el rechazo:", err);
        alert("Error al procesar el rechazo. Intenta nuevamente.");
      }
    });
  }
  const btnCancelarComentario = document.getElementById(
    "btnCancelarComentario"
  );
  if (btnCancelarComentario) {
    btnCancelarComentario.addEventListener("click", function () {
      document.getElementById("modalComentario").style.display = "none";
      document.getElementById("comentarioNoAutorizar").value = "";
    });
  }
  // Mostrar/ocultar los campos '¿Cuál?' según el checkbox SI
  function toggleCualInput(checkboxName, inputName) {
    const siCheckbox = document.querySelector(`[name='${checkboxName}_si']`);
    const noCheckbox = document.querySelector(`[name='${checkboxName}_no']`);
    const naCheckbox = document.querySelector(`[name='${checkboxName}_na']`);
    const input = document.querySelector(`[name='${inputName}_cual']`);
    if (siCheckbox && noCheckbox && naCheckbox && input) {
      function updateVisibility() {
        input.style.display = siCheckbox.checked ? "" : "none";
      }
      siCheckbox.addEventListener("change", updateVisibility);
      noCheckbox.addEventListener("change", updateVisibility);
      naCheckbox.addEventListener("change", updateVisibility);
      // Inicializar visibilidad al cargar
      updateVisibility();
    }
  }
  toggleCualInput("proteccion_especial", "proteccion_especial");
  toggleCualInput("equipo_caidas", "equipo_caidas");
  // Lógica para el botón "Salir" igual que PT3
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    });
  }
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    fetch(`/api/autorizaciones/personas/${idPermiso}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data) {
          const responsable = document.getElementById(
            "nombre-responsable-area"
          );
          const operador = document.getElementById("nombre-operador-area");
          if (responsable)
            responsable.textContent = data.data.responsable_area || "-";
          if (operador) operador.textContent = data.data.operador_area || "-";
        }
      })
      .catch((err) => {
        console.error("Error al obtener responsables de área:", err);
      });

    // Solo usar /api/verformularios
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Respuesta completa de /api/verformularios:", data);
        // Guardar copia canónica global para otras rutinas (PT3/PT4 usan este objeto)
        try {
          window.currentPermisoData = data;
        } catch (e) {
          /* ignore */
        }
        // Prefijo en el título
        if (data && data.general && document.getElementById("prefijo-label")) {
          document.getElementById("prefijo-label").textContent =
            data.general.prefijo || "-";
        }
        // Rellenar datos generales si existen
        if (data && data.general) {
          console.log("Datos generales:", data.general);
          mostrarDatosSupervisor(data.general);
        }
        // Rellenar AST y Participantes
        if (data && data.ast) {
          mostrarAST(data.ast);
        } else {
          mostrarAST({});
        }
        if (data.actividades_ast) {
          mostrarActividadesAST(data.actividades_ast);
        } else {
          mostrarActividadesAST([]);
        }
        if (data.participantes_ast) {
          mostrarParticipantesAST(data.participantes_ast);
        } else {
          mostrarParticipantesAST([]);
        }
      });
  }
  rellenarSupervisoresYCategorias();
  const btnNoAutorizar = document.getElementById("btn-no-autorizar");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", function () {
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

      // Resolver valores canónicos para mostrar en el modal (misma prioridad que PT3)
      const prefijo =
        (window.currentPermisoData &&
          window.currentPermisoData.general &&
          window.currentPermisoData.general.prefijo) ||
        (window.currentPermisoData &&
          window.currentPermisoData.data &&
          window.currentPermisoData.data.prefijo) ||
        document.getElementById("prefijo-label")?.textContent ||
        idPermiso ||
        "-";
      const tipo =
        (window.currentPermisoData &&
          window.currentPermisoData.data &&
          (window.currentPermisoData.data.tipo_permiso ||
            window.currentPermisoData.data.tipo_mantenimiento)) ||
        (window.currentPermisoData &&
          window.currentPermisoData.general &&
          (window.currentPermisoData.general.tipo_permiso ||
            window.currentPermisoData.general.tipo_mantenimiento)) ||
        document.getElementById("activity-type-label")?.textContent ||
        "-";
      const solicitante =
        (window.currentPermisoData &&
          window.currentPermisoData.data &&
          (window.currentPermisoData.data.nombre_solicitante ||
            window.currentPermisoData.data.solicitante)) ||
        (window.currentPermisoData &&
          window.currentPermisoData.general &&
          (window.currentPermisoData.general.solicitante ||
            window.currentPermisoData.general.nombre_solicitante)) ||
        document.getElementById("nombre-solicitante-label")?.textContent ||
        "-";
      const departamento =
        (window.currentPermisoData &&
          window.currentPermisoData.data &&
          (window.currentPermisoData.data.departamento ||
            window.currentPermisoData.data.planta)) ||
        (window.currentPermisoData &&
          window.currentPermisoData.general &&
          (window.currentPermisoData.general.departamento ||
            window.currentPermisoData.general.area)) ||
        document.getElementById("departamento-label")?.textContent ||
        document.getElementById("plant-label")?.textContent ||
        document.getElementById("sucursal-label")?.textContent ||
        "-";

      // Crear modal de confirmación si no existe
      let modal = document.getElementById("modalConfirmarNoAutorizar");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "modalConfirmarNoAutorizar";
        modal.style =
          "position:fixed;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);z-index:9999;";
        modal.innerHTML = `
          <div style="background:#fff;padding:18px;border-radius:6px;min-width:320px;max-width:480px;">
            <h3 style="margin-top:0">Confirmar rechazo</h3>
            <p>¿Estás seguro que deseas no autorizar este permiso?</p>
            <p><strong>ID:</strong> <span id="modal-no-permit-id">-</span></p>
            <p><strong>Tipo:</strong> <span id="modal-no-permit-type">-</span></p>
            <p><strong>Solicitante:</strong> <span id="modal-no-permit-solicitante">-</span></p>
            <p><strong>Departamento:</strong> <span id="modal-no-permit-departamento">-</span></p>
            <div style="text-align:right;margin-top:12px;">
              <button id="btnCancelarConfirmarNo" style="margin-right:8px;">Cancelar</button>
              <button id="btnConfirmarNoAutorizar">Continuar</button>
            </div>
          </div>`;
        document.body.appendChild(modal);
      }

      // Rellenar campos del modal
      try {
        const setModalField = (names, value) => {
          for (const name of names) {
            // preferir búsqueda dentro del modal (si fue creado dinámicamente) y luego global
            const el =
              (modal && modal.querySelector(`#${name}`)) ||
              document.getElementById(name);
            if (el) {
              el.textContent = value;
              return true;
            }
          }
          return false;
        };
        // IMPORTANT: preferir los ids "-no" específicos antes de los ids genéricos
        setModalField(
          ["modal-permit-id-no", "modal-no-permit-id", "modal-permit-id"],
          prefijo || "-"
        );
        setModalField(
          ["modal-permit-type-no", "modal-no-permit-type", "modal-permit-type"],
          tipo || "-"
        );
        setModalField(
          [
            "modal-solicitante-no",
            "modal-no-permit-solicitante",
            "modal-permit-solicitante",
            "modal-solicitante",
          ],
          solicitante || "-"
        );
        setModalField(
          [
            "modal-departamento-no",
            "modal-no-permit-departamento",
            "modal-permit-departamento",
            "modal-departamento",
          ],
          departamento || "-"
        );
      } catch (e) {
        /* ignore */
      }

      modal.style.display = "flex";
      const btnCancel = document.getElementById("btnCancelarConfirmarNo");
      const btnContinue = document.getElementById("btnConfirmarNoAutorizar");
      if (btnCancel)
        btnCancel.onclick = function () {
          const m = document.getElementById("modalConfirmarNoAutorizar");
          if (m) m.style.display = "none";
        };
      if (btnContinue)
        btnContinue.onclick = function () {
          // Cerrar modal de confirmación y abrir modalComentario para capturar motivo
          const m = document.getElementById("modalConfirmarNoAutorizar");
          if (m) m.style.display = "none";
          const modalComentario = document.getElementById("modalComentario");
          if (modalComentario) {
            modalComentario.style.display = "flex";
            const texto = document.getElementById("comentarioNoAutorizar");
            if (texto) texto.value = "";
          }
        };
    });
  }
});

// --- Lógica para el botón "Autorizar" ---
const btnAutorizar = document.getElementById("btn-guardar-campos");
if (btnAutorizar) {
  // Extraer la lógica de autorización a una función para llamarla desde el modal
  async function ejecutarAutorizacionSupervisorPT4() {
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
      alert("Debes seleccionar el supervisor.");
      return;
    }

    // 1. Actualizar supervisor y categoría en autorizaciones
    try {
      const nowSupervisor = new Date();
      const year = nowSupervisor.getFullYear();
      const month = String(nowSupervisor.getMonth() + 1).padStart(2, "0");
      const day = String(nowSupervisor.getDate()).padStart(2, "0");
      const hours = String(nowSupervisor.getHours()).padStart(2, "0");
      const minutes = String(nowSupervisor.getMinutes()).padStart(2, "0");
      const seconds = String(nowSupervisor.getSeconds()).padStart(2, "0");
      const milliseconds = String(nowSupervisor.getMilliseconds()).padStart(
        3,
        "0"
      );
      const fechaHoraAutorizacionSupervisor = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
      console.log(
        "[AUTORIZAR SUPERVISOR PT4] Timestamp generado (hora local):",
        fechaHoraAutorizacionSupervisor
      );

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

    // 1.5 Actualizar requisitos de riesgos y pruebas específicos para altura
    const payloadSupervisor = {
      proteccion_especial: getCheckboxValue("proteccion_especial"),
      proteccion_especial_cual: getInputValue("proteccion_especial_cual"),
      equipo_caidas: getCheckboxValue("equipo_caidas"),
      equipo_caidas_cual: getInputValue("equipo_caidas_cual"),
      linea_amortiguador: getCheckboxValue("linea_amortiguador"),
      punto_fijo: getCheckboxValue("punto_fijo"),
      linea_vida: getCheckboxValue("linea_vida"),
      andamio_completo_opcion: getCheckboxValue("andamio_completo"),
      tarjeta_andamio: getCheckboxValue("tarjeta_andamio"),
      viento_permitido: getCheckboxValue("viento_permitido"),
      escalera_condicion: getCheckboxValue("escalera_condicion"),
    };

    try {
      console.log(
        "Payload enviado a /altura/requisitos_supervisor:",
        payloadSupervisor
      );
      await fetch(`/api/altura/requisitos_supervisor/${idPermiso}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadSupervisor),
      });
    } catch (err) {
      console.error(
        "Error al actualizar requisitos supervisor y pruebas:",
        err
      );
    }

    // 2. Consultar id_estatus
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

    // 3. Actualizar estatus a "activo"
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

    // --- Mostrar modal de confirmación final ---
    const confirmationModal = document.getElementById("confirmation-modal");
    if (confirmationModal) confirmationModal.style.display = "flex";
    const permitNumber = document.getElementById("generated-permit");
    if (permitNumber) {
      // Preferir el prefijo canonical (window.currentPermisoData) antes que la etiqueta DOM
      const prefijoForModal =
        (window.currentPermisoData &&
          window.currentPermisoData.general &&
          window.currentPermisoData.general.prefijo) ||
        (window.currentPermisoData &&
          window.currentPermisoData.data &&
          window.currentPermisoData.data.prefijo) ||
        document.getElementById("prefijo-label")?.textContent ||
        idPermiso ||
        "-";
      permitNumber.textContent = prefijoForModal || idPermiso || "-";
    }
  }

  // Nuevo comportamiento: mostrar modal de confirmación antes de ejecutar la autorización
  btnAutorizar.addEventListener("click", function (e) {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get("id") || window.idPermisoActual || "-";
    const responsableInput = document.getElementById("responsable-aprobador");
    const supervisor = responsableInput ? responsableInput.value.trim() : "";
    if (!supervisor) {
      alert("Debes seleccionar el supervisor.");
      return;
    }

    // Resolver valores canonizados (misma prioridad que PT3)
    const paramsModal = new URLSearchParams(window.location.search);
    const idPermisoModal =
      paramsModal.get("id") || window.idPermisoActual || idPermiso || "-";
    const prefijo =
      (window.currentPermisoData &&
        window.currentPermisoData.general &&
        window.currentPermisoData.general.prefijo) ||
      (window.currentPermisoData &&
        window.currentPermisoData.data &&
        window.currentPermisoData.data.prefijo) ||
      document.getElementById("prefijo-label")?.textContent ||
      idPermisoModal ||
      idPermiso ||
      "-";
    const tipo =
      (window.currentPermisoData &&
        window.currentPermisoData.data &&
        (window.currentPermisoData.data.tipo_permiso ||
          window.currentPermisoData.data.tipo_mantenimiento)) ||
      (window.currentPermisoData &&
        window.currentPermisoData.general &&
        (window.currentPermisoData.general.tipo_permiso ||
          window.currentPermisoData.general.tipo_mantenimiento)) ||
      document.getElementById("activity-type-label")?.textContent ||
      "-";
    const solicitante =
      (window.currentPermisoData &&
        window.currentPermisoData.data &&
        (window.currentPermisoData.data.nombre_solicitante ||
          window.currentPermisoData.data.solicitante)) ||
      (window.currentPermisoData &&
        window.currentPermisoData.general &&
        (window.currentPermisoData.general.solicitante ||
          window.currentPermisoData.general.nombre_solicitante)) ||
      document.getElementById("nombre-solicitante-label")?.textContent ||
      "-";
    const departamento =
      (window.currentPermisoData &&
        window.currentPermisoData.data &&
        (window.currentPermisoData.data.departamento ||
          window.currentPermisoData.data.planta)) ||
      (window.currentPermisoData &&
        window.currentPermisoData.general &&
        (window.currentPermisoData.general.departamento ||
          window.currentPermisoData.general.area)) ||
      document.getElementById("departamento-label")?.textContent ||
      document.getElementById("plant-label")?.textContent ||
      document.getElementById("sucursal-label")?.textContent ||
      "-";

    // Crear modal si no existe
    let modal = document.getElementById("modalConfirmarAutorizar");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modalConfirmarAutorizar";
      modal.style =
        "position:fixed;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);z-index:9999;";
      modal.innerHTML = `
        <div style="background:#fff;padding:18px;border-radius:6px;min-width:320px;max-width:480px;">
          <h3 style="margin-top:0">Confirmar autorización</h3>
          <p>¿Estás seguro que deseas autorizar este permiso?</p>
          <p><strong>ID:</strong> <span id="modal-permit-id">-</span></p>
          <p><strong>Tipo:</strong> <span id="modal-permit-type">-</span></p>
          <p><strong>Solicitante:</strong> <span id="modal-permit-solicitante">-</span></p>
          <p><strong>Departamento:</strong> <span id="modal-permit-departamento">-</span></p>
          <div style="text-align:right;margin-top:12px;">
            <button id="btnCancelarConfirmar" style="margin-right:8px;">Cancelar</button>
            <button id="btnConfirmarAutorizar">Continuar</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }

    // Rellenar campos del modal (compatible con ids usados en la plantilla)
    try {
      const setModalField = (names, value) => {
        for (const name of names) {
          // preferir búsqueda dentro del modal (si fue creado dinámicamente) y luego global
          const el =
            (modal && modal.querySelector(`#${name}`)) ||
            document.getElementById(name);
          if (el) {
            el.textContent = value;
            return true;
          }
        }
        return false;
      };

      setModalField(["modal-permit-id", "modal-permit-id"], prefijo || "-");
      setModalField(["modal-permit-type", "modal-permit-type"], tipo || "-");
      // Algunos templates usan 'modal-solicitante' y 'modal-departamento' en vez de 'modal-permit-*'
      setModalField(
        ["modal-permit-solicitante", "modal-solicitante"],
        solicitante || "-"
      );
      setModalField(
        ["modal-permit-departamento", "modal-departamento"],
        departamento || "-"
      );
    } catch (e) {
      /* ignore */
    }

    modal.style.display = "flex";
    const btnCancel = document.getElementById("btnCancelarConfirmar");
    const btnConfirm = document.getElementById("btnConfirmarAutorizar");
    if (btnCancel)
      btnCancel.onclick = function () {
        const m = document.getElementById("modalConfirmarAutorizar");
        if (m) m.style.display = "none";
      };
    if (btnConfirm)
      btnConfirm.onclick = async function () {
        btnConfirm.disabled = true;
        await ejecutarAutorizacionSupervisorPT4();
        btnConfirm.disabled = false;
        const m = document.getElementById("modalConfirmarAutorizar");
        if (m) m.style.display = "none";
      };
  });
}

// Cierre del modal y redirección
const modalCloseBtn = document.getElementById("modal-close-btn");
if (modalCloseBtn) {
  modalCloseBtn.onclick = function () {
    const confirmationModal = document.getElementById("confirmation-modal");
    if (confirmationModal) confirmationModal.style.display = "none";
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  };
}

// Manejo de checkboxes SI/NO/NA
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const name = this.name.replace(/_(si|no|na)$/, "");
    if (this.checked) {
      ["si", "no", "na"].forEach((opcion) => {
        if (this.name !== `${name}_${opcion}`) {
          const otro = document.querySelector(`[name='${name}_${opcion}']`);
          if (otro) otro.checked = false;
        }
      });
    }
  });
});
