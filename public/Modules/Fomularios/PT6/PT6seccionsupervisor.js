// --- Lógica fusionada para guardar campos y autorizar ---
const btnGuardarCampos = document.getElementById("btn-guardar-campos");
async function ejecutarGuardarYAutorizarPT6() {
  // 1. Obtener datos necesarios
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id") || window.idPermisoActual;
  const responsableInput = document.getElementById("responsable-aprobador");
  const operadorInput = document.getElementById("responsable-aprobador2");
  const responsable_area = responsableInput
    ? responsableInput.value.trim()
    : "";
  const operador_area = operadorInput ? operadorInput.value.trim() : "";

  // 2. Validaciones básicas
  if (!idPermiso) {
    alert("No se pudo obtener el ID del permiso.");
    return;
  }
  if (!responsable_area) {
    alert("Debes ingresar el nombre del responsable.");
    return;
  }

  // 3. Guardar los campos/requisitos primero
  // Utilidad para leer radios
  function getRadio(name) {
    const checked = document.querySelector(`input[name='${name}']:checked`);
    return checked ? checked.value : null;
  }
  // Utilidad para leer checkboxes (devuelve "SI" o "NO")
  function getCheckbox(name) {
    const checkbox = document.querySelector(`input[name='${name}']`);
    return checkbox && checkbox.checked ? "SI" : "NO";
  }
  // Utilidad para leer input text
  function getInputValue(id) {
    const input = document.getElementById(id);
    return input ? input.value : null;
  }
  // Construir payload con los nombres correctos del backend
  const payload = {
    identifico_equipo: getRadio("identifico_equipo"),
    verifico_identifico_equipo: getCheckbox("verifico_identifico_equipo"),
    fuera_operacion_desenergizado: getRadio("fuera_operacion_desenergizado"),
    verifico_fuera_operacion_desenergizado: getCheckbox(
      "verifico_fuera_operacion_desenergizado"
    ),
    candado_etiqueta: getRadio("candado_etiqueta"),
    verifico_candado_etiqueta: getCheckbox("verifico_candado_etiqueta"),
    suspender_adyacentes: getRadio("suspender_adyacentes"),
    verifico_suspender_adyacentes: getCheckbox("verifico_suspender_adyacentes"),
    area_limpia_libre_obstaculos: getRadio("area_limpia_libre_obstaculos"),
    verifico_area_limpia_libre_obstaculos: getCheckbox(
      "verifico_area_limpia_libre_obstaculos"
    ),
    libranza_electrica: getRadio("libranza_electrica"),
    verifico_libranza_electrica: getCheckbox("verifico_libranza_electrica"),
    nivel_tension: getInputValue("nivel_tension"),
  };
  // Guardar medidas/requisitos del supervisor (nuevo formulario)
  const formMedidas = document.getElementById("form-medidas-riesgos");
  let payloadMedidas = {};
  if (formMedidas) {
    payloadMedidas = {
      equipo_proteccion_especial_supervisor: getRadio(
        "equipo_proteccion_especial"
      ),
      cual_equipo_proteccion:
        formMedidas.elements["cual_equipo_proteccion"]?.value || "",
      observaciones_medidas:
        formMedidas.elements["observaciones_medidas"]?.value || "",
    };
  }
  try {
    // Guardar requisitos generales
    console.log(
      "[DEPURACIÓN] Enviando requisitos_area payload (supervisor):",
      payload
    );
    const resp = await fetch(`/api/pt-electrico/requisitos_area/${idPermiso}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log(
      "[DEPURACIÓN] Respuesta requisitos_area (supervisor) status:",
      resp.status
    );
    if (!resp.ok) throw new Error("Error al guardar los requisitos");

    // Guardar medidas/requisitos del supervisor
    const respMedidas = await fetch(
      `/api/electrico/requisitos_supervisor/${idPermiso}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadMedidas),
      }
    );
    if (!respMedidas.ok)
      throw new Error("Error al guardar las medidas del supervisor");
  } catch (err) {
    alert("Error al guardar los campos/requisitos. No se puede autorizar.");
    console.error("Error al guardar requisitos:", err);
    return;
  }

  // 4. Autorizar (igual que PT1)
  try {
    // 1. Actualizar supervisor y categoría en autorizaciones (igual que PT3)
    // Generar timestamp automático para autorización supervisor PT6 (hora local)
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
      "[AUTORIZAR SUPERVISOR PT6] Timestamp generado (hora local):",
      fechaHoraAutorizacionSupervisor
    );

    await fetch("/api/autorizaciones/supervisor-categoria", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_permiso: idPermiso,
        supervisor: responsable_area,
        categoria: operador_area,
        fecha_hora_supervisor: fechaHoraAutorizacionSupervisor,
      }),
    });

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

    // 3. Actualizar estatus a "activo" (igual que PT3)
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

    // Mostrar modal de confirmación
    const confirmationModal = document.getElementById("confirmation-modal");
    if (confirmationModal) confirmationModal.style.display = "flex";
    const permitNumber = document.getElementById("generated-permit");
    if (permitNumber) {
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
    // Cerrar el modal y redirigir al listado de supervisores
    const modalCloseBtn = document.getElementById("modal-close-btn");
    if (modalCloseBtn) {
      modalCloseBtn.onclick = function () {
        const confirmationModal = document.getElementById("confirmation-modal");
        if (confirmationModal) confirmationModal.style.display = "none";
        window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
      };
    } else {
      // Fallback: redirect si el modal o el botón no existen
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    }
  } catch (err) {
    alert(
      "Error al autorizar el permiso. Revisa la consola para más detalles."
    );
    console.error("[DEPURACIÓN] Error al autorizar el permiso:", err);
  }
}

if (btnGuardarCampos) {
  btnGuardarCampos.addEventListener("click", function (e) {
    e.preventDefault();
    // Validar supervisor seleccionado
    const responsableInput = document.getElementById("responsable-aprobador");
    const supervisor = responsableInput ? responsableInput.value.trim() : "";
    if (!supervisor) {
      alert("Debes seleccionar el supervisor.");
      return;
    }

    // Resolver valores canonizados para el modal
    const paramsModal = new URLSearchParams(window.location.search);
    const idPermisoModal =
      paramsModal.get("id") || window.idPermisoActual || "-";
    // helper para recorrer posibles rutas de la respuesta canónica (igual que en PT6 seccion area)
    function getPermisoValue(candidatePaths) {
      const root = window.currentPermisoData || {};
      for (const path of candidatePaths) {
        const parts = path.split(".");
        let cur = root;
        for (const p of parts) {
          if (cur == null) {
            cur = undefined;
            break;
          }
          cur = cur[p];
        }
        if (cur != null && cur !== "" && cur !== "-") return cur;
      }
      return null;
    }

    const prefijo =
      getPermisoValue(["general.prefijo", "data.prefijo"]) ||
      document.getElementById("prefijo-label")?.textContent ||
      idPermisoModal ||
      "-";
    const tipo =
      getPermisoValue([
        "data.tipo_permiso",
        "general.tipo_permiso",
        "data.tipo_mantenimiento",
        "general.tipo_mantenimiento",
        "tipo_permiso",
        "tipo_mantenimiento",
      ]) ||
      document.getElementById("activity-type-label")?.textContent ||
      "-";
    const solicitante =
      getPermisoValue([
        "data.nombre_solicitante",
        "data.solicitante",
        "general.solicitante",
        "general.nombre_solicitante",
      ]) ||
      document.getElementById("nombre-solicitante-label")?.textContent ||
      "-";
    const departamento =
      getPermisoValue([
        "data.departamento",
        "data.planta",
        "general.departamento",
        "general.area",
        "data.area",
        "sucursal",
      ]) ||
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

    // Rellenar campos del modal
    try {
      const setModalField = (names, value) => {
        for (const name of names) {
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
        await ejecutarGuardarYAutorizarPT6();
        btnConfirm.disabled = false;
        const m = document.getElementById("modalConfirmarAutorizar");
        if (m) m.style.display = "none";
      };
  });
}

// --- Lógica para el botón "No Autorizar" (abrir modal de confirmación primero) ---
const btnNoAutorizar = document.getElementById("btn-no-autorizar");
if (btnNoAutorizar) {
  btnNoAutorizar.addEventListener("click", function () {
    const responsableInput = document.getElementById("responsable-aprobador");
    const responsable_area = responsableInput
      ? responsableInput.value.trim()
      : "";
    if (!responsable_area) {
      alert("Debes ingresar el nombre del responsable antes de rechazar.");
      return;
    }

    // Resolver valores canonizados (reusar helper si existe)
    function getPermisoValue(candidatePaths) {
      const root = window.currentPermisoData || {};
      for (const path of candidatePaths) {
        const parts = path.split(".");
        let cur = root;
        for (const p of parts) {
          if (cur == null) {
            cur = undefined;
            break;
          }
          cur = cur[p];
        }
        if (cur != null && cur !== "" && cur !== "-") return cur;
      }
      return null;
    }

    const paramsModal = new URLSearchParams(window.location.search);
    const idPermisoModal =
      paramsModal.get("id") || window.idPermisoActual || "-";
    const prefijo =
      getPermisoValue(["data.prefijo", "general.prefijo", "prefijo"]) ||
      document.getElementById("prefijo-label")?.textContent ||
      idPermisoModal ||
      "-";
    const tipo =
      getPermisoValue([
        "data.tipo_permiso",
        "general.tipo_permiso",
        "data.tipo_mantenimiento",
        "general.tipo_mantenimiento",
      ]) ||
      document.getElementById("activity-type-label")?.textContent ||
      "-";
    const solicitante =
      getPermisoValue([
        "data.nombre_solicitante",
        "data.solicitante",
        "general.solicitante",
      ]) ||
      document.getElementById("nombre-solicitante-label")?.textContent ||
      "-";
    const departamento =
      getPermisoValue([
        "data.departamento",
        "data.planta",
        "general.departamento",
        "general.area",
        "data.area",
      ]) ||
      document.getElementById("departamento-label")?.textContent ||
      document.getElementById("plant-label")?.textContent ||
      document.getElementById("sucursal-label")?.textContent ||
      "-";

    // Intentar usar modalConfirmarNoAutorizar si existe, si no crearlo dinámicamente
    let modalConfirmNo = document.getElementById("modalConfirmarNoAutorizar");
    if (!modalConfirmNo) {
      modalConfirmNo = document.createElement("div");
      modalConfirmNo.id = "modalConfirmarNoAutorizar";
      modalConfirmNo.style =
        "position:fixed;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);z-index:9999;";
      modalConfirmNo.innerHTML = `
        <div style="background:#fff;padding:18px;border-radius:6px;min-width:320px;max-width:480px;">
          <h3 style="margin-top:0">Confirmar NO autorización</h3>
          <p>¿Estás seguro que deseas NO autorizar este permiso?</p>
          <p><strong>ID:</strong> <span id="modal-permit-id-no">-</span></p>
          <p><strong>Tipo:</strong> <span id="modal-permit-type-no">-</span></p>
          <p><strong>Solicitante:</strong> <span id="modal-permit-solicitante-no">-</span></p>
          <p><strong>Departamento:</strong> <span id="modal-departamento-no">-</span></p>
          <div style="text-align:right;margin-top:12px;">
            <button id="btnCancelarConfirmarNo" style="margin-right:8px;">Cancelar</button>
            <button id="btnConfirmarNoAutorizar">Continuar</button>
          </div>
        </div>`;
      document.body.appendChild(modalConfirmNo);
    }

    // Rellenar campos preferiendo los ids '-no'
    try {
      const setModalField = (names, value) => {
        for (const name of names) {
          const el =
            (modalConfirmNo && modalConfirmNo.querySelector(`#${name}`)) ||
            document.getElementById(name);
          if (el) {
            el.textContent = value;
            return true;
          }
        }
        return false;
      };
      setModalField(
        ["modal-permit-id-no", "modal-permit-id-no"],
        prefijo || "-"
      );
      setModalField(
        ["modal-permit-type-no", "modal-permit-type-no"],
        tipo || "-"
      );
      // Priorizar ids específicos: primero el span del modal dinámico/estático y
      // luego cualquier id alterna que pudiera existir. El HTML del modal
      // contiene `modal-solicitante-no`, por eso lo incluimos aquí.
      setModalField(
        [
          "modal-permit-solicitante-no",
          "modal-solicitante-no",
          "modal-permit-solicitante-no",
        ],
        solicitante || "-"
      );
      setModalField(
        ["modal-departamento-no", "modal-departamento-no"],
        departamento || "-"
      );
    } catch (e) {
      /* ignore */
    }

    modalConfirmNo.style.display = "flex";

    // Cancelar
    const btnCancelarConfirmarNo = document.getElementById(
      "btnCancelarConfirmarNo"
    );
    if (btnCancelarConfirmarNo)
      btnCancelarConfirmarNo.onclick = function () {
        const m = document.getElementById("modalConfirmarNoAutorizar");
        if (m) m.style.display = "none";
      };

    // Continuar -> abrir modalComentario
    const btnConfirmarNoAutorizar = document.getElementById(
      "btnConfirmarNoAutorizar"
    );
    if (btnConfirmarNoAutorizar) {
      btnConfirmarNoAutorizar.onclick = function () {
        const m = document.getElementById("modalConfirmarNoAutorizar");
        if (m) m.style.display = "none";
        const modalComentario = document.getElementById("modalComentario");
        if (modalComentario) {
          modalComentario.style.display = "flex";
          const input = document.getElementById("comentarioNoAutorizar");
          if (input) input.value = "";
        }
      };
    }
  });

  // Lógica para cerrar/cancelar el modalComentario
  const btnCancelarComentario = document.getElementById(
    "btnCancelarComentario"
  );
  if (btnCancelarComentario) {
    btnCancelarComentario.addEventListener("click", function () {
      const modal = document.getElementById("modalComentario");
      if (modal) modal.style.display = "none";
    });
  }

  // Nota: el handler de guardar comentario ya existe más abajo y realizará el POST a /api/estatus/no_autorizado
}

// --- Plantilla para agregar personas en el área (ajusta el endpoint y campos según tu backend) ---
async function agregarPersonaEnArea(idPermiso, persona) {
  // persona = { nombre, funcion, credencial, cargo }
  try {
    await fetch(`/api/pt2/personas_area/${idPermiso}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(persona),
    });
    // Puedes actualizar la UI aquí si lo necesitas
  } catch (err) {
    console.error("Error al agregar persona en área:", err);
  }
}
// Botón regresar funcional
const btnRegresar = document.getElementById("btn-regresar");
if (btnRegresar) {
  btnRegresar.addEventListener("click", function () {
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  });
}

// Obtener el id_permiso de la URL (ejemplo: ?id=123)
const params = new URLSearchParams(window.location.search);
const idPermiso = params.get("id");
if (idPermiso) {
  console.log("Consultando permiso de electrico con id:", idPermiso);
  // Obtener los nombres de responsables (responsable de área / operador) — mismo comportamiento que PT5
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((res) => res.json())
    .then((data) => {
      // Guardar la respuesta canónica para uso en modales y mapeos
      try {
        window.currentPermisoData = data;
      } catch (e) {
        console.warn("No se pudo asignar window.currentPermisoData", e);
      }
      if (data && data.success && data.data) {
        const supervisorStamp = document.getElementById("stamp-aprobador");
        if (supervisorStamp)
          supervisorStamp.textContent = data.data.responsable_area || "-";
        const encargadoStamp = document.getElementById("stamp-encargado");
        if (encargadoStamp)
          encargadoStamp.textContent = data.data.operador_area || "-";
      }
    })
    .catch((err) => {
      console.error("Error al obtener responsables de área:", err);
    });
  fetch(`/api/pt-electrico/${idPermiso}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Respuesta de la API:", data);
      // Mapear datos generales correctamente
      if (data && data.success && data.data) {
        const permiso = data.data;
        // Guardar/mergear datos en window.currentPermisoData para que los modales
        // puedan leer solicitante/prefijo incluso si /api/verformularios tarda.
        try {
          window.currentPermisoData = window.currentPermisoData || {};
          // asignar 'data'
          window.currentPermisoData.data = permiso;
          // asegurar que 'general' existe y copiar algunos campos útiles
          window.currentPermisoData.general =
            window.currentPermisoData.general || {};
          if (!window.currentPermisoData.general.prefijo && permiso.prefijo) {
            window.currentPermisoData.general.prefijo = permiso.prefijo;
          }
          if (!window.currentPermisoData.general.solicitante) {
            window.currentPermisoData.general.solicitante =
              permiso.solicitante ||
              permiso.nombre_solicitante ||
              window.currentPermisoData.general.solicitante;
          }
          if (!window.currentPermisoData.general.area && permiso.area) {
            window.currentPermisoData.general.area = permiso.area;
          }
        } catch (e) {
          console.warn(
            "No se pudo mergear permiso en window.currentPermisoData",
            e
          );
        }
        console.log("Valores del permiso recibidos:", permiso);

        // Datos generales
        setText("maintenance-type-label", permiso.tipo_mantenimiento || "-");
        setText("work-order-label", permiso.ot_numero || "-");
        setText("tag-label", permiso.tag || "-");
        setText("start-time-label", permiso.hora_inicio || "-");
        setText(
          "descripcion-trabajo-label",
          permiso.descripcion_trabajo || "-"
        );
        setText(
          "equipment-description-label",
          permiso.equipo_intervenir || "-"
        );

        // Campos generales adicionales (prefijo, empresa, solicitante, etc.)
        setText("prefijo-label", permiso.prefijo || "-");
        setText("empresa-label", permiso.empresa || "-");
        setText(
          "nombre-solicitante-label",
          permiso.solicitante || permiso.nombre_solicitante || "-"
        );
        setText("sucursal-label", permiso.sucursal || "-");
        setText("contrato-label", permiso.contrato || "-");
        setText("plant-label", permiso.area || "-");

        // Mapear campos de "Medidas para administrar los riesgos"
        setText("equipo_desenergizado", permiso.equipo_desenergizado || "-");
        setText(
          "interruptores_abiertos",
          permiso.interruptores_abiertos || "-"
        );
        setText("ausencia_voltaje", permiso.verificar_ausencia_voltaje || "-");
        setText("candados_intervencion", permiso.candados_equipo || "-");
        setText("tarjetas_alerta_notificacion", permiso.tarjetas_alerta || "-");
        setText("aviso_personal_area", permiso.aviso_personal_area || "-");
        setText("tapetes_dielelectricos", permiso.tapetes_dielectricos || "-");
        setText("herramienta_aislante", permiso.herramienta_aislante || "-");
        setText("pertiga_telescopica", permiso.pertiga_telescopica || "-");
        setText(
          "equipo_proteccion_especial",
          permiso.equipo_proteccion_especial || "-"
        );
        setText(
          "cual_equipo_proteccion",
          permiso.tipo_equipo_proteccion || "-"
        );
        setText("aterrizar_equipo_circuito", permiso.aterrizar_equipo || "-");
        setText("instalar_barricadas_area", permiso.barricadas_area || "-");
        setText(
          "observaciones_medidas",
          permiso.observaciones_adicionales || "-"
        );

        // Otros campos específicos del formulario eléctrico
        setText(
          "special-tools-label",
          permiso.requiere_herramientas_especiales || "-"
        );
        setText(
          "special-tools-type-label",
          permiso.tipo_herramientas_especiales || "-"
        );
        setText("adequate-tools-label", permiso.herramientas_adecuadas || "-");
        setText(
          "pre-verification-label",
          permiso.requiere_verificacion_previa || "-"
        );
        setText(
          "risk-knowledge-label",
          permiso.requiere_conocer_riesgos || "-"
        );
        setText(
          "final-observations-label",
          permiso.observaciones_medidas || "-"
        );

        // ANÁLISIS DE REQUISITOS PARA EFECTUAR EL TRABAJO (nuevo formato)
        function respuestaTexto(valor) {
          if (valor === "SI") return "si";
          if (valor === "NO") return "no";
          if (valor === "NA") return "n/a";
          return "";
        }
        setText(
          "identifico_equipo_respuesta",
          respuestaTexto(permiso.identifico_equipo)
        );
        setText(
          "verifico_identifico_equipo",
          permiso.verifico_identifico_equipo === "SI" ? "si" : "no"
        );

        setText(
          "fuera_operacion_desenergizado_respuesta",
          respuestaTexto(permiso.fuera_operacion_desenergizado)
        );
        setText(
          "verifico_fuera_operacion_desenergizado",
          permiso.verifico_fuera_operacion_desenergizado === "SI" ? "si" : "no"
        );

        setText(
          "candado_etiqueta_respuesta",
          respuestaTexto(permiso.candado_etiqueta)
        );
        setText(
          "verifico_candado_etiqueta",
          permiso.verifico_candado_etiqueta === "SI" ? "si" : "no"
        );

        setText(
          "suspender_adyacentes_respuesta",
          respuestaTexto(permiso.suspender_adyacentes)
        );
        setText(
          "verifico_suspender_adyacentes",
          permiso.verifico_suspender_adyacentes === "SI" ? "si" : "no"
        );

        setText(
          "area_limpia_libre_obstaculos_respuesta",
          respuestaTexto(permiso.area_limpia_libre_obstaculos)
        );
        setText(
          "verifico_area_limpia_libre_obstaculos",
          permiso.verifico_area_limpia_libre_obstaculos === "SI" ? "si" : "no"
        );

        setText(
          "libranza_electrica_respuesta",
          respuestaTexto(permiso.libranza_electrica)
        );
        setText(
          "verifico_libranza_electrica",
          permiso.verifico_libranza_electrica === "SI" ? "si" : "no"
        );

        // CONDICIONES ACTUALES DEL EQUIPO
        setText("nivel_tension", permiso.nivel_tension || "-");
      }
    })
    .catch((err) => {
      console.error("Error al obtener datos del permiso:", err);
      alert(
        "Error al obtener datos del permiso. Revisa la consola para más detalles."
      );
    });
}

// Utilidad para asignar texto
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

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
        // Generar timestamp automático para rechazo supervisor PT6 (hora local)
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
        // Cerrar el modal de comentario y mostrar modal de confirmación para rechazo
        document.getElementById("modalComentario").style.display = "none";
        
        // Crear y mostrar modal de confirmación para rechazo PT6
        let rejectionConfirmationModal = document.getElementById("rejection-confirmation-modal");
        if (!rejectionConfirmationModal) {
          rejectionConfirmationModal = document.createElement("div");
          rejectionConfirmationModal.id = "rejection-confirmation-modal";
          rejectionConfirmationModal.style.display = "flex";
          rejectionConfirmationModal.style.position = "fixed";
          rejectionConfirmationModal.style.top = 0;
          rejectionConfirmationModal.style.left = 0;
          rejectionConfirmationModal.style.width = "100vw";
          rejectionConfirmationModal.style.height = "100vh";
          rejectionConfirmationModal.style.background = "rgba(44,62,80,0.25)";
          rejectionConfirmationModal.style.zIndex = 1000;
          rejectionConfirmationModal.style.justifyContent = "center";
          rejectionConfirmationModal.style.alignItems = "center";
          rejectionConfirmationModal.innerHTML = `
            <div style="background:#fff; border-radius:12px; max-width:400px; width:90vw; padding:2em 1.5em; box-shadow:0 4px 24px rgba(44,62,80,0.18); display:flex; flex-direction:column; gap:1em; align-items:center;">
              <h3 style="margin:0 0 0.5em 0; font-size:1.2em; color:#c0392b;"><i class="ri-close-circle-line" style="margin-right:8px;"></i>Permiso no autorizado correctamente</h3>
              <div style="font-size:1em; color:#2c3e50; margin-bottom:1em;">El permiso de trabajo número: <span id="rejected-permit">${idPermiso || "-"}</span> ha sido rechazado</div>
              <button id="rejection-modal-close-btn" style="background:#c0392b; color:#fff; border:none; border-radius:4px; padding:8px 24px; cursor:pointer; font-size:1em;">Cerrar</button>
            </div>
          `;
          document.body.appendChild(rejectionConfirmationModal);
        } else {
          rejectionConfirmationModal.style.display = "flex";
        }

        const rejectedPermitNumber = document.getElementById("rejected-permit");
        if (rejectedPermitNumber) rejectedPermitNumber.textContent = idPermiso || "-";

        const rejectionModalCloseBtn = document.getElementById("rejection-modal-close-btn");
        if (rejectionModalCloseBtn) {
          rejectionModalCloseBtn.setAttribute("type", "button");
          rejectionModalCloseBtn.onclick = function (e) {
            e.preventDefault();
            rejectionConfirmationModal.style.display = "none";
            window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
          };
        }

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
  // Guardar requisitos
  const btnGuardar = document.getElementById("btn-guardar-requisitos");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", async function () {
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id");
      if (!idPermiso) {
        alert("No se encontró el id del permiso en la URL");
        return;
      }
      // Utilidad para leer radios
      function getRadio(name) {
        const checked = document.querySelector(`input[name='${name}']:checked`);
        return checked ? checked.value : null;
      }
      // Utilidad para leer checkboxes (devuelve "SI" o "NO")
      function getCheckbox(name) {
        const checkbox = document.querySelector(`input[name='${name}']`);
        return checkbox && checkbox.checked ? "SI" : "NO";
      }
      // Utilidad para leer input text
      function getInputValue(id) {
        const input = document.getElementById(id);
        return input ? input.value : null;
      }
      // Construir payload con los nombres correctos del backend
      const payload = {
        identifico_equipo: getRadio("identifico_equipo"),
        verifico_identifico_equipo: getCheckbox("verifico_identifico_equipo"),
        fuera_operacion_desenergizado: getRadio(
          "fuera_operacion_desenergizado"
        ),
        verifico_fuera_operacion_desenergizado: getCheckbox(
          "verifico_fuera_operacion_desenergizado"
        ),
        candado_etiqueta: getRadio("candado_etiqueta"),
        verifico_candado_etiqueta: getCheckbox("verifico_candado_etiqueta"),
        suspender_adyacentes: getRadio("suspender_adyacentes"),
        verifico_suspender_adyacentes: getCheckbox(
          "verifico_suspender_adyacentes"
        ),
        area_limpia_libre_obstaculos: getRadio("area_limpia_libre_obstaculos"),
        verifico_area_limpia_libre_obstaculos: getCheckbox(
          "verifico_area_limpia_libre_obstaculos"
        ),
        libranza_electrica: getRadio("libranza_electrica"),
        verifico_libranza_electrica: getCheckbox("verifico_libranza_electrica"),
        nivel_tension: getInputValue("nivel_tension"),
      };
      try {
        const resp = await fetch(
          `/api/pt-electrico/requisitos_area/${idPermiso}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!resp.ok) throw new Error("Error al guardar los requisitos");
        alert("Requisitos guardados correctamente");
      } catch (err) {
        console.error("Error al guardar requisitos:", err);
        alert(
          "Error al guardar los requisitos. Revisa la consola para más detalles."
        );
      }
    });
  }

  // Salir: redirigir a AutorizarPT.html
  const btnSalirNuevo = document.getElementById("btn-salir-nuevo");

  // --- FUNCIONES PARA RELLENAR AST Y PARTICIPANTES ---
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

  // Leer el id del permiso de la URL
  const params2 = new URLSearchParams(window.location.search);
  const idPermiso2 = params2.get("id");
  if (idPermiso2) {
    // Llamar a la API para obtener los datos del permiso
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso2)}`)
      .then((resp) => resp.json())
      .then((data) => {
        // Prefijo y datos generales en el título y descripción del trabajo
        if (data && data.general) {
          if (document.getElementById("prefijo-label"))
            document.getElementById("prefijo-label").textContent =
              data.general.prefijo || "-";
          if (document.getElementById("start-time-label"))
            document.getElementById("start-time-label").textContent =
              data.general.hora_inicio || "-";
          if (document.getElementById("fecha-label"))
            document.getElementById("fecha-label").textContent =
              data.general.fecha || "-";
          if (document.getElementById("activity-type-label"))
            document.getElementById("activity-type-label").textContent =
              data.general.tipo_mantenimiento || "-";
          if (document.getElementById("plant-label"))
            document.getElementById("plant-label").textContent =
              data.general.area || "-";
          if (document.getElementById("descripcion-trabajo-label"))
            document.getElementById("descripcion-trabajo-label").textContent =
              data.general.descripcion_trabajo || "-";
          if (document.getElementById("empresa-label"))
            document.getElementById("empresa-label").textContent =
              data.general.empresa || "-";
          if (document.getElementById("nombre-solicitante-label"))
            document.getElementById("nombre-solicitante-label").textContent =
              data.general.solicitante ||
              data.general.nombre_solicitante ||
              "-";
          if (document.getElementById("sucursal-label"))
            document.getElementById("sucursal-label").textContent =
              data.general.sucursal || "-";
          if (document.getElementById("contrato-label"))
            document.getElementById("contrato-label").textContent =
              data.general.contrato || "-";
        }
        // Llenar campos generales usando data.data
        if (data && data.data) {
          const detalles = data.data;
          if (document.getElementById("maintenance-type-label"))
            document.getElementById("maintenance-type-label").textContent =
              detalles.tipo_mantenimiento || "-";
          if (document.getElementById("work-order-label"))
            document.getElementById("work-order-label").textContent =
              detalles.ot_numero || "-";
          if (document.getElementById("tag-label"))
            document.getElementById("tag-label").textContent =
              detalles.tag || "-";
          if (document.getElementById("start-time-label"))
            document.getElementById("start-time-label").textContent =
              detalles.hora_inicio || "-";
          if (document.getElementById("equipment-description-label"))
            document.getElementById("equipment-description-label").textContent =
              detalles.equipo_intervenir || "-";
          if (document.getElementById("special-tools-label"))
            document.getElementById("special-tools-label").textContent =
              detalles.requiere_herramientas_especiales || "-";
          if (document.getElementById("special-tools-type-label"))
            document.getElementById("special-tools-type-label").textContent =
              detalles.tipo_herramientas_especiales || "-";
          if (document.getElementById("adequate-tools-label"))
            document.getElementById("adequate-tools-label").textContent =
              detalles.herramientas_adecuadas || "-";
          if (document.getElementById("pre-verification-label"))
            document.getElementById("pre-verification-label").textContent =
              detalles.requiere_verificacion_previa || "-";
          if (document.getElementById("risk-knowledge-label"))
            document.getElementById("risk-knowledge-label").textContent =
              detalles.requiere_conocer_riesgos || "-";
          if (document.getElementById("final-observations-label"))
            document.getElementById("final-observations-label").textContent =
              detalles.observaciones_medidas || "-";
          // También mapear equipo_intervenir correctamente
          if (document.getElementById("descripcion-trabajo-label"))
            document.getElementById("descripcion-trabajo-label").textContent =
              detalles.descripcion_trabajo || "-";
        }
        // Rellenar AST y Participantes si existen en la respuesta
        if (data.ast) {
          mostrarAST(data.ast);
        } else {
          mostrarAST({}); // Limpia listas si no hay datos
        }
        if (data.actividades_ast) {
          mostrarActividadesAST(data.actividades_ast);
        } else {
          mostrarActividadesAST([]); // Limpia tabla si no hay datos
        }
        if (data.participantes_ast) {
          mostrarParticipantesAST(data.participantes_ast);
        } else {
          mostrarParticipantesAST([]); // Limpia tabla si no hay datos
        }
        // Guardar la respuesta canónica para uso en modales y mapeos
        try {
          window.currentPermisoData = data;
        } catch (e) {
          console.warn(
            "No se pudo asignar window.currentPermisoData desde /api/verformularios",
            e
          );
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });
    // Llenar selects de supervisor y categoría
    rellenarSupervisoresYCategorias();
  }
});

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

// Salir: redirigir a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function () {
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  });
}
