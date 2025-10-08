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
      alert("No se pudo obtener el ID del permiso.");
      return;
    }
    // Validar responsable obligatorio
    if (!responsable_area) {
      alert("Debes ingresar el nombre del responsable del área.");
      if (responsableInput) responsableInput.focus();
      return;
    }

    // 3. Insertar autorización de área vía API
    try {
      // --- Consultar el id_estatus desde permisos_trabajo ---
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
        try {
          const payloadEstatus = { id_estatus: idEstatus };
          console.log(
            "[DEPURACIÓN] Enviando a /api/estatus/seguridad:",
            payloadEstatus
          );
          const respEstatus = await fetch(
            "http://localhost:3000/api/estatus/seguridad",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadEstatus),
            }
          );
          console.log(
            "[DEPURACIÓN] Respuesta HTTP de estatus/seguridad:",
            respEstatus.status
          );
          let data = {};
          try {
            data = await respEstatus.json();
          } catch (e) {
            console.warn(
              "[DEPURACIÓN] No se pudo parsear JSON de respuesta de estatus/seguridad"
            );
          }
          if (!respEstatus.ok) {
            console.error(
              "[DEPURACIÓN] Error en respuesta de estatus/seguridad:",
              data
            );
            // alert(
            //   "Error al actualizar estatus: " +
            //     (data.error || respEstatus.status)
            // );
          } else {
            console.log(
              "[DEPURACIÓN] Respuesta exitosa de estatus/seguridad:",
              data
            );
            // alert("Estatus actualizado correctamente en la tabla estatus.");
          }
        } catch (err) {
          console.error(
            "[DEPURACIÓN] Excepción al actualizar estatus de seguridad:",
            err
          );
          // alert("Excepción al actualizar estatus: " + err.message);
        }
      } else {
        console.warn(
          "[DEPURACIÓN] No se obtuvo id_estatus para actualizar estatus."
        );
        // alert("No se obtuvo id_estatus para actualizar estatus.");
      }

      // --- Insertar autorización de área vía API ---
      const fluidInput = document.getElementById("fluid");
      const pressureInput = document.getElementById("pressure");
      const temperatureInput = document.getElementById("temperature");
      const fluido = fluidInput ? fluidInput.value.trim() : "";
      const presion = pressureInput ? pressureInput.value.trim() : "";
      const temperatura = temperatureInput ? temperatureInput.value.trim() : "";

      // Ejemplo para preguntas de análisis previo
      const pregunta1 =
        document.querySelector('input[name="pregunta1"]:checked')?.value || "";
      const pregunta2 =
        document.querySelector('input[name="pregunta2"]:checked')?.value || "";
      const pregunta3 =
        document.querySelector('input[name="pregunta3"]:checked')?.value || "";
      const pregunta4 =
        document.querySelector('input[name="pregunta4"]:checked')?.value || "";
      const pregunta5 =
        document.querySelector('input[name="pregunta5"]:checked')?.value || "";
      const observaciones =
        document.getElementById("observaciones")?.value.trim() || "";

      const resp = await fetch(
        "http://localhost:3000/api/autorizaciones/area",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            responsable_area,
            encargado_area: operador_area,
            fluido,
            presion,
            temperatura,
            pregunta1,
            pregunta2,
            pregunta3,
            pregunta4,
            pregunta5,
            observaciones,
          }),
        }
      );
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
    window.location.href = "/Modules/Usuario/AutorizarPT.html";
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
      alert("Debes ingresar el nombre del responsable antes de rechazar.");
      return;
    }
    // Mostrar el modal para capturar el comentario de rechazo
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
        // 1. Guardar comentario y responsable en la tabla de autorizaciones (puedes adaptar el endpoint si tienes uno específico para no autorizado)
        const resp = await fetch(
          "http://localhost:3000/api/autorizaciones/area",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              responsable_area,
              encargado_area: operador_area,
              comentario_no_autorizar: comentario,
            }),
          }
        );
        if (!resp.ok) {
          await resp.json().catch(() => ({}));
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
            const payloadEstatus = { id_estatus: idEstatus };
            console.log(
              "[NO AUTORIZAR] Enviando a /api/estatus/no_autorizado:",
              payloadEstatus
            );
            const respEstatus = await fetch(
              "http://localhost:3000/api/estatus/no_autorizado",
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
              return;
            } else {
              console.log(
                "[NO AUTORIZAR] Estatus actualizado a No Autorizado:",
                data
              );
            }

            // 3.1 Guardar el comentario en la tabla estatus
            const respComentario = await fetch(
              "http://localhost:3000/api/estatus/comentario",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_estatus: idEstatus, comentario }),
              }
            );
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
        window.location.href = "/Modules/Usuario/AutorizarPT.html";
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
    window.location.href = "/Modules/Usuario/AutorizarPT.html";
  });
}
// Mostrar solo la sección 2 al cargar y ocultar las demás
document.addEventListener("DOMContentLoaded", function () {
  // --- FUNCIONES PARA RELLENAR AST Y PARTICIPANTES ---
  function mostrarAST(ast) {
    const eppList = document.getElementById("modal-epp-list");
    if (eppList) {
      eppList.innerHTML = "";
      if (ast.epp_requerido) {
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
      if (ast.maquinaria_herramientas) {
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
      if (ast.material_accesorios) {
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

  // Guardar datos del análisis previo y condiciones

  // Lógica para el botón "No Autorizar"
  const btnNoAutorizar = document.getElementById("btn-no-autorizar");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", function () {
      // Validar nombre del responsable antes de abrir el modal de comentario
      const responsableInput = document.getElementById("responsable-aprobador");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";
      if (!responsable_area) {
        alert("Debes ingresar el nombre del responsable antes de rechazar.");
        return;
      }
      // Aquí puedes abrir un modal para capturar el comentario de rechazo
    });
  }
  document.querySelectorAll(".form-section").forEach(function (section) {
    if (section.getAttribute("data-section") === "2") {
      section.style.display = "";
      section.classList.add("active");
    } else {
      section.style.display = "none";
      section.classList.remove("active");
    }
  });

  // Botón regresar: vuelve a AutorizarPT.html
  const btnRegresar = document.getElementById("btn-regresar");
  if (btnRegresar) {
    btnRegresar.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    });
  }

  // Botón salir: vuelve a AutorizarPT.html
  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    });
  }

  // Leer el id del permiso de la URL
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    // Llamar a la API para obtener los datos del permiso
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos recibidos para el permiso:", data);
        // Prefijo en el título
        if (data && data.general) {
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          // Descripción del trabajo
          document.getElementById("descripcion-trabajo-label").textContent =
            data.general.descripcion_trabajo || "-";
        }
        if (data && data.detalles) {
          document.getElementById("work-order-label").textContent =
            data.detalles.ot || "-";
          // Mapear fecha si existe
          if (data.general && data.general.fecha) {
            document.getElementById("fecha-label").textContent =
              data.general.fecha;
          } else if (data.detalles.fecha) {
            document.getElementById("fecha-label").textContent =
              data.detalles.fecha;
          } else {
            document.getElementById("fecha-label").textContent = "-";
          }
          // Usar 'horario' para Hora de inicio si existe, si no, hora_inicio
          document.getElementById("start-time-label").textContent =
            data.detalles.horario || data.detalles.hora_inicio || "-";
          document.getElementById("activity-type-label").textContent =
            data.detalles.tipo_actividad || "-";
          document.getElementById("plant-label").textContent =
            data.detalles.planta || "-";
          // Nuevos campos mapeados
          document.getElementById("empresa-label").textContent =
            data.general && data.general.empresa
              ? data.general.empresa
              : data.detalles.empresa || "-";
          document.getElementById("nombre-solicitante-label").textContent =
            data.general && data.general.solicitante
              ? data.general.solicitante
              : data.detalles.solicitante || "-";
          document.getElementById("sucursal-label").textContent =
            data.general && data.general.sucursal
              ? data.general.sucursal
              : data.detalles.sucursal || "-";
          document.getElementById("contrato-label").textContent =
            data.general && data.general.contrato
              ? data.general.contrato
              : data.detalles.contrato || "-";
          //Equipo a Intervenir
          document.getElementById("equipment-label").textContent =
            data.detalles.equipo || "-";
          // TAG
          document.getElementById("tag-label").textContent =
            data.detalles.tag || "-";
          // ¿Tiene equipo a intervenir?
          const equipo = data.detalles.equipo;
          const tieneEquipo = equipo && equipo.trim() !== "";

          // Mostrar "Sí" o "No"
          document.getElementById("equipment-intervene-label").textContent =
            tieneEquipo ? "Sí" : "No";

          // Campos de condiciones del proceso
          const fluidInput = document.getElementById("fluid");
          const pressureInput = document.getElementById("pressure");
          const temperatureInput = document.getElementById("temperature");

          if (!tieneEquipo) {
            // Si NO hay equipo, deshabilita y muestra "-"
            if (fluidInput) {
              fluidInput.value = "-";
              fluidInput.disabled = true;
            }
            if (pressureInput) {
              pressureInput.value = "-";
              pressureInput.disabled = true;
            }
            if (temperatureInput) {
              temperatureInput.value = "-";
              temperatureInput.disabled = true;
            }
          } else {
            // Si hay equipo, habilita y muestra los valores reales
            if (fluidInput) {
              fluidInput.value = data.detalles.fluido || "";
              fluidInput.disabled = false;
            }
            if (pressureInput) {
              pressureInput.value = data.detalles.presion || "";
              pressureInput.disabled = false;
            }
            if (temperatureInput) {
              temperatureInput.value = data.detalles.temperatura || "";
              temperatureInput.disabled = false;
            }
          }

          // Condiciones actuales del equipo: mostrar fluido, presion, temperatura si existen
          let condiciones = [];
          if (data.detalles.fluido)
            condiciones.push(`Fluido: ${data.detalles.fluido}`);
          if (data.detalles.presion)
            condiciones.push(`Presión: ${data.detalles.presion}`);
          if (data.detalles.temperatura)
            condiciones.push(`Temperatura: ${data.detalles.temperatura}`);
          if (document.getElementById("equipment-conditions-label")) {
            document.getElementById("equipment-conditions-label").textContent =
              condiciones.length > 0
                ? condiciones.join(" | ")
                : data.detalles.condiciones_equipo || "-";
          }
          // Ahora agrega esto para rellenar AST y Participantes:
          mostrarAST(data.ast);
          mostrarActividadesAST(data.actividades_ast);
          mostrarParticipantesAST(data.participantes_ast);
        } else {
          alert(
            "No se encontraron datos para este permiso o el backend no responde con la estructura esperada."
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
});

// --- FUNCIONES DE LA VISTA ---
