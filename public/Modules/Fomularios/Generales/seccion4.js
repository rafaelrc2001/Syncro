document.addEventListener("DOMContentLoaded", () => {
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

      // Obtener participantes filtrados por estatus desde el backend
      let participantes = [];
      try {
        const idEstatus = sessionStorage.getItem("id_estatus");
        const response = await fetch(
          `/api/participantes?id_estatus=${idEstatus}`
        );
        participantes = await response.json();
      } catch (error) {
        console.error("Error al obtener participantes:", error);
      }

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
      const id_departamento = usuario?.id_departamento;
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
        // === Validar sección 4
        const section4 = document.querySelector(
          '.form-section[data-section="4"]'
        );
        const requiredFields = section4.querySelectorAll("[required]");
        let allFilled = true;

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
        const id_estatus = parseInt(sessionStorage.getItem("id_estatus"), 10);
        // id_ast_actividad eliminado, ya no se usa

        // === NUEVOS CAMPOS A ENVIAR ===
        const tipo_mantenimiento = document.getElementById("maintenance-type")?.value || null;
        const ot_numero = document.getElementById("work-order")?.value || null;
        const tag = document.getElementById("tag")?.value || null;
        const hora_inicio = document.getElementById("start-time")?.value || null;
        const equipo_intervenir = document.getElementById("equipment")?.value || null;
        const descripcion_trabajo = document.getElementById("work-description")?.value || null;
        const nombre_solicitante = document.getElementById("applicant")?.value || null;
        const empresa = document.getElementById("company")?.value || null;

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
        console.log(
          "[DEBUG] id_estatus:",
          id_estatus,
          "id_estatus_raw:",
          sessionStorage.getItem("id_estatus")
        );

        // Validar que todos los ids sean números válidos
        if (
          [
            id_area,
            id_departamento,
            id_sucursal,
            id_estatus,
          ].some((v) => isNaN(v) || typeof v !== "number")
        ) {
          alert(
            "Error: Debe seleccionar correctamente todas las listas (área, sucursal, estatus, etc)."
          );
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHTML;
          return;
        }

        // 1. Insertar permiso (ahora todo va a permisos_trabajo)
        const permisoResponse = await fetch("/api/permisos-trabajo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_area,
            id_departamento,
            id_sucursal,
            id_estatus,
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
          }),
        });
        const permisoResult = await permisoResponse.json();
        if (!permisoResponse.ok || !permisoResult.success)
          throw new Error(
            permisoResult.error || "Error al guardar permiso de trabajo"
          );

        // 2. Insertar actividades AST si existen
        const astActivitiesContainer = document.querySelector(".ast-activities");
        if (astActivitiesContainer) {
          const actividades = [];
          const id_permiso = permisoResult.data.id_permiso || permisoResult.data.id;
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
async function poblarSelectParticipantes() {
  const idEstatus = sessionStorage.getItem("id_estatus");
  console.log("[POBLAR] Iniciando poblado de selects con id_estatus:", idEstatus);
  
  if (!idEstatus || idEstatus === "undefined" || idEstatus === "") {
    console.warn(
      "[POBLAR] id_estatus no está definido o es inválido, no se poblan los selects."
    );
    return;
  }
  try {
    const url = `/api/participantes?id_estatus=${idEstatus}`;
    console.log("[POBLAR] Haciendo fetch a:", url);
    
    const response = await fetch(url);
    const participantes = await response.json();

    console.log("[POBLAR] Respuesta recibida:", participantes);
    console.log("[POBLAR] Cantidad de participantes:", participantes?.length || 0);

    if (!Array.isArray(participantes)) {
      console.error(
        "[POBLAR] La respuesta de participantes no es un array:",
        participantes
      );
      return;
    }

    if (participantes.length === 0) {
      console.warn("[POBLAR] No hay participantes para poblar");
      return;
    }

    const selectsPersonal = document.querySelectorAll(
      'select[name^="ast-personnel-"]'
    );
    console.log("[POBLAR] Selects de personal encontrados:", selectsPersonal.length);
    
    selectsPersonal.forEach((select, index) => {
      select.innerHTML = '<option value="">-- Seleccione --</option>';
      participantes.forEach((part) => {
        const option = document.createElement("option");
        option.value = part.id_ast_participan;
        option.textContent = part.nombre;
        select.appendChild(option);
      });
      console.log(`[POBLAR] Select personal ${index + 1} poblado con ${participantes.length} opciones`);
    });

    const selectsResponsable = document.querySelectorAll(
      'select[name^="ast-responsible-"]'
    );
    console.log("[POBLAR] Selects de responsable encontrados:", selectsResponsable.length);
    
    selectsResponsable.forEach((select, index) => {
      select.innerHTML = '<option value="">-- Seleccione --</option>';
      participantes.forEach((part) => {
        const option = document.createElement("option");
        option.value = part.id_ast_participan;
        option.textContent = part.nombre;
        select.appendChild(option);
      });
      console.log(`[POBLAR] Select responsable ${index + 1} poblado con ${participantes.length} opciones`);
    });
    
    console.log("[POBLAR] ✅ Todos los selects poblados exitosamente");
  } catch (error) {
    console.error("[POBLAR] ❌ Error al poblar participantes:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Intentar poblar al cargar la página
  poblarSelectParticipantes();
  
  // Observar cuando se activa la sección 4
  const section4 = document.querySelector('.form-section[data-section="4"]');
  if (section4) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (section4.classList.contains('active')) {
            console.log("[SECTION4] Sección 4 activada, poblando selects...");
            poblarSelectParticipantes();
          }
        }
      });
    });
    
    observer.observe(section4, { attributes: true });
  }
  
  const btnSaveParticipants = document.getElementById("btn-save-participants");
  if (btnSaveParticipants) {
    btnSaveParticipants.addEventListener("click", function () {
      console.log("[SECTION4] Botón participantes clickeado, poblando selects...");
      setTimeout(() => {
        poblarSelectParticipantes();
      }, 200);
    });
  }
});

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
