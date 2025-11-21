// --- Lógica fusionada para guardar campos y autorizar ---
// Variables para fusión de fuentes (permiso específico y verformularios)
let _permisoFetch = null;
let _verformulariosFetch = null;

// Helper: aplica valor según prioridad: permiso > verformularios.data > verformularios.general
function aplicarCampoFusionado(
  domId,
  propPermiso,
  propVerData,
  propVerGeneral
) {
  let val = null;
  if (
    _permisoFetch &&
    _permisoFetch[propPermiso] !== undefined &&
    _permisoFetch[propPermiso] !== null &&
    _permisoFetch[propPermiso] !== ""
  ) {
    val = _permisoFetch[propPermiso];
  } else if (
    _verformulariosFetch &&
    _verformulariosFetch.data &&
    _verformulariosFetch.data[propVerData] !== undefined &&
    _verformulariosFetch.data[propVerData] !== null &&
    _verformulariosFetch.data[propVerData] !== ""
  ) {
    val = _verformulariosFetch.data[propVerData];
  } else if (
    _verformulariosFetch &&
    _verformulariosFetch.general &&
    _verformulariosFetch.general[propVerGeneral] !== undefined &&
    _verformulariosFetch.general[propVerGeneral] !== null &&
    _verformulariosFetch.general[propVerGeneral] !== ""
  ) {
    val = _verformulariosFetch.general[propVerGeneral];
  }
  // Usar la utilidad setText (declarada más abajo en el archivo)
  setText(domId, val || "-");
}

function actualizarCamposFusionados() {
  // Campos generales
  aplicarCampoFusionado("prefijo-label", "prefijo", "prefijo", "prefijo");
  aplicarCampoFusionado(
    "start-time-label",
    "hora_inicio",
    "hora_inicio",
    "hora_inicio"
  );
  aplicarCampoFusionado("fecha-label", "fecha", "fecha", "fecha");
  aplicarCampoFusionado(
    "activity-type-label",
    "tipo_mantenimiento",
    "tipo_mantenimiento",
    "tipo_mantenimiento"
  );
  aplicarCampoFusionado("plant-label", "area", "area", "area");
  // descripción/descripcion_equipo/descripcion_trabajo
  aplicarCampoFusionado(
    "descripcion-trabajo-label",
    "descripcion_equipo",
    "descripcion_trabajo",
    "descripcion_trabajo"
  );
  aplicarCampoFusionado("empresa-label", "empresa", "empresa", "empresa");
  aplicarCampoFusionado(
    "nombre-solicitante-label",
    "solicitante",
    "solicitante",
    "solicitante"
  );
  aplicarCampoFusionado("sucursal-label", "sucursal", "sucursal", "sucursal");
  aplicarCampoFusionado("contrato-label", "contrato", "contrato", "contrato");
  aplicarCampoFusionado(
    "work-order-label",
    "ot_numero",
    "ot_numero",
    "ot_numero"
  );
  aplicarCampoFusionado(
    "equipment-label",
    "descripcion_equipo",
    "equipo_intervenir",
    "equipo_intervenir"
  );
  aplicarCampoFusionado("tag-label", "tag", "tag", "tag");
}

const btnGuardarCampos = document.getElementById("btn-guardar-campos");
if (btnGuardarCampos) {
  btnGuardarCampos.addEventListener("click", function (e) {
    e.preventDefault();
    // Rellenar los datos del modal si quieres
    const modalConfirmarAutorizar = document.getElementById(
      "modalConfirmarAutorizar"
    );
    if (modalConfirmarAutorizar) {
      // Ejemplo para rellenar campos del modal:
      document.getElementById("modal-permit-id").textContent =
        document.getElementById("prefijo-label")?.textContent?.trim() || "-";
      document.getElementById("modal-permit-type").textContent =
        document.getElementById("activity-type-label")?.textContent || "-";
      document.getElementById("modal-solicitante").textContent =
        document.getElementById("nombre-solicitante-label")?.textContent || "-";
      document.getElementById("modal-departamento").textContent =
        document.getElementById("plant-label")?.textContent || "-";
      modalConfirmarAutorizar.style.display = "flex";
    }
  });
}

const btnConfirmarAutorizar = document.getElementById("btnConfirmarAutorizar");
if (btnConfirmarAutorizar) {
  btnConfirmarAutorizar.addEventListener("click", async function () {
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
    function getRadio(name) {
      const checked = document.querySelector(`input[name='${name}']:checked`);
      return checked ? checked.value : null;
    }
    function getInput(name) {
      const el = document.querySelector(`[name='${name}']`);
      return el ? el.value : null;
    }

    // Construir payload con los campos que espera el backend (PT7)
    const payload = {
      tipo_fuente_radiactiva: getRadio("otro_permiso"),
      actividad_radiactiva: getInput("cual_otro_permiso"),
      numero_serial_fuente: getRadio("barricadas_senalamientos"),
      distancia_trabajo: getRadio("suspension_trabajos_cercano"),
      tiempo_exposicion: getRadio("retiro_personal_ajeno"),
      dosis_estimada: getRadio("placa_dosimetro"),
      equipo_proteccion_radiologica: getRadio("limite_exposicion"),
      dosimetros_personales: getRadio("letreros_advertencia"),
      monitores_radiacion_area: getRadio("advirtio_personal"),
      senalizacion_area: getInput("ubicacion_fuente_radioactiva"),
      barricadas: getInput("numero_personas_autorizadas"),
      protocolo_emergencia: getInput("tiempo_exposicion_permisible"),
      personal_autorizado: "", // Si tienes un campo para esto, cámbialo
      observaciones_radiacion: "", // Si tienes un campo para esto, cámbialo
      fluido: document.getElementById("fluid")?.value || "",
      presion: document.getElementById("pressure")?.value || "",
      temperatura: document.getElementById("temperature")?.value || "",
    };

    try {
      const resp = await fetch(
        `/api/pt-radiacion/requisitos_area/${idPermiso}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!resp.ok) throw new Error("Error al guardar los requisitos");
    } catch (err) {
      alert("Error al guardar los campos/requisitos. No se puede autorizar.");
      console.error("Error al guardar requisitos:", err);
      return;
    }

    // 4. Autorizar (igual que PT5/PT6)
    try {
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
        console.error("[DEPURACIÓN] Error al consultar id_estatus:", err);
      }

      if (idEstatus) {
        try {
          const payloadEstatus = { id_estatus: idEstatus };
          const respEstatus = await fetch("/api/estatus/seguridad", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadEstatus),
          });
          let data = {};
          try {
            data = await respEstatus.json();
          } catch (e) {}
          if (!respEstatus.ok)
            console.error(
              "[DEPURACIÓN] Error en respuesta de estatus/seguridad:",
              data
            );
        } catch (err) {
          console.error(
            "[DEPURACIÓN] Excepción al actualizar estatus de seguridad:",
            err
          );
        }
      } else {
        console.warn(
          "[DEPURACIÓN] No se obtuvo id_estatus para actualizar estatus."
        );
      }

      // Generar timestamp para autorización
      const nowArea = new Date();
      const year = nowArea.getFullYear();
      const month = String(nowArea.getMonth() + 1).padStart(2, "0");
      const day = String(nowArea.getDate()).padStart(2, "0");
      const hours = String(nowArea.getHours()).padStart(2, "0");
      const minutes = String(nowArea.getMinutes()).padStart(2, "0");
      const seconds = String(nowArea.getSeconds()).padStart(2, "0");
      const milliseconds = String(nowArea.getMilliseconds()).padStart(3, "0");
      const fechaHoraAutorizacionArea = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

      await fetch("/api/autorizaciones/area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          responsable_area,
          encargado_area: operador_area,
          fecha_hora_area: fechaHoraAutorizacionArea,
        }),
      });

      // Mostrar modal de confirmación y número de permiso
      const confirmationModal = document.getElementById("confirmation-modal");
      if (confirmationModal) {
        confirmationModal.style.display = "flex";
      }
      const permitNumber = document.getElementById("generated-permit");
      const displayedPrefijo =
        document.getElementById("prefijo-label")?.textContent?.trim() ||
        window.currentPermisoData?.general?.prefijo ||
        idPermiso;
      if (permitNumber) {
        permitNumber.textContent = displayedPrefijo || "-";
      }

      // El cierre del modal hará la redirección
      const modalClose = document.getElementById("modal-close-btn");
      if (modalClose) {
        modalClose.onclick = function () {
          window.location.href = "/Modules/Usuario/AutorizarPT.html";
        };
      } else {
        window.location.href = "/Modules/Usuario/AutorizarPT.html";
      }
    } catch (err) {
      alert(
        "Error al autorizar el permiso. Revisa la consola para más detalles."
      );
      console.error(
        "[DEPURACIÓN] Error al insertar autorización de área:",
        err
      );
    }
  });
}

const btnCancelarConfirmar = document.getElementById("btnCancelarConfirmar");
if (btnCancelarConfirmar) {
  btnCancelarConfirmar.addEventListener("click", function () {
    const modal = document.getElementById("modalConfirmarAutorizar");
    if (modal) modal.style.display = "none";
  });
}

// Helper: obtener campo del permiso cargado en memoria (window.currentPermisoData)
function getPermisoValue(candidatePaths) {
  const root = window.currentPermisoData || {};
  for (const path of candidatePaths) {
    const parts = path.split('.');
    let cur = root;
    for (const p of parts) {
      if (cur == null) return null;
      cur = cur[p];
    }
    if (cur != null && cur !== "" && cur !== "-") return cur;
  }
  return null;
}

// --- Lógica para el botón "No Autorizar" (abrir modal de confirmación primero) ---
const btnNoAutorizar = document.getElementById("btn-no-autorizar");
if (btnNoAutorizar) {
  btnNoAutorizar.addEventListener("click", function () {
    const responsableInput = document.getElementById("responsable-aprobador");
    const responsable_area = responsableInput ? responsableInput.value.trim() : "";
    if (!responsable_area) {
      alert("Debes ingresar el nombre del responsable antes de rechazar.");
      return;
    }
    
    // Rellenar modal de confirmación de no autorización si existen campos
    const modalConfirmNo = document.getElementById("modalConfirmarNoAutorizar");
    if (modalConfirmNo) {
      try {
        const params = new URLSearchParams(window.location.search);
        const idPermiso = params.get("id") || window.idPermisoActual;
        const modalIdEl = document.getElementById("modal-permit-id-no");
        const modalTypeElNo = document.getElementById("modal-permit-type-no");
        const modalSolicitanteEl = document.getElementById("modal-solicitante-no");
        const modalDepartamentoEl = document.getElementById("modal-departamento-no");
        
        // Mostrar prefijo (si existe) como identificador legible; si no usar id numérico
        const prefijoValueNo = getPermisoValue(["general.prefijo", "data.prefijo", "prefijo"]) || 
                               document.getElementById("prefijo-label")?.textContent?.trim();
        if (modalIdEl) modalIdEl.textContent = prefijoValueNo || idPermiso || "-";
        
        // Tipo y solicitante: primero intentar desde currentPermisoData
        const tipoNo = getPermisoValue(["data.tipo_permiso", "general.tipo_permiso", "data.tipo_mantenimiento", "general.tipo_mantenimiento", "tipo_permiso", "tipo_mantenimiento"]) || 
                      document.getElementById("activity-type-label")?.textContent || "-";
        if (modalTypeElNo) modalTypeElNo.textContent = tipoNo;
        
        const solicitante = getPermisoValue(["data.nombre_solicitante", "general.solicitante"]) || 
                           document.getElementById("nombre-solicitante-label")?.textContent || "-";
        if (modalSolicitanteEl) modalSolicitanteEl.textContent = solicitante;
        
        // Obtener departamento preferente: departamento > planta > sucursal (evitar usar sucursal si hay departamento)
        const departamentoFromDataNo = getPermisoValue(["data.departamento", "general.departamento", "data.planta", "general.area"]);
        let departamento = departamentoFromDataNo || document.getElementById("departamento-label")?.textContent;
        if (!departamento || departamento === "-") departamento = document.getElementById("plant-label")?.textContent;
        if (!departamento || departamento === "-") departamento = document.getElementById("sucursal-label")?.textContent;
        departamento = departamento || "-";
        if (modalDepartamentoEl) modalDepartamentoEl.textContent = departamento;
      } catch (e) {
        console.warn("No se pudieron rellenar todos los campos del modal de no autorizar:", e);
      }
      modalConfirmNo.style.display = "flex";
    } else {
      // Fallback: abrir directamente el modalComentario
      const modal = document.getElementById("modalComentario");
      if (modal) {
        modal.style.display = "flex";
        document.getElementById("comentarioNoAutorizar").value = "";
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

  // Handlers para el modal de confirmación 'No Autorizar'
  const btnCancelarConfirmarNo = document.getElementById("btnCancelarConfirmarNo");
  const btnConfirmarNoAutorizar = document.getElementById("btnConfirmarNoAutorizar");
  if (btnCancelarConfirmarNo) {
    btnCancelarConfirmarNo.addEventListener("click", function () {
      const noConfirm = document.getElementById("modalConfirmarNoAutorizar");
      if (noConfirm) noConfirm.style.display = "none";
    });
  }
  if (btnConfirmarNoAutorizar) {
    btnConfirmarNoAutorizar.addEventListener("click", function () {
      // Cerrar modal de confirmación y abrir modalComentario para capturar motivo
      const noConfirm = document.getElementById("modalConfirmarNoAutorizar");
      if (noConfirm) noConfirm.style.display = "none";
      
      const modalComentario = document.getElementById("modalComentario");
      if (modalComentario) {
        modalComentario.style.display = "flex";
        document.getElementById("comentarioNoAutorizar").value = "";
      }
    });
  }

  // Lógica para guardar el comentario y actualizar estatus a No Autorizado
  const btnGuardarComentario = document.getElementById("btnGuardarComentario");
  if (btnGuardarComentario) {
    btnGuardarComentario.addEventListener("click", async function () {
      const comentario = document.getElementById("comentarioNoAutorizar").value.trim();
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const responsable_area = responsableInput ? responsableInput.value.trim() : "";
      const operador_area = operadorInput ? operadorInput.value.trim() : "";
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      
      if (!comentario) {
        alert("Debes escribir un motivo del rechazo.");
        return;
      }
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!responsable_area) {
        alert("Debes ingresar el nombre del responsable.");
        return;
      }
      
      try {
        // Generar timestamp para autorización
        const nowArea = new Date();
        const year = nowArea.getFullYear();
        const month = String(nowArea.getMonth() + 1).padStart(2, "0");
        const day = String(nowArea.getDate()).padStart(2, "0");
        const hours = String(nowArea.getHours()).padStart(2, "0");
        const minutes = String(nowArea.getMinutes()).padStart(2, "0");
        const seconds = String(nowArea.getSeconds()).padStart(2, "0");
        const milliseconds = String(nowArea.getMilliseconds()).padStart(3, "0");
        const fechaHoraAutorizacionArea = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

        // Guardar comentario y responsable en la tabla de autorizaciones
        await fetch("/api/autorizaciones/area", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            responsable_area,
            encargado_area: operador_area,
            comentario_no_autorizar: comentario,
            fecha_hora_area: fechaHoraAutorizacionArea,
          }),
        });
        
        // Consultar el id_estatus desde permisos_trabajo
        let idEstatus = null;
        try {
          const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
          if (respEstatus.ok) {
            const permisoData = await respEstatus.json();
            idEstatus = permisoData.id_estatus || (permisoData.data && permisoData.data.id_estatus);
          }
        } catch (err) {
          console.error("[DEPURACIÓN] Error al consultar id_estatus para rechazo:", err);
        }
        
        // Actualizar el estatus a 'no autorizado' y guardar el comentario en la tabla estatus
        if (idEstatus) {
          try {
            const payloadEstatus = { id_estatus: idEstatus, supervisor: responsable_area };
            await fetch("/api/estatus/no_autorizado", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadEstatus),
            });
            
            // Guardar el comentario en la tabla estatus
            await fetch("/api/estatus/comentario", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_estatus: idEstatus, comentario }),
            });
          } catch (err) {
            console.error("[DEPURACIÓN] Error al actualizar estatus a no autorizado:", err);
          }
        }
        
        // Cerrar el modal y redirigir
        const modal = document.getElementById("modalComentario");
        if (modal) modal.style.display = "none";
        window.location.href = "/Modules/Usuario/AutorizarPT.html";
      } catch (err) {
        console.error("[DEPURACIÓN] Error en proceso de rechazo:", err);
        alert("Error al procesar el rechazo. Revisa la consola para más detalles.");
      }
    });
  }
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
    window.location.href = "/Modules/Usuario/AutorizarPT.html";
  });
}

// Obtener el id_permiso de la URL (ejemplo: ?id=123)
const params = new URLSearchParams(window.location.search);
const idPermiso = params.get("id");
if (idPermiso) {
  console.log("Consultando permiso de radiactivas con id:", idPermiso);
  fetch(`/api/pt-radiacion/${idPermiso}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Respuesta de la API:", data);
      if (data && data.success && data.data) {
        const permiso = data.data;
        console.log("Valores del permiso recibidos:", permiso);
        // Guardar permiso en cache para fusión de campos
        _permisoFetch = permiso;
        setText("maintenance-type-label", permiso.tipo_mantenimiento || "-");
        setText("work-order-label", permiso.ot_numero || "-");
        setText("tag-label", permiso.tag || "-");
        setText("start-time-label", permiso.hora_inicio || "-");
        //setText("has-equipment-label", permiso.tiene_equipo_intervenir || "-");
        setText(
          "equipment-description-label",
          permiso.descripcion_equipo || "-"
        );
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
        // Radios de requisitos
        const radios = [
          "fuera_operacion",
          "despresurizado_purgado",
          "necesita_aislamiento",
          "con_valvulas",
          "con_juntas_ciegas",
          "producto_entrampado",
          "requiere_lavado",
          "requiere_neutralizado",
          "requiere_vaporizado",
          "suspender_trabajos_adyacentes",
          "acordonar_area",
          "prueba_gas_toxico_inflamable",
          "equipo_electrico_desenergizado",
          "tapar_purgas_drenajes",
        ];
        radios.forEach((name) => {
          if (permiso[name]) {
            const radio = document.querySelector(
              `input[name='${name}'][value='${permiso[name]}']`
            );
            if (radio) radio.checked = true;
          }
        });
        // Actualizar campos fusionados (permiso > verformularios.data > verformularios.general)
        try {
          actualizarCamposFusionados();
        } catch (e) {
          console.warn("actualizarCamposFusionados falló:", e);
        }
      } else {
        alert(
          "No se encontraron datos para este permiso o la API no respondió correctamente."
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

// Utilidad para asignar texto
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.addEventListener("DOMContentLoaded", function () {
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
      // Construir payload
      const payload = {
        fuera_operacion: getRadio("fuera_operacion"),
        despresurizado_purgado: getRadio("despresurizado_purgado"),
        necesita_aislamiento: getRadio("necesita_aislamiento"),
        con_valvulas: getRadio("con_valvulas"),
        con_juntas_ciegas: getRadio("con_juntas_ciegas"),
        producto_entrampado: getRadio("producto_entrampado"),
        requiere_lavado: getRadio("requiere_lavado"),
        requiere_neutralizado: getRadio("requiere_neutralizado"),
        requiere_vaporizado: getRadio("requiere_vaporizado"),
        suspender_trabajos_adyacentes: getRadio(
          "suspender_trabajos_adyacentes"
        ),
        acordonar_area: getRadio("acordonar_area"),
        prueba_gas_toxico_inflamable: getRadio("prueba_gas_toxico_inflamable"),
        equipo_electrico_desenergizado: getRadio(
          "equipo_electrico_desenergizado"
        ),
        tapar_purgas_drenajes: getRadio("tapar_purgas_drenajes"),
      };
      try {
        const resp = await fetch(
          `/api/pt-radiativas/requisitos_area/${idPermiso}`,
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
        // Guardar verformularios para fusión de campos
        _verformulariosFetch = data || {};
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
              detalles.descripcion_equipo || "-";
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
          // ...agrega aquí más campos generales de PT2 si los tienes...
        }
        // Asegurar que si el endpoint trae contrato en general, se muestre
        if (data && data.general && data.general.contrato) {
          setText("contrato-label", data.general.contrato);
        }
        try {
          actualizarCamposFusionados();
        } catch (e) {
          console.warn("actualizarCamposFusionados falló (verformularios):", e);
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
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });
  }
});

// Salir: redirigir a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function () {
    window.location.href = "/Modules/Usuario/AutorizarPT.html";
  });
}
