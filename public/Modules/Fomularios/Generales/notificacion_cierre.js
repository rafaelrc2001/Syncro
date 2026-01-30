// Función para manejar el envío del formulario de cierre a n8n
window.n8nCierreHandler = async function () {
	console.log('[n8nCierreHandler] INICIANDO ENVÍO DE NOTIFICACIÓN DE CIERRE');

	// Obtener id_permiso de la URL o variable global
	let id_permiso = null;
	const params = new URLSearchParams(window.location.search);
	if (params.get('id')) {
		id_permiso = params.get('id');
	} else if (window.permitId) {
		id_permiso = window.permitId;
	}

	// Obtener sucursal, area, descripcion, departamento, solicitante, fecha de solicitud
	// Preferir datos del DOM, si no existen intentar de localStorage o dejar en blanco

	// Sucursal
	let sucursal = '';
	const sucursalElem = document.getElementById('sucursal-label');
	if (sucursalElem) {
		sucursal = sucursalElem.textContent.trim();
	}

	// Area
	let area = '';
	const areaElem = document.getElementById('dpto-contrato');
	if (areaElem) {
		area = areaElem.textContent.trim();
	}

	// Descripcion
	let descripcion = '';
	const descElem = document.getElementById('descripcion-trabajo-label');
	if (descElem) {
		descripcion = descElem.textContent.trim();
	}

	// Departamento
	let departamento = '';
	const depElem = document.getElementById('departamento');
	if (depElem) {
		departamento = depElem.value || depElem.textContent.trim();
	} else {
		// Intenta obtenerlo de localStorage
		try {
			const usuario = JSON.parse(localStorage.getItem("usuario"));
			if (usuario && usuario.departamento) {
				departamento = usuario.departamento;
			}
		} catch (e) {
			console.warn('[n8nCierreHandler] No se pudo obtener departamento de localStorage');
		}
	}

	// Solicitante (nombre)
	let solicitante = '';
	const solicitanteElem = document.getElementById('responsable-trabajo-label');
	if (solicitanteElem) {
		solicitante = solicitanteElem.textContent.trim();
	}

	// Consultar el correo del solicitante
	let correoSolicitante = '';
	if (solicitante) {
		try {
			const resp = await fetch(`/api/correo-por-nombre?nombre=${encodeURIComponent(solicitante)}`);
			if (resp.ok) {
				const data = await resp.json();
				if (data.correo) {
					correoSolicitante = data.correo;
				}
			}
		} catch (e) {
			console.warn('[n8nCierreHandler] Error obteniendo correo del solicitante:', e);
		}
	}

	// Consultar correos de supervisores
	let correosSupervisores = [];
	try {
		const resp = await fetch('/api/correo-supervisor');
		if (resp.ok) {
			const data = await resp.json();
			if (Array.isArray(data.correos)) {
				correosSupervisores = data.correos;
			}
		}
	} catch (e) {
		console.warn('[n8nCierreHandler] Error obteniendo correos de supervisores:', e);
	}

	// Unificar correos en un solo string, separados por coma, sin duplicados ni vacíos
	let correos = [correoSolicitante, ...correosSupervisores].filter(c => c && c.trim()).filter((v, i, arr) => arr.indexOf(v) === i).join(',');

	// Fecha de solicitud
	let fecha_solicitud = '';
	const fechaElem = document.getElementById('fecha-label');
	if (fechaElem) {
		fecha_solicitud = fechaElem.textContent.trim();
	}

	// Construir objeto de datos
	const datosCierre = {
		id_permiso,
		sucursal,
		area,
		descripcion,
		departamento,
		solicitante,
		fecha_solicitud,
		correo: correos
	};
	console.log('[n8nCierreHandler] Datos a enviar a n8n:', datosCierre);

	// Enviar datos a n8n (mostrar la URL en consola antes de enviar)
	const urlApi = "/api/notificar-cierre-permiso";
	console.log('[n8nCierreHandler] Enviando notificación a backend local:', urlApi);
	try {
		const response = await fetch(
			urlApi,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(datosCierre),
			}
		);
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.warn('[n8nCierreHandler] Error en respuesta del backend:', errorData);
		} else {
			console.log('[n8nCierreHandler] Notificación enviada correctamente al backend');
		}
	} catch (e) {
		console.error('[n8nCierreHandler] Error enviando notificación al backend:', e);
	}
	return true;
};


















