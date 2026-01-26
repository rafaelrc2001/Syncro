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
      if (e) e.preventDefault();
      console.log('[CierreArea] Click en Confirmar Cierre');
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get('id') || window.idPermisoActual;
      console.log('[CierreArea] idPermiso:', idPermiso);
      if (!idPermiso) {
        console.warn('[CierreArea] No se encontró idPermiso');
        return;
      }
      try {
        const respFirma = await fetch(`/api/autorizaciones/ver-firma-operador-area/${idPermiso}`);
        console.log('[CierreArea] Respuesta fetch firma:', respFirma);
        if (respFirma.ok) {
          const data = await respFirma.json();
          console.log('[CierreArea] Data firma:', data);
          const operadorArea = data && data.data && typeof data.data.operador_area !== 'undefined' ? data.data.operador_area : null;
          const firmaBD = data && data.data && typeof data.data.firma_operador_area !== 'undefined' ? data.data.firma_operador_area : null;
          console.log('[CierreArea] operadorArea:', operadorArea, '| firmaBD:', firmaBD);
          // Lógica correcta: si no hay operador, no se exige firma
          if (operadorArea === null || operadorArea === undefined || (typeof operadorArea === 'string' && operadorArea.trim() === '')) {
            console.log('[CierreArea] No hay operador, se permite continuar');
            // No hay operador, continuar
          } else {
            if (firmaBD === null || firmaBD === undefined || (typeof firmaBD === 'string' && firmaBD.trim() === '')) {
              console.warn('[CierreArea] El operador debe firmar antes de continuar.');
              alert('El operador debe firmar antes de continuar.');
              return;
            }
          }
        } else {
          console.error('[CierreArea] No se pudo validar la firma del operador. Status:', respFirma.status);
          alert('No se pudo validar la firma del operador.');
          return;
        }
      } catch (e) {
        console.error('[CierreArea] Error en fetch firma:', e);
        alert('No se pudo validar la firma del operador.');
        return;
      }

      // Obtener usuario desde localStorage
      let usuario = null;
      try {
        const usuarioObj = JSON.parse(localStorage.getItem('usuario'));
        console.log('[CierreArea] usuarioObj:', usuarioObj);
        usuario = usuarioObj && usuarioObj.usuario ? usuarioObj.usuario : null;
      } catch (e) {
        console.error('[CierreArea] Error parseando usuario localStorage:', e);
        usuario = null;
      }
      if (!usuario) {
        console.error('[CierreArea] No se pudo obtener el usuario actual.');
        alert('No se pudo obtener el usuario actual.');
        modalCierre.style.display = 'none';
        return;
      }

      // Preparar datos para el cierre de área
      const cierre_area = usuario;
      // Obtener la hora local de México en formato ISO
      const fecha_hora_cierre_area = new Date().toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).replace(' ', 'T');
      console.log('[CierreArea] Datos a enviar:', { id_permiso: idPermiso, cierre_area, fecha_hora_cierre_area });

      // Enviar el cierre de área
      try {
        const respCierre = await fetch('/api/autorizaciones/cierre-area', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_permiso: idPermiso,
            cierre_area,
            fecha_hora_cierre_area
          }),
        });
        console.log('[CierreArea] Respuesta fetch cierre-area:', respCierre);
        let respCierreData = {};
        try {
          respCierreData = await respCierre.json();
          console.log('[CierreArea] Data cierre-area:', respCierreData);
        } catch (e) {
          console.error('[CierreArea] Error parseando respuesta cierre-area:', e);
        }
        if (respCierre.ok && respCierreData && respCierreData.success) {
          // Ahora obtener el id_estatus usando el id_permiso
          try {
            const respEstatus = await fetch(`/api/estatus/permiso/${idPermiso}`);
            console.log('[CierreArea] Respuesta fetch estatus/permiso:', respEstatus);
            if (respEstatus.ok) {
              const dataEstatus = await respEstatus.json();
              console.log('[CierreArea] Data estatus/permiso:', dataEstatus);
              const id_estatus = dataEstatus && dataEstatus.data && dataEstatus.data.id_estatus;
              if (id_estatus) {
                // Actualizar estatus a 'cierre'
                const respSetCierre = await fetch('/api/estatus/cierre', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id_estatus }),
                });
                console.log('[CierreArea] Respuesta fetch estatus/cierre:', respSetCierre);
                let respSetCierreData = {};
                try {
                  respSetCierreData = await respSetCierre.json();
                  console.log('[CierreArea] Data estatus/cierre:', respSetCierreData);
                } catch (e) {
                  console.error('[CierreArea] Error parseando respuesta estatus/cierre:', e);
                }
                if (respSetCierre.ok && respSetCierreData && respSetCierreData.success) {

                  //mensaje de carga
                  let loadingDiv = document.createElement('div');
                  loadingDiv.id = 'loading-cierre-area';
                  loadingDiv.style.position = 'fixed';
                  loadingDiv.style.top = '0';
                  loadingDiv.style.left = '0';
                  loadingDiv.style.width = '100vw';
                  loadingDiv.style.height = '100vh';
                  loadingDiv.style.background = 'rgba(0,0,0,0.4)';
                  loadingDiv.style.display = 'flex';
                  loadingDiv.style.alignItems = 'center';
                  loadingDiv.style.justifyContent = 'center';
                  loadingDiv.style.zIndex = '9999';
                  loadingDiv.innerHTML = '<div style="background:#fff;padding:2em 3em;border-radius:8px;font-size:1.3em;font-weight:600;">Cargando cierre de área...</div>';
                  document.body.appendChild(loadingDiv);

                  // Enviar notificación de cierre a n8n, pero no bloquear el flujo si falla
                  try {
                    await window.n8nCierreHandler();
                  } catch (e) {
                    console.warn('No se pudo enviar la notificación de cierre a n8n:', e);
                  }

                  // Ocultar mensaje de cargando
                  document.body.removeChild(loadingDiv);

                  // Modal de éxito en vez de alert
                  let modal = document.getElementById('modalCierreAreaExito');
                  if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'modalCierreAreaExito';
                    modal.innerHTML = `
                      <div class="modal-overlay" style="display:flex;position:fixed;top:0;left:0;width:100vw;height:100vh;padding-top:40px;background:rgba(0,0,0,0.3);z-index:2147483647;justify-content:center;align-items:flex-start;">
                        <div class="modal-content" style="background:#fff;padding:2rem 1.5rem;border-radius:8px;box-shadow:0 2px 16px rgba(0,0,0,0.2);max-width:90vw;width:350px;text-align:center;z-index:2147483647;">
                          <h3 style=\"margin-bottom:1rem;color:#388e3c;\">Éxito</h3>
                          <p style=\"margin-bottom:2rem;\">Cierre de área realizado correctamente.</p>
                          <button id=\"btnCerrarModalCierreAreaExito\" style=\"padding:0.5rem 1.5rem;background:#388e3c;color:#fff;border:none;border-radius:4px;cursor:pointer;\">Aceptar</button>
                        </div>
                      </div>
                    `;
                    if (document.body.firstChild) {
                      document.body.insertBefore(modal, document.body.firstChild);
                    } else {
                      document.body.appendChild(modal);
                    }
                  }
                  modal.style.display = 'flex';
                  const btnCerrar = document.getElementById('btnCerrarModalCierreAreaExito');
                  if (btnCerrar) {
                    btnCerrar.onclick = function() {
                      modal.style.display = 'none';
                      window.location.reload();
                    };
                  } else {
                    // fallback: reload after 2s if button not found
                    setTimeout(function() { window.location.reload(); }, 2000);
                  }
                } else {
                  const errorMsg = respSetCierreData && respSetCierreData.error ? respSetCierreData.error : 'Error al actualizar el estatus a cierre.';
                  console.error('[CierreArea] Error al actualizar estatus a cierre:', errorMsg);
                  alert(errorMsg);
                }
              } else {
                console.warn('[CierreArea] No se encontró id_estatus en la respuesta:', dataEstatus);
                alert('No se encontró el estatus para este permiso. Por favor, contacte a soporte o verifique que el permiso esté correctamente registrado.');
              }
            } else if (respEstatus.status === 404) {
              console.warn('[CierreArea] estatus/permiso devolvió 404 para id_permiso:', idPermiso);
              alert('No existe un estatus registrado para este permiso. No se puede actualizar a cierre.');
            } else {
              console.error('[CierreArea] Error inesperado al obtener estatus/permiso:', respEstatus);
              alert('No se pudo obtener el estatus del permiso. Intente de nuevo o contacte a soporte.');
            }
          } catch (e) {
            console.error('[CierreArea] Error al obtener o actualizar estatus:', e);
            alert('Error al actualizar el estatus a cierre.');
          }
        } else {
          const errorMsg = respCierreData && respCierreData.error ? respCierreData.error : 'Error al cerrar el área.';
          console.error('[CierreArea] Error al cerrar el área:', errorMsg);
          alert(errorMsg);
        }
      } catch (err) {
        console.error('[CierreArea] Error de red al intentar cerrar el área:', err);
        alert('Error de red al intentar cerrar el área.');
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