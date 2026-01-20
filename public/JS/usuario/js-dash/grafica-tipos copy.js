
// Gráfica de Total de Permisos por Mes

async function renderPermisosPorMesChart() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const id_usuario = usuario && usuario.id_usuario ? usuario.id_usuario : null;
  if (!id_usuario) return;
  const response = await fetch(`/api/tabla-permisos-usuario/${id_usuario}`);
  const data = await response.json();
  const permisos = data.permisos || [];

  // Meses en español
  const meses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];
  // Inicializar conteo por mes
  const conteoPorMes = Array(12).fill(0);
  permisos.forEach((permiso) => {
    let fecha = permiso.Fecha || permiso.fecha_hora || permiso.fecha;
    if (!fecha) return;
    if (fecha.includes("T")) fecha = fecha.split("T")[0];
    const mes = new Date(fecha).getMonth();
    if (mes >= 0 && mes < 12) conteoPorMes[mes]++;
  });

  // Limpiar instancia previa
  if (window.typesChartInstance) {
    window.typesChartInstance.dispose();
  }
  const chart = echarts.init(document.getElementById("type-chart"));
  window.typesChartInstance = chart;

  const option = {
    title: {
      text: "Total de Permisos por Mes",
      left: "center",
      textStyle: { fontSize: 16 }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: function (params) {
        let total = 0;
        let tooltip = params[0].axisValueLabel + "<br/>";
        params.forEach((item) => {
          tooltip += `${item.marker} ${item.seriesName}: ${item.value}<br/>`;
          total += item.value;
        });
        tooltip += `<b>Total: ${total}</b>`;
        return tooltip;
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      top: "18%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: meses,
      axisLabel: { fontSize: 13 },
    },
    yAxis: {
      type: "value",
      name: "Cantidad",
      axisLabel: { fontSize: 13 },
    },
    series: [
      {
        name: "Permisos",
        type: "bar",
        data: conteoPorMes,
        itemStyle: {
          color: "#FF6F00"
        },
        barWidth: "55%",
        label: {
          show: true,
          position: "top",
          fontSize: 13,
          fontWeight: "bold",
          color: "#333",
          formatter: function (params) {
            return params.value > 0 ? params.value : "";
          },
        },
        emphasis: { focus: "series" },
      }
    ],
    animationEasing: "elasticOut",
    animationDelayUpdate: function (idx) {
      return idx * 40;
    },
  };
  chart.setOption(option);
  window.addEventListener("resize", function () {
    chart.resize();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("type-chart")) {
    renderPermisosPorMesChart();
  }
});
