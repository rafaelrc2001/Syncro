// Modal de revalidación: solo comentario y firma

function mostrarModalRevalidar() {
	console.log('[Revalidaciones] mostrarModalRevalidar() invocado');
	// Si ya existe el modal, solo mostrarlo
	let modal = document.getElementById('modalRevalidar');
	if (!modal) {
		modal = document.createElement('div');
		modal.id = 'modalRevalidar';
		modal.className = 'modal-confirmar';
		modal.style.display = 'flex';
		modal.innerHTML = `
			<div class="modal-confirmar-content" style="max-width: 420px;">
				<div class="container" style="padding: 0; background: none; box-shadow: none;">
					<h2 style="margin-top:0;">Revalidar Permiso</h2>
					<div style="margin-bottom: 1em;">
						<label for="comentarioRevalidar" style="font-weight:500;">Comentario</label>
						<textarea id="comentarioRevalidar" rows="3" style="width:100%; border:1px solid #d0d7de; border-radius:6px; padding:8px; resize:vertical; margin-top:4px;" placeholder="Escribe el comentario de revalidación..."></textarea>
					</div>
					<div style="margin-bottom: 1em;">
						<label style="font-weight:500;">Firma</label><br>
						<canvas id="canvasRevalidar" width="340" height="120" style="border:1px solid #ccc; border-radius:8px; background:#fff; cursor:crosshair;"></canvas>
						<input type="hidden" id="firmaRevalidarBase64" />
						<div class="controls" style="margin: 10px 0; display: flex; gap: 10px;">
							<button class="btn-clear" id="limpiarFirmaRevalidar" type="button" style="background:#eee; color:#333; border:none; border-radius:4px; padding:6px 16px; cursor:pointer;">Limpiar</button>
						</div>
					</div>
					<div style="display:flex; justify-content:flex-end; gap:10px;">
						<button id="btnGuardarRevalidar" type="button" class="btn-save" style="background:#27ae60; color:#fff; border:none; border-radius:4px; padding:6px 16px; cursor:pointer;">Guardar</button>			
						<button id="btnCancelarRevalidar" type="button" class="btn-cancel" style="background:#eee; color:#333; border:none; border-radius:4px; padding:6px 16px; cursor:pointer;">Cancelar</button>
					</div>
				</div>
			</div>
		`;
		document.body.appendChild(modal);
		// Firma: lógica básica de canvas
		let canvas = modal.querySelector('#canvasRevalidar');
		let ctx = canvas.getContext('2d');
		let drawing = false;
		let last = {x:0, y:0};
		canvas.addEventListener('mousedown', e => {
			drawing = true;
			last = {x: e.offsetX, y: e.offsetY};
		});
		canvas.addEventListener('mousemove', e => {
			if (!drawing) return;
			ctx.beginPath();
			ctx.moveTo(last.x, last.y);
			ctx.lineTo(e.offsetX, e.offsetY);
			ctx.strokeStyle = '#222';
			ctx.lineWidth = 2;
			ctx.stroke();
			last = {x: e.offsetX, y: e.offsetY};
		});
		canvas.addEventListener('mouseup', () => { drawing = false; });
		canvas.addEventListener('mouseleave', () => { drawing = false; });
		// Limpiar firma
		modal.querySelector('#limpiarFirmaRevalidar').onclick = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			console.log('[Revalidaciones] Firma limpiada');
		};
		// Cancelar
		modal.querySelector('#btnCancelarRevalidar').onclick = function() {
			modal.style.display = 'none';
			console.log('[Revalidaciones] Modal revalidar cancelado');
		};
		// Guardar
		modal.querySelector('#btnGuardarRevalidar').onclick = async function() {
			console.log('[Revalidaciones] Botón Guardar revalidar presionado');
			const comentario = modal.querySelector('#comentarioRevalidar').value;
			const firma = canvas.toDataURL();
			modal.querySelector('#firmaRevalidarBase64').value = firma;

			// Obtener id_permiso de la URL
			const params = new URLSearchParams(window.location.search);
			const id_permiso = params.get('id');
			// Obtener usuario (nombre completo) desde localStorage (nombre, apellidop, apellidom)
			let usuario = '';
			const usuarioStr = localStorage.getItem('usuario');
			if (usuarioStr) {
				try {
					const usuarioObj = JSON.parse(usuarioStr);
					usuario = [
						usuarioObj.nombre || '',
						usuarioObj.apellidop || '',
						usuarioObj.apellidom || ''
					].filter(Boolean).join(' ').trim();
				} catch (e) {
					usuario = 'Usuario desconocido';
					console.warn('[Revalidaciones] Error parseando usuario de localStorage:', e);
				}
			} else {
				usuario = 'Usuario desconocido';
				console.warn('[Revalidaciones] No se encontró usuario en localStorage');
			}
			// Obtener hora actual (formato HH:mm:ss)
			const now = new Date();
			const hora = now.toLocaleTimeString('es-MX', { hour12: false });

			// Validar campos obligatorios
			if (!id_permiso || !comentario || !firma) {
				alert('Faltan campos obligatorios para revalidar.');
				console.warn('[Revalidaciones] Faltan campos: id_permiso:', id_permiso, 'comentario:', comentario, 'firma:', firma ? 'ok' : 'falta');
				return;
			}

			// Preparar los valores a enviar y exponerlos en window para inspección manual
			const datosAEnviar = {
				id_permiso,
				usuario_fecha: usuario,
				hora,
				comentario,
				firma
			};
			window.__revalidacionDatosAEnviar = datosAEnviar;
			console.log('%c[Revalidaciones] Los datos a enviar están en window.__revalidacionDatosAEnviar', 'color: #27ae60; font-weight: bold');
			console.log('[Revalidaciones] Datos a enviar:', datosAEnviar);

			// Enviar datos al endpoint
			try {
				console.log('[Revalidaciones] Enviando datos a /api/revalidaciones ...');
				const response = await fetch('/api/revalidaciones', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(datosAEnviar)
				});
				if (response.ok) {
					modal.style.display = 'none';
					alert('Revalidación guardada correctamente.');
					console.log('[Revalidaciones] Revalidación guardada correctamente.');
					location.reload();
				} else {
					let data = {};
					try { data = await response.json(); } catch(e){}
					alert('Error al guardar revalidación: ' + (data.error || 'Error desconocido'));
					console.error('[Revalidaciones] Error al guardar revalidación:', data);
				}
			} catch (err) {
				alert('Error de red al guardar revalidación.');
				console.error('[Revalidaciones] Error de red al guardar revalidación:', err);
			}
		};
	} else {
		modal.style.display = 'flex';
		console.log('[Revalidaciones] Modal revalidar mostrado (ya existía)');
	}
}

// Mostrar el botón de revalidar solo si el estatus es 'validado por seguridad'
document.addEventListener('DOMContentLoaded', function () {
	const btn = document.getElementById('btn-revalidar-permiso');
	if (!btn) {
		console.warn('[Revalidaciones] No existe el botón');
		return;
	}

	btn.addEventListener('click', function () {
		console.log('[Revalidaciones] Click en botón revalidar');
		mostrarModalRevalidar();
	});
});




document.addEventListener('DOMContentLoaded', async function () {
    // Obtén el id del permiso desde la URL
    const params = new URLSearchParams(window.location.search);
    const id_permiso = params.get('id');
    if (!id_permiso) return;

    try {
        const resp = await fetch(`/api/estatus-solo/${id_permiso}`);
        const data = await resp.json();
        // Solo muestra el botón si el estatus es "validado por seguridad"
        const btn = document.getElementById('btn-revalidar-permiso');
        if (btn) {
            if (!(data && typeof data.estatus === 'string' && data.estatus.trim().toLowerCase() === 'validado por seguridad')) {
                btn.style.display = 'none';
            } else {
                btn.style.display = ''; // Asegura que se muestre si corresponde
            }
        }
    } catch (e) {
        console.error('[Revalidaciones] Error consultando estatus-solo:', e);
    }
});

