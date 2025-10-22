// Mostrar nombres de responsable y operador del área en la sección de aprobaciones
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (!idPermiso) return;
  fetch(`http://localhost:3000/api/autorizaciones/personas/${idPermiso}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.success && data.data) {
        const responsable = document.getElementById("nombre-responsable-area");
        const operador = document.getElementById("nombre-operador-area");
        if (responsable)
          responsable.textContent = data.data.responsable_area || "-";
        if (operador) operador.textContent = data.data.operador_area || "-";
      }
    })
    .catch((err) => {
      console.error("Error al obtener responsables de área:", err);
    });
});

document.addEventListener("DOMContentLoaded", function () {
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
                <td>${act.acciones_preventivas || act.descripcion || ""}</td>
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
          // Asignar campos generales igual que en el área
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
              data.general.solicitante || "-";
          if (document.getElementById("sucursal-label"))
            document.getElementById("sucursal-label").textContent =
              data.general.sucursal || "-";
          if (document.getElementById("contrato-label"))
            document.getElementById("contrato-label").textContent =
              data.general.contrato || "-";
          if (document.getElementById("work-order-label"))
            document.getElementById("work-order-label").textContent =
              data.general.ot_numero || "-";
          // Sección Equipo
          if (document.getElementById("equipment-intervene-label"))
            document.getElementById("equipment-intervene-label").textContent =
              "";
          if (document.getElementById("equipment-label"))
            document.getElementById("equipment-label").textContent =
              data.general.tiene_equipo_intervenir || "-";
          if (document.getElementById("tag-label"))
            document.getElementById("tag-label").textContent =
              data.general.tag || "-";
          // Formulario Usuario
          if (document.getElementById("special-tools-label"))
            document.getElementById("special-tools-label").textContent =
              data.general.requiere_herramientas_especiales || "-";
          if (document.getElementById("what-special-tools-label"))
            document.getElementById("what-special-tools-label").textContent =
              data.general.tipo_herramientas_especiales || "-";
          if (document.getElementById("adequate-tools-label"))
            document.getElementById("adequate-tools-label").textContent =
              data.general.herramientas_adecuadas || "-";
          if (document.getElementById("pre-verification-label"))
            document.getElementById("pre-verification-label").textContent =
              data.general.requiere_verificacion_previa || "-";
          if (document.getElementById("risk-knowledge-label"))
            document.getElementById("risk-knowledge-label").textContent =
              data.general.requiere_conocer_riesgos || "-";
          if (document.getElementById("final-observations-label"))
            document.getElementById("final-observations-label").textContent =
              data.general.observaciones_medidas || "-";
          // ...agrega aquí más campos si los necesitas...
          // Rellenar requisitos y condiciones del proceso
          if (data && data.general) {
            document.getElementById("resp-fuera-operacion").textContent =
              data.general.fuera_operacion || "-";
            document.getElementById("resp-despresurizado-purgado").textContent =
              data.general.despresurizado_purgado || "-";
            document.getElementById("resp-necesita-aislamiento").textContent =
              data.general.necesita_aislamiento || "-";
            document.getElementById("resp-con-valvulas").textContent =
              data.general.con_valvulas || "-";
            document.getElementById("resp-con-juntas-ciegas").textContent =
              data.general.con_juntas_ciegas || "-";
            document.getElementById("resp-producto-entrampado").textContent =
              data.general.producto_entrampado || "-";
            document.getElementById("resp-requiere-lavado").textContent =
              data.general.requiere_lavado || "-";
            document.getElementById("resp-requiere-neutralizado").textContent =
              data.general.requiere_neutralizado || "-";
            document.getElementById("resp-requiere-vaporizado").textContent =
              data.general.requiere_vaporizado || "-";
            document.getElementById(
              "resp-suspender-trabajos-adyacentes"
            ).textContent = data.general.suspender_trabajos_adyacentes || "-";
            document.getElementById("resp-acordonar-area").textContent =
              data.general.acordonar_area || "-";
            document.getElementById(
              "resp-prueba-gas-toxico-inflamable"
            ).textContent = data.general.prueba_gas_toxico_inflamable || "-";
            document.getElementById(
              "resp-equipo-electrico-desenergizado"
            ).textContent = data.general.equipo_electrico_desenergizado || "-";
            document.getElementById("resp-tapar-purgas-drenajes").textContent =
              data.general.tapar_purgas_drenajes || "-";
            // Condiciones del proceso
            document.getElementById("fluid").textContent =
              data.general.fluido || "-";
            document.getElementById("pressure").textContent =
              data.general.presion || "-";
            document.getElementById("temperature").textContent =
              data.general.temperatura || "-";
          }
        }
        // Campos generales PT2
        if (data && data.data) {
          const detalles = data.data;
          // Ajuste de nombres de campos según el objeto recibido
          if (document.getElementById("start-time-label"))
            document.getElementById("start-time-label").textContent =
              detalles.hora_inicio || "-";
          if (document.getElementById("fecha-label"))
            document.getElementById("fecha-label").textContent =
              detalles.fecha || "-";
          if (document.getElementById("activity-type-label"))
            document.getElementById("activity-type-label").textContent =
              detalles.tipo_mantenimiento || "-";
          if (document.getElementById("plant-label"))
            document.getElementById("plant-label").textContent =
              detalles.area || "-";
          if (document.getElementById("descripcion-trabajo-label"))
            document.getElementById("descripcion-trabajo-label").textContent =
              detalles.descripcion_trabajo || "-";
          if (document.getElementById("empresa-label"))
            document.getElementById("empresa-label").textContent =
              detalles.empresa || "-";
          if (document.getElementById("nombre-solicitante-label"))
            document.getElementById("nombre-solicitante-label").textContent =
              detalles.solicitante || "-";
          if (document.getElementById("sucursal-label"))
            document.getElementById("sucursal-label").textContent =
              detalles.sucursal || "-";
          if (document.getElementById("contrato-label"))
            document.getElementById("contrato-label").textContent =
              detalles.contrato || "-";
          if (document.getElementById("work-order-label"))
            document.getElementById("work-order-label").textContent =
              detalles.ot_numero || "-";
          // Sección Equipo
          if (document.getElementById("equipment-intervene-label"))
            document.getElementById("equipment-intervene-label").textContent =
              detalles.tiene_equipo_intervenir ? "SI" : "NO";
          if (document.getElementById("equipment-label")) {
            console.log(
              "Valor de tiene_equipo_intervenir:",
              detalles.tiene_equipo_intervenir
            );
            document.getElementById("equipment-label").textContent =
              detalles.tiene_equipo_intervenir !== null &&
              detalles.tiene_equipo_intervenir !== undefined
                ? detalles.tiene_equipo_intervenir
                : "-";
          }
          if (document.getElementById("tag-label"))
            document.getElementById("tag-label").textContent =
              detalles.tag || "-";
          // Formulario Usuario
          if (document.getElementById("special-tools-label"))
            document.getElementById("special-tools-label").textContent =
              detalles.requiere_herramientas_especiales || "-";
          if (document.getElementById("what-special-tools-label"))
            document.getElementById("what-special-tools-label").textContent =
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
          // Condiciones del Proceso
          if (document.getElementById("fluid"))
            document.getElementById("fluid").textContent =
              detalles.fluido || "-";
          if (document.getElementById("pressure"))
            document.getElementById("pressure").textContent =
              detalles.presion || "-";
          if (document.getElementById("temperature"))
            document.getElementById("temperature").textContent =
              detalles.temperatura || "-";
        }
        // Rellenar AST y Participantes igual que PT1
        if (data && data.ast) {
          mostrarAST(data.ast);
        }
        if (data && data.actividades_ast) {
          mostrarActividadesAST(data.actividades_ast);
        }
        if (data && data.participantes_ast) {
          mostrarParticipantesAST(data.participantes_ast);
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });
  }
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    });
  }

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
              fecha_hora_supervisor: new Date().toISOString(),
            }),
          }
        );
      } catch (err) {
        console.error("Error al actualizar supervisor y categoría:", err);
      }

      // 1.5 Actualizar requisitos de riesgos y pruebas de gas
      // Obtener valores del formulario
      function getRadioValue(name) {
        const radios = document.getElementsByName(name);
        for (let r of radios) {
          if (r.checked) return r.value;
        }
        return "";
      }
      const special_protection = getRadioValue("special-protection");
      const skin_protection = getRadioValue("skin-protection");
      const respiratory_protection = getRadioValue("respiratory-protection");
      const eye_protection = getRadioValue("eye-protection");
      const fire_protection = getRadioValue("fire-protection");
      const fire_protection_type =
        document.getElementById("fire-protection-type")?.value || "";
      const barriers_required = getRadioValue("barriers-required");
      const observations = document.getElementById("observations")?.value || "";

      // Pruebas de gas
      const co2_level = document.getElementsByName("co2")[0]?.value || "";
      const nh3_level = document.getElementsByName("amonico")[0]?.value || "";
      const oxygen_level =
        document.getElementsByName("oxigeno")[0]?.value || "";
      const lel_level = document.getElementsByName("lel")[0]?.value || "";

      // Pruebas de gas
      const aprobado_co2 = getRadioValue("aprobado_co2");
      const aprobado_nh3 = getRadioValue("aprobado_amonico");
      const aprobado_oxigeno = getRadioValue("aprobado_oxigeno");
      const aprobado_lel = getRadioValue("aprobado_lel");

      const proteccion_especial_recomendada = special_protection;
      const proteccion_piel_cuerpo = skin_protection;
      const proteccion_respiratoria = respiratory_protection;
      const proteccion_ojos_cara = eye_protection;
      const proteccion_contra_incendio = fire_protection;
      const tipo_proteccion_incendio = fire_protection_type;
      const requiere_barreras = barriers_required;
      const observaciones = observations;
      const nivel_co2 = co2_level;
      const nivel_nh3 = nh3_level;
      const nivel_oxigeno = oxygen_level;
      const nivel_lel = lel_level;

      // Actualizar requisitos de supervisor y pruebas
      try {
        await fetch(
          `http://localhost:3000/api/pt-apertura/requisitos_supervisor/${idPermiso}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              proteccion_especial_recomendada,
              proteccion_piel_cuerpo,
              proteccion_respiratoria,
              proteccion_ojos_cara,
              proteccion_contra_incendio,
              tipo_proteccion_incendio,
              requiere_barreras,
              observaciones,
              nivel_co2,
              nivel_nh3,
              nivel_oxigeno,
              nivel_lel,
              aprobado_co2,
              aprobado_nh3,
              aprobado_oxigeno,
              aprobado_lel,
            }),
          }
        );
      } catch (err) {
        console.error(
          "Error al actualizar requisitos supervisor y pruebas:",
          err
        );
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
      // 3. Actualizar el estatus a "activo"
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
      const confirmationModal = document.getElementById("confirmation-modal");
      if (confirmationModal) {
        confirmationModal.style.display = "flex";
        // Mostrar el número de permiso en el modal
        const permitSpan = document.getElementById("generated-permit");
        if (permitSpan) {
          permitSpan.textContent = idPermiso;
        }
        // Botón cerrar del modal
        const closeBtn = document.getElementById("close-confirmation-modal");
        if (closeBtn) {
          closeBtn.onclick = function () {
            window.location.href = "/Modules/SupSeguridad/supseguridad.html";
          };
        }
      } else {
        // Fallback si no existe el modal
        alert("Permiso autorizado correctamente");
        window.location.href = "/Modules/SupSeguridad/supseguridad.html";
      }
    });
  }

  // --- Lógica para el botón "No Autorizar" ---
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
                  fecha_hora_supervisor: new Date().toISOString(),
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

  // Cargar supervisores en el select
  fetch("http://localhost:3000/api/supervisores")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador");
      if (select) {
        select.innerHTML =
          '<option value="" disabled selected>Seleccione un supervisor...</option>';
        data.forEach((sup) => {
          const option = document.createElement("option");
          option.value = sup.nombre; // Igual que PT1: value=nombre
          option.textContent = sup.nombre;
          select.appendChild(option);
        });
      }
    });

  fetch("http://localhost:3000/api/categorias")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador2");
      if (select) {
        select.innerHTML =
          '<option value="" disabled selected>Seleccione una categoria...</option>';
        data.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.nombre; // Igual que PT1: value=nombre
          option.textContent = cat.nombre;
          select.appendChild(option);
        });
      }
    });

  const radios = document.getElementsByName("fire-protection");
  const textarea = document.getElementById("fire-protection-type");
  // Busca la fila <tr> que contiene la etiqueta y el textarea
  let tr = textarea.closest("tr");
  function toggleTextarea() {
    const selected = Array.from(radios).find((r) => r.checked);
    if (selected && selected.value === "SI") {
      tr.style.display = "";
      textarea.disabled = false;
      textarea.style.background = "#fff";
    } else {
      textarea.value = "";
      textarea.disabled = true;
      textarea.style.background = "#eee";
      tr.style.display = "none";
    }
  }
  radios.forEach((radio) => {
    radio.addEventListener("change", toggleTextarea);
  });
  // Inicializa el estado al cargar
  toggleTextarea();

  const modalCloseBtn = document.getElementById("modal-close-btn");
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    });
  }
});
