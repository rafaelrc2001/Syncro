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
        alert('No se pudo obtener el ID del permiso.');
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
        alert('No se pudo obtener el estatus del permiso.');
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
      alert("No se pudo obtener el ID del permiso.");
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
        alert("Debes ingresar el nombre del responsable antes de rechazar. 3");
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
      window.location.href = "/Modules/Departamentos/AutorizarPT.html";
    });
  }

  // Botón salir: vuelve a AutorizarPT.html
  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/Departamentos/AutorizarPT.html";
    });
  }

  // Leer el id del permiso de la URL
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    // Llamar a la API para obtener los datos del permiso
  // Este endpoint consulta los formularios completos de un permiso, usando su ID. Devuelve toda la información relevante para mostrar en la interfaz, incluyendo datos generales, AST, actividades y participantes. Es la base para cargar y visualizar correctamente los detalles del permiso en la sección de área.
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos recibidos para el permiso:", data);
        // Guardar los datos globalmente para poder rellenar modales u otras vistas
        try {
          window.currentPermisoData = data;
        } catch (e) {
          // ignore
        }
        // Prefijo en el título y mapeo de campos según la nueva estructura
        if (data && data.general) {
          document.querySelector(".section-header h3").textContent = data.general.prefijo || "NP-XXXXXX";
          document.getElementById("descripcion-trabajo-label").textContent = data.general.descripcion_trabajo || "-";
          document.getElementById("work-order-label").textContent = data.general.ot_numero || "-";
          document.getElementById("fecha-label").textContent = data.general.fecha_hora ? new Date(data.general.fecha_hora).toLocaleDateString() : "-";
          document.getElementById("start-time-label").textContent = data.general.hora_inicio || "-";
          document.getElementById("activity-type-label").textContent = data.general.tipo_mantenimiento || "-";
          document.getElementById("plant-label").textContent = data.general.nombre_departamento || "-";
          document.getElementById("empresa-label").textContent = data.general.empresa || "-";
          document.getElementById("nombre-solicitante-label").textContent = data.general.nombre_solicitante || "-";
          document.getElementById("sucursal-label").textContent = data.general.id_sucursal || "-";
          document.getElementById("contrato-label").textContent = data.general.contrato || "-";
          document.getElementById("equipment-label").textContent = data.general.equipo_intervenir || "-";
          document.getElementById("tag-label").textContent = data.general.tag || "-";
          // ¿Tiene equipo a intervenir?
          const equipo = data.general.equipo_intervenir;
          const tieneEquipo = equipo && equipo.trim() !== "";
          document.getElementById("equipment-intervene-label").textContent = tieneEquipo ? "Sí" : "No";
          // Campos de condiciones del proceso
          const fluidInput = document.getElementById("fluid");
          const pressureInput = document.getElementById("pressure");
          const temperatureInput = document.getElementById("temperature");
          if (!tieneEquipo) {
            if (fluidInput) { fluidInput.value = "-"; fluidInput.disabled = true; }
            if (pressureInput) { pressureInput.value = "-"; pressureInput.disabled = true; }
            if (temperatureInput) { temperatureInput.value = "-"; temperatureInput.disabled = true; }
          } else {
            if (fluidInput) { fluidInput.value = data.general.fluido || ""; fluidInput.disabled = false; }
            if (pressureInput) { pressureInput.value = data.general.presion || ""; pressureInput.disabled = false; }
            if (temperatureInput) { temperatureInput.value = data.general.temperatura || ""; temperatureInput.disabled = false; }
          }
          // Condiciones actuales del equipo
          let condiciones = [];
          if (data.general.fluido) condiciones.push(`Fluido: ${data.general.fluido}`);
          if (data.general.presion) condiciones.push(`Presión: ${data.general.presion}`);
          if (data.general.temperatura) condiciones.push(`Temperatura: ${data.general.temperatura}`);
          if (document.getElementById("equipment-conditions-label")) {
            document.getElementById("equipment-conditions-label").textContent = condiciones.length > 0 ? condiciones.join(" | ") : "-";
          }
          // Validaciones para evitar errores si los datos no existen
          if (data.ast) {
            mostrarAST(data.ast);
          }
          if (Array.isArray(data.actividades_ast)) {
            mostrarActividadesAST(data.actividades_ast);
          }
          if (Array.isArray(data.participantes_ast)) {
            mostrarParticipantesAST(data.participantes_ast);
          }
        } else {
          alert("No se encontraron datos para este permiso o el backend no responde con la estructura esperada.");
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
        alert("No se pudo obtener el ID del permiso.");
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
