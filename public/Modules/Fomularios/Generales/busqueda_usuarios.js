// Autocompletado para el input de usuario (nombre completo)
// Requiere un input con id="responsable-aprobador2"
document.addEventListener('DOMContentLoaded', function () {
	const input = document.getElementById('responsable-aprobador2');
	if (!input) return;

	// Crear contenedor de sugerencias
	let suggestionBox = document.createElement('div');
	suggestionBox.style.position = 'absolute';
	suggestionBox.style.zIndex = '1000';
	suggestionBox.style.background = '#fff';
	suggestionBox.style.border = '1px solid #ccc';
	suggestionBox.style.borderRadius = '4px';
	suggestionBox.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
	suggestionBox.style.width = input.offsetWidth + 'px';
	suggestionBox.style.maxHeight = '220px';
	suggestionBox.style.overflowY = 'auto';
	suggestionBox.style.display = 'none';
	suggestionBox.className = 'autocomplete-suggestions';
	document.body.appendChild(suggestionBox);

	let usuarios = [];
	let filtered = [];
	let selectedIndex = -1;

	// Posicionar el suggestionBox debajo del input
	function positionBox() {
		const rect = input.getBoundingClientRect();
		suggestionBox.style.left = rect.left + window.scrollX + 'px';
		suggestionBox.style.top = rect.bottom + window.scrollY + 'px';
		suggestionBox.style.width = rect.width + 'px';
	}

	// Cargar usuarios una sola vez
	fetch('/api/usuarios_lista')
		.then(r => r.json())
		.then(data => {
			usuarios = data.map(u => ({
				...u,
				nombreCompleto: [u.nombre, u.apellidop, u.apellidom].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
			}));
		})
		.catch(() => { usuarios = []; });

	// Mostrar sugerencias (busca en cualquier parte de nombre, apellidop o apellidom)
	function showSuggestions(val) {
		const v = val.trim().toLowerCase();
		filtered = usuarios.filter(u =>
			v && (
				(u.nombre && u.nombre.toLowerCase().includes(v)) ||
				(u.apellidop && u.apellidop.toLowerCase().includes(v)) ||
				(u.apellidom && u.apellidom.toLowerCase().includes(v)) ||
				(u.nombreCompleto && u.nombreCompleto.toLowerCase().includes(v))
			)
		);
		suggestionBox.innerHTML = '';
		if (!val || filtered.length === 0) {
			suggestionBox.style.display = 'none';
			selectedIndex = -1;
			return;
		}
		filtered.forEach((u, idx) => {
			const div = document.createElement('div');
			div.textContent = u.nombreCompleto;
			div.style.padding = '8px 12px';
			div.style.cursor = 'pointer';
			if (idx === selectedIndex) {
				div.style.background = '#e6f0fa';
			}
			div.addEventListener('mousedown', function (e) {
				e.preventDefault();
				input.value = u.nombreCompleto;
				suggestionBox.style.display = 'none';
				selectedIndex = -1;
			});
			suggestionBox.appendChild(div);
		});
		suggestionBox.style.display = 'block';
		positionBox();
	}

	// Eventos del input
	input.addEventListener('input', function () {
		showSuggestions(this.value);
	});

	input.addEventListener('focus', function () {
		showSuggestions(this.value);
	});

	input.addEventListener('blur', function () {
		setTimeout(() => { suggestionBox.style.display = 'none'; }, 120);
	});

	// Navegación con teclado
	input.addEventListener('keydown', function (e) {
		if (suggestionBox.style.display !== 'block') return;
		if (e.key === 'ArrowDown') {
			selectedIndex = (selectedIndex + 1) % filtered.length;
			showSuggestions(this.value);
			e.preventDefault();
		} else if (e.key === 'ArrowUp') {
			selectedIndex = (selectedIndex - 1 + filtered.length) % filtered.length;
			showSuggestions(this.value);
			e.preventDefault();
		} else if (e.key === 'Enter') {
			if (selectedIndex >= 0 && filtered[selectedIndex]) {
				input.value = filtered[selectedIndex].nombreCompleto;
				suggestionBox.style.display = 'none';
				selectedIndex = -1;
				e.preventDefault();
			}
		}
	});

	// Reposicionar en scroll/resize
	window.addEventListener('scroll', positionBox, true);
	window.addEventListener('resize', positionBox);
});
