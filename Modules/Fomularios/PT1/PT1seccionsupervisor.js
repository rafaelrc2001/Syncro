// Mostrar nombres de responsable y operador del área en la sección de aprobaciones
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (!idPermiso) return;
  fetch(`http://localhost:3000/api/autorizaciones/personas/${idPermiso}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.success && data.data) {
        const responsable = document.getElementById("nombre-responsable-area");
        const operador = document.getElementById("nombre-operador-area");
        if (responsable)
          responsable.textContent = data.data.responsable_area || "-";
        if (operador) operador.textContent = data.data.operador_area || "-";
      }
    })
    .catch((err) => {
      console.error("Error al obtener responsables de área:", err);
    });
});
document.addEventListener("DOMContentLoaded", function () {
  // --- Lógica para el botón "Autorizar" ---
  const btnAutorizar = document.getElementById("btn-guardar-campos");
  if (btnAutorizar) {
    btnAutorizar.addEventListener("click", async function () {
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!supervisor) {
        alert("Debes seleccionar el supervisor.");
        return;
      }
      // 1. Actualizar supervisor y categoría en autorizaciones
      try {
        await fetch(
          "http://localhost:3000/api/autorizaciones/supervisor-categoria",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              supervisor,
              categoria,
            }),
          }
        );
      } catch (err) {
        console.error("Error al actualizar supervisor y categoría:", err);
      }
      // 2. Consultar el id_estatus desde permisos_trabajo
      let idEstatus = null;
      try {
        const respEstatus = await fetch(
          `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
        );
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
        }
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }
      // 3. Actualizar el estatus a "activo"
      if (idEstatus) {
        try {
          await fetch("http://localhost:3000/api/estatus/activo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
        } catch (err) {
          console.error("Error al actualizar estatus activo:", err);
        }
      }
      alert("Permiso autorizado correctamente");
      window.location.href = "/Modules/SupSeguridad/supseguridad.html";
    });
  }

  // --- Lógica para el botón "No Autorizar" ---
  const btnNoAutorizar = document.getElementById("btn-no-autorizar");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", async function () {
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!supervisor) {
        alert("Debes seleccionar el supervisor antes de rechazar.");
        return;
      }
      // Mostrar el modal para capturar el comentario de rechazo
      const modal = document.getElementById("modalComentario");
      if (modal) {
        modal.style.display = "flex";
        document.getElementById("comentarioNoAutorizar").value = "";
      }

      // Lógica para guardar el comentario y actualizar estatus a No Autorizado
      const btnGuardarComentario = document.getElementById(
        "btnGuardarComentario"
      );
      if (btnGuardarComentario) {
        btnGuardarComentario.onclick = async function () {
          const comentario = document
            .getElementById("comentarioNoAutorizar")
            .value.trim();
          if (!comentario) {
            alert("Debes escribir un motivo de rechazo.");
            return;
          }
          // 1. Actualizar supervisor y categoría en autorizaciones
          try {
            await fetch(
              "http://localhost:3000/api/autorizaciones/supervisor-categoria",
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_permiso: idPermiso,
                  supervisor,
                  categoria,
                  comentario_no_autorizar: comentario,
                }),
              }
            );
          } catch (err) {
            console.error("Error al actualizar supervisor y categoría:", err);
          }
          // 2. Consultar el id_estatus desde permisos_trabajo
          let idEstatus = null;
          try {
            const respEstatus = await fetch(
              `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
            );
            if (respEstatus.ok) {
              const permisoData = await respEstatus.json();
              idEstatus =
                permisoData.id_estatus ||
                (permisoData.data && permisoData.data.id_estatus);
            }
          } catch (err) {
            console.error("Error al consultar id_estatus:", err);
          }
          // 3. Actualizar el estatus a "no autorizado" y guardar el comentario en la tabla estatus
          if (idEstatus) {
            try {
              await fetch("http://localhost:3000/api/estatus/no_autorizado", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_estatus: idEstatus }),
              });
              // Guardar el comentario en la tabla estatus
              await fetch("http://localhost:3000/api/estatus/comentario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_estatus: idEstatus, comentario }),
              });
            } catch (err) {
              console.error("Error al actualizar estatus no autorizado:", err);
            }
          }
          // 4. Cerrar el modal y mostrar mensaje de éxito
          const modal = document.getElementById("modalComentario");
          if (modal) modal.style.display = "none";
          alert("Permiso no autorizado correctamente");
          window.location.href = "/Modules/SupSeguridad/supseguridad.html";
        };
      }
      // Lógica para cerrar/cancelar el modal
      const btnCancelarComentario = document.getElementById(
        "btnCancelarComentario"
      );
      if (btnCancelarComentario) {
        btnCancelarComentario.onclick = function () {
          const modal = document.getElementById("modalComentario");
          if (modal) modal.style.display = "none";
        };
      }
    });
  }
  // Llenar select de supervisores desde la base de datos
  fetch("http://localhost:3000/api/supervisores")
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
  fetch("http://localhost:3000/api/categorias")
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
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    });
  }
});

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
  if (idPermiso) {
    // Llamar a la API para obtener los datos del permiso
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos recibidos para el permiso:", data);
        // Prefijo en el título y descripción del trabajo
        if (data && data.general) {
          const h3 = document.querySelector(".section-header h3");
          if (h3) {
            h3.textContent = data.general.prefijo || "NP-XXXXXX";
          }
        }
        if (data && (data.detalles || data.general)) {
          const detalles = data.detalles || {};
          const general = data.general || {};

          document.getElementById("start-time-label").textContent =
            detalles.horario || detalles.hora_inicio || general.horario || general.hora_inicio || "-";
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
