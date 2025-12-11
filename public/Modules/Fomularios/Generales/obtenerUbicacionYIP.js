// public/Modules/Fomularios/Generales/obtenerUbicacionYIP.js

async function obtenerUbicacionYIP() {
  console.log("Ejecutando obtenerUbicacionYIP...");
  try {
    // Obtener IP pública
    const ipResp = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResp.json();
    const ip = ipData.ip || "No disponible";
    console.log("IP pública obtenida:", ip);

    // Obtener ubicación GPS
    if (navigator.geolocation) {
      console.log("Solicitando geolocalización...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lon = pos.coords.longitude.toFixed(6);
          console.log("Ubicación obtenida:", lat, lon);
          alert(
            `IP Pública: ${ip}\nUbicación: ${lat}, ${lon}\nGoogle Maps: https://www.google.com/maps?q=${lat},${lon}`
          );
        },
        (err) => {
          console.log("Error al obtener ubicación:", err.message);
          alert(`IP Pública: ${ip}\nUbicación: Error GPS: ${err.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 0,
        }
      );
    } else {
      console.log("Geolocalización no soportada");
      alert(`IP Pública: ${ip}\nUbicación: Geolocalización no soportada`);
    }
  } catch (error) {
    console.log("Error general en obtenerUbicacionYIP:", error);
    alert("Error obteniendo IP o ubicación");
  }
}

// Exportar globalmente para usar desde cualquier botón
window.obtenerUbicacionYIP = obtenerUbicacionYIP;
