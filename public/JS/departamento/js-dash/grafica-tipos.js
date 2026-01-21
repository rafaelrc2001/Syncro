// Gráfica de Total de Permisos por Mes (con estructura compatible con filtro global)

function initTypesChart() {
  // Inicializar instancia y exponer updateData
  let chart = echarts.init(document.getElementById("type-chart"));
  window.typesChartInstance = chart;

  // Función para renderizar la gráfica de permisos por mes
  function renderPermisosPorMes(permisos) {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    let conteoPorMes = Array(12).fill(0);
    if (Array.isArray(permisos) && permisos.length > 0) {
      permisos.forEach((permiso) => {
        let fecha = permiso.Fecha || permiso.fecha_hora || permiso.fecha;
        if (!fecha) return;
        if (fecha.includes("T")) fecha = fecha.split("T")[0];
        const mes = new Date(fecha).getMonth();
        if (mes >= 0 && mes < 12) conteoPorMes[mes]++;
      });
    }
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
        minInterval: 1,
        min: 0,
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
  }

  // updateData compatible con filtro global
  function updateData(newData) {
    // Permitir tanto {permisos: [...]}, como un array plano de permisos
    if (Array.isArray(newData)) {
      renderPermisosPorMes(newData);
    } else if (newData && Array.isArray(newData.permisos)) {
      renderPermisosPorMes(newData.permisos);
    } else if (newData && Array.isArray(newData.values)) {
      // Compatibilidad: si recibe .values, asume que son los permisos
      renderPermisosPorMes(newData.values);
    } else {
      renderPermisosPorMes([]);
    }
  }

  // Exponer API pública
  return {
    chart,
    updateData,
    resize: () => chart.resize(),
  };
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("type-chart")) {
    window.typesChartInstance = initTypesChart();
    // Cargar datos iniciales (por mes)
    (async function () {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const id_usuario = usuario && usuario.id_usuario ? usuario.id_usuario : null;
      if (!id_usuario) return;
      const response = await fetch(`/api/tabla-permisos-departamentos/${id_usuario}`);
      const data = await response.json();
      window.typesChartInstance.updateData({ permisos: data.permisos || [] });
    })();
  }
});
