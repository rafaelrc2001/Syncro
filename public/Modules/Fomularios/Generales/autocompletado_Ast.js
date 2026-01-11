// Autocompletado de participantes por número de credencial
document.addEventListener('DOMContentLoaded', function () {
    function attachAutocompleteToRow(row) {
        const credInput = row.querySelector('input[name^="participant-credential-"]');
        const nameInput = row.querySelector('input[name^="participant-name-"]');
        const positionInput = row.querySelector('input[name^="participant-position-"]');
        if (!credInput || !nameInput || !positionInput) return;

        credInput.addEventListener('input', async function () {
            const cred = credInput.value.trim();
            if (!cred) return;
            try {
                const res = await fetch(`/api/usuario-por-credencial?no_empleado=${encodeURIComponent(cred)}`);
                console.log('[AUTOCOMPLETE] Consultando:', cred, 'Status:', res.status);
                if (!res.ok) return;
                const data = await res.json();
                console.log('[AUTOCOMPLETE] Respuesta:', data);
                if (data && data.success && data.usuario) {
                    const nombreCompleto = `${data.usuario.nombre} ${data.usuario.apellidop || ''} ${data.usuario.apellidom || ''}`.trim();
                    nameInput.value = nombreCompleto;
                    positionInput.value = data.usuario.cargo || '';
                }
            } catch (e) {
                console.error('[AUTOCOMPLETE] Error:', e);
            }
        });
    }

    document.querySelectorAll('.participant-row').forEach(attachAutocompleteToRow);

    const participantsTable = document.querySelector('.participants-table');
    if (participantsTable) {
        const observer = new MutationObserver(() => {
            document.querySelectorAll('.participant-row').forEach(attachAutocompleteToRow);
        });
        observer.observe(participantsTable, { childList: true, subtree: true });
    }
});
