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
      window.location.href = "../../JefeSeguridad/JefeSeguridad.html";
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
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
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
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    });
  }

  // Botón salir: vuelve a AutorizarPT.html
  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
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

          document.getElementById("empresa-label").textContent =
            detalles.empresa || general.empresa || "-";
          document.getElementById("nombre-solicitante-label").textContent =
            detalles.solicitante || general.solicitante || "-";
          document.getElementById("sucursal-label").textContent =
            detalles.sucursal || general.sucursal || "-";
          document.getElementById("contrato-label").textContent =
            detalles.contrato || general.contrato || "-";

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
          { nombre: data.nombre_supervisor, cargo: "Supervisor" },
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

// --- Lógica para el botón "Autorizar" del Supervisor ---
const btnAutorizarSupervisor = document.getElementById(
  "btn-guardar-campos-supervisor"
);
if (btnAutorizarSupervisor) {
  btnAutorizarSupervisor.addEventListener("click", async function () {
    // 1. Obtener datos necesarios
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get("id") || window.idPermisoActual;
    const supervisorInput = document.getElementById("responsable-aprobador");
    const categoriaInput = document.getElementById("responsable-aprobador2");
    const nombre_supervisor = supervisorInput
      ? supervisorInput.value.trim()
      : "";
    const categoria_supervisor = categoriaInput
      ? categoriaInput.value.trim()
      : "";

    // 2. Validaciones básicas
    if (!idPermiso) {
      alert("No se pudo obtener el ID del permiso.");
      return;
    }
    if (!nombre_supervisor) {
      alert("Debes seleccionar un supervisor.");
      if (supervisorInput) supervisorInput.focus();
      return;
    }

    // 3. Insertar autorización de supervisor vía API
    try {
      // Generar timestamp automático para autorización supervisor PT1 (hora local)
      const nowSupervisor = new Date();
      const fechaHoraAutorizacionSupervisor = new Date(
        nowSupervisor.getTime() - nowSupervisor.getTimezoneOffset() * 60000
      ).toISOString();
      console.log(
        "[AUTORIZAR SUPERVISOR PT1] Timestamp generado (hora local):",
        fechaHoraAutorizacionSupervisor
      );

      // Actualizar autorización de supervisor
      const respSupervisor = await fetch("/api/autorizaciones/supervisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          nombre_supervisor,
          categoria_supervisor,
          fecha_hora_supervisor: fechaHoraAutorizacionSupervisor,
        }),
      });

      if (!respSupervisor.ok) {
        throw new Error(
          `Error ${respSupervisor.status}: ${respSupervisor.statusText}`
        );
      }

      // --- Consultar y actualizar estatus ---
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
          console.log(
            "[AUTORIZAR SUPERVISOR PT1] idEstatus obtenido:",
            idEstatus
          );
        }
      } catch (err) {
        console.error(
          "[AUTORIZAR SUPERVISOR PT1] Error al consultar id_estatus:",
          err
        );
      }

      // Actualizar estatus si se obtuvo el id_estatus
      if (idEstatus) {
        try {
          const payloadEstatus = { id_estatus: idEstatus };
          console.log(
            "[AUTORIZAR SUPERVISOR PT1] Enviando a /api/estatus/autorizado:",
            payloadEstatus
          );
          const respEstatus = await fetch("/api/estatus/autorizado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadEstatus),
          });

          if (respEstatus.ok) {
            console.log(
              "[AUTORIZAR SUPERVISOR PT1] Estatus actualizado exitosamente"
            );
          } else {
            console.error(
              "[AUTORIZAR SUPERVISOR PT1] Error al actualizar estatus:",
              respEstatus.status
            );
          }
        } catch (err) {
          console.error(
            "[AUTORIZAR SUPERVISOR PT1] Excepción al actualizar estatus:",
            err
          );
        }
      }

      // Mostrar modal de confirmación o redirigir
      alert("Permiso autorizado exitosamente por el supervisor.");
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    } catch (err) {
      console.error(
        "[AUTORIZAR SUPERVISOR PT1] Error al insertar autorización:",
        err
      );
      alert(
        "Error al procesar la autorización. Por favor, inténtalo de nuevo."
      );
    }
  });
}

// --- Lógica para el botón "No Autorizar" del Supervisor ---
const btnNoAutorizarSupervisor = document.getElementById(
  "btn-no-autorizar-supervisor"
);
if (btnNoAutorizarSupervisor) {
  btnNoAutorizarSupervisor.addEventListener("click", function () {
    // 1. Validar supervisor seleccionado
    const supervisorInput = document.getElementById("responsable-aprobador");
    const nombre_supervisor = supervisorInput
      ? supervisorInput.value.trim()
      : "";
    if (!nombre_supervisor) {
      alert("Debes seleccionar un supervisor antes de rechazar.");
      return;
    }

    // Mostrar el modal para capturar el comentario de rechazo
    const modal = document.getElementById("modalComentarioSupervisor");
    if (modal) {
      modal.style.display = "flex";
      const comentarioInput = document.getElementById(
        "comentarioNoAutorizarSupervisor"
      );
      if (comentarioInput) comentarioInput.value = "";
    }
  });

  // Lógica para cerrar/cancelar el modal de supervisor
  const btnCancelarComentarioSupervisor = document.getElementById(
    "btnCancelarComentarioSupervisor"
  );
  if (btnCancelarComentarioSupervisor) {
    btnCancelarComentarioSupervisor.addEventListener("click", function () {
      const modal = document.getElementById("modalComentarioSupervisor");
      if (modal) modal.style.display = "none";
    });
  }

  // Lógica para guardar el comentario y actualizar estatus a No Autorizado por Supervisor
  const btnGuardarComentarioSupervisor = document.getElementById(
    "btnGuardarComentarioSupervisor"
  );
  if (btnGuardarComentarioSupervisor) {
    btnGuardarComentarioSupervisor.addEventListener("click", async function () {
      const comentario = document
        .getElementById("comentarioNoAutorizarSupervisor")
        .value.trim();
      const supervisorInput = document.getElementById("responsable-aprobador");
      const categoriaInput = document.getElementById("responsable-aprobador2");
      const nombre_supervisor = supervisorInput
        ? supervisorInput.value.trim()
        : "";
      const categoria_supervisor = categoriaInput
        ? categoriaInput.value.trim()
        : "";
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;

      if (!comentario) {
        alert("Debes ingresar un comentario.");
        return;
      }
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!nombre_supervisor) {
        alert("Debes seleccionar un supervisor.");
        return;
      }

      try {
        // Generar timestamp automático para rechazo supervisor PT1 (hora local)
        const nowRechazoSupervisor = new Date();
        const fechaHoraRechazoSupervisor = new Date(
          nowRechazoSupervisor.getTime() -
            nowRechazoSupervisor.getTimezoneOffset() * 60000
        ).toISOString();
        console.log(
          "[NO AUTORIZAR SUPERVISOR PT1] Timestamp generado (hora local):",
          fechaHoraRechazoSupervisor
        );

        // 1. Guardar comentario y supervisor en la tabla de autorizaciones
        const respSupervisor = await fetch("/api/autorizaciones/supervisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            nombre_supervisor,
            categoria_supervisor,
            comentario_no_autorizar: comentario,
            fecha_hora_supervisor: fechaHoraRechazoSupervisor,
          }),
        });

        if (!respSupervisor.ok) {
          throw new Error(
            `Error ${respSupervisor.status}: ${respSupervisor.statusText}`
          );
        }

        // 2. Consultar el id_estatus desde permisos_trabajo
        let idEstatus = null;
        try {
          const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
          if (respEstatus.ok) {
            const permisoData = await respEstatus.json();
            idEstatus =
              permisoData.id_estatus ||
              (permisoData.data && permisoData.data.id_estatus);
            console.log(
              "[NO AUTORIZAR SUPERVISOR PT1] idEstatus obtenido:",
              idEstatus
            );
          }
        } catch (err) {
          console.error(
            "[NO AUTORIZAR SUPERVISOR PT1] Error al consultar id_estatus:",
            err
          );
        }

        // 3. Actualizar el estatus a 'no autorizado' y guardar el comentario
        if (idEstatus) {
          try {
            const payloadEstatus = { id_estatus: idEstatus };
            console.log(
              "[NO AUTORIZAR SUPERVISOR PT1] Enviando a /api/estatus/no_autorizado:",
              payloadEstatus
            );
            const respEstatus = await fetch("/api/estatus/no_autorizado", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadEstatus),
            });

            if (respEstatus.ok) {
              console.log(
                "[NO AUTORIZAR SUPERVISOR PT1] Estatus actualizado a No Autorizado"
              );

              // Guardar el comentario en la tabla estatus
              const respComentario = await fetch("/api/estatus/comentario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_estatus: idEstatus, comentario }),
              });

              if (respComentario.ok) {
                console.log(
                  "[NO AUTORIZAR SUPERVISOR PT1] Comentario guardado exitosamente"
                );
              }
            } else {
              throw new Error("Error al actualizar estatus");
            }
          } catch (err) {
            console.error(
              "[NO AUTORIZAR SUPERVISOR PT1] Error al actualizar estatus:",
              err
            );
            throw err;
          }
        } else {
          throw new Error("No se pudo obtener id_estatus");
        }

        // 4. Cerrar el modal y mostrar mensaje de éxito
        const modal = document.getElementById("modalComentarioSupervisor");
        if (modal) modal.style.display = "none";

        alert("Permiso rechazado exitosamente por el supervisor.");
        window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
      } catch (err) {
        console.error(
          "[NO AUTORIZAR SUPERVISOR PT1] Error en el proceso de rechazo:",
          err
        );
        alert("Error al procesar el rechazo. Por favor, inténtalo de nuevo.");
      }
    });
  }
}
