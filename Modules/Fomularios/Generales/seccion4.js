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
        addActivityBtn.addEventListener('click', function () {
            const activityCount = document.querySelectorAll('.ast-activity').length;
            const newIndex = activityCount + 1;

            if (newIndex > 10) {
                alert('Máximo 10 actividades permitidas');
                return;
            }

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
                        <option value="">-- Seleccione --</option>
                        <option value="juan">Juan Pérez</option>
                        <option value="maria">María López</option>
                        <option value="carlos">Carlos Gómez</option>
                        <option value="ana">Ana Martínez</option>
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
                        <option value="">-- Seleccione --</option>
                        <option value="juan">Juan Pérez</option>
                        <option value="maria">María López</option>
                        <option value="carlos">Carlos Gómez</option>
                        <option value="ana">Ana Martínez</option>
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
});

// Función para poblar los selects de participantes en AST
async function poblarSelectParticipantes() {
    try {
        // 1. Obtener la lista de participantes del backend
        const response = await fetch('http://localhost:3000/api/participantes');
        const participantes = await response.json();

        // 2. Seleccionar todos los selects de personal en AST
        const selects = document.querySelectorAll('select[name^="ast-personnel-"]');

        selects.forEach(select => {
            // Limpiar opciones actuales
            select.innerHTML = '<option value="">-- Seleccione --</option>';
            // Agregar cada participante como opción
            participantes.forEach(part => {
                const option = document.createElement('option');
                option.value = part.id; // o part.nombre si no tienes id
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