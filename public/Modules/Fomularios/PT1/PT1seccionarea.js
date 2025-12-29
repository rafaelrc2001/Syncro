// Ejecutar consulta automática al cargar si hay id en la URL
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    consultarTodoPermiso(idPermiso).then((resultado) => {
      // Mostrar permisos según los valores columna_*_valor
      if (resultado && resultado.permiso && resultado.permiso.data) {
        mostrarPermisosSegunValores(resultado.permiso.data);
      }
    });
    // Llenar la tabla de responsables
    llenarTablaResponsables(idPermiso);
  }
});

// Función para mostrar/ocultar permisos según los valores columna_*_valor
function mostrarPermisosSegunValores(data) {
  // Mapeo de id de contenedor y campo de valor
  const permisos = [
    { id: "permiso-altura", valor: data.columna_altura_valor },
    { id: "permiso-confinado", valor: data.columna_confinado_valor },
    { id: "permiso-fuego", valor: data.columna_fuego_valor },
    { id: "permiso-apertura", valor: data.columna_apertura_valor },
  ];
  permisos.forEach((permiso) => {
    const contenedor = document.getElementById(permiso.id);
    if (contenedor) {
      if (permiso.valor === "SI") {
        contenedor.style.display = "";
      } else {
        contenedor.style.display = "none";
      }
    }
  });
}
// Consulta todos los datos de un permiso y relacionados por id_permiso
async function consultarTodoPermiso(id_permiso) {
    // Mapear prefijo al encabezado NP-XXXXXX
  
  const permiso = await fetch(`/api/permiso?id_permiso=${id_permiso}`).then(r => r.json()).catch(() => null);
  const participan = await fetch(`/api/ast_participan?id_permiso=${id_permiso}`).then(r => r.json()).catch(() => null);
  const actividades = await fetch(`/api/ast_actividades?id_permiso=${id_permiso}`).then(r => r.json()).catch(() => null);
  const autorizaciones = await fetch(`/api/autorizaciones?id_permiso=${id_permiso}`).then(r => r.json()).catch(() => null);
  const resultado = { permiso, participan, actividades, autorizaciones };
  // Mapeo de datos al HTML
  console.log('OBJETO DEVUELTO POR LA CONSULTA:', permiso);
  if (permiso && permiso.data) {
    const d = permiso.data;
    // Fecha (formato legible)
    const fechaLabel = document.getElementById("fecha-label");
    if(fechaLabel) {
      let fecha = "-";
      if (d.fecha_hora) {
        const f = new Date(d.fecha_hora);
        if (!isNaN(f.getTime())) {
          fecha = f.toLocaleDateString('es-MX');
        }
      }
      fechaLabel.textContent = fecha;
    }
    
    

      const npHeader = document.getElementById("np-header");
    if (npHeader && d.prefijo) {
      npHeader.textContent = d.prefijo;
    }

    const startTimeLabel = document.getElementById("start-time-label");
    if(startTimeLabel) startTimeLabel.textContent = d.hora_inicio || "-";
    const empresaLabel = document.getElementById("empresa-label");
    if(empresaLabel) empresaLabel.textContent = d.empresa || "-";
    const sucursalLabel = document.getElementById("sucursal-label");
    if(sucursalLabel) sucursalLabel.textContent = d.nombre_sucursal_id  || "-";
    const dptoContrato = document.getElementById("dpto-contrato");
    if(dptoContrato) dptoContrato.textContent = d.nombre_departamento || d.contratista || d.id_departamento || "-";
    const plantLabel = document.getElementById("plant-label");
    if(plantLabel) plantLabel.textContent =  d.nombre_departamento_id ||   "-";
    const ubicacionLabel = document.getElementById("ubicacion");
    if(ubicacionLabel) ubicacionLabel.textContent = d.nombre_area_id  || "-";
    const responsableTrabajoLabel = document.getElementById("responsable-trabajo-label");
    if(responsableTrabajoLabel) responsableTrabajoLabel.textContent = d.nombre_solicitante || "-";
    const descripcionTrabajoLabel = document.getElementById("descripcion-trabajo-label");
    if(descripcionTrabajoLabel) descripcionTrabajoLabel.textContent = d.descripcion_trabajo || "-";
    const activityTypeLabel = document.getElementById("activity-type-label");
    if(activityTypeLabel) activityTypeLabel.textContent = d.tipo_mantenimiento || "-";
    const workOrderLabel = document.getElementById("work-order-label");
    if(workOrderLabel) workOrderLabel.textContent = d.ot_numero || "-";
    const contratoLabel = document.getElementById("contrato-label");
    if(contratoLabel) contratoLabel.textContent = d.contrato || "-";
    const tagLabel = document.getElementById("tag-label");
    if(tagLabel) tagLabel.textContent = d.tag || "-";
    const equipmentLabel = document.getElementById("equipment-label");
    if(equipmentLabel) equipmentLabel.textContent = d.equipo_intervenir || "-";

    // Mapeo explícito de campos especiales por id
    const pal_cr_1 = document.getElementById("pal_cr_1");
    if(pal_cr_1) pal_cr_1.textContent = d.pal_cr_1 || "-";
    const pal_epc_1 = document.getElementById("pal_epc_1");
    if(pal_epc_1) pal_epc_1.textContent = d.pal_epc_1 || "-";
    const pal_epc_2 = document.getElementById("pal_epc_2");
    if(pal_epc_2) pal_epc_2.textContent = d.pal_epc_2 || "-";
    const pal_epp_1 = document.getElementById("pal_epp_1");
    if(pal_epp_1) pal_epp_1.textContent = d.pal_epp_1 || "-";
    const pal_epp_2 = document.getElementById("pal_epp_2");
    if(pal_epp_2) pal_epp_2.textContent = d.pal_epp_2 || "-";
    const pal_fa_1 = document.getElementById("pal_fa_1");
    if(pal_fa_1) pal_fa_1.textContent = d.pal_fa_1 || "-";
    const pal_fa_2 = document.getElementById("pal_fa_2");
    if(pal_fa_2) pal_fa_2.textContent = d.pal_fa_2 || "-";
    const pap_ce_1 = document.getElementById("pap_ce_1");
    if(pap_ce_1) pap_ce_1.textContent = d.pap_ce_1 || "-";
    const pap_ce_2 = document.getElementById("pap_ce_2");
    if(pap_ce_2) pap_ce_2.textContent = d.pap_ce_2 || "-";
    const pap_epe_1 = document.getElementById("pap_epe_1");
    if(pap_epe_1) pap_epe_1.textContent = d.pap_epe_1 || "-";
    const pco_eh_1 = document.getElementById("pco_eh_1");
    if(pco_eh_1) pco_eh_1.textContent = d.pco_eh_1 || "-";
    const pco_era_1 = document.getElementById("pco_era_1");
    if(pco_era_1) pco_era_1.textContent = d.pco_era_1 || "-";
    const pco_ma_1 = document.getElementById("pco_ma_1");
    if(pco_ma_1) pco_ma_1.textContent = d.pco_ma_1 || "-";
    const pco_ma_2 = document.getElementById("pco_ma_2");
    if(pco_ma_2) pco_ma_2.textContent = d.pco_ma_2 || "-";
    const pco_ma_3 = document.getElementById("pco_ma_3");
    if(pco_ma_3) pco_ma_3.textContent = d.pco_ma_3 || "-";
    const pco_ma_4 = document.getElementById("pco_ma_4");
    if(pco_ma_4) pco_ma_4.textContent = d.pco_ma_4 || "-";
    const pco_ma_5 = document.getElementById("pco_ma_5");
    if(pco_ma_5) pco_ma_5.textContent = d.pco_ma_5 || "-";
    const pfg_cr_1 = document.getElementById("pfg_cr_1");
    if(pfg_cr_1) pfg_cr_1.textContent = d.pfg_cr_1 || "-";
    const pfg_cr_1a = document.getElementById("pfg_cr_1a");
    if(pfg_cr_1a) pfg_cr_1a.textContent = d.pfg_cr_1a || "N/A";
    const pfg_eppe_1 = document.getElementById("pfg_eppe_1");
    if(pfg_eppe_1) pfg_eppe_1.textContent = d.pfg_eppe_1 || "-";
    const pfg_eppe_2 = document.getElementById("pfg_eppe_2");
    if(pfg_eppe_2) pfg_eppe_2.textContent = d.pfg_eppe_2 || "-";
    const pfg_ma_1 = document.getElementById("pfg_ma_1");
    if(pfg_ma_1) pfg_ma_1.textContent = d.pfg_ma_1 || "-";
    const pfg_ma_2 = document.getElementById("pfg_ma_2");
    if(pfg_ma_2) pfg_ma_2.textContent = d.pfg_ma_2 || "-";
    const pfg_ma_3 = document.getElementById("pfg_ma_3");
    if(pfg_ma_3) pfg_ma_3.textContent = d.pfg_ma_3 || "-";
  }

  // Participantes (tabla)
  if (participan && participan.data) {
    const tbody = document.getElementById("modal-ast-participantes-body");
    if (tbody) {
      tbody.innerHTML = "";
      participan.data.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${p.nombre || "-"}</td><td>${p.funcion || "-"}</td><td>${p.credencial || "-"}</td><td>${p.cargo || "-"}</td><td></td>`;
        tbody.appendChild(tr);
      });
    }
  }

  // Actividades AST (tabla)
  if (actividades && actividades.data) {
    const tbody = document.getElementById("modal-ast-actividades-body");
    if (tbody) {
      tbody.innerHTML = "";
      actividades.data.forEach((a, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${a.num_actividad || idx + 1}</td>
          <td>${a.secuencia_actividad || "-"}</td>
          
          <td>${a.peligros_potenciales || "-"}</td>
          <td>${a.acciones_preventivas || "-"}</td>
        
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // Autorizaciones (tabla de responsables)
  if (autorizaciones && autorizaciones.data) {
    const tbody = document.getElementById("modal-ast-responsable-body");
    if (tbody) {
      tbody.innerHTML = "";
      autorizaciones.data.forEach(a => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${a.nombre || "-"}</td><td>${a.cargo || "-"}</td><td>${a.fecha || "-"}</td><td></td>`;
        tbody.appendChild(tr);
      });
    }
  }

  return resultado;
}













// --- Lógica para el modal de cierre de permiso ---
document.addEventListener('DOMContentLoaded', function () {
  const btnCierrePermiso = document.getElementById('btn-cierre-permiso');
  const modalCierre = document.getElementById('modalConfirmarCierre');
  const btnCancelarCierre = document.getElementById('btnCancelarCierre');
  const btnConfirmarCierre = document.getElementById('btnConfirmarCierre');
  if (btnCierrePermiso && modalCierre) {
    btnCierrePermiso.addEventListener('click', function () {
      modalCierre.style.display = 'flex';
    });
  }
  if (btnCancelarCierre && modalCierre) {
    btnCancelarCierre.addEventListener('click', function () {
      modalCierre.style.display = 'none';
    });
  }
  if (btnConfirmarCierre && modalCierre) {
    btnConfirmarCierre.addEventListener('click', async function () {
      // Obtener el id del permiso de la URL
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get('id') || window.idPermisoActual;
      if (!idPermiso) {
      
        return;
      }
      // Consultar el id_estatus desde permisos_trabajo
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/estatus/permiso/${idPermiso}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus = permisoData.id_estatus || (permisoData.data && permisoData.data.id_estatus);
        }
      } catch (err) {
        // Error al consultar id_estatus
      }
      if (!idEstatus) {
       
        return;
      }
      // Actualizar el estatus a 'cierre'
      try {
        const respCierre = await fetch('/api/estatus/cierre', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_estatus: idEstatus })
        });
        if (!respCierre.ok) {
          alert('Error al cerrar el permiso.');
        } else {
          modalCierre.style.display = 'none';
          alert('Permiso cerrado correctamente.');
          window.location.href = "/Modules/Departamentos/AutorizarPT.html";




        }
      } catch (err) {
        alert('Error al cerrar el permiso.');
      }
    });
  }
});
// Lógica para mostrar/ocultar botones según el estatus del permiso
document.addEventListener('DOMContentLoaded', function () {
  // Obtener el id del permiso de la URL
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get('id') || window.idPermisoActual;
  if (!idPermiso) return;

  fetch(`/api/estatus-solo/${idPermiso}`)
    .then(resp => resp.json())
    .then(data => {
      // Suponiendo que el estatus viene en data.estatus o data.status
      const estatus = data.estatus || data.status || data;
      const btnAutorizar = document.getElementById('btn-pregunta-autorizar');
      const btnNoAutorizar = document.getElementById('btn-no-autorizar');
      const btnCierre = document.getElementById('btn-cierre-permiso');
      if (!btnAutorizar || !btnNoAutorizar || !btnCierre) return;

      const seccionResponsables = document.querySelector('.executive-section input#responsable-aprobador')?.closest('.executive-section');
      if (typeof estatus === 'string' && estatus.trim().toLowerCase() === 'espera liberacion del area') {
        btnAutorizar.style.display = 'none';
        btnNoAutorizar.style.display = 'none';
        btnCierre.style.display = '';
        if (seccionResponsables) seccionResponsables.style.display = 'none';
      } else {
        btnAutorizar.style.display = '';
        btnNoAutorizar.style.display = '';
        btnCierre.style.display = 'none';
        if (seccionResponsables) seccionResponsables.style.display = '';
      }
    })
    .catch(err => {
      // Si hay error, mostrar todos menos cierre
      const btnAutorizar = document.getElementById('btn-pregunta-autorizar');
      const btnNoAutorizar = document.getElementById('btn-no-autorizar');
      const btnCierre = document.getElementById('btn-cierre-permiso');
      if (btnAutorizar) btnAutorizar.style.display = '';
      if (btnNoAutorizar) btnNoAutorizar.style.display = '';
      if (btnCierre) btnCierre.style.display = 'none';
    });
});
// --- Lógica para el botón "Autorizar" ---
const btnAutorizar = document.getElementById("btn-guardar-campos");
if (btnAutorizar) {
  btnAutorizar.addEventListener("click", async function () {
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
     
      return;
    }
    // Validar responsable obligatorio
    if (!responsable_area) {
      alert("Debes ingresar el nombre del responsable del área 1.");
      if (responsableInput) responsableInput.focus();
      return;
    }

    // 3. Insertar autorización de área vía API
    try {
      // --- Consultar el id_estatus desde permisos_trabajo ---
      // Este endpoint obtiene los datos del permiso de trabajo específico usando su ID. 
      // Permite recuperar información general y de estatus del permiso, necesaria para mostrar y procesar la autorización en la interfaz. Es fundamental para validar el estado actual y continuar con el flujo de autorización o rechazo.
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/estatus/permiso/${idPermiso}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
          console.log(
            "[DEPURACIÓN] idEstatus obtenido:",
            idEstatus,
            "| permisoData:",
            permisoData
          );
        } else {
          console.error(
            "[DEPURACIÓN] Error al obtener id_estatus. Status:",
            respEstatus.status
          );
        }
      } catch (err) {
        console.error("[DEPURACIÓN] Error al consultar id_estatus:", err);
      }

      // --- Actualizar el estatus si se obtuvo el id_estatus ---
      if (idEstatus) {
        // Este endpoint actualiza el estatus de seguridad del permiso en la base de datos. 
        // Se utiliza después de obtener el id_estatus y es clave para reflejar que el área de seguridad ha autorizado 
        // o cambiado el estado del permiso. Garantiza la trazabilidad y control del flujo de autorizaciones en el sistema.
        try {
          const payloadEstatus = { id_estatus: idEstatus };
          console.log(
            "[DEPURACIÓN] Enviando a /api/estatus/activo:",
            payloadEstatus
          );
          const respEstatus = await fetch("/api/estatus/activo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadEstatus),
          });
          console.log(
            "[DEPURACIÓN] Respuesta HTTP de estatus/activo:",
            respEstatus.status
          );
          let data = {};
          try {
            data = await respEstatus.json();
          } catch (e) {
            console.warn(
              "[DEPURACIÓN] No se pudo parsear JSON de respuesta de estatus/activo"
            );
          }
          if (!respEstatus.ok) {
            console.error(
              "[DEPURACIÓN] Error en respuesta de estatus/activo:",
              data
            );
          } else {
            console.log(
              "[DEPURACIÓN] Respuesta exitosa de estatus/activo:",
              data
            );
          }
        } catch (err) {
          console.error(
            "[DEPURACIÓN] Excepción al actualizar estatus de activo:",
            err
          );
        }
      } else {
        console.warn(
          "[DEPURACIÓN] No se obtuvo id_estatus para actualizar estatus."
        );
      }

      // Generar timestamp automático para autorización PT1 (hora local)
      const now = new Date();
      const fechaHoraAutorizacion = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString();
      console.log(
        "[AUTORIZAR PT1] Timestamp generado (hora local):",
        fechaHoraAutorizacion
      );

      // Guardar responsable y operador de área igual que PT2
      // Este endpoint guarda la autorización del área, 
      // registrando responsable, operador y fecha/hora.
      // Es esencial para dejar evidencia de quién autorizó el permiso y cuándo,
      //  cumpliendo requisitos de auditoría y control interno. Se usa tanto para autorizaciones normales como para rechazos, asegurando integridad en el registro de acciones.
      await fetch("/api/autorizaciones/area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          responsable_area,
          encargado_area: operador_area,
          fecha_hora_area: fechaHoraAutorizacion,
        }),
      });

      // --- Agregar responsable y operador de área ---
      // Este endpoint guarda la autorización del área, registrando responsable, operador y fecha/hora. Es esencial para dejar evidencia de quién autorizó el permiso y cuándo, cumpliendo requisitos de auditoría y control interno. Se usa tanto para autorizaciones normales como para rechazos, asegurando integridad en el registro de acciones.
      await fetch("/api/autorizaciones/area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          responsable_area,
          encargado_area: operador_area,
          fecha_hora_area: fechaHoraAutorizacion,
        }),
      });

      // ...existing code...
      // Mostrar modal de confirmación en vez de redirigir inmediatamente
      const confirmationModal = document.getElementById("confirmation-modal");
      if (confirmationModal) {
        confirmationModal.style.display = "flex";
      }
      // Si tienes el número de permiso generado, puedes ponerlo aquí:
      const permitNumber = document.getElementById("generated-permit");
      if (permitNumber) {
        permitNumber.textContent = idPermiso || "-";
      }
    } catch (err) {
      console.error(
        "[DEPURACIÓN] Error al insertar autorización de área:",
        err
      );
    }
  });
}

// --- Lógica para el botón "No Autorizar" ---

// Lógica para cerrar el modal de confirmación y redirigir
const modalCloseBtn = document.getElementById("modal-close-btn");
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", function () {
    window.location.href = "/Modules/Departamentos/AutorizarPT.html";
  });
}
const btnNoAutorizar = document.getElementById("btn-no-autorizar");
if (btnNoAutorizar) {
  btnNoAutorizar.addEventListener("click", function () {
    // 1. Validar nombre del responsable antes de abrir el modal de comentario
    const responsableInput = document.getElementById("responsable-aprobador");
    const responsable_area = responsableInput
      ? responsableInput.value.trim()
      : "";
    if (!responsable_area) {
      alert("Debes ingresar el nombre del responsable antes de rechazar 2.");
      return;
    }
    // Mostrar un modal de confirmación para 'No Autorizar' antes de pedir el motivo
    const noModal = document.getElementById("modalConfirmarNoAutorizar");
    if (noModal) {
      try {
        const data = window.currentPermisoData;
        const params = new URLSearchParams(window.location.search);
        const idPermisoLocal =
          getPermisoValue(["general.prefijo", "prefijo", "data.prefijo"]) ||
          params.get("id") ||
          (data && ((data.general && data.general.id) || data.id)) ||
          "-";
        const tipoFromData = getPermisoValue([
          "data.tipo_permiso",
          "general.tipo_permiso",
          "detalles.tipo_actividad",
          "general.tipo_actividad",
          "general.prefijo",
          "data.tipo_mantenimiento",
          "general.tipo_mantenimiento",
        ]);
        const tipo =
          tipoFromData ||
          document.getElementById("activity-type-label")?.textContent ||
          "-";
        const solicitante =
          getPermisoValue(["general.solicitante", "detalles.solicitante"]) ||
          document.getElementById("nombre-solicitante-label")?.textContent ||
          "-";
        const departamento =
          getPermisoValue([
            "detalles.departamento",
            "general.departamento",
            "detalles.planta",
            "general.planta",
          ]) ||
          document.getElementById("plant-label")?.textContent ||
          document.getElementById("sucursal-label")?.textContent ||
          "-";

        const elId = document.getElementById("modal-permit-id-no");
        const elTipo = document.getElementById("modal-permit-type-no");
        const elSolicitante = document.getElementById("modal-solicitante-no");
        const elDepto = document.getElementById("modal-departamento-no");

        if (elId) elId.textContent = idPermisoLocal;
        if (elTipo) elTipo.textContent = tipo;
        if (elSolicitante) elSolicitante.textContent = solicitante;
        if (elDepto) elDepto.textContent = departamento;
      } catch (e) {
        console.warn("No se pudo rellenar modalConfirmarNoAutorizar:", e);
      }
      noModal.style.display = "flex";
    } else {
      // Fallback: abrir directamente el modalComentario
      const modal = document.getElementById("modalComentario");
      if (modal) {
        modal.style.display = "flex";
        const ta = document.getElementById("comentarioNoAutorizar");
        if (ta) ta.value = "";
      }
    }
  });

  // Lógica para cerrar/cancelar el modal
  const btnCancelarComentario = document.getElementById(
    "btnCancelarComentario"
  );
  if (btnCancelarComentario) {
    btnCancelarComentario.addEventListener("click", function () {
      const modal = document.getElementById("modalComentario");
      if (modal) modal.style.display = "none";
    });
  }

  // Lógica para guardar el comentario y actualizar estatus a No Autorizado
  const btnGuardarComentario = document.getElementById("btnGuardarComentario");
  if (btnGuardarComentario) {
    btnGuardarComentario.addEventListener("click", async function () {
      const comentario = document
        .getElementById("comentarioNoAutorizar")
        .value.trim();
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";
      const operador_area = operadorInput ? operadorInput.value.trim() : "";
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      if (!comentario) {
        return;
      }
      if (!idPermiso) {
        return;
      }
      if (!responsable_area) {
        return;
      }
      try {
        // Generar timestamp automático para rechazo PT1 (hora local)
        const nowRechazo = new Date();
        const fechaHoraRechazo = new Date(
          nowRechazo.getTime() - nowRechazo.getTimezoneOffset() * 60000
        ).toISOString();
        console.log(
          "[NO AUTORIZAR PT1] Timestamp generado (hora local):",
          fechaHoraRechazo
        );

        // 1. Guardar comentario y responsable en la tabla de autorizaciones (puedes adaptar el endpoint si tienes uno específico para no autorizado)
        // Este endpoint guarda la autorización del área, registrando responsable, operador y fecha/hora. Es esencial para dejar evidencia de quién autorizó el permiso y cuándo, cumpliendo requisitos de auditoría y control interno. Se usa tanto para autorizaciones normales como para rechazos, asegurando integridad en el registro de acciones.
        const resp = await fetch("/api/autorizaciones/area", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            responsable_area,
            encargado_area: operador_area,
            comentario_no_autorizar: comentario,
            fecha_hora_area: fechaHoraRechazo,
          }),
        });
        if (!resp.ok) {
          await resp.json().catch(() => ({}));
        }

        // 2. Consultar el id_estatus desde permisos_trabajo
        let idEstatus = null;
        try {
          // Este endpoint obtiene los datos del permiso de trabajo específico usando su ID. Permite recuperar información general y de estatus del permiso, necesaria para mostrar y procesar la autorización en la interfaz. Es fundamental para validar el estado actual y continuar con el flujo de autorización o rechazo.
          const respEstatus = await fetch(`/api/estatus/permiso/${idPermiso}`);
          if (respEstatus.ok) {
            const permisoData = await respEstatus.json();
            idEstatus =
              permisoData.id_estatus ||
              (permisoData.data && permisoData.data.id_estatus);
            console.log(
              "[NO AUTORIZAR] idEstatus obtenido:",
              idEstatus,
              "| permisoData:",
              permisoData
            );
          } else {
            // Error al obtener id_estatus
          }
        } catch (err) {
          // Error al consultar id_estatus
        }

        // 3. Actualizar el estatus a 'no autorizado' y guardar el comentario en la tabla estatus
        if (idEstatus) {
          try {
            // Este endpoint actualiza el estatus a 'no autorizado' en la base de datos. Se utiliza después de obtener el id_estatus y es clave para reflejar que el área de seguridad ha rechazado el permiso. Garantiza la trazabilidad y control del flujo de autorizaciones y rechazos en el sistema.
            const payloadEstatus = { id_estatus: idEstatus };
            console.log(
              "[NO AUTORIZAR] Enviando a /api/estatus/no_autorizado:",
              payloadEstatus
            );
            const respEstatus = await fetch("/api/estatus/no_autorizado", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadEstatus),
            });
            let data = {};
            try {
              data = await respEstatus.json();
            } catch (e) {}
            if (!respEstatus.ok) {
              return;
            } else {
              console.log(
                "[NO AUTORIZAR] Estatus actualizado a No Autorizado:",
                data
              );
            }

            // 3.1 Guardar el comentario en la tabla estatus
            // Este endpoint permite registrar un comentario de rechazo en la tabla de estatus. Es importante para documentar los motivos de no autorización y mantener un historial claro de decisiones. Facilita la retroalimentación y mejora la transparencia en el proceso de gestión de permisos de trabajo.
            const respComentario = await fetch("/api/estatus/comentario", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_estatus: idEstatus, comentario }),
            });
            let dataComentario = {};
            try {
              dataComentario = await respComentario.json();
            } catch (e) {}
            if (!dataComentario.success) {
              return;
            }
          } catch (err) {
            return;
          }
        } else {
          return;
        }

        // 4. Cerrar el modal y mostrar mensaje de éxito
        const modal = document.getElementById("modalComentario");
        if (modal) modal.style.display = "none";
        window.location.href = "/Modules/Departamentos/AutorizarPT.html";
      } catch (err) {
        // Error en el proceso de no autorización
      }
    });
  }
}

// Nuevo botón salir: vuelve a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/Modules/Departamentos/AutorizarPT.html";
  });
}


// Helper: obtener campo del permiso cargado en memoria (window.currentPermisoData)
function getPermisoValue(candidatePaths) {
  const root = window.currentPermisoData || {};
  for (const path of candidatePaths) {
    const parts = path.split(".");
    let cur = root;
    for (const p of parts) {
      if (cur == null) {
        cur = null;
        break;
      }
      cur = cur[p];
    }
    if (cur != null && cur !== "" && cur !== "-") return cur;
  }
  return null;
}

// Función para el botón de autorización con confirmación
const btnPreguntaAutorizar = document.getElementById("btn-pregunta-autorizar");
const modalConfirmarAutorizar = document.getElementById(
  "modalConfirmarAutorizar"
);
const btnCancelarConfirmar = document.getElementById("btnCancelarConfirmar");
const btnConfirmarAutorizar = document.getElementById("btnConfirmarAutorizar");

if (btnPreguntaAutorizar) {
  // Abrir modal de confirmación al hacer clic en "Autorizar"
  btnPreguntaAutorizar.addEventListener("click", function () {
    // Antes de mostrar el modal, rellenar campos con la información del permiso
    try {
      const data = window.currentPermisoData;
      const params = new URLSearchParams(window.location.search);
      const idPermisoLocal =
        getPermisoValue(["general.prefijo", "prefijo", "data.prefijo"]) ||
        params.get("id") ||
        (data && ((data.general && data.general.id) || data.id)) ||
        "-";
      const tipoFromData = getPermisoValue([
        "data.tipo_permiso",
        "general.tipo_permiso",
        "detalles.tipo_actividad",
        "general.tipo_actividad",
        "data.tipo_mantenimiento",
        "general.tipo_mantenimiento",
      ]);
      const tipo =
        tipoFromData ||
        document.getElementById("activity-type-label")?.textContent ||
        "-";
      const solicitante =
        getPermisoValue(["general.solicitante", "detalles.solicitante"]) ||
        document.getElementById("nombre-solicitante-label")?.textContent ||
        "-";
      // Mostrar el departamento (si existe). Preferir detalles.departamento -> general.departamento -> planta -> DOM
      const departamento =
        getPermisoValue([
          "detalles.departamento",
          "general.departamento",
          "detalles.planta",
          "general.planta",
        ]) ||
        document.getElementById("plant-label")?.textContent ||
        document.getElementById("sucursal-label")?.textContent ||
        "-";

      const elId = document.getElementById("modal-permit-id");
      const elTipo = document.getElementById("modal-permit-type");
      const elSolicitante = document.getElementById("modal-solicitante");
      const elDepto = document.getElementById("modal-departamento");

      if (elId) elId.textContent = idPermisoLocal;
      if (elTipo) elTipo.textContent = tipo;
      if (elSolicitante) elSolicitante.textContent = solicitante;
      if (elDepto) elDepto.textContent = departamento;
    } catch (e) {
      console.warn("No se pudo rellenar el modal con datos (no hay data):", e);
    }

    const responsableInput = document.getElementById("responsable-aprobador");
    const responsable_area = responsableInput
      ? responsableInput.value.trim()
      : "";

    if (!responsable_area) {
      alert("Debes ingresar el nombre del responsable del área.");
      if (responsableInput) responsableInput.focus();
      return;
    }

    if (modalConfirmarAutorizar) {
      modalConfirmarAutorizar.style.display = "flex";
    }
  });
}

// Cerrar modal al hacer clic en "Cancelar"
if (btnCancelarConfirmar) {
  btnCancelarConfirmar.addEventListener("click", function () {
    if (modalConfirmarAutorizar) {
      modalConfirmarAutorizar.style.display = "none";
    }
  });
}

// Cerrar modal al hacer clic fuera del contenido
if (modalConfirmarAutorizar) {
  modalConfirmarAutorizar.addEventListener("click", function (e) {
    if (e.target === modalConfirmarAutorizar) {
      modalConfirmarAutorizar.style.display = "none";
    }
  });
}

// Procesar autorización al confirmar
if (btnConfirmarAutorizar) {
  btnConfirmarAutorizar.addEventListener("click", async function () {
    try {
      // Cerrar modal inmediatamente
      if (modalConfirmarAutorizar) {
        modalConfirmarAutorizar.style.display = "none";
      }

      //prueba
      //prueba
      //prueba
      //prueba
      //prueba
      window.obtenerUbicacionYIP();

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
      
        return;
      }

      if (!responsable_area) {
        alert("Debes ingresar el nombre del responsable del área. 4");
        if (responsableInput) responsableInput.focus();
        return;
      }

      // 3. Insertar autorización de área vía API
      // --- Consultar el id_estatus desde permisos_trabajo ---
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/estatus/permiso/${idPermiso}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
          console.log("[DEPURACIÓN] idEstatus obtenido:", idEstatus);
        } else {
          console.error(
            "[DEPURACIÓN] Error al obtener id_estatus. Status:",
            respEstatus.status
          );
        }
      } catch (err) {
        console.error("[DEPURACIÓN] Error al consultar id_estatus:", err);
      }

      // --- Actualizar el estatus si se obtuvo el id_estatus ---
      if (idEstatus) {
        try {
          const payloadEstatus = { id_estatus: idEstatus };
          const respEstatus = await fetch("/api/estatus/activo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadEstatus),
          });

          if (!respEstatus.ok) {
            console.error(
              "[DEPURACIÓN] Error en respuesta de estatus/activo"
            );
          } else {
            console.log(
              "[DEPURACIÓN] Estatus de activo actualizado correctamente"
            );
          }
        } catch (err) {
          console.error(
            "[DEPURACIÓN] Excepción al actualizar estatus de activo:",
            err
          );
        }
      }

      // 4. Recopilar datos del formulario de requisitos del área
      // Eliminada la lógica de guardar requisitos del área, ya no se usa respRequisitos ni fetch relacionado.

      // 6. Generar timestamp y guardar autorización
      const now = new Date();
      const fechaHoraAutorizacion = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      ).toISOString();

      const { ip, localizacion } = await window.obtenerUbicacionYIP();
      // Este endpoint guarda la autorización del área, registrando responsable, operador y fecha/hora, así como IP y localización. Es esencial para dejar evidencia de quién autorizó el permiso y cuándo, cumpliendo requisitos de auditoría y control interno. Se usa tanto para autorizaciones normales como para rechazos, asegurando integridad en el registro de acciones.
      const respAutorizacion = await fetch("/api/autorizaciones/area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          responsable_area,
          encargado_area: operador_area,
          fecha_hora_area: fechaHoraAutorizacion,
          ip_area: ip, // variable de tu función
          localizacion_area: localizacion, // variable de tu función
        }),
      });

      if (!respAutorizacion.ok) {
        throw new Error("Error al guardar la autorización del área");
      }

      // 7. Mostrar modal de éxito o redirigir
      const confirmationModal = document.getElementById("confirmation-modal");
      if (confirmationModal) {
        const permitNumber = document.getElementById("generated-permit");
        if (permitNumber) {
          permitNumber.textContent = idPermiso;
        }
        confirmationModal.style.display = "flex";
      } else {
        // Si no hay modal de confirmación, mostrar alerta y recargar
        alert("Permiso autorizado exitosamente");
        window.location.reload();
      }
    } catch (err) {
      console.error(
        "Error al autorizar el permiso:",
        err,
        err?.message,
        err?.stack
      );
      alert(
        "Ocurrió un error al autorizar el permiso. Por favor, intenta nuevamente."
      );
    }
  });
}

// --- FUNCIONES DE LA VISTA ---

// Handlers para el modal específico de "No Autorizar"
(function setupNoAutorizarModalHandlers() {
  const modalConfirmarNoAutorizar = document.getElementById(
    "modalConfirmarNoAutorizar"
  );
  const btnCancelarConfirmarNo = document.getElementById(
    "btnCancelarConfirmarNo"
  );
  const btnConfirmarNoAutorizar = document.getElementById(
    "btnConfirmarNoAutorizar"
  );

  if (btnCancelarConfirmarNo) {
    btnCancelarConfirmarNo.addEventListener("click", function () {
      if (modalConfirmarNoAutorizar)
        modalConfirmarNoAutorizar.style.display = "none";
    });
  }

  if (btnConfirmarNoAutorizar) {
    btnConfirmarNoAutorizar.addEventListener("click", function () {
      //prueba
      //prueba
      //prueba
      //prueba
      //prueba

      window.obtenerUbicacionYIP();

      // Cerrar modal de confirmación y abrir el modalComentario para capturar el motivo
      if (modalConfirmarNoAutorizar)
        modalConfirmarNoAutorizar.style.display = "none";
      const modal = document.getElementById("modalComentario");
      if (modal) {
        modal.style.display = "flex";
        const ta = document.getElementById("comentarioNoAutorizar");
        if (ta) {
          ta.value = "";
          ta.focus();
        }
      }
    });
  }
})();


function llenarTablaResponsables(idPermiso) {
  /**
   * Función para llenar la tabla de responsables en el modal AST.
   * Consulta la API para obtener los responsables y sus datos,
   * y los muestra en una tabla dentro del modal.
   * Si no hay responsables, muestra un mensaje adecuado.
   * Mejora la trazabilidad y visualización de responsables en el permiso.
   */
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((response) => response.json())
    .then((result) => {
      const tbody = document.getElementById("modal-ast-responsable-body");
      if (!tbody) return;

      tbody.innerHTML = ""; // Limpia la tabla antes de llenarla

      function formatearFecha(fechaString) {
        if (!fechaString) return "Pendiente";
        // Si la fecha viene en formato SQL (YYYY-MM-DD HH:mm:ss), mostrar tal cual
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(fechaString)) {
          const [fecha, hora] = fechaString.split(" ");
          const [h, m] = hora.split(":");
          return `${fecha.replace(/-/g, "/")}, ${h}:${m}`;
        }
        // Si viene en formato ISO con Z (UTC), mostrar en UTC
        try {
          const fecha = new Date(fechaString);
          if (isNaN(fecha.getTime())) {
            return "Fecha inválida";
          }
          // Formatear en UTC
          const year = fecha.getUTCFullYear();
          const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
          const day = String(fecha.getUTCDate()).padStart(2, "0");
          const hour = String(fecha.getUTCHours()).padStart(2, "0");
          const minute = String(fecha.getUTCMinutes()).padStart(2, "0");
          return `${day}/${month}/${year}, ${hour}:${minute}`;
        } catch (error) {
          return "Error en fecha";
        }
      }

      if (result.success && result.data) {
        const data = result.data;
        const { ip_area, localizacion_area } = data;
        const filas = [
          {
            nombre: data.responsable_area,
            cargo: "Responsable de área",
            fecha: formatearFecha(data.fecha_hora_area),
          },
          {
            nombre: data.operador_area,
            cargo: "Operador del área",
            fecha: formatearFecha(data.fecha_hora_area),
          },
          {
            nombre: data.nombre_supervisor,
            cargo: "Supervisor de Seguridad",
            fecha: formatearFecha(data.fecha_hora_supervisor),
          },
        ];

        let hayResponsables = false;
        filas.forEach((fila) => {
          if (fila.nombre && fila.nombre.trim() !== "") {
            hayResponsables = true;
            const tr = document.createElement("tr");
            tr.innerHTML = `
  <td>${fila.nombre}</td>
  <td>${fila.cargo}</td>
  <td>
    ${fila.fecha || ""}<br>
     ${ip_area || "-"}<br>
     ${localizacion_area || "-"}
  </td>
  <td></td>
`;
            tbody.appendChild(tr);
          }
        });

        // Si alguna fila no tiene nombre, igual la mostramos con N/A
        filas.forEach((fila) => {
          if (!fila.nombre || fila.nombre.trim() === "") {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>N/A</td>
              <td>${fila.cargo}</td>
              <td></td>
            `;
            tbody.appendChild(tr);
          }
        });

        // Si no hay responsables, muestra mensaje
        if (!hayResponsables) {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
          tbody.appendChild(tr);
        }
      } else {
        // Si no hay datos, muestra mensaje
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
        tbody.appendChild(tr);
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}
