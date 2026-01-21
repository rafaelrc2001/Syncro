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
      "#00BFA5",
      "#FF6F00",
      "#D32F2F",
      "#FFC107",
      "#7B1FA2",
      "#0097A7",
      "#C51162",
      "#43A047",
      "#F4511E",
      "#1A237E",
      "#388E3C",
      "#FBC02D",
      "#E64A19",
      "#5D4037",
      "#1976D2",
      "#C2185B",
      "#00796B",
      "#FFA000",
      "#512DA8",
      "#0288D1",
      "#689F38",
      "#F57C00",
      "#455A64",
      "#8BC34A",
      "#F44336",
      "#FFEB3B",
      "#9C27B0",
      "#00BCD4",
      "#CDDC39",
      "#E91E63",
      "#607D8B",
      "#FF9800",
      "#4CAF50",
      "#3F51B5",
      "#009688",
      "#673AB7",
      "#8D6E63",
      "#BDBDBD",
      "#E040FB",
      "#00E676",
      "#FF1744",
      "#D500F9",
      "#00B8D4",
      "#AEEA00",
      "#FFD600",
      "#FF6D00",
      "#C51162",
      "#AA00FF",
      "#00BFA5",
      "#FFAB00",
      "#B2FF59",
      "#76FF03",
      "#F50057",
      "#FF5252",
      "#B388FF",
      "#18FFFF",
      "#FF4081",
      "#69F0AE",
      "#FFEA00",
      "#FF8A65",
      "#A1887F",
      "#90A4AE",
      "#B0BEC5",
      "#B2DFDB",
      "#C5E1A5",
      "#FFF176",
      "#FFB300",
      "#FF7043",
      "#D4E157",
    ];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
    };
  }

  // Inicializar gráfica
  const areasChart = echarts.init(document.getElementById("status-chart-1"));

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
      bottom: "25%",
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
        fontSize: 10,
        fontWeight: 500,
        interval: 0,
        margin: 10,
      },
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100, // Se ajustará dinámicamente
        bottom: 5,
        height: 18,
        borderColor: "#B0BEC5",
        fillerColor: "rgba(0, 59, 92, 0.2)",
        handleStyle: {
          color: "#003B5C",
        },
      },
      {
        type: "inside",
        xAxisIndex: [0],
        start: 0,
        end: 100, // Se ajustará dinámicamente
      },
    ],
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
    // Configurar el scroll para mostrar máximo 5 áreas inicialmente
    const maxVisibleAreas = 5;
    const scrollEndPercentage = Math.min(
      100,
      (maxVisibleAreas / newData.categories.length) * 100
    );

    const updatedOption = {
      xAxis: { data: newData.categories },
      dataZoom: [
        {
          type: "slider",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: scrollEndPercentage,
          bottom: 5,
          height: 18,
          borderColor: "#B0BEC5",
          fillerColor: "rgba(0, 59, 92, 0.2)",
          handleStyle: {
            color: "#003B5C",
          },
        },
        {
          type: "inside",
          xAxisIndex: [0],
          start: 0,
          end: scrollEndPercentage,
        },
      ],
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
