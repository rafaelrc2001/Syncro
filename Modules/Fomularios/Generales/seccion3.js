document.addEventListener('DOMContentLoaded', () => {
    const addParticipantBtn = document.getElementById('add-participant');
    const participantsContainer = document.querySelector('.participants-table');

    function renumberParticipants() {
        document.querySelectorAll('.participant-row').forEach((row, index) => {
            const newIndex = index + 1;
            row.setAttribute('data-index', newIndex);
            row.querySelector('.participant-number').textContent = newIndex;

            const fields = ['name', 'credential', 'position', 'role'];
            fields.forEach(field => {
                const input = row.querySelector(`input[name^="participant-${field}"], select[name^="participant-${field}"]`);
                if (input) {
                    input.name = `participant-${field}-${newIndex}`;
                }
            });
        });
    }

    if (addParticipantBtn && participantsContainer) {
        addParticipantBtn.addEventListener('click', function () {
            const participantCount = document.querySelectorAll('.participant-row').length;
            const newIndex = participantCount + 1;

            const newParticipant = document.createElement('div');
            newParticipant.className = 'participant-row';
            newParticipant.setAttribute('data-index', newIndex);
            newParticipant.innerHTML = `
                <div class="participant-number">${newIndex}</div>
                <div class="participant-field">
                    <input type="text" name="participant-name-${newIndex}" required>
                </div>
                <div class="participant-field">
                    <input type="text" name="participant-credential-${newIndex}">
                </div>
                <div class="participant-field">
                    <input type="text" name="participant-position-${newIndex}">
                </div>
                <div class="participant-field">
                    <select name="participant-role-${newIndex}" required>
                        <option value="">Seleccione...</option>
                        <option value="PARTICIPA">Participa</option>
                        <option value="REVISA">Revisa</option>
                        <option value="ANALIZA">Analiza</option>
                        <option value="AUTORIZA">Autoriza</option>
                    </select>
                </div>
                <div class="participant-actions">
                    <button type="button" class="action-btn remove-participant" title="Eliminar">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            `;

            participantsContainer.appendChild(newParticipant);

            newParticipant.querySelector('.remove-participant').addEventListener('click', function () {
                if (confirm('¿Está seguro de eliminar este participante?')) {
                    newParticipant.remove();
                    renumberParticipants();
                }
            });
        });
    }
});
