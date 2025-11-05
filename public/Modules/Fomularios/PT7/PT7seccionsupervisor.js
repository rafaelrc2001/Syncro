// --- Lógica fusionada para guardar campos y autorizar ---
// Variables para fusión de datos (permiso específico y verformularios)
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
  setText(domId, val || "-");
}

function actualizarCamposFusionados() {
  // Campos que típicamente faltaban en la sección supervisor
  // Campos generales / sincronizados con la sección area
  aplicarCampoFusionado("prefijo-label", "prefijo", "prefijo", "prefijo");
  aplicarCampoFusionado(
    "maintenance-type-label",
    "tipo_mantenimiento",
    "tipo_mantenimiento",
    "tipo_mantenimiento"
  );
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
  // Equipo: mantener ambas etiquetas que se usan en plantillas
  aplicarCampoFusionado(
    "equipment-description-label",
    "descripcion_equipo",
    "descripcion_trabajo",
    "descripcion_trabajo"
  );
  aplicarCampoFusionado(
    "equipment-label",
    "descripcion_equipo",
    "equipo_intervenir",
    "equipo_intervenir"
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
  aplicarCampoFusionado("tag-label", "tag", "tag", "tag");
  setText(
    "otro_permiso-label",
    _verformulariosFetch.general.tipo_fuente_radiactiva || "-"
  );
  setText(
    "cual_otro_permiso-label",
    _verformulariosFetch.general.actividad_radiactiva || "-"
  );
  setText(
    "barricadas_senalamientos-label",
    _verformulariosFetch.general.numero_serial_fuente || "-"
  );
  setText(
    "suspension_trabajos_cercano-label",
    _verformulariosFetch.general.distancia_trabajo || "-"
  );
  setText(
    "retiro_personal_ajeno-label",
    _verformulariosFetch.general.tiempo_exposicion || "-"
  );
  setText(
    "placa_dosimetro-label",
    _verformulariosFetch.general.dosis_estimada || "-"
  );
  setText(
    "limite_exposicion-label",
    _verformulariosFetch.general.equipo_proteccion_radiologica || "-"
  );
  setText(
    "letreros_advertencia-label",
    _verformulariosFetch.general.dosimetros_personales || "-"
  );
  setText(
    "advirtio_personal-label",
    _verformulariosFetch.general.monitores_radiacion_area || "-"
  );
  setText(
    "ubicacion_fuente_radioactiva-label",
    _verformulariosFetch.general.senalizacion_area || "-"
  );
  setText(
    "numero_personas_autorizadas-label",
    _verformulariosFetch.general.barricadas || "-"
  );
  setText(
    "tiempo_exposicion_permisible-label",
    _verformulariosFetch.general.protocolo_emergencia || "-"
  );
  setText("fluid-label", _verformulariosFetch.general.fluido || "-");
  setText("pressure-label", _verformulariosFetch.general.presion || "-");
  setText("temperature-label", _verformulariosFetch.general.temperatura || "-");
}

// --- Lógica para el botón Autorizar (guardar identificación de la fuente y autorizar) ---
const btnGuardarCampos = document.getElementById("btn-guardar-campos");
const modalConfirmarAutorizar = document.getElementById(
  "modalConfirmarAutorizar"
);
const btnCancelarConfirmar = document.getElementById("btnCancelarConfirmar");
const btnConfirmarAutorizar = document.getElementById("btnConfirmarAutorizar");

if (btnGuardarCampos && modalConfirmarAutorizar) {
  btnGuardarCampos.addEventListener("click", function () {
    // Rellenar datos del modal
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get("id") || "-";
    document.getElementById("modal-permit-id").textContent = idPermiso;
    document.getElementById("modal-permit-type").textContent =
      _verformulariosFetch?.general?.tipo_permiso || "-";
    document.getElementById("modal-solicitante").textContent =
      _verformulariosFetch?.general?.solicitante || "-";
    document.getElementById("modal-departamento").textContent =
      _verformulariosFetch?.general?.departamento || "-";
    modalConfirmarAutorizar.style.display = "flex";
  });
}

if (btnCancelarConfirmar && modalConfirmarAutorizar) {
  btnCancelarConfirmar.addEventListener("click", function () {
    modalConfirmarAutorizar.style.display = "none";
  });
}

// Lógica de autorización solo si el usuario confirma
if (btnConfirmarAutorizar) {
  btnConfirmarAutorizar.addEventListener("click", async function () {
    if (modalConfirmarAutorizar) modalConfirmarAutorizar.style.display = "none";

    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get("id") || window.idPermisoActual;
    const supervisorInput = document.getElementById("responsable-aprobador");
    const categoriaInput = document.getElementById("responsable-aprobador2");
    const supervisor = supervisorInput ? supervisorInput.value.trim() : "";
    const categoria = categoriaInput ? categoriaInput.value.trim() : "";

    if (!idPermiso) {
      alert("No se pudo obtener el ID del permiso.");
      return;
    }
    if (!supervisor) {
      alert("Debes seleccionar el nombre del supervisor.");
      return;
    }

    try {
      // Actualizar estatus (usa el endpoint correcto de tu backend)
      let idEstatus = null;
      const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
      if (respEstatus.ok) {
        const permisoData = await respEstatus.json();
        idEstatus =
          (permisoData.data && permisoData.data.id_estatus) ||
          permisoData.id_estatus ||
          null;
      }

      if (idEstatus) {
        await fetch("/api/estatus/seguridad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus }),
        });
      }

      // Guardar autorización de área
      const nowArea = new Date();
      const fechaHoraAutorizacionArea = nowArea.toISOString();
      await fetch("/api/autorizaciones/area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          responsable_area: supervisor,
          encargado_area: categoria,
          fecha_hora_area: fechaHoraAutorizacionArea,
        }),
      });

      // Mostrar modal de confirmación y redirigir
      const confirmationModal = document.getElementById("confirmation-modal");
      if (confirmationModal) confirmationModal.style.display = "flex";
      const permitNumber = document.getElementById("generated-permit");
      if (permitNumber) permitNumber.textContent = idPermiso || "-";
      const modalClose = document.getElementById("modal-close-btn");
      if (modalClose) {
        modalClose.onclick = function () {
          if (confirmationModal) confirmationModal.style.display = "none";
          window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
        };
      } else {
        window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
      }
    } catch (err) {
      alert(
        "Error al autorizar el permiso. Revisa la consola para más detalles."
      );
      console.error("Error al autorizar el permiso:", err);
    }
  });
}

// --- Lógica para el botón "No Autorizar" (abrir modal) ---
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
    const modal = document.getElementById("modalComentario");
    if (modal) {
      modal.style.display = "flex";
      document.getElementById("comentarioNoAutorizar").value = "";
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
      if (!comentario || !idPermiso || !responsable_area) {
        return;
      }
      try {
        // Guardar comentario y responsable en la tabla de autorizaciones
        await fetch("/api/autorizaciones/area", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            responsable_area,
            encargado_area: operador_area,
            comentario_no_autorizar: comentario,
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
        } catch (err) {}
        // Actualizar el estatus a 'no autorizado' y guardar el comentario en la tabla estatus
        if (idEstatus) {
          try {
            const payloadEstatus = { id_estatus: idEstatus };
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
          } catch (err) {}
        }
        // Cerrar el modal y redirigir
        const modal = document.getElementById("modalComentario");
        if (modal) modal.style.display = "none";
        window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
      } catch (err) {}
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
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  });
}

// Obtener el id_permiso de la URL (ejemplo: ?id=123)
const params = new URLSearchParams(window.location.search);
const idPermiso = params.get("id");
if (idPermiso) {
  // --- NUEVA LÓGICA: SOLO CONSULTA /api/verformularios ---
  fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
    .then((resp) => resp.json())
    .then((dataVF) => {
      console.log("Respuesta completa de /api/verformularios:", dataVF);
      // Guardar para fusión de campos
      _verformulariosFetch = dataVF || {};
      // Campos generales
      if (dataVF && dataVF.general) {
        setText("prefijo-label", dataVF.general.prefijo || "-");
        setText(
          "maintenance-type-label",
          dataVF.general.tipo_mantenimiento ||
            dataVF.general.tipo_permiso ||
            "-"
        );
        setText("work-order-label", dataVF.general.ot_numero || "-");
        setText("tag-label", dataVF.general.tag || "-");
        setText("start-time-label", dataVF.general.hora_inicio || "-");
        setText(
          "descripcion-trabajo-label",
          dataVF.general.descripcion_trabajo || "-"
        );
        setText("empresa-label", dataVF.general.empresa || "-");
        setText(
          "nombre-solicitante-label",
          dataVF.general.solicitante || dataVF.general.nombre_solicitante || "-"
        );
        setText("sucursal-label", dataVF.general.sucursal || "-");
        setText("contrato-label", dataVF.general.contrato || "-");
        setText(
          "plant-label",
          dataVF.general.area || dataVF.general.departamento || "-"
        );
        setText(
          "fecha-label",
          dataVF.general.fecha || dataVF.general.fecha_creacion || "-"
        );
        setText(
          "otro_permiso-label",
          dataVF.general.tipo_fuente_radiactiva || "-"
        );
        setText(
          "cual_otro_permiso-label",
          dataVF.general.actividad_radiactiva || "-"
        );
        setText(
          "barricadas_senalamientos-label",
          dataVF.general.numero_serial_fuente || "-"
        );
        setText(
          "suspension_trabajos_cercano-label",
          dataVF.general.distancia_trabajo || "-"
        );
        setText(
          "retiro_personal_ajeno-label",
          dataVF.general.tiempo_exposicion || "-"
        );
        setText("placa_dosimetro-label", dataVF.general.dosis_estimada || "-");
        setText(
          "limite_exposicion-label",
          dataVF.general.equipo_proteccion_radiologica || "-"
        );
        setText(
          "letreros_advertencia-label",
          dataVF.general.dosimetros_personales || "-"
        );
        setText(
          "advirtio_personal-label",
          dataVF.general.monitores_radiacion_area || "-"
        );
        setText(
          "ubicacion_fuente_radioactiva-label",
          dataVF.general.senalizacion_area || "-"
        );
        setText(
          "numero_personas_autorizadas-label",
          dataVF.general.barricadas || "-"
        );
        setText(
          "tiempo_exposicion_permisible-label",
          dataVF.general.protocolo_emergencia || "-"
        );
        setText("fluid-label", dataVF.general.fluido || "-");
        setText("pressure-label", dataVF.general.presion || "-");
        setText("temperature-label", dataVF.general.temperatura || "-");
      }
      // Radios de requisitos (si existen en detalles)
      if (dataVF && dataVF.detalles) {
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
          if (dataVF.detalles[name]) {
            const radio = document.querySelector(
              `input[name='${name}'][value='${dataVF.detalles[name]}']`
            );
            if (radio) radio.checked = true;
          }
        });
      }

      if (dataVF && dataVF.responsables_area) {
        const selectSupervisor = document.getElementById(
          "responsable-aprobador"
        );
        const selectCategoria = document.getElementById(
          "responsable-aprobador2"
        );
        const supervisorStamp = document.getElementById("stamp-aprobador");
        const encargadoStamp = document.getElementById("stamp-encargado");
        if (selectSupervisor)
          selectSupervisor.value =
            dataVF.responsables_area.responsable_area || "";
        if (selectCategoria)
          selectCategoria.value = dataVF.responsables_area.operador_area || "";
        if (supervisorStamp)
          supervisorStamp.textContent =
            dataVF.responsables_area.responsable_area || "-";
        if (encargadoStamp)
          encargadoStamp.textContent =
            dataVF.responsables_area.operador_area || "-";
      }

      // AST y Participantes
      if (dataVF && dataVF.ast) {
        mostrarAST(dataVF.ast);
      } else {
        mostrarAST({});
      }
      if (dataVF && dataVF.actividades_ast) {
        mostrarActividadesAST(dataVF.actividades_ast);
      } else {
        mostrarActividadesAST([]);
      }
      if (dataVF && dataVF.participantes_ast) {
        mostrarParticipantesAST(dataVF.participantes_ast);
      } else {
        mostrarParticipantesAST([]);
      }
      // Actualizar campos fusionados
      try {
        actualizarCamposFusionados();
      } catch (e) {
        console.warn("actualizarCamposFusionados falló (verformularios):", e);
      }
    })
    .catch((err) => {
      console.error("Error al obtener datos de /api/verformularios:", err);
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

document.addEventListener("DOMContentLoaded", function () {
  // Leer el id del permiso de la URL (se usa para consultar autorizaciones)
  const params2 = new URLSearchParams(window.location.search);
  const idPermiso2 = params2.get("id");

  // Llenar selects de supervisor y categoría y luego pre-seleccionar los valores
  // guardados en /api/autorizaciones/personas/:id (si existen)
  rellenarSupervisoresYCategorias();

  function rellenarSupervisoresYCategorias() {
    fetch("/api/supervisores")
      .then((resp) => resp.json())
      .then((data) => {
        const selectSupervisor = document.getElementById(
          "responsable-aprobador"
        );
        if (selectSupervisor) {
          selectSupervisor.innerHTML = "<option value=''>Selecciona</option>";
          data.forEach((s) => {
            selectSupervisor.innerHTML += `<option value="${s.nombre}">${s.nombre}</option>`;
          });
        }
      });

    fetch("/api/categorias")
      .then((resp) => resp.json())
      .then((data) => {
        const selectCategoria = document.getElementById(
          "responsable-aprobador2"
        );
        if (selectCategoria) {
          selectCategoria.innerHTML = "<option value=''>Selecciona</option>";
          data.forEach((c) => {
            selectCategoria.innerHTML += `<option value="${c.nombre}">${c.nombre}</option>`;
          });
        }
      });
  }
  // Guardar requisitos
  const btnGuardar = document.getElementById("btn-guardar-requisitos");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", async function () {
      // ...existing code...
    });
  }

  // Salir: redirigir a AutorizarPT.html
  const btnSalirNuevo = document.getElementById("btn-salir-nuevo");

  // (verformularios ya se consulta cuando se carga el permiso específico más arriba)
});

// Salir: redirigir a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function () {
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  });
}
