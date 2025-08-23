// --- Tarjetas desde autorizar ---
async function cargarTargetasDesdeAutorizar() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const id_departamento = usuario && usuario.id ? usuario.id : null;
        if (!id_departamento) throw new Error('No se encontró el id de departamento del usuario');
        const response = await fetch(`http://localhost:3000/api/autorizar/${id_departamento}`);
        if (!response.ok) throw new Error('Error al consultar permisos');
        const permisos = await response.json();

        // Conteos por estatus
        let total = permisos.length;
        let porAutorizar = 0;
        let activos = 0;
        let terminados = 0;
        let noAutorizados = 0;

        permisos.forEach(item => {
            const estatus = item.estatus.toLowerCase();
            if (estatus === 'espera area' || estatus === 'espera seguridad' || estatus === 'en espera del área') {
                porAutorizar++;
            } else if (estatus === 'activo') {
                activos++;
            } else if (estatus === 'terminado') {
                terminados++;
            } else if (estatus === 'no autorizado') {
                noAutorizados++;
            }
        });

        // Actualiza las tarjetas en el HTML
        const counts = document.querySelectorAll('.card-content .count');
        counts[0].textContent = total;
        counts[1].textContent = porAutorizar;
        counts[2].textContent = activos;
        counts[3].textContent = terminados;
        counts[4].textContent = noAutorizados;
    } catch (err) {
        console.error('Error al cargar targetas desde permisos:', err);
    }
}
// funcionesusuario.js
// Centraliza la lógica de tarjetas y tabla de permisos para el usuario

let permisosGlobal = [];
let paginaActual = 1;
const registrosPorPagina = 7;
let filtroBusqueda = '';



// --- Tabla de permisos ---
function asignarEventosVer() {
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', async function() {
            document.getElementById('modalVer').classList.add('active');
            const id_permiso = btn.getAttribute('data-idpermiso');
            console.log('ID del permiso:', id_permiso);
            try {
                const response = await fetch(`http://localhost:3000/api/verformularios?id=${encodeURIComponent(id_permiso)}`);
                if (!response.ok) throw new Error('Error al obtener datos del permiso');
                const data = await response.json();
                // Aquí puedes mostrar los datos en el modal si lo necesitas
            } catch (err) {
                console.error('Error al obtener datos del permiso:', err);
            }
        });
    });
}



async function cargarPermisosTabla() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const id_departamento = usuario && usuario.id ? usuario.id : null;
        if (!id_departamento) throw new Error('No se encontró el id de departamento del usuario');
        const response = await fetch(`http://localhost:3000/api/autorizar/${id_departamento}`);
        if (!response.ok) throw new Error('Error al consultar permisos');
        permisosGlobal = await response.json();
        mostrarPermisosFiltrados('En espera del área');
    } catch (err) {
        console.error('Error al cargar permisos:', err);
    }
}



function mostrarPermisosFiltrados(filtro) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    let filtrados = permisosGlobal;

    // Filtrado por estatus
    if (filtro !== 'all') {
        filtrados = filtrados.filter(permiso => {
            const estatus = permiso.estatus.toLowerCase().trim();
            const filtroNorm = filtro.toLowerCase().trim();
            if (filtroNorm === 'continua') {
                return estatus === 'continua';
            }
            return estatus === filtroNorm;
        });
    }

    // Filtrado por folio
    if (filtroBusqueda) {
        filtrados = filtrados.filter(permiso => {
            return (permiso.prefijo || '').toLowerCase().includes(filtroBusqueda);
        });
    }

    // Paginación
    const totalPaginas = Math.ceil(filtrados.length / registrosPorPagina);
    if (paginaActual > totalPaginas) paginaActual = totalPaginas || 1;
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const paginaDatos = filtrados.slice(inicio, fin);

    paginaDatos.forEach(permiso => {
        const row = document.createElement('tr');
        let estatusNorm = permiso.estatus.toLowerCase().trim();
        let badgeClass = '';
        switch (estatusNorm) {
            case 'por autorizar': badgeClass = 'wait-area'; break;
            case 'espera area': badgeClass = 'wait-area2'; break;
            case 'en espera del área': badgeClass = 'wait-area3'; break;
            case 'activo': badgeClass = 'active'; break;
            case 'terminado': badgeClass = 'completed'; break;
            case 'completed': badgeClass = 'completed2'; break;
            case 'cancelado': badgeClass = 'canceled'; break;
            case 'canceled': badgeClass = 'canceled2'; break;
            case 'continua': badgeClass = 'continua'; break;
            case 'espera seguridad': badgeClass = 'wait-security'; break;
            case 'no autorizado': badgeClass = 'wait-security2'; break;
            case 'wait-security': badgeClass = 'wait-security3'; break;
            default: badgeClass = '';
        }
        row.innerHTML = `
            <td>${permiso.prefijo}</td>
            <td>${permiso.tipo_permiso}</td>
            <td>${permiso.descripcion}</td>
            <td>${permiso.area}</td>
            <td>${permiso.solicitante}</td>
            <td>${permiso.fecha_hora}</td>
            <td><span class="status-badge${badgeClass ? ' ' + badgeClass : ''}">${permiso.estatus}</span></td>
            <td>
                <button class="action-btn view" data-idpermiso="${permiso.id_permiso}"><i class="ri-eye-line"></i></button>
                <button class="action-btn print"><i class="ri-printer-line"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    const recordsCount = document.getElementById('records-count');
    if (recordsCount) {
        let texto = filtrados.length;
        recordsCount.parentElement.innerHTML = `<span id="records-count">${texto}</span>`;
    }
    asignarEventosVer();
    actualizarPaginacion(totalPaginas, filtro);
}


function actualizarPaginacion(totalPaginas, filtro) {
    const pagContainer = document.querySelector('.pagination');
    if (!pagContainer) return;
    pagContainer.innerHTML = '';
    // Botón anterior
    const btnPrev = document.createElement('button');
    btnPrev.className = 'pagination-btn';
    btnPrev.innerHTML = '<i class="ri-arrow-left-s-line"></i>';
    btnPrev.disabled = paginaActual === 1;
    btnPrev.onclick = () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarPermisosFiltrados(document.getElementById('status-filter').value);
        }
    };
    pagContainer.appendChild(btnPrev);
    // Botones de página
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.className = 'pagination-btn' + (i === paginaActual ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => {
            paginaActual = i;
            mostrarPermisosFiltrados(document.getElementById('status-filter').value);
        };
        pagContainer.appendChild(btn);
    }
    // Botón siguiente
    const btnNext = document.createElement('button');
    btnNext.className = 'pagination-btn';
    btnNext.innerHTML = '<i class="ri-arrow-right-s-line"></i>';
    btnNext.disabled = paginaActual === totalPaginas || totalPaginas === 0;
    btnNext.onclick = () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarPermisosFiltrados(document.getElementById('status-filter').value);
        }
    };
    pagContainer.appendChild(btnNext);
}

// Evento del select
document.getElementById('status-filter').addEventListener('change', function() {
    paginaActual = 1;
    mostrarPermisosFiltrados(this.value);
});



document.addEventListener('DOMContentLoaded', () => {
    cargarTargetasDesdeAutorizar();
    cargarPermisosTabla();
    // Búsqueda por folio compatible con paginación
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filtroBusqueda = searchInput.value.trim().toLowerCase();
            paginaActual = 1;
            mostrarPermisosFiltrados(document.getElementById('status-filter').value);
        });
    }
});

