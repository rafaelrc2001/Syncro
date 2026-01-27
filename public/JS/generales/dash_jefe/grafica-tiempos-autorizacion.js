// Tabla de tiempos de autorización con scroll horizontal
// grafica-tiempos-autorizacion.js

function minutosADuracion(minutos) {
  if (minutos == null || isNaN(minutos)) return '';
  const h = Math.floor(minutos / 60);
  const m = Math.round(minutos % 60);
  let str = '';
  if (h > 0) str += `${h} hr${h === 1 ? '' : 's'}`;
  if (h > 0 && m > 0) str += ' ';
  if (m > 0) str += `${m} min`;
  if (str === '') str = '0 min';
  return str;
}

function calcularTiempos(row) {
  // Convertir fechas a objetos Date y ajustar a zona horaria de México (UTC-6)
  function parseDate(fechaStr) {
    return fechaStr ? new Date(fechaStr) : null;
  }
  const f_creacion = parseDate(row.fecha_hora);
  const f_area = parseDate(row.fecha_hora_area);
  const f_supervisor = parseDate(row.fecha_hora_supervisor);
  const f_cierre_usuario = parseDate(row.fecha_hora_cierre_usuario);
  const f_cierre_area = parseDate(row.fecha_hora_cierre_area);

  // Calcular diferencias en minutos
  const espera_area = (f_creacion && f_area) ? (f_area - f_creacion) / 60000 : null;
  const validacion_seg = (f_area && f_supervisor) ? (f_supervisor - f_area) / 60000 : null;
  const fin_trabajo = (f_supervisor && f_cierre_usuario) ? (f_cierre_usuario - f_supervisor) / 60000 : null;
  const autorizacion_cierre = (f_cierre_usuario && f_cierre_area) ? (f_cierre_area - f_cierre_usuario) / 60000 : null;
  const total = (f_creacion && f_cierre_area) ? (f_cierre_area - f_creacion) / 60000 : null;

  return {
    espera_area: minutosADuracion(espera_area),
    validacion_seg: minutosADuracion(validacion_seg),
    fin_trabajo: minutosADuracion(fin_trabajo),
    autorizacion_cierre: minutosADuracion(autorizacion_cierre),
    total: minutosADuracion(total)
  };
}


function renderTablaTiemposAutorizacion(datos, contenedorId = 'type-chart-2') {
  const container = document.getElementById(contenedorId);
  if (!container) return;
  container.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'tabla-tiempos-autorizacion';
  table.style.width = '100%';
  table.style.minWidth = '900px';
  table.style.borderCollapse = 'collapse';

  // Agregar estilos para sticky header
  const styleId = 'tabla-tiempos-sticky-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .tabla-tiempos-autorizacion thead th {
        position: sticky;
        top: 0;
        z-index: 2;
        background: #444 !important;
        color: #fff !important;
      }
      .tabla-tiempos-autorizacion thead tr {
        background: #444 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Encabezados
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr style="background:#f5f5f5;">
      <th>Folio</th>
      <th>Creación</th>
      <th>Espera del área</th>
      <th>Validación por Seguridad</th>
      <th>Finalización de Trabajo</th>
      <th>Autorización de Cierre</th>
      <th>Total de Tiempo</th>
      <th># Revalidaciones</th>
    </tr>
  `;
  table.appendChild(thead);

  // Cuerpo
  const tbody = document.createElement('tbody');
  datos.forEach((row, idx) => {
    const tiempos = calcularTiempos(row);
    const tr = document.createElement('tr');
    // Alternar color de fondo
    tr.style.background = idx % 2 === 0 ? '#fafbfc' : '#f0f1f3';
    // Mostrar fecha de creación en hora local de México
    let fechaCreacion = '';
    if (row.fecha_hora) {
      const date = new Date(row.fecha_hora);
      fechaCreacion = new Intl.DateTimeFormat('es-MX', {
        timeZone: 'America/Mexico_City',
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(date);
    }
    tr.innerHTML = `
      <td>${row.prefijo || ''}</td>
      <td>${fechaCreacion}</td>
      <td>${tiempos.espera_area}</td>
      <td>${tiempos.validacion_seg}</td>
      <td>${tiempos.fin_trabajo}</td>
      <td>${tiempos.autorizacion_cierre}</td>
      <td style='background:#f0f0f0;font-weight:bold;color:#1565c0;'>${tiempos.total}</td>
      <td>${row.total_revalidaciones != null ? row.total_revalidaciones : ''}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // Scroll horizontal y vertical (máx. 8 filas visibles)
  const wrapper = document.createElement('div');
  wrapper.style.overflowX = 'auto';
  wrapper.style.overflowY = 'auto';
  wrapper.style.maxHeight = '150px'; // Aproximadamente 8 filas (ajustable)
  wrapper.appendChild(table);
  container.appendChild(wrapper);
}

// Instancia global para actualización desde el filtro global
window.tiemposAutorizacionTableInstance = {
  updateData: function (datos) {
    renderTablaTiemposAutorizacion(datos);
  }
};

// Inicialización automática al cargar
function initTablaTiemposAutorizacion() {
  fetch('/api/graficas_jefes/permisos-jefes')
    .then(r => r.json())
    .then(data => {
      renderTablaTiemposAutorizacion(data);
    })
    .catch(err => {
      const container = document.getElementById('type-chart-2');
      if (container) container.innerHTML = '<div style="color:red;padding:2em;text-align:center;">Error al obtener datos para la tabla.</div>';
      console.error('Error al obtener datos para la tabla de tiempos de autorización:', err);
    });
}

document.addEventListener('DOMContentLoaded', initTablaTiemposAutorizacion);
