// Lógica para rellenar las tarjetas del dashboard de supervisor
// Usa los datos filtrados expuestos en window.permisosJefeFiltrados

function actualizarTarjetasSupervisor() {
  function normalizar(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  try {
    const data = window.permisosJefeFiltrados || [];
    let total = 0;
    let activos = 0;
    let noAutorizados = 0;
    let porAutorizar = 0;
    let terminados = 0;
    const desglose = {
      activos: {},
      noAutorizados: {},
      porAutorizar: {},
      terminados: {},
    };
    data.forEach((permiso) => {
      total++;
      const estatus = normalizar(permiso.estatus);
      if (estatus === "activo") {
        activos++;
        desglose.activos[estatus] = (desglose.activos[estatus] || 0) + 1;
      } else if (estatus === "no autorizado") {
        noAutorizados++;
        desglose.noAutorizados[estatus] =
          (desglose.noAutorizados[estatus] || 0) + 1;
      } else if (
        estatus === "en espera del area" ||
        estatus === "espera seguridad"
      ) {
        porAutorizar++;
        desglose.porAutorizar[estatus] =
          (desglose.porAutorizar[estatus] || 0) + 1;
      } else if (
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
    const counts = document.querySelectorAll(".cards-section .card .count");
    if (counts.length >= 5) {
      counts[0].textContent = total;
      counts[1].textContent = porAutorizar;
      counts[2].textContent = activos;
      counts[3].textContent = terminados;
      counts[4].textContent = noAutorizados;
      const explicaciones = [null, "", "", "", ""];
      const tooltips = [
        null,
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
      function capitalizeWords(str) {
        return str.replace(/\b\w/g, (c) => c.toUpperCase());
      }
      document
        .querySelectorAll(
          ".cards-section .card[data-tooltip], .cards-section .card-content[data-tooltip]"
        )
        .forEach((element) => {
          // Evitar duplicar event listeners
          if (element.hasTooltipListeners) return;
          element.hasTooltipListeners = true;

          element.addEventListener("mouseenter", function (e) {
            // Eliminar cualquier tooltip previo del DOM
            document.querySelectorAll(".custom-tooltip").forEach((t) => t.remove());
            
            const tooltip = document.createElement("div");
            tooltip.className = "custom-tooltip";
            tooltip.innerHTML = this.getAttribute("data-tooltip");
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
            let top = rect.top - tooltipRect.height - 8;
            
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) {
              left = window.innerWidth - tooltipRect.width - 10;
            }
            if (top < 10) top = rect.bottom + 8;
            
            tooltip.style.left = left + "px";
            tooltip.style.top = top + "px";
            
            // Guardar referencia al tooltip
            this.currentTooltip = tooltip;
          });
          
          element.addEventListener("mouseleave", function () {
            // Eliminar el tooltip asociado a este elemento
            if (this.currentTooltip) {
              this.currentTooltip.remove();
              this.currentTooltip = null;
            }
          });
        });
    }
  } catch (err) {
    console.error("Error al cargar tarjetas supervisor:", err);
  }
}
window.actualizarTarjetasSupervisor = actualizarTarjetasSupervisor;
document.addEventListener("DOMContentLoaded", actualizarTarjetasSupervisor);
