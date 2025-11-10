// Gráfica de Supervisores de Seguridad - Barras Horizontales
// grafica-supervisores.js

// Procesar los datos del endpoint agrupando por supervisor (ignorando mayúsculas, minúsculas y acentos)
function processSupervisoresData(data) {
  const supCounts = {};
  const supLabels = {};
  data.forEach((item) => {
    if (item.supervisor) {
      const normalized = item.supervisor
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
      supCounts[normalized] = (supCounts[normalized] || 0) + 1;
      if (!supLabels[normalized]) {
        supLabels[normalized] = item.supervisor;
      }
    }
  });
  const categories = Object.values(supLabels);
  const values = Object.keys(supLabels).map((key) => supCounts[key]);
  // Paleta de colores
  const colors = [
    "#00BFA5", // verde aqua
    "#FF6F00", // naranja
    "#FFC107", // amarillo
    "#D32F2F", // rojo
    "#003B5C", // azul petróleo
    "#7B1FA2", // morado
    "#1976D2", // azul
    "#388E3C", // verde
    "#F06292", // rosa
    "#8D6E63", // marrón
    "#C2185B", // magenta
    "#0097A7", // cian oscuro
    "#FBC02D", // amarillo fuerte
    "#455A64", // gris oscuro
    "#AED581", // verde claro
  ];
  return {
    categories,
    values,
    colors: categories.map((_, i) => colors[i % colors.length]),
  };
}

function initSupervisoresChart() {
  const supervisoresChart = echarts.init(
    document.getElementById("supervisores-chart")
  );

  // Configuración inicial vacía
  const supervisoresOption = {
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
                        Permisos autorizados: <strong>${data.value}</strong>
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
  supervisoresChart.setOption(supervisoresOption);

  // Responsive
  window.addEventListener("resize", function () {
    supervisoresChart.resize();
  });

  // Función para actualizar datos
  function updateSupervisoresChart(newData) {
    supervisoresChart.setOption({
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
      const processed = processSupervisoresData(data);
      updateSupervisoresChart(processed);
    })
    .catch((err) => {
      console.error("Error al obtener datos de supervisores:", err);
    });

  // Retornar funciones públicas
  return {
    chart: supervisoresChart,
    updateData: updateSupervisoresChart,
    resize: () => supervisoresChart.resize(),
  };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("supervisores-chart")) {
    window.supervisoresChartInstance = initSupervisoresChart();
  }
});
