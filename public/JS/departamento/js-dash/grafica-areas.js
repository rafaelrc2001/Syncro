// Gráfica de Permisos por Áreas - Barras Verticales
// grafica-areas.js

// Configuración de la gráfica
function initAreasChart() {
  // Inicializa la gráfica vacía
  // Solo dos categorías: Accidentes y Sin accidentes
  const areasData = {
    categories: ["Accidentes", "Sin accidentes"],
    values: [0, 0],
    colors: ["#D32F2F", "#00BFA5"],
  };


  // Inicializar gráfica tipo pastel
  const areasChart = echarts.init(document.getElementById("areas-chart"));

  const areasOption = {
    title: {
      show: false,
    },
    tooltip: {
      trigger: "item",
      formatter: function (params) {
        const total = areasData.values.reduce((a, b) => a + b, 0);
        const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : "0";
        return `
          <div style="font-weight: 600; margin-bottom: 3px; font-size: 11px;">${params.name}</div>
          <div style="display: flex; align-items: center; gap: 5px; font-size: 11px;">
            <span style="display: inline-block; width: 8px; height: 8px; background: ${params.color}; border-radius: 50%;"></span>
            Permisos: <strong>${params.value}</strong>
          </div>
          <div style="font-size: 10px; color: #666; margin-bottom: 3px;">
            Porcentaje: ${percentage}%
          </div>
        `;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#003B5C",
      borderWidth: 1,
      textStyle: {
        color: "#1C1C1C",
        fontSize: 11,
      },
      padding: [5, 8],
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        fontSize: 11,
        color: '#4A4A4A',
      },
    },
    series: [
      {
        name: "Permisos por Área",
        type: "pie",
        radius: ["38%", "64%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: function (params) {
            const total = areasData.values.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : "0";
            return `${params.name}: ${params.value} (${percentage}%)`;
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
        data: areasData.categories.map((name, i) => ({
          value: areasData.values[i],
          name: name,
          itemStyle: {
            color: areasData.colors[i % areasData.colors.length],
          },
        })),
        animationType: "scale",
        animationEasing: "elasticOut",
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

  // Aplicar configuración
  areasChart.setOption(areasOption);

  // Hacer responsive
  window.addEventListener("resize", function () {
    areasChart.resize();
  });

  // Función para actualizar datos
  function updateAreasChart(newData) {
    // Agrupar sub-estatus en dos categorías
    let accidentes = 0;
    let sinAccidentes = 0;
    if (newData.categories && newData.values) {
      newData.categories.forEach((cat, i) => {
        const nombre = cat.toLowerCase();
        if (nombre.includes("cierre con accidente") || nombre.includes("cierre con incidente")) {
          accidentes += Number(newData.values[i]);
        } else if (nombre.includes("cierre sin incidentes")) {
          sinAccidentes += Number(newData.values[i]);
        }
      });
    }
    areasData.values = [accidentes, sinAccidentes];
    // Mantener solo las dos categorías y colores
    const updatedOption = {
      series: [
        {
          data: [
            {
              value: areasData.values[0],
              name: "Accidentes",
              itemStyle: { color: areasData.colors[0] },
            },
            {
              value: areasData.values[1],
              name: "Sin accidentes",
              itemStyle: { color: areasData.colors[1] },
            },
          ],
        },
      ],
    };
    areasChart.setOption(updatedOption);
  }

  // Retornar funciones públicas
  return {
    chart: areasChart,
    updateData: updateAreasChart,
    resize: () => areasChart.resize(),
  };
}

// Suponiendo que tienes el id_departamento disponible
const usuario = JSON.parse(localStorage.getItem("usuario"));
const id_departamento = usuario && usuario.id ? usuario.id : 1;


// ...existing code...

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("areas-chart")) {
    window.areasChartInstance = initAreasChart();
    // cargarDatosSubEstatusPorUsuario(); // Comentado: ahora la gráfica se actualiza solo desde filtro-global.js
  }
});

// Exportar para uso global
window.initAreasChart = initAreasChart;
