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
}

// --- Lógica para el botón Autorizar (guardar identificación de la fuente y autorizar) ---
const btnGuardarCampos = document.getElementById("btn-guardar-campos");
if (btnGuardarCampos) {
  btnGuardarCampos.addEventListener("click", async function () {
    // 1. Obtener datos necesarios
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get("id") || window.idPermisoActual;
    const supervisorInput = document.getElementById("responsable-aprobador");
    const categoriaInput = document.getElementById("responsable-aprobador2");
    const supervisor = supervisorInput ? supervisorInput.value.trim() : "";
    const categoria = categoriaInput ? categoriaInput.value.trim() : "";

    // 2. Validaciones básicas
    if (!idPermiso) {
      alert("No se pudo obtener el ID del permiso.");
      return;
    }
    if (!supervisor) {
      alert("Debes seleccionar el nombre del supervisor.");
      return;
    }

    // 3. Guardar identificación de la fuente
    function getRadio(name) {
      const checked = document.querySelector(`input[name='${name}']:checked`);
      return checked ? checked.value : null;
    }
    function getInputValue(id) {
      const input = document.getElementById(id);
      return input ? input.value : null;
    }
    const payloadIdentificacion = {
      marca_modelo: getInputValue("marca_modelo"),
      marca_modelo_check: getRadio("marca_modelo_check"),
      tipo_isotopo: getInputValue("tipo_isotopo"),
      tipo_isotopo_check: getRadio("tipo_isotopo_check"),
      numero_fuente: getInputValue("numero_fuente"),
      numero_fuente_check: getRadio("numero_fuente_check"),
      actividad_fuente: getInputValue("actividad_fuente"),
      actividad_fuente_check: getRadio("actividad_fuente_check"),
      fecha_dia: getInputValue("fecha_dia"),
      fecha_mes: getInputValue("fecha_mes"),
      fecha_anio: getInputValue("fecha_anio"),
    };
    try {
      const resp = await fetch(
        `/api/radiactivas/identificacion_fuente/${idPermiso}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadIdentificacion),
        }
      );
      if (!resp.ok)
        throw new Error("Error al guardar la identificación de la fuente");
    } catch (err) {
      alert(
        "Error al guardar la identificación de la fuente. No se puede autorizar."
      );
      console.error("Error al guardar identificación de la fuente:", err);
      return;
    }

    // 4. Autorizar: actualizar supervisor/categoría y estatus
    try {
      // Actualizar supervisor y categoría
      await fetch(
        "/api/autorizaciones/supervisor-categoria",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            supervisor,
            categoria,
            fecha_hora_supervisor: new Date().toISOString(),
          }),
        }
      );

      // Consultar id_estatus
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

      // Actualizar estatus a "activo"
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

      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    } catch (err) {
      alert(
        "Error al autorizar el permiso. Revisa la consola para más detalles."
      );
      console.error("[DEPURACIÓN] Error al autorizar el permiso:", err);
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
          const respEstatus = await fetch(
            `/api/permisos-trabajo/${idPermiso}`
          );
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
        window.location.href = "/Modules/Usuario/AutorizarPT.html";
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
        // Guardar permiso en caché para fusión
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
        // Mostrar valores de requisitos de apertura de área (solo lectura)
        setText("otro_permiso-label", permiso.tipo_fuente_radiactiva || "-");
        setText("cual_otro_permiso-label", permiso.actividad_radiactiva || "-");
        setText(
          "barricadas_senalamientos-label",
          permiso.numero_serial_fuente || "-"
        );
        setText(
          "suspension_trabajos_cercano-label",
          permiso.distancia_trabajo || "-"
        );
        setText(
          "retiro_personal_ajeno-label",
          permiso.tiempo_exposicion || "-"
        );
        setText("placa_dosimetro-label", permiso.dosis_estimada || "-");
        setText(
          "limite_exposicion-label",
          permiso.equipo_proteccion_radiologica || "-"
        );
        setText(
          "letreros_advertencia-label",
          permiso.dosimetros_personales || "-"
        );
        setText(
          "advirtio_personal-label",
          permiso.monitores_radiacion_area || "-"
        );
        setText(
          "ubicacion_fuente_radioactiva-label",
          permiso.senalizacion_area || "-"
        );
        setText("numero_personas_autorizadas-label", permiso.barricadas || "-");
        setText(
          "tiempo_exposicion_permisible-label",
          permiso.protocolo_emergencia || "-"
        );

        // Mostrar valores de condiciones del proceso (solo lectura)
        setText("fluid-label", permiso.fluido || "-");
        setText("pressure-label", permiso.presion || "-");
        setText("temperature-label", permiso.temperatura || "-");
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
          console.warn("actualizarCamposFusionados falló (permiso):", e);
        }
        // Intentar traer verformularios para completar datos generales (si aplica)
        fetch(
          `/api/verformularios?id=${encodeURIComponent(
            idPermiso
          )}`
        )
          .then((r) => r.json())
          .then((vf) => {
            _verformulariosFetch = vf || {};
            try {
              actualizarCamposFusionados();
            } catch (e) {
              console.warn(
                "actualizarCamposFusionados falló (verformularios):",
                e
              );
            }
          })
          .catch((err) => {
            console.warn("No se pudo obtener verformularios para fusión:", err);
          });
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
  // Leer el id del permiso de la URL (se usa para consultar autorizaciones)
  const params2 = new URLSearchParams(window.location.search);
  const idPermiso2 = params2.get("id");

  // Llenar selects de supervisor y categoría y luego pre-seleccionar los valores
  // guardados en /api/autorizaciones/personas/:id (si existen)
  rellenarSupervisoresYCategorias();

  async function rellenarSupervisoresYCategorias() {
    try {
      // Traer supervisores
      const respSup = await fetch("/api/supervisores");
      const supData = await respSup.json();
      const selectSupervisor = document.getElementById("responsable-aprobador");
      if (selectSupervisor) {
        selectSupervisor.innerHTML =
          '<option value="" disabled selected>Seleccione un supervisor...</option>';
        (Array.isArray(supData) ? supData : supData.supervisores).forEach(
          (sup) => {
            const option = document.createElement("option");
            option.value = sup.nombre || sup.id;
            option.textContent = sup.nombre;
            selectSupervisor.appendChild(option);
          }
        );
      }

      // Traer categorias
      const respCat = await fetch("/api/categorias");
      const catData = await respCat.json();
      const selectCategoria = document.getElementById("responsable-aprobador2");
      if (selectCategoria) {
        selectCategoria.innerHTML =
          '<option value="" disabled selected>Seleccione una categoría...</option>';
        (Array.isArray(catData) ? catData : catData.categorias).forEach(
          (cat) => {
            const option = document.createElement("option");
            option.value = cat.nombre || cat.id;
            option.textContent = cat.nombre;
            selectCategoria.appendChild(option);
          }
        );
      }

      // Si existe idPermiso, traer responsables guardados y setear stamps y selects
      if (idPermiso2) {
        try {
          const respPers = await fetch(
            `/api/autorizaciones/personas/${idPermiso2}`
          );
          const persData = await respPers.json();
          if (persData && persData.success && persData.data) {
            const supervisorName = persData.data.responsable_area;
            const operadorName = persData.data.operador_area;
            const supervisorStamp = document.getElementById("stamp-aprobador");
            if (supervisorStamp)
              supervisorStamp.textContent = supervisorName || "-";
            const encargadoStamp = document.getElementById("stamp-encargado");
            if (encargadoStamp)
              encargadoStamp.textContent = operadorName || "-";

            // Pre-seleccionar en los selects si existe la opción correspondiente
            if (selectSupervisor && supervisorName) {
              const opt = Array.from(selectSupervisor.options).find(
                (o) =>
                  o.value === supervisorName || o.textContent === supervisorName
              );
              if (opt) selectSupervisor.value = opt.value;
            }
            if (selectCategoria && operadorName) {
              const opt2 = Array.from(selectCategoria.options).find(
                (o) =>
                  o.value === operadorName || o.textContent === operadorName
              );
              if (opt2) selectCategoria.value = opt2.value;
            }
          }
        } catch (err) {
          console.warn(
            "No se pudo obtener autorizaciones/personas para preseleccionar:",
            err
          );
        }
      }
    } catch (err) {
      console.error("Error al rellenar supervisores/categorias:", err);
    }
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
          `/api/pt-radiacion/requisitos_area/${idPermiso}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        console.log("[PT7-SUP] payload (guardar requisitos):", payload);
        let respJson = {};
        try {
          respJson = await resp.json();
        } catch (e) {
          console.warn(
            "[PT7-SUP] no JSON en respuesta al guardar requisitos",
            e
          );
        }
        console.log(
          "[PT7-SUP] respuesta guardar requisitos:",
          resp.status,
          respJson
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
  // (verformularios ya se consulta cuando se carga el permiso específico más arriba)
});

// Salir: redirigir a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function () {
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  });
}
