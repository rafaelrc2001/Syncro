// Instala ua-parser-js: npm install ua-parser-js
const express = require('express');
const UAParser = require('ua-parser-js');
const router = express.Router();

router.get('/detectar-dispositivo', (req, res) => {
  const userAgent = req.headers['user-agent'];
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  res.json({
    so: result.os.name,
    dispositivo: result.device.type || "desktop",
    marca: result.device.vendor || null,
    modelo: result.device.model || null
  });
});

module.exports = router;
