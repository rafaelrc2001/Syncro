// --- Funciones de utilidad ---
function getRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (let r of radios) {
    if (r.checked) return r.value;
  }
  return "";
}

function getInputValue(name) {
  const byName = document.querySelector(`[name="${name}"]`);
  if (byName) return byName.value || "";
  const byId = document.getElementById(name);
  if (byId) {
    if (byId.value !== undefined) return byId.value || "";
    return byId.textContent || byId.innerText || "";
  }
  return "";
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

// Lógica para mostrar los datos en las etiquetas
function mostrarDatosSupervisor(permiso) {
  setText("prefijo-label", permiso.prefijo);
  setText("descripcion-trabajo-label", permiso.descripcion_trabajo);
  setText("maintenance-type-label", permiso.tipo_mantenimiento);
  setText("work-order-label", permiso.ot_numero);
  setText("tag-label", permiso.tag);
  setText("start-time-label", permiso.hora_inicio);
  setText("equipment-description-label", permiso.equipo_intervenir);
  setText("special-tools-label", permiso.requiere_herramientas_especiales);
  setText("special-tools-type-label", permiso.tipo_herramientas_especiales);
  setText("adequate-tools-label", permiso.herramientas_adecuadas);
  setText("pre-verification-label", permiso.requiere_verificacion_previa);
  setText("risk-knowledge-label", permiso.requiere_conocer_riesgos);
  setText("final-observations-label", permiso.observaciones_medidas);

  // Mapeo de condiciones del proceso
  setText("fluid-label", permiso.fluido);
  setText("pressure-label", permiso.presion);
  setText("temperature-label", permiso.temperatura);

  // Mapeo de requisitos para efectuar el trabajo
  setText("fuera_operacion-label", permiso.fuera_operacion);
  setText("despresurizado_purgado-label", permiso.despresurizado_purgado);
  setText("producto_entrampado-label", permiso.producto_entrampado);
  setText("necesita_aislamiento-label", permiso.necesita_aislamiento);
  setText("con_valvulas-label", permiso.con_valvulas);
  setText("con_juntas_ciegas-label", permiso.con_juntas_ciegas);
  setText("requiere_lavado-label", permiso.requiere_lavado);
  setText("requiere_neutralizado-label", permiso.requiere_neutralizado);
  setText("requiere_vaporizado-label", permiso.requiere_vaporizado);
  setText(
    "suspender_trabajos_adyacentes-label",
    permiso.suspender_trabajos_adyacentes
  );
  setText("acordonar_area-label", permiso.acordonar_area);
  setText(
    "prueba_gas_toxico_inflamable-label",
    permiso.prueba_gas_toxico_inflamable
  );
  setText(
    "equipo_electrico_desenergizado-label",
    permiso.equipo_electrico_desenergizado
  );
  setText("tapar_purgas_drenajes-label", permiso.tapar_purgas_drenajes);

  // Mapeo de medidas/requisitos para administrar riesgos
  setText("ventilacion_forzada-label", permiso.ventilacion_forzada);
  setText("limpieza_interior-label", permiso.limpieza_interior);
  setText(
    "instalo_ventilacion_forzada-label",
    permiso.instalo_ventilacion_forzada
  );
  setText("equipo_conectado_tierra-label", permiso.equipo_conectado_tierra);
  setText("cables_pasan_drenajes-label", permiso.cables_pasan_drenajes);
  setText(
    "cables_uniones_intermedias-label",
    permiso.cables_uniones_intermedias
  );
  setText(
    "equipo_proteccion_personal-label",
    permiso.equipo_proteccion_personal
  );
}

// Al cargar la página, obtener el id y mostrar los datos
document.addEventListener("DOMContentLoaded", function () {
  // Lógica para el botón "Salir"
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
          // Mostrar en la sección de aprobación
          const supervisor = document.getElementById("stamp-aprobador");
          if (supervisor)
            supervisor.textContent = data.data.responsable_area || "-";
          const categoria = document.getElementById("stamp-encargado");
          if (categoria) categoria.textContent = data.data.operador_area || "-";
        }
      })
      .catch((err) => {
        console.error("Error al obtener responsables de área:", err);
      });

    // 1. Obtener datos generales y AST
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        // Mapeo de datos generales para la sección principal y equipo
        if (data && data.general) {
          setText("prefijo-label", data.general.prefijo || "-");
          setText("start-time-label", data.general.hora_inicio || "-");
          setText("fecha-label", data.general.fecha || "-");
          setText(
            "activity-type-label",
            data.general.tipo_mantenimiento || "-"
          );
          setText("plant-label", data.general.area || "-");
          setText(
            "descripcion-trabajo-label",
            data.general.descripcion_trabajo || "-"
          );
          setText("empresa-label", data.general.empresa || "-");
          setText("nombre-solicitante-label", data.general.solicitante || "-");
          setText("sucursal-label", data.general.sucursal || "-");
          setText("contrato-label", data.general.contrato || "-");
          setText("work-order-label", data.general.ot_numero || "-");
          setText("equipment-label", data.general.equipo_intervenir || "-");
          setText("tag-label", data.general.tag || "-");
        }
        // Rellenar datos adicionales usando data.data (otros mapeos)
        if (data && data.data) {
          const detalles = data.data;
          setText("maintenance-type-label", detalles.tipo_mantenimiento);
          setText("work-order-label", detalles.ot_numero);
          setText("tag-label", detalles.tag);
          setText("start-time-label", detalles.hora_inicio);
          setText("equipment-description-label", detalles.equipo_intervenir);
          setText(
            "special-tools-label",
            detalles.requiere_herramientas_especiales
          );
          setText(
            "special-tools-type-label",
            detalles.tipo_herramientas_especiales
          );
          setText("adequate-tools-label", detalles.herramientas_adecuadas);
          setText(
            "pre-verification-label",
            detalles.requiere_verificacion_previa
          );
          setText("risk-knowledge-label", detalles.requiere_conocer_riesgos);
          setText("final-observations-label", detalles.observaciones_medidas);
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

    // 2. Obtener datos específicos del permiso de fuego
    fetch(`/api/pt-fuego/${idPermiso}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.data) {
          mostrarDatosSupervisor(data.data);
        } else {
          console.warn(
            "Estructura de datos inesperada o datos faltantes:",
            data
          );
        }
      })
      .catch((err) => {
        console.error("Error al consultar la API de permiso de fuego:", err);
      });
  }

  rellenarSupervisoresYCategorias();

  // Lógica para el botón "No Autorizar"
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

      // Mostrar el modal para capturar el comentario de rechazo
      const modal = document.getElementById("modalComentario");
      if (modal) {
        modal.style.display = "flex";
        document.getElementById("comentarioNoAutorizar").value = "";
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
            // Generar timestamp automático para rechazo supervisor PT5 (hora local)
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
              "[NO AUTORIZAR SUPERVISOR PT5] Timestamp generado (hora local):",
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
          window.location.href = "/Modules/SupSeguridad/supseguridad.html";
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
});

// --- Lógica para el botón "Autorizar" ---
const btnAutorizar = document.getElementById("btn-guardar-campos");
if (btnAutorizar) {
  btnAutorizar.addEventListener("click", async function () {
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
      // Generar timestamp automático para autorización supervisor PT5 (hora local)
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
        "[AUTORIZAR SUPERVISOR PT5] Timestamp generado (hora local):",
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

    // 1.5 Actualizar requisitos de riesgos específicos para fuego
    const payloadSupervisor = {
      // Verificación para administrar los riesgos
      explosividad_interior: getRadioValue("explosividad_interior"),
      explosividad_exterior: getRadioValue("explosividad_exterior"),
      vigia_contraincendio: getRadioValue("vigia_contraincendio"),
      manguera_contraincendio: getRadioValue("manguera_contraincendio"),
      cortina_agua: getRadioValue("cortina_agua"),
      extintor_contraincendio: getRadioValue("extintor_contraincendio"),
      cubrieron_drenajes: getRadioValue("cubrieron_drenajes"),

      // Prueba de gas
      co2: getRadioValue("co2"),
      amoniaco: getRadioValue("amoniaco"),
      oxigeno: getRadioValue("oxigeno"),
      explosividad_lel: getRadioValue("explosividad_lel"),
      otro_gas_cual: getInputValue("otro_gas_cual"),
      observaciones_gas: getInputValue("observaciones_gas"),
    };

    try {
      console.log(
        "Payload enviado a /requisitos_supervisor para fuego:",
        payloadSupervisor
      );
      await fetch(`/api/fuego/requisitos_supervisor/${idPermiso}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadSupervisor),
      });
    } catch (err) {
      console.error("Error al actualizar requisitos supervisor:", err);
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

    // --- MODAL DE CONFIRMACIÓN (replicado de PT4) ---
    const confirmationModal = document.getElementById("confirmation-modal");
    if (confirmationModal) {
      confirmationModal.style.display = "flex";
    }
    const permitNumber = document.getElementById("generated-permit");
    if (permitNumber) {
      permitNumber.textContent = idPermiso || "-";
    }
  });
}

// Cierre del modal y redirección (mismo comportamiento que PT4)
const modalCloseBtn = document.getElementById("modal-close-btn");
if (modalCloseBtn) {
  modalCloseBtn.onclick = function () {
    const confirmationModal = document.getElementById("confirmation-modal");
    if (confirmationModal) confirmationModal.style.display = "none";
    window.location.href = "/Modules/SupSeguridad/supseguridad.html";
  };
}
