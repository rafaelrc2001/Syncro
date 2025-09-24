const express = require("express");
const puppeteer = require("puppeteer");
const router = express.Router();

router.get("/imprimir-pt1/:id", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Cargar tu página PT1 con los datos
    await page.goto(`http://localhost:3000/pt1imprimir?id=${req.params.id}`);

    // Configuración profesional para impresión
    const pdfOptions = {
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate:
        '<div style="font-size:10px; text-align:center; width:100%;">Permiso de Trabajo PT1</div>',
      footerTemplate:
        '<div style="font-size:10px; text-align:center; width:100%;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
      margin: {
        top: "2cm",
        bottom: "2cm",
        left: "1.5cm",
        right: "1.5cm",
      },
    };

    const pdf = await page.pdf(pdfOptions);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=PT1.pdf");
    res.send(pdf);
  } catch (error) {
    res.status(500).send("Error generando PDF");
  }
});

module.exports = router;
