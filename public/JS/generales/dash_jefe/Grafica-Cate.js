// Gráfica de Permisos por Categoría - Gráfica de Pastel
// grafica-categorias.js

// Estilos específicos para la gráfica de categorías
const categoriasChartStyles = `
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
        color: var(--verde-tecnico);
        font-size: 1.4rem;
    }

    #categorias-chart {
        width: 100%;
        height: 300px;
        flex-grow: 1;
    }

    .categorias-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid var(--blanco-neutro);
        justify-content: center;
    }

    .categorias-legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.8rem;
        color: var(--gris-acero);
    }

    .categorias-legend-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
`;

// Inyectar estilos en el documento
function injectCategoriasChartStyles() {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = categoriasChartStyles;
  document.head.appendChild(styleSheet);
}

// Procesar los datos del endpoint agrupando por categoría (ignorando mayúsculas, minúsculas y acentos)
function processCategoriasData(data) {
  const catCounts = {};
  const catLabels = {};
  data.forEach((item) => {
    if (item.categoria) {
      const normalized = item.categoria
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
      catCounts[normalized] = (catCounts[normalized] || 0) + 1;
      if (!catLabels[normalized]) {
        catLabels[normalized] = item.categoria;
      }
    }
  });
  const categories = Object.values(catLabels);
  const values = Object.keys(catLabels).map((key) => catCounts[key]);
  // Paleta de colores y algunos íconos por defecto
  const colors = [
    "#00BFA5",
    "#FF6F00",
    "#D32F2F",
    "#003B5C",
    "#7B1FA2",
    "#FFC107",
    "#0097A7",
    "#C51162",
    "#43A047",
    "#F4511E",
  ];
  const icons = ["🔧", "⚡", "🧪", "🏭", "📦", "🛠️", "🚧", "🔬", "🧰", "🏗️"];
  return {
    categories,
    values,
    colors: categories.map((_, i) => colors[i % colors.length]),
    icons: categories.map((_, i) => icons[i % icons.length]),
  };
}

function initCategoriasChart() {
  injectCategoriasChartStyles();
  const categoriasChart = echarts.init(
    document.getElementById("categorias-chart")
  );

  // Configuración inicial vacía
  const categoriasOption = {
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        // El total se calcula dinámicamente
        const total =
          params.series?.data?.reduce((a, b) => a + (b.value || 0), 0) || 0;
        const percentage =
          total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
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
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#00BFA5",
      borderWidth: 1,
      textStyle: {
        color: "#1C1C1C",
        fontSize: 12,
      },
    },
    legend: {
      orient: "horizontal",
      bottom: "0%",
      data: [],
      textStyle: {
        color: "#4A4A4A",
        fontSize: 11,
      },
      itemGap: 15,
      itemWidth: 12,
      itemHeight: 12,
      formatter: function (name) {
        if (name.length > 15) {
          return name.substring(0, 12) + "...";
        }
        return name;
      },
    },
    series: [
      {
        name: "Categorías de Permisos",
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
            const total =
              params.series?.data?.reduce((a, b) => a + (b.value || 0), 0) || 0;
            const percentage =
              total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
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
        labelLine: {
          show: true,
          length: 10,
          length2: 5,
        },
        data: [],
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay: function (idx) {
          return idx * 150;
        },
      },
    ],
  };
  categoriasChart.setOption(categoriasOption);

  // Responsive
  window.addEventListener("resize", function () {
    categoriasChart.resize();
  });

  // Función para actualizar datos
  function updateCategoriasChart(newData) {
    const pieData = newData.categories.map((category, index) => ({
      value: newData.values[index],
      name: `${newData.icons[index]} ${category}`,
      itemStyle: {
        color: newData.colors[index],
      },
    }));
    const total = newData.values.reduce((a, b) => a + b, 0);
    categoriasChart.setOption({
      legend: {
        data: newData.categories.map(
          (category, index) => `${newData.icons[index]} ${category}`
        ),
      },
      series: [
        {
          data: pieData,
          label: {
            show: true,
            formatter: function (params) {
              const percentage =
                total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
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
          const percentage =
            total > 0 ? ((params.value / total) * 100).toFixed(1) : 0;
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
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#00BFA5",
        borderWidth: 1,
        textStyle: {
          color: "#1C1C1C",
          fontSize: 12,
        },
      },
    });
  }

  // Obtener datos del endpoint y actualizar la gráfica
  fetch("/api/graficas_jefes/permisos-jefes")
    .then((response) => response.json())
    .then((data) => {
      const processed = processCategoriasData(data);
      updateCategoriasChart(processed);
    })
    .catch((err) => {
      console.error("Error al obtener datos de categorías:", err);
    });

  // Retornar funciones públicas
  return {
    chart: categoriasChart,
    updateData: updateCategoriasChart,
    resize: () => categoriasChart.resize(),
  };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("categorias-chart")) {
    window.categoriasChartInstance = initCategoriasChart();
  }
});

// Exportar para uso global
window.initCategoriasChart = initCategoriasChart;
