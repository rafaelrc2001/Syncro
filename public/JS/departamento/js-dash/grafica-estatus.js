// Gráfica de Permisos por Estatus - Gráfica de Pastel
// grafica-estatus.js

// Estilos específicos para la gráfica de estatus
const statusChartStyles = `
  .pie-chart {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 400px;
  }

  /* wrapper interno: columna que contiene chart y leyenda lado a lado */
  .status-wrapper {
    display: flex;
    gap: 16px;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
  }

  .status-chart-flex {
    flex: 0 0 360px; /* ancho fijo razonable para el canvas */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #status-chart {
    width: 100%;
    height: 260px; /* altura fija para renderizar correctamente */
    max-width: 360px;
    box-sizing: border-box;
  }

  .status-legend-list {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 340px;
    overflow: auto;
    padding-left: 8px;
  }

  .status-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    color: var(--gris-acero);
  }

  .status-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex: 0 0 10px;
  }
`;

// Inyectar estilos en el documento
function injectStatusChartStyles() {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = statusChartStyles;
  document.head.appendChild(styleSheet);
}

// Mapeo fijo estatus -> color (normalizado a minúsculas)
const STATUS_COLOR_MAP = {
  "activo": "#2ECC71",             // verde brillante
  "terminado": "#1976D2",          // azul
  "cancelado": "#D32F2F",          // rojo
  "en espera del área": "#FF9800", // naranja
  "en espera del area": "#FF9800",
  "espera seguridad": "#5E35B1",   // púrpura
  "no autorizado": "#FBC02D",      // amarillo
  "cierre sin incidentes": "#00BCD4", // cian
  "cierre con incidentes": "#D81B60", // magenta/rosa
  "cierre con accidentes": "#455A64",  // gris oscuro
};

// Normaliza cadenas para comparar sin acentos ni mayúsculas
function normalizeStatusKey(s) {
  if (!s) return '';
  try {
     return s.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  } catch (e) {
    return s.toString().toLowerCase().trim();
  }
}

// Mapa normalizado (clave normalizada -> color) para búsquedas rápidas
const NORMALIZED_STATUS_COLOR_MAP = Object.keys(STATUS_COLOR_MAP).reduce((acc, k) => {
  acc[normalizeStatusKey(k)] = STATUS_COLOR_MAP[k];
  return acc;
}, {});


// Configuración de la gráfica de estatus
function initStatusChart() {
  // Inyectar estilos
  injectStatusChartStyles();

  // Inicializa la gráfica vacía
  const statusData = {
    categories: [],
    values: [],
    colors: [
      "#00BFA5",
      "#FF6F00",
      "#FFC107",
      "#D32F2F",
      "#003B5C",
      "#B0BEC5",
      "#4A4A4A",
    ],
    icons: ["✓", "⚡", "⏱️", "✗", "⚠️", "🔒", "🛑"], // Puedes ajustar los íconos según tus estados
  };

  // Inicializar gráfica
  const statusChart = echarts.init(document.getElementById("status-chart"));

  // Reubicar DOM: envolver #status-chart en un wrapper con columna de chart y leyenda
  (function relocateChartAndCreateLegend() {
    const chartEl = document.getElementById('status-chart');
    if (!chartEl) return;
    const parent = chartEl.parentNode;
    if (!parent) return;
    // si el wrapper ya existe, no duplicar
    if (parent.classList && parent.classList.contains('status-wrapper')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'status-wrapper';
    const chartFlex = document.createElement('div');
    chartFlex.className = 'status-chart-flex';
    const legendDiv = document.createElement('div');
    legendDiv.id = 'status-legend-list';
    legendDiv.className = 'status-legend-list';
    // reemplazar el chartEl por el wrapper y reubicar elementos
    parent.replaceChild(wrapper, chartEl);
    wrapper.appendChild(chartFlex);
    wrapper.appendChild(legendDiv);
    chartFlex.appendChild(chartEl);
  })();

  // Preparar datos para la gráfica de pastel
  const pieData = statusData.categories.map((category, index) => ({
    value: statusData.values[index],
    name: `${statusData.icons[index]} ${category}`,
    itemStyle: {
      color: statusData.colors[index],
    },
  }));

  // Configuración de la gráfica de pastel
  const statusOption = {
    legend: { show: false }, // usamos leyenda HTML externa
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        // Obtener el total de todos los valores del gráfico
        const series = params?.series?.data || params?.data?.seriesData || [];
        const total = series.length
          ? series.reduce((sum, item) => sum + (item.value || 0), 0)
          : params?.data?.total || 0;

        // Si no hay total confiable, intenta tomarlo desde la instancia
        const chart = echarts.getInstanceByDom(document.getElementById("status-chart"));
        const option = chart ? chart.getOption() : null;
        const pieData = option?.series?.[0]?.data || [];
        const totalFromChart = pieData.reduce((s, i) => s + (i.value || 0), 0);

        const finalTotal = total || totalFromChart;
        const percentage =
          finalTotal > 0 ? ((params.value / finalTotal) * 100).toFixed(1) : "0";

        return `
          <div style="font-weight: 600; margin-bottom: 5px;">
            ${params.name}
          </div>
          <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
            <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%;"></span>
            Cantidad: <strong>${params.value}</strong>
          </div>
          <div style="color: #666; font-size: 11px;">
            Porcentaje: ${percentage}%
          </div>
        `;
      },
    },
    series: [
      {
        name: "Estatus de Permisos",
        type: "pie",
  radius: ["38%", "64%"],
  center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: function (params) {
            // Obtener el total igual que en el tooltip
            const chart = echarts.getInstanceByDom(document.getElementById("status-chart"));
            const option = chart ? chart.getOption() : null;
            const pieData = option?.series?.[0]?.data || [];
            const total = pieData.reduce((s, i) => s + (i.value || 0), 0);
            const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : "0";
            return `${percentage}%`;
          },
          fontSize: 11,
          color: "#4A4A4A",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 5,
        },
        data: pieData,
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function (idx) {
          return idx * 150;
        },
      },
    ],
  };

  // Aplicar configuración
  statusChart.setOption(statusOption);

  // Función para recalcular el centro del pie en píxeles y aplicarlo
  function updateChartCenter() {
    try {
      const chartEl = document.getElementById('status-chart');
      if (!chartEl) return;
      const w = Math.round(chartEl.clientWidth);
      const h = Math.round(chartEl.clientHeight);
      const cx = Math.round(w / 2);
      const cy = Math.round(h / 2);
      // aplicar centro en píxeles
      statusChart.setOption({ series: [{ center: [cx, cy] }] });
      console.debug('[statusChart] center px', { w, h, cx, cy });
    } catch (e) {
      console.warn('updateChartCenter error', e);
    }
  }

  // Asegurar resize y centro tras primer render
  setTimeout(function () {
    try { statusChart.resize(); } catch (e) {}
    updateChartCenter();
  }, 160);

  // Hacer responsive
  window.addEventListener("resize", function () {
    statusChart.resize();
  });

  // Función para actualizar datos
  function updateStatusChart(newData) {
    const updatedData = {
      categories: newData.categories || statusData.categories,
      values: newData.values || statusData.values,
      colors: newData.colors || statusData.colors,
      icons: newData.icons || statusData.icons,
    };
    const updatedPieData = updatedData.categories.map((category, index) => {
      const key = normalizeStatusKey(category);
      const color = NORMALIZED_STATUS_COLOR_MAP[key] || (Array.isArray(updatedData.colors) && updatedData.colors[index]) || '#cccccc';
      return {
        value: updatedData.values[index],
        name: `${updatedData.icons[index]} ${category}`,
        itemStyle: { color },
      };
    });

    const updatedOption = {
      series: [
        {
          data: updatedPieData,
        },
      ],
    };

    // actualizar la gráfica
    statusChart.setOption(updatedOption);

    // actualizar leyenda HTML externa
    const legendEl = document.getElementById('status-legend-list');
    if (legendEl) {
      legendEl.innerHTML = '';
      updatedData.categories.forEach((cat, idx) => {
        const item = document.createElement('div');
        item.className = 'status-legend-item';
        const dot = document.createElement('span');
        dot.className = 'status-legend-dot';
        dot.style.background = (updatedPieData[idx] && updatedPieData[idx].itemStyle && updatedPieData[idx].itemStyle.color) || '#ccc';
        const label = document.createElement('span');
        label.textContent = `${updatedData.icons[idx] || ''} ${cat}`.trim();
        item.appendChild(dot);
        item.appendChild(label);
        legendEl.appendChild(item);
      });
    }

    // Forzar resize y recalcular centro
    try { statusChart.resize(); } catch (e) {}
    setTimeout(updateChartCenter, 50);
  }

  // Retornar funciones públicas
  return {
    chart: statusChart,
    updateData: updateStatusChart,
    resize: () => statusChart.resize(),
  };
}

// Suponiendo que tienes el id_departamento disponible
// Usa window.idDepartamento directamente para evitar duplicados

function cargarDatosEstatus() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const id_departamento = usuario && usuario.id ? usuario.id : 1;
    console.log("[DEBUG] usuario localStorage:", usuario);
    console.log("[DEBUG] id_departamento:", id_departamento);
  fetch("/api/grafica-estatus/" + id_departamento)
    .then((res) => res.json())
    .then((data) => {
      // Transforma los datos para la gráfica
      const categories = data.estatus.map((e) => e.estatus);
      const values = data.estatus.map((e) => Number(e.cantidad_trabajos));
      // Genera colores e íconos dinámicos si hay más estados que colores
      const baseColors = [
        "#00BFA5",
        "#FF6F00",
        "#FFC107",
        "#D32F2F",
        "#003B5C",
        "#B0BEC5",
        "#4A4A4A",
      ];
      const baseIcons = ["✓", "⚡", "⏱️", "✗", "⚠️", "🔒", "🛑"];
      // Preferir el color fijo por estatus (mapa normalizado), si no existe usar baseColors
      const colors = categories.map((cat, i) => {
        const key = normalizeStatusKey(cat);
        return NORMALIZED_STATUS_COLOR_MAP[key] || baseColors[i % baseColors.length];
      });
      const icons = categories.map((_, i) => baseIcons[i % baseIcons.length]);
      if (window.statusChartInstance) {
        window.statusChartInstance.updateData({
          categories,
          values,
          colors,
          icons,
        });
      }
    });
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("status-chart")) {
    window.statusChartInstance = initStatusChart();
    // Datos serán cargados EXCLUSIVAMENTE por el filtro-global.js
    // cargarDatosEstatus(); // DESHABILITADO PERMANENTEMENTE
  }
});

// Exportar para uso global
window.initStatusChart = initStatusChart;
