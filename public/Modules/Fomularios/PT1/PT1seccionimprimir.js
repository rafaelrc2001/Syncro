// Función para enviar los datos del permiso a N8N
/**
 * Función para enviar los datos del permiso a N8N.
 * Esta función toma el motivo de cierre y el id del permiso,
 * y (antes de eliminar mapeos) enviaba los datos a un webhook externo.
 * Actualmente, la lógica de envío está eliminada por solicitud.
 * Se puede restaurar para integraciones externas si es necesario.
 */
async function enviarDatosAN8N(motivoCierre) {
  const idPermiso =
    sessionStorage.getItem("id_tipo_permiso") ||
    new URLSearchParams(window.location.search).get("id");
  if (!idPermiso) {
    alert("No se pudo obtener el ID del permiso para enviar a N8N.");
    return;
  }
  // Mapeos de datos eliminados según solicitud
}
document.addEventListener("DOMContentLoaded", function () {
  /**
   * Evento principal DOMContentLoaded.
   * Inicializa los selects de supervisores y categorías desde la base de datos,
   * configura el botón de salir, y muestra/oculta el botón de trabajo finalizado
   * según el estatus del permiso. Es el punto de entrada para la lógica de la vista.
   * También maneja la visibilidad de botones según el estatus del permiso.
   */
  /**
   * Evento DOMContentLoaded para la lógica de cierre de permiso.
   * Maneja la apertura de modales de confirmación y cierre,
   * así como el guardado del comentario de cierre y actualización de estatus.
   * Incluye la lógica para cancelar o cerrar el permiso según la acción del usuario.
   * Esencial para el flujo de cierre/cancelación de permisos.
   */
  // Llenar select de supervisores desde la base de datos
  fetch("/api/supervisores")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador");
      if (select) {
        select.innerHTML =
          '<option value="" disabled selected>Seleccione un supervisor...</option>';
        data.forEach((sup) => {
          const option = document.createElement("option");
          option.value = sup.nombre;
          option.textContent = sup.nombre;
          select.appendChild(option);
        });
      }
    });

  // Llenar select de categorías desde la base de datos
  fetch("/api/categorias")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador2");
      if (select) {
        select.innerHTML =
          '<option value="" disabled selected>Seleccione una categoria...</option>';
        data.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.nombre;
          option.textContent = cat.nombre;
          select.appendChild(option);
        });
      }
    });
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/CrearPT.html";
    });
  }
  
    // Mostrar/ocultar botón "Trabajo Finalizado" según estatus
    const btnTrabajoFinalizado = document.getElementById("btn-cerrar-permiso");
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get("id");
    if (btnTrabajoFinalizado && idPermiso) {
      fetch(`/api/estatus-solo/${idPermiso}`)
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.estatus && typeof data.estatus === "string") {
            if (data.estatus.trim().toLowerCase() === "validado por seguridad" ||
                data.estatus.trim().toLowerCase() === "espera liberacion del area") {
              btnTrabajoFinalizado.style.display = "";
            } else {
              btnTrabajoFinalizado.style.display = "none";
            }
          } else {
            btnTrabajoFinalizado.style.display = "none";
          }
        })
        .catch(() => {
          btnTrabajoFinalizado.style.display = "none";
        });
    }
});

// Lógica para mostrar el modal de cierre de permiso y guardar el comentario

// Lógica para mostrar el modal de confirmación antes del cierre
document.addEventListener("DOMContentLoaded", function () {
  var btnCerrarPermiso = document.getElementById("btn-cerrar-permiso");
  var modalConfirmar = document.getElementById("modalConfirmarCerrarPermiso");
  var modalCerrarPermiso = document.getElementById("modalCerrarPermiso");
  //var modalAlternativo = document.getElementById("modalCierreAlternativo");
  var modalAlternativo = document.getElementById("modalCancelarPermisoUnico");
  
  var btnSi = document.getElementById("btnConfirmarCerrarSi");
  var btnNo = document.getElementById("btnConfirmarCerrarNo");
  var btnCerrarAlternativo = document.getElementById("btnCerrarAlternativo");
  var btnCancelarCerrarPermiso = document.getElementById("btnCancelarCerrarPermiso");
  var btnGuardarCerrarPermiso = document.getElementById("btnGuardarCerrarPermiso");

  // Al hacer click en el botón principal, mostrar el modal de confirmación
  if (btnCerrarPermiso && modalConfirmar) {
    btnCerrarPermiso.addEventListener("click", function (e) {
      e.preventDefault();
        // Oculta el modal de cierre tradicional si está visible
        if (modalCerrarPermiso) modalCerrarPermiso.style.display = "none";
        modalConfirmar.style.display = "flex";
    });
  }
  // Si el usuario elige 'Sí', mostrar el modal de cierre tradicional
  if (btnSi && modalCerrarPermiso && modalConfirmar) {
    btnSi.addEventListener("click", function () {
      modalConfirmar.style.display = "none";
      modalCerrarPermiso.style.display = "flex";
    });
  }
  // Si el usuario elige 'No', mostrar el modal alternativo
  if (btnNo && modalAlternativo && modalConfirmar) {
    btnNo.addEventListener("click", function () {
      modalConfirmar.style.display = "none";
      modalAlternativo.style.display = "flex";
    });
  }
  // Cerrar el modal alternativo
  if (btnCerrarAlternativo && modalAlternativo) {
    btnCerrarAlternativo.addEventListener("click", function () {
      modalAlternativo.style.display = "none";
    });
  }
  // Cerrar el modal de cierre tradicional
  if (btnCancelarCerrarPermiso && modalCerrarPermiso) {
    btnCancelarCerrarPermiso.addEventListener("click", function () {
      modalCerrarPermiso.style.display = "none";
    });
  }
  // Guardar comentario de cierre en la base de datos
  if (btnGuardarCerrarPermiso && modalCerrarPermiso) {
    btnGuardarCerrarPermiso.addEventListener("click", async function () {
      var comentario = document.getElementById("comentarioCerrarPermiso").value.trim();
      var tipoCierre = document.getElementById("tipoCierrePermiso").value;

      if (!comentario) {
        alert("Debes escribir el motivo del cierre.");
        return;
      }
      if (!tipoCierre) {
        alert("Debes seleccionar el tipo de cierre.");
        return;
      }
      var params = new URLSearchParams(window.location.search);
      var idPermiso = params.get("id") || window.idPermisoActual;
      console.log("Permiso de trabajo a cerrar:", idPermiso);
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/estatus/permiso/${idPermiso}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus = permisoData.id_estatus || (permisoData.data && permisoData.data.id_estatus);
        }
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }
      if (!idEstatus) {
        alert("No se pudo obtener el estatus del permiso.");
        return;
      }
      let endpoint;
      let mensajeExito;
      switch (tipoCierre) {
        case "cierre-sin-incidentes":
          endpoint = "/api/estatus/cierre_sin_incidentes";
          mensajeExito = "Permiso cerrado sin incidentes exitosamente.";
          break;
        case "cierre-con-incidentes":
          endpoint = "/api/estatus/cierre_con_incidentes";
          mensajeExito = "Permiso cerrado con incidentes registrado exitosamente.";
          break;
        case "cierre-con-accidentes":
          endpoint = "/api/estatus/cierre_con_accidentes";
          mensajeExito = "Permiso cerrado con accidentes registrado exitosamente.";
          break;
        case "cancelado":
          endpoint = "/api/estatus/cancelado";
          mensajeExito = "Permiso cancelado exitosamente.";
          break;
        default:
          alert("Tipo de cierre no válido.");
          return;
      }
      try {
        const respComentario = await fetch("/api/estatus/comentario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus, comentario }),
        });
        let dataComentario = {};
        try {
          dataComentario = await respComentario.json();
        } catch (e) {}
        if (!dataComentario.success) {
          alert("No se pudo guardar el comentario de cierre.");
          return;
        }
        const payloadEstatus = { id_estatus: idEstatus };
        const respEstatus = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadEstatus),
        });
        let dataEstatus = {};
        try {
          dataEstatus = await respEstatus.json();
        } catch (e) {}
        if (!respEstatus.ok || !dataEstatus.success) {
          alert(`No se pudo actualizar el estatus. Error: ${dataEstatus.error || "Desconocido"}`);
          return;
        }
        if (window.n8nFormHandler) {
          await window.n8nFormHandler();
        }
        modalCerrarPermiso.style.display = "none";
        alert(mensajeExito);
        window.location.href = "/Modules/Usuario/CrearPT.html";
      } catch (err) {
        console.error("Error completo:", err);
        alert("Error al guardar el comentario de cierre o actualizar estatus.");
      }
    });
  }
});






// Función para aplicar estilos específicos de PT1
function aplicarEstilosPT1() {
  /**
   * Función para aplicar estilos específicos de PT1.
   * Recorre ciertos elementos de respuesta y les asigna clases
   * según su valor (sí/no), para resaltar visualmente las respuestas.
   * Mejora la legibilidad y el feedback visual en la interfaz.
   * Se puede ampliar para más respuestas o estilos.
   */
  // Aplicar clases dinámicas a las respuestas según su valor
  const respuestas = [
    "resp-risk-area",
    "resp-physical-delivery",
    "resp-additional-ppe",
    "resp-surrounding-risk",
    "resp-supervision-needed",
  ];

  respuestas.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento && elemento.textContent.trim() !== "-") {
      const respuesta = elemento.textContent.toLowerCase().trim();

      // Remover clases anteriores
      elemento.classList.remove("pt1-response-si", "pt1-response-no");

      // Agregar clase según la respuesta
      if (respuesta === "si" || respuesta === "sí") {
        elemento.classList.add("pt1-response-si");
      } else if (respuesta === "no") {
        elemento.classList.add("pt1-response-no");
      }
    }
  });
}

// Función para consultar las personas que han autorizado el permiso
function consultarPersonasAutorizacion(idPermiso) {
  /**
   * Función para consultar las personas que han autorizado el permiso.
   * Realiza una petición a la API para obtener los responsables,
   * y actualiza el DOM con los nombres y cargos de cada responsable.
   * Si no hay datos, deja los campos con valores por defecto.
   * Útil para mostrar la cadena de autorización del permiso.
   */
  /**
   * Evento para el botón salir nuevo (regresa a AutorizarPT.html).
   * Permite al usuario volver a la pantalla principal de supervisión de seguridad.
   * Previene el comportamiento por defecto del botón y redirige manualmente.
   * Mejora la navegación entre módulos.
   * Se puede reutilizar para otros botones de navegación.
   */
  /**
   * Evento DOMContentLoaded para mostrar solo la sección 2 al cargar.
   * Incluye funciones para rellenar AST y participantes,
   * y para manejar la navegación entre secciones y botones de regreso/salir.
   * También carga los datos del permiso si hay un id en la URL.
   * Esencial para la experiencia de usuario en la vista de impresión.
   */
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success && result.data) {
        const data = result.data;

        // Rellenar responsable del área
        const responsableAreaElement = document.getElementById(
          "responsable-area-nombre"
        );
        if (responsableAreaElement) {
          responsableAreaElement.textContent = data.responsable_area || "-";
        }

        // Rellenar operador del área
        const operadorAreaElement = document.getElementById(
          "operador-area-nombre"
        );
        if (operadorAreaElement) {
          operadorAreaElement.textContent = data.operador_area || "-";
        }

        // Rellenar supervisor de seguridad
        const supervisorElement = document.getElementById("supervisor-nombre");
        if (supervisorElement) {
          supervisorElement.textContent = data.nombre_supervisor || "-";
        }

        console.log("Datos de autorización cargados:", data);
      } else {
        console.log("No se encontraron autorizaciones para este permiso");
        // Los elementos ya tienen "-" por defecto, no necesitamos cambiar nada
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
      // Los elementos ya tienen "-" por defecto en caso de error
    });
}


















/**
 * Función de impresión tradicional (fallback)
 */
async function imprimirPermisoTradicional() {
  /**
   * Función de impresión tradicional (fallback).
   * Llama a window.print() para imprimir la vista actual del permiso.
   * Puede esperar a que se carguen imágenes si es necesario.
   * Muestra alertas en caso de error durante la impresión.
   * Útil como respaldo si no hay lógica de impresión personalizada.
   */
  try {


    // Ejecutar impresión tradicional del navegador
    window.print();
  } catch (error) {
    console.error("Error al imprimir:", error);
    alert(
      "Ocurrió un error al preparar la impresión. Por favor, inténtalo nuevamente."
    );
  }
}



const botonImprimir = document.getElementById("btn-imprimir-permiso");
/**
 * Inicialización del botón de impresión.
 * Asigna eventos visuales y funcionales al botón de imprimir,
 * como animaciones al pasar el mouse y la acción de imprimir.
 * Mejora la experiencia de usuario al imprimir el permiso.
 * Se puede extender para mostrar instrucciones personalizadas.
 */
if (botonImprimir) {
  botonImprimir.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.print(); // Imprime directamente sin mostrar instrucciones
    },
    true
  ); // true para capturar el evento antes que otros listeners

  // Indicador visual al botón
  botonImprimir.style.transition = "all 0.3s ease";
  botonImprimir.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 6px 20px rgba(0,59,92,0.3)";
  });

  botonImprimir.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "";
  });
}

console.log("Funcionalidad de impresión PT1 inicializada correctamente");

function llenarTablaResponsables(idPermiso) {
  /**
   * Función para llenar la tabla de responsables en el modal AST.
   * Consulta la API para obtener los responsables y sus datos,
   * y los muestra en una tabla dentro del modal.
   * Si no hay responsables, muestra un mensaje adecuado.
   * Mejora la trazabilidad y visualización de responsables en el permiso.
   */
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((response) => response.json())
    .then((result) => {
      const tbody = document.getElementById("modal-ast-responsable-body");
      if (!tbody) return;

      tbody.innerHTML = ""; // Limpia la tabla antes de llenarla

      function formatearFecha(fechaString) {
        if (!fechaString) return "Pendiente";
        // Si la fecha viene en formato SQL (YYYY-MM-DD HH:mm:ss), mostrar tal cual
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(fechaString)) {
          const [fecha, hora] = fechaString.split(" ");
          const [h, m] = hora.split(":");
          return `${fecha.replace(/-/g, "/")}, ${h}:${m}`;
        }
        // Si viene en formato ISO con Z (UTC), mostrar en UTC
        try {
          const fecha = new Date(fechaString);
          if (isNaN(fecha.getTime())) {
            return "Fecha inválida";
          }
          // Formatear en UTC
          const year = fecha.getUTCFullYear();
          const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
          const day = String(fecha.getUTCDate()).padStart(2, "0");
          const hour = String(fecha.getUTCHours()).padStart(2, "0");
          const minute = String(fecha.getUTCMinutes()).padStart(2, "0");
          return `${day}/${month}/${year}, ${hour}:${minute}`;
        } catch (error) {
          return "Error en fecha";
        }
      }

      if (result.success && result.data) {
        const data = result.data;
        const { ip_area, localizacion_area } = data;
        const filas = [
          {
            nombre: data.responsable_area,
            cargo: "Responsable de área",
            fecha: formatearFecha(data.fecha_hora_area),
          },
          {
            nombre: data.operador_area,
            cargo: "Operador del área",
            fecha: formatearFecha(data.fecha_hora_area),
          },
          {
            nombre: data.nombre_supervisor,
            cargo: "Supervisor de Seguridad",
            fecha: formatearFecha(data.fecha_hora_supervisor),
          },
        ];

        let hayResponsables = false;
        filas.forEach((fila) => {
          if (fila.nombre && fila.nombre.trim() !== "") {
            hayResponsables = true;
            const tr = document.createElement("tr");
            tr.innerHTML = `
  <td>${fila.nombre}</td>
  <td>${fila.cargo}</td>
  <td>
    ${fila.fecha || ""}<br>
     ${ip_area || "-"}<br>
     ${localizacion_area || "-"}
  </td>
  <td></td>
`;
            tbody.appendChild(tr);
          }
        });

        // Si alguna fila no tiene nombre, igual la mostramos con N/A
        filas.forEach((fila) => {
          if (!fila.nombre || fila.nombre.trim() === "") {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>N/A</td>
              <td>${fila.cargo}</td>
              <td></td>
            `;
            tbody.appendChild(tr);
          }
        });

        // Si no hay responsables, muestra mensaje
        if (!hayResponsables) {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
          tbody.appendChild(tr);
        }
      } else {
        // Si no hay datos, muestra mensaje
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
        tbody.appendChild(tr);
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}
