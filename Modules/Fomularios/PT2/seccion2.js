// Campos del toggle
function initEquipmentToggle() {
  const equipmentRadios = document.querySelectorAll(
    'input[name="has-equipment"]'
  );
  const equipmentFields = [
    document.getElementById("equipment").closest(".form-group"),
    document.getElementById("tag").closest(".form-group"),
    document.getElementById("equipment-conditions-title"),
    document.getElementById("equipment-conditions-grid"),
  ];

  // Campos adicionales
  const tagField = document.getElementById("tag");
  const fluidField = document.getElementById("fluid");
  const pressureField = document.getElementById("pressure");
  const temperatureField = document.getElementById("temperature");

  function toggleEquipmentFields() {
    const showEquipment =
      document.querySelector('input[name="has-equipment"]:checked').value ===
      "si";
    equipmentFields.forEach((element) => {
      if (element) element.style.display = showEquipment ? "block" : "none";
    });
    const equipmentField = document.getElementById("equipment");
    if (equipmentField) equipmentField.required = showEquipment;
    // Hacer obligatorios los campos adicionales si corresponde
    if (tagField) tagField.required = showEquipment;
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

  // Habilitar/deshabilitar campo "¿Cuál?" según radio seleccionado
  const radios = document.querySelectorAll('input[name="special-tools"]');
  const cualInput = document.getElementById("special-tools-type");

  function updateCualInput() {
    const selected = document.querySelector('input[name="special-tools"]:checked');
    if (!selected || !cualInput) return;
    if (selected.value === "SI") {
      cualInput.disabled = false;
      cualInput.value = "";
      cualInput.placeholder = "Especifique el tipo";
    } else {
      cualInput.disabled = true;
      cualInput.value = "-";
      cualInput.placeholder = "-";
    }
  }

  radios.forEach((radio) => {
    radio.addEventListener("change", updateCualInput);
  });

  updateCualInput();
});
