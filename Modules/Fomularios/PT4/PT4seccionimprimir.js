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
  fetch("http://localhost:3000/api/supervisores")
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

  fetch("http://localhost:3000/api/categorias")
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
  setText("prefijo-label", permiso.prefijo); // Nuevo: mapeo prefijo
  setText("descripcion-trabajo-label", permiso.descripcion_trabajo); // Nuevo: mapeo descripcion
  setText("maintenance-type-label", permiso.tipo_mantenimiento);
  setText("work-order-label", permiso.ot_numero);
  setText("tag-label", permiso.tag);
  setText("start-time-label", permiso.hora_inicio);
  setText("equipment-description-label", permiso.equipo_intervenir);
  setText("requiere-escalera-label", permiso.requiere_escalera);
  setText("tipo-escalera-label", permiso.tipo_escalera || "-");
  setText("requiere-canastilla-label", permiso.requiere_canastilla_grua);
  setText("aseguramiento-estrobo-label", permiso.aseguramiento_estrobo);
  setText("requiere-andamio-label", permiso.requiere_andamio_cama_completa);
  setText("requiere-otro-acceso-label", permiso.otro_tipo_acceso);
  setText("cual-acceso-label", permiso.cual_acceso || "-");
  setText("acceso-libre-obstaculos-label", permiso.acceso_libre_obstaculos);
  setText("canastilla-asegurada-label", permiso.canastilla_asegurada);
  setText("andamio-completo-label", permiso.andamio_completo);
  setText("andamio-seguros-zapatas-label", permiso.andamio_seguros_zapatas);
  setText("escaleras-buen-estado-label", permiso.escaleras_buen_estado);
  setText("linea-vida-segura-label", permiso.linea_vida_segura);
  setText(
    "arnes-completo-buen-estado-label",
    permiso.arnes_completo_buen_estado
  );
  setText(
    "suspender-trabajos-adyacentes-label",
    permiso.suspender_trabajos_adyacentes
  );
  setText(
    "numero-personas-autorizadas-label",
    permiso.numero_personas_autorizadas
  );
  setText(
    "trabajadores-aptos-evaluacion-label",
    permiso.trabajadores_aptos_evaluacion
  );
  setText("requiere-barreras-label", permiso.requiere_barreras);
  setText("observaciones-label", permiso.observaciones);

  // Mapeo de condiciones del proceso
  // Si existe 'fluido', úsalo; si no, busca en otros posibles campos
  setText(
    "fluid",
    permiso.fluido || permiso.fluido_proceso || permiso.fluido_area || "-"
  );
  setText("pressure", permiso.presion);
  setText("temperature", permiso.temperatura);
}

// Al cargar la página, obtener el id y mostrar los datos

document.addEventListener("DOMContentLoaded", function () {
  // Lógica para el botón "Salir" igual que PT3
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/supseguridad.html";
    });
  }
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    // 1. Obtener datos generales y AST
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        // Prefijo en el título
        if (data && data.general && document.getElementById("prefijo-label")) {
          document.getElementById("prefijo-label").textContent =
            data.general.prefijo || "-";
        }
        // Rellenar datos generales si existen
        if (data && data.general) {
          console.log("Datos generales:", data.general);
          // mostrarDatosSupervisor(data.general); // <--- Comentado para prueba
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
    // 2. Obtener datos específicos del permiso para otros campos (si necesitas más detalles)
    fetch(`http://localhost:3000/api/pt-altura/${idPermiso}`)
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
        console.error("Error al consultar la API de permiso de altura:", err);
      });
  }
  rellenarSupervisoresYCategorias();

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
            await fetch(
              "http://localhost:3000/api/autorizaciones/supervisor-categoria",
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_permiso: idPermiso,
                  supervisor,
                  categoria,
                  comentario_no_autorizar: comentario,
                }),
              }
            );
          } catch (err) {
            console.error("Error al actualizar supervisor y categoría:", err);
          }
          // 2. Consultar el id_estatus desde permisos_trabajo
          let idEstatus = null;
          try {
            const respEstatus = await fetch(
              `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
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
              await fetch("http://localhost:3000/api/estatus/no_autorizado", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_estatus: idEstatus }),
              });
              // Guardar el comentario en la tabla estatus
              await fetch("http://localhost:3000/api/estatus/comentario", {
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
      await fetch(
        "http://localhost:3000/api/autorizaciones/supervisor-categoria",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            supervisor,
            categoria,
          }),
        }
      );
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
        "Payload enviado a /requisitos_supervisor para altura:",
        payloadSupervisor
      );
      await fetch(
        `http://localhost:3000/api/altura/requisitos_supervisor/${idPermiso}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadSupervisor),
        }
      );
    } catch (err) {
      console.error(
        "Error al actualizar requisitos supervisor y pruebas:",
        err
      );
    }

    // 2. Consultar id_estatus
    let idEstatus = null;
    try {
      const respEstatus = await fetch(
        `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
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

    // 3. Actualizar estatus a "activo"
    if (idEstatus) {
      try {
        await fetch("http://localhost:3000/api/estatus/activo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus }),
        });
      } catch (err) {
        console.error("Error al actualizar estatus activo:", err);
      }
    }

    alert("Permiso autorizado correctamente");
    window.location.href = "/Modules/SupSeguridad/supseguridad.html";
  });
}
