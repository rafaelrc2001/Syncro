const express = require("express");
const PT2PDFGenerator = require("./pdf_generator");
const path = require("path");

const router = express.Router();
const pdfGenerator = new PT2PDFGenerator();

/**
 * Endpoint para generar PDF del PT2
 * POST /api/pt2/generate-pdf
 */
router.post("/generate-pdf", async (req, res) => {
  try {
    console.log("Iniciando generación de PDF PT2...");

    // Obtener datos del cuerpo de la petición
    const data = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron datos para generar el PDF",
      });
    }

    // Validar datos básicos requeridos
    const requiredFields = ["maintenance_type", "work_order", "tag"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Faltan campos requeridos: ${missingFields.join(", ")}`,
      });
    }

    // Generar el PDF
    const pdfBuffer = await pdfGenerator.generatePDF(data);

    // Configurar headers para la respuesta
    const filename = `PT2_Apertura_${data.work_order || "N-A"}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Enviar el PDF
    res.send(pdfBuffer);

    console.log(`PDF generado exitosamente: ${filename}`);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al generar el PDF",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Endpoint para previsualizar PDF (devuelve base64)
 * POST /api/pt2/preview-pdf
 */
router.post("/preview-pdf", async (req, res) => {
  try {
    console.log("Generando preview de PDF PT2...");

    const data = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "No se proporcionaron datos para generar el preview",
      });
    }

    // Generar el PDF
    const pdfBuffer = await pdfGenerator.generatePDF(data);

    // Convertir a base64
    const pdfBase64 = pdfBuffer.toString("base64");

    res.json({
      success: true,
      message: "Preview generado exitosamente",
      data: {
        pdf: `data:application/pdf;base64,${pdfBase64}`,
        filename: `PT2_Preview_${Date.now()}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error al generar preview:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al generar el preview",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Endpoint para obtener datos de un PT2 específico y generar PDF
 * GET /api/pt2/generate-pdf/:id
 */
router.get("/generate-pdf/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Aquí deberías obtener los datos del PT2 desde tu base de datos
    // Por ahora uso datos de ejemplo
    const data = await obtenerDatosPT2(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "PT2 no encontrado",
      });
    }

    // Generar el PDF
    const pdfBuffer = await pdfGenerator.generatePDF(data);

    const filename = `PT2_${id}_${new Date().toISOString().split("T")[0]}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error al generar PDF por ID:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * Función auxiliar para obtener datos del PT2 desde la base de datos
 * Debes implementar esta función según tu estructura de datos
 */
async function obtenerDatosPT2(id) {
  // Implementar consulta a la base de datos
  // Por ahora retorno datos de ejemplo
  return {
    id: id,
    maintenance_type: "Preventivo",
    work_order: "OT-2024-001",
    tag: "EQ-001",
    start_time: "08:00 AM",
    equipment_description: "Bomba centrifuga principal",
    work_description: "Mantenimiento preventivo de bomba",
    // ... más campos según tu estructura
  };
}

/**
 * Middleware para limpiar recursos al cerrar la aplicación
 */
process.on("SIGINT", async () => {
  console.log("Cerrando generador de PDF...");
  await pdfGenerator.closeBrowser();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Cerrando generador de PDF...");
  await pdfGenerator.closeBrowser();
  process.exit(0);
});

module.exports = router;
