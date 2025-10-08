// --- Lógica fusionada para guardar campos y autorizar ---
const btnGuardarCampos = document.getElementById("btn-guardar-campos");
if (btnGuardarCampos) {
  btnGuardarCampos.addEventListener("click", async function () {
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
      suspender_trabajos_adyacentes: getRadio("suspender_trabajos_adyacentes"),
      acordonar_area: getRadio("acordonar_area"),
      prueba_gas_toxico_inflamable: getRadio("prueba_gas_toxico_inflamable"),
      equipo_electrico_desenergizado: getRadio(
        "equipo_electrico_desenergizado"
      ),
      tapar_purgas_drenajes: getRadio("tapar_purgas_drenajes"),
      fluido: document.getElementById("fluid").value,
      presion: document.getElementById("pressure").value,
      temperatura: document.getElementById("temperature").value,
      // Puedes agregar más campos aquí si los necesitas
    };
    try {
      const resp = await fetch(
        `http://localhost:3000/api/pt-apertura/requisitos_area/${idPermiso}`,
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

    // 4. Autorizar (igual que PT1)
    try {
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
        } else {
          console.error(
            "[DEPURACIÓN] Error al obtener id_estatus. Status:",
            respEstatus.status
          );
        }
      } catch (err) {
        console.error("[DEPURACIÓN] Error al consultar id_estatus:", err);
      }

      if (idEstatus) {
        try {
          const payloadEstatus = { id_estatus: idEstatus };
          const respEstatus = await fetch(
            "http://localhost:3000/api/estatus/seguridad",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadEstatus),
            }
          );
          let data = {};
          try {
            data = await respEstatus.json();
          } catch (e) {}
          if (!respEstatus.ok) {
            console.error(
              "[DEPURACIÓN] Error en respuesta de estatus/seguridad:",
              data
            );
          }
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

      await fetch("http://localhost:3000/api/autorizaciones/area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          responsable_area,
          encargado_area: operador_area,
        }),
      });

      // Mostrar el modal de confirmación
      const confirmationModal = document.getElementById("confirmation-modal");
      if (confirmationModal) {
        confirmationModal.style.display = "flex";
      }
      const permitNumber = document.getElementById("generated-permit");
      if (permitNumber) {
        permitNumber.textContent = idPermiso || "-";
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
        await fetch("http://localhost:3000/api/autorizaciones/area", {
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
            `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
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
            await fetch("http://localhost:3000/api/estatus/no_autorizado", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadEstatus),
            });
            // Guardar el comentario en la tabla estatus
            await fetch("http://localhost:3000/api/estatus/comentario", {
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
    await fetch(`http://localhost:3000/api/pt2/personas_area/${idPermiso}`, {
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
  console.log("Consultando permiso de apertura con id:", idPermiso);
  fetch(`http://localhost:3000/api/pt-apertura/${idPermiso}`)
    .then((resp) => resp.json())
    .then((data) => {
      const detalles = data.data || data;

      // Información General
      setText("start-time-label", detalles.hora_inicio || "-");
      setText(
        "fecha-label",
        detalles.fecha_creacion ? detalles.fecha_creacion.split("T")[0] : "-"
      );
      setText("activity-type-label", detalles.tipo_mantenimiento || "-");
      setText("plant-label", detalles.planta || "-");
      setText("descripcion-trabajo-label", detalles.descripcion_trabajo || "-");
      setText("empresa-label", detalles.empresa || "-");
      setText("nombre-solicitante-label", detalles.nombre_solicitante || "-");
      setText("sucursal-label", detalles.sucursal || "-");
      setText("contrato-label", detalles.contrato || "-");
      setText("work-order-label", detalles.ot_numero || "-");

      // Sección Equipo
      const tieneEquipo =
        detalles.tiene_equipo_intervenir &&
        detalles.tiene_equipo_intervenir.trim() !== "";
      setText("equipment-intervene-label", tieneEquipo ? "SI" : "NO");
      setText(
        "equipment-label",
        tieneEquipo ? detalles.tiene_equipo_intervenir : "-"
      );
      setText("tag-label", detalles.tag || "-");

      // Formulario Usuario
      setText(
        "special-tools-label",
        detalles.requiere_herramientas_especiales || "-"
      );
      setText(
        "what-special-tools-label",
        detalles.tipo_herramientas_especiales || "-"
      );
      setText("adequate-tools-label", detalles.herramientas_adecuadas || "-");
      setText(
        "pre-verification-label",
        detalles.requiere_verificacion_previa || "-"
      );
      setText("risk-knowledge-label", detalles.requiere_conocer_riesgos || "-");
      setText(
        "final-observations-label",
        detalles.observaciones_medidas || "-"
      );

      // Condiciones del Proceso: solo habilitar si hay equipo a intervenir
      const fluidInput = document.getElementById("fluid");
      const pressureInput = document.getElementById("pressure");
      const temperatureInput = document.getElementById("temperature");

      if (tieneEquipo) {
        if (fluidInput) {
          fluidInput.value = detalles.fluido || "";
          fluidInput.readOnly = false;
          fluidInput.style.background = "#fff";
        }
        if (pressureInput) {
          pressureInput.value = detalles.presion || "";
          pressureInput.readOnly = false;
          pressureInput.style.background = "#fff";
        }
        if (temperatureInput) {
          temperatureInput.value = detalles.temperatura || "";
          temperatureInput.readOnly = false;
          temperatureInput.style.background = "#fff";
        }
      } else {
        if (fluidInput) {
          fluidInput.value = "-";
          fluidInput.readOnly = true;
          fluidInput.style.background = "#eee";
        }
        if (pressureInput) {
          pressureInput.value = "-";
          pressureInput.readOnly = true;
          pressureInput.style.background = "#eee";
        }
        if (temperatureInput) {
          temperatureInput.value = "-";
          temperatureInput.readOnly = true;
          temperatureInput.style.background = "#eee";
        }
      }
    })
    .catch((err) => {
      console.error("Error al obtener datos:", err);
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
          `http://localhost:3000/api/pt-apertura/requisitos_area/${idPermiso}`,
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
  if (btnSalirNuevo) {
    btnSalirNuevo.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    });
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

  // Leer el id del permiso de la URL
  const params2 = new URLSearchParams(window.location.search);
  const idPermiso2 = params2.get("id");
  if (idPermiso2) {
    // Llamar a la API para obtener los datos del permiso
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso2
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        // Prefijo en el título y descripción del trabajo
        if (data && data.general) {
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          document.getElementById("descripcion-trabajo-label").textContent =
            data.general.descripcion_trabajo || "-";
        }
        // Llenar campos generales usando data.data
        if (data && data.data) {
          const detalles = data.data;

          // Información General
          setText("activity-type-label", detalles.tipo_mantenimiento || "-");
          setText("plant-label", detalles.planta || "-");
          setText(
            "descripcion-trabajo-label",
            detalles.descripcion_trabajo || "-"
          );
          setText("empresa-label", detalles.empresa || "-");
          setText(
            "nombre-solicitante-label",
            detalles.nombre_solicitante || "-"
          );
          setText("sucursal-label", detalles.sucursal || "-");
          setText("contrato-label", detalles.contrato || "-");
          setText("work-order-label", detalles.ot_numero || "-");

          // Sección Equipo
          setText(
            "equipment-intervene-label",
            detalles.tiene_equipo_intervenir || "-"
          );
          setText("equipment-label", detalles.descripcion_equipo || "-");
          setText("tag-label", detalles.tag || "-");
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

  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");

  if (idPermiso) {
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data && data.general) {
          const general = data.general;
          setText("nombre-solicitante-label", general.solicitante || "-");
          setText("sucursal-label", general.sucursal || "-");
          setText("contrato-label", general.contrato || "-");
          // Si quieres mostrar más campos, usa siempre general:
          setText("plant-label", general.area || "-");
          setText(
            "descripcion-trabajo-label",
            general.descripcion_trabajo || "-"
          );
          setText("empresa-label", general.empresa || "-");
          setText("activity-type-label", general.tipo_mantenimiento || "-");
          setText("work-order-label", general.ot_numero || "-");
        } else {
          console.warn(
            "No se encontró la sección 'general' en la respuesta:",
            data
          );
        }
      })
      .catch((err) =>
        console.error("Error al cargar los datos del permiso:", err)
      );
  }

  const modalCloseBtn = document.getElementById("modal-close-btn");
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    });
  }
});
