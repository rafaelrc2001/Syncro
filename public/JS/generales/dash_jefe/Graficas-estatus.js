// Gráfica de Permisos por Estatus - Gráfica de Pastel
// grafica-estatus.js

// Estilos específicos para la gráfica de estatus
const statusChartStyles = `
  /* Layout para la gráfica de estatus y leyenda */
  #status-chart-2-card .chart-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    min-height: 220px;
    height: 100%;
    width: 100%;
    padding: 0 10px 0 0;
    gap: 48px;
    box-sizing: border-box;
  }
  #status-chart-2 {
    flex: 0 0 340px;
    min-width: 240px;
    max-width: 340px;
    width: 340px !important;
    height: 220px !important;
    min-height: 180px;
    margin: 0;
    background: transparent;
    display: block;
  }
  /* ECharts legend vertical a la derecha */
  #status-chart-2-card .echarts-legend {
    flex: 1 1 52%;
    margin-left: 0;
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    font-family: 'Montserrat', sans-serif !important;
    font-size: 0.85rem !important;
    color: #333 !important;
    background: none !important;
    min-width: 120px;
    max-width: 260px;
    gap: 4px;
  }
  #status-chart-2-card .echarts-legend-item {
    border-radius: 8px !important;
    padding: 2px 10px !important;
    margin: 0 0 4px 0 !important;
    background: #f3f6fa !important;
    border: 1px solid #e0e4ea !important;
    font-size: 0.85rem !important;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #status-chart-2-card .echarts-legend-item:last-child {
    margin-bottom: 0 !important;
  }
  /* Responsive para pantallas pequeñas */
  @media (max-width: 700px) {
    #status-chart-2-card .chart-container {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
    #status-chart-2 {
      width: 100% !important;
      max-width: 100% !important;
      margin-bottom: 10px;
    }
    #status-chart-2-card .echarts-legend {
      flex-direction: row !important;
      flex-wrap: wrap !important;
      align-items: flex-start !important;
      margin-left: 0;
      min-width: 0;
      max-width: 100%;
      gap: 4px;
    }
  }
`;

// Inyectar estilos en el documento
function injectStatusChartStyles() {
  if (document.getElementById("status-chart-styles")) return;

  const styleSheet = document.createElement("style");
  styleSheet.id = "status-chart-styles";
  styleSheet.textContent = statusChartStyles;
  document.head.appendChild(styleSheet);
}

// Procesar los datos del endpoint agrupando por estatus
function processStatusData(data) {
  // Agrupar ignorando mayúsculas, minúsculas y acentos
  const statusCounts = {};
  const statusLabels = {};
  data.forEach((item) => {
    if (item.estatus) {
      // Normalizar: quitar acentos y pasar a minúsculas
      const normalized = item.estatus
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
      statusCounts[normalized] = (statusCounts[normalized] || 0) + 1;
      // Guardar el primer label original para mostrarlo
      if (!statusLabels[normalized]) {
        statusLabels[normalized] = item.estatus;
      }
    }
  });
  const categories = Object.values(statusLabels);
  const values = Object.keys(statusLabels).map((key) => statusCounts[key]);
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

// Inicializar gráfica
function initStatusChart() {
  // Inyectar estilos
  injectStatusChartStyles();

  const statusChart = echarts.init(document.getElementById("status-chart-2"));

  // Configuración inicial vacía (sin formatter que dependa de seriesData)
  const statusOption = {
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        const dataArr = params?.series?.data || [];
        const total = dataArr.reduce((sum, d) => sum + (d.value || 0), 0);
        const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
        return `
          <div style="font-weight: 600; margin-bottom: 5px;">${params.name}</div>
          <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 3px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%;"></span>
              Cantidad: <strong>${params.value}</strong>
          </div>
          <div style="color: #666; font-size: 11px;">Porcentaje: ${percentage}%</div>
        `;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#00BFA5",
      borderWidth: 1,
      textStyle: { color: "#1C1C1C", fontSize: 12 },
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "middle",
      data: [],
      textStyle: { color: "#4A4A4A", fontSize: 11 },
      itemGap: 15,
      itemWidth: 15,
      itemHeight: 12,
      formatter: function (name) {
        if (name.length > 20) {
          return name.substring(0, 20);
        }
        return name;
      },
    },
    series: [
      {
        name: "Estatus de Permisos",
        type: "pie",
        radius: ["32%", "58%"],
        center: ["44%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: function (params) {
            const dataArr = params?.series?.data || [];
            const total = dataArr.reduce((sum, d) => sum + (d.value || 0), 0);
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
        animationDelay: function (idx) {
          return idx * 150;
        },
      },
    ],
  };

  // Aplicar configuración
  statusChart.setOption(statusOption);
  statusChart.resize();

  // Hacer responsive
  window.addEventListener("resize", function () {
    statusChart.resize();
  });

  // Función para actualizar datos
  function updateStatusChart(newData) {
    const pieData = newData.categories.map((category, index) => ({
      value: newData.values[index],
      name: category,
      itemStyle: { color: newData.colors[index] },
    }));
    const total = newData.values.reduce((sum, v) => sum + v, 0);
    statusChart.setOption({
      title: undefined,
      legend: {
        data: newData.categories,
        orient: "vertical",
        right: 10,
        top: "middle",
      },
      series: [
        {
          data: pieData,
          center: ["44%", "50%"],
          radius: ["32%", "58%"],
          label: {
            show: true,
            formatter: function (params) {
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
                Cantidad: <strong>${params.value}</strong>
            </div>
            <div style="color: #666; font-size: 11px;">Porcentaje: ${percentage}%</div>
          `;
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#00BFA5",
        borderWidth: 1,
        textStyle: { color: "#1C1C1C", fontSize: 12 },
      },
    });
  }

  // Obtener datos del endpoint y actualizar la gráfica
  fetch("/api/graficas_jefes/permisos-jefes")
    .then((response) => response.json())
    .then((data) => {
      const processed = processStatusData(data);
      updateStatusChart(processed);
    })
    .catch((err) => {
      console.error("Error al obtener datos de estatus:", err);
    });

  // Retornar funciones públicas
  return {
    chart: statusChart,
    updateData: updateStatusChart,
    resize: () => statusChart.resize(),
  };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("status-chart-2")) {
    window.statusChartInstance = initStatusChart();
  }
});

// Exportar para uso global
window.initStatusChart = initStatusChart;
