// Función para manejar el envío del formulario a n8n
window.n8nFormHandler = async function () {
  // Recopilar datos del formulario
  // Mapa de ids a nombres de permisos


  // Obtener el id del tipo de permiso desde sessionStorage (seleccionado en la tabla)



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
  console.error("Error leyendo usuario de localStorage", e);
}

  // Obtener el departamento seleccionado
  // Obtener el valor del campo departamento del formulario
  const departamentoSeleccionado = document.getElementById("departamento")?.value || formData?.departamento;


  // Consultar la API para obtener los correos del departamento
  let correosDepartamento = [];
  try {
    const resp = await fetch(`/api/consulta-correo-por-departamento?departamento=${encodeURIComponent(departamentoSeleccionado)}`);
    if (resp.ok) {
      const data = await resp.json();
      correosDepartamento = Array.isArray(data.correos) ? data.correos : [];
    }
  } catch (e) {
    correosDepartamento = [];
  }

  // Consultar la API para obtener los correos de supervisores y agregarlos
  let correosSupervisores = [];
  try {
    const respSup = await fetch('/api/correo-supervisor');
    if (respSup.ok) {
      const dataSup = await respSup.json();
      correosSupervisores = Array.isArray(dataSup.correos) ? dataSup.correos : [];
    }
  } catch (e) {
    correosSupervisores = [];
  }

  // Unir ambos arreglos y eliminar duplicados
  const todosCorreos = Array.from(new Set([...correosDepartamento, ...correosSupervisores]));

  const formData = {
    id: window.permitId,
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
    departamento: departamentoSeleccionado,
    correo: todosCorreos.join(","), // Enviar como string separado por comas
  };

  // Imprimir los datos en consola para prueba
  console.log("Datos enviados a n8n:", formData);

  // Enviar datos a n8n
  const response = await fetch(
   
  // "http://187.157.36.37/webhook/formulario-PT",
  // "http://187.157.36.37:5678/webhook/formulario-PT",  esta es la que esta activa
   
//prueba de las areas:
  "https://187.157.36.37:5678/webhook-test/Creacion-de-permisos-areas",


    //"https://7mhxkntt-5678.usw3.devtunnels.ms/webhook/formulario-PT",
   //"https://7mhxkntt-5678.usw3.devtunnels.ms/webhook-test/formulario-PT",
    
   //nuevo cierre de acuerdo al area
  // "https://7mhxkntt-5678.usw3.devtunnels.ms/webhook-test/Creacion-de-permisos-areas",
   
  
 // "https://7mhxkntt-5678.usw3.devtunnels.ms/webhook/Creacion-de-permisos-areas",
  
//"https://7mhxkntt-5678.usw3.devtunnels.ms/webhook-test/CreacionPermisosAsegurait",
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
})






