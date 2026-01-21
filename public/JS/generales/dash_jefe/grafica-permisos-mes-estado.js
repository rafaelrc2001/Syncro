// Gráfica de barras apiladas: Permisos por Mes y Estado
// grafica-permisos-mes-estado.js

function processPermisosMesEstadoData(data) {
  // Agrupar por mes y estado
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  // Inicializar estructura
  const mesesData = {};
  meses.forEach(m => {
    mesesData[m] = { 'Por Autorizar': 0, 'Activos': 0, 'Cancelados': 0, 'No Autorizados': 0 };
  });

  // Depuración: recolectar valores únicos de estado y subestatus
  const estadosSet = new Set();
  const subestatusSet = new Set();
  data.forEach((p) => {
    const estadoRaw = p.Estatus || p.estatus || p.Estado || p.estado || '';
    const subestatusRaw = p.Subestatus || p.subestatus || '';
    estadosSet.add(estadoRaw);
    subestatusSet.add(subestatusRaw);
    // Obtener mes
    let fecha = p.fecha_hora || p.fecha_creacion || p.fecha || p.createdAt || p.Fecha || '';
    let mes = '';
    if (fecha) {
      const d = new Date(fecha);
      if (!isNaN(d)) mes = meses[d.getMonth()];
    }
    if (!mes) return;
    // Determinar estado agrupado
    const estado = (estadoRaw).toLowerCase();
    const subestatus = (subestatusRaw).toLowerCase();
    if (estado === 'en espera del área' || estado === 'espera seguridad') {
      mesesData[mes]['Por Autorizar']++;
    } else if (
      estado === 'activo' ||
      estado === 'validado por seguridad' ||
      estado === 'trabajo finalizado' ||
      estado === 'espera liberacion del area'
    ) {
      mesesData[mes]['Activos']++;
    } else if (
      estado === 'cierre' && (subestatus === 'no autorizado' || subestatus === 'cancelado')
    ) {
      mesesData[mes]['No Autorizados']++;
    } else if (
      estado === 'cierre' && (
        subestatus === 'cierre con incidentes' ||
        subestatus === 'cierre sin incidentes' ||
        subestatus === 'cierre con accidentes'
      )
    ) {
      mesesData[mes]['Cancelados']++;
    }
  });
  console.log('Valores únicos de Estado:', Array.from(estadosSet));
  console.log('Valores únicos de Subestatus:', Array.from(subestatusSet));

  // Preparar datos para ECharts
  const categorias = meses;
  const series = [
    {
      name: 'Por Autorizar',
      stack: 'total',
      type: 'bar',
      data: categorias.map(m => mesesData[m]['Por Autorizar']),
      itemStyle: { color: '#FFC107' }
    },
    {
      name: 'Activos',
      stack: 'total',
      type: 'bar',
      data: categorias.map(m => mesesData[m]['Activos']),
      itemStyle: { color: '#00BFA5' }
    },
    {
      name: 'Cancelados',
      stack: 'total',
      type: 'bar',
      data: categorias.map(m => mesesData[m]['Cancelados']),
      itemStyle: { color: '#D32F2F' }
    },
    {
      name: 'No Autorizados',
      stack: 'total',
      type: 'bar',
      data: categorias.map(m => mesesData[m]['No Autorizados']),
      itemStyle: { color: '#B0BEC5' }
    }
  ];
  return { categorias, series };
}


function initPermisosMesEstadoChart() {
  const container = document.getElementById('type-chart-1');
  if (!container) {
    console.error('No se encontró el contenedor #type-chart-1');
    return;
  }
  // Asegurar tamaño mínimo
  container.style.minHeight = '320px';
  container.style.minWidth = '100%';

  const chart = echarts.init(container);
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function(params) {
        let total = 0;
        params.forEach(p => { total += p.value; });
        let res = `<b>${params[0].axisValue}</b><br/>`;
        params.forEach(p => {
          res += `<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background:${p.color}'></span> ${p.seriesName}: <b>${p.value}</b><br/>`;
        });
        res += `<span style='color:#888'>Total: ${total}</span>`;
        return res;
      }
    },
    legend: {
      data: ['Por Autorizar', 'Activos', 'Cancelados', 'No Autorizados'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      axisLabel: { rotate: 30 }
    },
    yAxis: {
      type: 'value',
      name: 'Permisos',
      minInterval: 1
    },
    series: []
  };
  chart.setOption(option);
  chart.resize();

  window.addEventListener('resize', () => chart.resize());

  function showError(msg) {
    container.innerHTML = `<div style='color:red;padding:2em;text-align:center;'>${msg}</div>`;
  }

  function updateChart(newData) {
    if (!newData || !newData.series || newData.series.every(s => s.data.every(v => v === 0))) {
      showError('No hay datos para mostrar en la gráfica.');
      return;
    }
    chart.setOption({ series: newData.series });
  }

  fetch('/api/graficas_jefes/permisos-jefes')
    .then(r => {
      if (!r.ok) throw new Error('Respuesta de red no OK');
      return r.json();
    })
    .then(data => {
      console.log('Datos recibidos para permisos por mes y estado:', data);
      const processed = processPermisosMesEstadoData(data);
      console.log('Datos procesados para gráfica:', processed);
      updateChart(processed);
    })
    .catch(err => {
      console.error('Error al obtener datos de permisos por mes y estado:', err);
      showError('Error al obtener datos para la gráfica.');
    });

  return {
    chart,
    updateData: updateChart,
    resize: () => chart.resize()
  };
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('type-chart-1')) {
    window.permisosMesEstadoChartInstance = initPermisosMesEstadoChart();
  }
});
