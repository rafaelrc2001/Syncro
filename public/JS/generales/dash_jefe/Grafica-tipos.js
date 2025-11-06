// Gráfica de Permisos por Tipo - Barras Horizontales
// grafica-tipos.js

// Configuración de la gráfica de tipos
function initTypesChart() {
  // Procesar los datos del endpoint agrupando por tipo_permiso
  function processTypesData(data) {
    const typeCounts = {};
    data.forEach((item) => {
      if (item.tipo_permiso) {
        typeCounts[item.tipo_permiso] =
          (typeCounts[item.tipo_permiso] || 0) + 1;
      }
    });
    const categories = Object.keys(typeCounts);
    const values = categories.map((tipo) => typeCounts[tipo]);
    // Puedes personalizar los colores según la cantidad de tipos
    const colors = [
      "#D32F2F",
      "#FF6F00",
      "#FFC107",
      "#003B5C",
      "#00BFA5",
      "#7B1FA2",
      "#388E3C",
      "#1976D2",
      "#C2185B",
    ];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
    };
  }

  // Inicializar gráfica
  const typesChart = echarts.init(document.getElementById("type-chart"));

  // Configuración inicial vacía
  const typesOption = {
    title: { show: false },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params) {
        const data = params[0];
        return `
          <div style="font-weight: 600; margin-bottom: 3px; font-size: 11px;">${data.name}</div>
          <div style="display: flex; align-items: center; gap: 5px; font-size: 11px; margin-bottom: 3px;">
              <span style="display: inline-block; width: 8px; height: 8px; background: ${data.color}; border-radius: 50%;"></span>
              Permisos: <strong>${data.value}</strong>
          </div>
        `;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#003B5C",
      borderWidth: 1,
      textStyle: { color: "#1C1C1C", fontSize: 11 },
      padding: [5, 8],
    },
    grid: {
      left: "30%",
      right: "3%",
      bottom: "3%",
      top: "5%",
      containLabel: false,
    },
    xAxis: {
      type: "value",
      name: "Cantidad",
      nameTextStyle: {
        color: "#4A4A4A",
        fontSize: 10,
        fontWeight: 500,
        padding: [0, 0, 0, 20],
      },
      axisLabel: { color: "#4A4A4A", fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: "#F5F5F5", width: 1, type: "solid" } },
      splitNumber: 4,
    },
    yAxis: {
      type: "category",
      data: [],
      axisLabel: {
        color: "#4A4A4A",
        fontSize: 10,
        fontWeight: 500,
        interval: 0,
        margin: 8,
      },
      axisLine: { lineStyle: { color: "#B0BEC5", width: 1 } },
      axisTick: { show: false },
    },
    series: [
      {
        name: "Permisos",
        type: "bar",
        data: [],
        barWidth: "55%",
        animationDelay: function (idx) {
          return idx * 80;
        },
      },
    ],
    animationEasing: "elasticOut",
    animationDelayUpdate: function (idx) {
      return idx * 40;
    },
  };
  typesChart.setOption(typesOption);

  // Hacer responsive
  window.addEventListener("resize", function () {
    typesChart.resize();
  });

  // Función para actualizar datos
  function updateTypesChart(newData) {
    const updatedOption = {
      yAxis: {
        data: newData.categories,
      },
      series: [
        {
          data: newData.values.map((value, index) => ({
            value: value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: newData.colors[index] },
                { offset: 1, color: newData.colors[index] + "80" },
              ]),
              borderRadius: [0, 4, 4, 0],
              shadowColor: newData.colors[index] + "30",
              shadowBlur: 4,
              shadowOffsetX: 2,
            },
            label: {
              show: true,
              position: "right",
              distance: 5,
              formatter: "{c}",
              fontSize: 10,
              fontWeight: "bold",
              color: "#4A4A4A",
            },
          })),
        },
      ],
    };
    typesChart.setOption(updatedOption);
  }

  // Obtener datos del endpoint y actualizar la gráfica
  fetch("/api/graficas_jefes/permisos-jefes")
    .then((response) => response.json())
    .then((data) => {
      const processed = processTypesData(data);
      updateTypesChart(processed);
    })
    .catch((err) => {
      console.error("Error al obtener datos de tipos de permisos:", err);
    });

  // Retornar funciones públicas
  return {
    chart: typesChart,
    updateData: updateTypesChart,
    resize: () => typesChart.resize(),
  };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("type-chart")) {
    window.typesChartInstance = initTypesChart();
  }
});
