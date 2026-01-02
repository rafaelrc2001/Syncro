// public/Modules/Fomularios/Generales/obtenerUbicacionYIP.js


// Función para obtener info de dispositivo desde el backend
async function obtenerInfoDispositivoBackend() {
  const endpoint = '/api/detectar-dispositivo';
  console.log('Consultando el endpoint de dispositivo:', endpoint);
  try {
    const res = await fetch(endpoint);
    const resultado = await res.json();
    console.log('Este es el resultado del endpoint:', resultado);
    return resultado;
  } catch (e) {
    console.log('No se pudo obtener info del backend');
    return null;
  }
}



async function obtenerUbicacionYIP() {
  mostrarLoader();
  let ip = "";
  let localizacion = "";
  let dispositivo = null;
  dispositivo = await obtenerInfoDispositivoBackend();

  // Si es PC (Windows, MacOS, Linux), no pedir ubicación
  if (dispositivo && (dispositivo.so === "Windows" || dispositivo.so === "Mac OS" || dispositivo.so === "MacOS" || dispositivo.so === "Linux")) {
    ocultarLoader();
    ip = await fetch("https://api.ipify.org?format=json").then(r => r.json()).then(d => d.ip || "No disponible").catch(() => "Error obteniendo IP");
    console.log("IP obtenida:", ip);
    return { ip, localizacion: "No requerida en PC", dispositivo };
  }

  // Si es móvil, pedir ubicación obligatoria y mostrar modal
  if (dispositivo && (dispositivo.so === "Android" || dispositivo.so === "iOS")) {
    // Crear modal si no existe
    let modal = document.getElementById("modal-ubicacion-obligatoria");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-ubicacion-obligatoria";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100vw";
      modal.style.height = "100vh";
      modal.style.background = "rgba(0,0,0,0.7)";
      modal.style.display = "flex";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
      modal.style.zIndex = "9999";
      modal.innerHTML = `<div style='background:#fff;padding:2em;border-radius:10px;text-align:center;max-width:350px;'>
        <h3>Dispositivo móvil detectado</h3>
        <p>Debes activar la ubicación para continuar.<br>De lo contrario no se podrá continuar.</p>
        <button id='btnCerrarModalUbicacion'>Aceptar</button>
      </div>`;
      document.body.appendChild(modal);
    } else {
      modal.style.display = 'flex';
    }
    // Pedir ubicación obligatoria
    return new Promise((resolve) => {
      function bloquearYRecargar() {
        // Oculta el loader y recarga la página
        ocultarLoader();
        if (modal) modal.style.display = 'none';
        alert('No se pudo obtener la ubicación. La página se recargará para intentarlo de nuevo.');
        window.location.reload();
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lon = pos.coords.longitude.toFixed(6);
            localizacion = `${lat},${lon}`;
            ocultarLoader();
            resolve({ ip, localizacion, dispositivo });
          },
          (err) => {
            // Si falla la ubicación, bloquear flujo y recargar
            bloquearYRecargar();
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 0,
          }
        );
      } else {
        // Si no soporta geolocalización, bloquear flujo y recargar
        bloquearYRecargar();
      }
    });
  }

  // Si no se detecta el SO, comportamiento por defecto (como antes)
  try {
    const ipResp = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResp.json();
    ip = ipData.ip || "No disponible";
    console.log("IP obtenida:", ip);
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lon = pos.coords.longitude.toFixed(6);
            localizacion = `${lat},${lon}`;
            console.log("Ubicación obtenida:", localizacion);
            ocultarLoader();
            resolve({ ip, localizacion, dispositivo });
          },
          (err) => {
            localizacion = `Error GPS: ${err.message}`;
            console.log("Error al obtener ubicación:", localizacion);
            ocultarLoader();
            resolve({ ip, localizacion, dispositivo });
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
      console.log("Ubicación no soportada:", localizacion);
      ocultarLoader();
      return { ip, localizacion, dispositivo };
    }
  } catch (error) {
    ip = "Error obteniendo IP";
    localizacion = "Error obteniendo ubicación";
    console.log("Error obteniendo IP o ubicación:", ip, localizacion);
    ocultarLoader();
    return { ip, localizacion, dispositivo };
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





