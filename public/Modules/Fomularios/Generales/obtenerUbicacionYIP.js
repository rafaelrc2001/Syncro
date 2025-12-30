// public/Modules/Fomularios/Generales/obtenerUbicacionYIP.js

async function obtenerUbicacionYIP() {
  mostrarLoader();
  let ip = "";
  let localizacion = "";
  try {
    const ipResp = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResp.json();
    ip = ipData.ip || "No disponible";
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lon = pos.coords.longitude.toFixed(6);
            localizacion = `${lat},${lon}`;
            ocultarLoader();
            resolve({ ip, localizacion });
          },
          (err) => {
            localizacion = `Error GPS: ${err.message}`;
            ocultarLoader();
            resolve({ ip, localizacion });
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          }
        );
      });
    } else {
      localizacion = "Geolocalización no soportada";
      ocultarLoader();
      return { ip, localizacion };
    }
  } catch (error) {
    ip = "Error obteniendo IP";
    localizacion = "Error obteniendo ubicación";
    ocultarLoader();
    return { ip, localizacion };
  }
}
function mostrarLoader() {
  document.getElementById("loader-ubicacion").style.display = "flex";
}
function ocultarLoader() {
  document.getElementById("loader-ubicacion").style.display = "none";
}

// Exportar globalmente para usar desde cualquier botón
window.obtenerUbicacionYIP = obtenerUbicacionYIP;




