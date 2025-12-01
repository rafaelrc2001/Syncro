// Gráfica de Permisos por Mes y Tipo - Barras Agrupadas
async function fetchAndRenderBarChart() {
  const response = await fetch("/api/graficas_jefes/meses");
  const data = await response.json();

  // Meses en español
  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Agrupar por tipo y mes
  const tiposSet = new Set();
  const conteo = {};

  data.forEach((item) => {
    const tipo = item.tipo_permiso_nombre;
    const fecha = new Date(item.fecha_hora);
    const mes = fecha.getMonth(); // 0-11

    tiposSet.add(tipo);
    if (!conteo[tipo]) conteo[tipo] = Array(12).fill(0);
    conteo[tipo][mes]++;
  });

  const tipos = Array.from(tiposSet);
  const colors = [
    "#003B5C", // azul oscuro
    "#FF6F00", // naranja
    "#00BFA5", // verde agua
    "#8E24AA", // morado
    "#43A047", // verde
    "#F44336", // rojo
    "#FFD600", // amarillo
    "#1E88E5", // azul
    "#D81B60", // rosa
    "#8D6E63", // café
    "#C0CA33", // verde lima
  ];

  const series = tipos.map((tipo, i) => ({
    name: tipo,
    type: "bar",
    stack: "total",
    data: conteo[tipo],
    itemStyle: { color: colors[i % colors.length] },
    emphasis: { focus: "series" },
  }));

  const chart = echarts.init(document.getElementById("tiempos-chart"));
  const option = {
    title: { text: "", left: "center", textStyle: { fontSize: 16 } },
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
    legend: {
      data: tipos,
      top: 10, // más arriba
      left: "center",
      width: "90%",
      orient: "horizontal",
      itemGap: 20, // más espacio entre ítems
      textStyle: { fontSize: 13 },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "8%",
      top: "18%",
      containLabel: true,
    },
    xAxis: { type: "category", data: meses, axisLabel: { fontSize: 12 } },
    yAxis: { type: "value", name: "Cantidad", axisLabel: { fontSize: 12 } },
    series: series,
  };
  chart.setOption(option);

  window.addEventListener("resize", function () {
    chart.resize();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("tiempos-chart")) {
    fetchAndRenderBarChart();
  }
});
