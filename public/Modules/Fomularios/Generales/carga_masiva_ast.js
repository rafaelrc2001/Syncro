// ============================================================================
// CARGA MASIVA DE ACTIVIDADES AST DESDE EXCEL
// Archivo: carga_masiva_ast.js
// 
// Este archivo maneja la importación masiva de actividades AST desde un 
// archivo Excel con 3 columnas específicas.
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  initCargaMasivaAST();
});

/**
 * Inicializa la funcionalidad de carga masiva de actividades AST
 */
function initCargaMasivaAST() {
  // ===== ELEMENTOS DEL DOM =====
  const btnAddMassLoad = document.getElementById("add-mass-load-ast");
  const excelInput = document.getElementById("excelInput-ast");
  const astActivitiesContainer = document.querySelector(".ast-activities");

  // ===== VERIFICAR QUE EXISTEN LOS ELEMENTOS =====
  if (!btnAddMassLoad) {
    console.warn("[CARGA-AST] No se encontró el botón de carga masiva de AST");
    return;
  }

  // ===== EVENTO: ABRIR SELECTOR DE ARCHIVO DIRECTAMENTE =====
  btnAddMassLoad.addEventListener("click", () => {
    if (excelInput) {
      excelInput.value = ""; // Limpiar input anterior
      excelInput.click(); // Abrir selector de archivos
    }
  });

  // ===== EVENTO: SELECCIONAR ARCHIVO EXCEL =====
  if (excelInput) {
    excelInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // Leer el archivo Excel
        const data = await leerArchivoExcel(file);
        
        // Validar que tenga las 3 columnas requeridas
        if (!validarColumnasExcel(data)) {
          alert("⚠️ El archivo debe contener exactamente 3 columnas con los nombres:\n- Secuencia-Actividad\n- Peligros-potenciales\n- Acciones-Preventivas");
          excelInput.value = "";
          return;
        }

        // Importar actividades directamente
        await importarActividades(data);

        // Limpiar input
        excelInput.value = "";

        console.log(`[CARGA-AST] Se importaron ${data.length} actividades al AST`);
      } catch (error) {
        console.error("[CARGA-AST] Error al procesar archivo:", error);
        alert("❌ Error al leer el archivo Excel. Asegúrese de que sea un archivo válido.");
        excelInput.value = "";
      }
    });
  }

  /**
   * Lee un archivo Excel y extrae los datos
   * @param {File} file - Archivo Excel seleccionado
   * @returns {Promise<Array>} - Array con los datos procesados
   */
  async function leerArchivoExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Tomar la primera hoja
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

          // Procesar datos
          const procesados = procesarDatosExcel(jsonData);
          resolve(procesados);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Procesa los datos crudos del Excel
   * @param {Array} jsonData - Datos en formato JSON del Excel
   * @returns {Array} - Datos procesados y limpios
   */
  function procesarDatosExcel(jsonData) {
    if (jsonData.length < 2) return []; // Necesita al menos encabezado + 1 fila

    const encabezados = jsonData[0];
    const filas = jsonData.slice(1);

    // Validar encabezados
    const colsRequeridas = ["secuencia-actividad", "peligros-potenciales", "acciones-preventivas"];
    const colsPresentes = encabezados.map(h => String(h).trim().toLowerCase());

    const indices = {
      actividad: colsPresentes.indexOf("secuencia-actividad"),
      peligros: colsPresentes.indexOf("peligros-potenciales"),
      preventivas: colsPresentes.indexOf("acciones-preventivas")
    };

    // Si no se encuentran las columnas, retornar vacío
    if (indices.actividad === -1 || indices.peligros === -1 || indices.preventivas === -1) {
      return [];
    }

    // Procesar filas
    return filas
      .filter(fila => fila && fila.length > 0) // Filtrar filas vacías
      .map(fila => ({
        actividad: String(fila[indices.actividad] || "").trim(),
        peligros: String(fila[indices.peligros] || "").trim(),
        preventivas: String(fila[indices.preventivas] || "").trim()
      }))
      .filter(item => item.actividad || item.peligros || item.preventivas); // Filtrar filas completamente vacías
  }

  /**
   * Valida que el Excel tenga las columnas correctas
   * @param {Array} datos - Datos procesados del Excel
   * @returns {boolean} - true si es válido
   */
  function validarColumnasExcel(datos) {
    if (!datos || datos.length === 0) return false;

    // Verificar que al menos haya una actividad con datos
    const tieneActividad = datos.some(item => 
      item.actividad || item.peligros || item.preventivas
    );

    return tieneActividad;
  }

  /**
   * Muestra vista previa de los datos a importar
   * @param {Array} datos - Datos del Excel procesados
   */
  function mostrarVistaPrevia(datos) {
    if (!previewTabla) return;

    let html = `
      <div style="max-height: 300px; overflow-y: auto; margin-top: 15px; border: 1px solid #e1e8ed; border-radius: 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="position: sticky; top: 0; background: #f8f9fa; z-index: 10;">
            <tr>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e1e8ed; font-weight: 600;">No.</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e1e8ed; font-weight: 600;">Secuencia de Actividad</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e1e8ed; font-weight: 600;">Peligros Potenciales</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e1e8ed; font-weight: 600;">Acciones Preventivas</th>
            </tr>
          </thead>
          <tbody>
    `;

    datos.forEach((item, index) => {
      html += `
        <tr style="background: ${index % 2 === 0 ? '#ffffff' : '#f8f9fa'};">
          <td style="padding: 10px; border-bottom: 1px solid #e1e8ed;">${index + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e8ed;">${item.actividad || '<em style="color: #999;">Vacío</em>'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e8ed;">${item.peligros || '<em style="color: #999;">Vacío</em>'}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e1e8ed;">${item.preventivas || '<em style="color: #999;">Vacío</em>'}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
      <p style="margin-top: 10px; color: #666; font-size: 0.9rem;">
        <strong>${datos.length}</strong> actividad(es) lista(s) para importar
      </p>
    `;

    previewTabla.innerHTML = html;
  }

  /**
   * Importa las actividades al AST del formulario
   * @param {Array} datos - Datos de actividades a importar
   */
  async function importarActividades(datos) {
    if (!astActivitiesContainer) {
      console.error("[CARGA-AST] No se encontró el contenedor de actividades AST");
      return;
    }

    // Obtener el id_estatus para los selects de participantes
    const idEstatus = sessionStorage.getItem("id_estatus");
    let participantes = [];

    // Intentar obtener participantes para los selects
    try {
      const response = await fetch(`/api/participantes?id_estatus=${idEstatus}`);
      participantes = await response.json();
    } catch (error) {
      console.warn("[CARGA-AST] No se pudieron cargar participantes:", error);
    }

    // Crear opciones para los selects
    let optionsHTML = '<option value="">-- Seleccione --</option>';
    if (Array.isArray(participantes)) {
      participantes.forEach((part) => {
        if (Number.isInteger(part.id_ast_participan)) {
          optionsHTML += `<option value="${part.id_ast_participan}">${part.nombre}</option>`;
        }
      });
    }

    // Obtener el índice actual más alto
    const actividadesExistentes = astActivitiesContainer.querySelectorAll(".ast-activity");
    let maxIndex = 0;
    actividadesExistentes.forEach((activity) => {
      const index = parseInt(activity.getAttribute("data-index")) || 0;
      if (index > maxIndex) maxIndex = index;
    });

    // Crear nuevas actividades
    datos.forEach((item, i) => {
      const newIndex = maxIndex + i + 1;

      if (newIndex > 10) {
        console.warn(`[CARGA-AST] Límite de 10 actividades alcanzado. No se agregó actividad ${newIndex}`);
        return;
      }

      const newActivity = document.createElement("div");
      newActivity.className = "ast-activity";
      newActivity.setAttribute("data-index", newIndex);
      newActivity.innerHTML = `
        <div class="ast-activity-number">${newIndex}</div>
        <div class="ast-activity-field">
          <textarea name="ast-activity-${newIndex}" rows="2" required>${item.actividad}</textarea>
        </div>
        <div class="ast-activity-field">
          <select name="ast-personnel-${newIndex}" required>
            ${optionsHTML}
          </select>
        </div>
        <div class="ast-activity-field">
          <textarea name="ast-hazards-${newIndex}" rows="2" required>${item.peligros}</textarea>
        </div>
        <div class="ast-activity-field">
          <textarea name="ast-preventions-${newIndex}" rows="2" required>${item.preventivas}</textarea>
        </div>
        <div class="ast-activity-field">
          <select name="ast-responsible-${newIndex}" required>
            ${optionsHTML}
          </select>
        </div>
        <div class="ast-activities-actions">
          <button type="button" class="action-btn remove-participant" title="Eliminar">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      `;

      astActivitiesContainer.appendChild(newActivity);
    });

    console.log(`[CARGA-AST] Se importaron ${datos.length} actividades al AST`);
  }
}
