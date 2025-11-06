// Gráfica de Permisos por Áreas - Barras Verticales
// grafica-areas.js

// Configuración de la gráfica

function initAreasChart() {
  // Procesar los datos del endpoint
  function processAreasData(data) {
    const areaCounts = {};
    data.forEach((item) => {
      if (item.area) {
        areaCounts[item.area] = (areaCounts[item.area] || 0) + 1;
      }
    });
    const categories = Object.keys(areaCounts);
    const values = categories.map((area) => areaCounts[area]);
    const colors = [
      "#003B5C",
      "#FF6F00",
      "#00BFA5",
      "#B0BEC5",
      "#4A4A4A",
      "#D32F2F",
    ];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
    };
  }

  // Inicializar gráfica
  const areasChart = echarts.init(document.getElementById("areas-chart"));

  // Configuración inicial vacía
  const areasOption = {
    title: { show: false },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params) {
        const data = params[0];
        return `
          <div style="font-weight: 600; margin-bottom: 5px; font-size: 12px;">${data.name}</div>
          <div style="display: flex; align-items: center; gap: 5px; font-size: 12px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${data.color}; border-radius: 50%;"></span>
              Permisos: <strong>${data.value}</strong>
          </div>
        `;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#003B5C",
      borderWidth: 1,
      textStyle: { color: "#1C1C1C", fontSize: 12 },
      padding: [8, 12],
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "15%",
      top: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [],
      axisLine: { lineStyle: { color: "#B0BEC5", width: 1 } },
      axisTick: { show: false },
      axisLabel: {
        rotate: 0,
        color: "#4A4A4A",
        fontSize: 11,
        fontWeight: 500,
        interval: 0,
        margin: 10,
      },
    },
    yAxis: {
      type: "value",
      name: "Cantidad",
      nameTextStyle: {
        color: "#4A4A4A",
        fontSize: 11,
        fontWeight: 500,
        padding: [0, 0, 0, 10],
      },
      axisLabel: { color: "#4A4A4A", fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#F5F5F5", width: 1, type: "solid" } },
      splitNumber: 5,
    },
    series: [{ name: "Permisos", type: "bar", data: [] }],
    animationEasing: "elasticOut",
    animationDelayUpdate: function (idx) {
      return idx * 40;
    },
  };
  areasChart.setOption(areasOption);

  // Función para actualizar la gráfica
  function updateAreasChart(newData) {
    const updatedOption = {
      xAxis: { data: newData.categories },
      series: [
        {
          data: newData.values.map((value, index) => ({
            value: value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: newData.colors[index] },
                { offset: 1, color: newData.colors[index] + "80" },
              ]),
              borderRadius: [6, 6, 0, 0],
              shadowColor: newData.colors[index] + "40",
              shadowBlur: 6,
              shadowOffsetY: 3,
            },
            label: {
              show: true,
              position: "top",
              distance: 8,
              formatter: "{c}",
              fontSize: 11,
              fontWeight: "bold",
              color: "#4A4A4A",
            },
          })),
        },
      ],
    };
    areasChart.setOption(updatedOption);
  }

  // Obtener datos del endpoint y actualizar la gráfica
  fetch("/api/graficas_jefes/permisos-jefes")
    .then((response) => response.json())
    .then((data) => {
      const processed = processAreasData(data);
      updateAreasChart(processed);
    })
    .catch((err) => {
      console.error("Error al obtener datos de áreas:", err);
    });

  // Hacer responsive
  window.addEventListener("resize", function () {
    areasChart.resize();
  });

  // Retornar funciones públicas
  return {
    chart: areasChart,
    updateData: updateAreasChart,
    resize: () => areasChart.resize(),
  };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("areas-chart")) {
    window.areasChartInstance = initAreasChart();
  }
});

// Exportar para uso global
window.initAreasChart = initAreasChart;

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("areas-chart")) {
    window.areasChartInstance = initAreasChart();
  }
});

// Exportar para uso global
window.initAreasChart = initAreasChart;
