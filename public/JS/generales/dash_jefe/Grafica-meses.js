// Gráfica de Permisos por Mes y Tipo - Barras Agrupadas

// --- NUEVO: Selector de año y tarjetas resumen ---
function getCurrentYear() {
  const el = document.getElementById("anio-actual");
  return el ? el.textContent : new Date().getFullYear().toString();
}

function renderSummaryCards(data) {
  const cards = document.querySelectorAll(".cards-section .card .count");
  if (cards && cards.length >= 5) {
    cards[0].textContent = data.length;
    const porAutorizar = data.filter((p) => {
      const estado = (p.estatus || "").toLowerCase();
      return estado === "en espera del área" || estado === "espera seguridad";
    }).length;
    cards[1].textContent = porAutorizar;
    const activos = data.filter((p) => {
      const estado = (p.estatus || "").toLowerCase();
      return estado === "activo";
    }).length;
    cards[2].textContent = activos;
    const terminados = data.filter((p) => {
      const estado = (p.estatus || "").toLowerCase();
      return (
        estado === "terminado" ||
        estado === "cancelado" ||
        estado === "cierre con accidentes" ||
        estado === "cierre con incidentes" ||
        estado === "cierre sin incidentes"
      );
    }).length;
    cards[3].textContent = terminados;
    const noAutorizados = data.filter((p) => {
      const estado = (p.estatus || "").toLowerCase();
      return estado === "no autorizado";
    }).length;
    cards[4].textContent = noAutorizados;
  }
}

async function fetchAndRenderBarChart() {
  const response = await fetch("/api/graficas_jefes/meses");
  let data = await response.json();

  // Filtro por año y por rango de fechas si están definidos
  const anio = getCurrentYear();
  const fechaInicioInput = document.getElementById("fecha-inicio");
  const fechaFinalInput = document.getElementById("fecha-final");
  let fechaInicio =
    fechaInicioInput && fechaInicioInput.value
      ? new Date(fechaInicioInput.value)
      : null;
  let fechaFinal =
    fechaFinalInput && fechaFinalInput.value
      ? new Date(fechaFinalInput.value)
      : null;

  data = data.filter((item) => {
    const fecha = item.fecha_hora ? item.fecha_hora.split("T")[0] : null;
    if (!fecha) return false;
    const fechaObj = new Date(fecha);
    // Filtrar por año
    if (fechaObj.getFullYear().toString() !== anio) return false;
    // Filtrar por fecha inicio
    if (fechaInicio && fechaObj < fechaInicio) return false;
    // Filtrar por fecha final (incluir el día seleccionado)
    if (fechaFinal) {
      let fechaFinalCopia = new Date(fechaFinal);
      fechaFinalCopia.setHours(23, 59, 59, 999);
      if (fechaObj > fechaFinalCopia) return false;
    }
    return true;
  });

  renderSummaryCards(data);

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
    "#003B5C",
    "#FF6F00",
    "#00BFA5",
    "#8E24AA",
    "#43A047",
    "#F44336",
    "#FFD600",
    "#1E88E5",
    "#D81B60",
    "#8D6E63",
    "#C0CA33",
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

  // --- LIMPIAR EL GRÁFICO ANTES DE RENDERIZAR ---
  const chartDom = document.getElementById("tiempos-chart");
  if (chartDom) {
    if (echarts.getInstanceByDom(chartDom)) {
      echarts.getInstanceByDom(chartDom).dispose();
    }
    const chart = echarts.init(chartDom);
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
      xAxis: { type: "category", data: meses, axisLabel: { fontSize: 12 } },
      yAxis: { type: "value", name: "Cantidad", axisLabel: { fontSize: 12 } },
      series: series,
    };
    chart.setOption(option);
    window.addEventListener("resize", function () {
      chart.resize();
    });
  }
}

function setupYearChangeListeners() {
  const anioSpan = document.getElementById("anio-actual");
  const prevBtn = document.getElementById("anio-prev");
  const nextBtn = document.getElementById("anio-next");
  if (!anioSpan || !prevBtn || !nextBtn) return;
  prevBtn.addEventListener("click", () => {
    let anio = parseInt(anioSpan.textContent);
    anioSpan.textContent = (anio - 1).toString();
    fetchAndRenderBarChart();
  });
  nextBtn.addEventListener("click", () => {
    let anio = parseInt(anioSpan.textContent);
    anioSpan.textContent = (anio + 1).toString();
    fetchAndRenderBarChart();
  });
}

function setupDateFilterListeners() {
  const fechaInicioInput = document.getElementById("fecha-inicio");
  const fechaFinalInput = document.getElementById("fecha-final");
  if (fechaInicioInput) {
    fechaInicioInput.addEventListener("change", fetchAndRenderBarChart);
  }
  if (fechaFinalInput) {
    fechaFinalInput.addEventListener("change", fetchAndRenderBarChart);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("tiempos-chart")) {
    // Si no existen los controles de año y tarjetas, los puedes agregar en tu HTML
    const anioSpan = document.getElementById("anio-actual");
    if (anioSpan) {
      anioSpan.textContent = new Date().getFullYear().toString();
    }
    fetchAndRenderBarChart();
    setupYearChangeListeners();
    setupDateFilterListeners();
  }
});
