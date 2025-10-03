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
      {
        name: "equipment-identified",
        message: "Por favor indique si se identificó el equipo",
      },
      {
        name: "equipment-deenergized",
        message: "Por favor indique si el equipo quedó desenergizado",
      },
      {
        name: "equipment-locked",
        message: "Por favor indique si se instaló candado",
      },
      {
        name: "area-responsible",
        message: "Por favor ingrese el responsable del área",
      },
      {
        name: "work-responsible",
        message: "Por favor ingrese el responsable del trabajo",
      },
    ];

    radioGroups.forEach((group) => {
      const selected = document.querySelector(
        `input[name="${group.name}"]:checked`
      );
      if (!selected && !document.getElementById(group.name)) {
        isValid = false;
        alert(group.message);
      }
    });

    // Validación especial para campos condicionales
    const specialProtection = document.querySelector(
      'input[name="special-protection"]:checked'
    );
    if (specialProtection && specialProtection.value === "SI") {
      const protectionType = document.getElementById("special-protection-type");
      if (!protectionType.value.trim()) {
        isValid = false;
        protectionType.style.borderColor = "#ff4444";
        protectionType.addEventListener(
          "input",
          function () {
            this.style.borderColor = "#dee2e6";
          },
          { once: true }
        );
      }
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

  // Manejar campos de verificación de seguridad
  document
    .querySelectorAll('.verification-grid input[type="radio"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        const parentGroup = this.closest(".verification-item");
        if (parentGroup) {
          // Actualizar estilo visual según selección
          if (this.value === "SI") {
            parentGroup.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
          } else if (this.value === "NO") {
            parentGroup.style.backgroundColor = "rgba(244, 67, 54, 0.1)";
          } else {
            parentGroup.style.backgroundColor = "transparent";
          }
        }
      });
    });

  // Validación de campo de nivel de tensión
  const voltageField = document.getElementById("voltage-level");
  if (voltageField) {
    voltageField.addEventListener("blur", function () {
      if (this.value && !/^[\d.]+$/.test(this.value)) {
        this.style.borderColor = "#ff4444";
        alert(
          "Por favor ingrese un valor numérico válido para el nivel de tensión"
        );
        this.focus();
      } else {
        this.style.borderColor = "#dee2e6";
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

  // Habilitar campo de tipo de protección especial cuando se selecciona "SI"
  document
    .querySelector('input[name="special-protection"]')
    .addEventListener("change", function () {
      const protectionType = document.getElementById("special-protection-type");
      protectionType.disabled = this.value !== "SI";
      if (this.value === "SI") {
        protectionType.focus();
      }
    });
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
