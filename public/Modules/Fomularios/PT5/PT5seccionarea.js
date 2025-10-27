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
    // Construir payload - solo campos que existen en el HTML
    const payload = {
      fuera_operacion: getRadio("equipo_fuera_operacion"),
      despresurizado_purgado: getRadio("equipo_despresionado_purgado"),
      producto_entrampado: getRadio("producto_entrampado"),
      necesita_aislamiento: getRadio("equipo_tuberia_fuera_operacion"),
      con_juntas_ciegas: getRadio("equipo_tuberia_aislado_junta_ciega"),
      requiere_lavado: getRadio("equipo_tuberia_lavado_vaporizado"),
      requiere_neutralizado: getRadio("residuos_interior"),
      requiere_vaporizado: getRadio("prueba_explosividad_interior"),
      suspender_trabajos_adyacentes: getRadio("prueba_explosividad_exterior"),
      prueba_gas_toxico_inflamable: getRadio("acumulacion_gases_combustion"),
      equipo_electrico_desenergizado: getRadio("permisos_trabajos_adicionales"),
      acordonar_area: getRadio("acordonar_area"),
      tapar_purgas_drenajes: getRadio("equipo_contraincendio"),
      // Medidas/requisitos del ejecutor
      ventilacion_forzada: getRadio("ventilacion_forzada"),
      limpieza_interior: getRadio("limpieza_interior"),
      instalo_ventilacion_forzada: getRadio("instalo_ventilacion_forzada"),
      equipo_conectado_tierra: getRadio("equipo_conectado_tierra"),
      cables_pasan_drenajes: getRadio("cables_pasan_drenajes"),
      cables_uniones_intermedias: getRadio("cables_uniones_intermedias"),
      equipo_proteccion_personal: getRadio("equipo_proteccion_personal"),
      // Condiciones del proceso
      fluido: document.getElementById("fluid").value,
      presion: document.getElementById("pressure").value,
      temperatura: document.getElementById("temperature").value,
    };
    try {
      const resp = await fetch(`/api/pt-fuego/requisitos_area/${idPermiso}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
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

      // Generar timestamp automático para autorización PT5 (hora local)
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
        "[AUTORIZAR PT5] Timestamp generado (hora local):",
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
      // Mostrar modal de confirmación y número de permiso (igual que PT4)
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
        // Generar timestamp automático para rechazo PT5 (hora local)
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
          "[NO AUTORIZAR PT5] Timestamp generado (hora local):",
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
  console.log("Consultando permiso de fuego con id:", idPermiso);
  fetch(`/api/pt-fuego/${idPermiso}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Respuesta de la API:", data);
      if (data && data.success && data.data) {
        const permiso = data.data;
        console.log("Valores del permiso recibidos:", permiso);
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
        // Radios de requisitos - mapear desde backend a nombres HTML existentes
        const radioMappings = [
          { backend: "fuera_operacion", html: "equipo_fuera_operacion" },
          {
            backend: "despresurizado_purgado",
            html: "equipo_despresionado_purgado",
          },
          { backend: "producto_entrampado", html: "producto_entrampado" },
          {
            backend: "necesita_aislamiento",
            html: "equipo_tuberia_fuera_operacion",
          },
          {
            backend: "con_juntas_ciegas",
            html: "equipo_tuberia_aislado_junta_ciega",
          },
          {
            backend: "requiere_lavado",
            html: "equipo_tuberia_lavado_vaporizado",
          },
          { backend: "requiere_neutralizado", html: "residuos_interior" },
          {
            backend: "requiere_vaporizado",
            html: "prueba_explosividad_interior",
          },
          {
            backend: "suspender_trabajos_adyacentes",
            html: "prueba_explosividad_exterior",
          },
          {
            backend: "prueba_gas_toxico_inflamable",
            html: "acumulacion_gases_combustion",
          },
          {
            backend: "equipo_electrico_desenergizado",
            html: "permisos_trabajos_adicionales",
          },
          { backend: "acordonar_area", html: "acordonar_area" },
          { backend: "tapar_purgas_drenajes", html: "equipo_contraincendio" },
          // Medidas/requisitos del ejecutor
          { backend: "ventilacion_forzada", html: "ventilacion_forzada" },
          { backend: "limpieza_interior", html: "limpieza_interior" },
          {
            backend: "instalo_ventilacion_forzada",
            html: "instalo_ventilacion_forzada",
          },
          {
            backend: "equipo_conectado_tierra",
            html: "equipo_conectado_tierra",
          },
          { backend: "cables_pasan_drenajes", html: "cables_pasan_drenajes" },
          {
            backend: "cables_uniones_intermedias",
            html: "cables_uniones_intermedias",
          },
          {
            backend: "equipo_proteccion_personal",
            html: "equipo_proteccion_personal",
          },
        ];
        radioMappings.forEach((mapping) => {
          if (permiso[mapping.backend]) {
            const radio = document.querySelector(
              `input[name='${mapping.html}'][value='${
                permiso[mapping.backend]
              }']`
            );
            if (radio) radio.checked = true;
          }
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
      // Construir payload - solo campos que existen en el HTML
      const payload = {
        fuera_operacion: getRadio("equipo_fuera_operacion"),
        despresurizado_purgado: getRadio("equipo_despresionado_purgado"),
        producto_entrampado: getRadio("producto_entrampado"),
        necesita_aislamiento: getRadio("equipo_tuberia_fuera_operacion"),
        con_juntas_ciegas: getRadio("equipo_tuberia_aislado_junta_ciega"),
        requiere_lavado: getRadio("equipo_tuberia_lavado_vaporizado"),
        requiere_neutralizado: getRadio("residuos_interior"),
        requiere_vaporizado: getRadio("prueba_explosividad_interior"),
        suspender_trabajos_adyacentes: getRadio("prueba_explosividad_exterior"),
        prueba_gas_toxico_inflamable: getRadio("acumulacion_gases_combustion"),
        equipo_electrico_desenergizado: getRadio(
          "permisos_trabajos_adicionales"
        ),
        acordonar_area: getRadio("acordonar_area"),
        tapar_purgas_drenajes: getRadio("equipo_contraincendio"),
        // Medidas/requisitos del ejecutor
        ventilacion_forzada: getRadio("ventilacion_forzada"),
        limpieza_interior: getRadio("limpieza_interior"),
        instalo_ventilacion_forzada: getRadio("instalo_ventilacion_forzada"),
        equipo_conectado_tierra: getRadio("equipo_conectado_tierra"),
        cables_pasan_drenajes: getRadio("cables_pasan_drenajes"),
        cables_uniones_intermedias: getRadio("cables_uniones_intermedias"),
        equipo_proteccion_personal: getRadio("equipo_proteccion_personal"),
      };
      try {
        const resp = await fetch(`/api/pt-fuego/requisitos_area/${idPermiso}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
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
        console.log(data); // Muestra el objeto completo en formato expandible
        // Prefijo en el título y descripción del trabajo
        if (data && data.general) {
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
          setText("prefijo-label", data.general.prefijo || "-");
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
          if (document.getElementById("descripcion-trabajo-label"))
            document.getElementById("descripcion-trabajo-label").textContent =
              detalles.descripcion_trabajo || "-";
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
});

// Salir: redirigir a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function () {
    window.location.href = "/Modules/Usuario/AutorizarPT.html";
  });
}
