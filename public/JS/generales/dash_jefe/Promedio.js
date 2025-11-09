// Gráfica de Tiempos de Autorización de Permisos - Promedio.js

// Procesar los datos del endpoint para calcular los tiempos

function processTiemposData(data) {
  const permisos = [];
  const tiemposCreacionArea = [];
  const tiemposAreaSupervisor = [];
  const tiemposTotales = [];
  data.forEach((item) => {
    if (!item.fecha_hora) return;
    const creacion = new Date(item.fecha_hora);
    let area = item.fecha_hora_area ? new Date(item.fecha_hora_area) : null;
    let supervisor = item.fecha_hora_supervisor
      ? new Date(item.fecha_hora_supervisor)
      : null;
    let diffCreacionArea = null;
    let diffAreaSupervisor = null;
    let diffTotal = null;
    if (area && supervisor) {
      diffCreacionArea = (area - creacion) / (1000 * 60 * 60);
      diffAreaSupervisor = (supervisor - area) / (1000 * 60 * 60);
      diffTotal = (supervisor - creacion) / (1000 * 60 * 60);
    } else if (area) {
      diffCreacionArea = (area - creacion) / (1000 * 60 * 60);
      diffAreaSupervisor = 0;
      diffTotal = (area - creacion) / (1000 * 60 * 60);
    } else {
      return;
    }
    if (isNaN(diffCreacionArea) || diffCreacionArea < 0) diffCreacionArea = 0;
    if (isNaN(diffAreaSupervisor) || diffAreaSupervisor < 0)
      diffAreaSupervisor = 0;
    if (isNaN(diffTotal) || diffTotal < 0) return;
    permisos.push(item.prefijo || item.id_permiso);
    tiemposCreacionArea.push(Number(diffCreacionArea.toFixed(2)));
    tiemposAreaSupervisor.push(Number(diffAreaSupervisor.toFixed(2)));
    tiemposTotales.push(Number(diffTotal.toFixed(2)));
  });
  return {
    permisos,
    tiemposCreacionArea,
    tiemposAreaSupervisor,
    tiemposTotales,
    colores: {
      creacionArea: "#003B5C",
      areaSupervisor: "#FF6F00",
      total: "#00BFA5",
    },
  };
}

// --- NUEVO: Paginación horizontal para la gráfica de tiempos ---
let tiemposChartPage = 0;
const TIEMPOS_CHART_PAGE_SIZE = 15;

function renderTiemposChartPage(tiemposChart, processed, page) {
  const total = processed.permisos.length;
  const start = page * TIEMPOS_CHART_PAGE_SIZE;
  const end = Math.min(start + TIEMPOS_CHART_PAGE_SIZE, total);
  const permisos = processed.permisos.slice(start, end);
  const creacionArea = processed.tiemposCreacionArea.slice(start, end);
  const areaSupervisor = processed.tiemposAreaSupervisor.slice(start, end);
  const totales = processed.tiemposTotales.slice(start, end);

  tiemposChart.setOption({
    xAxis: { data: permisos },
    series: [
      { data: creacionArea },
      { data: areaSupervisor },
      { data: totales },
    ],
  });
}

function renderTiemposChartWithScroll(tiemposChart, processed) {
  // Configurar para mostrar 8 elementos inicialmente con scroll horizontal
  tiemposChart.setOption({
    legend: {
      data: ['Creación → Área', 'Área → Supervisor', 'Tiempo Total'],
      bottom: 35,
      left: 'center',
      itemGap: 20,
      textStyle: {
        fontSize: 11,
        color: '#4A4A4A'
      },
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 8
    },
    xAxis: { 
      data: processed.permisos,
      axisLabel: {
        rotate: 0,
        fontSize: 9,
        interval: 0
      }
    },
    series: [
      { 
        name: 'Creación → Área',
        data: processed.tiemposCreacionArea,
        color: '#003B5C',
        type: 'bar'
      },
      { 
        name: 'Área → Supervisor',
        data: processed.tiemposAreaSupervisor,
        color: '#FF6F00',
        type: 'bar'
      },
      { 
        name: 'Tiempo Total',
        data: processed.tiemposTotales,
        color: '#00BFA5',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6
      },
    ],
    grid: {
      left: 50,
      right: 20,
      bottom: 80,
      top: 40
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: Math.min(100, (8 / processed.permisos.length) * 100), // Mostrar 8 elementos inicialmente
        bottom: 5,
        height: 18,
        borderColor: '#B0BEC5',
        fillerColor: 'rgba(0, 59, 92, 0.2)',
        handleStyle: {
          color: '#003B5C'
        }
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: Math.min(100, (8 / processed.permisos.length) * 100)
      }
    ]
  });
}

function addTiemposChartPaginationControls(container, tiemposChart, processed) {
  let pagDiv = document.getElementById("tiempos-chart-pagination");
  if (!pagDiv) {
    pagDiv = document.createElement("div");
    pagDiv.id = "tiempos-chart-pagination";
    pagDiv.style.display = "flex";
    pagDiv.style.justifyContent = "center";
    pagDiv.style.alignItems = "center";
    pagDiv.style.gap = "8px";
    pagDiv.style.margin = "8px 0 0 0";
    container.parentNode.insertBefore(pagDiv, container.nextSibling);
  }
  pagDiv.innerHTML = "";
  const totalPages = Math.ceil(
    processed.permisos.length / TIEMPOS_CHART_PAGE_SIZE
  );
  for (let i = 0; i < totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.style.padding = "2px 8px";
    btn.style.margin = "0 2px";
    btn.style.borderRadius = "4px";
    btn.style.border = "1px solid #B0BEC5";
    btn.style.background = i === tiemposChartPage ? "#003B5C" : "#fff";
    btn.style.color = i === tiemposChartPage ? "#fff" : "#003B5C";
    btn.style.cursor = "pointer";
    btn.onclick = () => {
      tiemposChartPage = i;
      renderTiemposChartPage(tiemposChart, processed, tiemposChartPage);
      addTiemposChartPaginationControls(container, tiemposChart, processed);
    };
    pagDiv.appendChild(btn);
  }
}

function initTiemposChart() {
  const tiemposChart = echarts.init(document.getElementById("tiempos-chart"));

  // Configuración inicial vacía
  const tiemposOption = {
    title: {
      text: `Promedios: Creación→Área: 0h | Área→Supervisor: 0h | Total: 0h`,
      left: "center",
      top: 5,
      textStyle: {
        fontSize: 12,
        color: "#4A4A4A",
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params) {
        let result = `<div style=\"font-weight: 600; margin-bottom: 8px; font-size: 12px;\">${params[0].name}</div>`;
        params.forEach((param) => {
          result += `
            <div style=\"display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 12px; margin: 4px 0;\">
              <div style=\"display: flex; align-items: center; gap: 6px;\">
                <span style=\"display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%;\"></span>
                ${param.seriesName}:
              </div>
              <strong>${param.value}h</strong>
            </div>
          `;
        });
        return result;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#003B5C",
      borderWidth: 1,
      textStyle: { color: "#1C1C1C", fontSize: 12 },
      padding: [10, 12],
    },
    legend: {
      data: ["Creación → Área", "Área → Supervisor", "Tiempo Total"],
      top: 30,
      textStyle: { fontSize: 11, color: "#4A4A4A" },
      itemWidth: 14,
      itemHeight: 10,
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "12%",
      top: "18%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [],
      axisLabel: {
        rotate: 45,
        color: "#4A4A4A",
        fontSize: 10,
        fontWeight: 500,
        interval: 0,
        margin: 12,
      },
      axisLine: { lineStyle: { color: "#B0BEC5", width: 1 } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      name: "Horas",
      nameTextStyle: {
        color: "#4A4A4A",
        fontSize: 11,
        fontWeight: 500,
        padding: [0, 0, 0, 10],
      },
      axisLabel: { color: "#4A4A4A", fontSize: 10, formatter: "{value}h" },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#F5F5F5", width: 1, type: "solid" } },
    },
    series: [
      {
        name: "Creación → Área",
        type: "bar",
        stack: "tiempos",
        data: [],
        barWidth: "70%",
        itemStyle: {
          color: "#003B5C",
          borderRadius: [4, 4, 0, 0],
          shadowColor: "#003B5C40",
          shadowBlur: 4,
          shadowOffsetY: 3,
        },
        emphasis: { itemStyle: { shadowBlur: 6, shadowOffsetY: 4 } },
      },
      {
        name: "Área → Supervisor",
        type: "bar",
        stack: "tiempos",
        data: [],
        barWidth: "70%",
        itemStyle: {
          color: "#FF6F00",
          borderRadius: [0, 0, 0, 0],
          shadowColor: "#FF6F0040",
          shadowBlur: 4,
          shadowOffsetY: 3,
        },
        emphasis: { itemStyle: { shadowBlur: 6, shadowOffsetY: 4 } },
      },
      {
        name: "Tiempo Total",
        type: "line",
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { color: "#00BFA5", width: 3 },
        itemStyle: { color: "#00BFA5", borderColor: "#FFFFFF", borderWidth: 2 },
        data: [],
        z: 10,
      },
    ],
    animationEasing: "elasticOut",
    animationDelay: function (idx) {
      return idx * 60;
    },
  };
  tiemposChart.setOption(tiemposOption);

  // Hacer responsive
  window.addEventListener("resize", function () {
    tiemposChart.resize();
  });

  // Obtener datos del endpoint y actualizar la gráfica
  fetch("/api/graficas_jefes/permisos-jefes")
    .then((response) => response.json())
    .then((data) => {
      const processed = processTiemposData(data);
      const promedioCreacionArea =
        processed.tiemposCreacionArea.length > 0
          ? (
              processed.tiemposCreacionArea.reduce((a, b) => a + b, 0) /
              processed.tiemposCreacionArea.length
            ).toFixed(1)
          : 0;
      const promedioAreaSupervisor =
        processed.tiemposAreaSupervisor.length > 0
          ? (
              processed.tiemposAreaSupervisor.reduce((a, b) => a + b, 0) /
              processed.tiemposAreaSupervisor.length
            ).toFixed(1)
          : 0;
      const promedioTotal =
        processed.tiemposTotales.length > 0
          ? (
              processed.tiemposTotales.reduce((a, b) => a + b, 0) /
              processed.tiemposTotales.length
            ).toFixed(1)
          : 0;

      // Usar scroll horizontal mostrando 5 elementos inicialmente
      renderTiemposChartWithScroll(tiemposChart, processed);

      tiemposChart.setOption({
        title: {
          text: `Promedios: Creación→Área: ${promedioCreacionArea}h | Área→Supervisor: ${promedioAreaSupervisor}h | Total: ${promedioTotal}h`,
        },
      });
    })
    .catch((err) => {
      console.error("Error al obtener datos de tiempos:", err);
    });

  // Retornar funciones públicas
  return {
    chart: tiemposChart,
    resize: () => tiemposChart.resize(),
  };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("tiempos-chart")) {
    window.tiemposChartInstance = initTiemposChart();
  }
});

// Exportar para uso global
window.initTiemposChart = initTiemposChart;
