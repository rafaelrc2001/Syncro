// Gráfica de Tiempos de Autorización de Permisos - Promedio.js

// Configuración de la gráfica
function initTiemposChart() {
  // Datos de ejemplo para tiempos de autorización (en horas)
  const tiemposData = {
    permisos: [
      "PM-2023-00145",
      "PM-2023-00144",
      "PM-2023-00143",
      "PM-2023-00142",
      "PM-2023-00141",
    ],
    tiemposCreacionArea: [2.5, 1.8, 3.2, 4.1, 2.9], // Tiempo desde creación hasta área
    tiemposAreaSeguridad: [1.2, 0.8, 1.5, 2.3, 1.1], // Tiempo desde área hasta seguridad
    tiemposTotales: [3.7, 2.6, 4.7, 6.4, 4.0], // Tiempo total desde creación hasta activo
    colores: {
      creacionArea: "#003B5C", // Azul petróleo
      areaSeguridad: "#FF6F00", // Naranja seguridad
      total: "#00BFA5", // Verde técnico
    },
  };

  // Calcular promedios
  const promedioCreacionArea = (
    tiemposData.tiemposCreacionArea.reduce((a, b) => a + b, 0) /
    tiemposData.tiemposCreacionArea.length
  ).toFixed(1);
  const promedioAreaSeguridad = (
    tiemposData.tiemposAreaSeguridad.reduce((a, b) => a + b, 0) /
    tiemposData.tiemposAreaSeguridad.length
  ).toFixed(1);
  const promedioTotal = (
    tiemposData.tiemposTotales.reduce((a, b) => a + b, 0) /
    tiemposData.tiemposTotales.length
  ).toFixed(1);

  // Inicializar gráfica
  const tiemposChart = echarts.init(document.getElementById("tiempos-chart"));

  // Configuración de la gráfica
  const tiemposOption = {
    title: {
      text: `Promedios: Creación→Área: ${promedioCreacionArea}h | Área→Seguridad: ${promedioAreaSeguridad}h | Total: ${promedioTotal}h`,
      left: "center",
      top: 5,
      textStyle: {
        fontSize: 12,
        color: "#4A4A4A",
        fontWeight: "normal",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        let result = `<div style="font-weight: 600; margin-bottom: 8px; font-size: 12px;">${params[0].name}</div>`;

        params.forEach((param) => {
          result += `
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 12px; margin: 4px 0;">
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%;"></span>
                                ${param.seriesName}:
                            </div>
                            <strong>${param.value}h</strong>
                        </div>
                    `;
        });

        return result;
      },
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#003B5C",
      borderWidth: 1,
      textStyle: {
        color: "#1C1C1C",
        fontSize: 12,
      },
      padding: [10, 12],
    },
    legend: {
      data: ["Creación → Área", "Área → Seguridad", "Tiempo Total"],
      top: 30,
      textStyle: {
        fontSize: 11,
        color: "#4A4A4A",
      },
      itemWidth: 14,
      itemHeight: 10,
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "12%",
      top: "18%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: tiemposData.permisos,
      axisLabel: {
        rotate: 0,
        color: "#4A4A4A",
        fontSize: 10,
        fontWeight: 500,
        interval: 0,
        margin: 12,
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
      name: "Horas",
      nameTextStyle: {
        color: "#4A4A4A",
        fontSize: 11,
        fontWeight: 500,
        padding: [0, 0, 0, 10],
      },
      axisLabel: {
        color: "#4A4A4A",
        fontSize: 10,
        formatter: "{value}h",
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
    },
    series: [
      {
        name: "Creación → Área",
        type: "bar",
        stack: "tiempos",
        data: tiemposData.tiemposCreacionArea.map((value, index) => ({
          value: value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: tiemposData.colores.creacionArea },
              { offset: 1, color: tiemposData.colores.creacionArea + "CC" },
            ]),
            borderRadius: [4, 4, 0, 0],
            shadowColor: tiemposData.colores.creacionArea + "40",
            shadowBlur: 4,
            shadowOffsetY: 3,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 6,
              shadowOffsetY: 4,
            },
          },
        })),
        barWidth: "70%",
      },
      {
        name: "Área → Seguridad",
        type: "bar",
        stack: "tiempos",
        data: tiemposData.tiemposAreaSeguridad.map((value, index) => ({
          value: value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: tiemposData.colores.areaSeguridad },
              { offset: 1, color: tiemposData.colores.areaSeguridad + "CC" },
            ]),
            borderRadius: [0, 0, 0, 0],
            shadowColor: tiemposData.colores.areaSeguridad + "40",
            shadowBlur: 4,
            shadowOffsetY: 3,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 6,
              shadowOffsetY: 4,
            },
          },
        })),
        barWidth: "70%",
      },
      {
        name: "Tiempo Total",
        type: "line",
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          color: tiemposData.colores.total,
          width: 3,
        },
        itemStyle: {
          color: tiemposData.colores.total,
          borderColor: "#FFFFFF",
          borderWidth: 2,
        },
        data: tiemposData.tiemposTotales,
        z: 10,
      },
    ],
    animationEasing: "elasticOut",
    animationDelay: function (idx) {
      return idx * 60;
    },
  };

  // Aplicar configuración
  tiemposChart.setOption(tiemposOption);

  // Hacer responsive
  window.addEventListener("resize", function () {
    tiemposChart.resize();
  });

  // Función para actualizar datos
  function updateTiemposChart(newData) {
    const updatedOption = {
      xAxis: {
        data: newData.permisos || tiemposData.permisos,
      },
      series: [
        {
          data: (
            newData.tiemposCreacionArea || tiemposData.tiemposCreacionArea
          ).map((value) => ({ value: value })),
        },
        {
          data: (
            newData.tiemposAreaSeguridad || tiemposData.tiemposAreaSeguridad
          ).map((value) => ({ value: value })),
        },
        {
          data: newData.tiemposTotales || tiemposData.tiemposTotales,
        },
      ],
    };
    tiemposChart.setOption(updatedOption);
  }

  // Retornar funciones públicas
  return {
    chart: tiemposChart,
    updateData: updateTiemposChart,
    resize: () => tiemposChart.resize(),
  };
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("tiempos-chart")) {
    window.tiemposChartInstance = initTiemposChart();
  }
});

// Exportar para uso global
window.initTiemposChart = initTiemposChart;
