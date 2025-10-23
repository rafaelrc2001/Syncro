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
  const radios = document.getElementsByName("special-tools");
  const combinedInputDiv = document.querySelector(".combined-input");
  const inputTipo = document.getElementById("special-tools-type");

  function toggleInputTipo() {
    const selected = Array.from(radios).find((r) => r.checked);
    if (selected && selected.value === "SI") {
      combinedInputDiv.style.display = "";
      inputTipo.disabled = false;
      inputTipo.style.background = "#fff";
    } else {
      inputTipo.value = "";
      inputTipo.disabled = true;
      inputTipo.style.background = "#eee";
      combinedInputDiv.style.display = "none";
    }
  }

  radios.forEach((radio) => {
    radio.addEventListener("change", toggleInputTipo);
  });

  updateCualInput();
});
