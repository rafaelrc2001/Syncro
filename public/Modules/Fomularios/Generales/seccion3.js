document.addEventListener("DOMContentLoaded", () => {
  const addParticipantBtn = document.getElementById("add-participant");
  const participantsContainer = document.querySelector(".participants-table");

  // Agregar event listener para el botón eliminar del primer participante
  const firstParticipant = document.querySelector(".participant-row[data-index='1']");
  if (firstParticipant) {
    const removeBtn = firstParticipant.querySelector(".remove-participant");
    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        if (confirm("¿Está seguro de eliminar este participante?")) {
          firstParticipant.remove();
          renumberParticipants();
        }
      });
    }
  }

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

    console.log("[COLLECT] Total de filas encontradas:", rows.length);

    if (rows.length === 0) {
      throw new Error("Debe agregar al menos un participante");
    }

    rows.forEach((row, index) => {
      const rowIndex = index + 1;
      console.log(`[COLLECT] Procesando fila ${rowIndex}`);
      
      // Debug: mostrar todos los inputs de la fila
      const allInputs = row.querySelectorAll('input, select');
      console.log(`[COLLECT] Fila ${rowIndex} - Total inputs/selects:`, allInputs.length);
      allInputs.forEach(input => {
        console.log(`[COLLECT] Fila ${rowIndex} - Input encontrado:`, {
          tagName: input.tagName,
          name: input.getAttribute('name'),
          type: input.type || 'select'
        });
      });
      
      // Buscar elementos con validación
      const nameInput = row.querySelector(`[name="participant-name-${rowIndex}"]`);
      const credentialInput = row.querySelector(`[name="participant-credential-${rowIndex}"]`);
      const positionInput = row.querySelector(`[name="participant-position-${rowIndex}"]`);
      const roleSelect = row.querySelector(`[name="participant-role-${rowIndex}"]`);
      
      console.log(`[COLLECT] Fila ${rowIndex} - Elementos encontrados:`, {
        name: !!nameInput,
        credential: !!credentialInput,
        position: !!positionInput,
        role: !!roleSelect
      });

      // Validar que todos los elementos existen
      if (!nameInput) {
        throw new Error(`No se encontró el campo de nombre para el participante ${rowIndex}`);
      }
      if (!credentialInput) {
        throw new Error(`No se encontró el campo de credencial para el participante ${rowIndex}`);
      }
      if (!positionInput) {
        throw new Error(`No se encontró el campo de cargo para el participante ${rowIndex}`);
      }
      if (!roleSelect) {
        throw new Error(`No se encontró el campo de rol para el participante ${rowIndex}`);
      }

      const name = nameInput.value.trim();
      const credential = credentialInput.value.trim();
      const position = positionInput.value.trim();
      const role = roleSelect.value;

      console.log(`[COLLECT] Fila ${rowIndex} - Valores:`, {
        name,
        credential,
        position,
        role
      });

      // Validar campos obligatorios
      if (!name) {
        throw new Error(`El nombre del participante ${rowIndex} es requerido`);
      }
      if (!credential) {
        throw new Error(
          `El número de credencial del participante ${rowIndex} es requerido`
        );
      }
      if (!position) {
        throw new Error(`El cargo del participante ${rowIndex} es requerido`);
      }
      if (!role) {
        throw new Error(
          `Debe seleccionar un rol para el participante ${rowIndex}`
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
    
    console.log("[COLLECT] ✅ Total participantes recolectados:", participants.length);
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
      console.log("[SECCION3] ========== INICIO GUARDADO ==========");
      console.log("[SECCION3] Participantes a enviar:", participants);
      console.log("[SECCION3] Cantidad de participantes:", participants.length);
      
      const respPart = await fetch("/api/ast-participan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ participants }),
      });
      
      console.log("[SECCION3] Status HTTP de ast-participan:", respPart.status);
      console.log("[SECCION3] Response OK?:", respPart.ok);
      
      const respPartJson = await respPart.json();
      console.log("[SECCION3] Respuesta completa de ast-participan:", respPartJson);
      
      if (!respPart.ok) {
        console.error("[SECCION3] ❌ Error en respuesta ast-participan:", respPartJson);
        throw new Error(respPartJson.error || "Error al guardar participantes");
      }
      
      console.log("[SECCION3] ✅ Participantes guardados exitosamente");


      // Marcar como insertado en sessionStorage
      sessionStorage.setItem("participantsInserted", "true");
      sessionStorage.setItem("permisoCompletoInserted", "true");

      showNotification("success", "Datos guardados correctamente");

      // Esperar confirmación de que los participantes están en la base de datos antes de avanzar
      const id_estatus = sessionStorage.getItem("id_estatus");
      console.log("[SECCION3] Verificando inserción con id_estatus:", id_estatus);
      
      let retries = 0;
      const maxRetries = 10; // Aumentado a 10 segundos
      const delay = 1000; // 1 segundo entre intentos

      async function checkParticipantsInsertedAndPopulate() {
        try {
          console.log(`[SECCION3] Verificación ${retries + 1}/${maxRetries}...`);
          
          const checkResp = await fetch(
            `/api/ast-participan/estatus/${id_estatus}`
          );
          const checkJson = await checkResp.json();
          
          console.log(`[SECCION3] Resultado verificación ${retries + 1}:`, checkJson);
          console.log(`[SECCION3] Participantes en BD:`, checkJson.data?.length || 0);
          console.log(`[SECCION3] Participantes esperados:`, participants.length);
          
          if (
            checkJson.success &&
            Array.isArray(checkJson.data) &&
            checkJson.data.length >= participants.length
          ) {
            console.log("[SECCION3] ✅ Participantes confirmados en BD");
            
            // Llama a poblarSelectParticipantes antes de avanzar
            if (typeof window.poblarSelectParticipantes === "function") {
              console.log("[SECCION3] Llamando a window.poblarSelectParticipantes...");
              await window.poblarSelectParticipantes();
            } else if (typeof poblarSelectParticipantes === "function") {
              console.log("[SECCION3] Llamando a poblarSelectParticipantes...");
              await poblarSelectParticipantes();
            } else {
              console.warn("[SECCION3] ⚠️ No se encontró función poblarSelectParticipantes");
            }
            
            btnSaveParticipants.removeEventListener(
              "click",
              handleInsertAndNavigate
            );
            btnSaveParticipants.addEventListener("click", goToNextSection);
            
            console.log("[SECCION3] ✅ Avanzando a siguiente sección");
            goToNextSection();
          } else if (retries < maxRetries) {
            retries++;
            console.log(`[SECCION3] ⏳ Esperando... reintento en ${delay}ms`);
            setTimeout(checkParticipantsInsertedAndPopulate, delay);
          } else {
            console.error("[SECCION3] ❌ Máximo de reintentos alcanzado");
            console.error("[SECCION3] Participantes esperados:", participants.length);
            console.error("[SECCION3] Participantes encontrados:", checkJson.data?.length || 0);
            showNotification(
              "error",
              "No se pudo confirmar la inserción de los participantes en la base de datos. Intente de nuevo."
            );
          }
        } catch (err) {
          console.error(`[SECCION3] ❌ Error en verificación ${retries + 1}:`, err);
          if (retries < maxRetries) {
            retries++;
            setTimeout(checkParticipantsInsertedAndPopulate, delay);
          } else {
            console.error("[SECCION3] ❌ Error final:", err.message);
            showNotification(
              "error",
              "Error al verificar la inserción de participantes: " + err.message
            );
          }
        }
      }

      checkParticipantsInsertedAndPopulate();
    } catch (error) {
      console.error("[SECCION3] ❌ ERROR CRÍTICO:", error);
      console.error("[SECCION3] Stack trace:", error.stack);
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
