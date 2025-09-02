// Agrega la función mostrarInformacionGeneral para evitar el ReferenceError
function mostrarInformacionGeneral(general) {
    // Ejemplo de llenado de campos generales en el modal
    document.getElementById('modal-tipo-permiso').textContent = general.tipo_permiso || '';
    document.getElementById('modal-prefijo').textContent = general.prefijo || '';
    // Agrega aquí el llenado de otros campos generales según tu estructura
}

// Lógica reutilizable para ver formularios


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

function mostrarAST(ast) {
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


// ...existing code...
export {
    mostrarDetallesTecnicos,
    mostrarAST,
    mostrarActividadesAST,
    mostrarParticipantesAST,
    mostrarInformacionGeneral,
    asignarEventosVer,
    renderApertura,
    renderNoPeligroso
};