// Función para manejar el envío del formulario a n8n
window.n8nFormHandler = async function () {
  // Recopilar datos del formulario
  // Mapa de ids a nombres de permisos
  const mapaPermisos = {
    1: "PT No Peligroso",
    2: "PT Apertura Equipo Línea",
    3: "PT Espacio Confinado",
    4: "PT Altura",
    5: "PT Fuego",
    6: "PT Electrico",
    7: "PT Radiactivas",
    // Agrega más si tienes más tipos
  };

  // Obtener el id del tipo de permiso desde sessionStorage (seleccionado en la tabla)
  const idPermiso = sessionStorage.getItem("id_tipo_permiso");
  const nombrePermiso = mapaPermisos[idPermiso] || "";

  // Obtener la hora local de México en formato ISO
  const fechaSolicitudLocal = new Date()
    .toLocaleString("sv-SE", {
      timeZone: "America/Mexico_City",
      hour12: false,
    })
    .replace(" ", "T");

  // Obtener el id del departamento desde localStorage
  let id_departamento = null;
  let nombre_departamento = "";
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.id) {
      id_departamento = Number(usuario.id);
    }
  } catch (e) {
    id_departamento = null;
  }

  // Consultar el nombre del departamento usando el endpoint
  if (id_departamento) {
    try {
      const resp = await fetch(
        `/api/departamento/nombre?id_departamento=${id_departamento}`
      );
      const data = await resp.json();
      if (data && data.nombre) {
        nombre_departamento = data.nombre;
      }
    } catch (e) {
      nombre_departamento = "";
    }
  }

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
    fechaSolicitud: fechaSolicitudLocal,
    mantenimiento: document.getElementById("maintenance-type")?.value,
    tipopermiso: nombrePermiso,
    departamento: nombre_departamento,
    // nombrePermiso: nombrePermiso, // puedes eliminar esta línea si no la necesitas duplicada
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
