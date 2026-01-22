// Lógica para rellenar las tarjetas del dashboard de jefe
// Usa el endpoint /api/graficas_jefes/permisos-jefes

function actualizarTarjetasJefe() {
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
    const data = window.permisosJefeFiltrados || [];
    // Depuración: mostrar valores únicos de Estado/Estatus y Subestatus
    const estadosSet = new Set();
    const subestatusSet = new Set();
    data.forEach(p => {
      estadosSet.add(p.Estado || p.estado || p.Estatus || p.estatus || '');
      subestatusSet.add(p.Subestatus || p.subestatus || '');
    });
    console.log('Valores únicos de Estado/Estatus:', Array.from(estadosSet));
    console.log('Valores únicos de Subestatus:', Array.from(subestatusSet));
    // Seleccionar todos los elementos .count en el orden visual de las tarjetas
    const counts = document.querySelectorAll(".cards-section .card .count");
    if (counts.length >= 5) {
      // Total de permisos filtrados
      counts[0].textContent = data.length;

      // Por Autorizar: estados "en espera del área" y "espera seguridad"
      const porAutorizar = data.filter((p) => {
        const estado = normalizar(p.Estado || p.estado || p.Estatus || p.estatus);
        return estado === "en espera del area" || estado === "espera seguridad";
      });
      counts[1].textContent = porAutorizar.length;

      // Activos: estado "activo", "validado por seguridad", "trabajo finalizado", "espera liberacion del area"
      const activos = data.filter((p) => {
        const estado = normalizar(p.Estado || p.estado || p.Estatus || p.estatus);
        return (
          estado === "activo" ||
          estado === "validado por seguridad" ||
          estado === "trabajo finalizado" ||
          estado === "espera liberacion del area"
        );
      });
      counts[2].textContent = activos.length;

      // Terminados: estado "cierre" y subestatus "cierre con incidentes", "cierre sin incidentes", "cierre con accidentes"
      const terminados = data.filter((p) => {
        const estado = normalizar(p.Estado || p.estado || p.Estatus || p.estatus);
        const subestatus = normalizar(p.Subestatus || p.subestatus);
        return (
          estado === "cierre" &&
          (subestatus === "cierre con incidentes" ||
            subestatus === "cierre sin incidentes" ||
            subestatus === "cierre con accidentes")
        );
      });
      counts[3].textContent = terminados.length;

      // No Autorizados: estado "cierre" y subestatus "no autorizado" o "cancelado"
      const noAutorizados = data.filter((p) => {
        const estado = normalizar(p.Estado || p.estado || p.Estatus || p.estatus);
        const subestatus = normalizar(p.Subestatus || p.subestatus);
        return (
          estado === "cierre" &&
          (subestatus === "no autorizado" || subestatus === "cancelado")
        );
      });
      counts[4].textContent = noAutorizados.length;

      // Tooltips: mostrar desglose de estatus con explicación y formato visual (HTML)
      const explicaciones = [null, "", "", "", ""];
      // Para Por Autorizar y Activos, si todos tienen el mismo Estado, mostrar desglose por Subestatus
      function tooltipPorAutorizar() {
        if (porAutorizar.length === 0) return null;
        const primerEstado = normalizar(porAutorizar[0].Estado || porAutorizar[0].estado || porAutorizar[0].Estatus || porAutorizar[0].estatus);
        const todosIguales = porAutorizar.every(p => normalizar(p.Estado || p.estado || p.Estatus || p.estatus) === primerEstado);
        if (todosIguales) {
          return contarPorSubestatus(porAutorizar);
        } else {
          return contarPorEstado(porAutorizar, 'Estado');
        }
      }
      function tooltipActivos() {
        if (activos.length === 0) return null;
        const primerEstado = normalizar(activos[0].Estado || activos[0].estado || activos[0].Estatus || activos[0].estatus);
        const todosIguales = activos.every(p => normalizar(p.Estado || p.estado || p.Estatus || p.estatus) === primerEstado);
        if (todosIguales) {
          return contarPorSubestatus(activos);
        } else {
          return contarPorEstado(activos, 'Estado');
        }
      }
      // Nueva función: contar por estatus y subestatus
      function contarPorEstatusYSubestatus(arr) {
        const out = {};
        arr.forEach(p => {
          const estatus = normalizar(p.Estado || p.estado || p.Estatus || p.estatus);
          const subestatus = normalizar(p.Subestatus || p.subestatus);
          if (!estatus && !subestatus) return;
          const key = `${estatus || '-'} / ${subestatus || '-'}`;
          out[key] = (out[key] || 0) + 1;
        });
        return out;
      }

      const tooltips = [
        null, // Total de Permisos no necesita desglose
        contarPorEstatusYSubestatus(porAutorizar),
        contarPorEstatusYSubestatus(activos),
        contarPorEstatusYSubestatus(terminados),
        contarPorEstatusYSubestatus(noAutorizados),
      ];
      for (let i = 1; i < counts.length; i++) {
        if (tooltips[i] && Object.keys(tooltips[i]).length > 0) {
          const lines = Object.entries(tooltips[i])
            .map(
              ([key, count]) => {
                const [estatus, subestatus] = key.split(' / ');
                return `<b>Estatus:</b> ${capitalizeWords(estatus)}<br><b>Subestatus:</b> ${capitalizeWords(subestatus)}<br><b>Total:</b> ${count}<hr style='margin:4px 0;'>`;
              }
            )
            .join("");
          const html = `<div style='font-size:1rem;margin-bottom:6px;'>${explicaciones[i]}</div>${lines}`;
          counts[i].parentElement.setAttribute("data-tooltip", html);
        } else {
          counts[i].parentElement.removeAttribute("data-tooltip");
        }
      }
      // Función para capitalizar cada palabra
      function capitalizeWords(str) {
        return str.replace(/\b\w/g, (c) => c.toUpperCase());
      }
      // Función para contar por estado
      function contarPorEstado(arr, campo) {
        const out = {};
        arr.forEach(p => {
          const val = normalizar(p[campo] || p[campo.toLowerCase()]);
          if (val) out[val] = (out[val] || 0) + 1;
        });
        return out;
      }
      // Función para contar por subestatus
      function contarPorSubestatus(arr) {
        const out = {};
        arr.forEach(p => {
          const val = normalizar(p.Subestatus || p.subestatus);
          if (val) out[val] = (out[val] || 0) + 1;
        });
        return out;
      }

      // Reasignar eventos de tooltip a los cards
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
    console.error("Error al cargar tarjetas jefe:", err);
  }
}

// Ejecutar al cargar el DOM
window.actualizarTarjetasJefe = actualizarTarjetasJefe;
document.addEventListener("DOMContentLoaded", actualizarTarjetasJefe);
