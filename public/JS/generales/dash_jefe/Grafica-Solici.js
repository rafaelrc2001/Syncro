// Gráfica de Solicitantes de Permisos - Barras Horizontales
// grafica-solicitantes.js

// Procesar los datos del endpoint agrupando por departamento (ignorando mayúsculas, minúsculas y acentos)
function processSolicitantesData(data) {
  const deptCounts = {};
  const deptLabels = {};
  data.forEach((item) => {
    if (item.departamento) {
      const normalized = item.departamento
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
      deptCounts[normalized] = (deptCounts[normalized] || 0) + 1;
      if (!deptLabels[normalized]) {
        deptLabels[normalized] = item.departamento;
      }
    }
  });
  const categories = Object.values(deptLabels);
  const values = Object.keys(deptLabels).map((key) => deptCounts[key]);
  // Paleta de colores
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
  ];
  return {
    categories,
    values,
    colors: categories.map((_, i) => colors[i % colors.length]),
  };
}

function initSolicitantesChart() {
  const solicitantesChart = echarts.init(
    document.getElementById("solicitantes-chart")
  );

  // Configuración inicial vacía
  const solicitantesOption = {
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
                        Permisos solicitados: <strong>${data.value}</strong>
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
        label: {
          show: true,
          position: "right",
          distance: 5,
          formatter: "{c}",
          fontSize: 10,
          fontWeight: "bold",
          color: "#4A4A4A",
        },
      },
    ],
    animationEasing: "elasticOut",
    animationDelayUpdate: function (idx) {
      return idx * 40;
    },
  };
  solicitantesChart.setOption(solicitantesOption);

  // Responsive
  window.addEventListener("resize", function () {
    solicitantesChart.resize();
  });

  // Función para actualizar datos
  function updateSolicitantesChart(newData) {
    solicitantesChart.setOption({
      yAxis: { data: newData.categories },
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
    });
  }

  // Obtener datos del endpoint y actualizar la gráfica
  fetch("/api/graficas_jefes/permisos-jefes")
    .then((response) => response.json())
    .then((data) => {
      const processed = processSolicitantesData(data);
      updateSolicitantesChart(processed);
    })
    .catch((err) => {
      console.error("Error al obtener datos de solicitantes:", err);
    });

  // Retornar funciones públicas
  return {
    chart: solicitantesChart,
    updateData: updateSolicitantesChart,
    resize: () => solicitantesChart.resize(),
  };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("solicitantes-chart")) {
    window.solicitantesChartInstance = initSolicitantesChart();
  }
});
