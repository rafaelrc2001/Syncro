// ================================
// Tabla de tiempos de autorización
// grafica-tiempos-autorizacion.js
// ================================

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

// 🔹 FUNCIÓN ÚNICA PARA FECHAS (HORA LOCAL MÉXICO)

// Ya no se hace ninguna conversión de zona horaria ni a objeto Date para mostrar o calcular
// Solo se usa el string tal cual viene del backend

function calcularTiempos(row) {
  // Usar los strings tal cual, pero para cálculos convertir solo localmente a Date

  function toDateIgnoreSeconds(str) {
    if (!str) return null;
    // Quitar segundos y milisegundos para evitar saltos de hora
    // "2026-01-27T10:41:38" => "2026-01-27T10:41"
    let base = str.split('T');
    if (!base[1]) return new Date(str);
    let hm = base[1].split(':');
    if (hm.length < 2) return new Date(str);
    return new Date(base[0] + 'T' + hm[0] + ':' + hm[1]);
  }
  const f_creacion = toDateIgnoreSeconds(row.fecha_hora);
  const f_area = toDateIgnoreSeconds(row.fecha_hora_area);
  const f_supervisor = toDateIgnoreSeconds(row.fecha_hora_supervisor);
  const f_cierre_usuario = toDateIgnoreSeconds(row.fecha_hora_cierre_usuario);
  const f_cierre_area = toDateIgnoreSeconds(row.fecha_hora_cierre_area);

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

  // Sticky header
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
    `;
    document.head.appendChild(style);
  }

  // Encabezados
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
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
    tr.style.background = idx % 2 === 0 ? '#fafbfc' : '#f0f1f3';

    // Formateador reutilizable para fechas tipo "2026-01-27T10:06:28.495Z"
    function formatearFechaISO(strFecha) {
      if (!strFecha) return '';
      let str = strFecha.replace('Z', '');
      str = str.replace(/\.(\d{3,})/, '');
      const [fecha, hora] = str.split('T');
      if (fecha && hora) {
        const [y, m, d] = fecha.split('-');
        const [hh, mm] = hora.split(':');
        return `${d}/${m}/${y}, ${hh}:${mm}`;
      }
      return strFecha;
    }

    let fechaCreacion = formatearFechaISO(row.fecha_hora);
    let fechaCierreUsuario = formatearFechaISO(row.fecha_hora_cierre_usuario);

    tr.innerHTML = `
      <td>${row.prefijo || ''}</td>
      <td>${fechaCreacion}</td>
      <td>${tiempos.espera_area}</td>
      <td>${tiempos.validacion_seg}</td>
      <td>${tiempos.fin_trabajo}</td>
      <td>${tiempos.autorizacion_cierre}</td>
      <td style="background:#f0f0f0;font-weight:bold;color:#1565c0;">
        ${tiempos.total}
      </td>
      <td>${row.total_revalidaciones ?? ''}</td>
    `;
    // Si quieres mostrar la fecha de cierre usuario en una columna, agrega aquí:
    // <td>${fechaCierreUsuario}</td>
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  // Scroll
  const wrapper = document.createElement('div');
  wrapper.style.overflowX = 'auto';
  wrapper.style.overflowY = 'auto';
  wrapper.style.maxHeight = '150px';
  wrapper.appendChild(table);

  container.appendChild(wrapper);
}

// Instancia global
window.tiemposAutorizacionTableInstance = {
  updateData: function (datos) {
    renderTablaTiemposAutorizacion(datos);
  }
};

// Inicialización
function initTablaTiemposAutorizacion() {
  fetch('/api/graficas_jefes/permisos-jefes')
    .then(r => r.json())
    .then(data => renderTablaTiemposAutorizacion(data))
    .catch(err => {
      const container = document.getElementById('type-chart-2');
      if (container) {
        container.innerHTML =
          '<div style="color:red;padding:2em;text-align:center;">Error al obtener datos.</div>';
      }
      console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', initTablaTiemposAutorizacion);
