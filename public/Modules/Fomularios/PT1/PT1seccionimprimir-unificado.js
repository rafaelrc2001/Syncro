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
      // Detectar la ruta de redirección según el archivo HTML actual
      const currentPage = window.location.pathname;
      let redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html"; // Por defecto
      
      if (currentPage.includes("PT1imprimir2.html")) {
        redirectUrl = "/Modules/Usuario/AutorizarPT.html";
      } else if (currentPage.includes("PT1imprimirsup.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (currentPage.includes("PT1imprimirseg.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      }
      
      window.location.href = redirectUrl;
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
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}

// Nuevo botón salir: detecta la página actual y redirige apropiadamente
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function (e) {
    e.preventDefault();
    
    // Detectar la ruta de redirección según el archivo HTML actual
    const currentPage = window.location.pathname;
    let redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html"; // Por defecto
    
    if (currentPage.includes("PT1imprimir2.html")) {
      redirectUrl = "/Modules/Usuario/AutorizarPT.html";
    } else if (currentPage.includes("PT1imprimirsup.html")) {
      redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
    } else if (currentPage.includes("PT1imprimirseg.html")) {
      redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
    }
    
    window.location.href = redirectUrl;
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

  // Botón regresar: detecta la página actual y redirige apropiadamente
  const btnRegresar = document.getElementById("btn-regresar");
  if (btnRegresar) {
    btnRegresar.addEventListener("click", function () {
      const currentPage = window.location.pathname;
      let redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html"; // Por defecto
      
      if (currentPage.includes("PT1imprimir2.html")) {
        redirectUrl = "/Modules/Usuario/AutorizarPT.html";
      } else if (currentPage.includes("PT1imprimirsup.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (currentPage.includes("PT1imprimirseg.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      }
      
      window.location.href = redirectUrl;
    });
  }

  // Botón salir: detecta la página actual y redirige apropiadamente
  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      const currentPage = window.location.pathname;
      let redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html"; // Por defecto
      
      if (currentPage.includes("PT1imprimir2.html")) {
        redirectUrl = "/Modules/Usuario/AutorizarPT.html";
      } else if (currentPage.includes("PT1imprimirsup.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (currentPage.includes("PT1imprimirseg.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      }
      
      window.location.href = redirectUrl;
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

          // Condiciones actuales del equipo: mostrar fluido, presion, temperatura si existen
          let condiciones = [];
          if (data.detalles.fluido)
            condiciones.push(`Fluido: ${data.detalles.fluido}`);
          if (data.detalles.presion)
            condiciones.push(`Presión: ${data.detalles.presion}`);
          if (data.detalles.temperatura)
            condiciones.push(`Temperatura: ${data.detalles.temperatura}`);
          if (document.getElementById("equipment-conditions-label")) {
            document.getElementById("equipment-conditions-label").textContent =
              condiciones.length > 0
                ? condiciones.join(" | ")
                : data.detalles.condiciones_equipo || "-";
          }

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

          // Mapear datos de verificación previa al trabajo
          const respEpp = document.getElementById("resp-epp");
          if (respEpp) {
            respEpp.textContent = general.verificacion_epp || "-";
          }

          const respHerramientas = document.getElementById("resp-herramientas");
          if (respHerramientas) {
            respHerramientas.textContent = general.verificacion_herramientas || "-";
          }

          const verificacionObs = document.getElementById("verificacion-observaciones");
          if (verificacionObs) {
            verificacionObs.textContent = general.verificacion_observaciones || "-";
          }

          // Rellenar AST y Participantes
          mostrarAST(data.ast);
          mostrarActividadesAST(data.actividades_ast);
          mostrarParticipantesAST(data.participantes_ast);

          // Consultar y rellenar datos de autorización
          consultarPersonasAutorizacion(idPermiso);
          llenarTablaResponsables(idPermiso);

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
    window.print();
  } catch (error) {
    console.error("Error al imprimir:", error);
    alert(
      "Ocurrió un error al preparar la impresión. Por favor, inténtalo nuevamente."
    );
  }
}

const botonImprimir = document.getElementById("btn-imprimir-permiso");
if (botonImprimir) {
  botonImprimir.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.print();
    },
    true
  );

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

      tbody.innerHTML = "";

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

        if (!hayResponsables) {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
          tbody.appendChild(tr);
        }
      } else {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
        tbody.appendChild(tr);
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}
