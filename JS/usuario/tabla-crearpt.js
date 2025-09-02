// funcionesusuario.js
// Centraliza la lógica de tarjetas y tabla de permisos para el usuario

let permisosGlobal = [];
let paginaActual = 1;
const registrosPorPagina = 7;
let filtroBusqueda = '';


async function cargarTargetasDesdePermisos() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const id_departamento = usuario && usuario.id ? usuario.id : null;
        if (!id_departamento) throw new Error('No se encontró el id de departamento del usuario');
        const response = await fetch(`http://localhost:3000/api/vertablas/${id_departamento}`);
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

// --- Tabla de permisos ---
function asignarEventosVer() {
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', async function() {
            document.getElementById('modalVer').classList.add('active');
            // Obtener el id_permiso del atributo data-idpermiso
            const id_permiso = btn.getAttribute('data-idpermiso');
            console.log('ID del permiso:', id_permiso);
            try {
                // Llamar al endpoint para obtener los datos de la sección 1, 2, AST, actividades AST y participantes AST
                const response = await fetch(`http://localhost:3000/api/verformularios?id=${encodeURIComponent(id_permiso)}`);
                if (!response.ok) throw new Error('Error al obtener datos del permiso');
                const data = await response.json();
                // Mostrar los datos en consola
                console.log('Datos sección 1:', data.general);
                console.log('Datos sección 2:', data.detalles);
                console.log('Datos AST:', data.ast);
                console.log('Actividades AST:', data.actividades_ast);
                console.log('Participantes AST:', data.participantes_ast);
                mostrarInformacionGeneral(data.general);
                mostrarDetallesTecnicos(data.detalles);
                mostrarAST(data.ast);
                mostrarActividadesAST(data.actividades_ast);
                mostrarParticipantesAST(data.participantes_ast);

                // Agrega el tipo específico en la sección 2 del modal
                document.getElementById('modal-tipo-especifico').textContent =
                    data.general.tipo_permiso === 'PT para Apertura Equipo Línea'
                        ? 'Apertura'
                        : data.general.tipo_permiso === 'PT No Peligroso'
                            ? 'No Peligroso'
                            : data.general.tipo_permiso;

                if (data.general.tipo_permiso === 'PT para Apertura Equipo Línea') {
                    document.getElementById('modal-especifica').innerHTML = renderApertura(data.general);
                } else {
                    document.getElementById('modal-especifica').innerHTML = '';
                }

                // Mostrar/ocultar sección para PT No Peligroso
                if (data.general.tipo_permiso === 'PT No Peligroso') {
                    document.getElementById('modal-no-peligroso').style.display = '';
                } else {
                    document.getElementById('modal-no-peligroso').style.display = 'none';
                }

            } catch (err) {
                console.error('Error al obtener datos de la sección 1, 2, AST, actividades AST y participantes AST:', err);
            }
        });
    });
}

async function cargarPermisosTabla() {
    try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const id_departamento = usuario && usuario.id ? usuario.id : null;
        if (!id_departamento) throw new Error('No se encontró el id de departamento del usuario');
        const response = await fetch(`http://localhost:3000/api/vertablas/${id_departamento}`);
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

// Función para llenar la sección 1 del modal con los datos recibidos del backend
function mostrarInformacionGeneral(data) {
    // Asume que data tiene las propiedades: fecha, empresa, sucursal, area, solicitante, descripcion_trabajo, tipo_permiso, prefijo
    document.querySelector('#modalVer .executive-item:nth-child(1) .highlight').textContent = data.fecha || '';
    document.querySelector('#modalVer .executive-item:nth-child(2) p').textContent = data.empresa || '';
    document.querySelector('#modalVer .executive-item:nth-child(3) p').textContent = data.sucursal || '';
    document.querySelector('#modalVer .executive-item:nth-child(4) .highlight').textContent = data.area || '';
    document.querySelector('#modalVer .executive-item:nth-child(5) p').textContent = data.solicitante || '';
    document.querySelector('#modalVer .executive-item.full-width .description-box').textContent = data.descripcion_trabajo || '';
    // Actualizar departamento
    if (document.getElementById('ver-departamento')) {
        document.getElementById('ver-departamento').textContent = data.departamento || '';
    }
    // Actualizar tipo de permiso y prefijo en el header del modal
    document.getElementById('modal-tipo-permiso').textContent = data.tipo_permiso || '';
    document.getElementById('modal-prefijo').textContent = data.prefijo ? `No. ${data.prefijo}` : '';
}

// Función para llenar la sección 2 del modal con los datos técnicos
function mostrarDetallesTecnicos(detalles) {
    document.getElementById('modal-planta').textContent = detalles.planta || '';
    document.getElementById('modal-tipo-actividad').textContent = detalles.tipo_actividad || '';
    document.getElementById('modal-ot').textContent = detalles.ot || '';
    document.getElementById('modal-equipo').textContent = detalles.equipo || '';
    document.getElementById('modal-tag').textContent = detalles.tag || '';
    document.getElementById('modal-horario').textContent = detalles.horario || '';
    document.getElementById('modal-fluido').textContent = detalles.fluido || '';
    document.getElementById('modal-presion').textContent = detalles.presion || '';
    document.getElementById('modal-temperatura').textContent = detalles.temperatura || '';

        document.getElementById('modal-trabajo-area-riesgo-controlado').textContent = detalles.trabajo_area_riesgo_controlado || '';
    document.getElementById('modal-necesita-entrega-fisica').textContent = detalles.necesita_entrega_fisica || '';
    document.getElementById('modal-necesita-ppe-adicional').textContent = detalles.necesita_ppe_adicional || '';
    document.getElementById('modal-area-circundante-riesgo').textContent = detalles.area_circundante_riesgo || '';
    document.getElementById('modal-necesita-supervision').textContent = detalles.necesita_supervision || '';
    document.getElementById('modal-observaciones-analisis-previo').textContent = detalles.observaciones_analisis_previo || '';

}

// Función para llenar la sección AST (EPP, Maquinaria, Materiales)
function mostrarAST(ast) {
    // EPP
    const eppList = document.getElementById('modal-epp-list');
    eppList.innerHTML = '';
    if (ast.epp_requerido) {
        ast.epp_requerido.split(',').forEach(item => {
            if (item.trim()) {
                const li = document.createElement('li');
                li.textContent = item.trim();
                eppList.appendChild(li);
            }
        });
    }
    // Maquinaria y Herramientas
    const maquinariaList = document.getElementById('modal-maquinaria-list');
    maquinariaList.innerHTML = '';
    if (ast.maquinaria_herramientas) {
        ast.maquinaria_herramientas.split(',').forEach(item => {
            if (item.trim()) {
                const li = document.createElement('li');
                li.textContent = item.trim();
                maquinariaList.appendChild(li);
            }
        });
    }
    // Materiales y Accesorios
    const materialesList = document.getElementById('modal-materiales-list');
    materialesList.innerHTML = '';
    if (ast.material_accesorios) {
        ast.material_accesorios.split(',').forEach(item => {
            if (item.trim()) {
                const li = document.createElement('li');
                li.textContent = item.trim();
                materialesList.appendChild(li);
            }
        });
    }
}

// Función para llenar la tabla de actividades AST
function mostrarActividadesAST(actividades) {
    const tbody = document.getElementById('modal-ast-actividades-body');
    tbody.innerHTML = '';
    if (Array.isArray(actividades)) {
        actividades.forEach(act => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${act.no || ''}</td>
                <td>${act.secuencia_actividad || ''}</td>
                <td>${act.personal_ejecutor || ''}</td>
                <td>${act.peligros_potenciales || ''}</td>
                <td>${act.descripcion || ''}</td>
                <td>${act.responsable || ''}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Función para llenar la tabla de participantes AST
function mostrarParticipantesAST(participantes) {
    const tbody = document.getElementById('modal-ast-participantes-body');
    tbody.innerHTML = '';
    if (Array.isArray(participantes)) {
        participantes.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.nombre || ''}</td>
                <td><span class="role-badge">${p.funcion || ''}</span></td>
                <td>${p.credencial || ''}</td>
                <td>${p.cargo || ''}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Evento del select
document.getElementById('status-filter').addEventListener('change', function() {
    paginaActual = 1;
    mostrarPermisosFiltrados(this.value);
});

document.addEventListener('DOMContentLoaded', () => {
    cargarTargetasDesdePermisos();
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

const permisoRenderers = {
    'PT No Peligroso': renderNoPeligroso,
    'PT para Apertura Equipo Línea': renderApertura,
    // Aquí agregas más tipos en el futuro
};


function renderApertura(data) {
    return `
        <div class="executive-grid">
            <div class="executive-item"><label>Área:</label><p>${data.area ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Tipo de mantenimiento:</label><p>${data.tipo_mantenimiento ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>OT:</label><p>${data.ot_numero ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Tag:</label><p>${data.tag ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Hora inicio:</label><p>${data.hora_inicio ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Fluido:</label><p>${data.fluido ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Presión:</label><p>${data.presion ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Temperatura:</label><p>${data.temperatura ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Antecedentes:</label><p>${data.antecedentes ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Requiere herramientas especiales?</label><p>${data.requiere_herramientas_especiales ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Tipo de herramientas especiales:</label><p>${data.tipo_herramientas_especiales ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Herramientas adecuadas:</label><p>${data.herramientas_adecuadas ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Requiere verificación previa?</label><p>${data.requiere_verificacion_previa ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Requiere conocer riesgos?</label><p>${data.requiere_conocer_riesgos ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Observaciones medidas:</label><p>${data.observaciones_medidas ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Fuera de operación?</label><p>${data.fuera_operacion ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Despresurizado/purgado?</label><p>${data.despresurizado_purgado ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Necesita aislamiento?</label><p>${data.necesita_aislamiento ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Con válvulas:</label><p>${data.con_valvulas ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Con juntas ciegas:</label><p>${data.con_juntas_ciegas ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Producto entrampado:</label><p>${data.producto_entrampado ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Requiere lavado?</label><p>${data.requiere_lavado ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Requiere neutralizado?</label><p>${data.requiere_neutralizado ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Requiere vaporizado?</label><p>${data.requiere_vaporizado ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Suspender trabajos adyacentes?</label><p>${data.suspender_trabajos_adyacentes ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Acordonar área?</label><p>${data.acordonar_area ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Prueba gas tóxico/inflamable?</label><p>${data.prueba_gas_toxico_inflamable ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Equipo eléctrico desenergizado?</label><p>${data.equipo_electrico_desenergizado ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>¿Tapar purgas/drenajes?</label><p>${data.tapar_purgas_drenajes ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Protección especial recomendada:</label><p>${data.proteccion_especial_recomendada ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Protección piel/cuerpo:</label><p>${data.proteccion_piel_cuerpo ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Protección respiratoria:</label><p>${data.proteccion_respiratoria ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Protección ocular:</label><p>${data.proteccion_ocular ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Protección contraincendio:</label><p>${data.proteccion_contraincendio ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Tipo protección contraincendio:</label><p>${data.tipo_proteccion_contraincendio ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Instalación barreras:</label><p>${data.instalacion_barreras ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Observaciones riesgos:</label><p>${data.observaciones_riesgos ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>CO2 nivel:</label><p>${data.co2_nivel ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>NH3 nivel:</label><p>${data.nh3_nivel ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>Oxígeno nivel:</label><p>${data.oxigeno_nivel ?? 'Sin información'}</p></div>
            <div class="executive-item"><label>LEL nivel:</label><p>${data.lel_nivel ?? 'Sin información'}</p></div>
        </div>
    `;
}

function renderNoPeligroso(data) {
    // Si ya tienes el renderizado en mostrarDetallesTecnicos, puedes dejarlo vacío o solo retornar ''
    return '';
}

