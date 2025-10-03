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

  // Validar campos requeridos en la sección 2
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

    // Validar que al menos una opción de planta esté seleccionada
    const plantSelected = document.querySelector('input[name="plant"]:checked');
    if (!plantSelected) {
      isValid = false;
      alert("Por favor seleccione una planta o lugar de trabajo.");
    }

    // Validar que al menos un tipo de mantenimiento esté seleccionado
    const maintenanceSelected = document.querySelector(
      'input[name="maintenance-type"]:checked'
    );
    if (!maintenanceSelected) {
      isValid = false;
      alert("Por favor seleccione un tipo de mantenimiento.");
    }

    // Validar campos "OTRO" si están seleccionados
    const otherPlantSelected = document.querySelector(
      'input[name="plant"][value="OTRO"]:checked'
    );
    if (otherPlantSelected) {
      const otherPlantInput = document.getElementById("other-plant");
      if (!otherPlantInput.value.trim()) {
        isValid = false;
        otherPlantInput.style.borderColor = "#ff4444";
        otherPlantInput.addEventListener(
          "input",
          function () {
            this.style.borderColor = "#dee2e6";
          },
          { once: true }
        );
      }
    }

    const otherMaintenanceSelected = document.querySelector(
      'input[name="maintenance-type"][value="OTRO"]:checked'
    );
    if (otherMaintenanceSelected) {
      const otherMaintenanceInput =
        document.getElementById("other-maintenance");
      if (!otherMaintenanceInput.value.trim()) {
        isValid = false;
        otherMaintenanceInput.style.borderColor = "#ff4444";
        otherMaintenanceInput.addEventListener(
          "input",
          function () {
            this.style.borderColor = "#dee2e6";
          },
          { once: true }
        );
      }
    }

    if (!isValid) {
      alert(
        "Por favor complete todos los campos requeridos antes de continuar."
      );
    }

    return isValid;
  }

  // Asignar validación al botón de siguiente de la sección 2
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

  // Manejar campos de fecha de actividad de la fuente
  const activityDay = document.getElementById("activity-day");
  const activityMonth = document.getElementById("activity-month");
  const activityYear = document.getElementById("activity-year");

  // Validar día (1-31)
  if (activityDay) {
    activityDay.addEventListener("change", function () {
      let day = parseInt(this.value);
      if (day < 1) this.value = 1;
      if (day > 31) this.value = 31;
    });
  }

  // Validar mes (1-12)
  if (activityMonth) {
    activityMonth.addEventListener("change", function () {
      let month = parseInt(this.value);
      if (month < 1) this.value = 1;
      if (month > 12) this.value = 12;
    });
  }

  // Validar año (2000-2100)
  if (activityYear) {
    activityYear.addEventListener("change", function () {
      let year = parseInt(this.value);
      if (year < 2000) this.value = 2000;
      if (year > 2100) this.value = 2100;
    });
  }

  // Manejar campos de tiempo de exposición
  const exposureTime = document.getElementById("exposure-time");
  if (exposureTime) {
    exposureTime.addEventListener("input", function () {
      // Validar formato de tiempo (ej. 2h 30m)
      const regex = /^(\d+h)?\s*(\d+m)?$/;
      if (!regex.test(this.value)) {
        this.setCustomValidity('Formato inválido. Use formato como "2h 30m"');
      } else {
        this.setCustomValidity("");
      }
    });
  }

  // Manejar campos numéricos para personal autorizado
  const authorizedPersonnel = document.getElementById("authorized-personnel");
  if (authorizedPersonnel) {
    authorizedPersonnel.addEventListener("change", function () {
      let num = parseInt(this.value);
      if (num < 0) this.value = 0;
      if (num > 20) this.value = 20;
    });
  }
});

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
}
