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
    // Construir payload con todos los campos requeridos por el backend
    // ...dentro del btnGuardarCampos.addEventListener...
    const payload = {
      fluido: document.getElementById("fluid")?.value || "",
      presion: document.getElementById("pressure")?.value || "",
      temperatura: document.getElementById("temperature")?.value || "",
    };
    try {
      const resp = await fetch(`/api/pt-altura/requisitos_area/${idPermiso}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const respText = await resp.text();
      console.error("Respuesta del backend:", resp.status, respText);
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
        const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
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
          const respEstatus = await fetch("/api/estatus/seguridad", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadEstatus),
          });
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

      // Generar timestamp automático para autorización PT4 (hora local)
      const nowArea = new Date();
      const year = nowArea.getFullYear();
      const month = String(nowArea.getMonth() + 1).padStart(2, "0");
      const day = String(nowArea.getDate()).padStart(2, "0");
      const hours = String(nowArea.getHours()).padStart(2, "0");
      const minutes = String(nowArea.getMinutes()).padStart(2, "0");
      const seconds = String(nowArea.getSeconds()).padStart(2, "0");
      const milliseconds = String(nowArea.getMilliseconds()).padStart(3, "0");
      const fechaHoraAutorizacionArea = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
      console.log(
        "[AUTORIZAR PT4] Timestamp generado (hora local):",
        fechaHoraAutorizacionArea
      );

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
      if (permitNumber) {
        permitNumber.textContent = idPermiso || "-";
      }
      // La redirección se hace al cerrar el modal (ver evento modal-close-btn)

      // Cierre del modal y redirección
      document.getElementById("modal-close-btn").onclick = function () {
        const confirmationModal = document.getElementById("confirmation-modal");
        if (confirmationModal) confirmationModal.style.display = "none";
        window.location.href = "/Modules/Usuario/AutorizarPT.html";
      };
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
        // Generar timestamp automático para rechazo PT4 (hora local)
        const nowRechazoArea = new Date();
        const year = nowRechazoArea.getFullYear();
        const month = String(nowRechazoArea.getMonth() + 1).padStart(2, "0");
        const day = String(nowRechazoArea.getDate()).padStart(2, "0");
        const hours = String(nowRechazoArea.getHours()).padStart(2, "0");
        const minutes = String(nowRechazoArea.getMinutes()).padStart(2, "0");
        const seconds = String(nowRechazoArea.getSeconds()).padStart(2, "0");
        const milliseconds = String(nowRechazoArea.getMilliseconds()).padStart(
          3,
          "0"
        );
        const fechaHoraRechazoArea = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
        console.log(
          "[NO AUTORIZAR PT4] Timestamp generado (hora local):",
          fechaHoraRechazoArea
        );

        // Guardar comentario y responsable en la tabla de autorizaciones
        await fetch("/api/autorizaciones/area", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            responsable_area,
            encargado_area: operador_area,
            comentario_no_autorizar: comentario,
            fecha_hora_area: fechaHoraRechazoArea,
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
  console.log("Consultando permiso de altura con id:", idPermiso);
  fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Datos recibidos de verformularios:", data); // <-- Esto muestra los datos en la consola
      if (data && data.general) {
        const d = data.general;
        // Mapeo de campos generales
        setText("maintenance-type-label", d.tipo_mantenimiento || "-");
        setText("work-order-label", d.ot_numero || "-");
        setText("tag-label", d.tag || "-");
        setText("start-time-label", d.hora_inicio || "-");
        setText("fecha-label", d.fecha || "-");
        setText("activity-type-label", d.tipo_mantenimiento || "-");
        setText("plant-label", d.area || "-");
        setText("descripcion-trabajo-label", d.descripcion_trabajo || "-");
        setText("empresa-label", d.empresa || "-");
        setText("nombre-solicitante-label", d.solicitante || "-");
        setText("sucursal-label", d.sucursal || "-");
        setText("contrato-label", d.contrato || "-");
        setText("work-order-label", d.ot_numero || "-");
        setText("equipment-label", d.equipo_intervencion || "-");
        setText("tag-label", d.tag || "-");
        setText("requiere-escalera-label", d.requiere_escalera || "-");
        setText("tipo-escalera-label", d.tipo_escalera || "-");
        setText("requiere-canastilla-label", d.requiere_canastilla_grua || "-");
        setText("aseguramiento-estrobo-label", d.aseguramiento_estrobo || "-");
        setText(
          "requiere-andamio-label",
          d.requiere_andamio_cama_completa || "-"
        );
        setText("requiere-otro-acceso-label", d.otro_tipo_acceso || "-");
        setText("cual-acceso-label", d.cual_acceso || "-");
        setText(
          "acceso-libre-obstaculos-label",
          d.acceso_libre_obstaculos || "-"
        );
        setText("canastilla-asegurada-label", d.canastilla_asegurada || "-");
        setText("andamio-completo-label", d.andamio_completo || "-");
        setText(
          "andamio-seguros-zapatas-label",
          d.andamio_seguros_zapatas || "-"
        );
        setText("escaleras-buen-estado-label", d.escaleras_buen_estado || "-");
        setText("linea-vida-segura-label", d.linea_vida_segura || "-");
        setText(
          "arnes-completo-buen-estado-label",
          d.arnes_completo_buen_estado || "-"
        );
        setText(
          "suspender-trabajos-adyacentes-label",
          d.suspender_trabajos_adyacentes || "-"
        );
        setText(
          "numero-personas-autorizadas-label",
          d.numero_personas_autorizadas || "-"
        );
        setText(
          "trabajadores-aptos-evaluacion-label",
          d.trabajadores_aptos_evaluacion || "-"
        );
        setText("requiere-barreras-label", d.requiere_barreras || "-");
        setText("observaciones-label", d.observaciones || "-");
      } else {
        console.warn("Estructura de datos inesperada o datos faltantes:", data);
      }
    })
    .catch((err) => {
      console.error("Error al consultar la API de verformularios:", err);
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
        fluido: document.getElementById("fluid")?.value || "",
        presion: document.getElementById("pressure")?.value || "",
        temperatura: document.getElementById("temperature")?.value || "",
      };
      try {
        const resp = await fetch(
          `/api/pt-altura/requisitos_area/${idPermiso}`,
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
        if (data && data.general) {
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          document.getElementById("descripcion-trabajo-label").textContent =
            data.general.descripcion_trabajo || "-";
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

  // Obtener el id_permiso de la URL (ejemplo: ?id=123)
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data && data.data) {
          const d = data.data;
          document.getElementById("maintenance-type-label").textContent =
            d.tipo_mantenimiento || "-";
          document.getElementById("work-order-label").textContent =
            d.ot_numero || "-";
          document.getElementById("tag-label").textContent = d.tag || "-";
          document.getElementById("start-time-label").textContent =
            d.hora_inicio || "-";
          document.getElementById("equipment-description-label").textContent =
            d.equipo_intervencion || "-";

          // ANÁLISIS DE REQUISITOS PARA EFECTUAR EL TRABAJO
          //  document.getElementById("requiere-escalera-label").textContent =
          //  d.requiere_escalera || "-";
          //   const el = document.getElementById("requiere-escalera-label");
          // console.log("Elemento existe:", el); // Debe mostrar el elemento <p>

          document.getElementById("tipo-escalera-label").textContent =
            d.tipo_escalera !== undefined ? d.tipo_escalera : "-";
          document.getElementById(
            "requiere-canastilla-grua-label"
          ).textContent = d.requiere_canastilla_grua || "-";
          document.getElementById("aseguramiento-estrobo-label").textContent =
            d.aseguramiento_estrobo || "-";
          document.getElementById("requiere-andamio_cama-label").textContent =
            d.requiere_andamio_cama_completa || "-";
          document.getElementById("otro-tipo-acceso-label").textContent =
            d.otro_tipo_acceso || "-";
          document.getElementById("cual-acceso-label").textContent =
            d.cual_acceso !== undefined ? d.cual_acceso : "-";

          // MEDIDAS PARA ADMINISTRAR LOS RIESGOS (SI/NO/N/A)
          // Utilidad para mostrar SI/NO/N/A
          function setRadioLabel(baseId, value) {
            document.getElementById(`${baseId}-si`).textContent =
              value === "SI" ? "✔️" : "";
            document.getElementById(`${baseId}-no`).textContent =
              value === "NO" ? "✔️" : "";
            document.getElementById(`${baseId}-na`).textContent =
              value === "N/A" ? "✔️" : "";
          }

          setRadioLabel("acceso-libre-obstaculos", d.acceso_libre_obstaculos);
          setRadioLabel("canastilla-asegurada", d.canastilla_asegurada);
          setRadioLabel("andamio-completo", d.andamio_completo);
          setRadioLabel("andamio-seguros-zapatas", d.andamio_seguros_zapatas);
          setRadioLabel("escaleras-buen-estado", d.escaleras_buen_estado);
          setRadioLabel("linea-vida-segura", d.linea_vida_segura);
          setRadioLabel(
            "arnes-completo-buen-estado",
            d.arnes_completo_buen_estado
          );
          setRadioLabel(
            "suspender-trabajos-adyacentes",
            d.suspender_trabajos_adyacentes
          );
          document.getElementById(
            "numero-personas-autorizadas-label"
          ).textContent = d.numero_personas_autorizadas || "-";
          setRadioLabel(
            "trabajadores-aptos-evaluacion",
            d.trabajadores_aptos_evaluacion
          );
          setRadioLabel("requiere-barreras", d.requiere_barreras);
          document.getElementById("observaciones-label").textContent =
            d.observaciones || "-";
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
