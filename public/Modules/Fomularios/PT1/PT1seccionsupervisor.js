

    let id_supervisor = null;
    try {
      const usuarioStr = localStorage.getItem("usuario");
      if (usuarioStr) {
        const usuarioObj = JSON.parse(usuarioStr);
        if (usuarioObj && usuarioObj.id) {
          id_supervisor = usuarioObj.id;
          console.log("[DEBUG] id_supervisor obtenido de localStorage:", id_supervisor);
        }
      }
    } catch (e) {
      console.warn("[DEBUG] No se pudo obtener id_supervisor de localStorage:", e);
    }



// Función para mostrar u ocultar el botón de validación según el estatus


async function mostrarBotonPorEstatus(idPermiso) {
  try {
    const resp = await fetch(`/api/estatus-solo/${idPermiso}`);
    if (!resp.ok) {
      console.error('[DEBUG] Error HTTP al consultar /estatus-solo:', resp.status);
      return;
    }
    const data = await resp.json();
    // El estatus puede venir como data.estatus, data.data.estatus, o data.data[0].estatus
    let estatus = data.estatus || (data.data && data.data.estatus) || (data.data && data.data[0] && data.data[0].estatus) || null;
    const btnGuardar = document.getElementById('btn-guardar-campos');
    console.log('[DEBUG] Valor de estatus recibido:', estatus);
    if (btnGuardar) {
      if (estatus === 'activo') {
        btnGuardar.style.display = '';
        console.log('[DEBUG] Botón mostrado (estatus == "activo")');
      } else {
        btnGuardar.style.display = 'none';
        console.log('[DEBUG] Botón oculto (estatus != "activo")');
      }
    } else {
      console.warn('[DEBUG] No se encontró el botón btn-guardar-campos en el DOM');
    }
  } catch (e) {
    console.error('[DEBUG] Error al consultar estatus-solo:', e);
  }
}
// Valida que ambos campos estén seleccionados antes de autorizar


// Ejecutar consulta automática al cargar si hay id en la URL
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    // Esperar a que el botón esté en el DOM antes de consultar el estatus
    function esperarYMostrarBoton(retries = 20) {
      const btnGuardar = document.getElementById('btn-guardar-campos');
      if (btnGuardar) {
        mostrarBotonPorEstatus(idPermiso);
      } else if (retries > 0) {
        setTimeout(() => esperarYMostrarBoton(retries - 1), 150);
      } else {
        console.warn('[DEBUG] No se encontró el botón btn-guardar-campos tras esperar');
      }
    }
    esperarYMostrarBoton();
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
    { id: "permiso-altura", valor: data.columna_altura_valor, nombre: "Permiso de Altura" },
    { id: "permiso-confinado", valor: data.columna_confinado_valor, nombre: "Permiso Espacio Confinado" },
    { id: "permiso-fuego", valor: data.columna_fuego_valor, nombre: "Permiso de Fuego" },
    { id: "permiso-apertura", valor: data.columna_apertura_valor, nombre: "Permiso de Apertura" },
    { id: "permiso-nopeligroso", valor: data.columna_nopeligrosovalor_valor, nombre: "Permiso No Peligroso" },
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



        const pno_cr_1 = document.getElementById("pno_cr_1");
if(pno_cr_1) pno_cr_1.textContent = d.pno_cr_1 || "-";
const pno_cr_2 = document.getElementById("pno_cr_2");
if(pno_cr_2) pno_cr_2.textContent = d.pno_cr_2 || "-";
const pno_cr_3 = document.getElementById("pno_cr_3");
if(pno_cr_3) pno_cr_3.textContent = d.pno_cr_3 || "-";
const pno_cr_4 = document.getElementById("pno_cr_4");
if(pno_cr_4) pno_cr_4.textContent = d.pno_cr_4 || "-";
const pno_cr_5 = document.getElementById("pno_cr_5");
if(pno_cr_5) pno_cr_5.textContent = d.pno_cr_5 || "-";
const pno_cr_6 = document.getElementById("pno_cr_6");
if(pno_cr_6) pno_cr_6.textContent = d.pno_cr_6 || "-";
const pno_cr_7 = document.getElementById("pno_cr_7");
if(pno_cr_7) pno_cr_7.textContent = d.pno_cr_7 || "-";
const pno_cr_8 = document.getElementById("pno_cr_8");
if(pno_cr_8) pno_cr_8.textContent = d.pno_cr_8 || "-";
const pno_cr_9 = document.getElementById("pno_cr_9");
if(pno_cr_9) pno_cr_9.textContent = d.pno_cr_9 || "-";
const pno_cr_10 = document.getElementById("pno_cr_10");
if(pno_cr_10) pno_cr_10.textContent = d.pno_cr_10 || "-";
const pno_cr_11 = document.getElementById("pno_cr_11");
if(pno_cr_11) pno_cr_11.textContent = d.pno_cr_11 || "-";
const pno_cr_12 = document.getElementById("pno_cr_12");
if(pno_cr_12) pno_cr_12.textContent = d.pno_cr_12 || "-";
const pno_cr_13 = document.getElementById("pno_cr_13");
if(pno_cr_13) pno_cr_13.textContent = d.pno_cr_13 || "-";

const pno_epe_1 = document.getElementById("pno_epe_1");
if(pno_epe_1) pno_epe_1.textContent = d.pno_epe_1 || "-";
const pno_epe_2 = document.getElementById("pno_epe_2");
if(pno_epe_2) pno_epe_2.textContent = d.pno_epe_2 || "-";
const pno_epe_3 = document.getElementById("pno_epe_3");
if(pno_epe_3) pno_epe_3.textContent = d.pno_epe_3 || "-";
const pno_epe_4 = document.getElementById("pno_epe_4");
if(pno_epe_4) pno_epe_4.textContent = d.pno_epe_4 || "-";
const pno_epe_5 = document.getElementById("pno_epe_5");
if(pno_epe_5) pno_epe_5.textContent = d.pno_epe_5 || "-";
const pno_epe_6 = document.getElementById("pno_epe_6");
if(pno_epe_6) pno_epe_6.textContent = d.pno_epe_6 || "-";
const pno_epe_7 = document.getElementById("pno_epe_7");
if(pno_epe_7) pno_epe_7.textContent = d.pno_epe_7 || "-";
const pno_epe_8 = document.getElementById("pno_epe_8");
if(pno_epe_8) pno_epe_8.textContent = d.pno_epe_8 || "-";
const pno_epe_9 = document.getElementById("pno_epe_9");
if(pno_epe_9) pno_epe_9.textContent = d.pno_epe_9 || "-";






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
  // Los listeners del modal se manejan en setupModalComentario()
  const btnCancelarComentario = document.getElementById(
    "btnCancelarComentario"
  );
  if (btnCancelarComentario) {
    btnCancelarComentario.addEventListener("click", function () {
      document.getElementById("modalComentario").style.display = "none";
      document.getElementById("comentarioNoAutorizar").value = "";
    });
  }
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
  // Cerrar modal de firma al hacer clic en Cancelar
  const btnCancelarFirma = document.getElementById("btnAgregarFirmaCancelar");
  if (btnCancelarFirma) {
    btnCancelarFirma.addEventListener("click", function () {
      const modalFirma = document.getElementById("modalAgregarFirma");
      if (modalFirma) modalFirma.style.display = "none";
    });
  }
  // Inicializa los listeners del modal de comentarios al cargar la página
  setupModalComentario();
  // --- Lógica para el botón "Autorizar" ---
  const btnAutorizar = document.getElementById("btn-guardar-campos");
  if (btnAutorizar) {
    // Función que ejecuta la autorización real (guardada aquí para llamarla desde el modal)




    
    // --- INICIO FUNCIÓN QUE EJECUTA LA AUTORIZACIÓN DEL SUPERVISOR ---

    async function ejecutarAutorizacionSupervisor() {

      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";
      // Obtener el id del supervisor desde localStorage
      let usuario_supervisor = null;
      try {
        const usuarioStr = localStorage.getItem("usuario");
        if (usuarioStr) {
          const usuarioObj = JSON.parse(usuarioStr);
          if (usuarioObj && usuarioObj.id) {
            usuario_supervisor = usuarioObj.id;
          }
        }
      } catch (e) {
        console.warn("[DEBUG] No se pudo obtener usuario_supervisor de localStorage:", e);
      }

      // Obtener IP y localización del supervisor, lógica especial para PC/móvil
      let ip_supervisor = "";
      let localizacion_supervisor = "";
      let dispositivo_supervisor = "";
      if (window.obtenerUbicacionYIP) {
        try {
          const ubic = await window.obtenerUbicacionYIP();
          console.log("[DEBUG] Resultado de window.obtenerUbicacionYIP():", ubic);
          ip_supervisor = ubic.ip || "";
          dispositivo_supervisor = ubic.dispositivo || "";
          // Si el dispositivo es PC, guardar string especial; si es móvil, guardar coordenadas reales
          if (ubic.dispositivo && typeof ubic.dispositivo === "string" && ubic.dispositivo.toLowerCase().includes("pc")) {
            localizacion_supervisor = "/";
          } else {
            localizacion_supervisor = ubic.localizacion || "";
          }
          console.log("[DEBUG] ip_supervisor:", ip_supervisor);
          console.log("[DEBUG] localizacion_supervisor:", localizacion_supervisor);
          console.log("[DEBUG] dispositivo_supervisor:", dispositivo_supervisor);
        } catch (e) {
          console.error("[DEBUG] Error al obtener IP y localización:", e);
        }
      } else {
        console.warn("[DEBUG] window.obtenerUbicacionYIP no está disponible");
      }

           // Obtener la firma del supervisor desde el input oculto y validar que no esté en blanco
      let firma_supervisor = "";
      const inputFirma = document.getElementById("outputBase64");
      if (inputFirma) {
        firma_supervisor = inputFirma.value;
      }
      // Validar que la firma no esté en blanco (canvas vacío)
      function isFirmaBlank() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return true;
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
      }
      if (!firma_supervisor || isFirmaBlank()) {
        alert('Por favor, firma antes de validar.');
        if (inputFirma) inputFirma.value = "";
        return;
      }


      // Mostrar valor de la firma en consola
      if (firma_supervisor) {
        console.log("[DEBUG] Valor de firma (Base64):", firma_supervisor);
        if (firma_supervisor.startsWith("data:image")) {
          const base64Solo = firma_supervisor.split(",")[1];
          console.log("[DEBUG] Solo Base64:", base64Solo);
        }
      } else {
        console.warn("[DEBUG] No se encontró firma para enviar");
      }

      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      try {
        const nowSupervisor = new Date();
        const fechaHoraAutorizacionSupervisor = new Date(
          nowSupervisor.getTime() - nowSupervisor.getTimezoneOffset() * 60000
        ).toISOString();

        // Log de los datos que se enviarán al backend
        console.log("[DEBUG] Datos enviados a /api/autorizaciones/supervisor-categoria:", {
          id_permiso: idPermiso,
          supervisor,
          categoria,
          fecha_hora_supervisor: fechaHoraAutorizacionSupervisor,
          ip_supervisor,
          localizacion_supervisor,
          dispositivo_supervisor,
          firma_supervisor,
          usuario_supervisor,
        });

        await fetch("/api/autorizaciones/supervisor-categoria", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            supervisor,
            categoria,
            fecha_hora_supervisor: fechaHoraAutorizacionSupervisor,
            ip_supervisor,
            localizacion_supervisor,
            dispositivo_supervisor,
            firma_supervisor,
            usuario_supervisor,
          }),
        });
      } catch (err) {
        console.error("Error al actualizar supervisor y categoría:", err);
      }

      // Consultar id_estatus
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/estatus/permiso/${idPermiso}`);
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
          await fetch("/api/estatus/seguridad", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
        } catch (err) {
          console.error("Error al actualizar estatus seguridad:", err);
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
        btnConfirm.onclick = function () {
          modal.style.display = "none";
          clearHandlers();
          // Mostrar el modal de firma antes de continuar
          const modalAgregarFirma = document.getElementById("modalAgregarFirma");
          if (modalAgregarFirma) {
            modalAgregarFirma.style.display = "flex";
          }
        };
      }

      // Listener para el botón Guardar y Continuar del modal de firma
      const btnGuardarFirma = document.getElementById("guardar");
      if (btnGuardarFirma) {
        btnGuardarFirma.onclick = async function () {
          // Guardar la firma en el input antes de autorizar
          const canvas = document.getElementById('canvas');
          const output = document.getElementById('outputBase64');
          if (canvas && output) {
            const dataURL = canvas.toDataURL("image/png");
            output.value = dataURL;
            console.log('[FIRMA][PATCH] Se guardó en outputBase64:', output.value);
          } else {
            console.error('[FIRMA][PATCH] No se pudo guardar en outputBase64');
          }
          // Ocultar el modal de firma
          const modalAgregarFirma = document.getElementById("modalAgregarFirma");
          if (modalAgregarFirma) {
            modalAgregarFirma.style.display = "none";
          }
          // Ejecutar la autorización real
          try {
            if (typeof ejecutarAutorizacionSupervisor === "function") {
              await ejecutarAutorizacionSupervisor();
            }
          } catch (err) {
            console.error("Error al autorizar después de la firma:", err);
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

      // La lógica del modal de comentarios se maneja en setupModalComentario()
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
    // Prevenir múltiples cliques
    if (newBtnGuardar.disabled) return;
    newBtnGuardar.disabled = true;
    newBtnGuardar.textContent = "Procesando...";

    const comentario = textarea.value.trim();
    if (!comentario) {
      alert("Debes escribir un motivo de rechazo.");
      newBtnGuardar.disabled = false;
      newBtnGuardar.textContent = "Guardar";
      return;
    }

    // Obtener valores actuales de la página
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

    try {
      // 1. Actualizar supervisor y categoría en autorizaciones
      const nowRechazoSupervisor = new Date();
      const fechaHoraRechazoSupervisor = new Date(
        nowRechazoSupervisor.getTime() -
          nowRechazoSupervisor.getTimezoneOffset() * 60000
      ).toISOString();

      let dispositivo_supervisor = "";
      if (window.obtenerUbicacionYIP) {
        try {
          const ubic = await window.obtenerUbicacionYIP();
          dispositivo_supervisor = ubic.dispositivo || "";
        } catch (e) {
          console.error("[DEBUG] Error al obtener dispositivo para rechazo:", e);
        }
      }
      await fetch("/api/autorizaciones/supervisor-categoria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          supervisor,
          categoria,
          comentario_no_autorizar: comentario,
          fecha_hora_supervisor: fechaHoraRechazoSupervisor,
          dispositivo_supervisor,
        }),
      });

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

      // 3. Actualizar el estatus a "no autorizado" y guardar el comentario
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

      // 4. Cerrar el modal de comentario y mostrar modal de confirmación
      modal.style.display = "none";
      
      // Crear y mostrar modal de confirmación para rechazo
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
      // Rehabilitar el botón en caso de error
      newBtnGuardar.disabled = false;
      newBtnGuardar.textContent = "Guardar";
    }
  });
}


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
