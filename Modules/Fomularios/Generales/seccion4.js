document.addEventListener('DOMContentLoaded', () => {
    // ==============================
    // 0. Configurar botón de cierre del modal
    // ==============================
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function () {
            window.location.href = '/Modules/Usuario/CrearPT.html';
        });
    }

    // ==============================
    // 1. Agregar y eliminar actividades con re-numeración
    // ==============================
    const addActivityBtn = document.getElementById('add-activity');
    const astActivitiesContainer = document.querySelector('.ast-activities');

    // Función para re-numerar actividades y actualizar los atributos name
    function renumerarActividades() {
        const activities = astActivitiesContainer.querySelectorAll('.ast-activity');
        activities.forEach((activity, idx) => {
            const newIndex = idx + 1;
            activity.setAttribute('data-index', newIndex);
            // Columna No.: número automático
            const numberDiv = activity.querySelector('.ast-activity-number');
            if (numberDiv) {
                numberDiv.textContent = newIndex;
            }
            // Actualiza los names de los campos
            const activityTextarea = activity.querySelector('textarea[name^="ast-activity-"]');
            if (activityTextarea) activityTextarea.name = `ast-activity-${newIndex}`;
            const selectPersonnel = activity.querySelector('select[name^="ast-personnel-"]');
            if (selectPersonnel) selectPersonnel.name = `ast-personnel-${newIndex}`;
            const textareaHazards = activity.querySelector('textarea[name^="ast-hazards-"]');
            if (textareaHazards) textareaHazards.name = `ast-hazards-${newIndex}`;
            const textareaPreventions = activity.querySelector('textarea[name^="ast-preventions-"]');
            if (textareaPreventions) textareaPreventions.name = `ast-preventions-${newIndex}`;
            const selectResponsible = activity.querySelector('select[name^="ast-responsible-"]');
            if (selectResponsible) selectResponsible.name = `ast-responsible-${newIndex}`;
        });
    }

        // Actualizar el div de secuencia en tiempo real
        if (astActivitiesContainer) {
            // Ya no es necesario actualizar el número con el texto, solo renumerar si se elimina o agrega
        }

    if (addActivityBtn && astActivitiesContainer) {
        addActivityBtn.addEventListener('click', async function () {
            const activityCount = document.querySelectorAll('.ast-activity').length;
            const newIndex = activityCount + 1;

            if (newIndex > 10) {
                alert('Máximo 10 actividades permitidas');
                return;
            }

            // Obtener participantes filtrados por estatus desde el backend
            let participantes = [];
            try {
                const idEstatus = sessionStorage.getItem('id_estatus');
                const response = await fetch(`http://localhost:3000/api/participantes?id_estatus=${idEstatus}`);
                participantes = await response.json();
            } catch (error) {
                console.error('Error al obtener participantes:', error);
            }

            // Crear opciones
            let options = '<option value="">-- Seleccione --</option>';
            participantes.forEach(part => {
                if (Number.isInteger(part.id_ast_participan)) {
                    options += `<option value="${part.id_ast_participan}">${part.nombre}</option>`;
                }
            });

            // Crear actividad
            const newActivity = document.createElement('div');
            newActivity.className = 'ast-activity';
            newActivity.setAttribute('data-index', newIndex);
            newActivity.innerHTML = `
                <div class="ast-activity-number">${newIndex}</div>
                <div class="ast-activity-field">
                    <textarea name="ast-activity-${newIndex}" rows="2" required></textarea>
                </div>
                <div class="ast-activity-field">
                    <select name="ast-personnel-${newIndex}" required>
                        ${options}
                    </select>
                </div>
                <div class="ast-activity-field">
                    <textarea name="ast-hazards-${newIndex}" rows="2" required></textarea>
                </div>
                <div class="ast-activity-field">
                    <textarea name="ast-preventions-${newIndex}" rows="2" required></textarea>
                </div>
                <div class="ast-activity-field">
                    <select name="ast-responsible-${newIndex}" required>
                        ${options}
                    </select>
                </div>
                <div class="ast-activities-actions">
                        <button type="button" class="action-btn remove-participant" title="Eliminar">
                                    <i class="ri-delete-bin-line"></i>
                        </button>
                </div>
            `;
            astActivitiesContainer.appendChild(newActivity);
            // No es necesario renumerar aquí, solo al eliminar
        });

        // Delegación de eventos para eliminar actividades y renumerar
        astActivitiesContainer.addEventListener('click', function (event) {
            if (event.target.closest('.remove-participant')) {
                const activityDiv = event.target.closest('.ast-activity');
                if (activityDiv) {
                    activityDiv.remove();
                    renumerarActividades();
                }
            }
        });
    }

    if (astActivitiesContainer) {
        astActivitiesContainer.addEventListener('click', function (event) {
            if (event.target.closest('.remove-participant')) {
                const activityDiv = event.target.closest('.ast-activity');
                if (activityDiv) activityDiv.remove();
            }
        });
    }

    // ==============================
    // 2. Manejar envío del formulario principal
    // ==============================
    const permitForm = document.getElementById('complete-permit-form');
    if (permitForm) {
        permitForm.addEventListener('submit', async function (e) {
            // Validar que plant_value no esté vacío antes de continuar
            let plantValue = sessionStorage.getItem('plant_value');
            // Si no está en sessionStorage, intenta leer del input hidden
            if (!plantValue || isNaN(parseInt(plantValue, 10))) {
                const plantIdHidden = document.getElementById('plant-id-hidden');
                if (plantIdHidden && plantIdHidden.value && !isNaN(parseInt(plantIdHidden.value, 10))) {
                    plantValue = plantIdHidden.value;
                    sessionStorage.setItem('plant_value', plantValue); // Sincroniza por si acaso
                }
            }
            if (!plantValue || isNaN(parseInt(plantValue, 10))) {
                // Mostrar advertencia visual en el input de área si existe
                const plantInput = document.getElementById('plant');
                let warning = document.getElementById('plant-warning');
                if (plantInput && !warning) {
                    warning = document.createElement('div');
                    warning.id = 'plant-warning';
                    warning.style.color = '#d9534f';
                    warning.style.fontSize = '0.95em';
                    warning.style.marginTop = '4px';
                    warning.textContent = 'Debe seleccionar un área válida de la lista antes de continuar.';
                    plantInput.parentNode.insertBefore(warning, plantInput.nextSibling);
                }
                alert('Debe seleccionar un área válida de la lista antes de continuar.');
                e.preventDefault();
                return;
            }
            // Log para ver el valor de plant_value justo antes de leerlo
            console.log('[DEBUG] (submit) sessionStorage.plant_value:', sessionStorage.getItem('plant_value'));
            e.preventDefault();

            const submitBtn = permitForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Procesando...';

            try {
                // === Validar sección 4
                const section4 = document.querySelector('.form-section[data-section="4"]');
                const requiredFields = section4.querySelectorAll('[required]');
                let allFilled = true;

                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = '#ff4444';
                        allFilled = false;
                        field.addEventListener('input', function () {
                            this.style.borderColor = '';
                        }, { once: true });
                    }
                });

                if (!allFilled) {
                    const modal = document.getElementById('confirmation-modal');
                    if (modal) {
                        modal.querySelector('h3').textContent = 'Campos requeridos faltantes';
                        modal.querySelector('p').textContent = 'Por favor completa todos los campos obligatorios antes de guardar el permiso.';
                        modal.classList.add('active');
                    } else {
                        alert('Por favor completa todos los campos obligatorios antes de guardar el permiso.');
                    }
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    return;
                }



                // Recuperar y validar los ids
                const id_area = parseInt(sessionStorage.getItem('plant_value'), 10);
                // Obtener id del departamento del usuario logueado
                let id_departamento = 1;
                const usuario = JSON.parse(localStorage.getItem('usuario'));
                if (usuario && usuario.id) {
                    id_departamento = Number(usuario.id);
                }
                const id_sucursal = parseInt(sessionStorage.getItem('id_sucursal'), 10);
                const id_tipo_permiso = Number(sessionStorage.getItem('id_tipo_permiso'));
                console.log('[DEBUG] id_tipo_permiso:', id_tipo_permiso);
                const id_estatus = parseInt(sessionStorage.getItem('id_estatus'), 10);
                const id_ast = parseInt(sessionStorage.getItem('id_ast'), 10) || 1;

                // Log para depuración
                console.log('[DEBUG] id_area:', id_area, 'plant_value:', sessionStorage.getItem('plant_value'));
                console.log('[DEBUG] id_departamento:', id_departamento);
                console.log('[DEBUG] id_sucursal:', id_sucursal, 'id_sucursal_raw:', sessionStorage.getItem('id_sucursal'));
                console.log('[DEBUG] id_tipo_permiso:', id_tipo_permiso);
                console.log('[DEBUG] id_estatus:', id_estatus, 'id_estatus_raw:', sessionStorage.getItem('id_estatus'));
                console.log('[DEBUG] id_ast:', id_ast, 'id_ast_raw:', sessionStorage.getItem('id_ast'));

                // Validar que todos los ids sean números válidos
                if ([id_area, id_departamento, id_sucursal, id_tipo_permiso, id_estatus, id_ast].some(v => isNaN(v) || typeof v !== 'number')) {
                    alert('Error: Debe seleccionar correctamente todas las listas (área, sucursal, estatus, etc).');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    return;
                }

                // 1. Insertar permiso
                const permisoResponse = await fetch('http://localhost:3000/api/permisos-trabajo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_area, id_departamento, id_sucursal, id_tipo_permiso, id_estatus, id_ast })
                });
                const permisoResult = await permisoResponse.json();
                if (!permisoResponse.ok || !permisoResult.success) throw new Error(permisoResult.error || 'Error al guardar permiso de trabajo');

                const id_permiso = permisoResult.data.id_permiso || permisoResult.data.id;

                let exito = false;

                try {
                    // 1. Insertar permiso de trabajo (esto siempre)
                    const permisoResult = await insertarPermisoTrabajo();
                    if (permisoResult.success) exito = true;

                    // Obtener el tipo de formulario desde sessionStorage
                    const tipoFormulario = Number(sessionStorage.getItem('id_tipo_permiso'));
                    console.log('[DEBUG] tipoFormulario:', tipoFormulario);

                    // Según el tipo de formulario, insertar en la tabla correspondiente
                    if (tipoFormulario === 1) {
                        // Insertar en pt_no_peligroso
                        const noPeligrosoResult = await insertarPtNoPeligroso();
                        if (noPeligrosoResult.success) exito = true;
                    } else if (tipoFormulario === 2) {
                        // Insertar en pt_Apertura
                        const aperturaResult = await insertarPtApertura();
                        if (aperturaResult.success) exito = true;
                    }

                    if (exito) {
                        mostrarMensajeExito();
                    } else {
                        mostrarMensajeError();
                    }
                } catch (error) {
                    mostrarMensajeError();
                }

                // ==============================
                // INICIO BLOQUE: IF para tipoFormulario
                // Aquí inicia el condicional para el tipo de formulario
                // ==============================
                // Obtener el tipo de formulario desde sessionStorage
                const tipoFormulario = Number(sessionStorage.getItem('id_tipo_permiso'));

                // Imprimir el valor antes de entrar al if
                console.log('[DEBUG] tipoFormulario:', tipoFormulario);

                // Cambiar según el formulario que se esté usando
                if (tipoFormulario === 1) {
                    // ==============================
                    // INICIO BLOQUE: Insertar PT no peligroso
                    // Este bloque inicia la lógica para insertar el permiso de trabajo no peligroso
                    // ==============================

                    // 2. Insertar PT no peligroso
                    const nombre_solicitante = document.getElementById('applicant')?.value || null;
                    const descripcion_trabajo = document.getElementById('work-description')?.value || null;
                    let tipo_mantenimiento = document.getElementById('maintenance-type')?.value || null;
                    // Si el tipo es OTRO, tomar el valor del input adicional
                    if (tipo_mantenimiento === 'OTRO') {
                        const otroInput = document.getElementById('other-maintenance');
                        if (otroInput && otroInput.value.trim()) {
                            tipo_mantenimiento = otroInput.value.trim();
                        }
                    }
                    const ot_no = document.getElementById('work-order')?.value || null;
                    const equipo_intervencion = document.getElementById('equipment')?.value || null;
                    const fecha = document.getElementById('permit-date')?.value || '2025-08-19';
                    const hora = document.getElementById('start-time')?.value || '08:00';
                    const hora_inicio = `${fecha} ${hora}`;
                    const tag = document.getElementById('tag')?.value || null;
                    const fluido = document.getElementById('fluid')?.value || null;
                    const presion = document.getElementById('pressure')?.value || null;
                    const temperatura = document.getElementById('temperature')?.value || null;
                    const empresa = document.getElementById('company')?.value || null;

                    // Mostrar en consola los valores que se van a enviar
                    console.log('[DEBUG] Datos a enviar PT No Peligroso:', {
                        id_permiso,
                        nombre_solicitante,
                        descripcion_trabajo,
                        tipo_mantenimiento,
                        ot_no,
                        equipo_intervencion,
                        hora_inicio,
                        tag,
                        fluido,
                        presion,
                        temperatura,
                        empresa,
                        // Nuevos campos
                        trabajo_area_riesgo_controlado: document.querySelector('input[name="risk-area"]:checked')?.value || null,
                        necesita_entrega_fisica: document.querySelector('input[name="physical-delivery"]:checked')?.value || null,
                        necesita_ppe_adicional: document.querySelector('input[name="additional-ppe"]:checked')?.value || null,
                        area_circundante_riesgo: document.querySelector('input[name="surrounding-risk"]:checked')?.value || null,
                        necesita_supervision: document.querySelector('input[name="supervision-needed"]:checked')?.value || null,
                        observaciones_analisis_previo: document.getElementById('pre-work-observations')?.value || null
                    });

                    const ptResponse = await fetch('http://localhost:3000/api/pt-no-peligroso', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id_permiso,
                            nombre_solicitante,
                            descripcion_trabajo,
                            tipo_mantenimiento,
                            ot_no,
                            equipo_intervencion,
                            hora_inicio,
                            tag,
                            fluido,
                            presion,
                            temperatura,
                            empresa,
                            trabajo_area_riesgo_controlado: document.querySelector('input[name="risk-area"]:checked')?.value || null,
                            necesita_entrega_fisica: document.querySelector('input[name="physical-delivery"]:checked')?.value || null,
                            necesita_ppe_adicional: document.querySelector('input[name="additional-ppe"]:checked')?.value || null,
                            area_circundante_riesgo: document.querySelector('input[name="surrounding-risk"]:checked')?.value || null,
                            necesita_supervision: document.querySelector('input[name="supervision-needed"]:checked')?.value || null,
                            observaciones_analisis_previo: document.getElementById('pre-work-observations')?.value || null
                        })
                    });
                    const ptResult = await ptResponse.json();
                    if (!ptResponse.ok || !ptResult.success) throw new Error(ptResult.error || 'Error al guardar PT No Peligroso');

                    // ==============================
                    // FIN BLOQUE: Insertar PT no peligroso
                    // Este bloque termina la lógica para insertar el permiso de trabajo no peligroso
                    // ==============================
                } else if (tipoFormulario === 2) {
                    // ==============================
                    // INICIO BLOQUE: Insertar otro tipo de PT (PT Apertura)
                    // Aquí inicia la lógica para insertar el permiso de apertura de equipo o línea
                    // ==============================

                    // Obtener valores del formulario PT2.html
const tipo_mantenimiento = document.querySelector('input[name="maintenance-type"]:checked')?.value || null;
const otro_tipo_mantenimiento = document.getElementById('other-maintenance-type')?.value || null;
const ot_numero = document.getElementById('work-order')?.value || null;
const tag = document.getElementById('tag')?.value || null;
const fecha = document.getElementById('permit-date')?.value || '';
const hora = document.getElementById('start-time')?.value || '';
const hora_inicio = `${fecha} ${hora}`;
const tiene_equipo_intervenir = textoABoolean(document.querySelector('input[name="has-equipment"]:checked')?.value || null);
const descripcion_equipo = document.getElementById('equipment-description')?.value || null;
const fluido = document.getElementById('fluid')?.value || null;
const presion = document.getElementById('pressure')?.value || null;
const temperatura = document.getElementById('temperature')?.value || null;
const antecedentes = document.getElementById('background')?.value || null;

// Medidas para administrar los riesgos
const requiere_herramientas_especiales = textoABoolean(document.querySelector('input[name="special-tools"]:checked')?.value || null);
const tipo_herramientas_especiales = document.getElementById('special-tools-type')?.value || null;
const herramientas_adecuadas = textoABoolean(document.querySelector('input[name="adequate-tools"]:checked')?.value || null);
const requiere_verificacion_previa = textoABoolean(document.querySelector('input[name="pre-verification"]:checked')?.value || null);
const requiere_conocer_riesgos = textoABoolean(document.querySelector('input[name="risk-knowledge"]:checked')?.value || null);
const observaciones_medidas = document.getElementById('final-observations')?.value || null;

// Requisitos para efectuar el trabajo
const fuera_operacion = textoABoolean(document.querySelector('input[name="out-of-operation"]:checked')?.value || null);
const despresurizado_purgado = textoABoolean(document.querySelector('input[name="depressurized"]:checked')?.value || null);
const necesita_aislamiento = textoABoolean(document.querySelector('input[name="isolated"]:checked')?.value || null);
const con_valvulas = textoABoolean(document.querySelector('input[name="with-valves"]:checked')?.value || null);
const con_juntas_ciegas = textoABoolean(document.querySelector('input[name="with-blinds"]:checked')?.value || null);
const producto_entrampado = textoABoolean(document.querySelector('input[name="trapped-product"]:checked')?.value || null);
const requiere_lavado = textoABoolean(document.querySelector('input[name="requires-washing"]:checked')?.value || null);
const requiere_neutralizado = textoABoolean(document.querySelector('input[name="requires-neutralization"]:checked')?.value || null);
const requiere_vaporizado = textoABoolean(document.querySelector('input[name="requires-steaming"]:checked')?.value || null);
const suspender_trabajos_adyacentes = textoABoolean(document.querySelector('input[name="adjacent-work-suspended"]:checked')?.value || null);
const acordonar_area = textoABoolean(document.querySelector('input[name="area-cordoned"]:checked')?.value || null);
const prueba_gas_toxico_inflamable = textoABoolean(document.querySelector('input[name="gas-test-required"]:checked')?.value || null);
const equipo_electrico_desenergizado = textoABoolean(document.querySelector('input[name="de-energized"]:checked')?.value || null);
const tapar_purgas_drenajes = textoABoolean(document.querySelector('input[name="drains-covered"]:checked')?.value || null);

// Requisitos para administrar los riesgos
const proteccion_especial_recomendada = textoABoolean(document.querySelector('input[name="special-protection"]:checked')?.value || null);
const proteccion_piel_cuerpo = textoABoolean(document.querySelector('input[name="skin-protection"]:checked')?.value || null);
const proteccion_respiratoria = textoABoolean(document.querySelector('input[name="respiratory-protection"]:checked')?.value || null);
const proteccion_ocular = textoABoolean(document.querySelector('input[name="eye-protection"]:checked')?.value || null);
const proteccion_contraincendio = textoABoolean(document.querySelector('input[name="fire-protection"]:checked')?.value || null);
const tipo_proteccion_contraincendio = document.getElementById('fire-protection-type')?.value || null;
const instalacion_barreras = textoABoolean(document.querySelector('input[name="barriers-required"]:checked')?.value || null);
const observaciones_riesgos = document.getElementById('observations')?.value || null;

// Registro de pruebas requeridas
const co2_nivel = document.getElementById('co2-level')?.value || null;
const nh3_nivel = document.getElementById('nh3-level')?.value || null;
const oxigeno_nivel = document.getElementById('oxygen-level')?.value || null;
const lel_nivel = document.getElementById('lel-level')?.value || null;

// Construir el objeto de datos para enviar
                    const datosApertura = {
                        id_permiso,
                        tipo_mantenimiento,
                        otro_tipo_mantenimiento,
                        ot_numero,
                        tag,
                        hora_inicio,
                        tiene_equipo_intervenir,
                        descripcion_equipo,
                        fluido,
                        presion,
                        temperatura,
                        antecedentes,
                        requiere_herramientas_especiales,
                        tipo_herramientas_especiales,
                        herramientas_adecuadas,
                        requiere_verificacion_previa,
                        requiere_conocer_riesgos,
                        observaciones_medidas,
                        fuera_operacion,
                        despresurizado_purgado,
                        necesita_aislamiento,
                        con_valvulas,
                        con_juntas_ciegas,
                        producto_entrampado,
                        requiere_lavado,
                        requiere_neutralizado,
                        requiere_vaporizado,
                        suspender_trabajos_adyacentes,
                        acordonar_area,
                        prueba_gas_toxico_inflamable,
                        equipo_electrico_desenergizado,
                        tapar_purgas_drenajes,
                        proteccion_especial_recomendada,
                        proteccion_piel_cuerpo,
                        proteccion_respiratoria,
                        proteccion_ocular,
                        proteccion_contraincendio,
                        tipo_proteccion_contraincendio,
                        instalacion_barreras,
                        observaciones_riesgos,
                        co2_nivel,
                        nh3_nivel,
                        oxigeno_nivel,
                        lel_nivel
                    };

                    // Enviar los datos al backend
                    const aperturaResponse = await fetch('http://localhost:3000/api/pt-apertura', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(datosApertura)
                    });
                    const aperturaResult = await aperturaResponse.json();
                    if (!aperturaResponse.ok || !aperturaResult.success) throw new Error(aperturaResult.error || 'Error al guardar PT Apertura');

                    // ==============================
                    // FIN BLOQUE: Insertar otro tipo de PT
                    // Aquí termina la lógica para otro tipo de permiso de trabajo
                    // ==============================
                }
                // ==============================
                // FIN BLOQUE: IF para tipoFormulario
                // Aquí termina el condicional para el tipo de formulario
                // ==============================













                // 3. Insertar actividades AST
                const astActivities = [];
                let validAst = true;

                document.querySelectorAll('.ast-activity').forEach((row, index) => {
                    // Guardar el texto de la actividad como 'secuencia'
                    const secuencia = row.querySelector('textarea[name^="ast-activity-"]').value.trim();
                    const personal_ejecutor = row.querySelector('select[name^="ast-personnel-"]').value;
                    const peligros_potenciales = row.querySelector('textarea[name^="ast-hazards-"]').value.trim();
                    const acciones_preventivas = row.querySelector('textarea[name^="ast-preventions-"]').value.trim();
                    const responsable = row.querySelector('select[name^="ast-responsible-"]').value;

                    if (!secuencia || !personal_ejecutor || !peligros_potenciales || !acciones_preventivas || !responsable) {
                        validAst = false;
                    }

                    astActivities.push({ id_ast, secuencia, personal_ejecutor, peligros_potenciales, acciones_preventivas, responsable });
                });

                if (!validAst) {
                    alert('Por favor completa todos los campos obligatorios de las actividades AST antes de guardar.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    return;
                }

                const responseAST = await fetch('http://localhost:3000/api/ast-actividades', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ actividades: astActivities })
                });
                const resultAST = await responseAST.json();
                if (!responseAST.ok || !resultAST.success) throw new Error(resultAST.error || 'Error al guardar actividades AST');

                sessionStorage.setItem('permisoCompletoInserted', 'true');

                // Mostrar modal de éxito
                const modal = document.getElementById('confirmation-modal');
                if (modal) {
                    modal.querySelector('h3').textContent = 'Permiso creado exitosamente';
                    const permitNumber = `GSI-PT-N${id_permiso}`;
                    window.permitNumber = permitNumber;
                    const permitText = `El permiso de trabajo con AST ha sido registrado en el sistema con el número: <strong id="generated-permit">${permitNumber}</strong>`;
                    modal.querySelector('p').innerHTML = permitText;
                    modal.classList.add('active');
                        // Llamar a n8nFormHandler para enviar los datos a n8n
                        if (typeof n8nFormHandler === 'function') {
                            try {
                                await n8nFormHandler();
                            } catch (err) {
                                console.error('Error al enviar datos a n8n:', err);
                            }
                        }
                }

            } catch (error) {
                console.error('Error:', error);
                const modal = document.getElementById('confirmation-modal');
                if (modal) {
                    modal.querySelector('h3').textContent = 'Error al enviar';
                    modal.querySelector('p').textContent = 'Error al procesar la solicitud: ' + error.message;
                    modal.classList.add('active');
                } else {
                    alert('Error al procesar la solicitud: ' + error.message);
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }
        });
    }

    // ==============================
    // 3. Función simulada para compatibilidad
    // ==============================
    window.handleN8NFormSubmission = async function () {
        console.log('Modo de prueba: No se está usando n8n');
        return true;
    };

    // ==============================
    // 4. Imprimir en consola el nombre seleccionado en los selects AST
    // ==============================
    function imprimirNombreSeleccionado(event) {
        const select = event.target;
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.value) {
            console.log(`Seleccionado en ${select.name}: ${selectedOption.textContent}`);
        }
    }

    document.addEventListener('change', function (event) {
        if (event.target.matches('select[name^="ast-personnel-"]') || event.target.matches('select[name^="ast-responsible-"]')) {
            imprimirNombreSeleccionado(event);
        }
    });
});

// ==============================
// 5. Poblar selects de participantes dinámicamente
// ==============================
async function poblarSelectParticipantes() {
    const idEstatus = sessionStorage.getItem('id_estatus');
    if (!idEstatus || idEstatus === 'undefined' || idEstatus === '') {
        console.warn('id_estatus no está definido o es inválido, no se poblan los selects.');
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/participantes?id_estatus=${idEstatus}`);
        const participantes = await response.json();

        console.log('[DEBUG] id_estatus enviado:', idEstatus);
        console.log('[DEBUG] URL:', `http://localhost:3000/api/participantes?id_estatus=${idEstatus}`);
        console.log('[DEBUG] participantes recibidos:', participantes);

        if (!Array.isArray(participantes)) {
            console.error('La respuesta de participantes no es un array:', participantes);
            return;
        }

        const selectsPersonal = document.querySelectorAll('select[name^="ast-personnel-"]');
        selectsPersonal.forEach(select => {
            select.innerHTML = '<option value="">-- Seleccione --</option>';
            participantes.forEach(part => {
                const option = document.createElement('option');
                option.value = part.id_ast_participan;
                option.textContent = part.nombre;
                select.appendChild(option);
            });
        });

        const selectsResponsable = document.querySelectorAll('select[name^="ast-responsible-"]');
        selectsResponsable.forEach(select => {
            select.innerHTML = '<option value="">-- Seleccione --</option>';
            participantes.forEach(part => {
                const option = document.createElement('option');
                option.value = part.id_ast_participan;
                option.textContent = part.nombre;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Error al poblar participantes:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    poblarSelectParticipantes();
    const btnSaveParticipants = document.getElementById('btn-save-participants');
    if (btnSaveParticipants) {
        btnSaveParticipants.addEventListener('click', function () {
            setTimeout(() => {
                poblarSelectParticipantes();
            }, 200);
        });
    }
});

// Debug idAst
const idAst = sessionStorage.getItem('id_ast');
console.log('[DEBUG] idAst leído en seccion4:', idAst);

// ==============================
// Rutas del servidor (simuladas para este contexto)
// ==============================
const express = require('express');
const router = express.Router();
const pool = require('./dbPool'); // Suponiendo que este es el archivo donde está configurada la conexión a la base de datos

// Obtener participantes
router.get('/api/participantes', async (req, res) => {
    const id_estatus = parseInt(req.query.id_estatus, 10); // Asegura que sea entero
    let query = 'SELECT * FROM ast_participan';
    let params = [];
    if (id_estatus) {
        query += ' WHERE id_estatus = $1';
        params = [id_estatus];
    }
    console.log('[DEBUG] Query ejecutada:', query, params);
    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

// ==============================
// Nueva ruta para insertar PT No Peligroso
// ==============================
router.post('/api/pt-no-peligroso', async (req, res) => {
    const { id_permiso, nombre_solicitante, descripcion_trabajo, tipo_mantenimiento, ot_no, equipo_intervencion, hora_inicio, tag, fluido, presion, temperatura, empresa } = req.body;

    // Validar campos obligatorios
    if (!id_permiso || !nombre_solicitante || !descripcion_trabajo || !tipo_mantenimiento || !hora_inicio || !empresa) {
        return res.status(400).json({
            success: false,
            error: 'Faltan campos obligatorios para pt_no_peligroso'
        });
    }

    const query = `
        INSERT INTO pt_no_peligroso (id_permiso, nombre_solicitante, descripcion_trabajo, tipo_mantenimiento, ot_no, equipo_intervencion, hora_inicio, tag, fluido, presion, temperatura, empresa)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;
    `;
    const values = [id_permiso, nombre_solicitante, descripcion_trabajo, tipo_mantenimiento, ot_no, equipo_intervencion, hora_inicio, tag, fluido, presion, temperatura, empresa];

    try {
        const result = await pool.query(query, values);
        const newEntry = result.rows[0];
        res.status(201).json({
            success: true,
            data: newEntry
        });
    } catch (error) {
        console.error('Error al insertar PT No Peligroso:', error);
        res.status(500).json({
            success: false,
            error: 'Error al insertar PT No Peligroso'
        });
    }
});

// ==============================
// Nueva ruta para insertar PT Apertura
// ==============================
router.post('/api/pt-apertura', async (req, res) => {
    const { id_permiso, tipo_mantenimiento, otro_tipo_mantenimiento, ot_numero, tag, hora_inicio, tiene_equipo_intervenir, descripcion_equipo, fluido, presion, temperatura, antecedentes, requiere_herramientas_especiales, tipo_herramientas_especiales, herramientas_adecuadas, requiere_verificacion_previa, requiere_conocer_riesgos, observaciones_medidas, fuera_operacion, despresurizado_purgado, necesita_aislamiento, con_valvulas, con_juntas_ciegas, producto_entrampado, requiere_lavado, requiere_neutralizado, requiere_vaporizado, suspender_trabajos_adyacentes, acordonar_area, prueba_gas_toxico_inflamable, equipo_electrico_desenergizado, tapar_purgas_drenajes, proteccion_especial_recomendada, proteccion_piel_cuerpo, proteccion_respiratoria, proteccion_ocular, proteccion_contraincendio, tipo_proteccion_contraincendio, instalacion_barreras, observaciones_riesgos, co2_nivel, nh3_nivel, oxigeno_nivel, lel_nivel } = req.body;

    // Validar campos obligatorios
    if (!id_permiso || !tipo_mantenimiento || !hora_inicio) {
        return res.status(400).json({
            success: false,
            error: 'Faltan campos obligatorios para pt_apertura'
        });
    }

    const query = `
        INSERT INTO pt_apertura (id_permiso, tipo_mantenimiento, otro_tipo_mantenimiento, ot_numero, tag, hora_inicio, tiene_equipo_intervenir, descripcion_equipo, fluido, presion, temperatura, antecedentes, requiere_herramientas_especiales, tipo_herramientas_especiales, herramientas_adecuadas, requiere_verificacion_previa, requiere_conocer_riesgos, observaciones_medidas, fuera_operacion, despresurizado_purgado, necesita_aislamiento, con_valvulas, con_juntas_ciegas, producto_entrampado, requiere_lavado, requiere_neutralizado, requiere_vaporizado, suspender_trabajos_adyacentes, acordonar_area, prueba_gas_toxico_inflamable, equipo_electrico_desenergizado, tapar_purgas_drenajes, proteccion_especial_recomendada, proteccion_piel_cuerpo, proteccion_respiratoria, proteccion_ocular, proteccion_contraincendio, tipo_proteccion_contraincendio, instalacion_barreras, observaciones_riesgos, co2_nivel, nh3_nivel, oxigeno_nivel, lel_nivel)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91, $92, $93, $94, $95, $96, $97, $98, $99, $100, $101, $102, $103, $104, $105, $106, $107, $108, $109, $110, $111, $112, $113, $114, $115, $116, $117, $118, $119, $120, $121, $122, $123, $124, $125, $126, $127, $128, $129, $130, $131, $132, $133, $134, $135, $136, $137, $138, $139, $140, $141, $142, $143, $144, $145, $146, $147, $148, $149, $150, $151, $152, $153, $154, $155, $156, $157, $158, $159, $160, $161, $162, $163, $164, $165, $166, $167, $168, $169, $170, $171, $172, $173, $174, $175, $176, $177, $178, $179, $180, $181, $182, $183, $184, $185, $186, $187, $188, $189, $190, $191, $192, $193, $194, $195, $196, $197, $198, $199, $200, $201, $202, $203, $204, $205, $206, $207, $208, $209, $210, $211, $212, $213, $214, $215, $216, $217, $218, $219, $220, $221, $222, $223, $224, $225, $226, $227, $228, $229, $230, $231, $232, $233, $234, $235, $236, $237, $238, $239, $240, $241, $242, $243, $244, $245, $246, $247, $248, $249, $250, $251, $252, $253, $254, $255, $256, $257, $258, $259, $260, $261, $262, $263, $264, $265, $266, $267, $268, $269, $270, $271, $272, $273, $274, $275, $276, $277, $278, $279, $280, $281, $282, $283, $284, $285, $286, $287, $288, $289, $290, $291, $292, $293, $294, $295, $296, $297, $298, $299, $300, $301, $302, $303, $304, $305, $306, $307, $308, $309, $310, $311, $312, $313, $314, $315, $316, $317, $318, $319, $320, $321, $322, $323, $324, $325, $326, $327, $328, $329, $330, $331, $332, $333, $334, $335, $336, $337, $338, $339, $340, $341, $342, $343, $344, $345, $346, $347, $348, $349, $350, $351, $352, $353, $354, $355, $356, $357, $358, $359, $360, $361, $362, $363, $364, $365, $366, $367, $368, $369, $370, $371, $372, $373, $374, $375, $376, $377, $378, $379, $380, $381, $382, $383, $384, $385, $386, $387, $388, $389, $390, $391, $392, $393, $394, $395, $396, $397, $398, $399, $400, $401, $402, $403, $404, $405, $406, $407, $408, $409, $410, $411, $412, $413, $414, $415, $416, $417, $418, $419, $420, $421, $422, $423, $424, $425, $426, $427, $428, $429, $430, $431, $432, $433, $434, $435, $436, $437, $438, $439, $440, $441, $442, $443, $444, $445, $446, $447, $448, $449, $450, $451, $452, $453, $454, $455, $456, $457, $458, $459, $460, $461, $462, $463, $464, $465, $466, $467, $468, $469, $470, $471, $472, $473, $474, $475, $476, $477, $478, $479, $480, $481, $482, $483, $484, $485, $486, $487, $488, $489, $490, $491, $492, $493, $494, $495, $496, $497, $498, $499, $500, $501, $502, $503, $504, $505, $506, $507, $508, $509, $510, $511, $512, $513, $514, $515, $516, $517, $518, $519, $520, $521, $522, $523, $524, $525, $526, $527, $528, $529, $530, $531, $532, $533, $534, $535, $536, $537, $538, $539, $540, $541, $542, $543, $544, $545, $546, $547, $548, $549, $550, $551, $552, $553, $554, $555, $556, $557, $558, $559, $560, $561, $562, $563, $564, $565, $566, $567, $568, $569, $570, $571, $572, $573, $574, $575, $576, $577, $578, $579, $580, $581, $582, $583, $584, $585, $586, $587, $588, $589, $590, $591, $592, $593, $594, $595, $596, $597, $598, $599, $600, $601, $602, $603, $604, $605, $606, $607, $608, $609, $610, $611, $612, $613, $614, $615, $616, $617, $618, $619, $620, $621, $622, $623, $624, $625, $626, $627, $628, $629
    `;
    const values = [id_permiso, tipo_mantenimiento, otro_tipo_mantenimiento, ot_numero, tag, hora_inicio, tiene_equipo_intervenir, descripcion_equipo, fluido, presion, temperatura, antecedentes, requiere_herramientas_especiales, tipo_herramientas_especiales, herramientas_adecuadas, requiere_verificacion_previa, requiere_conocer_riesgos, observaciones_medidas, fuera_operacion, despresurizado_purgado, necesita_aislamiento, con_valvulas, con_juntas_ciegas, producto_entrampado, requiere_lavado, requiere_neutralizado, requiere_vaporizado, suspender_trabajos_adyacentes, acordonar_area, prueba_gas_toxico_inflamable, equipo_electrico_desenergizado, tapar_purgas_drenajes, proteccion_especial_recomendada, proteccion_piel_cuerpo, proteccion_respiratoria, proteccion_ocular, proteccion_contraincendio, tipo_proteccion_contraincendio, instalacion_barreras, observaciones_riesgos, co2_nivel, nh3_nivel, oxigeno_nivel, lel_nivel];

    try {
        const result = await pool.query(query, values);
        const newEntry = result.rows[0];
        res.status(201).json({
            success: true,
            data: newEntry
        });
    } catch (error) {
        console.error('Error al insertar PT Apertura:', error);
        res.status(500).json({
            success: false,
            error: 'Error al insertar PT Apertura'
        });
    }
});

const formulariosRouter = require('./formularios');
app.use('/api', formulariosRouter);

function mostrarMensajeError() {
    alert('Ocurrió un error al guardar los datos.');
}

function textoABoolean(valor) {
    if (typeof valor === 'string') {
        return valor.trim().toLowerCase() === 'si';
    }
    return !!valor;
}

