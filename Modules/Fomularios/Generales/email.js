// Función para manejar el envío del formulario a n8n
window.n8nFormHandler = async function () {
  // Recopilar datos del formulario
  const formData = {
    numeroPermiso:
      window.permitNumber || document.getElementById("permit-number")?.value,
    fechaPermiso: document.getElementById("permit-date")?.value,
    empresa: document.getElementById("company")?.value,
    subcontrata: document.getElementById("subcontract")?.value,
    sucursal:
      document.getElementById("sucursal")?.selectedOptions[0]?.textContent,
    planta: document.getElementById("plant")?.value,
    solicitante: document.getElementById("applicant")?.value,
    descripcionTrabajo: document.getElementById("work-description")?.value,
    fechaSolicitud: new Date().toISOString(),
    mantenimiento: document.getElementById("maintenance-type")?.value,
    tipopermiso: document.getElementById("PermisoNP")?.value,
    correo:
      window.correoDepartamento || document.getElementById("correo")?.value,
    //correo: window.correoDepartamento ? window.correoDepartamento : '',
  };

  // Imprimir los datos en consola para prueba
  console.log("Datos enviados a n8n:", formData);

  // Enviar datos a n8n
  const response = await fetch(
    "https://7mhxkntt-5678.usw3.devtunnels.ms/webhook/formulario-PT",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // throw new Error(
    //   errorData.message || "Error en la respuesta del servidor n8n"
    // );
  }

  return true;
};

// Inicialización si es necesario
document.addEventListener("DOMContentLoaded", function () {
  // Inicialización si es necesaria
});
