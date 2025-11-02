// Definir idPermiso globalmente al inicio
const params = new URLSearchParams(window.location.search);
const idPermiso = params.get("id");

// Mostrar nombres de responsable y operador del área en la sección de aprobaciones
document.addEventListener("DOMContentLoaded", function () {
  // Mostrar/ocultar el campo "Valor" según selección "SI" en radios de parámetros de gas
  function toggleValorInput(radioName, inputName) {
    const radios = document.getElementsByName(radioName);
    const input = document.querySelector(`[name='${inputName}']`);
    if (!input) return;
    function update() {
      const siRadio = Array.from(radios).find(
        (r) => r.value === "SI" && r.checked
      );
      input.style.display = siRadio ? "" : "none";
      if (!siRadio) input.value = "";
    }
    radios.forEach((r) => r.addEventListener("change", update));
    update();
  }

  // Aplica la lógica para los campos de valor de parámetros de gas
  toggleValorInput("co2_aprobado", "co2_valor");
  toggleValorInput("amniaco_aprobado", "amniaco_valor");
  toggleValorInput("oxigeno_aprobado", "oxigeno_valor");
  toggleValorInput("lel_aprobado", "lel_valor");
  toggleValorInput("otro_aprobado", "otro_valor");
  // Mostrar/ocultar los campos "¿Cuál?" según selección "SI" en radios
  function toggleDetalleInput(radioName, inputName) {
    const radios = document.getElementsByName(radioName);
    const input = document.querySelector(`[name='${inputName}']`);
    if (!input) return;
    function update() {
      const siRadio = Array.from(radios).find(
        (r) => r.value === "SI" && r.checked
      );
      input.style.display = siRadio ? "" : "none";
      if (!siRadio) input.value = "";
    }
    radios.forEach((r) => r.addEventListener("change", update));
    update();
  }

  // Aplica la lógica para los campos con detalle
  toggleDetalleInput(
    "proteccion_piel_cuerpo",
    "detalle_proteccion_piel_cuerpo"
  );
  toggleDetalleInput(
    "proteccion_respiratoria",
    "detalle_proteccion_respiratoria"
  );
  toggleDetalleInput("proteccion_ocular", "detalle_proteccion_ocular");
  toggleDetalleInput("ventilacion_forzada", "detalle_ventilacion_forzada");
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

// Funciones para manejar el cambio de supervisor y categoría (evita error de referencia)
function actualizarAprobador(value) {
  // Puedes agregar lógica aquí si lo necesitas
}
function actualizarAprobador2(value) {
  // Puedes agregar lógica aquí si lo necesitas
}

// Utilidad para asignar texto
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent =
      value !== null && value !== undefined && value !== "" ? value : "-";
  } else {
    console.warn(`⚠️ No se encontró el elemento con id=\"${id}\"`);
  }
  if (el) {
    el.textContent =
      value !== null && value !== undefined && value !== "" ? value : "-";
  } else {
    console.warn(`⚠️ No se encontró el elemento con id="${id}"`);
  }
}

// Lógica para rellenar supervisores y categorías en los select
function rellenarSupervisoresYCategorias() {
  // Ejemplo: consulta al backend para obtener supervisores y categorías
  fetch("/api/supervisores")
    .then((resp) => resp.json())
    .then((data) => {
      const selectSupervisor = document.getElementById("responsable-aprobador");
      if (selectSupervisor) {
        selectSupervisor.innerHTML =
          '<option value="" disabled selected>Seleccione un supervisor...</option>';
        // Si data es un array plano
        (Array.isArray(data) ? data : data.supervisores).forEach((sup) => {
          const option = document.createElement("option");
          option.value = sup.nombre || sup.id;
          option.textContent = sup.nombre;
          selectSupervisor.appendChild(option);
        });
      }
    });

    // Obtener categorías
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

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOMContentLoaded - Iniciando script PT3seccionsupervisor.js");

  // --- Lógica para el botón "Autorizar" ---
  const btnAutorizar = document.getElementById("btn-guardar-campos");
  if (btnAutorizar) {
    // Extraer la lógica de autorización a una función reutilizable
    async function ejecutarAutorizacionSupervisorPT3() {
      const params = new URLSearchParams(window.location.search);
      const idPermisoLocal = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";
      if (!idPermisoLocal) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!supervisor) {
        alert("Debes seleccionar el supervisor.");
        return;
      }

      // 1. Actualizar supervisor y categoría en autorizaciones
      try {
        // Generar timestamp automático para autorización supervisor PT3 (hora local)
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
          "[AUTORIZAR SUPERVISOR PT3] Timestamp generado (hora local):",
          fechaHoraAutorizacionSupervisor
        );

        await fetch("/api/autorizaciones/supervisor-categoria", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermisoLocal,
            supervisor,
            categoria,
            fecha_hora_supervisor: fechaHoraAutorizacionSupervisor,
          }),
        });
      } catch (err) {
        console.error("Error al actualizar supervisor y categoría:", err);
      }

      // 1.5 Actualizar requisitos de riesgos y pruebas de gas
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

      const proteccion_piel_cuerpo = getRadioValue("proteccion_piel_cuerpo");
      const proteccion_piel_detalle = getInputValue(
        "detalle_proteccion_piel_cuerpo"
      );

      const proteccion_respiratoria = getRadioValue("proteccion_respiratoria");
      const proteccion_respiratoria_detalle = getInputValue(
        "detalle_proteccion_respiratoria"
      );

      const proteccion_ocular = getRadioValue("proteccion_ocular");
      const proteccion_ocular_detalle = getInputValue(
        "detalle_proteccion_ocular"
      );

      const arnes_seguridad = getRadioValue("arnes_seguridad");
      const cable_vida = getRadioValue("cable_vida");

      const ventilacion_forzada_opcion = getRadioValue("ventilacion_forzada");
      const ventilacion_forzada_detalle = getInputValue(
        "detalle_ventilacion_forzada"
      );

      const iluminacion_explosion = getRadioValue("iluminacion_explosion");
      const vigilancia_exterior_opcion = getRadioValue("vigilancia_exterior");

      // Prueba de gas
      const prueba_gas_aprobado = "";

      const param_co2 = getRadioValue("co2_aprobado");
      const valor_co2 = getInputValue("co2_valor");

      const param_amoniaco = getRadioValue("amniaco_aprobado");
      const valor_amoniaco = getInputValue("amniaco_valor");

      const param_oxigeno = getRadioValue("oxigeno_aprobado");
      const valor_oxigeno = getInputValue("oxigeno_valor");

      const param_explosividad_lel = getRadioValue("lel_aprobado");
      const valor_explosividad_lel = getInputValue("lel_valor");

      const param_otro = getRadioValue("otro_aprobado");
      const param_otro_detalle = "";
      const valor_otro = getInputValue("otro_valor");

      const observaciones = getInputValue("observaciones_gas");

      try {
        const payloadSupervisor = {
          proteccion_piel_cuerpo,
          proteccion_piel_detalle,
          proteccion_respiratoria,
          proteccion_respiratoria_detalle,
          proteccion_ocular,
          proteccion_ocular_detalle,
          arnes_seguridad,
          cable_vida,
          ventilacion_forzada_opcion,
          ventilacion_forzada_detalle,
          iluminacion_explosion,
          prueba_gas_aprobado,
          param_co2,
          valor_co2,
          param_amoniaco,
          valor_amoniaco,
          param_oxigeno,
          valor_oxigeno,
          param_explosividad_lel,
          valor_explosividad_lel,
          param_otro,
          param_otro_detalle,
          valor_otro,
          observaciones,
          vigilancia_exterior_opcion,
        };
        console.log(
          "Payload enviado a /pt-confinado/requisitos_supervisor:",
          payloadSupervisor
        );
        await fetch(`/api/requisitos_supervisor/${idPermisoLocal}`, {
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

      // 2. Consultar el id_estatus desde permisos_trabajo
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/permisos-trabajo/${idPermisoLocal}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
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

      // Mostrar modal de confirmación final (número de permiso)
      const confirmationModal = document.getElementById("confirmation-modal");
      if (confirmationModal) {
        confirmationModal.style.display = "flex";
      }
      const permitNumber = document.getElementById("generated-permit");
      if (permitNumber) {
        const prefijoForModal = (window.currentPermisoData && (window.currentPermisoData.general && window.currentPermisoData.general.prefijo)) || (window.currentPermisoData && window.currentPermisoData.data && window.currentPermisoData.data.prefijo) || idPermisoLocal || null;
        permitNumber.textContent = prefijoForModal || idPermisoLocal || "-";
      }
      // Después de ejecutar la autorización, cerrar el modal de confirmación si existe
      const modal = document.getElementById("modalConfirmarAutorizar");
      if (modal) modal.style.display = "none";
    }

    // Nuevo comportamiento: mostrar modal de confirmación con campos canonizados antes de autorizar
    btnAutorizar.addEventListener('click', function (e) {
      e.preventDefault();
      const params = new URLSearchParams(window.location.search);
      const idPermisoLocal = params.get('id') || window.idPermisoActual;
      const responsableInput = document.getElementById('responsable-aprobador');
      const operadorInput = document.getElementById('responsable-aprobador2');
      const supervisor = responsableInput ? responsableInput.value.trim() : '';
      const categoria = operadorInput ? operadorInput.value.trim() : '';
      if (!idPermisoLocal) {
        alert('No se pudo obtener el ID del permiso.');
        return;
      }
      if (!supervisor) {
        alert('Debes seleccionar el supervisor.');
        return;
      }

      // Resolver campos canonizados usando la misma prioridad que el flujo de ÁREA
      try {
        const paramsModal = new URLSearchParams(window.location.search);
        const idPermisoModal = paramsModal.get("id") || window.idPermisoActual || "-";
        const prefijo = (window.currentPermisoData && (window.currentPermisoData.general && window.currentPermisoData.general.prefijo)) || (window.currentPermisoData && window.currentPermisoData.data && window.currentPermisoData.data.prefijo) || idPermisoModal || "-";
        const tipo = (window.currentPermisoData && (window.currentPermisoData.data && (window.currentPermisoData.data.tipo_permiso || window.currentPermisoData.data.tipo_mantenimiento))) || (window.currentPermisoData && window.currentPermisoData.general && (window.currentPermisoData.general.tipo_permiso || window.currentPermisoData.general.tipo_mantenimiento)) || document.getElementById("activity-type-label")?.textContent || "-";
        const solicitante = (window.currentPermisoData && (window.currentPermisoData.data && (window.currentPermisoData.data.nombre_solicitante || window.currentPermisoData.data.solicitante))) || (window.currentPermisoData && window.currentPermisoData.general && (window.currentPermisoData.general.solicitante || window.currentPermisoData.general.nombre_solicitante)) || document.getElementById("nombre-solicitante-label")?.textContent || "-";
        const departamento = (window.currentPermisoData && (window.currentPermisoData.data && (window.currentPermisoData.data.departamento || window.currentPermisoData.data.planta))) || (window.currentPermisoData && window.currentPermisoData.general && (window.currentPermisoData.general.departamento || window.currentPermisoData.general.area)) || document.getElementById("departamento-label")?.textContent || document.getElementById("plant-label")?.textContent || document.getElementById("sucursal-label")?.textContent || "-";

        // Usaremos 'prefijo' como id mostrado en el modal (coincide con área)
        const idLocal = prefijo || idPermisoLocal || "-";

        // Crear o mostrar modal simple
        let modal = document.getElementById('modalConfirmarAutorizar');
        if (!modal) {
          modal = document.createElement('div');
          modal.id = 'modalConfirmarAutorizar';
          modal.style.position = 'fixed';
          modal.style.inset = '0';
          modal.style.display = 'flex';
          modal.style.justifyContent = 'center';
          modal.style.alignItems = 'center';
          modal.style.background = 'rgba(0,0,0,0.25)';
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

        // Rellenar campos del modal
        try {
          const elId = modal.querySelector('#modal-permit-id');
          const elTipo = modal.querySelector('#modal-permit-type');
          const elSolicitante = modal.querySelector('#modal-solicitante');
          const elDepto = modal.querySelector('#modal-departamento');
          if (elId) elId.textContent = idLocal || '-';
          if (elTipo) elTipo.textContent = tipo || '-';
          if (elSolicitante) elSolicitante.textContent = solicitante || '-';
          if (elDepto) elDepto.textContent = departamento || '-';
        } catch (e) { console.warn('No se pudo rellenar modalConfirmarAutorizar:', e); }

        modal.style.display = 'flex';

        // Enlazar botones (asegurarnos de no duplicar handlers)
        const btnConfirm = document.getElementById('btnConfirmarAutorizar');
        const btnCancel = document.getElementById('btnCancelarConfirmar');

        if (btnCancel) {
          btnCancel.onclick = function () {
            const m = document.getElementById('modalConfirmarAutorizar');
            if (m) m.style.display = 'none';
          };
        }

        if (btnConfirm) {
          btnConfirm.onclick = async function () {
            // Deshabilitar botones para prevenir múltiples envíos
            btnConfirm.disabled = true;
            await ejecutarAutorizacionSupervisorPT3();
            btnConfirm.disabled = false;
          };
        }
        return; // hemos mostrado el modal y enlazado handlers
      } catch (err) {
        console.warn('No se pudieron rellenar los campos del modal antes de mostrar (supervisor):', err);
      }

      // Crear o mostrar modal simple
      let modal = document.getElementById('modalConfirmarAutorizar');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalConfirmarAutorizar';
        modal.style.position = 'fixed';
        modal.style.inset = '0';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.background = 'rgba(0,0,0,0.25)';
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

      // Rellenar campos del modal
      try {
        const elId = modal.querySelector('#modal-permit-id');
        const elTipo = modal.querySelector('#modal-permit-type');
        const elSolicitante = modal.querySelector('#modal-solicitante');
        const elDepto = modal.querySelector('#modal-departamento');
        if (elId) elId.textContent = idLocal || '-';
        if (elTipo) elTipo.textContent = tipo || '-';
        if (elSolicitante) elSolicitante.textContent = solicitante || '-';
        if (elDepto) elDepto.textContent = departamento || '-';
      } catch (e) { console.warn('No se pudo rellenar modalConfirmarAutorizar:', e); }

      modal.style.display = 'flex';

      // Enlazar botones (asegurarnos de no duplicar handlers)
      const btnConfirm = document.getElementById('btnConfirmarAutorizar');
      const btnCancel = document.getElementById('btnCancelarConfirmar');

      function clearHandlers() {
        if (btnConfirm) btnConfirm.onclick = null;
        if (btnCancel) btnCancel.onclick = null;
      }

      if (btnCancel) {
        btnCancel.onclick = function () {
          const m = document.getElementById('modalConfirmarAutorizar');
          if (m) m.style.display = 'none';
        };
      }

      if (btnConfirm) {
        btnConfirm.onclick = async function () {
          // Deshabilitar botones para prevenir múltiples envíos
          btnConfirm.disabled = true;
          await ejecutarAutorizacionSupervisorPT3();
          btnConfirm.disabled = false;
        };
      }
    });
  }

  //
  //
  // ACA TERMINA LA LOGICA DEL BOTON AUTORIZAR
  //
  //

  // --- Lógica para el botón "Salir" ---
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
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
      // Antes de abrir el modal de comentario, mostrar un modal de confirmación (No autorizar)
      try {
        const data = window.currentPermisoData || {};
        // ID: prefer prefijo (general.prefijo) then data.prefijo then URL id
        const idPermisoLocal = (data && ((data.general && (data.general.prefijo || data.general.prefijo_label)) || data.prefijo || (data.data && data.data.prefijo))) || idPermiso || '-';
        // Tipo: prefer data.tipo_permiso, then general.tipo_permiso, then detalles.tipo_actividad, fallback to tipo_mantenimiento
        const tipo = (data && ((data.data && data.data.tipo_permiso) || (data.general && data.general.tipo_permiso) || (data.detalles && data.detalles.tipo_actividad) || (data.data && data.data.tipo_mantenimiento) || (data.general && data.general.tipo_mantenimiento))) || document.getElementById('activity-type-label')?.textContent || '-';
        // Solicitante
        const solicitante = (data && (data.data && (data.data.nombre_solicitante || data.data.solicitante))) || (data && data.general && (data.general.solicitante || data.general.nombre_solicitante)) || document.getElementById('nombre-solicitante-label')?.textContent || '-';
        // Departamento: prefer general.departamento -> data.departamento -> planta -> general.area
        const departamento = (data && ((data.general && data.general.departamento) || (data.data && data.data.departamento) || (data.data && data.data.planta) || (data.general && data.general.area))) || document.getElementById('plant-label')?.textContent || document.getElementById('sucursal-label')?.textContent || '-';

        let noModal = document.getElementById('modalConfirmarNoAutorizar');
        if (!noModal) {
          noModal = document.createElement('div');
          noModal.id = 'modalConfirmarNoAutorizar';
          noModal.style = 'position:fixed;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);z-index:9999;';
          noModal.innerHTML = `
            <div style="background:#fff;padding:18px;border-radius:6px;min-width:320px;max-width:420px;">
              <h3 style="margin-top:0">Confirmar no autorizar</h3>
              <p>Vas a rechazar este permiso. Se guardará un comentario explicando el motivo.</p>
              <p><strong>ID:</strong> <span id="modal-permit-id-no">-</span></p>
              <p><strong>Tipo:</strong> <span id="modal-permit-type-no">-</span></p>
              <p><strong>Solicitante:</strong> <span id="modal-permit-solicitante-no">-</span></p>
              <p><strong>Departamento:</strong> <span id="modal-permit-departamento-no">-</span></p>
              <div style="text-align:right;margin-top:12px;">
                <button id="btnCancelarConfirmarNo" style="margin-right:8px;">Cancelar</button>
                <button id="btnConfirmarNoAutorizar">Continuar</button>
              </div>
            </div>`;
          document.body.appendChild(noModal);
        }

        // Rellenar valores
        try {
          noModal.querySelector('#modal-permit-id-no').textContent = idPermisoLocal;
          noModal.querySelector('#modal-permit-type-no').textContent = tipo;
          noModal.querySelector('#modal-permit-solicitante-no').textContent = solicitante;
          noModal.querySelector('#modal-permit-departamento-no').textContent = departamento;
        } catch (e) { console.warn('No se pudo rellenar modalConfirmarNoAutorizar:', e); }

        noModal.style.display = 'flex';

        const btnCancelNo = document.getElementById('btnCancelarConfirmarNo');
        const btnConfirmNo = document.getElementById('btnConfirmarNoAutorizar');
        if (btnCancelNo) btnCancelNo.onclick = function(){ const m = document.getElementById('modalConfirmarNoAutorizar'); if (m) m.style.display='none'; };
        if (btnConfirmNo) btnConfirmNo.onclick = function(){
          const m = document.getElementById('modalConfirmarNoAutorizar'); if (m) m.style.display='none';
          // Abrir el modal de comentario para capturar el motivo
          const comentarioModal = document.getElementById('modalComentario');
          if (comentarioModal) {
            comentarioModal.style.display = 'flex';
            const textarea = document.getElementById('comentarioNoAutorizar');
            if (textarea) textarea.value = '';
          }
        };

        return; // mostramos confirmación y retornamos; el flujo continuará con el handler para guardar comentario
      } catch (e) {
        console.warn('No se pudo rellenar modalConfirmarNoAutorizar (supervisor):', e);
      }

      // Fallback: abrir directamente el modalComentario si no hay modalConfirmarNoAutorizar
      const modal = document.getElementById("modalComentario");
      if (modal) {
        modal.style.display = "flex";
        document.getElementById("comentarioNoAutorizar").value = "";
      }

      // Lógica para guardar el comentario y actualizar estatus a No Autorizado (se mantiene)
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
            // Generar timestamp automático para rechazo supervisor PT3 (hora local)
            const nowRechazoSupervisor = new Date();
            const year = nowRechazoSupervisor.getFullYear();
            const month = String(nowRechazoSupervisor.getMonth() + 1).padStart(
              2,
              "0"
            );
            const day = String(nowRechazoSupervisor.getDate()).padStart(2, "0");
            const hours = String(nowRechazoSupervisor.getHours()).padStart(
              2,
              "0"
            );
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
            console.log(
              "[NO AUTORIZAR SUPERVISOR PT3] Timestamp generado (hora local):",
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

  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");

  console.log("URL actual:", window.location.href);
  console.log("Parámetros de URL:", window.location.search);
  console.log("ID extraído:", idPermiso);

  if (idPermiso) {
    console.log("Consultando permiso con ID:", idPermiso);

    // Obtener datos generales del permiso
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Respuesta de verformularios:", data);

        // Normalizar y exponer los datos canónicos para que los modales los usen
        try {
          let norm = data && data.data ? data.data : data;
          if (Array.isArray(norm)) norm = norm[0];
          window.currentPermisoData = norm || {};
          // Habilitar botones que dependen de los datos canónicos
          try {
            const btnGuardar = document.getElementById('btn-guardar-campos');
            const btnNoAuth = document.getElementById('btn-no-autorizar');
            if (btnGuardar) btnGuardar.disabled = false;
            if (btnNoAuth) btnNoAuth.disabled = false;
          } catch (e) { console.warn('No se pudieron habilitar botones tras cargar datos', e); }
        } catch (e) {
          console.warn('No se pudo normalizar window.currentPermisoData:', e);
        }

        // Prefijo en el título
        if (data && data.general && document.getElementById("prefijo-label")) {
          document.getElementById("prefijo-label").textContent =
            data.general.prefijo || "-";
        }

        // Rellenar datos generales si existen
        if (data && data.general) {
          setText(
            "descripcion-trabajo-label",
            data.general.descripcion_trabajo
          );

          setText("work-order-label", data.general.ot_numero);
          setText("tag-label", data.general.tag);
          setText("start-time-label", data.general.hora_inicio);
          setText("fecha-label", data.general.fecha);
          setText("activity-type-label", data.general.tipo_mantenimiento);
          setText("plant-label", data.general.area);
          setText(
            "descripcion-trabajo-label",
            data.general.descripcion_trabajo
          );
          setText("nombre-solicitante-label", data.general.nombre_solicitante);
          setText("sucursal-label", data.general.sucursal);
          setText("contrato-label", data.general.contrato);

          setText("equipment-label", data.general.equipo_intervenir);

          setText("empresa-label", data.general.empresa);
          setText("avisos_trabajos", data.general.avisos_trabajos);
          setText(
            "iluminacion_prueba_explosion",
            data.general.iluminacion_prueba_explosion
          );
          setText("ventilacion_forzada", data.general.ventilacion_forzada);
          setText(
            "evaluacion_medica_aptos",
            data.general.evaluacion_medica_aptos
          );
          setText(
            "cable_vida_trabajadores",
            data.general.cable_vida_trabajadores
          );
          setText("vigilancia_exterior", data.general.vigilancia_exterior);
          setText("nombre_vigilante", data.general.nombre_vigilante);
          setText("personal_rescatista", data.general.personal_rescatista);
          setText("nombre_rescatista", data.general.nombre_rescatista);
          setText("instalar_barreras", data.general.instalar_barreras);
          setText("equipo_especial", data.general.equipo_especial);
          setText("tipo_equipo_especial", data.general.tipo_equipo_especial);
          setText(
            "observaciones_adicionales",
            data.general.observaciones_adicionales
          );
          setText(
            "numero_personas_autorizadas",
            data.general.numero_personas_autorizadas
          );
          setText(
            "tiempo_permanencia_min",
            data.general.tiempo_permanencia_min
          );
          setText(
            "tiempo_recuperacion_min",
            data.general.tiempo_recuperacion_min
          );
          setText(
            "clase_espacio_confinado",
            data.general.clase_espacio_confinado
          );

          setText(
            "verificar_explosividad",
            data.general.verificar_explosividad
          );
          setText("verificar_gas_toxico", data.general.verificar_gas_toxico);
          setText(
            "verificar_deficiencia_oxigeno",
            data.general.verificar_deficiencia_oxigeno
          );
          setText(
            "verificar_enriquecimiento_oxigeno",
            data.general.verificar_enriquecimiento_oxigeno
          );
          setText(
            "verificar_polvo_humos_fibras",
            data.general.verificar_polvo_humos_fibras
          );
          setText("verificar_amoniaco", data.general.verificar_amoniaco);
          setText(
            "verificar_material_piel",
            data.general.verificar_material_piel
          );
          setText("verificar_temperatura", data.general.verificar_temperatura);
          setText("verificar_lel", data.general.verificar_lel);
          setText(
            "suspender_trabajos_adyacentes",
            data.general.suspender_trabajos_adyacentes
          );
          setText("acordonar_area", data.general.acordonar_area);
          setText(
            "prueba_gas_toxico_inflamable",
            data.general.prueba_gas_toxico_inflamable
          );
          setText("porcentaje_lel", data.general.porcentaje_lel);
          setText("nh3", data.general.nh3);
          setText("porcentaje_oxigeno", data.general.porcentaje_oxigeno);
          setText(
            "equipo_despresionado_fuera_operacion",
            data.general.equipo_despresionado_fuera_operacion
          );
          setText("equipo_aislado", data.general.equipo_aislado);
          setText("equipo_lavado", data.general.equipo_lavado);
          setText("equipo_neutralizado", data.general.equipo_neutralizado);
          setText("equipo_vaporizado", data.general.equipo_vaporizado);
          setText(
            "aislar_purgas_drenaje_venteo",
            data.general.aislar_purgas_drenaje_venteo
          );
          setText(
            "abrir_registros_necesarios",
            data.general.abrir_registros_necesarios
          );
          setText(
            "observaciones_requisitos",
            data.general.observaciones_requisitos
          );

          setText(
            "equipo_aislado_valvula",
            data.general.equipo_aislado_valvula ? "SI" : "NO"
          );
          setText(
            "equipo_aislado_junta_ciega",
            data.general.equipo_aislado_junta_ciega ? "SI" : "NO"
          );
          setText("fluid", data.general.fluido);
          setText("pressure", data.general.presion);
          setText("temperature", data.general.temperatura);
        } else {
          console.warn("⚠️ No se encontraron datos generales en la respuesta");
        }

        // Rellenar medidas/requisitos usando data.data
        if (data && data.data) {
          rellenarMedidasRequisitos(data.data);
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
      })
      .catch((err) => {
        console.error(
          "Error al obtener datos del permiso verformularios:",
          err
        );
      });

    // Obtener datos específicos del PT3 confinado
    fetch(`/api/pt-confinado/${idPermiso}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Respuesta de pt-confinado:", data);
        if (data && data.data) {
          const permiso = data.data;
          console.log("Datos del permiso PT3:", permiso);

          // Rellenar todos los campos de requisitos de trabajo

          // Rellenar todos los campos específicos de medidas/requisitos
          const campos = [
            "avisos_trabajos",
            "iluminacion_prueba_explosion",
            "ventilacion_forzada",
            "evaluacion_medica_aptos",
            "cable_vida_trabajadores",
            "vigilancia_exterior",
            "nombre_vigilante",
            "personal_rescatista",
            "nombre_rescatista",
            "instalar_barreras",
            "equipo_especial",
            "tipo_equipo_especial",
            "observaciones_adicionales",
            "numero_personas_autorizadas",
            "tiempo_permanencia_min",
            "tiempo_recuperacion_min",
            "clase_espacio_confinado",
          ];

          campos.forEach((campo) => {
            setText(campo, permiso[campo]);
          });

          console.log("Todos los campos han sido rellenados correctamente");
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso pt-confinado:", err);
      });
  }
  rellenarSupervisoresYCategorias();
});

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
                <td>${act.acciones_preventivas || act.descripcion || ""}</td>
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
                 <td>    </td>
            `;
        tbody.appendChild(tr);
      });
    }
  }
}

document.getElementById("modal-close-btn").onclick = function () {
  const confirmationModal = document.getElementById("confirmation-modal");
  if (confirmationModal) confirmationModal.style.display = "none";
  window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
};
