document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // 0. Configurar botón de cierre del modal
  // ==============================
  const modalCloseBtn = document.getElementById("modal-close-btn");
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/CrearPT.html";
    });
  }

  // ==============================
  // 1. Agregar y eliminar actividades con re-numeración
  // ==============================
  const addActivityBtn = document.getElementById("add-activity");
  const astActivitiesContainer = document.querySelector(".ast-activities");

  // Función para re-numerar actividades y actualizar los atributos name
  function renumerarActividades() {
    const activities = astActivitiesContainer.querySelectorAll(".ast-activity");
    activities.forEach((activity, idx) => {
      const newIndex = idx + 1;
      activity.setAttribute("data-index", newIndex);
      // Columna No.: número automático
      const numberDiv = activity.querySelector(".ast-activity-number");
      if (numberDiv) {
        numberDiv.textContent = newIndex;
      }
      // Actualiza los names de los campos
      const activityTextarea = activity.querySelector(
        'textarea[name^="ast-activity-"]'
      );
      if (activityTextarea) activityTextarea.name = `ast-activity-${newIndex}`;
      const selectPersonnel = activity.querySelector(
        'select[name^="ast-personnel-"]'
      );
      if (selectPersonnel) selectPersonnel.name = `ast-personnel-${newIndex}`;
      const textareaHazards = activity.querySelector(
        'textarea[name^="ast-hazards-"]'
      );
      if (textareaHazards) textareaHazards.name = `ast-hazards-${newIndex}`;
      const textareaPreventions = activity.querySelector(
        'textarea[name^="ast-preventions-"]'
      );
      if (textareaPreventions)
        textareaPreventions.name = `ast-preventions-${newIndex}`;
      const selectResponsible = activity.querySelector(
        'select[name^="ast-responsible-"]'
      );
      if (selectResponsible)
        selectResponsible.name = `ast-responsible-${newIndex}`;
    });
  }

  // Actualizar el div de secuencia en tiempo real
  if (astActivitiesContainer) {
    // Ya no es necesario actualizar el número con el texto, solo renumerar si se elimina o agrega
  }

  if (addActivityBtn && astActivitiesContainer) {
    addActivityBtn.addEventListener("click", async function () {
      const activityCount = document.querySelectorAll(".ast-activity").length;
      const newIndex = activityCount + 1;

      if (newIndex > 10) {
        alert("Máximo 10 actividades permitidas");
        return;
      }

      // Obtener participantes filtrados por estatus desde el backend
      let participantes = [];
      try {
        const idEstatus = sessionStorage.getItem("id_estatus");
        const response = await fetch(
          `/api/participantes?id_estatus=${idEstatus}`
        );
        participantes = await response.json();
      } catch (error) {
        console.error("Error al obtener participantes:", error);
      }

      // Crear opciones
      let options = '<option value="">-- Seleccione --</option>';
      participantes.forEach((part) => {
        if (Number.isInteger(part.id_ast_participan)) {
          options += `<option value="${part.id_ast_participan}">${part.nombre}</option>`;
        }
      });

      // Crear actividad
      const newActivity = document.createElement("div");
      newActivity.className = "ast-activity";
      newActivity.setAttribute("data-index", newIndex);
      newActivity.innerHTML = `
                <div class="ast-activity-number">${newIndex}</div>
                <div class="ast-activity-field">
                    <textarea name="ast-activity-${newIndex}" rows="2" required></textarea>
                </div>
                <div class="ast-activity-field">
                    <select name="ast-personnel-${newIndex}" required>
                        ${options}
                    </select>
                </div>
                <div class="ast-activity-field">
                    <textarea name="ast-hazards-${newIndex}" rows="2" required></textarea>
                </div>
                <div class="ast-activity-field">
                    <textarea name="ast-preventions-${newIndex}" rows="2" required></textarea>
                </div>
                <div class="ast-activity-field">
                    <select name="ast-responsible-${newIndex}" required>
                        ${options}
                    </select>
                </div>
                <div class="ast-activities-actions">
                        <button type="button" class="action-btn remove-participant" title="Eliminar">
                                    <i class="ri-delete-bin-line"></i>
                        </button>
                </div>
            `;
      astActivitiesContainer.appendChild(newActivity);
      // No es necesario renumerar aquí, solo al eliminar
    });

    // Delegación de eventos para eliminar actividades y renumerar
    astActivitiesContainer.addEventListener("click", function (event) {
      if (event.target.closest(".remove-participant")) {
        const activityDiv = event.target.closest(".ast-activity");
        if (activityDiv) {
          activityDiv.remove();
          renumerarActividades();
        }
      }
    });
  }

  if (astActivitiesContainer) {
    astActivitiesContainer.addEventListener("click", function (event) {
      if (event.target.closest(".remove-participant")) {
        const activityDiv = event.target.closest(".ast-activity");
        if (activityDiv) activityDiv.remove();
      }
    });
  }

  // ==============================
  // 2. Manejar envío del formulario principal
  // ==============================
  const permitForm = document.getElementById("complete-permit-form");
  if (permitForm) {
    permitForm.addEventListener("submit", async function (e) {
      // ==============================
      // Generar timestamp local para la base de datos
      // Usar la función obtenerFechaHoraLocal para obtener la hora exacta local
      const fecha_hora = obtenerFechaHoraLocal();
      // ==============================

      // Validar que plant_value no esté vacío antes de continuar
      let plantValue = sessionStorage.getItem("plant_value");
      // Si no está en sessionStorage, intenta leer del input hidden
      if (!plantValue || isNaN(parseInt(plantValue, 10))) {
        const plantIdHidden = document.getElementById("plant-id-hidden");
        if (
          plantIdHidden &&
          plantIdHidden.value &&
          !isNaN(parseInt(plantIdHidden.value, 10))
        ) {
          plantValue = plantIdHidden.value;
          sessionStorage.setItem("plant_value", plantValue); // Sincroniza por si acaso
        }
      }
      if (!plantValue || isNaN(parseInt(plantValue, 10))) {
        // Mostrar advertencia visual en el input de área si existe
        const plantInput = document.getElementById("plant");
        let warning = document.getElementById("plant-warning");
        if (plantInput && !warning) {
          warning = document.createElement("div");
          warning.id = "plant-warning";
          warning.style.color = "#d9534f";
          warning.style.fontSize = "0.95em";
          warning.style.marginTop = "4px";
          warning.textContent =
            "Debe seleccionar un área válida de la lista antes de continuar.";
          plantInput.parentNode.insertBefore(warning, plantInput.nextSibling);
        }
        alert(
          "Debe seleccionar un área válida de la lista antes de continuar."
        );
        e.preventDefault();
        return;
      }
      // Log para ver el valor de plant_value justo antes de leerlo
      console.log(
        "[DEBUG] (submit) sessionStorage.plant_value:",
        sessionStorage.getItem("plant_value")
      );
      e.preventDefault();

      const submitBtn = permitForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="ri-loader-4-line ri-spin"></i> Procesando...';

      // Obtener el valor del número de contrato (opcional)
      const contrato =
        document.getElementById("contract-number")?.value || null;

      // Validación rápida: no permitir enviar si falta la hora
      const horaInput = document.getElementById("start-time");
      if (horaInput && !horaInput.value) {
        alert(
          "Por favor, selecciona una hora de inicio antes de enviar el formulario."
        );
        e.preventDefault();
        return;
      }
      try {
        // === Validar sección 4
        const section4 = document.querySelector(
          '.form-section[data-section="4"]'
        );
        const requiredFields = section4.querySelectorAll("[required]");
        let allFilled = true;

        requiredFields.forEach((field) => {
          if (!field.value.trim()) {
            field.style.borderColor = "#ff4444";
            allFilled = false;
            field.addEventListener(
              "input",
              function () {
                this.style.borderColor = "";
              },
              { once: true }
            );
          }
        });

        if (!allFilled) {
          const modal = document.getElementById("confirmation-modal");
          if (modal) {
            modal.querySelector("h3").textContent =
              "Campos requeridos faltantes";
            modal.querySelector("p").textContent =
              "Por favor completa todos los campos obligatorios antes de guardar el permiso.";
            modal.classList.add("active");
          } else {
            alert(
              "Por favor completa todos los campos obligatorios antes de guardar el permiso."
            );
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }

        // Recuperar y validar los ids
        const id_area = parseInt(sessionStorage.getItem("plant_value"), 10);
        // Obtener id del departamento del usuario logueado
        let id_departamento = 1;
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        if (usuario && usuario.id) {
          id_departamento = Number(usuario.id);
        }
        const id_sucursal = parseInt(sessionStorage.getItem("id_sucursal"), 10);
        const id_tipo_permiso = Number(
          sessionStorage.getItem("id_tipo_permiso")
        );
        console.log("[DEBUG] id_tipo_permiso:", id_tipo_permiso);
        const id_estatus = parseInt(sessionStorage.getItem("id_estatus"), 10);
        const id_ast = parseInt(sessionStorage.getItem("id_ast"), 10) || 1;

        // Log para depuración
        console.log(
          "[DEBUG] id_area:",
          id_area,
          "plant_value:",
          sessionStorage.getItem("plant_value")
        );
        console.log("[DEBUG] id_departamento:", id_departamento);
        console.log(
          "[DEBUG] id_sucursal:",
          id_sucursal,
          "id_sucursal_raw:",
          sessionStorage.getItem("id_sucursal")
        );
        console.log("[DEBUG] id_tipo_permiso:", id_tipo_permiso);
        console.log(
          "[DEBUG] id_estatus:",
          id_estatus,
          "id_estatus_raw:",
          sessionStorage.getItem("id_estatus")
        );
        console.log(
          "[DEBUG] id_ast:",
          id_ast,
          "id_ast_raw:",
          sessionStorage.getItem("id_ast")
        );

        // Validar que todos los ids sean números válidos
        if (
          [
            id_area,
            id_departamento,
            id_sucursal,
            id_tipo_permiso,
            id_estatus,
            id_ast,
          ].some((v) => isNaN(v) || typeof v !== "number")
        ) {
          alert(
            "Error: Debe seleccionar correctamente todas las listas (área, sucursal, estatus, etc)."
          );
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }

        // 1. Insertar permiso
        const permisoResponse = await fetch("/api/permisos-trabajo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_area,
            id_departamento,
            id_sucursal,
            id_tipo_permiso,
            id_estatus,
            id_ast,
            contrato, // Siempre enviar el campo contrato
            fecha_hora, // Enviar la hora normalizada
          }),
        });
        const permisoResult = await permisoResponse.json();
        if (!permisoResponse.ok || !permisoResult.success)
          throw new Error(
            permisoResult.error || "Error al guardar permiso de trabajo"
          );

        const id_permiso =
          permisoResult.data.id_permiso || permisoResult.data.id;

        let exito = false;

        try {
          // 1. Insertar permiso de trabajo (esto siempre)
          const permisoResult = await insertarPermisoTrabajo();
          if (permisoResult.success) exito = true;

          // Obtener el tipo de formulario desde sessionStorage
          const tipoFormulario = Number(
            sessionStorage.getItem("id_tipo_permiso")
          );
          console.log("[DEBUG] tipoFormulario:", tipoFormulario);

          // Según el tipo de formulario, insertar en la tabla correspondiente
          if (tipoFormulario === 1) {
            // Insertar en pt_no_peligroso
            const noPeligrosoResult = await insertarPtNoPeligroso();
            if (noPeligrosoResult.success) exito = true;
          } else if (tipoFormulario === 2) {
            // Insertar en pt_Apertura
            const aperturaResult = await insertarPtApertura();
            if (aperturaResult.success) exito = true;
          }

          if (exito) {
            mostrarMensajeExito();
          } else {
            mostrarMensajeError();
          }
        } catch (error) {
          mostrarMensajeError();
        }

        // ==============================
        // INICIO BLOQUE: IF para tipoFormulario
        // Aquí inicia el condicional para el tipo de formulario
        // ==============================
        // Obtener el tipo de formulario desde sessionStorage
        const tipoFormulario = Number(
          sessionStorage.getItem("id_tipo_permiso")
        );

        // Imprimir el valor antes de entrar al if
        console.log("[DEBUG] tipoFormulario:", tipoFormulario);

        // Cambiar según el formulario que se esté usando
        if (tipoFormulario === 1) {
          // ==============================
          // INICIO BLOQUE: Insertar PT no peligroso
          // Este bloque inicia la lógica para insertar el permiso de trabajo no peligroso
          // ==============================

          // 2. Insertar PT no peligroso
          const nombre_solicitante =
            document.getElementById("applicant")?.value || null;
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || null;
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || null;
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          const ot_no = document.getElementById("work-order")?.value || null;
          const equipo_intervenir =
            document.getElementById("equipment")?.value || null;
          const fecha =
            document.getElementById("permit-date")?.value || "2025-08-19";
          const hora = document.getElementById("start-time")?.value || "08:00";
          const hora_inicio = `${fecha} ${hora}`;
          const tag = document.getElementById("tag")?.value || null;
          const fluido = document.getElementById("fluid")?.value || null;
          const presion = document.getElementById("pressure")?.value || null;
          const temperatura =
            document.getElementById("temperature")?.value || null;
          const empresa = document.getElementById("company")?.value || null;

          // Obtener el valor de equipo_intervencion para PT1
          const equipo_intervencion =
            document.getElementById("equipment")?.value || "";
          // CREA el objeto una sola vez
          const datosNoPeligroso = {
            id_permiso,
            nombre_solicitante: nombre_solicitante || "",
            descripcion_trabajo: descripcion_trabajo || "",
            tipo_mantenimiento: tipo_mantenimiento || "",
            ot_no: ot_no || "",
            equipo_intervencion: equipo_intervencion || "",
            hora_inicio: hora_inicio || "",
            tag: tag || "",
            fluido: fluido || "",
            presion: presion || "",
            temperatura: temperatura || "",
            empresa: empresa || "",
            trabajo_area_riesgo_controlado:
              document.querySelector('input[name="risk-area"]:checked')
                ?.value || "",
            necesita_entrega_fisica:
              document.querySelector('input[name="physical-delivery"]:checked')
                ?.value || "",
            necesita_ppe_adicional:
              document.querySelector('input[name="additional-ppe"]:checked')
                ?.value || "",
            area_circundante_riesgo:
              document.querySelector('input[name="surrounding-risk"]:checked')
                ?.value || "",
            necesita_supervision:
              document.querySelector('input[name="supervision-needed"]:checked')
                ?.value || "",
            observaciones_analisis_previo:
              document.getElementById("pre-work-observations")?.value || "",
          };

          // Ahora sí puedes imprimir el objeto y enviarlo
          console.log(
            "[DEBUG] Datos a enviar PT No Peligroso:",
            datosNoPeligroso
          );

          const ptResponse = await fetch("/api/pt-no-peligroso", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosNoPeligroso),
          });
          const ptResult = await ptResponse.json();
          if (!ptResponse.ok || !ptResult.success)
            throw new Error(
              ptResult.error || "Error al guardar PT No Peligroso"
            );

          // ==============================
          // FIN BLOQUE: Insertar PT no peligroso
          // Este bloque termina la lógica para insertar el permiso de trabajo no peligroso
          // ==============================
        } else if (tipoFormulario === 2) {
          // ==============================
          // INICIO BLOQUE: Insertar otro tipo de PT (PT Apertura)
          // Aquí inicia la lógica para insertar el permiso de apertura de equipo o línea
          // ==============================

          // Obtener valores del formulario PT2.html
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || null;
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          let otro_tipo_mantenimiento = null; // Ya no se usa

          const ot_numero =
            document.getElementById("work-order")?.value || null;
          const tag = document.getElementById("tag")?.value || null;
          const fecha = document.getElementById("permit-date")?.value || "";
          const hora = document.getElementById("start-time")?.value || "";
          const hora_inicio = `${fecha} ${hora}`;
          // Solo agregar tiene_equipo_intervencion si existe en el DOM
          const inputEquipoIntervencion = document.querySelector(
            'input[name="has-equipment"]:checked'
          );
          let tiene_equipo_intervencion = null;
          if (inputEquipoIntervencion) {
            tiene_equipo_intervencion = inputEquipoIntervencion.value;
          }
          const descripcion_equipo =
            document.getElementById("equipment")?.value || null;
          const fluido = document.getElementById("fluid")?.value || null;
          const presion = document.getElementById("pressure")?.value || null;
          const temperatura =
            document.getElementById("temperature")?.value || null;
          const antecedentes =
            document.getElementById("background")?.value || null;

          // Medidas para administrar los riesgos
          const requiere_herramientas_especiales =
            document.querySelector('input[name="special-tools"]:checked')
              ?.value || null;
          const tipo_herramientas_especiales =
            document.getElementById("special-tools-type")?.value || null;
          const herramientas_adecuadas =
            document.querySelector('input[name="adequate-tools"]:checked')
              ?.value || null;
          const requiere_verificacion_previa =
            document.querySelector('input[name="pre-verification"]:checked')
              ?.value || null;
          const requiere_conocer_riesgos =
            document.querySelector('input[name="risk-knowledge"]:checked')
              ?.value || null;
          const observaciones_medidas =
            document.getElementById("final-observations")?.value || null;

          // Requisitos para efectuar el trabajo
          const fuera_operacion =
            document.querySelector('input[name="out-of-operation"]:checked')
              ?.value || null;
          const despresurizado_purgado =
            document.querySelector('input[name="depressurized"]:checked')
              ?.value || null;
          const necesita_aislamiento =
            document.querySelector('input[name="isolated"]:checked')?.value ||
            null;
          const con_valvulas =
            document.querySelector('input[name="with-valves"]:checked')
              ?.value || null;
          const con_juntas_ciegas =
            document.querySelector('input[name="with-blinds"]:checked')
              ?.value || null;
          const producto_entrampado =
            document.querySelector('input[name="trapped-product"]:checked')
              ?.value || null;
          const requiere_lavado =
            document.querySelector('input[name="requires-washing"]:checked')
              ?.value || null;
          const requiere_neutralizado =
            document.querySelector(
              'input[name="requires-neutralization"]:checked'
            )?.value || null;
          const requiere_vaporizado =
            document.querySelector('input[name="requires-steaming"]:checked')
              ?.value || null;
          const suspender_trabajos_adyacentes =
            document.querySelector(
              'input[name="adjacent-work-suspended"]:checked'
            )?.value || null;
          const acordonar_area =
            document.querySelector('input[name="area-cordoned"]:checked')
              ?.value || null;
          const prueba_gas_toxico_inflamable =
            document.querySelector('input[name="gas-test-required"]:checked')
              ?.value || null;
          const equipo_electrico_desenergizado =
            document.querySelector('input[name="de-energized"]:checked')
              ?.value || null;
          const tapar_purgas_drenajes =
            document.querySelector('input[name="drains-covered"]:checked')
              ?.value || null;

          // Requisitos para administrar los riesgos
          const proteccion_especial_recomendada =
            document.querySelector('input[name="special-protection"]:checked')
              ?.value || null;
          const proteccion_piel_cuerpo =
            document.querySelector('input[name="skin-protection"]:checked')
              ?.value || null;
          const proteccion_respiratoria =
            document.querySelector(
              'input[name="respiratory-protection"]:checked'
            )?.value || null;
          const proteccion_ocular =
            document.querySelector('input[name="eye-protection"]:checked')
              ?.value || null;
          const proteccion_contraincendio =
            document.querySelector('input[name="fire-protection"]:checked')
              ?.value || null;
          const tipo_proteccion_contraincendio =
            document.getElementById("fire-protection-type")?.value || null;
          const instalacion_barreras =
            document.querySelector('input[name="barriers-required"]:checked')
              ?.value || null;
          const observaciones_riesgos =
            document.getElementById("observations")?.value || null;

          // Registro de pruebas requeridas
          const co2_nivel = document.getElementById("co2-level")?.value || null;
          const nh3_nivel = document.getElementById("nh3-level")?.value || null;
          const oxigeno_nivel =
            document.getElementById("oxygen-level")?.value || null;

          const lel_nivel = document.getElementById("lel-level")?.value || null;
          // Obtener campos compartidos igual que PT No Peligroso
          const empresa = document.getElementById("company")?.value || null;
          const nombre_solicitante =
            document.getElementById("applicant")?.value || null;
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || null;

          // Construir el objeto de datos para enviar
          const datosApertura = {
            id_permiso,
            tipo_mantenimiento,
            otro_tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_a_intervenir: descripcion_equipo, // Este campo se insertará en la columna correspondiente
            tiene_equipo_intervenir: descripcion_equipo, // Insertar el texto del input directamente en la columna
            fluido,
            presion,
            temperatura,
            antecedentes,
            requiere_herramientas_especiales,
            tipo_herramientas_especiales,
            herramientas_adecuadas,
            requiere_verificacion_previa,
            requiere_conocer_riesgos,
            observaciones_medidas,
            fuera_operacion,
            despresurizado_purgado,
            necesita_aislamiento,
            con_valvulas,
            con_juntas_ciegas,
            producto_entrampado,
            requiere_lavado,
            requiere_neutralizado,
            requiere_vaporizado,
            suspender_trabajos_adyacentes,
            acordonar_area,
            prueba_gas_toxico_inflamable,
            equipo_electrico_desenergizado,
            tapar_purgas_drenajes,
            proteccion_especial_recomendada,
            proteccion_piel_cuerpo,
            proteccion_respiratoria,
            proteccion_ocular,
            proteccion_contraincendio,
            tipo_proteccion_contraincendio,
            instalacion_barreras,
            observaciones_riesgos,
            co2_nivel,
            nh3_nivel,
            oxigeno_nivel,
            lel_nivel,
            empresa,
            nombre_solicitante,
            descripcion_trabajo,
          };

          // Enviar los datos al backend (PT Apertura)
          const aperturaResponse = await fetch("/api/pt-apertura", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosApertura),
          });
          const aperturaResult = await aperturaResponse.json();
          if (!aperturaResponse.ok || !aperturaResult.success)
            throw new Error(
              aperturaResult.error || "Error al guardar PT Apertura"
            );
          // FIN BLOQUE: Insertar otro tipo de PT
          // Aquí termina la lógica para otro tipo de permiso de trabajo
          // ==============================

          // ...existing code...
        } else if (tipoFormulario === 3) {
          // ==============================
          // INICIO BLOQUE: Insertar PT Entrada a Espacios Confinados
          // ==============================

          // Información general
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || "";
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          const ot_numero = document.getElementById("work-order")?.value || "";
          const tag = document.getElementById("tag")?.value || "";
          const hora = document.getElementById("start-time")?.value || "";
          const fecha = document.getElementById("permit-date")?.value || "";
          const hora_inicio = `${fecha} ${hora}`;
          const equipo_intervencion =
            document.getElementById("equipment")?.value || "";

          // Medidas/Requisitos para administrar los riesgos
          const warning_signs =
            document.querySelector('input[name="warning-signs"]:checked')
              ?.value || "";
          const explosion_proof_lighting =
            document.querySelector(
              'input[name="explosion-proof-lighting"]:checked'
            )?.value || "";
          const forced_ventilation =
            document.querySelector('input[name="forced-ventilation"]:checked')
              ?.value || "";
          const medical_evaluation =
            document.querySelector('input[name="medical-evaluation"]:checked')
              ?.value || "";
          const lifeline =
            document.querySelector('input[name="lifeline"]:checked')?.value ||
            "";
          const external_watch =
            document.querySelector('input[name="external-watch"]:checked')
              ?.value || "";
          const external_watch_name =
            document.querySelector('input[name="external-watch-name"]')
              ?.value || "";
          const rescue_personnel =
            document.querySelector('input[name="rescue-personnel"]:checked')
              ?.value || "";
          const rescue_personnel_name =
            document.querySelector('input[name="rescue-personnel-name"]')
              ?.value || "";
          const barriers =
            document.querySelector('input[name="barriers"]:checked')?.value ||
            "";
          const special_equipment =
            document.querySelector('input[name="special-equipment"]:checked')
              ?.value || "";
          const special_equipment_type =
            document.querySelector('input[name="special-equipment-type"]')
              ?.value || "";

          // Datos compactos
          const authorized_personnel =
            document.getElementById("authorized-personnel")?.value || "";
          const stay_time = document.getElementById("stay-time")?.value || "";
          const recovery_time =
            document.getElementById("recovery-time")?.value || "";
          const confined_space_type =
            document.getElementById("confined-space-type")?.value || "";

          // Observaciones
          const observations =
            document.getElementById("observations")?.value || "";

          // Campos generales
          const empresa = document.getElementById("company")?.value || "";
          const nombre_solicitante =
            document.getElementById("applicant")?.value || "";
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || "";

          // Construir el objeto de datos para enviar
          const datosEspacioConfinado = {
            id_permiso,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervencion:
              document.getElementById("equipment")?.value || "", // <--- CAMBIA AQUÍ
            avisos_trabajos: warning_signs,
            iluminacion_prueba_explosion: explosion_proof_lighting,
            ventilacion_forzada: forced_ventilation,
            evaluacion_medica_aptos: medical_evaluation,
            cable_vida_trabajadores: lifeline,
            vigilancia_exterior: external_watch,
            nombre_vigilante: external_watch_name,
            personal_rescatista: rescue_personnel,
            nombre_rescatista: rescue_personnel_name,
            instalar_barreras: barriers,
            equipo_especial: special_equipment,
            tipo_equipo_especial: special_equipment_type,
            numero_personas_autorizadas: authorized_personnel,
            tiempo_permanencia_min: stay_time,
            tiempo_recuperacion_min: recovery_time,
            clase_espacio_confinado: confined_space_type,
            observaciones_adicionales: observations,
            descripcion_trabajo,
            nombre_solicitante,
            empresa,
            contrato, // <-- AGREGA ESTA LÍNEA
          };

          // Imprimir en consola lo que se enviará
          console.log(
            "[DEBUG] Datos a enviar PT Espacios Confinados:",
            datosEspacioConfinado
          );

          // Enviar los datos al backend
          const espacioConfinadoResponse = await fetch("/api/pt-confinados", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosEspacioConfinado),
          });
          const espacioConfinadoResult = await espacioConfinadoResponse.json();
          if (!espacioConfinadoResponse.ok || !espacioConfinadoResult.success)
            throw new Error(
              espacioConfinadoResult.error ||
                "Error al guardar PT Espacios Confinados"
            );
          // ==============================
          // FIN BLOQUE: Insertar PT Entrada a Espacios Confinados
          // ==============================
        } else if (tipoFormulario === 4) {
          // ==============================
          // INICIO BLOQUE: Insertar PT Altura
          // ==============================
          // Recabar datos de la sección 4 (Permiso de Trabajo en Altura)

          // Obtener tipo de mantenimiento correctamente (manejar OTRO)
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || "";
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          const ot_numero = document.getElementById("work-order")?.value || "";
          const tag = document.getElementById("tag")?.value || "";
          const hora = document.getElementById("start-time")?.value || "";
          const fecha = document.getElementById("permit-date")?.value || "";
          const hora_inicio = fecha ? `${fecha} ${hora}` : hora;
          // Leer correctamente el campo de equipo a intervenir
          const equipo_intervencion =
            document.getElementById("equipment")?.value || "";
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || "";
          const nombre_solicitante =
            document.getElementById("applicant")?.value || "";
          const empresa = document.getElementById("company")?.value || "";

          // Medidas/Requisitos para Administrar los Riesgos
          const requiere_escalera =
            document.querySelector('input[name="warning-signs"]:checked')
              ?.value || "";
          const tipo_escalera =
            document.getElementById("input-escalera")?.value || "";
          const requiere_canastilla_grua =
            document.querySelector(
              'input[name="explosion-proof-lighting"]:checked'
            )?.value || "";
          const aseguramiento_estrobo =
            document.querySelector('input[name="forced-ventilation"]:checked')
              ?.value || "";
          const requiere_andamio_cama_completa =
            document.querySelector('input[name="medical-evaluation"]:checked')
              ?.value || "";
          const otro_tipo_acceso =
            document.querySelector('input[name="lifeline"]:checked')?.value ||
            "";
          const cual_acceso =
            document.getElementById("input-acceso")?.value || "";

          // Medidas para administrar los riesgos
          const acceso_libre_obstaculos =
            document.querySelector('input[name="barriers"]:checked')?.value ||
            "";
          const canastilla_asegurada =
            document.querySelector('input[name="lifeline2"]:checked')?.value ||
            "";
          const andamio_completo =
            document.querySelector('input[name="lifeline3"]:checked')?.value ||
            "";
          const andamio_seguros_zapatas =
            document.querySelector('input[name="barriers2"]:checked')?.value ||
            "";
          const escaleras_buen_estado =
            document.querySelector('input[name="barriers3"]:checked')?.value ||
            "";
          const linea_vida_segura =
            document.querySelector('input[name="lifeline4"]:checked')?.value ||
            "";
          const arnes_completo_buen_estado =
            document.querySelector('input[name="lifeline5"]:checked')?.value ||
            "";
          const suspender_trabajos_adyacentes =
            document.querySelector('input[name="lifeline6"]:checked')?.value ||
            "";
          const numero_personas_autorizadas =
            document.querySelector('input[name="lifeline7"]:checked')?.value ||
            "";
          const trabajadores_aptos_evaluacion =
            document.querySelector('input[name="lifeline8"]:checked')?.value ||
            "";
          const requiere_barreras =
            document.querySelector('input[name="lifeline9"]:checked')?.value ||
            "";
          const observaciones =
            document.getElementById("observations")?.value || "";

          const cantidad_personas_autorizadas =
            document.getElementById("input-personas-autorizadas")?.value || "";

          // Construir el objeto de datos para enviar
          const datosAltura = {
            id_permiso,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervencion,
            descripcion_trabajo,
            nombre_solicitante,
            empresa,
            requiere_escalera,
            requiere_canastilla_grua,
            aseguramiento_estrobo,
            requiere_andamio_cama_completa,
            otro_tipo_acceso,
            acceso_libre_obstaculos,
            canastilla_asegurada,
            andamio_completo,
            andamio_seguros_zapatas,
            escaleras_buen_estado,
            linea_vida_segura,
            arnes_completo_buen_estado,
            suspender_trabajos_adyacentes,
            numero_personas_autorizadas,
            trabajadores_aptos_evaluacion,
            requiere_barreras,
            observaciones,
            tipo_escalera,
            cual_acceso,
            cantidad_personas_autorizadas,
          };

          // Imprimir en consola lo que se enviará
          console.log("[DEBUG] Datos a enviar PT Altura:", datosAltura);

          // Enviar los datos al backend
          const alturaResponse = await fetch("/api/pt_altura", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosAltura),
          });
          const alturaResult = await alturaResponse.json();
          if (!alturaResponse.ok || !alturaResult.success)
            throw new Error(alturaResult.error || "Error al guardar PT Altura");
          // ==============================
          // FIN BLOQUE: Insertar PT Altura
          // ==============================
        } else if (tipoFormulario === 5) {
          // ==============================
          // INICIO BLOQUE: Insertar PT Fuego Abierto
          // ==============================

          // Información general
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || "";
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          const ot_numero = document.getElementById("work-order")?.value || "";
          const tag = document.getElementById("tag")?.value || "";
          const hora = document.getElementById("start-time")?.value || "";
          const fecha = document.getElementById("permit-date")?.value || "";
          const hora_inicio = fecha ? `${fecha} ${hora}` : hora;
          // Leer correctamente el campo de equipo a intervenir
          const equipo_intervencion =
            document.getElementById("equipment")?.value || "";
          const empresa = document.getElementById("company")?.value || "";
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || "";
          const nombre_solicitante =
            document.getElementById("applicant")?.value || "";

          // Construir el objeto de datos para enviar
          const datosFuegoAbierto = {
            id_permiso,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervencion: equipo_intervencion,
            empresa,
            descripcion_trabajo,
            nombre_solicitante, // <-- NUEVO
          };

          // Imprimir en consola lo que se enviará
          console.log(
            "[DEBUG] Datos a enviar PT Fuego Abierto:",
            datosFuegoAbierto
          );

          // Enviar los datos al backend (ajusta la URL según tu endpoint real)
          const fuegoAbiertoResponse = await fetch("/api/pt-fuego", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosFuegoAbierto),
          });
          const fuegoAbiertoResult = await fuegoAbiertoResponse.json();
          if (!fuegoAbiertoResponse.ok || !fuegoAbiertoResult.success)
            throw new Error(
              fuegoAbiertoResult.error || "Error al guardar PT Fuego Abierto"
            );

          // ==============================
          // FIN BLOQUE: Insertar PT Fuego Abierto
          // ==============================
        } else if (tipoFormulario === 6) {
          // ==============================
          // INICIO BLOQUE: Insertar PT Energía Eléctrica
          // ==============================

          // Información general
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || "";
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          const ot_numero = document.getElementById("work-order")?.value || "";
          const tag = document.getElementById("tag")?.value || "";
          const hora = document.getElementById("start-time")?.value || "";
          const fecha = document.getElementById("permit-date")?.value || "";
          const hora_inicio = fecha ? `${fecha} ${hora}` : hora;
          // Leer correctamente el campo de equipo a intervenir
          const equipo_intervencion =
            document.getElementById("equipment")?.value || "";
          const empresa = document.getElementById("company")?.value || "";
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || "";
          const nombre_solicitante =
            document.getElementById("applicant")?.value || "";

          // Medidas/Requisitos para administrar los riesgos
          const equipo_desenergizado =
            document.querySelector('input[name="barriers"]:checked')?.value ||
            "";
          const interruptores_abiertos =
            document.querySelector(
              'input[name="interruptores_abiertos"]:checked'
            )?.value || "";
          const verificar_ausencia_voltaje =
            document.querySelector(
              'input[name="verificar_ausencia_voltaje"]:checked'
            )?.value || "";
          const candados_equipo =
            document.querySelector('input[name="candados_equipo"]:checked')
              ?.value || "";
          const tarjetas_alerta =
            document.querySelector('input[name="tarjetas_alerta"]:checked')
              ?.value || "";
          const aviso_personal_area =
            document.querySelector('input[name="aviso_personal_area"]:checked')
              ?.value || "";
          const tapetes_dielectricos =
            document.querySelector('input[name="tapetes_dielectricos"]:checked')
              ?.value || "";
          const herramienta_aislante =
            document.querySelector('input[name="herramienta_aislante"]:checked')
              ?.value || "";
          const pertiga_telescopica =
            document.querySelector('input[name="pertiga_telescopica"]:checked')
              ?.value || "";
          const equipo_proteccion_especial =
            document.querySelector(
              'input[name="equipo_proteccion_especial"]:checked'
            )?.value || "";
          const tipo_equipo_proteccion =
            document.querySelector('input[name="special-equipment-type"]')
              ?.value || "";
          const aterrizar_equipo =
            document.querySelector('input[name="aterrizar_equipo"]:checked')
              ?.value || "";
          const barricadas_area =
            document.querySelector('input[name="barricadas_area"]:checked')
              ?.value || "";
          const observaciones_adicionales =
            document.getElementById("observations")?.value || "";

          // Construir el objeto de datos para enviar
          const datosEnergiaElectrica = {
            id_permiso,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervencion: equipo_intervencion,
            empresa,
            descripcion_trabajo,
            nombre_solicitante,
            equipo_desenergizado,
            interruptores_abiertos,
            verificar_ausencia_voltaje,
            candados_equipo,
            tarjetas_alerta,
            aviso_personal_area,
            tapetes_dielectricos,
            herramienta_aislante,
            pertiga_telescopica,
            equipo_proteccion_especial,
            tipo_equipo_proteccion,
            aterrizar_equipo,
            barricadas_area,
            observaciones_adicionales,
          };

          // Imprimir en consola lo que se enviará
          console.log(
            "[DEBUG] Datos a enviar PT Energía Eléctrica:",
            datosEnergiaElectrica
          );

          // Enviar los datos al backend
          const energiaElectricaResponse = await fetch("/api/pt-electrico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosEnergiaElectrica),
          });
          const energiaElectricaResult = await energiaElectricaResponse.json();
          if (!energiaElectricaResponse.ok || !energiaElectricaResult.success)
            throw new Error(
              energiaElectricaResult.error ||
                "Error al guardar PT Energía Eléctrica"
            );

          // ==============================
          // FIN BLOQUE: Insertar PT Energía Eléctrica
          // ==============================
        } else if (tipoFormulario === 7) {
          // ==============================
          // INICIO BLOQUE: Insertar PT Fuentes Radioactivas
          // ==============================

          // Información general
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || "";
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          const ot_numero = document.getElementById("work-order")?.value || "";
          const tag = document.getElementById("tag")?.value || "";
          const hora = document.getElementById("start-time")?.value || "";
          const fecha = document.getElementById("permit-date")?.value || "";
          const hora_inicio = fecha ? `${fecha} ${hora}` : hora;
          // Leer correctamente el campo de equipo a intervenir
          const equipo_intervencion =
            document.getElementById("equipment")?.value || "";
          const empresa = document.getElementById("company")?.value || "";
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || "";
          const nombre_solicitante =
            document.getElementById("applicant")?.value || "";

          // Campos específicos para fuentes radioactivas
          const tipo_fuente_radiactiva =
            document.getElementById("tipo-fuente-radiactiva")?.value || "";
          const actividad_radiactiva =
            document.getElementById("actividad-radiactiva")?.value || "";
          const numero_serial_fuente =
            document.getElementById("numero-serial-fuente")?.value || "";
          const distancia_trabajo =
            document.getElementById("distancia-trabajo")?.value || "";
          const tiempo_exposicion =
            document.getElementById("tiempo-exposicion")?.value || "";
          const dosis_estimada =
            document.getElementById("dosis-estimada")?.value || "";

          // Medidas de protección radiológica
          const equipo_proteccion_radiologica =
            document.querySelector(
              'input[name="equipo-proteccion-radiologica"]:checked'
            )?.value || "";
          const dosimetros_personales =
            document.querySelector(
              'input[name="dosimetros-personales"]:checked'
            )?.value || "";
          const monitores_radiacion_area =
            document.querySelector(
              'input[name="monitores-radiacion-area"]:checked'
            )?.value || "";
          const senalizacion_area =
            document.querySelector('input[name="senalizacion-area"]:checked')
              ?.value || "";
          const barricadas =
            document.querySelector('input[name="barricadas"]:checked')?.value ||
            "";
          const protocolo_emergencia =
            document.querySelector('input[name="protocolo-emergencia"]:checked')
              ?.value || "";
          const personal_autorizado =
            document.querySelector('input[name="personal-autorizado"]:checked')
              ?.value || "";

          // Información adicional
          const observaciones_radiacion =
            document.getElementById("observaciones-radiacion")?.value || "";

          // Construir el objeto de datos para enviar
          const datosFuentesRadioactivas = {
            id_permiso,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervencion,
            empresa,
            descripcion_trabajo,
            nombre_solicitante,
            tipo_fuente_radiactiva,
            actividad_radiactiva,
            numero_serial_fuente,
            distancia_trabajo,
            tiempo_exposicion,
            dosis_estimada,
            equipo_proteccion_radiologica,
            dosimetros_personales,
            monitores_radiacion_area,
            senalizacion_area,
            barricadas,
            protocolo_emergencia,
            personal_autorizado,
            observaciones_radiacion,
          };

          // Imprimir en consola lo que se enviará
          console.log(
            "[DEBUG] Datos a enviar PT Fuentes Radioactivas:",
            datosFuentesRadioactivas
          );

          // Enviar los datos al backend
          const fuentesRadioactivasResponse = await fetch("/api/pt-radiacion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosFuentesRadioactivas),
          });
          const fuentesRadioactivasResult =
            await fuentesRadioactivasResponse.json();
          if (
            !fuentesRadioactivasResponse.ok ||
            !fuentesRadioactivasResult.success
          )
            throw new Error(
              fuentesRadioactivasResult.error ||
                "Error al guardar PT Fuentes Radioactivas"
            );

          // ==============================
          // FIN BLOQUE: Insertar PT Fuentes Radioactivas
          // ==============================
        } else if (tipoFormulario === 8) {
          // ==============================
          // INICIO BLOQUE: Insertar PT Izaje
          // ==============================

          // Recoge los valores de los campos del formulario de Izaje
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || "";
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          const ot_numero = document.getElementById("work-order")?.value || "";
          const tag = document.getElementById("tag")?.value || "";
          const hora = document.getElementById("start-time")?.value || "";
          const fecha = document.getElementById("permit-date")?.value || "";
          const duracionInicio =
            document.getElementById("duracion-inicio")?.value || "";
          const hora_inicio = duracionInicio
            ? duracionInicio.split("T")[1]
            : "";

          const hora_inicio_prevista = duracionInicio
            ? duracionInicio.split("T")[1]
            : "";

          const duracionFin =
            document.getElementById("duracion-fin")?.value || "";
          const hora_fin_prevista = duracionFin
            ? duracionFin.split("T")[1]
            : "";

          const equipo_intervenir =
            document.getElementById("equipment")?.value || "";
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || "";
          const nombre_solicitante =
            document.getElementById("applicant")?.value || "";
          const empresa = document.getElementById("company")?.value || "";

          // DATOS 1
          const responsable_operacion =
            document.getElementById("responsable-operacion")?.value || "";

          // DATOS 2

          const empresa_grua =
            document.getElementById("empresa-grua")?.value || "";
          const identificacion_grua =
            document.getElementById("identificacion-grua")?.value || "";

          // DATOS DEL OPERADOR
          // ELEMENTOS AUXILIARES DE IZADO
          const estrobos_eslingas = document.querySelectorAll(
            'input[name="licencia-operador"]'
          )[0]?.checked
            ? "si"
            : "no";
          const grilletes = document.querySelectorAll(
            'input[name="licencia-operador"]'
          )[1]?.checked
            ? "si"
            : "no";
          const otros_elementos_auxiliares = document.querySelectorAll(
            'input[name="licencia-operador"]'
          )[2]?.checked
            ? "si"
            : "no";
          const especificacion_otros_elementos =
            document.getElementById("otros-elementos")?.value || "";
          const requiere_eslingado_especifico = document.querySelectorAll(
            'input[name="licencia-operador"]'
          )[3]?.checked
            ? "si"
            : "no";
          const especificacion_eslingado =
            document.getElementById("licencia-operador")?.value || "";

          // CONFIGURACIÓN Y CARGA
          // Todos los radios usan name="tuberia-gas" y se diferencian por posición visual, así que tomamos el seleccionado
          const extension_gatos =
            document.querySelector('input[name="tuberia-gas"]:checked')
              ?.value || "";
          const sobre_ruedas = extension_gatos; // mismo grupo de radios
          const especificacion_sobre_ruedas =
            document.getElementById("otros-elementos")?.value || "";
          const utiliza_plumin_si = extension_gatos; // mismo grupo de radios
          const especificacion_plumin =
            document.getElementById("otros-elementos")?.value || "";
          const longitud_pluma =
            document.getElementById("longitud-pluma")?.value || "";
          const radio_trabajo =
            document.getElementById("radio-trabajo")?.value || "";
          const contrapeso = document.getElementById("contrapeso")?.value || "";
          const sector_trabajo =
            document.querySelector('input[name="sector-trabajo"]:checked')
              ?.value || "";
          const carga_segura_diagrama =
            document.getElementById("carga-segura")?.value || "";
          const peso_carga = document.getElementById("peso-carga")?.value || "";
          const determinada_por =
            document.getElementById("determinada-por")?.value || "";
          const carga_trabajo =
            document.getElementById("carga-de-trabajo")?.value || "";
          const peso_gancho_eslingas =
            document.getElementById("peso-carga")?.value || "";
          const relacion_carga_carga_segura =
            document.getElementById("especificar-plumin")?.value || "";

          // Comprobaciones (checkboxes)
          const asentamiento = document.querySelectorAll(
            'input[name="medida-declaracion-conformidad"]'
          )[1]?.checked
            ? "si"
            : "no";
          // Definir campos faltantes para evitar ReferenceError
          const tipo_licencia =
            document.getElementById("tipo-licencia")?.value || "";
          const comentarios_operador =
            document.getElementById("comentarios-operador")?.value || "";
          const nombre_operador =
            document.getElementById("nombre-operador")?.value || "";
          const empresa_operador =
            document.getElementById("empresa-operador")?.value || "";
          // Licencia operador: radio y texto
          const licencia_operador =
            document.querySelector(
              'input[name="licencia-operador-si-no"]:checked'
            )?.value || "";
          const numero_licencia =
            document.getElementById("numero-licencia")?.value || "";
          const fecha_emision_licencia =
            document.getElementById("permit-date")?.value || "";
          const vigencia_licencia =
            document.getElementById("vigencia")?.value || "";
          // --- Definición de variables PT Izaje ---
          // Checkboxes de medidas principales
          const declaracion_conformidad = document.querySelector(
            'input[name="medida-declaracion-conformidad"]'
          )?.checked
            ? "si"
            : "no";
          const inspeccion_periodica = document.querySelector(
            'input[name="medida-inspeccion-periodica"]'
          )?.checked
            ? "si"
            : "no";
          const mantenimiento_preventivo = document.querySelector(
            'input[name="medida-mantenimiento-preventivo"]'
          )?.checked
            ? "si"
            : "no";
          const inspeccion_diaria = document.querySelector(
            'input[name="medida-inspeccion-diaria"]'
          )?.checked
            ? "si"
            : "no";
          const diagrama_cargas = document.querySelector(
            'input[name="medida-diagrama-cargas"]'
          )?.checked
            ? "si"
            : "no";
          const libro_instrucciones = document.querySelector(
            'input[name="medida-libro-instrucciones"]'
          )?.checked
            ? "si"
            : "no";
          const limitador_carga = document.querySelector(
            'input[name="medida-limitador-carga"]'
          )?.checked
            ? "si"
            : "no";
          const final_carrera = document.querySelector(
            'input[name="medida-final-carrera"]'
          )?.checked
            ? "si"
            : "no";

          // DATOS DEL OPERADOR
          // ...variables ya definidas arriba, eliminar duplicados...
          const calzado = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="medida-inspeccion-periodica"]'
            )
          )[0]?.checked
            ? "si"
            : "no";
          const extension_gatos_check = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="medida-mantenimiento-preventivo"]'
            )
          )[0]?.checked
            ? "si"
            : "no";
          const nivelacion = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="medida-inspeccion-diaria"]'
            )
          )[0]?.checked
            ? "si"
            : "no";
          const contrapeso_check = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="medida-diagrama-cargas"]'
            )
          )[0]?.checked
            ? "si"
            : "no";
          const sector_trabajo_check = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="medida-libro-instrucciones"]'
            )
          )[0]?.checked
            ? "si"
            : "no";
          const comprobado_por =
            document.getElementById("comprobado-por")?.value || "";

          // MEDIDAS DE SEGURIDAD PREVIAS
          const balizamiento_operacion = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="licencia-operador"]'
            )
          )[4]?.checked
            ? "si"
            : "no";
          const reunion_previa = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="licencia-operador"]'
            )
          )[5]?.checked
            ? "si"
            : "no";
          const especificacion_reunion_previa =
            document.getElementById("reunion-previa")?.value || "";
          const presentacion_supervisor = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="licencia-operador"]'
            )
          )[6]?.checked
            ? "si"
            : "no";
          const nombre_supervisor =
            document.getElementById("presentacion-supervisor")?.value || "";
          const permiso_adicional = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="licencia-operador"]'
            )
          )[7]?.checked
            ? "si"
            : "no";
          const especificacion_permiso_adicional =
            document.getElementById("permiso-adicional")?.value || "";
          const otras_medidas_seguridad = Array.from(
            document.querySelectorAll(
              'input[type="checkbox"][name="licencia-operador"]'
            )
          )[8]?.checked
            ? "si"
            : "no";
          const especificacion_otras_medidas =
            document.getElementById("otras-medidas")?.value || "";

          // Observaciones generales
          const observaciones_generales =
            document.getElementById("observaciones-generales")?.value || "";

          // Construye el objeto de datos para enviar
          const datosIzaje = {
            id_permiso,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervenir,
            descripcion_trabajo,
            nombre_solicitante,
            empresa,
            hora_inicio_prevista,
            responsable_operacion,
            hora_fin_prevista,
            empresa_grua,
            identificacion_grua,
            declaracion_conformidad,
            inspeccion_periodica,
            mantenimiento_preventivo,
            inspeccion_diaria,
            diagrama_cargas,
            libro_instrucciones,
            limitador_carga,
            final_carrera,
            nombre_operador,
            empresa_operador,
            licencia_operador,
            numero_licencia,
            fecha_emision_licencia,
            vigencia_licencia,
            tipo_licencia,
            comentarios_operador,
            estrobos_eslingas,
            grilletes,
            otros_elementos_auxiliares,
            especificacion_otros_elementos,
            requiere_eslingado_especifico,
            especificacion_eslingado,
            extension_gatos,
            sobre_ruedas,
            especificacion_sobre_ruedas,
            utiliza_plumin_si,
            especificacion_plumin,
            longitud_pluma,
            radio_trabajo,
            contrapeso,
            sector_trabajo,
            carga_segura_diagrama,
            peso_carga,
            determinada_por,
            carga_trabajo,
            peso_gancho_eslingas,
            relacion_carga_carga_segura,
            asentamiento,
            calzado,
            extension_gatos_check,
            nivelacion,
            contrapeso_check,
            sector_trabajo_check,
            comprobado_por,
            balizamiento_operacion,
            reunion_previa,
            especificacion_reunion_previa,
            presentacion_supervisor,
            nombre_supervisor,
            permiso_adicional,
            especificacion_permiso_adicional,
            otras_medidas_seguridad,
            especificacion_otras_medidas,
            observaciones_generales,
          };

          // Imprime en consola lo que se enviará
          console.log("[DEBUG] Datos a enviar PT Izaje:", datosIzaje);

          // Enviar los datos al backend
          const izajeResponse = await fetch("/api/pt_izaje", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosIzaje),
          });
          const izajeResult = await izajeResponse.json();
          if (!izajeResponse.ok || !izajeResult.success)
            throw new Error(izajeResult.error || "Error al guardar PT Izaje");

          // ==============================
          // FIN BLOQUE: Insertar PT Izaje
          // ==============================
        } else if (tipoFormulario === 9) {
          // ==============================
          // INICIO BLOQUE: Insertar PT Cesta Izada
          // ==============================

          // DATOS GENERALES
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || "";
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          const ot_numero = document.getElementById("work-order")?.value || "";
          const tag = document.getElementById("tag")?.value || "";
          const hora = document.getElementById("start-time")?.value || "";
          const fecha = document.getElementById("permit-date")?.value || "";
          // Ajuste: solo la hora en formato HH:mm o HH:mm:ss y nunca enviar ''
          let hora_inicio = null;
          if (hora && hora.includes(":")) {
            hora_inicio =
              hora.split("T").length > 1 ? hora.split("T")[1] : hora;
          }
          const equipo_intervenir =
            document.getElementById("equipment")?.value || "";
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || "";
          const nombre_solicitante =
            document.getElementById("applicant")?.value || "";
          const empresa = document.getElementById("company")?.value || "";

          // DATOS DE LA GRÚA Y CESTA
          const identificacion_grua_cesta =
            document.getElementById("identificacion-grua")?.value || "";
          const empresa_grua_cesta =
            document.getElementById("perteneciente-empresa")?.value || "";
          const identificacion_cesta =
            document.getElementById("identificacion-cesta")?.value || "";
          const empresa_cesta =
            document.getElementById("perteneciente-empresa")?.value || "";
          const peso_cesta = document.getElementById("peso-cesta")?.value || "";
          const carga_maxima_cesta =
            document.getElementById("carga-maxima-cesta")?.value || "";
          const ultima_revision_cesta =
            document.getElementById("permit-date")?.value || "";

          // CONDICIONES DE ELEVACIÓN
          // (Si tienes checkboxes, deberás obtener su estado con .checked)
          const condicion = ""; // Puedes concatenar los checks activos si lo necesitas
          const especificacion_ext_gatos =
            document.getElementById("se-utiliza-plumin")?.value || "";
          const utiliza_plumin_cesta =
            document.querySelector('input[name="se-utiliza-plumin"]:checked')
              ?.value || "";
          const especificacion_plumin_cesta =
            document.getElementById("especificar-plumin")?.value || "";
          const longitud_pluma_cesta =
            document.getElementById("longitud-pluma")?.value || "";
          const radio_trabajo_cesta =
            document.getElementById("radio-trabajo")?.value || "";
          const carga_segura_cesta =
            document.getElementById("carga-segura")?.value || "";
          const peso_carga_cesta =
            document.getElementById("peso-carga")?.value || "";
          const peso_gancho_elementos =
            document.getElementById("peso-gancho-elementos")?.value || "";
          const carga_trabajo_cesta =
            document.getElementById("carga-de-trabajo")?.value || "";
          const relacion_carga_segura_cesta =
            document.getElementById("especificar-plumin")?.value || "";

          const peso_gancho_eslingas =
            document.getElementById("peso-gancho-eslingas")?.value || "";

          // PRUEBA PREVIA A SUSPENSIÓN
          const carga_prueba =
            document.getElementById("carga-prueba")?.value || "";
          const prueba_realizada =
            document.querySelector('input[name="prueba-realizada"]:checked')
              ?.value || "";
          const prueba_presenciada_por =
            document.getElementById("prueba-presenciada-por")?.value || "";
          const firma_prueba = document.getElementById("firma")?.value || "";
          const fecha_prueba =
            document.getElementById("permit-date")?.value || "";

          // MEDIDAS DE SEGURIDAD PREVIAS
          const mascaras_escape_cesta =
            document.getElementById("mascaras-escape")?.value || "";
          const especificacion_mascaras =
            document.getElementById("especificacion-mascaras")?.value || "";
          const equipo_proteccion_cesta =
            document.getElementById("equipo-proteccion")?.value || "";
          const especificacion_equipo_proteccion =
            document.getElementById("especificacion-equipo-proteccion")
              ?.value || "";
          const equipo_contra_incendios_cesta =
            document.getElementById("equipo-contra-incendios")?.value || "";
          const especificacion_equipo_incendios =
            document.getElementById("especificacion-equipo-incendios")?.value ||
            "";
          const final_carrera_cesta = ""; // Si tienes un checkbox, usa .checked
          const otras_medidas_cesta =
            document.getElementById("otras-medidas")?.value || "";
          const especificacion_otras_medidas_cesta =
            document.getElementById("especificacion-otras-medidas-cesta")
              ?.value || "";

          // OBSERVACIONES
          const observaciones_generales_cesta =
            document.getElementById("observaciones-generales")?.value || "";

          // Construir el objeto de datos para enviar
          const datosCesta = {
            id_permiso,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervenir,
            descripcion_trabajo,
            nombre_solicitante,
            empresa,
            identificacion_grua_cesta,
            empresa_grua_cesta,
            identificacion_cesta,
            carga_maxima_cesta,
            empresa_cesta,
            peso_cesta,
            ultima_revision_cesta,
            condicion,
            especificacion_ext_gatos,
            utiliza_plumin_cesta,
            especificacion_plumin_cesta,
            longitud_pluma_cesta,
            radio_trabajo_cesta,
            carga_segura_cesta,
            peso_carga_cesta,
            peso_gancho_elementos,
            carga_trabajo_cesta,
            relacion_carga_segura_cesta,
            carga_prueba,
            prueba_realizada,
            prueba_presenciada_por,
            firma_prueba,
            fecha_prueba,
            mascaras_escape_cesta,
            especificacion_mascaras,
            equipo_proteccion_cesta,
            especificacion_equipo_proteccion,
            equipo_contra_incendios_cesta,
            especificacion_equipo_incendios,
            final_carrera_cesta,
            otras_medidas_cesta,
            especificacion_otras_medidas_cesta,
            observaciones_generales_cesta,
          };

          // Imprimir en consola lo que se enviará
          console.log("[DEBUG] Datos a enviar PT Cesta Izada:", datosCesta);

          // Enviar los datos al backend
          const cestaResponse = await fetch("/api/cesta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosCesta),
          });
          const cestaResult = await cestaResponse.json();
          if (!cestaResponse.ok || !cestaResult.success)
            throw new Error(
              cestaResult.error || "Error al guardar PT Cesta Izada"
            );

          // ==============================
          // FIN BLOQUE: Insertar PT Cesta Izada
          // ==============================
        } else if (tipoFormulario === 10) {
          // ==============================
          // INICIO BLOQUE: Insertar PT Excavación/Perforación
          // ==============================

          // Información general
          let tipo_mantenimiento =
            document.getElementById("maintenance-type")?.value || "";
          if (tipo_mantenimiento === "OTRO") {
            const otroInput = document.getElementById("other-maintenance");
            if (otroInput && otroInput.value.trim()) {
              tipo_mantenimiento = otroInput.value.trim();
            }
          }
          const ot_numero = document.getElementById("work-order")?.value || "";
          const tag = document.getElementById("tag")?.value || "";
          const hora = document.getElementById("start-time")?.value || "";
          // Ajuste: solo la hora en formato HH:mm o HH:mm:ss y nunca enviar ''
          let hora_inicio = null;
          if (hora && hora.includes(":")) {
            hora_inicio =
              hora.split("T").length > 1 ? hora.split("T")[1] : hora;
          }
          const equipo_intervencion =
            document.getElementById("equipment")?.value || "";
          const descripcion_trabajo =
            document.getElementById("work-description")?.value || "";
          const nombre_solicitante =
            document.getElementById("applicant")?.value || "";
          const empresa = document.getElementById("company")?.value || "";

          // Dimensiones y Terreno
          const profundidad_media =
            document.getElementById("profundidad-media")?.value || "";
          const profundidad_maxima =
            document.getElementById("profundidad-maxima")?.value || "";
          const anchura = document.getElementById("anchura")?.value || "";
          const longitud = document.getElementById("longitud")?.value || "";
          const tipo_terreno =
            document.getElementById("tipo-terreno")?.value || "";

          // Instalaciones Subterráneas
          const tuberia_gas =
            document.querySelector('input[name="tuberia-gas"]:checked')
              ?.value || "";
          const gas_tipo = document.getElementById("gas-tipo")?.value || "";
          const tuberia_gas_comprobado =
            document.getElementById("tuberia-gas-comprobado")?.value || "";
          const permit_date_gas =
            document.getElementById("permit-date-gas")?.value || "";

          const linea_electrica =
            document.querySelector('input[name="linea-electrica"]:checked')
              ?.value || "";
          const linea_electrica_voltaje =
            document.getElementById("linea-electrica-voltaje")?.value || "";
          const linea_electrica_comprobado =
            document.getElementById("linea-electrica-comprobado")?.value || "";
          const permit_date_electrica =
            document.getElementById("permit-date-electrica")?.value || "";

          const tuberia_incendios =
            document.querySelector('input[name="tuberia-incendios"]:checked')
              ?.value || "";
          const tuberia_incendios_presion =
            document.getElementById("tuberia-incendios-presion")?.value || "";
          const tuberia_incendios_comprobado =
            document.getElementById("tuberia-incendios-comprobado")?.value ||
            "";
          const permit_date_incendios =
            document.getElementById("permit-date-incendios")?.value || "";

          const alcantarillado =
            document.querySelector('input[name="alcantarillado"]:checked')
              ?.value || "";
          const alcantarillado_diametro =
            document.getElementById("alcantarillado-diametro")?.value || "";
          const alcantarillado_comprobado =
            document.getElementById("alcantarillado-comprobado")?.value || "";
          const permit_date_alcantarillado =
            document.getElementById("permit-date-alcantarillado")?.value || "";

          const otras_instalaciones =
            document.querySelector('input[name="otras-instalaciones"]:checked')
              ?.value || "";
          const otras_instalaciones_tipo =
            document.getElementById("otras-instalaciones-tipo")?.value || "";
          const otras_instalaciones_comprobado =
            document.getElementById("otras-instalaciones-comprobado")?.value ||
            "";
          const permit_date_otras =
            document.getElementById("permit-date-otras")?.value || "";

          // Riesgos y Medidas Preventivas
          const requiere_talud =
            document.querySelector('input[name="requiere-talud"]:checked')
              ?.value || "";
          const angulo_talud =
            document.getElementById("angulo-talud")?.value || "";
          const requiere_bermas =
            document.querySelector('input[name="requiere-bermas"]:checked')
              ?.value || "";
          const longitud_meseta =
            document.getElementById("longitud-meseta")?.value || "";
          const alturas_contrameseta =
            document.getElementById("alturas-contrameseta")?.value || "";
          const requiere_entibacion =
            document.querySelector('input[name="requiere-entibacion"]:checked')
              ?.value || "";
          const tipo_entibacion =
            document.getElementById("tipo-entibacion")?.value || "";
          const especificacion_entibacion =
            document.getElementById("especificacion-entibacion")?.value || "";
          const otros_requerimientos =
            document.querySelector('input[name="otros-requerimientos"]:checked')
              ?.value || "";
          const otros_requerimientos_detalle =
            document.getElementById("otros-requerimientos-detalle")?.value ||
            "";
          const distancia_estatica =
            document.getElementById("distancia-estatica")?.value || "";
          const distancia_dinamica =
            document.getElementById("distancia-dinamica")?.value || "";

          // Caída de Personas y Vehículos al Interior
          const requiere_balizamiento =
            document.querySelector(
              'input[name="requiere-balizamiento"]:checked'
            )?.value || "";
          const distancia_balizamiento =
            document.getElementById("distancia-balizamiento")?.value || "";
          const requiere_proteccion_rigida =
            document.querySelector(
              'input[name="requiere-proteccion-rigida"]:checked'
            )?.value || "";
          const distancia_proteccion =
            document.getElementById("distancia-proteccion")?.value || "";
          const requiere_senalizacion =
            document.querySelector(
              'input[name="requiere-senalizacion"]:checked'
            )?.value || "";
          const tipo_senalizacion =
            document.getElementById("tipo-senalizacion")?.value || "";
          const requiere_proteccion_anticaida =
            document.querySelector(
              'input[name="requiere-proteccion-anticaida"]:checked'
            )?.value || "";
          const tipo_proteccion_anticaida =
            document.getElementById("tipo-proteccion-anticaida")?.value || "";

          // Atmósfera Peligrosa
          const espacio_confinado =
            document.querySelector('input[name="espacio-confinado"]:checked')
              ?.value || "";

          // Trabajos en Proximidad de Líneas en Carga
          const excavacion_manual =
            document.querySelector('input[name="excavacion-manual"]:checked')
              ?.value || "";
          const medidas_excavacion =
            document.getElementById("medidas-excavacion")?.value || "";
          // Medidas adicionales (checkboxes)
          const medida_herramienta_antichispa =
            document.querySelector(
              'input[name="medida-herramienta-antichispa"]'
            )?.checked || false;
          const medida_guantes_dielectrico =
            document.querySelector('input[name="medida-guantes-dielectrico"]')
              ?.checked || false;
          const medida_epp_especial =
            document.querySelector('input[name="medida-epp-especial"]')
              ?.checked || false;
          const medida_otros_lineas =
            document.querySelector('input[name="medida-otros-lineas"]')
              ?.checked || false;
          const otros_medidas_lineas =
            document.getElementById("otros-medidas-lineas")?.value || "";

          // Medidas Adicionales (checkboxes)
          const medida_bloqueo_fisico =
            document.getElementById("medida-bloqueo-fisico")?.checked || false;
          const bloqueo_fisico_detalle =
            document.getElementById("bloqueo-fisico-detalle")?.value || "";
          const medida_drenar_limpiar =
            document.querySelector('input[name="medida-drenar-limpiar"]')
              ?.checked || false;
          const medida_atmosfera_inerte =
            document.querySelector('input[name="medida-atmosfera-inerte"]')
              ?.checked || false;
          const medida_vigilante =
            document.getElementById("medida-vigilante")?.checked || false;
          const vigilante_detalle =
            document.getElementById("vigilante-detalle")?.value || "";
          const medida_otras_adicionales =
            document.getElementById("medida-otras-adicionales")?.checked ||
            false;
          const otras_adicionales_detalle =
            document.getElementById("otras-adicionales-detalle")?.value || "";

          // Observaciones
          const observaciones_generales =
            document.getElementById("observaciones-generales")?.value || "";

          // Construir el objeto de datos para enviar
          const datosExcavacion = {
            id_permiso,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervencion,
            descripcion_trabajo,
            nombre_solicitante,
            empresa,
            profundidad_media,
            profundidad_maxima,
            anchura,
            longitud,
            tipo_terreno,
            tuberia_gas,
            gas_tipo,
            tuberia_gas_comprobado,
            permit_date_gas,
            linea_electrica,
            linea_electrica_voltaje,
            linea_electrica_comprobado,
            permit_date_electrica,
            tuberia_incendios,
            tuberia_incendios_presion,
            tuberia_incendios_comprobado,
            permit_date_incendios,
            alcantarillado,
            alcantarillado_diametro,
            alcantarillado_comprobado,
            permit_date_alcantarillado,
            otras_instalaciones,
            otras_instalaciones_tipo,
            otras_instalaciones_comprobado,
            permit_date_otras,
            requiere_talud,
            angulo_talud,
            requiere_bermas,
            longitud_meseta,
            alturas_contrameseta,
            requiere_entibacion,
            tipo_entibacion,
            especificacion_entibacion,
            otros_requerimientos,
            otros_requerimientos_detalle,
            distancia_estatica,
            distancia_dinamica,
            requiere_balizamiento,
            distancia_balizamiento,
            requiere_proteccion_rigida,
            distancia_proteccion,
            requiere_senalizacion,
            tipo_senalizacion,
            requiere_proteccion_anticaida,
            tipo_proteccion_anticaida,
            espacio_confinado,
            excavacion_manual,
            medidas_excavacion,
            medida_herramienta_antichispa,
            medida_guantes_dielectrico,
            medida_epp_especial,
            medida_otros_lineas,
            otros_medidas_lineas,
            medida_bloqueo_fisico,
            bloqueo_fisico_detalle,
            medida_drenar_limpiar,
            medida_atmosfera_inerte,
            medida_vigilante,
            vigilante_detalle,
            medida_otras_adicionales,
            otras_adicionales_detalle,
            observaciones_generales,
          };

          // Imprimir en consola lo que se enviará
          console.log(
            "[DEBUG] Datos a enviar PT Excavación/Perforación:",
            datosExcavacion
          );

          // Enviar los datos al backend
          const excavacionResponse = await fetch("/api/excavacion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosExcavacion),
          });
          const excavacionResult = await excavacionResponse.json();
          if (!excavacionResponse.ok || !excavacionResult.success)
            throw new Error(
              excavacionResult.error ||
                "Error al guardar PT Excavación/Perforación"
            );
          // ==============================
          // FIN BLOQUE: Insertar PT Excavación/Perforación
          // ==============================
        }
        // ... repite hasta el tipo 10 ...
        else if (tipoFormulario === 11) {
          // Lógica para formulario 10
        }

        // 3. Insertar actividades AST
        const astActivities = [];
        let validAst = true;

        document.querySelectorAll(".ast-activity").forEach((row, index) => {
          // Guardar el texto de la actividad como 'secuencia'
          const secuencia = row
            .querySelector('textarea[name^="ast-activity-"]')
            .value.trim();
          const personal_ejecutor = row.querySelector(
            'select[name^="ast-personnel-"]'
          ).value;
          const peligros_potenciales = row
            .querySelector('textarea[name^="ast-hazards-"]')
            .value.trim();
          const acciones_preventivas = row
            .querySelector('textarea[name^="ast-preventions-"]')
            .value.trim();
          const responsable = row.querySelector(
            'select[name^="ast-responsible-"]'
          ).value;

          if (
            !secuencia ||
            !personal_ejecutor ||
            !peligros_potenciales ||
            !acciones_preventivas ||
            !responsable
          ) {
            validAst = false;
          }

          astActivities.push({
            id_ast,
            secuencia,
            personal_ejecutor,
            peligros_potenciales,
            acciones_preventivas,
            responsable,
          });
        });

        if (!validAst) {
          alert(
            "Por favor completa todos los campos obligatorios de las actividades AST antes de guardar."
          );
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }

        const responseAST = await fetch("/api/ast-actividades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actividades: astActivities }),
        });
        const resultAST = await responseAST.json();
        if (!responseAST.ok || !resultAST.success)
          throw new Error(
            resultAST.error || "Error al guardar actividades AST"
          );

        sessionStorage.setItem("permisoCompletoInserted", "true");

        // Mostrar modal de éxito
        const modal = document.getElementById("confirmation-modal");
        if (modal) {
          modal.querySelector("h3").textContent = "Permiso creado exitosamente";
          const permitNumber = `GSI-PT-N${id_permiso}`;
          window.permitNumber = permitNumber;
          const permitText = `El permiso de trabajo con AST ha sido registrado en el sistema con el número: <strong id="generated-permit">${permitNumber}</strong>`;
          modal.querySelector("p").innerHTML = permitText;
          modal.classList.add("active");
          // Llamar a n8nFormHandler para enviar los datos a n8n
          if (typeof n8nFormHandler === "function") {
            try {
              await n8nFormHandler();
            } catch (err) {
              console.error("Error al enviar datos a n8n:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
        const modal = document.getElementById("confirmation-modal");
        if (modal) {
          modal.querySelector("h3").textContent = "Error al enviar";
          modal.querySelector("p").textContent =
            "Error al procesar la solicitud: " + error.message;
          modal.classList.add("active");
        } else {
          alert("Error al procesar la solicitud: " + error.message);
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }

  // ==============================
  // 3. Función simulada para compatibilidad
  // ==============================
  window.handleN8NFormSubmission = async function () {
    console.log("Modo de prueba: No se está usando n8n");
    return true;
  };

  // ==============================
  // 4. Imprimir en consola el nombre seleccionado en los selects AST
  // ==============================
  function imprimirNombreSeleccionado(event) {
    const select = event.target;
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.value) {
      console.log(
        `Seleccionado en ${select.name}: ${selectedOption.textContent}`
      );
    }
  }

  document.addEventListener("change", function (event) {
    if (
      event.target.matches('select[name^="ast-personnel-"]') ||
      event.target.matches('select[name^="ast-responsible-"]')
    ) {
      imprimirNombreSeleccionado(event);
    }
  });
});

// ==============================
// 5. Poblar selects de participantes dinámicamente
// ==============================
async function poblarSelectParticipantes() {
  const idEstatus = sessionStorage.getItem("id_estatus");
  if (!idEstatus || idEstatus === "undefined" || idEstatus === "") {
    console.warn(
      "id_estatus no está definido o es inválido, no se poblan los selects."
    );
    return;
  }
  try {
    const response = await fetch(`/api/participantes?id_estatus=${idEstatus}`);
    const participantes = await response.json();

    console.log("[DEBUG] id_estatus enviado:", idEstatus);
    console.log("[DEBUG] URL:", `/api/participantes?id_estatus=${idEstatus}`);
    console.log("[DEBUG] participantes recibidos:", participantes);

    if (!Array.isArray(participantes)) {
      console.error(
        "La respuesta de participantes no es un array:",
        participantes
      );
      return;
    }

    const selectsPersonal = document.querySelectorAll(
      'select[name^="ast-personnel-"]'
    );
    selectsPersonal.forEach((select) => {
      select.innerHTML = '<option value="">-- Seleccione --</option>';
      participantes.forEach((part) => {
        const option = document.createElement("option");
        option.value = part.id_ast_participan;
        option.textContent = part.nombre;
        select.appendChild(option);
      });
    });

    const selectsResponsable = document.querySelectorAll(
      'select[name^="ast-responsible-"]'
    );
    selectsResponsable.forEach((select) => {
      select.innerHTML = '<option value="">-- Seleccione --</option>';
      participantes.forEach((part) => {
        const option = document.createElement("option");
        option.value = part.id_ast_participan;
        option.textContent = part.nombre;
        select.appendChild(option);
      });
    });
  } catch (error) {
    console.error("Error al poblar participantes:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  poblarSelectParticipantes();
  const btnSaveParticipants = document.getElementById("btn-save-participants");
  if (btnSaveParticipants) {
    btnSaveParticipants.addEventListener("click", function () {
      setTimeout(() => {
        poblarSelectParticipantes();
      }, 200);
    });
  }
});

// Debug idAst
const idAst = sessionStorage.getItem("id_ast");
console.log("[DEBUG] idAst leído en seccion4:", idAst);

// ==============================
// Rutas del servidor (simuladas para este contexto)
// ==============================
const express = require("express");
const router = express.Router();
const pool = require("./dbPool"); // Suponiendo que este es el archivo donde está configurada la conexión a la base de datos

// Obtener participantes
router.get("/api/participantes", async (req, res) => {
  const id_estatus = parseInt(req.query.id_estatus, 10); // Asegura que sea entero
  let query = "SELECT * FROM ast_participan";
  let params = [];
  if (id_estatus) {
    query += " WHERE id_estatus = $1";
    params = [id_estatus];
  }
  console.log("[DEBUG] Query ejecutada:", query, params);
  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const formulariosRouter = require("./formularios");
app.use("/api", formulariosRouter);

function mostrarMensajeError() {
  // alert eliminado para no mostrar ventana emergente
}

function textoABoolean(valor) {
  if (typeof valor === "string") {
    return valor.trim().toLowerCase() === "si";
  }
  return !!valor;
}

function obtenerFechaHoraLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}
