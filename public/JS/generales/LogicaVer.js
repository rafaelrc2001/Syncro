// (Eliminado: la apertura del modal se maneja en tabla-autorizar.js para evitar conflicto y asegurar que primero se llenen los datos)

// Botón "Aceptar": cierra ambos modales, excepto los botones exclusivos de AutorizarPT
document
  .querySelectorAll(
    "#modalVer .print-btn.close-btn:not(#btn-autorizar-pt):not(#btn-noautorizar-pt)"
  )
  .forEach((btn) => {
    btn.addEventListener("click", function () {
      document.getElementById("modalVer").classList.remove("active");
      document.getElementById("modalComentario").classList.remove("active");
    });
  });

// Botón "No autorizar" (exclusivo de AutorizarPT): lógica personalizada, no se cierra aquí

// ...eliminado: la lógica de mostrar el modalComentario al hacer clic en 'No autorizar' se maneja solo en tabla-autorizar.js...

// Botón "Enviar": cierra el modal de comentario
document.querySelectorAll("#modalComentario .enviar-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.getElementById("modalComentario").classList.remove("active");
  });
});

// Botón "Cancelar": cierra el modal de comentario y regresa al de ver
document.querySelectorAll("#modalComentario .cancelar-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.getElementById("modalComentario").classList.remove("active");
    document.getElementById("modalVer").classList.add("active");
  });
});

// Botón "Regresar": cierra el modal de ver
document.querySelectorAll("#modalVer .regresar-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.getElementById("modalVer").classList.remove("active");
  });
});

// Botón "X" (close-modal): cierra el modal de ver
document.querySelectorAll("#modalVer .close-modal").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.getElementById("modalVer").classList.remove("active");
  });
});

// Actualizar el nombre del aprobador
const responsableInput = document.getElementById("responsable-aprobador");
if (responsableInput) {
  responsableInput.addEventListener("input", function () {
    const stampAprobador = document.getElementById("stamp-aprobador");
    if (stampAprobador) {
      stampAprobador.textContent = this.value || "Nombre del Aprobador";
    }
  });
}

// Función para actualizar el nombre del aprobador
function actualizarAprobador(nombre) {
  const aprobadorElement = document.getElementById("nombre-aprobador");
  if (aprobadorElement) {
    if (nombre) {
      aprobadorElement.textContent = nombre;
    } else {
      aprobadorElement.textContent = "Seleccione un responsable";
    }
  }
}

// Actualizar el aprobador cuando cambia la selección
if (document.getElementById("responsable-aprobador")) {
  document
    .getElementById("responsable-aprobador")
    .addEventListener("change", function () {
      actualizarAprobador(this.value);
    });
}

// Actualizar el nombre del encargado del área
if (document.getElementById("responsable-aprobador2")) {
  document
    .getElementById("responsable-aprobador2")
    .addEventListener("input", function () {
      const stampCierre = document.getElementById("stamp-cierre");
      if (stampCierre) {
        stampCierre.textContent = this.value || "Nombre del Encargado";
      }
    });

  // Define actualizarAprobador2 for SupSeguridad.html
  window.actualizarAprobador2 = function (nombre) {
    const stampCierre = document.getElementById("stamp-cierre");
    if (stampCierre) {
      stampCierre.textContent = nombre || "Nombre del Encargado";
    }
  };
}
