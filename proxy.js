const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy todas las peticiones que empiecen con /webhook/ hacia tu endpoint HTTP inseguro
app.use(['/webhook', '/webhook-test'], createProxyMiddleware({
  target: 'http://187.157.36.37:5678',
  changeOrigin: true,
  secure: false, // Permite HTTP en el destino
  pathRewrite: (path, req) => path, // Mantiene la ruta original
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy HTTPS escuchando en el puerto ${PORT}`);
});
