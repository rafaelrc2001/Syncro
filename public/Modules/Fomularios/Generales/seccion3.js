document.addEventListener("DOMContentLoaded", () => {
  const addParticipantBtn = document.getElementById("add-participant");
  const participantsContainer = document.querySelector(".participants-table");

  // Agregar event listener para el botón eliminar del primer participante
  const firstParticipant = document.querySelector(".participant-row[data-index='1']");
  if (firstParticipant) {
    const removeBtn = firstParticipant.querySelector(".remove-participant");
    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        showDeleteParticipantModal(() => {
          firstParticipant.remove();
          renumberParticipants();
        });
      });
    }
  }

  // Modal de confirmación para eliminar participante
  function showDeleteParticipantModal(onConfirm) {
    let modal = document.getElementById('delete-participant-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'delete-participant-modal';
      modal.innerHTML = `
        <div class="modal-overlay" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center;">
          <div class="modal-content" style="background:#fff;padding:2em 1.5em;border-radius:8px;box-shadow:0 2px 16px #0002;max-width:350px;text-align:center;">
            <div style="font-size:1.2em;margin-bottom:1em;">¿Está seguro de eliminar este participante?</div>
            <button id="modal-confirm-delete" style="margin:0 1em 0 0;padding:0.5em 1.2em;background:#c62828;color:#fff;border:none;border-radius:4px;">Eliminar</button>
            <button id="modal-cancel-delete" style="padding:0.5em 1.2em;background:#eee;color:#333;border:none;border-radius:4px;">Cancelar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    modal.style.display = 'block';
    const confirmBtn = modal.querySelector('#modal-confirm-delete');
    const cancelBtn = modal.querySelector('#modal-cancel-delete');
    function closeModal() {
      modal.style.display = 'none';
    }
    confirmBtn.onclick = function() {
      closeModal();
      if (typeof onConfirm === 'function') onConfirm();
    };
    cancelBtn.onclick = closeModal;
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
                <input type="text" placeholder="Numero de credencial" name="participant-credential-${newIndex}" required>
            </div>
          
            <div class="participant-field">
                <input  placeholder="Nombre participante" type="text" name="participant-name-${newIndex}" required>
            </div>
          
            <div class="participant-field">
                <input type="text" placeholder="Cargo" name="participant-position-${newIndex}" required>
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

      // Evento para eliminar participante con modal
      newParticipant
        .querySelector(".remove-participant")
        .addEventListener("click", function () {
          showDeleteParticipantModal(() => {
            newParticipant.remove();
            renumberParticipants();
          });
        });
    });
  }

  // --- LÓGICA DE INSERCIÓN DE PARTICIPANTES COMENTADA POR MIGRACIÓN ---
  /*
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
      // ...existing code...
    });
    console.log("[COLLECT] ✅ Total participantes recolectados:", participants.length);
    return participants;
  }
  */

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

  // --- LÓGICA DE INSERCIÓN DE PARTICIPANTES COMENTADA POR MIGRACIÓN ---
  /*
  async function handleInsertAndNavigate(e) {
    const submitBtn = btnSaveParticipants;
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="ri-loader-4-line spin"></i> Guardando...';
      // ...existing code...
    } catch (error) {
      // ...existing code...
    } finally {
      if (btnSaveParticipants) {
        btnSaveParticipants.disabled = false;
        btnSaveParticipants.innerHTML =
          'Siguiente <i class="ri-arrow-right-line"></i>';
      }
    }
  }
  */

  // El botón 'siguiente' solo inserta y cambia de sección, sin lógica de bloqueo
  // btnSaveParticipants.addEventListener("click", handleInsertAndNavigate); // Comentado por migración

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
