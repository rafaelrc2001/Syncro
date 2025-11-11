document.addEventListener("DOMContentLoaded", () => {
  const addParticipantBtn = document.getElementById("add-participant");
  const participantsContainer = document.querySelector(".participants-table");

  // Función para renumerar participantes
  function renumberParticipants() {
    document.querySelectorAll(".participant-row").forEach((row, index) => {
      const newIndex = index + 1;
      row.setAttribute("data-index", newIndex);
      row.querySelector(".participant-number").textContent = newIndex;

      const fields = ["name", "credential", "position", "role"];
      fields.forEach((field) => {
        const input = row.querySelector(
          `input[name^="participant-${field}"], select[name^="participant-${field}"]`
        );
        if (input) {
          input.name = `participant-${field}-${newIndex}`;
        }
      });
    });
  }

  // Función para agregar nuevo participante
  if (addParticipantBtn && participantsContainer) {
    addParticipantBtn.addEventListener("click", function () {
      const participantCount =
        document.querySelectorAll(".participant-row").length;
      const newIndex = participantCount + 1;

      const newParticipant = document.createElement("div");
      newParticipant.className = "participant-row";
      newParticipant.setAttribute("data-index", newIndex);
      newParticipant.innerHTML = `
            <div class="participant-number">${newIndex}</div>
            <div class="participant-field">
                <input type="text" name="participant-name-${newIndex}" required>
            </div>
            <div class="participant-field">
                <input type="text" name="participant-credential-${newIndex}" required>
            </div>
            <div class="participant-field">
                <input type="text" name="participant-position-${newIndex}" required>
            </div>
            <div class="participant-field">
                <select name="participant-role-${newIndex}" required>
                    <option value="">Seleccione...</option>
                    <option value="PARTICIPA">Participa</option>
                    <option value="REVISA">Revisa</option>
                    <option value="ANALIZA">Analiza</option>
                    <option value="AUTORIZA">Autoriza</option>
                </select>
            </div>
            <div class="participant-actions">
                <button type="button" class="action-btn remove-participant" title="Eliminar">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;

      participantsContainer.appendChild(newParticipant);

      // Evento para eliminar participante
      newParticipant
        .querySelector(".remove-participant")
        .addEventListener("click", function () {
          if (confirm("¿Está seguro de eliminar este participante?")) {
            newParticipant.remove();
            renumberParticipants();
          }
        });
    });
  }

  // Función para recolectar datos de participantes
  function collectParticipants() {
    const participants = [];
    const rows = document.querySelectorAll(".participant-row");

    if (rows.length === 0) {
      throw new Error("Debe agregar al menos un participante");
    }

    rows.forEach((row, index) => {
      const name = row
        .querySelector(`[name="participant-name-${index + 1}"]`)
        .value.trim();
      const credential = row
        .querySelector(`[name="participant-credential-${index + 1}"]`)
        .value.trim();
      const position = row
        .querySelector(`[name="participant-position-${index + 1}"]`)
        .value.trim();
      const role = row.querySelector(
        `[name="participant-role-${index + 1}"]`
      ).value;

      // Validar campos obligatorios
      if (!name) {
        throw new Error(`El nombre del participante ${index + 1} es requerido`);
      }
      if (!credential) {
        throw new Error(
          `El número de credencial del participante ${index + 1} es requerido`
        );
      }
      if (!position) {
        throw new Error(`El cargo del participante ${index + 1} es requerido`);
      }
      if (!role) {
        throw new Error(
          `Debe seleccionar un rol para el participante ${index + 1}`
        );
      }

      participants.push({
        nombre: name,
        credencial: credential,
        cargo: position,
        funcion: role,
        id_estatus: sessionStorage.getItem("id_estatus"),
      });
    });
    return participants;
  }

  // Reemplaza el event listener existente de btn-save-participants con este código

  const btnSaveParticipants = document.getElementById("btn-save-participants");
  if (!btnSaveParticipants) return;

  function goToNextSection(e) {
    const nextSection =
      btnSaveParticipants.closest(".form-section").nextElementSibling;
    if (nextSection) {
      nextSection.classList.add("active");
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function handleInsertAndNavigate(e) {
    const submitBtn = btnSaveParticipants;
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="ri-loader-4-line spin"></i> Guardando...';

      // 1. Primero guardamos los participantes
      const participants = collectParticipants();
      console.log("[DEBUG] Participantes a enviar:", participants);
      const respPart = await fetch("/api/ast-participan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ participants }),
      });
      const respPartJson = await respPart.json();
      console.log(
        "[DEBUG] Respuesta backend ast-participan:",
        respPart.status,
        respPartJson
      );
      if (!respPart.ok) {
        throw new Error(respPartJson.error || "Error al guardar participantes");
      }

      // 2. Luego guardamos los datos de AST
      const astData = {
        epp: document.getElementById("ppe-required").value.trim(),
        maquinaria_equipo_herramientas: document
          .getElementById("equipment-tools")
          .value.trim(),
        materiales_accesorios: document
          .getElementById("materials")
          .value.trim(),
      };

      // Validar que al menos un campo de AST tenga datos
      if (
        !astData.epp &&
        !astData.maquinaria_equipo_herramientas &&
        !astData.materiales_accesorios
      ) {
        throw new Error(
          "Debe completar al menos un campo de EPP, Equipos o Materiales"
        );
      }

      const astResponse = await fetch("/api/ast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(astData),
      });
      const astResult = await astResponse.json();
      if (astResult.success && astResult.data && astResult.data.id_ast) {
        sessionStorage.setItem("id_ast", astResult.data.id_ast);
        console.log(
          "[DEBUG] id_ast guardado en sessionStorage:",
          astResult.data.id_ast
        );
      }

      if (!astResponse.ok) {
        const error = await astResponse.json();
        throw new Error(error.error || "Error al guardar los datos de AST");
      }

      // Marcar como insertado en sessionStorage
      sessionStorage.setItem("participantsInserted", "true");
      sessionStorage.setItem("permisoCompletoInserted", "true");

      showNotification("success", "Datos guardados correctamente");

      // Esperar confirmación de que los participantes están en la base de datos antes de avanzar
      const id_estatus = sessionStorage.getItem("id_estatus");
      let retries = 0;
      const maxRetries = 8; // ~8 segundos máximo
      const delay = 1000; // 1 segundo entre intentos

      async function checkParticipantsInserted() {
        try {
          const checkResp = await fetch(
            `/api/ast-participan/estatus/${id_estatus}`
          );
          const checkJson = await checkResp.json();
          if (
            checkJson.success &&
            Array.isArray(checkJson.data) &&
            checkJson.data.length >= participants.length
          ) {
            // Ya están insertados, avanzar
            btnSaveParticipants.removeEventListener(
              "click",
              handleInsertAndNavigate
            );
            btnSaveParticipants.addEventListener("click", goToNextSection);
            goToNextSection();
          } else if (retries < maxRetries) {
            retries++;
            setTimeout(checkParticipantsInserted, delay);
          } else {
            showNotification(
              "error",
              "No se pudo confirmar la inserción de los participantes en la base de datos. Intente de nuevo."
            );
          }
        } catch (err) {
          if (retries < maxRetries) {
            retries++;
            setTimeout(checkParticipantsInserted, delay);
          } else {
            showNotification(
              "error",
              "Error al verificar la inserción de participantes: " + err.message
            );
          }
        }
      }

      checkParticipantsInserted();
    } catch (error) {
      console.error("Error:", error);
      showNotification(
        "error",
        error.message || "Error al procesar la solicitud"
      );
    } finally {
      if (btnSaveParticipants) {
        btnSaveParticipants.disabled = false;
        btnSaveParticipants.innerHTML =
          'Siguiente <i class="ri-arrow-right-line"></i>';
      }
    }
  }

  // El botón 'siguiente' solo inserta y cambia de sección, sin lógica de bloqueo
  btnSaveParticipants.addEventListener("click", handleInsertAndNavigate);

  // Agregar al final del archivo, antes del cierre del DOMContentLoaded

  // Función para guardar los datos de AST
  document
    .getElementById("btn-save-ast")
    ?.addEventListener("click", async (e) => {
      const submitBtn = e.target;

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="ri-loader-4-line spin"></i> Guardando...';

        // Recolectar datos del formulario
        const astData = {
          epp: document.getElementById("ppe-required").value.trim(),
          maquinaria_equipo_herramientas: document
            .getElementById("equipment-tools")
            .value.trim(),
          materiales_accesorios: document
            .getElementById("materials")
            .value.trim(),
        };

        // Validar que al menos un campo tenga datos
        if (
          !astData.epp &&
          !astData.maquinaria_equipo_herramientas &&
          !astData.materiales_accesorios
        ) {
          throw new Error("Debe completar al menos un campo");
        }

        // Enviar datos al servidor
        const response = await fetch("/api/ast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(astData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Error al guardar los datos");
        }

        showNotification("success", "Datos de AST guardados correctamente");

        // Avanzar al siguiente paso
        const nextSection =
          e.target.closest(".form-section").nextElementSibling;
        if (nextSection) {
          nextSection.classList.add("active");
          nextSection.scrollIntoView({ behavior: "smooth" });
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification(
          "error",
          error.message || "Error al procesar la solicitud"
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Siguiente <i class="ri-arrow-right-line"></i>';
      }
    });

  // Función para mostrar notificaciones
  function showNotification(type, message) {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
});

console.log("seccion3.js cargado");
