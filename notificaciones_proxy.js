const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// URLS de los webhooks de n8n (ajusta según tus endpoints reales)
const N8N_URLS = {
  permisoActivo: 'https://n8n.proagroindustria.com/webhook/permisoactivo',
  permisoNoAutorizado: 'https://n8n.proagroindustria.com/webhook/permiso-no-autorizado',
  cierrePermiso: 'https://n8n.proagroindustria.com/webhook/cierre-permiso',
  finalizadoEmail: 'https://n8n.proagroindustria.com/webhook/finalizado-email',
  email: 'https://n8n.proagroindustria.com/webhook/email',
};

async function forwardToN8N(url, req, res) {
  try {
    console.log('[PROXY] Reenviando a n8n:', url);
    const n8nRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await n8nRes.json().catch(() => ({}));
    console.log('[PROXY] Respuesta de n8n:', data);
    res.status(n8nRes.status).json(data);
  } catch (err) {
    console.error('[PROXY] Error al reenviar a n8n:', err);
    res.status(500).json({ error: 'Error al reenviar a n8n', details: err.message });
  }
}

// /api/notificar-permiso-activo
router.post('/notificar-permiso-activo', (req, res) => {
  console.log('[PROXY] Recibida petición a /api/notificar-permiso-activo');
  console.log('[PROXY] Body recibido:', req.body);
  forwardToN8N(N8N_URLS.permisoActivo, req, res);
});

// /api/notificar-permiso-no-autorizado
router.post('/notificar-permiso-no-autorizado', (req, res) => {
  forwardToN8N(N8N_URLS.permisoNoAutorizado, req, res);
});

// /api/notificar-cierre-permiso
router.post('/notificar-cierre-permiso', (req, res) => {
  forwardToN8N(N8N_URLS.cierrePermiso, req, res);
});

// /api/notificar-finalizado-email
router.post('/notificar-finalizado-email', (req, res) => {
  forwardToN8N(N8N_URLS.finalizadoEmail, req, res);
});

// /api/notificar-email
router.post('/notificar-email', (req, res) => {
  forwardToN8N(N8N_URLS.email, req, res);
});

module.exports = router;
