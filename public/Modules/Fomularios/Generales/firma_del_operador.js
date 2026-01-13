// --- Lógica para el modal de cierre de permiso (Autorización cierre del trabajo) ---
document.addEventListener('DOMContentLoaded', function () {
  const btnCierrePermiso = document.getElementById('btn-cierre-permiso');
  const modalCierre = document.getElementById('modalConfirmarCierre');
  const btnCancelarCierre = document.getElementById('btnCancelarCierre');
  const btnConfirmarCierre = document.getElementById('btnConfirmarCierre');
  const outputFirmaOperador = document.getElementById('outputBase64FirmaOperador');
  // (Eliminado: la firma se leerá justo antes de enviar)

  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get('id') || window.idPermisoActual;

  if (btnCierrePermiso && modalCierre) {
    btnCierrePermiso.addEventListener('click', async function () {
      // Validar firma del operador ANTES de mostrar el modal
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get('id') || window.idPermisoActual;
      if (!idPermiso) return;
      try {
        const respFirma = await fetch(`/api/autorizaciones/ver-firma-operador-area/${idPermiso}`);
        if (respFirma.ok) {
          const data = await respFirma.json();
          const operadorArea = data && data.data && typeof data.data.operador_area !== 'undefined' ? data.data.operador_area : null;
          const firmaBD = data && data.data && typeof data.data.firma_operador_area !== 'undefined' ? data.data.firma_operador_area : null;
          // Si NO hay operador_area, no se requiere firma y el flujo puede continuar
          if (operadorArea === null || operadorArea === undefined || (typeof operadorArea === 'string' && operadorArea.trim() === '')) {
            // No hay operador, continuar
          } else {
            // Si hay operador, sí se requiere firma
            if (firmaBD === null || firmaBD === undefined || (typeof firmaBD === 'string' && firmaBD.trim() === '')) {
              alert('El operador debe firmar antes de continuar.');
              return;
            }
          }
        } else {
          alert('No se pudo validar la firma del operador.');
          return;
        }
      } catch (e) {
        alert('No se pudo validar la firma del operador.');
        return;
      }
      // Si hay firma, mostrar el modal
      modalCierre.style.display = 'block';
    });
  }
  if (btnCancelarCierre && modalCierre) {
    btnCancelarCierre.addEventListener('click', function () {
      modalCierre.style.display = 'none';
    });
  }
  if (btnConfirmarCierre && modalCierre) {
    btnConfirmarCierre.addEventListener('click', async function (e) {
      if (e) e.preventDefault(); // Previene submit accidental si está en un <form>
      // Validar firma del operador en la base de datos antes de continuar
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get('id') || window.idPermisoActual;
      if (!idPermiso) return;
      try {
        const respFirma = await fetch(`/api/autorizaciones/ver-firma-operador-area/${idPermiso}`);
        if (respFirma.ok) {
          const data = await respFirma.json();
          // Validación robusta: null, undefined, string vacío, o solo espacios
          const firmaBD = data && data.data && typeof data.data.firma_operador_area !== 'undefined' ? data.data.firma_operador_area : null;
          console.log('VALIDANDO FIRMA:', firmaBD); // Log para depuración
          if (firmaBD === null || firmaBD === undefined || (typeof firmaBD === 'string' && firmaBD.trim() === '')) {
            alert('El operador debe firmar antes de continuar.');
            return;
          }
        } else {
          alert('No se pudo validar la firma del operador.');
          return;
        }
      } catch (e) {
        alert('No se pudo validar la firma del operador.');
        return;
      }

      // Obtener el id_estatus usando el id_permiso
      let id_estatus = null;
      try {
        const resp = await fetch(`/api/estatus/permiso/${idPermiso}`);
        if (resp.ok) {
          const data = await resp.json();
          id_estatus = data?.data?.id_estatus;
        }
      } catch (e) {
        alert('No se pudo obtener el estatus del permiso.');
        modalCierre.style.display = 'none';
        return;
      }
      if (!id_estatus) {
        alert('No se encontró el estatus para este permiso.');
        modalCierre.style.display = 'none';
        return;
      }
      // Enviar el cierre
      try {
        const respCierre = await fetch('/api/estatus/cierre', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_estatus }),
        });
        let respCierreData = {};
        try {
          respCierreData = await respCierre.json();
        } catch (e) {}
        if (respCierre.ok) {
          alert('Cierre de permiso realizado correctamente.');
          window.location.reload();
        } else {
          alert('Error al cerrar el permiso.');
        }
      } catch (err) {
        alert('Error de red al intentar cerrar el permiso.');
      }
      modalCierre.style.display = 'none';
    });
  }
});

//esta es la funcionalidad que ocuparia para la parte de que solo se muestre el valor de firma para cuando el usuario no a firmado 
// o cuando el usaurio no escribio el nombre de el operador 

document.addEventListener('DOMContentLoaded', async function() {
  const firmaAreaDiv = document.getElementById('firma-area-operador');
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get('id') || window.idPermisoActual;

  if (idPermiso && firmaAreaDiv) {
    try {
      const resp = await fetch(`/api/autorizaciones/ver-firma-operador-area/${idPermiso}`);
      if (resp.ok) {
        const data = await resp.json();
        if (
          data && data.success && data.data && (
            data.data.firma_operador_area ||
            data.data.operador_area === null ||
            data.data.operador_area === undefined ||
            data.data.operador_area === ''
          )
        ) {
          // Si ya hay firma, o no se requiere operador_area, ocultar el área de firma
          firmaAreaDiv.style.display = 'none';
        } else {
          // Si no hay firma y sí se requiere operador_area, mostrar el área
          firmaAreaDiv.style.display = '';
        }
      }
    } catch (err) {
      // Si hay error, mostrar el área por defecto
      firmaAreaDiv.style.display = '';
    }
  }
});
/*
// --- Deshabilitar botón de cierre si operador_area requiere firma pero no ha firmado ---
document.addEventListener('DOMContentLoaded', async function() {
    const btnCierrePermiso = document.getElementById('btn-cierre-permiso');
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get('id') || window.idPermisoActual;
    // Crear/obtener el mensaje debajo del botón
    let aviso = document.getElementById('aviso-firma-operador-cierre');
    if (!aviso && btnCierrePermiso) {
        aviso = document.createElement('div');
        aviso.id = 'aviso-firma-operador-cierre';
        aviso.style.color = '#e53935';
        aviso.style.fontWeight = '600';
        aviso.style.marginTop = '8px';
        aviso.style.fontSize = '1em';
        btnCierrePermiso.parentNode.insertBefore(aviso, btnCierrePermiso.nextSibling);
    }
    // Función para validar si el canvas está en blanco
    function isCanvasFirmaOperadorBlank() {
        const canvas = document.getElementById('canvasFirmaOperador');
        if (!canvas) return true;
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    }
    // Handler para actualizar el estado del botón en tiempo real
    function actualizarEstadoCierre() {
        if (idPermiso && btnCierrePermiso) {
            fetch(`/api/autorizaciones/ver-firma-operador-area/${idPermiso}`)
                .then(resp => resp.ok ? resp.json() : null)
                .then(data => {
                    const operador = data?.data?.operador_area;
                    const firma = data?.data?.firma_operador_area;
                    // Si hay operador, pero no hay firma en BD, validar si hay garabato en canvas
                    if (operador && operador.trim() !== '') {
                        if (!firma || firma.trim() === '') {
                            // Si el canvas tiene garabato, permitir cierre
                            if (!isCanvasFirmaOperadorBlank()) {
                                btnCierrePermiso.disabled = false;
                                btnCierrePermiso.title = '';
                                if (aviso) aviso.textContent = '';
                            } else {
                                btnCierrePermiso.disabled = true;
                                btnCierrePermiso.title = 'El operador del área debe firmar antes de cerrar el permiso.';
                                if (aviso) aviso.textContent = 'El operador del área debe firmar antes de cerrar el permiso.';
                            }
                        } else {
                            btnCierrePermiso.disabled = false;
                            btnCierrePermiso.title = '';
                            if (aviso) aviso.textContent = '';
                        }
                    } else {
                        // Si no hay operador, se habilita el botón y se oculta el aviso
                        btnCierrePermiso.disabled = false;
                        btnCierrePermiso.title = '';
                        if (aviso) aviso.textContent = '';
                    }
                })
                .catch(() => {
                    btnCierrePermiso.disabled = false;
                    btnCierrePermiso.title = '';
                    if (aviso) aviso.textContent = '';
                });
        }
    }
    // Actualizar al cargar
    actualizarEstadoCierre();
    // Actualizar en tiempo real cuando el usuario dibuja en el canvas
    const canvasFirmaOperador = document.getElementById('canvasFirmaOperador');
    if (canvasFirmaOperador) {
        ['mouseup', 'touchend', 'mousemove', 'touchmove'].forEach(evt => {
            canvasFirmaOperador.addEventListener(evt, actualizarEstadoCierre);
        });
    }
});
*/


document.addEventListener('DOMContentLoaded', async function () {
    // Obtén el id del permiso desde la URL
    const params = new URLSearchParams(window.location.search);
    const id_permiso = params.get('id');
    if (!id_permiso) return;

    try {
        const resp = await fetch(`/api/estatus-solo/${id_permiso}`);
        const data = await resp.json();
        // Solo muestra el botón si el estatus es "validado por seguridad"
        const btn = document.getElementById('btn-cierre-permiso');
        if (btn) {
            if (!(data && typeof data.estatus === 'string' && data.estatus.trim().toLowerCase() === 'espera liberacion del area')) {
                btn.style.display = 'none';
            } else {
                btn.style.display = ''; // Asegura que se muestre si corresponde
            }
        }
    } catch (e) {
        console.error('[Revalidaciones] Error consultando estatus-solo:', e);
    }
});