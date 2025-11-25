const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs").promises;

/**
 * Generador de PDF para PT2 usando Puppeteer
 * Convierte HTML a PDF manteniendo estilos y formato profesional
 */
class PT2PDFGenerator {
  constructor() {
    this.browser = null;
  }

  /**
   * Inicializa el navegador de Puppeteer
   */
  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-zygote",
          "--single-process",
        ],
      });
    }
    return this.browser;
  }

  /**
   * Cierra el navegador
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Genera el HTML completo con todos los estilos incluidos
   */
  generateCompleteHTML(data) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PT2 - Permiso de Trabajo para Apertura Equipo o Línea</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600&family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        /* Variables CSS */
        :root {
            --azul-petroleo: #003B5C;
            --azul-cielo: #42d4f8;
            --verde-success: #28a745;
            --rojo-danger: #c62828;
            --gris-claro: #f4f6fb;
            --blanco: #fff;
        }

        /* Reset y base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', Arial, sans-serif;
            color: #333;
            line-height: 1.4;
            font-size: 11pt;
            background: white;
        }

        /* Contenedor principal */
        .pdf-container {
            max-width: 100%;
            margin: 0;
            padding: 20pt;
        }

        /* Encabezados */
        .section-header {
            display: flex;
            align-items: center;
            gap: 8pt;
            margin-bottom: 12pt;
            padding: 8pt 12pt;
            border-radius: 4pt;
            justify-content: center;
            text-align: center;
        }

        .section-header h2 {
            font-family: 'Montserrat', sans-serif;
            font-size: 18pt;
            color: var(--azul-petroleo);
            margin: 0;
        }

        .section-header h3 {
            font-family: 'Montserrat', sans-serif;
            font-size: 14pt;
            color: var(--azul-petroleo);
            font-weight: 600;
            margin: 0;
        }

        .section-header i {
            font-size: 16pt;
            color: var(--azul-petroleo);
        }

        /* Estilos específicos por sección */
        .pt2-datos-generales .section-header,
        .pt2-medidas-riesgos .section-header {
            background: rgba(13, 97, 34, 0.08);
            border: 1pt solid rgba(13, 97, 34, 0.3);
        }

        .pt2-requisitos-apertura .section-header,
        .pt2-condiciones-proceso .section-header {
            background: rgba(2, 200, 250, 0.08);
            border: 1pt solid rgba(2, 200, 250, 0.3);
        }

        .requisitos-riesgos-section .section-header,
        .registro-pruebas-section .section-header {
            background: rgba(92, 0, 3, 0.08);
            border: 1pt solid rgba(92, 0, 3, 0.3);
        }

        .pt1-ast-seguridad .section-header,
        .pt1-personal-involucrado .section-header {
            background: rgba(103, 58, 183, 0.08);
            border: 1pt solid rgba(103, 58, 183, 0.3);
        }

        /* Secciones */
        .executive-section {
            margin-bottom: 16pt;
            page-break-inside: avoid;
        }

        /* Grids */
        .executive-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8pt;
            margin-bottom: 12pt;
        }

        .executive-item {
            border: 1pt solid #ddd;
            padding: 6pt;
            background: #f9f9f9;
        }

        .executive-item label {
            font-weight: bold;
            font-size: 9pt;
            color: #333;
            display: block;
            margin-bottom: 3pt;
        }

        .executive-item p {
            font-size: 10pt;
            margin: 0;
            color: #000;
        }

        .executive-item .highlight {
            background: #fff3cd;
            padding: 2pt 4pt;
            border-radius: 2pt;
        }

        /* Tablas */
        .styled-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12pt;
            font-size: 9pt;
        }

        .styled-table th,
        .styled-table td {
            border: 1pt solid #333;
            padding: 4pt 6pt;
            text-align: left;
            vertical-align: top;
        }

        .styled-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
            font-size: 8pt;
        }

        .styled-table .centered {
            text-align: center;
        }

        /* AST Grid */
        .safety-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8pt;
            margin-top: 12pt;
        }

        .safety-item {
            border: 1pt solid #ddd;
            padding: 6pt;
            background: #f9f9f9;
        }

        .safety-item h4 {
            font-size: 10pt;
            margin-bottom: 4pt;
            color: var(--azul-petroleo);
        }

        .safety-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .safety-list li {
            font-size: 8pt;
            padding: 1pt 0;
            border-bottom: 0.5pt dotted #ccc;
        }

        /* Aprobaciones */
        .approval-section {
            margin-top: 16pt;
            page-break-inside: avoid;
        }

        .approval-stamps {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12pt;
        }

        .stamp {
            border: 2pt solid var(--azul-petroleo);
            padding: 12pt;
            text-align: center;
            background: #f9f9f9;
        }

        .stamp-title {
            font-weight: bold;
            font-size: 9pt;
            margin-bottom: 8pt;
            color: var(--azul-petroleo);
        }

        .signature-space {
            height: 24pt;
            border-bottom: 1pt solid #333;
            margin-bottom: 6pt;
        }

        .stamp-name {
            font-size: 8pt;
            font-weight: bold;
        }

        /* Control de saltos de página */
        .page-break-before {
            page-break-before: always;
        }

        .page-break-after {
            page-break-after: always;
        }

        .no-page-break {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <div class="pdf-container">
        <!-- TÍTULO PRINCIPAL -->
        <div class="section-header" style="margin-bottom: 20pt;">
            <i class="ri-checkbox-circle-line"></i>
            <h2>Permiso de Trabajo para Apertura Equipo o Línea</h2>
        </div>

        <!-- DATOS GENERALES -->
        <div class="executive-section pt2-datos-generales">
            <div class="section-header">
                <i class="ri-information-line"></i>
                <h3>Datos generales</h3>
            </div>
            <div class="executive-grid">
                <div class="executive-item">
                    <label>Tipo de mantenimiento</label>
                    <p class="highlight">\${data.maintenance_type || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>O.T. No.</label>
                    <p>\${data.work_order || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>TAG</label>
                    <p>\${data.tag || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>Hora de inicio</label>
                    <p>\${data.start_time || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>Equipo</label>
                    <p>\${data.equipment_description || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>Descripción del trabajo</label>
                    <p>\${data.work_description || '-'}</p>
                </div>
            </div>
        </div>

        <!-- MEDIDAS PARA ADMINISTRAR RIESGOS -->
        <div class="executive-section pt2-medidas-riesgos">
            <div class="section-header">
                <i class="ri-checkbox-multiple-line"></i>
                <h3>Medidas para administrar los riesgos</h3>
            </div>
            <div class="executive-grid">
                <div class="executive-item">
                    <label>¿Se requieren uso de herramientas especiales?</label>
                    <p>\${data.special_tools || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>¿El equipo o herramienta, son los adecuados para el trabajo?</label>
                    <p>\${data.adequate_tools || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>¿Se requiere verificación previa de las condiciones del trabajo?</label>
                    <p>\${data.pre_verification || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>¿Se requiere conocer los riesgos del producto que se va a manejar?</label>
                    <p>\${data.risk_knowledge || '-'}</p>
                </div>
                <div class="executive-item" style="grid-column: 1 / -1;">
                    <label>Observaciones adicionales</label>
                    <p>\${data.final_observations || '-'}</p>
                </div>
            </div>
        </div>

        <!-- REQUISITOS DE APERTURA -->
        <div class="executive-section pt2-requisitos-apertura">
            <div class="section-header">
                <i class="ri-tools-line"></i>
                <h3>Requisitos de apertura de área</h3>
            </div>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Requisito</th>
                        <th>Respuesta</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>¿Debe de estar fuera de operación el equipo o línea?</td><td class="centered">\${data.fuera_operacion || '-'}</td></tr>
                    <tr><td>¿Debe estar despresionado y purgado?</td><td class="centered">\${data.despresurizado_purgado || '-'}</td></tr>
                    <tr><td>¿Es necesario aislarlo?</td><td class="centered">\${data.necesita_aislamiento || '-'}</td></tr>
                    <tr><td>¿Con válvulas?</td><td class="centered">\${data.con_valvulas || '-'}</td></tr>
                    <tr><td>¿Con juntas ciegas?</td><td class="centered">\${data.con_juntas_ciegas || '-'}</td></tr>
                    <tr><td>¿Pudo quedar producto entrampado?</td><td class="centered">\${data.producto_entrampado || '-'}</td></tr>
                    <tr><td>¿El equipo y/o línea requiere lavado?</td><td class="centered">\${data.requiere_lavado || '-'}</td></tr>
                    <tr><td>¿El equipo y/o línea requiere neutralizado?</td><td class="centered">\${data.requiere_neutralizado || '-'}</td></tr>
                    <tr><td>¿El equipo y/o línea requiere vaporizado?</td><td class="centered">\${data.requiere_vaporizado || '-'}</td></tr>
                    <tr><td>¿Se deben suspender los trabajos adyacentes?</td><td class="centered">\${data.suspender_trabajos_adyacentes || '-'}</td></tr>
                    <tr><td>¿Se requiere acordonar el área?</td><td class="centered">\${data.acordonar_area || '-'}</td></tr>
                    <tr><td>¿Se requiere prueba de gas tóxico/inflamable?</td><td class="centered">\${data.prueba_gas_toxico_inflamable || '-'}</td></tr>
                    <tr><td>¿El equipo eléctrico se encuentra desenergizado?</td><td class="centered">\${data.equipo_electrico_desenergizado || '-'}</td></tr>
                    <tr><td>¿Se requiere tapar purgas y/o registros de los drenajes?</td><td class="centered">\${data.tapar_purgas_drenajes || '-'}</td></tr>
                </tbody>
            </table>
        </div>

        <!-- CONDICIONES DEL PROCESO -->
        <div class="executive-section pt2-condiciones-proceso">
            <div class="section-header">
                <i class="ri-flask-line"></i>
                <h3>Condiciones del Proceso</h3>
            </div>
            <div class="executive-grid">
                <div class="executive-item">
                    <label>Fluido</label>
                    <p class="highlight">\${data.fluid || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>Presión</label>
                    <p>\${data.pressure || '-'}</p>
                </div>
                <div class="executive-item">
                    <label>Temperatura</label>
                    <p>\${data.temperature || '-'}</p>
                </div>
            </div>
        </div>

        <!-- REGISTRO DE PRUEBAS -->
        <div class="executive-section registro-pruebas-section">
            <div class="section-header">
                <i class="ri-checkbox-multiple-line"></i>
                <h3>REGISTRO DE PRUEBAS REQUERIDAS</h3>
            </div>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>PRUEBA DE GAS</th>
                        <th>Valor</th>
                        <th>¿APROBADO?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>% de CO2:</td><td>\${data.valor_co2 || '-'}</td><td class="centered">\${data.aprobado_co2 || '-'}</td></tr>
                    <tr><td>% Amoniaco:</td><td>\${data.valor_amonico || '-'}</td><td class="centered">\${data.aprobado_amonico || '-'}</td></tr>
                    <tr><td>% de Oxigeno:</td><td>\${data.valor_oxigeno || '-'}</td><td class="centered">\${data.aprobado_oxigeno || '-'}</td></tr>
                    <tr><td>% de Explosividad LEL:</td><td>\${data.valor_lel || '-'}</td><td class="centered">\${data.aprobado_lel || '-'}</td></tr>
                </tbody>
            </table>
        </div>

        <!-- AST -->
        <div class="executive-section pt1-ast-seguridad page-break-before">
            <div class="section-header">
                <i class="ri-shield-check-line"></i>
                <h3>AST - Análisis de Seguridad en el Trabajo</h3>
            </div>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Secuencia de la Actividad</th>
                        <th>Personal Ejecutor</th>
                        <th>Peligros Potenciales</th>
                        <th>Acciones Preventivas</th>
                        <th>Responsable</th>
                    </tr>
                </thead>
                <tbody>
                    \${this.generateASTRows(data.ast_activities)}
                </tbody>
            </table>
            <div class="safety-grid">
                <div class="safety-item">
                    <h4><i class="ri-shield-user-line"></i> EPP Requerido</h4>
                    <ul class="safety-list">
                        \${this.generateSafetyList(data.epp_requerido)}
                    </ul>
                </div>
                <div class="safety-item">
                    <h4><i class="ri-tools-line"></i> Maquinaria y Herramientas</h4>
                    <ul class="safety-list">
                        \${this.generateSafetyList(data.maquinaria_herramientas)}
                    </ul>
                </div>
                <div class="safety-item">
                    <h4><i class="ri-box-line"></i> Materiales y Accesorios</h4>
                    <ul class="safety-list">
                        \${this.generateSafetyList(data.material_accesorios)}
                    </ul>
                </div>
            </div>
        </div>

        <!-- PERSONAL INVOLUCRADO -->
        <div class="executive-section pt1-personal-involucrado">
            <div class="section-header">
                <i class="ri-team-line"></i>
                <h3>Personal Involucrado</h3>
            </div>
            <table class="styled-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Función</th>
                        <th>Credencial</th>
                        <th>Cargo</th>
                    </tr>
                </thead>
                <tbody>
                    \${this.generatePersonalRows(data.personal_involucrado)}
                </tbody>
            </table>
        </div>

        <!-- APROBACIONES -->
        <div class="approval-section">
            <div class="approval-stamps">
                <div class="stamp">
                    <div class="stamp-title">Responsable del área:</div>
                    <div class="signature-space">&nbsp;</div>
                    <div class="stamp-name">\${data.responsable_area_nombre || '-'}</div>
                </div>
                <div class="stamp">
                    <div class="stamp-title">Operador del área:</div>
                    <div class="signature-space">&nbsp;</div>
                    <div class="stamp-name">\${data.operador_area_nombre || '-'}</div>
                </div>
                <div class="stamp">
                    <div class="stamp-title">Supervisor de Seguridad:</div>
                    <div class="signature-space">&nbsp;</div>
                    <div class="stamp-name">\${data.supervisor_nombre || '-'}</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Genera las filas de actividades AST
   */
  generateASTRows(activities) {
    if (!Array.isArray(activities) || activities.length === 0) {
      return '<tr><td colspan="6" style="text-align: center; font-style: italic;">No hay actividades registradas</td></tr>';
    }

    return activities
      .map(
        (activity) => `
            <tr>
                <td>${activity.no || "-"}</td>
                <td>${activity.secuencia_actividad || "-"}</td>
                <td>${activity.personal_ejecutor || "-"}</td>
                <td>${activity.peligros_potenciales || "-"}</td>
                <td>${activity.acciones_preventivas || "-"}</td>
                <td>${activity.responsable || "-"}</td>
            </tr>
        `
      )
      .join("");
  }

  /**
   * Genera las filas de personal involucrado
   */
  generatePersonalRows(personal) {
    if (!Array.isArray(personal) || personal.length === 0) {
      return '<tr><td colspan="4" style="text-align: center; font-style: italic;">No hay personal registrado</td></tr>';
    }

    return personal
      .map(
        (person) => `
            <tr>
                <td>${person.nombre || "-"}</td>
                <td>${person.funcion || "-"}</td>
                <td>${person.credencial || "-"}</td>
                <td>${person.cargo || "-"}</td>
            </tr>
        `
      )
      .join("");
  }

  /**
   * Genera listas de seguridad
   */
  generateSafetyList(items) {
    if (!items || items === "-") {
      return "<li>No especificado</li>";
    }

    if (typeof items === "string") {
      return items
        .split(",")
        .map((item) => `<li>${item.trim()}</li>`)
        .join("");
    }

    if (Array.isArray(items)) {
      return items.map((item) => `<li>${item}</li>`).join("");
    }

    return "<li>No especificado</li>";
  }

  /**
   * Genera el PDF usando Puppeteer
   */
  async generatePDF(data, options = {}) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      // Configurar la página
      await page.setViewport({ width: 1200, height: 1600 });

      // Generar HTML completo
      const html = this.generateCompleteHTML(data);

      // Cargar el HTML en la página
      await page.setContent(html, {
        waitUntil: ["networkidle0", "domcontentloaded"],
        timeout: 30000,
      });

      // Configuración del PDF
      const pdfOptions = {
        format: "A4",
        printBackground: true,
        margin: {
          top: "1.5cm",
          right: "1.5cm",
          bottom: "1.5cm",
          left: "1.5cm",
        },
        //displayHeaderFooter: false,
        headerTemplate: `
                    <div style="font-size: 8pt; width: 100%; text-align: center; color: #666;">
                        PT2 - Permiso de Trabajo para Apertura Equipo o Línea
                    </div>
                `,
        footerTemplate: `
                    <div style="font-size: 8pt; width: 100%; display: flex; justify-content: space-between; padding: 0 1.5cm; color: #666;">
                        <span>Fecha de generación: ${new Date().toLocaleDateString(
                          "es-ES"
                        )}</span>
                        <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
                    </div>
                `,
        ...options,
      };

      // Generar PDF
      const pdfBuffer = await page.pdf(pdfOptions);

      return pdfBuffer;
    } finally {
      await page.close();
    }
  }
}

module.exports = PT2PDFGenerator;
