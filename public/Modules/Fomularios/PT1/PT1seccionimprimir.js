// Función para enviar los datos del permiso a N8N
async function enviarDatosAN8N(motivoCierre) {
  const idPermiso =
    sessionStorage.getItem("id_tipo_permiso") ||
    new URLSearchParams(window.location.search).get("id");
  if (!idPermiso) {
    alert("No se pudo obtener el ID del permiso para enviar a N8N.");
    return;
  }
  let formData = {};
  try {
    const resp = await fetch(`/api/verformularios?id=${idPermiso}`);
    const data = await resp.json();
    // Imprimir los datos obtenidos de la API
    console.log("Datos obtenidos de la API para N8N:", data);
    // Si la API devuelve datos completos, úsalo
    if (data && data.general && Object.keys(data.general).length > 0) {
      formData = {
        numeroPermiso:
          data.general.prefijo ||
          document.querySelector(".section-header h3")?.textContent ||
          "",
        fechaPermiso:
          data.general.fecha ||
          document.getElementById("fecha-label")?.textContent ||
          "",
        empresa:
          data.general.empresa ||
          document.getElementById("empresa-label")?.textContent ||
          "",
        subcontrata: data.general.subcontrata || "",
        sucursal:
          data.general.sucursal ||
          document.getElementById("sucursal-label")?.textContent ||
          "",
        planta:
          data.general.planta ||
          document.getElementById("plant-label")?.textContent ||
          "",
        solicitante:
          data.general.solicitante ||
          document.getElementById("nombre-solicitante-label")?.textContent ||
          "",
        descripcionTrabajo:
          data.general.descripcion_trabajo ||
          document.getElementById("descripcion-trabajo-label")?.textContent ||
          "",
        fechaSolicitud: new Date().toISOString(),
        mantenimiento: data.general.mantenimiento || "",
        tipopermiso: data.general.tipo_permiso || "",
        correo: data.general.correo || "",
        motivoCierre: motivoCierre || "",
      };
    } else {
      // Si la API falla o no tiene datos, recolecta del DOM
      formData = {
        numeroPermiso:
          document.querySelector(".section-header h3")?.textContent || "",
        fechaPermiso: document.getElementById("fecha-label")?.textContent || "",
        empresa: document.getElementById("empresa-label")?.textContent || "",
        subcontrata: "",
        sucursal: document.getElementById("sucursal-label")?.textContent || "",
        planta: document.getElementById("plant-label")?.textContent || "",
        solicitante:
          document.getElementById("nombre-solicitante-label")?.textContent ||
          "",
        descripcionTrabajo:
          document.getElementById("descripcion-trabajo-label")?.textContent ||
          "",
        fechaSolicitud: new Date().toISOString(),
        mantenimiento: "",
        tipopermiso: "",
        correo: "",
        motivoCierre: motivoCierre || "",
      };
    }
    // Enviar a N8N (reemplaza la URL por la tuya)
    await fetch("https://TU_WEBHOOK_N8N", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    console.log("Datos enviados a N8N:", formData);
  } catch (err) {
    console.error("Error al enviar datos a N8N:", err);
  }
}
document.addEventListener("DOMContentLoaded", function () {
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
});

// Lógica para mostrar el modal de cierre de permiso y guardar el comentario
document.addEventListener("DOMContentLoaded", function () {
  var btnCerrarPermiso = document.getElementById("btn-cerrar-permiso");
  var modalCerrarPermiso = document.getElementById("modalCerrarPermiso");
  var btnCancelarCerrarPermiso = document.getElementById(
    "btnCancelarCerrarPermiso"
  );
  var btnGuardarCerrarPermiso = document.getElementById(
    "btnGuardarCerrarPermiso"
  );

  if (btnCerrarPermiso && modalCerrarPermiso) {
    btnCerrarPermiso.addEventListener("click", function () {
      modalCerrarPermiso.style.display = "flex";
    });
  }
  if (btnCancelarCerrarPermiso && modalCerrarPermiso) {
    btnCancelarCerrarPermiso.addEventListener("click", function () {
      modalCerrarPermiso.style.display = "none";
    });
  }

  // Guardar comentario de cierre en la base de datos
  if (btnGuardarCerrarPermiso && modalCerrarPermiso) {
    btnGuardarCerrarPermiso.addEventListener("click", async function () {
      var comentario = document
        .getElementById("comentarioCerrarPermiso")
        .value.trim();
      var tipoCierre = document.getElementById("tipoCierrePermiso").value;

      if (!comentario) {
        alert("Debes escribir el motivo del cierre.");
        return;
      }

      if (!tipoCierre) {
        alert("Debes seleccionar el tipo de cierre.");
        return;
      }

      // Obtener el id del permiso desde la URL o variable global
      var params = new URLSearchParams(window.location.search);
      var idPermiso = params.get("id") || window.idPermisoActual;
      console.log("Permiso de trabajo a cerrar:", idPermiso);
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }

      // Consultar el id_estatus desde permisos_trabajo
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
        }
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }
      if (!idEstatus) {
        alert("No se pudo obtener el estatus del permiso.");
        return;
      }

      // Mapear el tipo de cierre al endpoint correspondiente
      let endpoint;
      let mensajeExito;

      switch (tipoCierre) {
        case "cierre-sin-incidentes":
          endpoint = "/api/estatus/cierre_sin_incidentes";
          mensajeExito = "Permiso cerrado sin incidentes exitosamente.";
          break;
        case "cierre-con-incidentes":
          endpoint = "/api/estatus/cierre_con_incidentes";
          mensajeExito =
            "Permiso cerrado con incidentes registrado exitosamente.";
          break;
        case "cierre-con-accidentes":
          endpoint = "/api/estatus/cierre_con_accidentes";
          mensajeExito =
            "Permiso cerrado con accidentes registrado exitosamente.";
          break;
        case "cancelado":
          endpoint = "/api/estatus/cancelado";
          mensajeExito = "Permiso cancelado exitosamente.";
          break;
        default:
          alert("Tipo de cierre no válido.");
          return;
      }

      // Guardar el comentario y actualizar el estatus
      try {
        // 1. Guardar el comentario
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

        // 2. Actualizar el estatus según la selección
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
          alert(
            `No se pudo actualizar el estatus. Error: ${
              dataEstatus.error || "Desconocido"
            }`
          );
          return;
        }

        // 3. Enviar los datos a N8N usando el archivo separado
        if (window.n8nFormHandler) {
          await window.n8nFormHandler();
        }

        // Cerrar el modal y mostrar mensaje de éxito
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

// Nuevo botón salir: vuelve a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/Modules/SupSeguridad/supseguridad.html";
  });
}
// Mostrar solo la sección 2 al cargar y ocultar las demás
document.addEventListener("DOMContentLoaded", function () {
  // --- FUNCIONES PARA RELLENAR AST Y PARTICIPANTES ---
  function mostrarAST(ast) {
    const eppList = document.getElementById("modal-epp-list");
    if (eppList) {
      eppList.innerHTML = "";
      if (ast.epp_requerido) {
        ast.epp_requerido.split(",").forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.trim();
          eppList.appendChild(li);
        });
      }
    }
    const maqList = document.getElementById("modal-maquinaria-list");
    if (maqList) {
      maqList.innerHTML = "";
      if (ast.maquinaria_herramientas) {
        ast.maquinaria_herramientas.split(",").forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.trim();
          maqList.appendChild(li);
        });
      }
    }
    const matList = document.getElementById("modal-materiales-list");
    if (matList) {
      matList.innerHTML = "";
      if (ast.material_accesorios) {
        ast.material_accesorios.split(",").forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.trim();
          matList.appendChild(li);
        });
      }
    }
  }

  function mostrarActividadesAST(actividades) {
    const tbody = document.getElementById("modal-ast-actividades-body");
    if (tbody) {
      tbody.innerHTML = "";
      if (Array.isArray(actividades)) {
        actividades.forEach((act) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                <td>${act.no || ""}</td>
                <td>${act.secuencia_actividad || ""}</td>
                <td>${act.personal_ejecutor || ""}</td>
                <td>${act.peligros_potenciales || ""}</td>
                <td>${act.descripcion || ""}</td>
                <td>${act.responsable || ""}</td>
            `;
          tbody.appendChild(tr);
        });
      }
    }
  }

  function mostrarParticipantesAST(participantes) {
    const tbody = document.getElementById("modal-ast-participantes-body");
    if (tbody) {
      tbody.innerHTML = "";
      if (Array.isArray(participantes)) {
        participantes.forEach((p) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                <td>${p.nombre || ""}</td>
                <td><span class="role-badge">${p.funcion || ""}</span></td>
                <td>${p.credencial || ""}</td>
                <td>${p.cargo || ""}</td>
                <td> </td>
            `;
          tbody.appendChild(tr);
        });
      }
    }
  }

  document.querySelectorAll(".form-section").forEach(function (section) {
    if (section.getAttribute("data-section") === "2") {
      section.style.display = "";
      section.classList.add("active");
    } else {
      section.style.display = "none";
      section.classList.remove("active");
    }
  });

  // Botón regresar: vuelve a AutorizarPT.html
  const btnRegresar = document.getElementById("btn-regresar");
  if (btnRegresar) {
    btnRegresar.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/supseguridad.html";
    });
  }

  // Botón salir: vuelve a AutorizarPT.html
  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/supseguridad.html";
    });
  }

  // Leer el id del permiso de la URL
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");

  const comentarioDiv = document.getElementById("comentarios-permiso");
  if (comentarioDiv && idPermiso) {
    mostrarComentarioSiCorresponde(idPermiso, comentarioDiv);
  }

  if (idPermiso) {
    // Llamar a la API para obtener los datos del permiso
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos recibidos para el permiso:", data);
        // Prefijo en el título y descripción del trabajo
        if (data && data.general) {
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          // Aquí actualizas el título de la pestaña
          document.title = `Permiso No Peligroso ${
            data.general.prefijo || "NP-XXXXXX"
          }`;
          document.getElementById("descripcion-trabajo-label").textContent =
            data.general.descripcion_trabajo || "-";
        }
        if (data && (data.detalles || data.general)) {
          const detalles = data.detalles || {};
          const general = data.general || {};

          document.getElementById("start-time-label").textContent =
            detalles.horario ||
            detalles.hora_inicio ||
            general.horario ||
            general.hora_inicio ||
            "-";
          document.getElementById("fecha-label").textContent =
            detalles.fecha || general.fecha || "-";
          document.getElementById("activity-type-label").textContent =
            detalles.tipo_actividad || general.tipo_actividad || "-";
          document.getElementById("plant-label").textContent =
            detalles.planta || general.area || general.planta || "-";
          document.getElementById("descripcion-trabajo-label").textContent =
            detalles.descripcion_trabajo || general.descripcion_trabajo || "-";
          document.getElementById("empresa-label").textContent =
            detalles.empresa || general.empresa || "-";
          document.getElementById("nombre-solicitante-label").textContent =
            detalles.solicitante || general.solicitante || "-";
          document.getElementById("sucursal-label").textContent =
            detalles.sucursal || general.sucursal || "-";
          document.getElementById("contrato-label").textContent =
            detalles.contrato || general.contrato || "-";
          document.getElementById("work-order-label").textContent =
            detalles.ot || general.ot || "-";
          document.getElementById("equipment-label").textContent =
            detalles.equipo || general.equipo || "-";
          document.getElementById("tag-label").textContent =
            detalles.tag || general.tag || "-";

          // Rellenar Condiciones del Proceso (inputs y <p> para vista solo lectura)
          if (document.getElementById("fluid")) {
            if (document.getElementById("fluid").tagName === "INPUT") {
              document.getElementById("fluid").value =
                data.detalles.fluido || "";
            } else {
              document.getElementById("fluid").textContent =
                data.detalles.fluido || "-";
            }
          }
          if (document.getElementById("pressure")) {
            if (document.getElementById("pressure").tagName === "INPUT") {
              document.getElementById("pressure").value =
                data.detalles.presion || "";
            } else {
              document.getElementById("pressure").textContent =
                data.detalles.presion || "-";
            }
          }
          if (document.getElementById("temperature")) {
            if (document.getElementById("temperature").tagName === "INPUT") {
              document.getElementById("temperature").value =
                data.detalles.temperatura || "";
            } else {
              document.getElementById("temperature").textContent =
                data.detalles.temperatura || "-";
            }
          }

          // Rellenar radios del análisis previo (modo edición)
          function marcarRadio(name, value) {
            if (!value) return;
            const radio = document.querySelector(
              `input[name='${name}'][value='${value.toLowerCase()}']`
            );
            if (radio) radio.checked = true;
          }
          marcarRadio(
            "risk-area",
            data.detalles.trabajo_area_riesgo_controlado
          );
          marcarRadio(
            "physical-delivery",
            data.detalles.necesita_entrega_fisica
          );
          marcarRadio("additional-ppe", data.detalles.necesita_ppe_adicional);
          marcarRadio(
            "surrounding-risk",
            data.detalles.area_circundante_riesgo
          );
          marcarRadio("supervision-needed", data.detalles.necesita_supervision);
          if (
            document.getElementById("pre-work-observations") &&
            document.getElementById("pre-work-observations").tagName ===
              "TEXTAREA"
          ) {
            document.getElementById("pre-work-observations").value =
              data.detalles.observaciones_analisis_previo || "";
          }

          // Rellenar campos de solo lectura (modo vista)
          if (document.getElementById("resp-risk-area"))
            document.getElementById("resp-risk-area").textContent =
              data.detalles.trabajo_area_riesgo_controlado || "-";
          if (document.getElementById("resp-physical-delivery"))
            document.getElementById("resp-physical-delivery").textContent =
              data.detalles.necesita_entrega_fisica || "-";
          if (document.getElementById("resp-additional-ppe"))
            document.getElementById("resp-additional-ppe").textContent =
              data.detalles.necesita_ppe_adicional || "-";
          if (document.getElementById("resp-surrounding-risk"))
            document.getElementById("resp-surrounding-risk").textContent =
              data.detalles.area_circundante_riesgo || "-";
          if (document.getElementById("resp-supervision-needed"))
            document.getElementById("resp-supervision-needed").textContent =
              data.detalles.necesita_supervision || "-";
          if (
            document.getElementById("pre-work-observations") &&
            document.getElementById("pre-work-observations").tagName === "P"
          )
            document.getElementById("pre-work-observations").textContent =
              data.detalles.observaciones_analisis_previo || "-";

          // Rellenar AST y Participantes
          mostrarAST(data.ast);
          mostrarActividadesAST(data.actividades_ast);
          mostrarParticipantesAST(data.participantes_ast);

          // Consultar y rellenar datos de autorización
          consultarPersonasAutorizacion(idPermiso);
          llenarTablaResponsables(idPermiso); // <-- AGREGA ESTA LÍNEA

          // Aplicar estilos dinámicos PT1
          aplicarEstilosPT1();
        } else {
          alert(
            "No se encontraron datos para este permiso o el backend no responde con la estructura esperada."
          );
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });
  }
});

/**
 * Función de impresión tradicional (fallback)
 */
async function imprimirPermisoTradicional() {
  try {
    // Esperar a que las imágenes se carguen completamente (si tienes logos)
    // Si no tienes logos, puedes omitir esta parte
    // await esperarImagenes();

    // Ejecutar impresión tradicional del navegador
    window.print();
  } catch (error) {
    console.error("Error al imprimir:", error);
    alert(
      "Ocurrió un error al preparar la impresión. Por favor, inténtalo nuevamente."
    );
  }
}

// Interceptar Ctrl+P para mostrar instrucciones
// document.addEventListener("keydown", function (e) {
//   if ((e.ctrlKey || e.metaKey) && e.key === "p") {
//     e.preventDefault();
//     mostrarInstruccionesImpresion();
//   }
// });

const botonImprimir = document.getElementById("btn-imprimir-permiso");
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
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((response) => response.json())
    .then((result) => {
      const tbody = document.getElementById("modal-ast-responsable-body");
      if (!tbody) return;

      tbody.innerHTML = ""; // Limpia la tabla antes de llenarla

      if (result.success && result.data) {
        const data = result.data;
        const filas = [
          { nombre: data.responsable_area, cargo: "Responsable de área" },
          { nombre: data.operador_area, cargo: "Operador del área" },
          { nombre: data.nombre_supervisor, cargo: "Supervisor de Seguridad" },
        ];

        let hayResponsables = false;
        filas.forEach((fila) => {
          if (fila.nombre && fila.nombre.trim() !== "") {
            hayResponsables = true;
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${fila.nombre}</td>
              <td>${fila.cargo}</td>
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
