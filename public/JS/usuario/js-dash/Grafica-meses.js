// Gráfica de Permisos por Mes y Tipo - Barras Agrupadas
async function fetchAndRenderBarChart(id_departamento) {
  const response = await fetch(
    `/api/graficas_jefes/meses/departamento/${id_departamento}`
  );
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
    const tipo = item.tipo_permiso;
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

  // Calcular el total por mes
  const totalesPorMes = Array(12).fill(0);
  tipos.forEach((tipo) => {
    conteo[tipo].forEach((valor, mes) => {
      totalesPorMes[mes] += valor;
    });
  });

  // Serie extra para mostrar el total por mes arriba de cada grupo de barras
  series.push({
    name: "Total",
    type: "bar",
    data: totalesPorMes,
    stack: null,
    barGap: "-100%",
    itemStyle: { color: "rgba(0,0,0,0)" }, // invisible
    label: {
      show: true,
      position: "top",
      fontSize: 15,
      fontWeight: "bold",
      color: "#333",
      formatter: function (params) {
        return params.value > 0 ? params.value : "";
      },
    },
    silent: true,
    z: 10,
  });

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
          if (item.seriesName !== "Total") {
            tooltip += `${item.marker} ${item.seriesName}: ${item.value}<br/>`;
            total += item.value;
          }
        });
        tooltip += `<b>Total: ${total}</b>`;
        return tooltip;
      },
    },
    legend: {
      data: tipos,
      bottom: 10,
      left: "center",
      width: "90%",
      orient: "horizontal",
      itemGap: 24,
      textStyle: { fontSize: 15, fontWeight: 500 },
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: [12, 24],
      shadowColor: "rgba(44,62,80,0.10)",
      shadowBlur: 12,
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "22%",
      top: "8%",
      containLabel: true,
    },
    xAxis: { type: "category", data: meses, axisLabel: { fontSize: 13 } },
    yAxis: { type: "value", name: "Cantidad", axisLabel: { fontSize: 13 } },
    series: series,
  };
  chart.setOption(option);

  window.addEventListener("resize", function () {
    chart.resize();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("tiempos-chart")) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    console.log("usuario:", usuario);
    const id_departamento = usuario.id;
    console.log("id_departamento:", id_departamento);
    fetchAndRenderBarChart(id_departamento);
  }
});
