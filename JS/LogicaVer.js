// Mostrar el modal de ver al hacer clic en el botón de "view"
document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.add('active');
    });
});

// Botón "Aceptar": cierra ambos modales
document.querySelectorAll('#modalVer .print-btn.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.remove('active');
        document.getElementById('modalComentario').classList.remove('active');
    });
});

// Botón "Cerrar": muestra el modal de comentario y cierra el de ver
document.querySelectorAll('#modalVer .btn.close-btn:not(.print-btn)').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('modalVer').classList.remove('active');
        document.getElementById('modalComentario').classList.add('active');
    });
});

// Botón "Enviar": cierra ambos modales
document.querySelectorAll('#modalComentario .enviar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalComentario').classList.remove('active');
        document.getElementById('modalVer').classList.remove('active');
    });
});

// Botón "Cancelar": cierra el modal de comentario y regresa al de ver
document.querySelectorAll('#modalComentario .cancelar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalComentario').classList.remove('active');
        document.getElementById('modalVer').classList.add('active');
    });
});

// Botón "Regresar": cierra ambos modales
document.querySelectorAll('#modalVer .regresar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.remove('active');
        document.getElementById('modalComentario').classList.remove('active');
    });
});

// Botón "X" (close-modal): cierra el modal de ver
document.querySelectorAll('#modalVer .close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.remove('active');
        document.getElementById('modalComentario').classList.remove('active');
    });
});

document.getElementById('responsable-aprobador').addEventListener('input', function() {
    document.getElementById('stamp-aprobador').textContent = this.value || 'Nombre del Aprobador';
});

// Función para actualizar el nombre del aprobador
function actualizarAprobador(nombre) {
    const aprobadorElement = document.getElementById('nombre-aprobador');
    if (nombre) {
        aprobadorElement.textContent = nombre;
    } else {
        aprobadorElement.textContent = 'Seleccione un responsable';
    }
}

// Actualizar el aprobador cuando cambia la selección
document.getElementById('responsable-aprobador').addEventListener('change', function() {
    actualizarAprobador(this.value);
});

// Mostrar el modal de ver al hacer clic en el botón de "view"
document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.add('active');
    });
});

// Botón "Aceptar": cierra ambos modales
document.querySelectorAll('#modalVer .print-btn.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.remove('active');
        document.getElementById('modalComentario').classList.remove('active');
    });
});

// Botón "No autorizar": muestra el modal de comentario y cierra el de ver
document.querySelectorAll('#modalVer .btn.close-btn:not(.print-btn)').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('modalVer').classList.remove('active');
        document.getElementById('modalComentario').classList.add('active');
    });
});

// Botón "Enviar": cierra el modal de comentario
document.querySelectorAll('#modalComentario .enviar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalComentario').classList.remove('active');
    });
});

// Botón "Cancelar": cierra el modal de comentario y regresa al de ver
document.querySelectorAll('#modalComentario .cancelar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalComentario').classList.remove('active');
        document.getElementById('modalVer').classList.add('active');
    });
});

// Botón "Regresar": cierra el modal de ver
document.querySelectorAll('#modalVer .regresar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.remove('active');
    });
});

// Botón "X" (close-modal): cierra el modal de ver
document.querySelectorAll('#modalVer .close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.remove('active');
    });
});

// Actualizar el nombre del aprobador
document.getElementById('responsable-aprobador').addEventListener('input', function() {
    document.getElementById('stamp-aprobador').textContent = this.value || 'Nombre del Aprobador';
});// Mostrar el modal de ver al hacer clic en el botón de "view"
document.querySelectorAll('.action-btn.view').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.add('active');
    });
});

// Botón "Aceptar": cierra ambos modales
document.querySelectorAll('#modalVer .print-btn.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.remove('active');
        document.getElementById('modalComentario').classList.remove('active');
    });
});

// Botón "No autorizar": muestra el modal de comentario y cierra el de ver
document.querySelectorAll('#modalVer .btn.close-btn:not(.print-btn)').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('modalVer').classList.remove('active');
        document.getElementById('modalComentario').classList.add('active');
    });
});

// Botón "Enviar": cierra el modal de comentario
document.querySelectorAll('#modalComentario .enviar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalComentario').classList.remove('active');
    });
});

// Botón "Cancelar": cierra el modal de comentario y regresa al de ver
document.querySelectorAll('#modalComentario .cancelar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalComentario').classList.remove('active');
        document.getElementById('modalVer').classList.add('active');
    });
});

// Botón "Regresar": cierra el modal de ver
document.querySelectorAll('#modalVer .regresar-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.remove('active');
    });
});

// Botón "X" (close-modal): cierra el modal de ver
document.querySelectorAll('#modalVer .close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('modalVer').classList.remove('active');
    });
});

// Actualizar el nombre del aprobador
document.getElementById('responsable-aprobador').addEventListener('input', function() {
    document.getElementById('stamp-aprobador').textContent = this.value || 'Nombre del Aprobador';
});
