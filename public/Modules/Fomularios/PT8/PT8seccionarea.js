// --- Lógica para el botón "No Autorizar" (adaptada de PT1seccionarea.js para PT8) ---
document.addEventListener("DOMContentLoaded", function () {
  const btnNoAutorizar = document.getElementById("btn-no-autorizar");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", function () {
      // 1. Validar nombre del responsable antes de abrir el modal de comentario
      const responsableInput = document.getElementById("responsable-aprobador");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";
      if (!responsable_area) {
        alert("Debes ingresar el nombre del responsable antes de rechazar.");
        return;
      }
      // Mostrar un modal de confirmación para 'No Autorizar' antes de pedir el motivo
      const noModal = document.getElementById("modalConfirmarNoAutorizar");
      if (noModal) {
        noModal.style.display = "flex";
      } else {
        // Fallback: abrir directamente el modalComentario
        const modal = document.getElementById("modalComentario");
        if (modal) {
          modal.style.display = "flex";
          const ta = document.getElementById("comentarioNoAutorizar");
          if (ta) ta.value = "";
        }
      }
    });

    // --- FUNCIONALIDAD PARA BOTONES DEL MODAL DE CONFIRMACIÓN DE NO AUTORIZAR ---
    const modalConfirmarNoAutorizar = document.getElementById(
      "modalConfirmarNoAutorizar"
    );
    if (modalConfirmarNoAutorizar) {
      // Botón Cancelar
      const btnCancelarConfirmarNo = modalConfirmarNoAutorizar.querySelector(
        "#btnCancelarConfirmarNo"
      );
      if (btnCancelarConfirmarNo) {
        btnCancelarConfirmarNo.addEventListener("click", function () {
          modalConfirmarNoAutorizar.style.display = "none";
        });
      }
      // Botón No Autorizar (rojo)
      const btnConfirmarNoAutorizar = modalConfirmarNoAutorizar.querySelector(
        "#btnConfirmarNoAutorizar"
      );
      if (btnConfirmarNoAutorizar) {
        btnConfirmarNoAutorizar.addEventListener("click", function () {
          modalConfirmarNoAutorizar.style.display = "none";
          const modalComentario = document.getElementById("modalComentario");
          if (modalComentario) {
            modalComentario.style.display = "flex";
            const ta = document.getElementById("comentarioNoAutorizar");
            if (ta) ta.value = "";
          }
        });
      }
    }

    // Lógica para cerrar/cancelar el modal
    const btnCancelarComentario = document.getElementById(
      "btnCancelarComentario"
    );
    if (btnCancelarComentario) {
      btnCancelarComentario.addEventListener("click", function () {
        const modal = document.getElementById("modalComentario");
        if (modal) modal.style.display = "none";
      });
    }

    // Lógica para guardar el comentario y actualizar estatus a No Autorizado (patrón igual que autorizar)
    const btnGuardarComentario = document.getElementById(
      "btnGuardarComentario"
    );
    if (btnGuardarComentario) {
      btnGuardarComentario.addEventListener("click", async function () {
        const comentario = document
          .getElementById("comentarioNoAutorizar")
          .value.trim();
        const responsableInput = document.getElementById(
          "responsable-aprobador"
        );
        const operadorInput = document.getElementById("responsable-aprobador2");
        const responsable_area = responsableInput
          ? responsableInput.value.trim()
          : "";
        const operador_area = operadorInput ? operadorInput.value.trim() : "";
        const params = new URLSearchParams(window.location.search);
        const idPermiso = params.get("id") || window.idPermisoActual;
        if (!comentario) return;
        if (!idPermiso) return;
        if (!responsable_area) return;
        try {
          // Guardar comentario y responsable en la tabla de autorizaciones (opcional, si aplica)
          const nowRechazo = new Date();
          const fechaHoraRechazo = new Date(
            nowRechazo.getTime() - nowRechazo.getTimezoneOffset() * 60000
          ).toISOString();
          await fetch("/api/autorizaciones/area", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              responsable_area,
              encargado_area: operador_area,
              comentario_no_autorizar: comentario,
              fecha_hora_area: fechaHoraRechazo,
            }),
          });

          // Obtener id_estatus y actualizar a no autorizado
          let idEstatus = null;
          const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
          if (respEstatus.ok) {
            const permisoData = await respEstatus.json();
            idEstatus =
              permisoData.id_estatus ||
              (permisoData.data && permisoData.data.id_estatus);
          }
          if (idEstatus) {
            await fetch("/api/estatus/no_autorizado", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_estatus: idEstatus }),
            });
            await fetch("/api/estatus/comentario", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_estatus: idEstatus, comentario }),
            });
          }
          // Cerrar el modal y mostrar mensaje de éxito
          const modal = document.getElementById("modalComentario");
          if (modal) modal.style.display = "none";
          window.location.href = "/Modules/Usuario/AutorizarPT.html";
        } catch (err) {
          alert("Error al rechazar el permiso.");
          console.error("Error al rechazar:", err);
        }
      });
    }
  }
});
// --- Lógica para el botón "Autorizar" (adaptada de PT1seccionarea.js para PT8) ---
document.addEventListener("DOMContentLoaded", function () {
  const btnAutorizar = document.getElementById("btn-guardar-campos");
  if (btnAutorizar) {
    btnAutorizar.addEventListener("click", async function () {
      // 1. Obtener datos necesarios
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";

      // 2. Validaciones básicas
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!responsable_area) {
        alert("Debes ingresar el nombre del responsable del área.");
        if (responsableInput) responsableInput.focus();
        return;
      }

      // 3. Obtener id_estatus y autorizar igual que otros permisos
      try {
        let idEstatus = null;
        const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
        }
        if (idEstatus) {
          await fetch("/api/estatus/seguridad", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
          alert("Permiso autorizado correctamente.");
          window.location.href = "/Modules/Usuario/AutorizarPT.html";
        } else {
          alert("No se pudo obtener el estatus del permiso.");
        }
      } catch (err) {
        alert("Error al autorizar el permiso.");
        console.error("Error al autorizar:", err);
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  // --- INICIALIZACIÓN DE LOGOS ---
  function inicializarLogos() {
    const companyHeader = document.querySelector(".company-header");
    if (companyHeader) {
      const imagenes = companyHeader.querySelectorAll("img");
      imagenes.forEach((img) => {
        // Agregar event listeners para debugging
        img.addEventListener("load", () => {
          console.log(`Logo cargado correctamente: ${img.src}`);
        });
        img.addEventListener("error", () => {
          console.warn(`Error al cargar logo: ${img.src}`);
          // Ocultar imagen si no se puede cargar
          img.style.display = "none";
        });
      });
    }
  }

  // Ejecutar inicialización de logos
  inicializarLogos();

  // --- FUNCIONES PARA RELLENAR AST Y PARTICIPANTES ---
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
                <td>${act.acciones_preventivas || act.descripcion || ""}</td>
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
                <td>    </td>
            `;
          tbody.appendChild(tr);
        });
      }
    }
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
        // --- Mapeo centralizado al estilo PT4/PT5/PT6 ---
        function setText(id, value) {
          const el = document.getElementById(id);
          if (el) el.textContent = value ?? "-";
        }

        function mostrarDatosImprimir(general) {
          // Encabezado y generales
          setText("prefijo-label", general.prefijo);
          setText("start-time-label", general.hora_inicio);
          setText("fecha-label", general.fecha);
          setText("activity-type-label", general.tipo_mantenimiento);
          setText("plant-label", general.area);
          setText("descripcion-trabajo-label", general.descripcion_trabajo);
          setText("empresa-label", general.empresa);
          setText(
            "nombre-solicitante-label",
            general.solicitante || general.nombre_solicitante
          );
          setText("sucursal-label", general.sucursal);
          setText("contrato-label", general.contrato);
          setText("work-order-label", general.ot_numero);
          setText("equipment-label", general.equipo_intervenir);
          setText("tag-label", general.tag);

          // Área Solicitante y campos view-
          setText("view-duracion-inicio", general.hora_inicio_prevista);
          setText("view-duracion-fin", general.hora_fin_prevista);
          setText("view-responsable-operacion", general.responsable_operacion);
          setText("view-empresa-grua", general.empresa_grua);
          setText("view-identificacion-grua", general.identificacion_grua);
          setText(
            "view-declaracion-conformidad",
            general.declaracion_conformidad
          );
          setText("view-inspeccion-periodica", general.inspeccion_periodica);
          setText(
            "view-mantenimiento-preventivo",
            general.mantenimiento_preventivo
          );
          setText("view-inspeccion-diaria", general.inspeccion_diaria);
          setText("view-diagrama-cargas", general.diagrama_cargas);
          setText("view-libro-instrucciones", general.libro_instrucciones);
          setText("view-limitador-carga", general.limitador_carga);
          setText("view-final-carrera", general.final_carrera);
          setText("view-nombre-operador", general.nombre_operador);
          setText("view-empresa-operador", general.empresa_operador);
          setText("view-licencia-operador", general.licencia_operador);
          setText(
            "view-fecha-emision-licencia",
            general.fecha_emision_licencia
          );
          setText("view-vigencia-licencia", general.vigencia_licencia);
          setText("view-tipo-licencia", general.tipo_licencia);
          setText("view-comentarios-operador", general.comentarios_operador);
          setText("view-estrobos-eslingas", general.estrobos_eslingas);
          setText("view-grilletes", general.grilletes);
          setText(
            "view-otros-elementos-auxiliares",
            general.otros_elementos_auxiliares
          );
          setText(
            "view-especificacion-otros-elementos",
            general.especificacion_otros_elementos
          );
          setText(
            "view-requiere-eslingado-especifico",
            general.requiere_eslingado_especifico
          );
          setText(
            "view-especificacion-eslingado",
            general.especificacion_eslingado
          );
          setText("view-extension-gatos", general.extension_gatos);
          setText("view-sobre-ruedas", general.sobre_ruedas);
          setText(
            "view-especificacion-sobre-ruedas",
            general.especificacion_sobre_ruedas
          );
          setText("view-utiliza-plumin", general.utiliza_plumin_si);
          setText("view-especificacion-plumin", general.especificacion_plumin);
          setText("view-longitud-pluma", general.longitud_pluma);
          setText("view-radio-trabajo", general.radio_trabajo);
          setText("view-contrapeso", general.contrapeso);
          setText("view-sector-trabajo", general.sector_trabajo);
          setText("view-carga-segura-diagrama", general.carga_segura_diagrama);
          setText("view-peso-carga", general.peso_carga);
          setText("view-determinada-por", general.determinada_por);
          setText("view-carga-trabajo", general.carga_trabajo);
          setText("view-peso-gancho-eslingas", general.peso_gancho_eslingas);
          setText(
            "view-relacion-carga-carga-segura",
            general.relacion_carga_carga_segura
          );
          setText("view-asentamiento", general.asentamiento);
          setText("view-calzado", general.calzado);
          setText("view-extension-gatos-check", general.extension_gatos_check);
          setText("view-nivelacion", general.nivelacion);
          setText("view-contrapeso-check", general.contrapeso_check);
          setText("view-sector-trabajo-check", general.sector_trabajo_check);
          setText("view-comprobado-por", general.comprobado_por);
          setText(
            "view-balizamiento-operacion",
            general.balizamiento_operacion
          );
          setText("view-reunion-previa", general.reunion_previa);
          setText(
            "view-especificacion-reunion-previa",
            general.especificacion_reunion_previa
          );
          setText(
            "view-presentacion-supervisor",
            general.presentacion_supervisor
          );
          setText("view-nombre-supervisor", general.nombre_supervisor);
          setText("view-permiso-adicional", general.permiso_adicional);
          setText(
            "view-especificacion-permiso-adicional",
            general.especificacion_permiso_adicional
          );
          setText(
            "view-otras-medidas-seguridad",
            general.otras_medidas_seguridad
          );
          setText(
            "view-especificacion-otras-medidas",
            general.especificacion_otras_medidas
          );
          setText(
            "view-observaciones-generales",
            general.observaciones_generales
          );
        }

        // Usar la función centralizada para mostrar los datos
        if (data && data.general) {
          mostrarDatosImprimir(data.general);
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          document.title =
            "Permiso de Trabajo Izaje,Hiab,grua." +
            (data.general.prefijo ? " - " + data.general.prefijo : "");
        }

        // Campos generales PT2
        if (data && data.data) {
          const detalles = data.data;
          if (document.getElementById("maintenance-type-label"))
            document.getElementById("maintenance-type-label").textContent =
              detalles.tipo_mantenimiento || "-";
          if (document.getElementById("work-order-label"))
            document.getElementById("work-order-label").textContent =
              detalles.ot_numero || "-";
          if (document.getElementById("tag-label"))
            document.getElementById("tag-label").textContent =
              detalles.tag || "-";
          if (document.getElementById("start-time-label"))
            document.getElementById("start-time-label").textContent =
              detalles.hora_inicio || "-";
          if (document.getElementById("equipment-description-label"))
            document.getElementById("equipment-description-label").textContent =
              detalles.descripcion_equipo || "-";
          if (document.getElementById("special-tools-label"))
            document.getElementById("special-tools-label").textContent =
              detalles.requiere_herramientas_especiales || "-";

          if (document.getElementById("what-special-tools-label"))
            document.getElementById("what-special-tools-label").textContent =
              data.general.tipo_herramientas_especiales || "-";

          if (document.getElementById("adequate-tools-label"))
            document.getElementById("adequate-tools-label").textContent =
              detalles.herramientas_adecuadas || "-";
          if (document.getElementById("pre-verification-label"))
            document.getElementById("pre-verification-label").textContent =
              detalles.requiere_verificacion_previa || "-";
          if (document.getElementById("risk-knowledge-label"))
            document.getElementById("risk-knowledge-label").textContent =
              detalles.requiere_conocer_riesgos || "-";
          if (document.getElementById("final-observations-label"))
            document.getElementById("final-observations-label").textContent =
              detalles.observaciones_medidas || "-";

          // Requisitos para Administrar los Riesgos desde data.data
          if (document.getElementById("resp-special-protection"))
            document.getElementById("resp-special-protection").textContent =
              detalles.proteccion_especial_recomendada || "-";
          if (document.getElementById("resp-skin-protection"))
            document.getElementById("resp-skin-protection").textContent =
              detalles.proteccion_piel_cuerpo || "-";
          if (document.getElementById("resp-respiratory-protection"))
            document.getElementById("resp-respiratory-protection").textContent =
              detalles.proteccion_respiratoria || "-";
          if (document.getElementById("resp-eye-protection"))
            document.getElementById("resp-eye-protection").textContent =
              detalles.proteccion_ocular || "-";
          if (document.getElementById("resp-fire-protection"))
            document.getElementById("resp-fire-protection").textContent =
              detalles.proteccion_contraincendio || "-";
          if (document.getElementById("fire-protection-type"))
            document.getElementById("fire-protection-type").textContent =
              detalles.tipo_proteccion_contraincendio || "-";
          if (document.getElementById("resp-barriers-required"))
            document.getElementById("resp-barriers-required").textContent =
              detalles.instalacion_barreras || "-";
          if (document.getElementById("observations"))
            document.getElementById("observations").textContent =
              detalles.observaciones_riesgos || "-";

          // Registro de Pruebas Requeridas desde data.data
          if (document.getElementById("valor-co2"))
            document.getElementById("valor-co2").textContent =
              detalles.co2_nivel || "-";
          if (document.getElementById("valor-amonico"))
            document.getElementById("valor-amonico").textContent =
              detalles.nh3_nivel || "-";
          if (document.getElementById("valor-oxigeno"))
            document.getElementById("valor-oxigeno").textContent =
              detalles.oxigeno_nivel || "-";
          if (document.getElementById("valor-lel"))
            document.getElementById("valor-lel").textContent =
              detalles.lel_nivel || "-";
        }

        // Rellenar AST y Participantes igual que PT1
        if (data && data.ast) {
          mostrarAST(data.ast);
        }
        if (data && data.actividades_ast) {
          mostrarActividadesAST(data.actividades_ast);
        }
        if (data && data.participantes_ast) {
          mostrarParticipantesAST(data.participantes_ast);
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });

    // === AGREGA ESTA LÍNEA PARA LLENAR LA TABLA DE RESPONSABLES ===
    llenarTablaResponsables(idPermiso);
  }
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

        let hayAlMenosUno = false;
        filas.forEach((fila) => {
          const nombre =
            fila.nombre && fila.nombre.trim() !== "" ? fila.nombre : "N/A";
          if (nombre !== "N/A") hayAlMenosUno = true;
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${nombre}</td>
            <td>${fila.cargo}</td>
            <td></td>
          `;
          tbody.appendChild(tr);
        });

        if (!hayAlMenosUno) {
          tbody.innerHTML = `<tr><td colspan="3">Sin responsables registrados</td></tr>`;
        }
      } else {
        tbody.innerHTML = `<tr><td colspan="3">Sin responsables registrados</td></tr>`;
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}
