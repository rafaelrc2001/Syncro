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
        });
    }

    // ==============================
    // 2. Manejar envío del formulario principal
    // ==============================
    const permitForm = document.getElementById('complete-permit-form');
    if (permitForm) {
        permitForm.addEventListener('submit', async function (e) {
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

                // Recuperar el valor de planta como id_area desde sessionStorage
                const id_area = sessionStorage.getItem('plant_value') || 1;
                const id_departamento = 1;
                const id_sucursal = sessionStorage.getItem('id_sucursal');
                const id_tipo_permiso = 1;
                const id_estatus = sessionStorage.getItem('id_estatus');
                const id_ast = sessionStorage.getItem('id_ast') || 1;

                // 1. Insertar permiso
                const permisoResponse = await fetch('http://localhost:3000/api/permisos-trabajo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_area, id_departamento, id_sucursal, id_tipo_permiso, id_estatus, id_ast })
                });
                const permisoResult = await permisoResponse.json();
                if (!permisoResponse.ok || !permisoResult.success) throw new Error(permisoResult.error || 'Error al guardar permiso de trabajo');

                const id_permiso = permisoResult.data.id_permiso || permisoResult.data.id;

                // 2. Insertar PT no peligroso
                const nombre_solicitante = document.getElementById('nombre_solicitante')?.value || 'Solicitante';
                const descripcion_trabajo = document.getElementById('descripcion_trabajo')?.value || 'Descripción';
                const tipo_mantenimiento = document.getElementById('tipo_mantenimiento')?.value || 'Preventivo';
                const ot_no = document.getElementById('ot_no')?.value || null;
                const equipo_intervencion = document.getElementById('equipo_intervencion')?.value || 'Equipo';
                const fecha = document.getElementById('permit-date')?.value || '2025-08-19';
                const hora = document.getElementById('start-time')?.value || '08:00';
                const hora_inicio = `${fecha} ${hora}`; // Resultado: "2025-08-19 08:00"
                const tag = document.getElementById('tag')?.value || null;
                const fluido = document.getElementById('fluido')?.value || null;
                const presion = document.getElementById('presion')?.value || null;
                const temperatura = document.getElementById('temperatura')?.value || null;

                const ptResponse = await fetch('http://localhost:3000/api/pt-no-peligroso', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_permiso, nombre_solicitante, descripcion_trabajo, tipo_mantenimiento, ot_no, equipo_intervencion, hora_inicio, tag, fluido, presion, temperatura })
                });
                const ptResult = await ptResponse.json();
                if (!ptResponse.ok || !ptResult.success) throw new Error(ptResult.error || 'Error al guardar PT No Peligroso');

                // 3. Insertar actividades AST
                const astActivities = [];
                let validAst = true;

                document.querySelectorAll('.ast-activity').forEach((row, index) => {
                    const secuencia = index + 1;
                    const personal_ejecutor = row.querySelector(`select[name^="ast-personnel-"]`).value;
                    const peligros_potenciales = row.querySelector(`textarea[name^="ast-hazards-"]`).value.trim();
                    const acciones_preventivas = row.querySelector(`textarea[name^="ast-preventions-"]`).value.trim();
                    const responsable = row.querySelector(`select[name^="ast-responsible-"]`).value;

                    if (!personal_ejecutor || !peligros_potenciales || !acciones_preventivas || !responsable) {
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
                    modal.querySelector('p').innerHTML = 'El permiso ha sido registrado con número: <strong id="generated-permit">GSI-SI-FO-002-XXXX</strong>';
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

