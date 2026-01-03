// ==============================
// Función especial para obtener IP, ubicación y modelo de dispositivo
// Inspirada en obtenerUbicacionYIP.js pero autocontenida para seccion4
async function obtenerDatosDispositivoUbicacion() {
  // Mostrar loader si existe
  if (typeof mostrarLoader === 'function') mostrarLoader();
  let ip = null;
  let localizacion = null;
  let modelo = null;
  // 1. Detectar dispositivo desde backend
  let dispositivo = null;
  try {
    const res = await fetch('/api/detectar-dispositivo');
    dispositivo = await res.json();
    modelo = dispositivo?.modelo || dispositivo?.userAgent || JSON.stringify(dispositivo);
    console.log('[DEBUG][obtenerDatosDispositivoUbicacion] Dispositivo:', dispositivo);
  } catch (e) {
    console.warn('[obtenerDatosDispositivoUbicacion] No se pudo obtener info de dispositivo:', e);
  }
  // 2. Obtener IP pública
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    ip = ipData.ip || 'No disponible';
    console.log('[DEBUG][obtenerDatosDispositivoUbicacion] IP:', ip);
  } catch (e) {
    ip = 'Error obteniendo IP';
    console.warn('[obtenerDatosDispositivoUbicacion] Error IP:', e);
  }
  // 3. Obtener ubicación (si es móvil, forzar; si es PC, opcional)
  function getUbicacionPromise() {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lon = pos.coords.longitude.toFixed(6);
            localizacion = `${lat},${lon}`;
            console.log('[DEBUG][obtenerDatosDispositivoUbicacion] Ubicación:', localizacion);
            resolve(localizacion);
          },
          (err) => {
            console.warn('[obtenerDatosDispositivoUbicacion] Error ubicación:', err);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        resolve(null);
      }
    });
  }
  localizacion = await getUbicacionPromise();
  if (typeof ocultarLoader === 'function') ocultarLoader();
  return { ip, localizacion, modelo, dispositivo };
}
document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // 0.1. Verificación de ubicación obligatoria en móviles
  // ==============================
  function esDispositivoMovil() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod|ios/i.test(ua);
  }

  function mostrarAdvertenciaUbicacion() {
    // Overlay bloqueador
    let overlay = document.getElementById('ubicacion-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ubicacion-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.background = 'rgba(255,243,205,0.98)';
      overlay.style.zIndex = '99999';
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.innerHTML = '<div style="background:#fff3cd;border:1px solid #ffeeba;padding:32px 24px;border-radius:12px;box-shadow:0 2px 16px #0002;font-weight:bold;color:#856404;font-size:1.2em;text-align:center;max-width:90vw;">Debes activar la ubicación para continuar.<br>Actívala en tu dispositivo y acepta el permiso de ubicación.<br><br><span style="font-size:0.95em;font-weight:normal;">Esta pantalla se quitará automáticamente cuando se detecte la ubicación.</span></div>';
      document.body.appendChild(overlay);
    }
  }
  function ocultarAdvertenciaUbicacion() {
    const overlay = document.getElementById('ubicacion-overlay');
    if (overlay) overlay.remove();
  }

  // Si es móvil, verificar ubicación periódicamente
  if (esDispositivoMovil()) {
    // Checar cada 1s si window.datosDispositivoUbicacion.localizacion tiene valor
    const checkUbicacion = setInterval(() => {
      const loc = window.datosDispositivoUbicacion?.localizacion;
      if (!loc || loc === 'null' || loc === '' || loc === undefined) {
        mostrarAdvertenciaUbicacion();
      } else {
        ocultarAdvertenciaUbicacion();
        clearInterval(checkUbicacion);
      }
    }, 1000);
  }
    // Mostrar/ocultar campo 'Otro (especifique)' según selección
    const maintenanceTypeSelect = document.getElementById("maintenance-type");
    const otherMaintenanceContainer = document.getElementById("other-maintenance-container");
    const otherMaintenanceInput = document.getElementById("other-maintenance");
    if (maintenanceTypeSelect && otherMaintenanceContainer) {
      maintenanceTypeSelect.addEventListener("change", function () {
        if (this.value === "OTRO") {
          otherMaintenanceContainer.style.display = "block";
          otherMaintenanceInput && otherMaintenanceInput.setAttribute("required", "required");
        } else {
          otherMaintenanceContainer.style.display = "none";
          otherMaintenanceInput && otherMaintenanceInput.removeAttribute("required");
          if (otherMaintenanceInput) otherMaintenanceInput.value = "";
        }
      });
    }
  // ==============================
  // 0. Configurar botón de cierre del modal
  // ==============================
  const modalCloseBtn = document.getElementById("modal-close-btn");
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/CrearPT.html";
    });
  }

  // ==============================
  // 1. Agregar y eliminar actividades con re-numeración
  // ==============================
  const addActivityBtn = document.getElementById("add-activity");
  const astActivitiesContainer = document.querySelector(".ast-activities");

  // Función para re-numerar actividades y actualizar los atributos name
  function renumerarActividades() {
    const activities = astActivitiesContainer.querySelectorAll(".ast-activity");
    activities.forEach((activity, idx) => {
      const newIndex = idx + 1;
      activity.setAttribute("data-index", newIndex);
      // Columna No.: número automático
      const numberDiv = activity.querySelector(".ast-activity-number");
      if (numberDiv) {
        numberDiv.textContent = newIndex;
      }
      // Actualiza los names de los campos (solo los que existen)
      const activityTextarea = activity.querySelector('textarea[name^="ast-activity-"]');
      if (activityTextarea) activityTextarea.name = `ast-activity-${newIndex}`;
      const textareaHazards = activity.querySelector('textarea[name^="ast-hazards-"]');
      if (textareaHazards) textareaHazards.name = `ast-hazards-${newIndex}`;
      const textareaPreventions = activity.querySelector('textarea[name^="ast-preventions-"]');
      if (textareaPreventions) textareaPreventions.name = `ast-preventions-${newIndex}`;
    });
  }

  // Actualizar el div de secuencia en tiempo real
  if (astActivitiesContainer) {
    // Ya no es necesario actualizar el número con el texto, solo renumerar si se elimina o agrega
  }

  if (addActivityBtn && astActivitiesContainer) {
    addActivityBtn.addEventListener("click", async function () {
      const activityCount = document.querySelectorAll(".ast-activity").length;
      const newIndex = activityCount + 1;

      if (newIndex > 10) {
        alert("Máximo 10 actividades permitidas");
        return;
      }

      // (Eliminado fetch innecesario a /api/participantes)

      // Crear actividad (sin selects, solo columnas requeridas)
      const newActivity = document.createElement("div");
      newActivity.className = "ast-activity";
      newActivity.setAttribute("data-index", newIndex);
      newActivity.innerHTML = `
        <div class="ast-activity-number">${newIndex}</div>
        <div class="ast-activity-field">
          <textarea name="ast-activity-${newIndex}" rows="2" required placeholder="Secuencia de la Actividad"></textarea>
        </div>
        <div class="ast-activity-field">
          <textarea name="ast-hazards-${newIndex}" rows="2" required placeholder="Riesgos Potenciales"></textarea>
        </div>
        <div class="ast-activity-field">
          <textarea name="ast-preventions-${newIndex}" rows="2" required placeholder="Acciones Preventivas"></textarea>
        </div>
        <div class="ast-activities-actions">
          <button type="button" class="action-btn remove-participant" title="Eliminar">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      `;
      astActivitiesContainer.appendChild(newActivity);
      // No es necesario renumerar aquí, solo al eliminar
    });

    // Delegación de eventos para eliminar actividades y renumerar
    astActivitiesContainer.addEventListener("click", function (event) {
      if (event.target.closest(".remove-participant")) {
        const activityDiv = event.target.closest(".ast-activity");
        if (activityDiv) {
          activityDiv.remove();
          renumerarActividades();
        }
      }
    });
  }

  if (astActivitiesContainer) {
    astActivitiesContainer.addEventListener("click", function (event) {
      if (event.target.closest(".remove-participant")) {
        const activityDiv = event.target.closest(".ast-activity");
        if (activityDiv) activityDiv.remove();
      }
    });
  }

  // ==============================
  // 2. Manejar envío del formulario principal
  // ==============================
  const permitForm = document.getElementById("complete-permit-form");
  if (permitForm) {
    permitForm.addEventListener("submit", async function (e) {
      // ==============================
      // Generar timestamp local para la base de datos
      // Usar la función obtenerFechaHoraLocal para obtener la hora exacta local
      const fecha_hora = obtenerFechaHoraLocal();

      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const id_usuario = usuario?.id_usuario;
      // Obtener id_departamento desde el input hidden (rellenado por el autocompletado)
      let id_departamento = null;
      const departamentoIdHidden = document.getElementById("departamento-id-hidden");
      if (departamentoIdHidden && departamentoIdHidden.value && !isNaN(Number(departamentoIdHidden.value))) {
        id_departamento = Number(departamentoIdHidden.value);
      
      }
      // ==============================

      if (!id_departamento || isNaN(Number(id_departamento))) {
        alert(
          "Error: No se pudo obtener el departamento del usuario. No se puede registrar el permiso."
        );
        return;
      }

      // Validar que plant_value no esté vacío antes de continuar
      let plantValue = sessionStorage.getItem("plant_value");
      // Si no está en sessionStorage, intenta leer del input hidden
      if (!plantValue || isNaN(parseInt(plantValue, 10))) {
        const plantIdHidden = document.getElementById("plant-id-hidden");
        if (
          plantIdHidden &&
          plantIdHidden.value &&
          !isNaN(parseInt(plantIdHidden.value, 10))
        ) {
          plantValue = plantIdHidden.value;
          sessionStorage.setItem("plant_value", plantValue); // Sincroniza por si acaso
        }
      }
      if (!plantValue || isNaN(parseInt(plantValue, 10))) {
        // Mostrar advertencia visual en el input de área si existe
        const plantInput = document.getElementById("plant");
        let warning = document.getElementById("plant-warning");
        if (plantInput && !warning) {
          warning = document.createElement("div");
          warning.id = "plant-warning";
          warning.style.color = "#d9534f";
          warning.style.fontSize = "0.95em";
          warning.style.marginTop = "4px";
          warning.textContent =
            "Debe seleccionar un área válida de la lista antes de continuar.";
          plantInput.parentNode.insertBefore(warning, plantInput.nextSibling);
        }
        alert(
          "Debe seleccionar un área válida de la lista antes de continuar."
        );
        e.preventDefault();
        return;
      }
      // Log para ver el valor de plant_value justo antes de leerlo
      console.log(
        "[DEBUG] (submit) sessionStorage.plant_value:",
        sessionStorage.getItem("plant_value")
      );
      e.preventDefault();

      const submitBtn = permitForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="ri-loader-4-line ri-spin"></i> Procesando...';

      // Obtener el valor del número de contrato (opcional)
      const contrato =
        document.getElementById("contract-number")?.value || null;

      // Validación rápida: no permitir enviar si falta la hora
      const horaInput = document.getElementById("start-time");
      if (horaInput && !horaInput.value) {
        alert(
          "Por favor, selecciona una hora de inicio antes de enviar el formulario."
        );
        e.preventDefault();
        return;
      }
      try {
        // === Validar sección 4 ===
        const section4 = document.querySelector(
          '.form-section[data-section="4"]'
        );
        const requiredFields = section4.querySelectorAll("[required]");
        let allFilled = true;

        // Validar que exista al menos una actividad
        const astActivitiesContainer1 = document.querySelector(".ast-activities");
        const activityDivs = astActivitiesContainer1 ? astActivitiesContainer1.querySelectorAll(".ast-activity") : [];
        if (!activityDivs || activityDivs.length === 0) {
          alert("Debe agregar al menos una actividad antes de continuar.");
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }

        // Validar que la firma no esté vacía (canvas)
        const canvasFirma = document.getElementById('canvasFirma');
        function isCanvasBlank(c) {
          if (!c) return true;
          const blank = document.createElement('canvas');
          blank.width = c.width;
          blank.height = c.height;
          return c.toDataURL() === blank.toDataURL();
        }
        if (isCanvasBlank(canvasFirma)) {
          alert('Por favor, firma antes de enviar el permiso.');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }

        requiredFields.forEach((field) => {
          if (!field.value.trim()) {
            field.style.borderColor = "#ff4444";
            allFilled = false;
            field.addEventListener(
              "input",
              function () {
                this.style.borderColor = "";
              },
              { once: true }
            );
          }
        });

        if (!allFilled) {
          const modal = document.getElementById("confirmation-modal");
          if (modal) {
            modal.querySelector("h3").textContent =
              "Campos requeridos faltantes";
            modal.querySelector("p").textContent =
              "Por favor completa todos los campos obligatorios antes de guardar el permiso.";
            modal.classList.add("active");
          } else {
            alert(
              "Por favor completa todos los campos obligatorios antes de guardar el permiso."
            );
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }

        // Recuperar y validar los ids
        const id_area = parseInt(sessionStorage.getItem("plant_value"), 10);
        // Obtener id del departamento del usuario logueado
        //let id_departamento = 1;
        //const usuario = JSON.parse(localStorage.getItem("usuario"));
        //if (usuario && usuario.id) {
        //  id_departamento = Number(usuario.id);
        //}
        const id_sucursal = parseInt(sessionStorage.getItem("id_sucursal"), 10);
        // id_tipo_permiso eliminado, ya no se usa
        // id_estatus eliminado, ya no se usa
        // Log para depuración de IDs
        console.log("[DEBUG] Validación de IDs:", {
          id_area,
          id_departamento,
          id_sucursal
        });

        // === NUEVOS CAMPOS A ENVIAR ===
        let tipo_mantenimiento = document.getElementById("maintenance-type")?.value || null;
        if (tipo_mantenimiento === "OTRO") {
          const otroValor = document.getElementById("other-maintenance")?.value?.trim();
          if (otroValor) {
            tipo_mantenimiento = otroValor;
          }
        }
        const ot_numero = document.getElementById("work-order")?.value || null;
        const tag = document.getElementById("tag")?.value || null;
        const hora_inicio = document.getElementById("start-time")?.value || null;
        const equipo_intervenir = document.getElementById("equipment")?.value || null;
        const descripcion_trabajo = document.getElementById("work-description")?.value || null;
        const nombre_solicitante = document.getElementById("applicant")?.value || null;
        const empresa = document.getElementById("company")?.value || null;
        const nombre_departamento = document.getElementById("subcontract")?.value || null;

        // Permiso altura y otros campos especiales
        const PAL_EPP_1 = document.getElementById("linea_vida")?.value || null;
        const PAL_EPP_2 = document.getElementById("linea_vida_amortiguador")?.value || null;
        const PAL_FA_1 = document.getElementById("presencia_lluvia")?.value || null;
        const PAL_FA_2 = document.getElementById("velocidad_viento")?.value || null;
        const PAL_EPC_1 = document.getElementById("puntos_anclaje")?.value || null;
        const PAL_EPC_2 = document.getElementById("linea_vida_acero")?.value || null;
        const PAL_CR_1 = document.getElementById("requiere_andamio")?.value || null;
        const PCO_EH_1 = document.getElementById("ventilacion_artificial")?.value || null;
        const PCO_MA_1 = document.getElementById("temp")?.value || null;
        const PCO_MA_2 = document.getElementById("guardavida")?.value || null;
        const PCO_MA_3 = document.getElementById("suplente")?.value || null;
        const PCO_MA_4 = document.getElementById("permanencia")?.value || null;
        const PCO_MA_5 = document.getElementById("descanso")?.value || null;
        const PCO_ERA_1 = document.getElementById("rescatista")?.value || null;
        const PFG_CR_1 = document.getElementById("vigia_fuego")?.value || null;
        const PFG_CR_1A = document.getElementById("nombresVigiasAdicionales")?.value || null;
        const PFG_EPPE_1 = document.getElementById("eppOtro1")?.value || null;
        const PFG_EPPE_2 = document.getElementById("eppOtro2")?.value || null;
        const PFG_MA_1 = document.getElementById("temperatura_fuego")?.value || null;
        const PFG_MA_2 = document.getElementById("nombreVigiafuego")?.value || null;
        const PFG_MA_3 = document.getElementById("nombreSuplentefuego")?.value || null;
        const PAP_CE_1 = document.getElementById("suspender_trabajos")?.value || null;
        const PAP_CE_2 = document.getElementById("monitoreo_gases")?.value || null;
        const PAP_EPE_1 = document.getElementById("full-face_apertura")?.value || null;



      
    const pno_cr_1= document.getElementById("pno_cr_1")?.value || null;
    const pno_cr_2= document.getElementById("pno_cr_2")?.value || null;
    const pno_cr_3= document.getElementById("pno_cr_3")?.value || null;
    const pno_cr_4= document.getElementById("pno_cr_4")?.value || null;
    const pno_cr_5= document.getElementById("pno_cr_5")?.value || null;
    const pno_cr_6= document.getElementById("pno_cr_6")?.value || null;
    const pno_cr_7= document.getElementById("pno_cr_7")?.value || null;
    const pno_cr_8= document.getElementById("pno_cr_8")?.value || null;
    const pno_cr_9= document.getElementById("pno_cr_9")?.value || null;
    const pno_cr_10= document.getElementById("pno_cr_10")?.value || null;
    const pno_cr_11= document.getElementById("pno_cr_11")?.value || null;
    const pno_cr_12= document.getElementById("pno_cr_12")?.value || null;
    const pno_cr_13= document.getElementById("pno_cr_13")?.value || null;
    const pno_epe_1= document.getElementById("pno_epe_1")?.value || null;
    const pno_epe_2= document.getElementById("pno_epe_2")?.value || null;
    const pno_epe_3= document.getElementById("pno_epe_3")?.value || null;
    const pno_epe_4= document.getElementById("pno_epe_4")?.value || null;
    const pno_epe_5= document.getElementById("pno_epe_5")?.value || null;
    const pno_epe_6= document.getElementById("pno_epe_6")?.value || null;
    const pno_epe_7= document.getElementById("pno_epe_7")?.value || null;
    const pno_epe_8= document.getElementById("pno_epe_8")?.value || null;
    const pno_epe_9= document.getElementById("pno_epe_9")?.value || null;
    




        //tipos de permiso
        const columna_fuego_valor = document.getElementById("columna_fuego_valor")?.textContent || null;
        const columna_altura_valor = document.getElementById("columna_altura_valor")?.textContent || null;
        const columna_apertura_valor = document.getElementById("columna_apertura_valor")?.textContent || null;
        const columna_confinado_valor = document.getElementById("columna_confinado_valor")?.textContent || null;
        // Siempre obtener el valor del span oculto para Permiso No Peligroso


        const firma_creacion = document.getElementById("outputBase64Firma")?.value || null;

        let columna_nopeligrosovalor_valor = null;
        const spanNoPeligroso = document.getElementById("columna_nopeligroso_valor");
        if (spanNoPeligroso) {
          columna_nopeligrosovalor_valor = spanNoPeligroso.textContent || spanNoPeligroso.value || null;
        }
        // Log para depuración
        console.log("[DEBUG] columna_nopeligrosovalor_valor a enviar:", columna_nopeligrosovalor_valor);

        // Log para depuración
        console.log(
          "[DEBUG] id_area:",
          id_area,
          "plant_value:",
          sessionStorage.getItem("plant_value")
        );
        console.log("[DEBUG] id_departamento:", id_departamento);
        console.log(
          "[DEBUG] id_sucursal:",
          id_sucursal,
          "id_sucursal_raw:",
          sessionStorage.getItem("id_sucursal")
        );

        // Validar que todos los ids sean números válidos (sin id_estatus)
        if (
          [
            id_area,
            id_departamento,
            id_sucursal
          ].some((v) => isNaN(v) || typeof v !== "number")
        ) {
          alert(
            "Error: Debe seleccionar correctamente todas las listas (área, sucursal, etc)."
          );
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }

        // === Obtener IP, dispositivo y localización desde window.datosDispositivoUbicacion ===
        let ip_creacion = null;
        let dispositivo_creacion = null;
        let localizacion_creacion = null;
        // DEBUG: Mostrar el objeto global antes de usarlo
        console.log('[DEBUG][submit] window.datosDispositivoUbicacion:', window.datosDispositivoUbicacion);
        if (window.datosDispositivoUbicacion) {
          ip_creacion = window.datosDispositivoUbicacion.ip || null;
          dispositivo_creacion = window.datosDispositivoUbicacion.modelo || null;
          localizacion_creacion = window.datosDispositivoUbicacion.localizacion;
          if (!localizacion_creacion || localizacion_creacion === 'null' || localizacion_creacion === '') {
            localizacion_creacion = '/';
          }
        }
        console.log('[DEBUG][submit] ip_creacion:', ip_creacion, 'dispositivo_creacion:', dispositivo_creacion, 'localizacion_creacion:', localizacion_creacion);
        // Si es móvil y localizacion_creacion sigue null, advertir al usuario y bloquear envío
        function esDispositivoMovil() {
          const ua = navigator.userAgent || navigator.vendor || window.opera;
          return /android|iphone|ipad|ipod|ios/i.test(ua);
        }
        if (esDispositivoMovil() && (!localizacion_creacion || localizacion_creacion === 'null' || localizacion_creacion === '')) {
          alert('Debes activar la ubicación en tu dispositivo para poder guardar el permiso.');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }


        const datosPermisos = {
           id_area,
            id_departamento,
            id_sucursal,
            contrato,
            fecha_hora,
            id_usuario,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervenir,
            descripcion_trabajo,
            nombre_solicitante,
            empresa,
            PAL_EPP_1,
            PAL_EPP_2,
            PAL_FA_1,
            PAL_FA_2,
            PAL_EPC_1,
            PAL_EPC_2,
            PAL_CR_1,
            PCO_EH_1,
            PCO_MA_1,
            PCO_MA_2,
            PCO_MA_3,
            PCO_MA_4,
            PCO_MA_5,
            PCO_ERA_1,
            PFG_CR_1,
            PFG_CR_1A,
            PFG_EPPE_1,
            PFG_EPPE_2,
            PFG_MA_1,
            PFG_MA_2,
            PFG_MA_3,
            PAP_CE_1,
            PAP_CE_2,
            PAP_EPE_1,
            nombre_departamento,
            columna_fuego_valor,
            columna_altura_valor,
            columna_apertura_valor,
            columna_confinado_valor,
            pno_cr_1,
            pno_cr_2,
            pno_cr_3,
            pno_cr_4,
            pno_cr_5,
            pno_cr_6,
            pno_cr_7,
            pno_cr_8,
            pno_cr_9,
            pno_cr_10,
            pno_cr_11,
            pno_cr_12,
            pno_cr_13,
            pno_epe_1,
            pno_epe_2,
            pno_epe_3,
            pno_epe_4,
            pno_epe_5,
            pno_epe_6,
            pno_epe_7,
            pno_epe_8,
            pno_epe_9,
            columna_nopeligrosovalor_valor,


firma_creacion,


ip_creacion,
            dispositivo_creacion,
            localizacion_creacion,

        };


  console.log('[PERMISO][ENVIAR] Valores a la base de datos:', datosPermisos);

        
        // 1. Insertar permiso (ahora todo va a permisos_trabajo)
        const permisoResponse = await fetch("/api/permisos-trabajo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_area,
            id_departamento,
            id_sucursal,
            contrato,
            fecha_hora,
            id_usuario,
            tipo_mantenimiento,
            ot_numero,
            tag,
            hora_inicio,
            equipo_intervenir,
            descripcion_trabajo,
            nombre_solicitante,
            empresa,
            PAL_EPP_1,
            PAL_EPP_2,
            PAL_FA_1,
            PAL_FA_2,
            PAL_EPC_1,
            PAL_EPC_2,
            PAL_CR_1,
            PCO_EH_1,
            PCO_MA_1,
            PCO_MA_2,
            PCO_MA_3,
            PCO_MA_4,
            PCO_MA_5,
            PCO_ERA_1,
            PFG_CR_1,
            PFG_CR_1A,
            PFG_EPPE_1,
            PFG_EPPE_2,
            PFG_MA_1,
            PFG_MA_2,
            PFG_MA_3,
            PAP_CE_1,
            PAP_CE_2,
            PAP_EPE_1,
            nombre_departamento,
            columna_fuego_valor,
            columna_altura_valor,
            columna_apertura_valor,
            columna_confinado_valor,
            pno_cr_1,
            pno_cr_2,
            pno_cr_3,
            pno_cr_4,
            pno_cr_5,
            pno_cr_6,
            pno_cr_7,
            pno_cr_8,
            pno_cr_9,
            pno_cr_10,
            pno_cr_11,
            pno_cr_12,
            pno_cr_13,
            pno_epe_1,
            pno_epe_2,
            pno_epe_3,
            pno_epe_4,
            pno_epe_5,
            pno_epe_6,
            pno_epe_7,
            pno_epe_8,
            pno_epe_9,
            columna_nopeligrosovalor_valor,


firma_creacion,


ip_creacion,
            dispositivo_creacion,
            localizacion_creacion,




          }),
        });
        const permisoResult = await permisoResponse.json();
        if (!permisoResponse.ok || !permisoResult.success)
          throw new Error(
            permisoResult.error || "Error al guardar permiso de trabajo"
          );

        // 2. Insertar participantes con id_permiso
        let id_permiso = permisoResult.data.id_permiso || permisoResult.data.id;
        // --- RECOLECTAR PARTICIPANTES DEL DOM ---
        function collectParticipants() {
          const participants = [];
          const rows = document.querySelectorAll(".participant-row");
          rows.forEach((row) => {
            const nombre = row.querySelector('input[name^="participant-name-"]')?.value?.trim() || "";
            const credencial = row.querySelector('input[name^="participant-credential-"]')?.value?.trim() || "";
            const cargo = row.querySelector('input[name^="participant-position-"]')?.value?.trim() || "";
            const funcion = row.querySelector('select[name^="participant-role-"]')?.value?.trim() || "";
            if (nombre && credencial) {
              participants.push({
                nombre,
                credencial,
                cargo,
                funcion,
                id_permiso
              });
            }
          });
          return participants;
        }

        const participants = collectParticipants();
        if (participants.length === 0) {
          alert("Debe agregar al menos un participante antes de continuar.");
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }
        // --- ENVIAR PARTICIPANTES AL BACKEND ---
        const participantesResponse = await fetch("/api/ast-participan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participants }),
        });
        const participantesResult = await participantesResponse.json();
        if (!participantesResponse.ok || !participantesResult.success) {
          throw new Error(participantesResult.error || "Error al guardar participantes");
        }

        // 3. Insertar actividades AST si existen
        const astActivitiesContainer = document.querySelector(".ast-activities");
        if (astActivitiesContainer) {
          const actividades = [];
          const activityDivs = astActivitiesContainer.querySelectorAll(".ast-activity");
          activityDivs.forEach((div, idx) => {
            const secuencia_actividad = div.querySelector('textarea[name^="ast-activity-"]')?.value?.trim() || "";
            const peligros_potenciales = div.querySelector('textarea[name^="ast-hazards-"]')?.value?.trim() || "";
            const acciones_preventivas = div.querySelector('textarea[name^="ast-preventions-"]')?.value?.trim() || "";
            if (secuencia_actividad && peligros_potenciales && acciones_preventivas) {
              actividades.push({
                id_permiso,
                secuencia_actividad,
                peligros_potenciales,
                acciones_preventivas
              });
            }
          });
          if (actividades.length > 0) {
            const actividadesResponse = await fetch("/api/ast-actividades", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ actividades }),
            });
            const actividadesResult = await actividadesResponse.json();
            if (!actividadesResponse.ok || !actividadesResult.success) {
              throw new Error(actividadesResult.error || "Error al guardar actividades AST");
            }
          }
        }

        // 3. Insertar estatus automáticamente como en sección 1
        try {
          const estatusResponse = await fetch("/api/estatus/default", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_permiso }),
          });
          const estatusResult = await estatusResponse.json();
          if (!estatusResponse.ok || !estatusResult.success) {
            throw new Error(estatusResult.error || "Error al guardar estatus final");
          }
          // Guardar id_estatus en sessionStorage si es necesario
          if (estatusResult.data && estatusResult.data.id) {
            sessionStorage.setItem("id_estatus", estatusResult.data.id);
          }
        } catch (estatusError) {
          console.error("Error al guardar estatus:", estatusError);
          alert("Error al guardar el estatus final: " + (estatusError.message || estatusError));
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }

        // Mostrar modal de éxito
        const modal = document.getElementById("confirmation-modal");
        if (modal) {
          modal.querySelector("h3").textContent = "Permiso creado exitosamente";
          const permitNumber = `GSI-PT-N${permisoResult.data.id_permiso || permisoResult.data.id}`;
          window.permitNumber = permitNumber;
          const permitText = `El permiso de trabajo ha sido registrado en el sistema con el número: <strong id=\"generated-permit\">${permitNumber}</strong>`;
          modal.querySelector("p").innerHTML = permitText;
          modal.classList.add("active");
        }

      } catch (error) {
        console.error("Error:", error);
        const modal = document.getElementById("confirmation-modal");
        if (modal) {
          modal.querySelector("h3").textContent = "Error al enviar";
          modal.querySelector("p").textContent =
            "Error al procesar la solicitud: " + error.message;
          modal.classList.add("active");
        } else {
          alert("Error al procesar la solicitud: " + error.message);
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }

  // ==============================
  // 3. Función simulada para compatibilidad
  // ==============================
  window.handleN8NFormSubmission = async function () {
    console.log("Modo de prueba: No se está usando n8n");
    return true;
  };

  // ==============================
  // 4. Imprimir en consola el nombre seleccionado en los selects AST
  // ==============================
  function imprimirNombreSeleccionado(event) {
    const select = event.target;
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.value) {
      console.log(
        `Seleccionado en ${select.name}: ${selectedOption.textContent}`
      );
    }
  }

  document.addEventListener("change", function (event) {
    if (
      event.target.matches('select[name^="ast-personnel-"]') ||
      event.target.matches('select[name^="ast-responsible-"]')
    ) {
      imprimirNombreSeleccionado(event);
    }
  });
});

// ==============================
// 5. Poblar selects de participantes dinámicamente
// ==============================

// Debug idAst
const idAst = sessionStorage.getItem("id_ast");
console.log("[DEBUG] idAst leído en seccion4:", idAst);

// ==============================
// Rutas del servidor (simuladas para este contexto)
// ==============================
const express = require("express");
const router = express.Router();
const pool = require("./dbPool"); // Suponiendo que este es el archivo donde está configurada la conexión a la base de datos

// Obtener participantes
router.get("/api/participantes", async (req, res) => {
  const id_estatus = parseInt(req.query.id_estatus, 10); // Asegura que sea entero
  let query = "SELECT * FROM ast_participan";
  let params = [];
  if (id_estatus) {
    query += " WHERE id_estatus = $1";
    params = [id_estatus];
  }
  console.log("[DEBUG] Query ejecutada:", query, params);
  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const formulariosRouter = require("./formularios");
app.use("/api", formulariosRouter);

function mostrarMensajeError() {
  // alert eliminado para no mostrar ventana emergente
}

function textoABoolean(valor) {
  if (typeof valor === "string") {
    return valor.trim().toLowerCase() === "si";
  }
  return !!valor;
}

function obtenerFechaHoraLocal() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}


