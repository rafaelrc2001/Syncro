// Gráfica de Permisos por Estatus - Gráfica de Pastel
// grafica-estatus.js

// Estilos específicos para la gráfica de estatus
const statusChartStyles = `
    /* Sobrescribir restricciones globales solo para la gráfica de estatus */
    #status-chart-2-card .chart-container,
    #status-chart-2 {
      min-height: unset !important;
      max-height: unset !important;
      height: unset !important;
      width: unset !important;
      box-sizing: border-box;
    }
    #status-chart-2 {
      min-width: 240px !important;
      max-width: 480px !important;
      width: 100% !important;
      height: 340px !important;
      margin: 0 auto;
      display: block;
      transition: width 0.2s, height 0.2s;
    }
  /* Layout para la gráfica de estatus y leyenda */
  #status-chart-2-card .chart-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    min-height: 220px;
    height: 100%;
    width: 100%;
    padding: 0 0 0 10px;
    gap: 32px;
    box-sizing: border-box;
    max-width: 100%;
  }
  /* Leyenda a la izquierda */
  #status-chart-2-card .echarts-legend {
    order: 1;
    flex: 0 0 140px;
    margin-right: 0;
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
    max-width: 160px;
    gap: 4px;
    text-align: left;
    flex-shrink: 0;
    box-sizing: border-box;
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
    text-align: left;
  }
  #status-chart-2-card .echarts-legend-item:last-child {
    margin-bottom: 0 !important;
  }
  #status-chart-2 {
    order: 2;
    flex: 1 1 220px;
    min-width: 180px;
    max-width: 320px;
    width: 100% !important;
    height: 260px !important;
    min-height: 180px;
    margin: 0;
    background: transparent;
    display: block;
    box-sizing: border-box;
    transition: width 0.2s, height 0.2s;
  }
  /* Responsive para pantallas pequeñas */
  @media (max-width: 900px) {
    #status-chart-2-card .chart-container {
      flex-direction: column-reverse;
      align-items: stretch;
      gap: 10px;
      min-width: 0;
    }
    #status-chart-2 {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 160px;
      height: 220px !important;
      margin-bottom: 10px;
      display: block;
    }
    #status-chart-2-card .echarts-legend {
      flex-direction: row !important;
      flex-wrap: wrap !important;
      align-items: flex-end !important;
      margin-right: 0;
      min-width: 0;
      max-width: 100%;
      gap: 4px;
      text-align: right;
      flex-shrink: 1;
      width: 100%;
      box-sizing: border-box;
      justify-content: flex-start !important;
    }
  }
  @media (max-width: 500px) {
    #status-chart-2 {
      height: 160px !important;
      min-width: 120px;
      width: 100% !important;
      max-width: 100% !important;
    }
    #status-chart-2-card .echarts-legend {
      font-size: 0.75rem !important;
      min-width: 0;
      max-width: 100%;
      width: 100%;
      flex-wrap: wrap !important;
      justify-content: flex-start !important;
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

  // Configuración inicial: leyenda a la derecha, etiquetas solo en tooltip y leyenda
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
      left: 10,
      top: "middle",
      data: [],
      textStyle: { color: "#4A4A4A", fontSize: 11 },
      itemGap: 8,
      itemWidth: 15,
      itemHeight: 12,
      formatter: function (name) {
        // Mostrar porcentaje en la leyenda
        if (!statusChart._statusData) return name;
        const idx = statusChart._statusData.categories.indexOf(name);
        if (idx === -1) return name;
        const value = statusChart._statusData.values[idx];
        const total = statusChart._statusData.values.reduce((sum, v) => sum + v, 0);
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        return `${name}: ${percentage}%`;
      },
      align: 'left',
    },
    series: [
      {
        name: "Estatus de Permisos",
        type: "pie",
        radius: ["50%", "95%"], // Más ancho y grande
        center: ["72%", "50%"], // Más a la derecha
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 12,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: false
          },
          itemStyle: {
            shadowBlur: 14,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: { show: false },
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
  // Forzar resize de ECharts tras el cambio de tamaño de ventana y tras un pequeño delay
  function handleResize() {
    statusChart.resize();
    setTimeout(() => statusChart.resize(), 200); // Forzar resize tras el reflow
  }
  window.addEventListener("resize", handleResize);

  // Función para actualizar datos
  function updateStatusChart(newData) {
    const pieData = newData.categories.map((category, index) => ({
      value: newData.values[index],
      name: category,
      itemStyle: { color: newData.colors[index] },
    }));
    const total = newData.values.reduce((sum, v) => sum + v, 0);
    // Guardar datos para el formateador de leyenda
    statusChart._statusData = newData;
    statusChart.setOption({
      title: undefined,
      legend: {
        data: newData.categories,
        orient: "vertical",
        left: 10,
        top: "middle",
        align: 'left',
      },
      series: [
        {
          data: pieData,
          center: ["72%", "50%"],
          radius: ["38%", "95%"],
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false
            },
          },
          labelLine: { show: false },
        },
      ],
      tooltip: {
        trigger: "item",
        formatter: function (params) {
          const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
          return `
            <div style=\"font-weight: 600; margin-bottom: 5px;\">${params.name}</div>
            <div style=\"display: flex; align-items: center; gap: 5px; margin-bottom: 3px;\">
                <span style=\"display: inline-block; width: 10px; height: 10px; background: ${params.color}; border-radius: 50%;\"></span>
                Cantidad: <strong>${params.value}</strong>
            </div>
            <div style=\"color: #666; font-size: 11px;\">Porcentaje: ${percentage}%</div>
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
