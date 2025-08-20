// vertablasUsuario.js
// Este script llena la tabla de permisos en CrearPT.html usando el endpoint /api/vertablas

function asignarEventosVer() {
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            // Mostrar el modal usando la clase 'active' para compatibilidad con LogicaVer.js
            document.getElementById('modalVer').classList.add('active');
        });
    });
}

async function cargarPermisosTabla() {
    try {
        const response = await fetch('http://localhost:3000/api/vertablas');
        if (!response.ok) throw new Error('Error al consultar permisos');
        const permisos = await response.json();
        const tbody = document.getElementById('table-body');
        tbody.innerHTML = '';
        permisos.forEach(permiso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${permiso.prefijo}</td>
                <td>${permiso.tipo_permiso}</td>
                <td>${permiso.descripcion}</td>
                <td>${permiso.area}</td>
                <td>${permiso.solicitante}</td>
                <td>${permiso.fecha_hora}</td>
                <td><span class="status-badge">${permiso.estatus}</span></td>
                <td>
                    <button class="action-btn view"><i class="ri-eye-line"></i></button>
                    <button class="action-btn print"><i class="ri-printer-line"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
        document.getElementById('records-count').textContent = permisos.length;
        asignarEventosVer();
    } catch (err) {
        console.error('Error al cargar permisos:', err);
    }
}

document.addEventListener('DOMContentLoaded', cargarPermisosTabla);
