// Gráfica de Permisos por Áreas - Barras Verticales
// grafica-areas.js

// Configuración de la gráfica
function initAreasChart() {
  // Inicializa la gráfica vacía
  const areasData = {
    categories: [],
    values: [],
    colors: ["#003B5C", "#FF6F00", "#00BFA5", "#B0BEC5", "#4A4A4A", "#D32F2F"],
  };

  // Inicializar gráfica
  const areasChart = echarts.init(document.getElementById("areas-chart"));

  // Configuración de la gráfica
  const areasOption = {
    title: {
      show: false,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        const data = params[0];
        return `
                    <div style="font-weight: 600; margin-bottom: 3px; font-size: 11px;">${data.name}</div>
                    <div style="display: flex; align-items: center; gap: 5px; font-size: 11px;">
                        <span style="display: inline-block; width: 8px; height: 8px; background: ${data.color}; border-radius: 50%;"></span>
                        Permisos: <strong>${data.value}</strong>
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
    grid: {
      left: "3%",
      right: "3%",
      bottom: "18%",
      top: "5%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: areasData.categories,
      axisLabel: {
        rotate: 35,
        color: "#4A4A4A",
        fontSize: 10,
        fontWeight: 500,
        interval: 0,
        margin: 8,
      },
      axisLine: {
        lineStyle: {
          color: "#B0BEC5",
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      name: "Cantidad",
      nameTextStyle: {
        color: "#4A4A4A",
        fontSize: 10,
        fontWeight: 500,
        padding: [0, 0, 0, 20],
      },
      axisLabel: {
        color: "#4A4A4A",
        fontSize: 10,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#F5F5F5",
          width: 1,
          type: "solid",
        },
      },
      splitNumber: 4,
    },
    series: [
      {
        name: "Permisos",
        type: "bar",
        data: areasData.values.map((value, index) => ({
          value: value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: areasData.colors[index] },
              { offset: 1, color: areasData.colors[index] + "80" },
            ]),
            borderRadius: [4, 4, 0, 0],
            shadowColor: areasData.colors[index] + "30",
            shadowBlur: 4,
            shadowOffsetY: 2,
          },
          emphasis: {
            itemStyle: {
              color: areasData.colors[index],
              shadowBlur: 6,
              shadowOffsetY: 3,
            },
          },
          // Agregar etiqueta con el valor
          label: {
            show: true,
            position: "top",
            distance: 5,
            formatter: "{c}",
            fontSize: 10,
            fontWeight: "bold",
            color: "#4A4A4A",
          },
        })),
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

  // Aplicar configuración
  areasChart.setOption(areasOption);

  // Hacer responsive
  window.addEventListener("resize", function () {
    areasChart.resize();
  });

  // Función para actualizar datos
  function updateAreasChart(newData) {
    const updatedOption = {
      xAxis: {
        data: newData.categories || areasData.categories,
      },
      series: [
        {
          data: (newData.values || areasData.values).map((value, index) => ({
            value: value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: (newData.colors || areasData.colors)[index],
                },
                {
                  offset: 1,
                  color: (newData.colors || areasData.colors)[index] + "80",
                },
              ]),
              borderRadius: [4, 4, 0, 0],
              shadowColor: (newData.colors || areasData.colors)[index] + "30",
              shadowBlur: 4,
              shadowOffsetY: 2,
            },
            // Mantener las etiquetas al actualizar
            label: {
              show: true,
              position: "top",
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

function cargarDatosAreas() {
  fetch("http://localhost:3000/api/grafica/" + id_departamento)
    .then((res) => res.json())
    .then((data) => {
      // Transforma los datos para la gráfica usando cantidad_trabajos
      const categories = data.areas.map((a) => a.area);
      const values = data.areas.map((a) => Number(a.cantidad_trabajos));
      // Genera colores dinámicos si hay más áreas de las que tienes colores
      const baseColors = [
        "#003B5C",
        "#FF6F00",
        "#00BFA5",
        "#B0BEC5",
        "#4A4A4A",
        "#D32F2F",
      ];
      const colors = categories.map(
        (_, i) => baseColors[i % baseColors.length]
      );
      // Actualiza la gráfica
      if (window.areasChartInstance) {
        window.areasChartInstance.updateData({ categories, values, colors });
      }
    });
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("areas-chart")) {
    window.areasChartInstance = initAreasChart();
  }
  cargarDatosAreas();
});

// Exportar para uso global
window.initAreasChart = initAreasChart;
