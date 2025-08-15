document.addEventListener('DOMContentLoaded', () => {
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
                <div class="ast-activity-field"><textarea name="ast-activity-${newIndex}" rows="2"></textarea></div>
                <div class="ast-activity-field">
                    <select name="ast-personnel-${newIndex}">
                        <option value="">-- Seleccione --</option>
                        <option value="juan">Juan Pérez</option>
                        <option value="maria">María López</option>
                        <option value="carlos">Carlos Gómez</option>
                        <option value="ana">Ana Martínez</option>
                    </select>
                </div>
                <div class="ast-activity-field"><textarea name="ast-hazards-${newIndex}" rows="2"></textarea></div>
                <div class="ast-activity-field"><textarea name="ast-preventions-${newIndex}" rows="2"></textarea></div>
                <div class="ast-activity-field">
                    <select name="ast-responsible-${newIndex}">
                        <option value="">-- Seleccione --</option>
                        <option value="juan">Juan Pérez</option>
                        <option value="maria">María López</option>
                        <option value="carlos">Carlos Gómez</option>
                        <option value="ana">Ana Martínez</option>
                    </select>
                </div>
                <div class="ast-activity-actions">
                    <button type="button" class="action-btn remove-activity" title="Eliminar">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            `;

            astActivitiesContainer.appendChild(newActivity);
        });
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('.remove-activity')) {
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
});
