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

  // Validación adicional para campos condicionales
  function validateConditionalFields() {
    let isValid = true;

    // Validar campos que requieren texto cuando se selecciona "SI"
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

    return isValid;
  }

  // Actualizar validación para incluir campos condicionales
  if (nextBtnSection2) {
    nextBtnSection2.addEventListener("click", function (e) {
      if (!validateSection2() || !validateConditionalFields()) {
        e.preventDefault();
      }
    });
  }

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


// Mejorada: toggleInput ahora se enlaza automáticamente a los radios y muestra/oculta el campo según selección
function toggleInput(name) {
  const radios = document.getElementsByName(name);
  const inputContainer = document.getElementById("input-" + name + "-container");
  let show = false;
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked && radios[i].value === "SI") {
      show = true;
      break;
    }
  }
  if (inputContainer) {
    inputContainer.style.display = show ? "block" : "none";
  }
}

// Enlazar automáticamente a todos los grupos relevantes al cargar
document.addEventListener("DOMContentLoaded", function () {
  // ...existing code...


  // Enlazar radios y contenedores según el HTML real
  // ¿El trabajo requiere escalera? (name="warning-signs", input-escalera-container)
  document.getElementsByName("warning-signs").forEach((radio) => {
    radio.addEventListener("change", function () {
      const show = this.value === "SI" && this.checked;
      const container = document.getElementById("input-escalera-container");
      if (container) container.style.display = show ? "block" : "none";
    });
    // Estado inicial
    if (radio.checked && radio.value === "SI") {
      const container = document.getElementById("input-escalera-container");
      if (container) container.style.display = "block";
    }
  });

  // ¿El trabajo requiere otro tipo de acceso, andamio o plataforma? (name="lifeline", input-acceso-container)
  document.getElementsByName("lifeline").forEach((radio) => {
    radio.addEventListener("change", function () {
      const show = this.value === "SI" && this.checked;
      const container = document.getElementById("input-acceso-container");
      if (container) container.style.display = show ? "block" : "none";
    });
    // Estado inicial
    if (radio.checked && radio.value === "SI") {
      const container = document.getElementById("input-acceso-container");
      if (container) container.style.display = "block";
    }
  });

  // ...existing code...
});
