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
});
