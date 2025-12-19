// ============================================================================
// CARGA MASIVA DE PARTICIPANTES DESDE EXCEL
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  const btnMassLoad = document.getElementById("add-mass-load");
  const modal = document.getElementById("mass-load-modal");
  const closeModal = document.getElementById("close-mass-modal");
  const cancelBtn = document.getElementById("cancel-mass-load");
  const confirmBtn = document.getElementById("confirm-mass-load");
  const excelInput = document.getElementById("excelInput");
  const previewTabla = document.getElementById("preview-tabla");

  let datosExcel = []; // Almacenar datos del Excel

  // Abrir modal
  if (btnMassLoad) {
    btnMassLoad.addEventListener("click", () => {
      modal.style.display = "flex";
      datosExcel = [];
      previewTabla.innerHTML = "";
      excelInput.value = "";
      confirmBtn.disabled = true;
    });
  }

  // Cerrar modal
  const cerrarModal = () => {
    modal.style.display = "none";
    datosExcel = [];
    previewTabla.innerHTML = "";
    excelInput.value = "";
    confirmBtn.disabled = true;
  };

  if (closeModal) {
    closeModal.addEventListener("click", cerrarModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", cerrarModal);
  }

  // Leer archivo Excel
  if (excelInput) {
    excelInput.addEventListener("change", function (e) {
      const archivo = e.target.files[0];
      if (!archivo) return;

      const lector = new FileReader();

      lector.onload = function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Primera hoja
          const hoja = workbook.Sheets[workbook.SheetNames[0]];

          // Convertir a arreglo de arreglos
          const filas = XLSX.utils.sheet_to_json(hoja, { header: 1 });

          if (filas.length <= 1) {
            previewTabla.innerHTML =
              '<p style="color: #ff4444;">⚠️ El archivo no contiene datos.</p>';
            confirmBtn.disabled = true;
            return;
          }

          const encabezados = filas[0];
          const datos = filas
            .slice(1)
            .filter((fila) =>
              fila.some((celda) => celda !== null && celda !== "")
            );

          if (datos.length === 0) {
            previewTabla.innerHTML =
              '<p style="color: #ff4444;">⚠️ No hay datos válidos en el archivo.</p>';
            confirmBtn.disabled = true;
            return;
          }

          // Validar que tenga las columnas necesarias (flexible, no importa el orden)
          const colNombre = encabezados.findIndex(
            (h) =>
              h &&
              h.toString().toLowerCase().trim() === "nombre"
          );
          const colCredencial = encabezados.findIndex(
            (h) => {
              if (!h) return false;
              const col = h.toString().toLowerCase().trim();
              return col === "credencial" || 
                     col === "no. credencial" || 
                     col === "no credencial" ||
                     col === "numero credencial" ||
                     col === "número credencial";
            }
          );
          const colCargo = encabezados.findIndex(
            (h) =>
              h &&
              h.toString().toLowerCase().trim() === "cargo"
          );

          if (
            colNombre === -1 ||
            colCredencial === -1 ||
            colCargo === -1
          ) {
            previewTabla.innerHTML =
              '<p style="color: #ff4444;">⚠️ El archivo debe contener las columnas: <strong>Nombre, Credencial, Cargo</strong></p>';
            confirmBtn.disabled = true;
            return;
          }

          // Guardar datos procesados (función se asignará manualmente)
          datosExcel = datos.map((fila) => ({
            nombre: (fila[colNombre] || "").toString().trim(),
            credencial: (fila[colCredencial] || "").toString().trim(),
            cargo: (fila[colCargo] || "").toString().trim(),
          }));

          // Importar automáticamente sin vista previa
          importarParticipantes();
          
        } catch (error) {
          console.error("Error al leer el archivo:", error);
          alert('⚠️ Error al procesar el archivo. Verifica que sea un archivo Excel válido.');
        }
      };

      lector.readAsArrayBuffer(archivo);
    });
  }

  // Función para importar participantes
  function importarParticipantes() {
    if (datosExcel.length === 0) {
      alert("No hay datos para importar.");
      return;
    }

    const participantsContainer =
      document.querySelector(".participants-table");
    if (!participantsContainer) {
      alert("No se encontró la tabla de participantes.");
      return;
    }

    // Agregar cada participante a la tabla
    datosExcel.forEach((dato) => {
      const participantCount =
        document.querySelectorAll(".participant-row").length;
      const newIndex = participantCount + 1;

      const newParticipant = document.createElement("div");
      newParticipant.className = "participant-row";
      newParticipant.setAttribute("data-index", newIndex);
      newParticipant.innerHTML = `
            <div class="participant-number">${newIndex}</div>
            <div class="participant-field">
                <input type="text" name="participant-name-${newIndex}" value="${dato.nombre}" required>
            </div>
            <div class="participant-field">
                <input type="text" name="participant-credential-${newIndex}" value="${dato.credencial}" required>
            </div>
            <div class="participant-field">
                <input type="text" name="participant-position-${newIndex}" value="${dato.cargo}" required>
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
          newParticipant.remove();
          renumberParticipants();
        });
    });

    // Renumerar todos los participantes
    renumberParticipants();

    /*alert(
      `✅ Se importaron ${datosExcel.length} participantes correctamente. Recuerda asignar la función a cada uno.`
    );*/
    cerrarModal();
  }

  // Función para renumerar participantes (debe estar también en seccion3.js)
  function renumberParticipants() {
    console.log("[CARGADEDATOS] Renumerando participantes...");
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
          input.setAttribute("name", `participant-${field}-${newIndex}`);
          console.log(`[CARGADEDATOS] Renombrado: participant-${field}-${newIndex}`);
        }
      });
    });
    console.log("[CARGADEDATOS] ✅ Renumeración completada");
  }
});

console.log("cargadedatos.js cargado correctamente");
