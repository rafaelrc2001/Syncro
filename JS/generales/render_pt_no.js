// Alias para compatibilidad con imports anteriores

export { renderNoPeligrosoArea as renderNoPeligroso };
export function renderNoPeligrosoArea(data = {}) {
  // Sección de datos principales
  return `
    <div class="executive-grid pt-no-peligroso">
      <div class="executive-item executive-header-nopeligroso" style="grid-column: 1/-1;">
        <h3>Permiso No Peligroso</h3>
      </div>
      <div class="executive-item">
        <label for="fluid">Fluido</label>
        <input type="text" id="fluid" name="fluid" class="compact" value="${
          data.fluid || ""
        }">
      </div>
      <div class="executive-item">
        <label for="pressure">Presión</label>
        <input type="text" id="pressure" name="pressure" class="compact" value="${
          data.pressure || ""
        }">
      </div>
      <div class="executive-item">
        <label for="temperature">Temperatura</label>
        <input type="text" id="temperature" name="temperature" class="compact" value="${
          data.temperature || ""
        }">
      </div>
    </div>
    <div class="executive-grid" style="margin-top:2em;">
      <div class="executive-item executive-header-nopeligroso" style="grid-column: 1/-1; display: flex; align-items: center; gap: 0.5em;">
        <i class="ri-checkbox-multiple-line"></i>
        <h3 style="margin:0;">Análisis Previo al Trabajo</h3>
      </div>
      <div class="executive-item" style="grid-column: 1/-1; padding:0;">
        <form id="form-no-peligroso-analisis">
          <table class="tabla-requisitos">
            <thead class="thead-nopeligroso">
              <tr>
                <th>Pregunta</th>
                <th class="centered">SI</th>
                <th class="centered">NO</th>
                <th class="centered">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${renderRadioRowTableNP(
                "¿El trabajo se realizará en un área de riesgo controlado?",
                "risk-area",
                data["risk-area"]
              )}
              ${renderRadioRowTableNP(
                "¿Se necesita entrega física, para efectuar el trabajo por parte del personal de la planta o departamento?",
                "physical-delivery",
                data["physical-delivery"]
              )}
              ${renderRadioRowTableNP(
                "¿El personal que va a ejecutar el trabajo, necesita equipo de protección personal adicional al estándar del área donde se desarrollará el trabajo?",
                "additional-ppe",
                data["additional-ppe"]
              )}
              ${renderRadioRowTableNP(
                "¿En el área circundante se efectuarán trabajos con riesgo?",
                "surrounding-risk",
                data["surrounding-risk"]
              )}
              ${renderRadioRowTableNP(
                "¿Necesita supervisión el personal?",
                "supervision-needed",
                data["supervision-needed"]
              )}
            </tbody>
          </table>
          <div class="form-group" style="margin-top:1em;">
            <label for="pre-work-observations">Observaciones adicionales:</label>
            <textarea id="pre-work-observations" name="pre-work-observations" rows="2" style="width:100%" placeholder="Ingrese observaciones adicionales...">${
              data["pre-work-observations"] || ""
            }</textarea>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Helper para las filas de radios estilo apertura
function renderRadioRowTableNP(label, name, value) {
  return `
    <tr>
      <td>${label}</td>
      <td class="centered"><input type="radio" name="${name}" value="SI" ${
    value === "SI" ? "checked" : ""
  }></td>
      <td class="centered"><input type="radio" name="${name}" value="NO" ${
    value === "NO" ? "checked" : ""
  }></td>
      <td class="centered"><input type="radio" name="${name}" value="N/A" ${
    value === "N/A" ? "checked" : ""
  }></td>
    </tr>
  `;
}

export function renderNoPeligrosoAreaVer(data = {}) {
  return `
    <div class="executive-grid pt-no-peligroso">
      <div class="executive-item executive-header-nopeligroso" style="grid-column: 1/-1;">
        <h3>Permiso No Peligroso</h3>
      </div>
      <div class="executive-item">
        <label>Fluido</label>
        <p>${data.fluido || data.fluid || "-"}</p>
      </div>
      <div class="executive-item">
        <label>Presión</label>
        <p>${data.presion || data.pressure || "-"}</p>
      </div>
      <div class="executive-item">
        <label>Temperatura</label>
        <p>${data.temperatura || data.temperature || "-"}</p>
      </div>
    </div>
    <div class="executive-grid" style="margin-top:2em;">
      <div class="executive-item executive-header-nopeligroso" style="grid-column: 1/-1; display: flex; align-items: center; gap: 0.5em;">
        <i class="ri-checkbox-multiple-line"></i>
        <h3 style="margin:0;">Análisis Previo al Trabajo</h3>
      </div>
      <div class="executive-item" style="grid-column: 1/-1; padding:0;">
        <table class="tabla-requisitos">
          <thead class="thead-nopeligroso">
            <tr>
              <th>Pregunta</th>
              <th class="centered">Respuesta</th>
            </tr>
          </thead>
          <tbody>
            ${renderRowVisual(
              "¿El trabajo se realizará en un área de riesgo controlado?",
              data.trabajo_area_riesgo_controlado || data["risk-area"]
            )}
            ${renderRowVisual(
              "¿Se necesita entrega física, para efectuar el trabajo por parte del personal de la planta o departamento?",
              data.necesita_entrega_fisica || data["physical-delivery"]
            )}
            ${renderRowVisual(
              "¿El personal que va a ejecutar el trabajo, necesita equipo de protección personal adicional al estándar del área donde se desarrollará el trabajo?",
              data.necesita_ppe_adicional || data["additional-ppe"]
            )}
            ${renderRowVisual(
              "¿En el área circundante se efectuarán trabajos con riesgo?",
              data.area_circundante_riesgo || data["surrounding-risk"]
            )}
            ${renderRowVisual(
              "¿Necesita supervisión el personal?",
              data.necesita_supervision || data["supervision-needed"]
            )}
          </tbody>
        </table>
        <div class="form-group" style="margin-top:1em;">
          <label>Observaciones adicionales:</label>
          <div class="description-box">${
            data.observaciones_analisis_previo ||
            data["pre-work-observations"] ||
            "-"
          }</div>
        </div>
      </div>
    </div>
  `;
}

export function renderRowVisual(label, value) {
  return `
    <tr>
      <td>${label}</td>
      <td class="centered"><strong>${value || "-"}</strong></td>
    </tr>
  `;
}
