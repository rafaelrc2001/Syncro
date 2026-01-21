// Gráfica de Permisos por Sucursal en status-chart-4
// grafica-sucursales-status4.js

function injectSucursalesChartStyles() {
  if (document.getElementById("sucursales-chart-styles")) return;
  const styleSheet = document.createElement("style");
  styleSheet.id = "sucursales-chart-styles";
  styleSheet.textContent = `
    .pie-chart {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        padding: 25px;
        display: flex;
        flex-direction: column;
        height: 400px;
    }
    .pie-chart .chart-title {
        font-size: 1.3rem;
        color: var(--negro-carbon);
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
    }
    .pie-chart .chart-title i {
        color: var(--naranja-seguridad);
        font-size: 1.4rem;
    }
    #status-chart-4 {
        width: 100%;
        height: 300px;
        flex-grow: 1;
    }
    .sucursales-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid var(--blanco-neutro);
        justify-content: center;
    }
    .sucursales-legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8rem;
        color: var(--gris-acero);
    }
    .sucursales-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
  `;
  document.head.appendChild(styleSheet);
}

function processSucursalesData(data) {
  const sucCounts = {};
  const sucLabels = {};
  data.forEach((item) => {
    if (item.sucursal) {
      const normalized = item.sucursal
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
      sucCounts[normalized] = (sucCounts[normalized] || 0) + 1;
      if (!sucLabels[normalized]) {
        sucLabels[normalized] = item.sucursal;
      }
    }
  });
  const categories = Object.values(sucLabels);
  const values = Object.keys(sucLabels).map((key) => sucCounts[key]);
  const colors = [
    "#003B5C", "#FF6F00", "#00BFA5", "#D32F2F", "#7B1FA2", "#FFC107", "#0097A7", "#C51162", "#43A047", "#F4511E"
  ];
  const icons = ["🏭", "🔧", "🏢", "🏬", "🏠", "🏣", "🏨", "🏦", "🏥", "🏛️"];
  return {
    categories,
    values,
    colors: categories.map((_, i) => colors[i % colors.length]),
    icons: categories.map((_, i) => icons[i % icons.length]),
  };
}

function initSucursalesStatusChart() {
  injectSucursalesChartStyles();
  const sucursalesChart = echarts.init(document.getElementById("status-chart-4"));

  const sucursalesOption = {
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        const total = params.series?.data?.reduce((a, b) => a + (b.value || 0), 0) || 0;
        const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
        return `
          <div style="font-weight: 600; margin-bottom: 5px;">${params.name}</div>
          <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%;"></span>
              Total permisos: <strong>${params.value}</strong>
          </div>
          <div style="color: #666; font-size: 11px;">Porcentaje: ${percentage}%</div>
        `;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#FF6F00",
      borderWidth: 1,
      textStyle: { color: "#1C1C1C", fontSize: 12 },
    },
    legend: {
      orient: "horizontal",
      bottom: "0%",
      data: [],
      textStyle: { color: "#4A4A4A", fontSize: 11 },
      itemGap: 20,
      itemWidth: 12,
      itemHeight: 12,
    },
    title: {
      text: '0',
      subtext: 'Total ',
      left: 'center',
      top: '38%',
      textStyle: { fontSize: 32, fontWeight: 'bold', color: '#003B5C' },
      subtextStyle: { fontSize: 12, color: '#4A4A4A', fontWeight: 'normal' }
    },
    series: [
      {
        name: "Sucursales",
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: function (params) {
            const total = params.series?.data?.reduce((a, b) => a + (b.value || 0), 0) || 0;
            const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
            return `${params.name}: ${percentage}%`;
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
        labelLine: { show: true, length: 10, length2: 5 },
        data: [],
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function (idx) { return idx * 150; },
      },
    ],
  };
  sucursalesChart.setOption(sucursalesOption);
  sucursalesChart.resize();

  window.addEventListener("resize", function () {
    sucursalesChart.resize();
  });

  function updateSucursalesChart(newData) {
    const pieData = newData.categories.map((category, index) => ({
      value: newData.values[index],
      name: `${newData.icons[index]} ${category}`,
      itemStyle: { color: newData.colors[index] },
    }));
    const total = newData.values.reduce((a, b) => a + b, 0);
    sucursalesChart.setOption({
      title: {
        text: `${total}`,
        subtext: 'Total',
        left: 'center',
        top: '38%',
        textStyle: { fontSize: 32, fontWeight: 'bold', color: '#003B5C' },
        subtextStyle: { fontSize: 12, color: '#4A4A4A', fontWeight: 'normal' }
      },
      legend: {
        data: newData.categories.map((category, index) => `${newData.icons[index]} ${category}`),
      },
      series: [
        {
          data: pieData,
          label: {
            show: true,
            formatter: function (params) {
              const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
              return `${params.name}: ${percentage}%`;
            },
            fontSize: 11,
            color: "#4A4A4A",
          },
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
          return `
            <div style="font-weight: 600; margin-bottom: 5px;">${params.name}</div>
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%;"></span>
                Total permisos: <strong>${params.value}</strong>
            </div>
            <div style="color: #666; font-size: 11px;">Porcentaje: ${percentage}%</div>
          `;
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#FF6F00",
        borderWidth: 1,
        textStyle: { color: "#1C1C1C", fontSize: 12 },
      },
    });
  }

  fetch("/api/graficas_jefes/permisos-jefes")
    .then((response) => response.json())
    .then((data) => {
      const processed = processSucursalesData(data);
      updateSucursalesChart(processed);
    })
    .catch((err) => {
      console.error("Error al obtener datos de sucursales:", err);
    });

  return {
    chart: sucursalesChart,
    updateData: updateSucursalesChart,
    resize: () => sucursalesChart.resize(),
  };
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("status-chart-4")) {
    window.sucursalesStatusChartInstance = initSucursalesStatusChart();
  }
});
