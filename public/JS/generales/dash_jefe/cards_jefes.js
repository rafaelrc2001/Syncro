// Lógica para rellenar las tarjetas del dashboard de jefe
// Usa el endpoint /api/graficas_jefes/permisos-jefes

async function cargarTarjetasJefe() {
  // Función para normalizar estatus (sin mayúsculas, acentos, puntos, espacios extra)
  function normalizar(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // quitar acentos
      .replace(/[.]/g, "") // quitar puntos
      .replace(/\s+/g, " ") // espacios múltiples a uno
      .trim();
  }
  try {
    const res = await fetch("/api/graficas_jefes/permisos-jefes");
    const data = await res.json();

    // Inicializar contadores y desglose
    let total = 0;
    let activos = 0;
    let noAutorizados = 0;
    let porAutorizar = 0;
    let terminados = 0;
    // Desglose de estatus
    const desglose = {
      activos: {},
      noAutorizados: {},
      porAutorizar: {},
      terminados: {},
    };

    data.forEach((permiso) => {
      total++;
      const estatus = normalizar(permiso.estatus);
      // Activo
      if (estatus === "activo") {
        activos++;
        desglose.activos[estatus] = (desglose.activos[estatus] || 0) + 1;
      }
      // No autorizado
      else if (estatus === "no autorizado") {
        noAutorizados++;
        desglose.noAutorizados[estatus] =
          (desglose.noAutorizados[estatus] || 0) + 1;
      }
      // Por autorizar (en espera del area o espera seguridad)
      else if (
        estatus === "en espera del area" ||
        estatus === "espera seguridad"
      ) {
        porAutorizar++;
        desglose.porAutorizar[estatus] =
          (desglose.porAutorizar[estatus] || 0) + 1;
      }
      // Terminados (cancelado, cierre con incidentes, cierre con accidentes, cierre sin incidentes, terminado)
      else if (
        estatus === "cancelado" ||
        estatus === "cierre con incidentes" ||
        estatus === "cierre con accidentes" ||
        estatus === "cierre sin incidentes" ||
        estatus === "terminado"
      ) {
        terminados++;
        desglose.terminados[estatus] = (desglose.terminados[estatus] || 0) + 1;
      }
    });

    // Seleccionar todos los elementos .count en el orden visual de las tarjetas
    const counts = document.querySelectorAll(".cards-section .card .count");
    if (counts.length >= 5) {
      counts[0].textContent = total; // Total de Permisos
      counts[1].textContent = porAutorizar; // Por Autorizar
      counts[2].textContent = activos; // Activos
      counts[3].textContent = terminados; // Terminados
      counts[4].textContent = noAutorizados; // No Autorizados

      // Tooltips: mostrar desglose de estatus con explicación y formato visual (HTML)
      const explicaciones = [
        null,
        "Permisos en espera de autorización por área o seguridad:",
        "Permisos actualmente activos:",
        "Permisos terminados (cancelado, cierre con incidentes, cierre con accidentes, cierre sin incidentes, terminado):",
        "Permisos que no fueron autorizados:",
      ];
      const tooltips = [
        null, // Total de Permisos no necesita desglose
        desglose.porAutorizar,
        desglose.activos,
        desglose.terminados,
        desglose.noAutorizados,
      ];
      for (let i = 1; i < counts.length; i++) {
        if (tooltips[i]) {
          const lines = Object.entries(tooltips[i])
            .map(
              ([estatus, count]) =>
                `<b>${capitalizeWords(estatus)}:</b> ${count}`
            )
            .join("<br>");
          const html = `<div style='font-size:1rem;margin-bottom:6px;'>${explicaciones[i]}</div>${lines}`;
          counts[i].parentElement.setAttribute("data-tooltip", html);
        }
      }
      // Función para capitalizar cada palabra
      function capitalizeWords(str) {
        return str.replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }
  } catch (err) {
    console.error("Error al cargar tarjetas jefe:", err);
  }
}

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", cargarTarjetasJefe);
