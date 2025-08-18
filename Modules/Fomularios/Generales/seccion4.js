document.addEventListener('DOMContentLoaded', () => {
    // Configurar botón de cierre del modal
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            // Redirigir a CrearPT.html al hacer clic en Cerrar
            window.location.href = '/Modules/Usuario/CrearPT.html';
        });
    }

    // ==============================
    // 1. Agregar y eliminar actividades
    // ==============================
    const addActivityBtn = document.getElementById('add-activity');
    const astActivitiesContainer = document.querySelector('.ast-activities');

    if (addActivityBtn && astActivitiesContainer) {
        addActivityBtn.addEventListener('click', async function () {
            const activityCount = document.querySelectorAll('.ast-activity').length;
            const newIndex = activityCount + 1;

            if (newIndex > 10) {
                alert('Máximo 10 actividades permitidas');
                return;
            }

            // Obtener participantes desde el backend
            let participantes = [];
            try {
                const response = await fetch('http://localhost:3000/api/participantes');
                participantes = await response.json();
            } catch (error) {
                console.error('Error al obtener participantes:', error);
            }

            // Crear select de personal ejecutor
            let optionsPersonal = '<option value="">-- Seleccione --</option>';
            participantes.forEach(part => {
                optionsPersonal += `<option value="${part.id_ast_participan}">${part.nombre}</option>`;
            });

            // Crear select de responsable
            let optionsResponsable = '<option value="">-- Seleccione --</option>';
            participantes.forEach(part => {
                optionsResponsable += `<option value="${part.id_ast_participan}">${part.nombre}</option>`;
            });

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
                        ${optionsPersonal}
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
                        ${optionsResponsable}
                    </select>
                </div>
                <div class="ast-activities-actions">
                    <button type="button" class="action-btn remove-participant" title="Eliminar">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            `;
            astActivitiesContainer.appendChild(newActivity);
        });
    }

    // Evento para eliminar participantes y actividades AST
    document.addEventListener('click', function (e) {
        // Eliminar fila de participante
        if (e.target.closest('.remove-participant')) {
            // Participantes
            const participantRow = e.target.closest('.participant-row');
            if (participantRow) {
                participantRow.remove();
                document.querySelectorAll('.participant-row').forEach((row, index) => {
                    row.setAttribute('data-index', index + 1);
                    row.querySelector('.participant-number').textContent = index + 1;
                });
                return;
            }
            // Actividades AST
            const activityRow = e.target.closest('.ast-activity');
            if (activityRow) {
                activityRow.remove();
                document.querySelectorAll('.ast-activity').forEach((row, index) => {
                    row.setAttribute('data-index', index + 1);
                    row.querySelector('.ast-activity-number').textContent = index + 1;
                });
            }
        }
    });

    // ==============================
    // 2. Envío del formulario y modal de confirmación
    // ==============================
    const submitBtn = document.querySelector('#complete-permit-form button[type="submit"]');
    // Botón volver de la sección 4 (AST)
    const backBtnAst = document.querySelector('.form-section[data-section="4"] .form-actions .prev-step');
    if (backBtnAst) {
        backBtnAst.addEventListener('click', function() {
            // Elimina la clave de sessionStorage para permitir nueva inserción
            sessionStorage.removeItem('permisoCompletoInserted');
        });
    }
    if (submitBtn) {
        submitBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            // Mostrar estado de carga
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Procesando...';
            try {
                // Validar campos requeridos en la sección 4
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
                    alert('Por favor completa todos los campos obligatorios antes de guardar el permiso.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    return;
                }

                // 1. No se obtienen campos del frontend, el backend asigna los valores por defecto

                // Control de inserción única por sesión
                if (sessionStorage.getItem('permisoCompletoInserted') === 'true') {
                    // Ya insertado, solo mostrar modal de éxito
                    const modal = document.getElementById('confirmation-modal');
                    if (modal) {
                        modal.querySelector('p').innerHTML = 
                            'El permiso de trabajo con AST ha sido registrado en el sistema con el número: <strong id="generated-permit">GSI-SI-FO-002-XXXX</strong>';
                        modal.querySelector('h3').textContent = 'Permiso creado exitosamente';
                        modal.classList.add('active');
                    }
                    return;
                }

                // 1. Insertar en autorizaciones y obtener el id generado
                const responseAut = await fetch('http://localhost:3000/api/autorizaciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                });
                const resultAut = await responseAut.json();
                if (!responseAut.ok || !resultAut.data || !resultAut.data.id_autorizacion) {
                    throw new Error(resultAut.error || 'Error al guardar la autorización');
                }
                const id_autorizacion = resultAut.data.id_autorizacion;

                // 2. Insertar en permisos_trabajo usando el id_autorizacion y valores por default
                // Puedes cambiar estos valores por los que necesites
                const defaultPermiso = {
                    id_area: 4,
                    id_departamento: 2,
                    id_sucursal: 1,
                    id_tipo_permiso: 1,
                    id_estatus: 5,
                    id_ast: 1,
                    id_autorizacion: id_autorizacion
                };
                const responsePermiso = await fetch('http://localhost:3000/api/permisos-trabajo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(defaultPermiso)
                });
                const resultPermiso = await responsePermiso.json();
                if (!responsePermiso.ok || !resultPermiso.success) {
                    throw new Error(resultPermiso.error || 'Error al guardar el permiso de trabajo');
                }

                // 3. Insertar en pt_no_peligroso usando el id_permiso generado y los datos del formulario
                const id_permiso = resultPermiso.data.id_permiso;
                // Obtener valores de sección 1 y 2
                const nombre_solicitante = document.querySelector('#applicant').value;
                const descripcion_trabajo = document.querySelector('#work-description').value;
                const tipo_mantenimiento = document.querySelector('#maintenance-type').value === 'OTRO'
                    ? document.querySelector('#other-maintenance').value
                    : document.querySelector('#maintenance-type').value;
                const ot_no = document.querySelector('#work-order').value;
                // Validar equipo_intervencion: si/no según radio seleccionado
                const equipo_intervencion = document.querySelector('input[name="has-equipment"]:checked')?.value === 'si' ? 'SI' : 'NO';
                // Combinar fecha y hora para TIMESTAMP
                const fecha = document.querySelector('#permit-date').value;
                const hora = document.querySelector('#start-time').value;
                const hora_inicio = fecha && hora ? `${fecha} ${hora}` : '';
                const tag = document.querySelector('#tag').value;
                const fluido = document.querySelector('#fluid').value;
                const presion = document.querySelector('#pressure').value;
                const temperatura = document.querySelector('#temperature').value;

                const ptNoPeligrosoData = {
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
                    temperatura
                };
                console.log('Datos enviados a pt_no_peligroso:', ptNoPeligrosoData);
                const responsePTNP = await fetch('http://localhost:3000/api/pt-no-peligroso', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ptNoPeligrosoData)
                });
                const resultPTNP = await responsePTNP.json();
                if (!responsePTNP.ok || !resultPTNP.success) {
                    throw new Error(resultPTNP.error || 'Error al guardar PT No Peligroso');
                }

                // 4. Insertar actividades AST usando el id_permiso generado
                const astActivities = [];
                const astActivityElements = document.querySelectorAll('.ast-activity');
                let validAst = true;
                astActivityElements.forEach((activityEl) => {
                    const index = activityEl.getAttribute('data-index');
                    const secuencia = activityEl.querySelector(`textarea[name="ast-activity-${index}"]`)?.value.trim();
                    const personal_ejecutor = activityEl.querySelector(`select[name="ast-personnel-${index}"]`)?.value;
                    const peligros_potenciales = activityEl.querySelector(`textarea[name="ast-hazards-${index}"]`)?.value.trim();
                    const acciones_preventivas = activityEl.querySelector(`textarea[name="ast-preventions-${index}"]`)?.value.trim();
                    const responsableSelect = activityEl.querySelector(`select[name="ast-responsible-${index}"]`);
                    const responsable = responsableSelect?.value;

                    if (!secuencia) {
                        console.error(`Actividad ${index}: secuencia está vacío o undefined`);
                        validAst = false;
                    }
                    if (!personal_ejecutor) {
                        console.error(`Actividad ${index}: personal_ejecutor está vacío o undefined`);
                        validAst = false;
                    }
                    if (!peligros_potenciales) {
                        console.error(`Actividad ${index}: peligros_potenciales está vacío o undefined`);
                        validAst = false;
                    }
                    if (!acciones_preventivas) {
                        console.error(`Actividad ${index}: acciones_preventivas está vacío o undefined`);
                        validAst = false;
                    }
                    if (!responsable) {
                        console.error(`Actividad ${index}: responsable está vacío o undefined`);
                        validAst = false;
                        if (responsableSelect) {
                            responsableSelect.style.borderColor = '#ff4444';
                            responsableSelect.addEventListener('change', function () {
                                this.style.borderColor = '';
                            }, { once: true });
                        }
                    }

                    astActivities.push({
                        id_ast: idAst,
                        secuencia,
                        personal_ejecutor,
                        peligros_potenciales,
                        acciones_preventivas,
                        responsable
                    });
                });
                if (!validAst) {
                    alert('Por favor completa todos los campos obligatorios de las actividades AST antes de guardar. Revisa la consola para detalles.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalHTML;
                    return;
                }
                console.log('Actividades AST a enviar:', astActivities);

                const responseAST = await fetch('http://localhost:3000/api/ast-actividades', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ actividades: astActivities })
                });
                const resultAST = await responseAST.json();
                if (!responseAST.ok || !resultAST.success) {
                    throw new Error(resultAST.error || 'Error al guardar actividades AST');
                }

                // Marcar como insertado
                sessionStorage.setItem('permisoCompletoInserted', 'true');

                // Simular retraso de red (puedes quitar esta línea si ya no quieres simular)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mostrar mensaje de éxito en el modal
                const modal = document.getElementById('confirmation-modal');
                if (modal) {
                    modal.querySelector('p').innerHTML = 
                        'El permiso de trabajo con AST ha sido registrado en el sistema con el número: <strong id="generated-permit">GSI-SI-FO-002-XXXX</strong>';
                    modal.querySelector('h3').textContent = 'Permiso creado exitosamente';
                    modal.classList.add('active');
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
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }
        });
    }

    // ==============================
    // 3. Función simulada para compatibilidad
    // ==============================
    window.handleN8NFormSubmission = async function() {
        console.log('Modo de prueba: No se está usando n8n');
        return true; // Siempre retorna éxito
    };
    // ==============================
    // Imprimir en consola el nombre seleccionado en los selects AST
    // ==============================
    function imprimirNombreSeleccionado(event) {
        const select = event.target;
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption && selectedOption.value) {
            console.log(`Seleccionado en ${select.name}: ${selectedOption.textContent}`);
        }
    }

    document.addEventListener('change', function(event) {
        if (event.target.matches('select[name^="ast-personnel-"]') || event.target.matches('select[name^="ast-responsible-"]')) {
            imprimirNombreSeleccionado(event);
        }
    });
});

// Poblar ambos selects de cada actividad AST
async function poblarSelectParticipantes() {
    try {
        const response = await fetch('http://localhost:3000/api/participantes');
        const participantes = await response.json();

        if (!Array.isArray(participantes)) {
            console.error('La respuesta de participantes no es un array:', participantes);
            return;
        }

        // Poblar selects de personal ejecutor
        const selectsPersonal = document.querySelectorAll('select[name^="ast-personnel-"]');
        selectsPersonal.forEach(select => {
            select.innerHTML = '<option value="">-- Seleccione --</option>';
            participantes.forEach(part => {
                const option = document.createElement('option');
                option.value = part.id_ast_participan; // o part.nombre si no tienes id
                option.textContent = part.nombre;
                select.appendChild(option);
            });
        });

        // Poblar selects de responsable
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

// Llama a la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', poblarSelectParticipantes);

const idAst = sessionStorage.getItem('id_ast');
console.log('[DEBUG] idAst leído en seccion4:', idAst);

