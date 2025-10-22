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
    // Utilidad para leer checkboxes (devuelve "SI" o "NO")
    function getCheckbox(name) {
      const checkbox = document.querySelector(`input[name='${name}']`);
      return checkbox && checkbox.checked ? "SI" : "NO";
    }
    // Utilidad para leer input text
    function getInputValue(id) {
      const input = document.getElementById(id);
      return input ? input.value : null;
    }
    // Construir payload con los nombres correctos del backend
    const payload = {
      identifico_equipo: getRadio("identifico_equipo"),
      verifico_identifico_equipo: getCheckbox("verifico_identifico_equipo"),
      fuera_operacion_desenergizado: getRadio("fuera_operacion_desenergizado"),
      verifico_fuera_operacion_desenergizado: getCheckbox(
        "verifico_fuera_operacion_desenergizado"
      ),
      candado_etiqueta: getRadio("candado_etiqueta"),
      verifico_candado_etiqueta: getCheckbox("verifico_candado_etiqueta"),
      suspender_adyacentes: getRadio("suspender_adyacentes"),
      verifico_suspender_adyacentes: getCheckbox(
        "verifico_suspender_adyacentes"
      ),
      area_limpia_libre_obstaculos: getRadio("area_limpia_libre_obstaculos"),
      verifico_area_limpia_libre_obstaculos: getCheckbox(
        "verifico_area_limpia_libre_obstaculos"
      ),
      libranza_electrica: getRadio("libranza_electrica"),
      verifico_libranza_electrica: getCheckbox("verifico_libranza_electrica"),
      nivel_tension: getInputValue("nivel_tension"),
    };
    try {
      console.log("[DEPURACIÓN] Enviando requisitos_area payload:", payload);
      const resp = await fetch(
        `http://localhost:3000/api/pt-electrico/requisitos_area/${idPermiso}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      console.log(
        "[DEPURACIÓN] Respuesta requisitos_area status:",
        resp.status
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
          fecha_hora_area: new Date().toISOString(),
        }),
      });
      // Mostrar modal de confirmación y número de permiso (igual que PT5)
      const confirmationModal = document.getElementById("confirmation-modal");
      if (confirmationModal) {
        confirmationModal.style.display = "flex";
      }
      const permitNumber = document.getElementById("generated-permit");
      if (permitNumber) {
        permitNumber.textContent = idPermiso || "-";
      }
      // El cierre del modal hará la redirección
      const modalClose = document.getElementById("modal-close-btn");
      if (modalClose) {
        modalClose.onclick = function () {
          const confirmationModal =
            document.getElementById("confirmation-modal");
          if (confirmationModal) confirmationModal.style.display = "none";
          window.location.href = "/Modules/Usuario/AutorizarPT.html";
        };
      } else {
        // Fallback: redirigir si el modal o el botón no existen
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
            fecha_hora_area: new Date().toISOString(),
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
  console.log("Consultando permiso de electrico con id:", idPermiso);
  fetch(`http://localhost:3000/api/pt-electrico/${idPermiso}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Respuesta de la API:", data);
      // Mapear datos generales correctamente
      if (data && data.success && data.data) {
        const permiso = data.data;
        console.log("Valores del permiso recibidos:", permiso);

        // Datos generales
        setText("maintenance-type-label", permiso.tipo_mantenimiento || "-");
        setText("work-order-label", permiso.ot_numero || "-");
        setText("tag-label", permiso.tag || "-");
        setText("start-time-label", permiso.hora_inicio || "-");
        setText(
          "descripcion-trabajo-label",
          permiso.descripcion_trabajo || "-"
        );
        setText(
          "equipment-description-label",
          permiso.equipo_intervenir || "-"
        );
        // Campos generales adicionales
        setText("prefijo-label", permiso.prefijo || "-");
        setText("empresa-label", permiso.empresa || "-");
        setText(
          "nombre-solicitante-label",
          permiso.solicitante || permiso.nombre_solicitante || "-"
        );
        setText("sucursal-label", permiso.sucursal || "-");
        setText("contrato-label", permiso.contrato || "-");
        setText("plant-label", permiso.area || "-");

        // Mapear campos de "Medidas para administrar los riesgos"
        setText("equipo_desenergizado", permiso.equipo_desenergizado || "-");
        setText(
          "interruptores_abiertos",
          permiso.interruptores_abiertos || "-"
        );
        setText("ausencia_voltaje", permiso.verificar_ausencia_voltaje || "-");
        setText("candados_intervencion", permiso.candados_equipo || "-");
        setText("tarjetas_alerta_notificacion", permiso.tarjetas_alerta || "-");
        setText("aviso_personal_area", permiso.aviso_personal_area || "-");
        setText("tapetes_dielelectricos", permiso.tapetes_dielectricos || "-");
        setText("herramienta_aislante", permiso.herramienta_aislante || "-");
        setText("pertiga_telescopica", permiso.pertiga_telescopica || "-");
        setText(
          "equipo_proteccion_especial",
          permiso.equipo_proteccion_especial || "-"
        );
        setText(
          "cual_equipo_proteccion",
          permiso.tipo_equipo_proteccion || "-"
        );
        setText("aterrizar_equipo_circuito", permiso.aterrizar_equipo || "-");
        setText("instalar_barricadas_area", permiso.barricadas_area || "-");
        setText(
          "observaciones_medidas",
          permiso.observaciones_adicionales || "-"
        );

        // Otros campos específicos del formulario eléctrico
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
      // Utilidad para leer checkboxes (devuelve "SI" o "NO")
      function getCheckbox(name) {
        const checkbox = document.querySelector(`input[name='${name}']`);
        return checkbox && checkbox.checked ? "SI" : "NO";
      }
      // Utilidad para leer input text
      function getInputValue(id) {
        const input = document.getElementById(id);
        return input ? input.value : null;
      }
      // Construir payload con los nombres correctos del backend
      const payload = {
        identifico_equipo: getRadio("identifico_equipo"),
        verifico_identifico_equipo: getCheckbox("verifico_identifico_equipo"),
        fuera_operacion_desenergizado: getRadio(
          "fuera_operacion_desenergizado"
        ),
        verifico_fuera_operacion_desenergizado: getCheckbox(
          "verifico_fuera_operacion_desenergizado"
        ),
        candado_etiqueta: getRadio("candado_etiqueta"),
        verifico_candado_etiqueta: getCheckbox("verifico_candado_etiqueta"),
        suspender_adyacentes: getRadio("suspender_adyacentes"),
        verifico_suspender_adyacentes: getCheckbox(
          "verifico_suspender_adyacentes"
        ),
        area_limpia_libre_obstaculos: getRadio("area_limpia_libre_obstaculos"),
        verifico_area_limpia_libre_obstaculos: getCheckbox(
          "verifico_area_limpia_libre_obstaculos"
        ),
        libranza_electrica: getRadio("libranza_electrica"),
        verifico_libranza_electrica: getCheckbox("verifico_libranza_electrica"),
        nivel_tension: getInputValue("nivel_tension"),
      };
      try {
        const resp = await fetch(
          `http://localhost:3000/api/pt-electrico/requisitos_area/${idPermiso}`,
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
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso2
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        // Prefijo y datos generales en el título y descripción del trabajo
        if (data && data.general) {
          // Usamos document.getElementById directamente para no depender del orden
          if (document.getElementById("prefijo-label"))
            document.getElementById("prefijo-label").textContent =
              data.general.prefijo || "-";
          if (document.getElementById("start-time-label"))
            document.getElementById("start-time-label").textContent =
              data.general.hora_inicio || "-";
          if (document.getElementById("fecha-label"))
            document.getElementById("fecha-label").textContent =
              data.general.fecha || "-";
          if (document.getElementById("activity-type-label"))
            document.getElementById("activity-type-label").textContent =
              data.general.tipo_mantenimiento || "-";
          if (document.getElementById("plant-label"))
            document.getElementById("plant-label").textContent =
              data.general.area || "-";
          if (document.getElementById("descripcion-trabajo-label"))
            document.getElementById("descripcion-trabajo-label").textContent =
              data.general.descripcion_trabajo || "-";
          if (document.getElementById("empresa-label"))
            document.getElementById("empresa-label").textContent =
              data.general.empresa || "-";
          if (document.getElementById("nombre-solicitante-label"))
            document.getElementById("nombre-solicitante-label").textContent =
              data.general.solicitante ||
              data.general.nombre_solicitante ||
              "-";
          if (document.getElementById("sucursal-label"))
            document.getElementById("sucursal-label").textContent =
              data.general.sucursal || "-";
          if (document.getElementById("contrato-label"))
            document.getElementById("contrato-label").textContent =
              data.general.contrato || "-";
        }
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
              detalles.equipo_intervenir || "-";
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
          // También mapear equipo_intervenir correctamente
          if (document.getElementById("descripcion-trabajo-label"))
            document.getElementById("descripcion-trabajo-label").textContent =
              detalles.descripcion_trabajo || "-";
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
