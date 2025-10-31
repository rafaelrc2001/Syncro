// --- Mapeo de datos generales igual que supervisor ---
function mostrarDatosImprimir(permiso) {
  const data = permiso.general ? permiso.general : permiso;
  setText("start-time-label", data.hora_inicio || "-");
  setText("fecha-label", data.fecha || data.fecha_creacion || "-");
  setText("activity-type-label", data.tipo_mantenimiento || "-");
  setText(
    "plant-label",
    data.area && data.area.trim() !== "" ? data.area : "-"
  );
  setText("descripcion-trabajo-label", data.descripcion_trabajo || "-");
  setText("empresa-label", data.empresa || "-");
  setText(
    "nombre-solicitante-label",
    data.solicitante || data.nombre_solicitante || "-"
  );
  setText(
    "sucursal-label",
    data.sucursal && data.sucursal.trim() !== "" ? data.sucursal : "-"
  );
  setText(
    "contrato-label",
    data.contrato && data.contrato.trim() !== "" ? data.contrato : "-"
  );
  setText("work-order-label", data.ot_numero || "-");
  setText(
    "equipment-label",
    data.equipo_intervencion && data.equipo_intervencion.trim() !== ""
      ? data.equipo_intervencion
      : "-"
  );
  setText("tag-label", data.tag && data.tag.trim() !== "" ? data.tag : "-");

  setText("requiere-escalera-label", permiso.requiere_escalera || "-");
  setText("tipo-escalera-label", permiso.tipo_escalera || "-");
  setText("requiere-canastilla-label", permiso.requiere_canastilla_grua || "-");
  setText("aseguramiento-estrobo-label", permiso.aseguramiento_estrobo || "-");
  setText(
    "requiere-andamio-label",
    permiso.requiere_andamio_cama_completa || "-"
  );
  setText("requiere-otro-acceso-label", permiso.otro_tipo_acceso || "-");
  setText("cual-acceso-label", permiso.cual_acceso || "-");
  setText(
    "acceso-libre-obstaculos-label",
    permiso.acceso_libre_obstaculos || "-"
  );
  setText("canastilla-asegurada-label", permiso.canastilla_asegurada || "-");
  setText("andamio-completo-label", permiso.andamio_completo || "-");
  setText(
    "andamio-seguros-zapatas-label",
    permiso.andamio_seguros_zapatas || "-"
  );
  setText("escaleras-buen-estado-label", permiso.escaleras_buen_estado || "-");
  setText("linea-vida-segura-label", permiso.linea_vida_segura || "-");
  setText(
    "arnes-completo-buen-estado-label",
    permiso.arnes_completo_buen_estado || "-"
  );
  setText(
    "suspender-trabajos-adyacentes-label",
    permiso.suspender_trabajos_adyacentes || "-"
  );
  setText(
    "numero-personas-autorizadas-label",
    permiso.numero_personas_autorizadas || "-"
  );
  setText(
    "trabajadores-aptos-evaluacion-label",
    permiso.trabajadores_aptos_evaluacion || "-"
  );
  setText("requiere-barreras-label", permiso.requiere_barreras || "-");
  setText("observaciones-label", permiso.observaciones || "-");

  setText("fluid", data.fluido || "-");
  setText("pressure", data.presion || "-");
  setText("temperature", data.temperatura || "-");

  // --- Medidas / Requisitos para Administrar los Riesgos ---
  setText("proteccion_especial_respuesta", permiso.proteccion_especial || "-");
  setText("proteccion_especial_cual", permiso.proteccion_especial_cual || "-");
  setText("equipo_caidas_respuesta", permiso.equipo_caidas || "-");
  setText("equipo_caidas_cual", permiso.equipo_caidas_cual || "-");
  setText("linea_amortiguador_respuesta", permiso.linea_amortiguador || "-");
  setText("punto_fijo_respuesta", permiso.punto_fijo || "-");
  setText("linea_vida_respuesta", permiso.linea_vida || "-");
  setText("andamio_completo_respuesta", permiso.andamio_completo_opcion || "-");
  setText("tarjeta_andamio_respuesta", permiso.tarjeta_andamio || "-");
  setText("viento_permitido_respuesta", permiso.viento_permitido || "-");
  setText("escalera_condicion_respuesta", permiso.escalera_condicion || "-");
}
// --- Funciones de utilidad ---
function getRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (let r of radios) {
    if (r.checked) return r.value;
  }
  return "";
}

function getInputValue(name) {
  return document.querySelector(`[name="${name}"]`)?.value || "";
}

// Nueva función para manejar checkboxes de SI/NO/NA
function getCheckboxValue(baseName) {
  if (document.querySelector(`[name="${baseName}_si"]`)?.checked) return "SI";
  if (document.querySelector(`[name="${baseName}_no"]`)?.checked) return "NO";
  if (document.querySelector(`[name="${baseName}_na"]`)?.checked) return "N/A";
  return "";
}

// --- AST, Actividades, Participantes, Supervisores y Categorías ---
function mostrarAST(ast) {
  const eppList = document.getElementById("modal-epp-list");
  if (eppList) {
    eppList.innerHTML = "";
    if (ast && ast.epp_requerido) {
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
    if (ast && ast.maquinaria_herramientas) {
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
    if (ast && ast.material_accesorios) {
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
          <td></td>
        `;
        tbody.appendChild(tr);
      });
    }
  }
}

function rellenarSupervisoresYCategorias() {
  fetch("/api/supervisores")
    .then((resp) => resp.json())
    .then((data) => {
      const selectSupervisor = document.getElementById("responsable-aprobador");
      if (selectSupervisor) {
        selectSupervisor.innerHTML =
          '<option value="" disabled selected>Seleccione un supervisor...</option>';
        (Array.isArray(data) ? data : data.supervisores).forEach((sup) => {
          const option = document.createElement("option");
          option.value = sup.nombre || sup.id;
          option.textContent = sup.nombre;
          selectSupervisor.appendChild(option);
        });
      }
    });

  fetch("/api/categorias")
    .then((resp) => resp.json())
    .then((data) => {
      const selectCategoria = document.getElementById("responsable-aprobador2");
      if (selectCategoria) {
        selectCategoria.innerHTML =
          '<option value="" disabled selected>Seleccione una categoria...</option>';
        (Array.isArray(data) ? data : data.categorias).forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.nombre || cat.id;
          option.textContent = cat.nombre;
          selectCategoria.appendChild(option);
        });
      }
    });
}
// Utilidad para asignar texto en un elemento por id
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "-";
}

// Lógica para mostrar los datos en las etiquetas (igual que sección área)
function mostrarDatosSupervisor(permiso) {
  // No sobreescribir el prefijo ni el título aquí, ya se llenaron en el primer fetch

  setText("descripcion-trabajo-label", permiso.descripcion_trabajo); // Nuevo: mapeo descripcion
  setText("maintenance-type-label", permiso.tipo_mantenimiento);
  setText("work-order-label", permiso.ot_numero);
  setText("tag-label", permiso.tag);
  setText("start-time-label", permiso.hora_inicio);
  setText("equipment-description-label", permiso.equipo_intervencion);
  setText("requiere-escalera-label", permiso.requiere_escalera);
  setText("tipo-escalera-label", permiso.tipo_escalera || "-");
  setText("requiere-canastilla-label", permiso.requiere_canastilla_grua);
  setText("aseguramiento-estrobo-label", permiso.aseguramiento_estrobo);
  setText("requiere-andamio-label", permiso.requiere_andamio_cama_completa);
  setText("requiere-otro-acceso-label", permiso.otro_tipo_acceso);
  setText("cual-acceso-label", permiso.cual_acceso || "-");
  setText("acceso-libre-obstaculos-label", permiso.acceso_libre_obstaculos);
  setText("canastilla-asegurada-label", permiso.canastilla_asegurada);
  setText("andamio-completo-label", permiso.andamio_completo);
  setText("andamio-seguros-zapatas-label", permiso.andamio_seguros_zapatas);
  setText("escaleras-buen-estado-label", permiso.escaleras_buen_estado);
  setText("linea-vida-segura-label", permiso.linea_vida_segura);
  setText(
    "arnes-completo-buen-estado-label",
    permiso.arnes_completo_buen_estado
  );
  setText(
    "suspender-trabajos-adyacentes-label",
    permiso.suspender_trabajos_adyacentes
  );
  setText(
    "numero-personas-autorizadas-label",
    permiso.numero_personas_autorizadas
  );
  setText(
    "trabajadores-aptos-evaluacion-label",
    permiso.trabajadores_aptos_evaluacion
  );
  setText("requiere-barreras-label", permiso.requiere_barreras);
  setText("observaciones-label", permiso.observaciones);

  // Mapeo de condiciones del proceso
  // Si existe 'fluido', úsalo; si no, busca en otros posibles campos
  setText(
    "fluid",
    permiso.fluido || permiso.fluido_proceso || permiso.fluido_area || "-"
  );
  setText("pressure", permiso.presion);
  setText("temperature", permiso.temperatura);

  // --- Medidas / Requisitos para Administrar los Riesgos ---
  setText("proteccion_especial_respuesta", permiso.proteccion_especial);
  setText("proteccion_especial_cual", permiso.proteccion_especial_cual);
  setText("equipo_caidas_respuesta", permiso.equipo_caidas);
  setText("equipo_caidas_cual", permiso.equipo_caidas_cual);
  setText("linea_amortiguador_respuesta", permiso.linea_amortiguador);
  setText("punto_fijo_respuesta", permiso.punto_fijo);
  setText("linea_vida_respuesta", permiso.linea_vida);
  setText("andamio_completo_respuesta", permiso.andamio_completo_opcion);
  setText("tarjeta_andamio_respuesta", permiso.tarjeta_andamio);
  setText("viento_permitido_respuesta", permiso.viento_permitido);
  setText("escalera_condicion_respuesta", permiso.escalera_condicion);
}

// Al cargar la página, obtener el id y mostrar los datos

document.addEventListener("DOMContentLoaded", function () {
  // Lógica para el botón "Salir" igual que PT3
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/CrearPT.html";
    });
  }
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");

  const comentarioDiv = document.getElementById("comentarios-permiso");
  if (comentarioDiv && idPermiso) {
    mostrarComentarioSiCorresponde(idPermiso, comentarioDiv);
  }

  if (idPermiso) {
    // 1. Obtener datos generales y AST
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Respuesta completa de /api/verformularios:", data);

        // Prefijo en el título
        if (data && data.general && document.getElementById("prefijo-label")) {
          // Mostrar el prefijo en el encabezado
          document.getElementById("prefijo-label").textContent =
            data.general.prefijo || "-";
          // Mostrar el prefijo en el título de la pestaña
          document.title = `Permiso Apertura Altura ${
            data.general.prefijo || "-"
          }`;
        }
        // Rellenar datos generales si existen
        if (data && data.general) {
          console.log("Datos generales:", data.general);
          mostrarDatosImprimir(data.general);
        }
        // Rellenar AST y Participantes
        if (data && data.ast) {
          mostrarAST(data.ast);
        } else {
          mostrarAST({});
        }
        if (data.actividades_ast) {
          mostrarActividadesAST(data.actividades_ast);
        } else {
          mostrarActividadesAST([]);
        }
        if (data.participantes_ast) {
          mostrarParticipantesAST(data.participantes_ast);
        } else {
          mostrarParticipantesAST([]);
        }
      });

    // === AGREGA ESTA LÍNEA AQUÍ ===
    llenarTablaResponsables(idPermiso);
  }
  rellenarSupervisoresYCategorias();

  // --- LÓGICA PARA CERRAR PERMISO ---
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

        // 3. Enviar los datos a N8N si existe la función
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

/**
 * Función para asegurar que todas las imágenes estén cargadas
 */
function esperarImagenes() {
  return new Promise((resolve) => {
    const imagenes = document.querySelectorAll(".company-header img");
    if (imagenes.length === 0) {
      resolve();
      return;
    }
    let imagenesRestantes = imagenes.length;
    imagenes.forEach((img) => {
      if (img.complete && img.naturalHeight !== 0) {
        imagenesRestantes--;
        if (imagenesRestantes === 0) resolve();
      } else {
        img.onload = () => {
          imagenesRestantes--;
          if (imagenesRestantes === 0) resolve();
        };
        img.onerror = () => {
          imagenesRestantes--;
          if (imagenesRestantes === 0) resolve();
        };
      }
    });
    setTimeout(() => resolve(), 3000); // Timeout de seguridad
  });
}

/**
 * Función de impresión tradicional (fallback)
 */
async function imprimirPermisoTradicional() {
  try {
    await esperarImagenes();
    window.print();
  } catch (error) {
    console.error("Error al imprimir:", error);
    alert(
      "Ocurrió un error al preparar la impresión. Por favor, inténtalo nuevamente."
    );
  }
}

// Event listener para el botón de imprimir
const btnImprimir = document.getElementById("btn-imprimir-permiso");
if (btnImprimir) {
  btnImprimir.addEventListener("click", function (e) {
    e.preventDefault();
    imprimirPermisoTradicional(); // Imprime directo, sin confirmación ni instrucciones
  });

  btnImprimir.style.transition = "all 0.3s ease";
  btnImprimir.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 6px 20px rgba(0,59,92,0.3)";
  });
  btnImprimir.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "";
  });
}

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

// Elimina o comenta el listener de Ctrl+P para instrucciones
// document.addEventListener("keydown", function (e) {
//   if ((e.ctrlKey || e.metaKey) && e.key === "p") {
//     e.preventDefault();
//     mostrarInstruccionesImpresion();
//   }
// });

// Elimina o comenta la función mostrarInstruccionesImpresion si no la usas en otro lado

// --- Lógica para el botón "Autorizar" ---
