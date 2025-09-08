export function renderApertura(data) {
  return `
    <div class="executive-grid">

    <div class="executive-item executive-header-gray" style="grid-column: 1/-1;">
        <h3>Datos principales.</h3>
      </div>


      <div class="executive-item"><label>Tipo de mantenimiento:</label><p>${
        data.tipo_mantenimiento ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>O.T. No.:</label><p>${
        data.ot_numero ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>TAG:</label><p>${
        data.tag ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>Hora de inicio:</label><p>${
        data.hora_inicio ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>¿Tiene equipo a intervenir?:</label><p>${
        data.tiene_equipo ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>Descripción del equipo:</label><p>${
        data.descripcion_equipo ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>Fluido:</label><p>${
        data.fluido ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>Presión:</label><p>${
        data.presion ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>Temperatura:</label><p>${
        data.temperatura ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>Descripción de antecedentes:</label><p>${
        data.antecedentes ?? "Sin información"
      }</p></div>
    </div>
    <div class="executive-grid" style="margin-top:2em;">
      <div class="executive-item executive-header-gray" style="grid-column: 1/-1;">
        <h3>Medidas para administrar los riesgos</h3>
      </div>
      <div class="executive-item"><label>¿Se requieren uso de herramientas especiales?</label><p>${
        data.requiere_herramientas_especiales ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>¿Cuál?</label><p>${
        data.tipo_herramientas_especiales ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>¿El equipo o herramienta, son los adecuados para el trabajo?</label><p>${
        data.herramientas_adecuadas ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>¿Se requiere verificación previa de las condiciones del trabajo?</label><p>${
        data.requiere_verificacion_previa ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>¿Se requiere conocer los riesgos del producto que se va a manejar?</label><p>${
        data.requiere_conocer_riesgos ?? "Sin información"
      }</p></div>
      <div class="executive-item"><label>Observaciones adicionales:</label><p>${
        data.observaciones_medidas ??
        data.observaciones_adicionales ??
        "Sin información"
      }</p></div>
    </div>
  `;
}

export function renderAperturaArea(data = {}) {
  const requisitos = [
    {
      label: "¿Debe de estar fuera de operación el equipo o línea?",
      key: "fuera_operacion",
    },
    {
      label: "¿Debe estar despresionado y purgado?",
      key: "despresurizado_purgado",
    },
    { label: "¿Es necesario aislarlo?", key: "necesita_aislamiento" },
    { label: "¿Con válvulas?", key: "con_valvulas" },
    { label: "¿Con juntas ciegas?", key: "con_juntas_ciegas" },
    { label: "¿Pudo quedar producto entrampado?", key: "producto_entrampado" },
    { label: "¿El equipo y/o línea requiere lavado?", key: "requiere_lavado" },
    {
      label: "¿El equipo y/o línea requiere neutralizado?",
      key: "requiere_neutralizado",
    },
    {
      label: "¿El equipo y/o línea requiere vaporizado?",
      key: "requiere_vaporizado",
    },
    {
      label: "¿Se deben suspender los trabajos adyacentes?",
      key: "suspender_trabajos_adyacentes",
    },
    { label: "¿Se requiere acordonar el área?", key: "acordonar_area" },
    {
      label: "¿Se requiere prueba de gas tóxico/inflamable?",
      key: "prueba_gas_toxico_inflamable",
    },
    {
      label: "¿El equipo eléctrico se encuentra desenergizado?",
      key: "equipo_electrico_desenergizado",
    },
    {
      label: "¿Se requiere tapar purgas y/o registros de los drenajes?",
      key: "tapar_purgas_drenajes",
    },
  ];

  const filas = requisitos
    .map(
      (r, idx) => `
    <tr>
      <td>${r.label}</td>
      <td>
        <label><input type="radio" name="${r.key}" value="SI" ${
        data[r.key] === "SI" ? "checked" : ""
      }> SI</label>
        <label><input type="radio" name="${r.key}" value="NO" ${
        data[r.key] === "NO" ? "checked" : ""
      }> NO</label>
        <label><input type="radio" name="${r.key}" value="N/A" ${
        data[r.key] === "N/A" ? "checked" : ""
      }> N/A</label>
      </td>
    </tr>
  `
    )
    .join("");

  return `
  <form id="form-apertura-area">
    <table class="tabla-requisitos">
      <thead class="thead-area">
        <tr>
          <th>Requisito</th>
          <th>Respuesta</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>
  </form>
`;
}

export function renderAperturaAreaVisual(data = {}) {
  const requisitos = [
    {
      label: "¿Debe de estar fuera de operación el equipo o línea?",
      key: "fuera_operacion",
    },
    {
      label: "¿Debe estar despresionado y purgado?",
      key: "despresurizado_purgado",
    },
    { label: "¿Es necesario aislarlo?", key: "necesita_aislamiento" },
    { label: "¿Con válvulas?", key: "con_valvulas" },
    { label: "¿Con juntas ciegas?", key: "con_juntas_ciegas" },
    { label: "¿Pudo quedar producto entrampado?", key: "producto_entrampado" },
    { label: "¿El equipo y/o línea requiere lavado?", key: "requiere_lavado" },
    {
      label: "¿El equipo y/o línea requiere neutralizado?",
      key: "requiere_neutralizado",
    },
    {
      label: "¿El equipo y/o línea requiere vaporizado?",
      key: "requiere_vaporizado",
    },
    {
      label: "¿Se deben suspender los trabajos adyacentes?",
      key: "suspender_trabajos_adyacentes",
    },
    { label: "¿Se requiere acordonar el área?", key: "acordonar_area" },
    {
      label: "¿Se requiere prueba de gas tóxico/inflamable?",
      key: "prueba_gas_toxico_inflamable",
    },
    {
      label: "¿El equipo eléctrico se encuentra desenergizado?",
      key: "equipo_electrico_desenergizado",
    },
    {
      label: "¿Se requiere tapar purgas y/o registros de los drenajes?",
      key: "tapar_purgas_drenajes",
    },
  ];

  const filas = requisitos
    .map(
      (r) => `
    <tr>
      <td>${r.label}</td>
      <td><strong>${data[r.key] || "-"}</strong></td>
    </tr>
  `
    )
    .join("");

  return `
  <table class="tabla-requisitos">
    <thead class="thead-area">
      <tr>
        <th>Requisito</th>
        <th>Respuesta</th>
      </tr>
    </thead>
    <tbody>
      ${filas}
    </tbody>
  </table>
`;
}

// aca inicia la parte del supervisor
// aca inicia la parte del supervisor
// aca inicia la parte del supervisor

export function renderAperturaSupervisor(data = {}) {
  return `
    <div class="executive-section">
      <div class="section-header section-header-supervisor">
        <i class="ri-checkbox-multiple-line"></i>
        <h3>Requisitos para Administrar los Riesgos</h3>
      </div>
      <form id="form-apertura-supervisor">
        <table class="tabla-requisitos">
          <thead class="thead-supervisor">
            <tr>
              <th>Requisito</th>
              <th class="centered">SI</th>
              <th class="centered">NO</th>
              <th class="centered">N/A</th>
              <th class="centered">Detalle</th>
            </tr>
          </thead>
          <tbody>
            ${renderRadioRowTable(
              "Equipo de proteccion especial recomendado:",
              "special-protection",
              data["special-protection"]
            )}
            ${renderRadioRowTable(
              "Para piel y cuerpo:",
              "skin-protection",
              data["skin-protection"]
            )}
            ${renderRadioRowTable(
              "Protección respiratoria:",
              "respiratory-protection",
              data["respiratory-protection"]
            )}
            ${renderRadioRowTable(
              "Protección ocular :",
              "eye-protection",
              data["eye-protection"]
            )}
            ${renderRadioRowTable(
              "¿Se requiere protección contraincendio?",
              "fire-protection",
              data["fire-protection"],
              `<input type='text' name='fire-protection-type' placeholder='¿Cuál?' value='${
                data["fire-protection-type"] || ""
              }' class='compact'>`
            )}
            ${renderRadioRowTable(
              "¿Instalación de barreras y/o barricadas?",
              "barriers-required",
              data["barriers-required"]
            )}
            <tr>
              <td>Observaciones adicionales</td>
              <td colspan="4"><textarea id="observations" name="observations" rows="2" style="width:100%" placeholder="Ingrese cualquier observación adicional">${
                data["observations"] || ""
              }</textarea></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
    <div class="executive-section">
      <div class="section-header section-header-supervisor" style="margin-top:2em;">
        <i class="ri-flask-line"></i>
        <h3>Registro de pruebas requeridas</h3>
      </div>
      <form id="form-pruebas-supervisor">
        <table class="tabla-requisitos">
  <thead class="thead-pruebas-supervisor">
    <tr>
      <th>Prueba</th>
      <th>Valor</th>
    </tr>
  </thead>
  <tbody>
            ${renderInputRowTable("% de CO2", "co2-level", data["co2-level"])}
            ${renderInputRowTable("% Amoniaco", "nh3-level", data["nh3-level"])}
            ${renderInputRowTable(
              "% de Oxígeno",
              "oxygen-level",
              data["oxygen-level"]
            )}
            ${renderInputRowTable(
              "% de Explosividad LEL",
              "lel-level",
              data["lel-level"]
            )}
          </tbody>
        </table>
      </form>
    </div>
  `;
}

export function renderAperturaSupervisorVisual(data = {}) {
  const requisitos = [
    { label: "Equipo de protección especial recomendado:", key: "special-protection" },
    { label: "Para piel y cuerpo:", key: "skin-protection" },
    { label: "Protección respiratoria:", key: "respiratory-protection" },
    { label: "Protección ocular:", key: "eye-protection" },
    { label: "¿Se requiere protección contraincendio?", key: "fire-protection", detalle: "fire-protection-type" },
    { label: "¿Instalación de barreras y/o barricadas?", key: "barriers-required" },
  ];

  const filas = requisitos.map(r => `
    <tr>
      <td>${r.label}</td>
      <td><strong>${data[r.key] || "-"}</strong></td>
      ${r.detalle ? `<td>${data[r.detalle] || ""}</td>` : "<td></td>"}
    </tr>
  `).join("");

  return `
    <div class="executive-section">
      <div class="section-header section-header-supervisor">
        <i class="ri-checkbox-multiple-line"></i>
        <h3>Requisitos para Administrar los Riesgos</h3>
      </div>
      <table class="tabla-requisitos tabla-requisitos-supervisor">
        <thead class="thead-supervisor">
          <tr>
            <th>Requisito</th>
            <th>Respuesta</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
          <tr>
            <td>Observaciones adicionales</td>
            <td colspan="2">${data.observations || "-"}</td>
          </tr>
        </tbody>
      </table>
      <div class="section-header section-header-supervisor" style="margin-top:2em;">
        <i class="ri-flask-line"></i>
        <h3>Registro de pruebas requeridas</h3>
      </div>
      <table class="tabla-requisitos tabla-requisitos-supervisor">
        <thead class="thead-supervisor">
          <tr>
            <th>Prueba</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>% de CO2</td><td><strong>${data["co2-level"] || "-"}</strong></td></tr>
          <tr><td>% Amoniaco</td><td><strong>${data["nh3-level"] || "-"}</strong></td></tr>
          <tr><td>% de Oxígeno</td><td><strong>${data["oxygen-level"] || "-"}</strong></td></tr>
          <tr><td>% de Explosividad LEL</td><td><strong>${data["lel-level"] || "-"}</strong></td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderRadioRowTable(label, name, value, extra = "") {
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
      <td>${extra}</td>
    </tr>
  `;
}

function renderInputRowTable(label, name, value) {
  return `
    <tr>
      <td>${label}</td>
      <td><input type="text" name="${name}" class="compact" value="${
    value || ""
  }"></td>
    </tr>
  `;
}

// Helpers para los radios e inputs:
function renderRadioRow(label, name, value) {
  return `
    <div class="form-table-row">
      <div class="form-table-label">
        <label>${label}</label>
      </div>
      <div class="form-table-options">
        <div class="yes-no-na compact">
          ${renderRadio(name, value)}
        </div>
      </div>
    </div>
  `;
}

function renderRadio(name, value) {
  return `
    <label><input type="radio" name="${name}" value="SI" ${
    value === "SI" ? "checked" : ""
  }></label>
    <label><input type="radio" name="${name}" value="NO" ${
    value === "NO" ? "checked" : ""
  }></label>
    <label><input type="radio" name="${name}" value="N/A" ${
    value === "N/A" ? "checked" : ""
  }></label>
  `;
}

function renderInputRow(label, name, value) {
  return `
    <div class="form-table-row">
      <div class="form-table-label">
        <label for="${name}">${label}</label>
      </div>
      <div class="form-table-options">
        <input type="text" id="${name}" name="${name}" class="compact" value="${
    value || ""
  }">
      </div>
    </div>
  `;
}
