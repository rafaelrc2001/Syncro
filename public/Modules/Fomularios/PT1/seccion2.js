// Campos del toggle
function initEquipmentToggle() {
  const equipmentRadios = document.querySelectorAll(
    'input[name="has-equipment"]'
  );
  // Selecciones seguras de elementos (evitar .closest() sobre null)
  const equipmentEl = document.getElementById("equipment");
  const equipmentGroup = equipmentEl
    ? equipmentEl.closest(".form-group")
    : null;
  const tagEl = document.getElementById("tag");
  const tagGroup = tagEl ? tagEl.closest(".form-group") : null;
  const equipmentConditionsTitle = document.getElementById(
    "equipment-conditions-title"
  );
  const equipmentConditionsGrid = document.getElementById(
    "equipment-conditions-grid"
  );

  // Campos adicionales
  const fluidField = document.getElementById("fluid");
  const pressureField = document.getElementById("pressure");
  const temperatureField = document.getElementById("temperature");

  function toggleEquipmentFields() {
    const checked = document.querySelector(
      'input[name="has-equipment"]:checked'
    );
    const showEquipment = checked && checked.value === "si";

    // Si vamos a ocultar, preservamos los valores actuales en data-preserve
    if (!showEquipment) {
      // Preservar valores de inputs (excepto `tag`, que no queremos preservar)
      if (equipmentEl) equipmentEl.dataset.preserve = equipmentEl.value;
      if (fluidField) fluidField.dataset.preserve = fluidField.value;
      if (pressureField) pressureField.dataset.preserve = pressureField.value;
      if (temperatureField)
        temperatureField.dataset.preserve = temperatureField.value;

      // También guardar en sessionStorage como respaldo (no guardar `tag`)
      try {
        if (equipmentEl)
          sessionStorage.setItem("preserve_equipment", equipmentEl.value || "");
        // Asegurarse de que no exista tag preservado
        sessionStorage.removeItem("preserve_tag");
        if (fluidField)
          sessionStorage.setItem("preserve_fluid", fluidField.value || "");
        if (pressureField)
          sessionStorage.setItem(
            "preserve_pressure",
            pressureField.value || ""
          );
        if (temperatureField)
          sessionStorage.setItem(
            "preserve_temperature",
            temperatureField.value || ""
          );
        console.debug("[EQUIP-TGL] valores preservados en sessionStorage");
      } catch (e) {
        console.warn("[EQUIP-TGL] no se pudo guardar en sessionStorage:", e);
      }

      // Limpiar el valor de `tag` inmediatamente cuando el usuario selecciona NO
      if (tagEl) {
        tagEl.value = "";
      }

      // También limpiar el valor del campo `equipment` visualmente (pero
      // mantenemos la preservación en dataset/sessionStorage para poder
      // restaurarlo si el usuario vuelve a seleccionar "Sí")
      if (equipmentEl) {
        equipmentEl.value = "";
      }

      // Helper: limpiar elementos que muestran el valor (spans/labels dinámicos)
      const clearAssociatedDisplays = (inputEl) => {
        if (!inputEl || !inputEl.id) return;
        const id = inputEl.id;
        // patrones comunes de elementos que muestran valores
        const selectors = [
          `#${id}-display`,
          `.${id}-display`,
          `#display-${id}`,
          `.${id}_display`,
          `[data-display-for="${id}"]`,
          `[data-bind="${id}"]`,
        ];
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) el.textContent = "";
        }
        // Si la etiqueta <label for="id"> contiene un span.value, vaciarlo
        const lbl = document.querySelector(`label[for="${id}"]`);
        if (lbl) {
          const valSpan = lbl.querySelector(".value");
          if (valSpan) valSpan.textContent = "";
        }
      };

      // Limpiar displays asociados a los campos relevantes
      clearAssociatedDisplays(tagEl);
      clearAssociatedDisplays(equipmentEl);
      clearAssociatedDisplays(fluidField);
      clearAssociatedDisplays(pressureField);
      clearAssociatedDisplays(temperatureField);
    }

    // Mostrar/ocultar contenedores
    if (equipmentGroup)
      equipmentGroup.style.display = showEquipment ? "block" : "none";
    if (tagGroup) tagGroup.style.display = showEquipment ? "block" : "none";
    if (equipmentConditionsTitle)
      equipmentConditionsTitle.style.display = showEquipment ? "block" : "none";
    if (equipmentConditionsGrid)
      equipmentConditionsGrid.style.display = showEquipment ? "block" : "none";

    // Restaurar preservados si mostramos
    if (showEquipment) {
      if (equipmentEl && equipmentEl.dataset.preserve !== undefined) {
        equipmentEl.value = equipmentEl.dataset.preserve;
        delete equipmentEl.dataset.preserve;
      }
      // NOTE: tag intentionally NOT restored when user selected NO (we clear it)
      if (fluidField && fluidField.dataset.preserve !== undefined) {
        fluidField.value = fluidField.dataset.preserve;
        delete fluidField.dataset.preserve;
      }
      if (pressureField && pressureField.dataset.preserve !== undefined) {
        pressureField.value = pressureField.dataset.preserve;
        delete pressureField.dataset.preserve;
      }
      if (temperatureField && temperatureField.dataset.preserve !== undefined) {
        temperatureField.value = temperatureField.dataset.preserve;
        delete temperatureField.dataset.preserve;
      }
      // Si no había dataset preserved (o el nodo fue reemplazado), intentar restaurar desde sessionStorage
      try {
        if (equipmentEl && (!equipmentEl.value || equipmentEl.value === "")) {
          const v = sessionStorage.getItem("preserve_equipment");
          if (v !== null) {
            equipmentEl.value = v;
            console.debug(
              "[EQUIP-TGL] restaurado equipment desde sessionStorage:",
              v
            );
            sessionStorage.removeItem("preserve_equipment");
          }
        }
        // tag is not restored from sessionStorage by design when user selected NO
        if (fluidField && (!fluidField.value || fluidField.value === "")) {
          const v = sessionStorage.getItem("preserve_fluid");
          if (v !== null) {
            fluidField.value = v;
            sessionStorage.removeItem("preserve_fluid");
          }
        }
        if (
          pressureField &&
          (!pressureField.value || pressureField.value === "")
        ) {
          const v = sessionStorage.getItem("preserve_pressure");
          if (v !== null) {
            pressureField.value = v;
            sessionStorage.removeItem("preserve_pressure");
          }
        }
        if (
          temperatureField &&
          (!temperatureField.value || temperatureField.value === "")
        ) {
          const v = sessionStorage.getItem("preserve_temperature");
          if (v !== null) {
            temperatureField.value = v;
            sessionStorage.removeItem("preserve_temperature");
          }
        }
      } catch (e) {
        console.warn(
          "[EQUIP-TGL] no se pudo restaurar desde sessionStorage:",
          e
        );
      }
    }

    // Ajustar required
    if (equipmentEl) equipmentEl.required = showEquipment;
    if (tagEl) tagEl.required = showEquipment;
    if (fluidField) fluidField.required = showEquipment;
    if (pressureField) pressureField.required = showEquipment;
    if (temperatureField) temperatureField.required = showEquipment;
  }

  equipmentRadios.forEach((radio) => {
    radio.addEventListener("change", toggleEquipmentFields);
  });

  toggleEquipmentFields();
}

document.addEventListener("DOMContentLoaded", () => {
  initEquipmentToggle();

  // Campo "OTRO"
  const maintenanceSelect = document.getElementById("maintenance-type");
  const otherContainer = document.getElementById("other-maintenance-container");
  const otherInput = document.getElementById("other-maintenance");

  if (maintenanceSelect && otherContainer) {
    maintenanceSelect.addEventListener("change", function () {
      if (this.value === "OTRO") {
        otherContainer.style.display = "block";
        otherInput.required = true;
      } else {
        otherContainer.style.display = "none";
        otherInput.required = false;
        otherInput.value = "";
      }
    });
  }

  // ============================================================================
  // INICIO: FUNCIONALIDAD DE DRAG AND DROP PARA CONSTRUCTOR DE FORMATO
  // ============================================================================
  // Esta sección implementa la funcionalidad de arrastrar y soltar formularios
  // Los formularios están pre-creados como templates en HTML y se clonan al arrastrar
  // ============================================================================

  initDragAndDropConstructor();
});

/**
 * Inicializa el sistema de Drag & Drop para el constructor de formularios
 * Clona templates HTML pre-existentes en lugar de crear HTML dinámicamente
 */
function initDragAndDropConstructor() {
  // ===== VARIABLE PARA CONTAR FORMULARIOS =====
  // Contador para generar IDs únicos en los nombres de inputs (evita conflictos)
  let counter = 0;

  // ===== MAPEO DE NOMBRES A TEMPLATES =====
  // Relaciona el nombre del formulario arrastrable con su template HTML correspondiente
  const formTemplateMap = {
    "Permiso Altura": "template-permiso-altura",
    "Permiso Espacio confinado": "template-permiso-espacio-confinado",
    "Permiso Bloqueo y Etiquetado": "template-permiso-bloqueo-y-etiquetado",
    "Permiso Agua a Alta Presión": "template-permiso-agua-a-alta-presion",
    "Permiso Primera Apertura": "template-permiso-primera-apertura",
    "Permiso Izaje con Grúa": "template-permiso-izaje-con-grua",
    "Permiso Eléctrico": "template-permiso-electrico"
  };

  // ===== SELECCIÓN DE ELEMENTOS DEL DOM =====
  const dropZone = document.getElementById("dropZone");
  const formItems = document.querySelectorAll(".form-item");

  // Verificar que los elementos existen antes de continuar
  if (!dropZone || formItems.length === 0) {
    console.warn(
      "[DRAG&DROP] No se encontraron elementos necesarios para drag&drop"
    );
    return;
  }

  // ===== EVENTO: DRAG START (Inicio del arrastre) =====
  // Se ejecuta cuando el usuario empieza a arrastrar un formulario
  formItems.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      // Obtener el nombre del formulario desde el atributo data-name
      const formName = item.dataset.name;

      // Establecer los datos para la transferencia drag & drop
      e.dataTransfer.setData("text/plain", formName);

      // Agregar clase visual para indicar que se está arrastrando
      item.classList.add("dragging");

      console.log(`[DRAG&DROP] Iniciado arrastre de: ${formName}`);
    });

    // ===== EVENTO: DRAG END (Fin del arrastre) =====
    // Se ejecuta cuando termina el arrastre
    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
    });
  });

  // ===== EVENTO: DRAG OVER (Arrastrar sobre la zona) =====
  // Permite que la zona acepte elementos soltados
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault(); // Necesario para permitir el drop

    // Agregar clase visual para indicar zona válida
    dropZone.classList.add("dragover");
  });

  // ===== EVENTO: DRAG LEAVE (Salir de la zona) =====
  // Remueve el efecto visual cuando el cursor sale
  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  // ===== EVENTO: DROP (Soltar en la zona) =====
  // Se ejecuta cuando se suelta el elemento en la zona de destino
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();

    // Remover clase visual de hover
    dropZone.classList.remove("dragover");

    // Obtener el nombre del formulario que se soltó
    const formName = e.dataTransfer.getData("text/plain");

    // Verificar que existe un template para este formulario
    const templateId = formTemplateMap[formName];
    if (!templateId) {
      console.error(`[DRAG&DROP] No se encontró template para: ${formName}`);
      return;
    }

    // ===== VERIFICAR SI YA EXISTE UN FORMULARIO DE ESTE TIPO =====
    const existingForms = dropZone.querySelectorAll(".added-form");
    const formTypeMap = {
      "Permiso Altura": "altura",
      "Permiso Espacio confinado": "confinado",
      "Permiso Bloqueo y Etiquetado": "bloqueo",
      "Permiso Agua a Alta Presión": "agua-presion",
      "Permiso Primera Apertura": "primera-apertura",
      "Permiso Izaje con Grúa": "izaje",
      "Permiso Eléctrico": "electrico"
    };
    
    const formType = formTypeMap[formName];
    const alreadyExists = Array.from(existingForms).some(
      form => form.dataset.formType === formType
    );

    if (alreadyExists) {
      alert(`⚠️ Ya existe un  "${formName}". `);
      console.warn(`[DRAG&DROP] Formulario duplicado bloqueado: ${formName}`);
      return;
    }

    // Obtener el template desde el DOM
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`[DRAG&DROP] Template no existe en HTML: ${templateId}`);
      return;
    }

    // Ocultar el placeholder si existe
    const placeholder = dropZone.querySelector(".drop-zone-placeholder");
    if (placeholder) {
      placeholder.style.display = "none";
    }

    // Incrementar contador para IDs únicos
    counter++;

    // ===== CLONAR EL TEMPLATE =====
    // Clonar el contenido del template (true = clonación profunda)
    const clone = template.content.cloneNode(true);
    
    // Obtener el div principal del formulario clonado
    const formDiv = clone.querySelector(".added-form");
    
    // Asignar un ID único al formulario clonado
    formDiv.dataset.formId = `form-${counter}`;
    formDiv.dataset.formCounter = counter; // Guardar contador para referencia

    // ===== RENOMBRAR INPUTS PARA EVITAR CONFLICTOS =====
    // Cada formulario clonado necesita nombres únicos en sus inputs radio
    const radioInputs = formDiv.querySelectorAll('input[type="radio"]');
    radioInputs.forEach((input) => {
      // Obtener el nombre original del input (ej: "altura_q1")
      const originalName = input.getAttribute("name");
      
      // Crear nuevo nombre único agregando el contador (ej: "altura_q1_form1")
      const uniqueName = `${originalName}_form${counter}`;
      
      // Actualizar el nombre del input
      input.setAttribute("name", uniqueName);
      
      // Si el input tiene un ID, también actualizarlo
      if (input.id) {
        input.setAttribute("id", `${input.id}_form${counter}`);
      }
    });

    // ===== CONFIGURAR BOTÓN DE ELIMINAR =====
    const removeBtn = formDiv.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      // Animar la salida del formulario
      formDiv.style.opacity = "0";
      formDiv.style.transform = "translateX(20px)";

      // Remover el elemento después de la animación
      setTimeout(() => {
        formDiv.remove();

        // Si no quedan formularios, mostrar placeholder nuevamente
        if (dropZone.querySelectorAll(".added-form").length === 0) {
          if (placeholder) {
            placeholder.style.display = "flex";
          }
        }

        console.log(
          `[DRAG&DROP] Formulario eliminado: ${formName} (ID: form-${counter})`
        );
      }, 300);
    });

    // ===== AGREGAR EL FORMULARIO CLONADO A LA ZONA DE DROP =====
    dropZone.appendChild(formDiv);

    // Animación de entrada (pequeño delay para que la transición CSS funcione)
    setTimeout(() => {
      formDiv.style.opacity = "1";
      formDiv.style.transform = "translateY(0)";
    }, 10);

    console.log(
      `[DRAG&DROP] Formulario agregado desde template: ${formName} (ID: form-${counter}, Template: ${templateId})`
    );
  });

  console.log("[DRAG&DROP] Sistema de Drag & Drop inicializado con templates HTML");
}

// ============================================================================
// FIN: FUNCIONALIDAD DE DRAG AND DROP
// ============================================================================
