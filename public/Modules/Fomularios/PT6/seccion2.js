document.addEventListener("DOMContentLoaded", function () {
  // Configurar hora actual por defecto
  const timeField = document.getElementById("start-time");
  if (timeField) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    timeField.value = `${hours}:${minutes}`;
  }

  // Habilitar campos "OTRO" cuando se selecciona la opción
  document
    .querySelectorAll('input[type="radio"][value="OTRO"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        const otherInput =
          this.closest(".other-option").querySelector(".other-input");
        otherInput.disabled = !this.checked;
        if (this.checked) {
          otherInput.focus();
        }
      });
    });

  // Validación de campos requeridos para la sección 2
  function validateSection2() {
    let isValid = true;
    const requiredFields = document.querySelectorAll(
      '.form-section[data-section="2"] [required]'
    );

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = "#ff4444";
        field.addEventListener(
          "input",
          function () {
            this.style.borderColor = "#dee2e6";
          },
          { once: true }
        );
      }
    });

    // Validar que al menos un radio button esté seleccionado en los grupos requeridos
    const radioGroups = [
      {
        name: "plant",
        message: "Por favor seleccione una planta o lugar de trabajo",
      },
      {
        name: "maintenance-type",
        message: "Por favor seleccione un tipo de mantenimiento",
      },
    ];

    radioGroups.forEach((group) => {
      const selected = document.querySelector(
        `input[name="${group.name}"]:checked`
      );
      if (!selected) {
      }
    });

    // Validación especial para campos condicionales
    document
      .querySelectorAll('.yes-no-na input[type="radio"][value="SI"]:checked')
      .forEach((radio) => {
        const parentGroup = radio.closest(".form-group");
        if (parentGroup) {
          const textInput = parentGroup.querySelector('input[type="text"]');
          if (textInput && !textInput.disabled && !textInput.value.trim()) {
            isValid = false;
            textInput.style.borderColor = "#ff4444";
            textInput.addEventListener(
              "input",
              function () {
                this.style.borderColor = "#dee2e6";
              },
              { once: true }
            );
          }
        }
      });

    // Validación para pruebas de gas
    const gasTestApproved = document.querySelector(
      'input[name="gas-test-approved"]:checked'
    );
    if (!gasTestApproved) {
    }

    return isValid;
  }

  // Manejar el botón siguiente de la sección 2
  const nextBtnSection2 = document.querySelector(
    '.form-section[data-section="2"] .next-step'
  );
  if (nextBtnSection2) {
    nextBtnSection2.addEventListener("click", function (e) {
      if (!validateSection2()) {
        e.preventDefault();
      }
    });
  }

  // Manejar campos de medidas de seguridad
  document
    .querySelectorAll('.yes-no-na input[type="radio"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        const parentGroup = this.closest(".form-group");
        if (parentGroup) {
          // Habilitar campo de texto asociado si es necesario
          const textInput = parentGroup.querySelector('input[type="text"]');
          if (textInput) {
            textInput.disabled = this.value !== "SI";
            if (this.value === "SI") {
              textInput.focus();
            }
          }
        }
      });
    });

  // Validación de campos numéricos para pruebas de gas
  const gasTestFields = ["co2-level", "nh3-level", "oxygen-level", "lel-level"];
  gasTestFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("blur", function () {
        if (this.value && isNaN(this.value)) {
          this.style.borderColor = "#ff4444";

          this.focus();
        } else {
          this.style.borderColor = "#dee2e6";
        }
      });
    }
  });

  // Manejar el botón de cancelar específico para la sección 2
  const cancelBtnSection2 = document.querySelector(
    '.form-section[data-section="2"] .secondary'
  );
  if (cancelBtnSection2) {
    cancelBtnSection2.addEventListener("click", function () {
      if (
        confirm(
          "¿Está seguro de cancelar este permiso? Todos los datos se perderán."
        )
      ) {
        window.location.href = "/Modules/Usuario/CrearPT.html";
      }
    });
  }

  // Mostrar campo OTRO si se selecciona OTRO en el select
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

  // Mostrar/ocultar campos de equipo a intervenir y TAG
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

    function toggleEquipmentFields() {
      const showEquipment =
        document.querySelector('input[name="has-equipment"]:checked').value ===
        "si";
      equipmentFields.forEach((element) => {
        if (element) element.style.display = showEquipment ? "block" : "none";
      });
      const equipmentField = document.getElementById("equipment");
      if (equipmentField) equipmentField.required = showEquipment;
      const tagField = document.getElementById("tag");
      if (tagField) tagField.required = showEquipment;
    }

    equipmentRadios.forEach((radio) => {
      radio.addEventListener("change", toggleEquipmentFields);
    });

    toggleEquipmentFields();
  }

  initEquipmentToggle();
});
