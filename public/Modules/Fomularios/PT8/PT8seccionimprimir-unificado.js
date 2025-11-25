document.addEventListener("DOMContentLoaded", function () {
  // --- INICIALIZACIÓN DE LOGOS ---
  function inicializarLogos() {
    const companyHeader = document.querySelector(".company-header");
    if (companyHeader) {
      const imagenes = companyHeader.querySelectorAll("img");
      imagenes.forEach((img) => {
        // Agregar event listeners para debugging
        img.addEventListener("load", () => {
          console.log("Imagen cargada:", img.src);
        });
        img.addEventListener("error", () => {
          console.error("Error al cargar imagen:", img.src);
          // Intentar cargar imagen por defecto si hay error
          img.src = "/img/logo-default.png";
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
          const td1 = document.createElement("td");
          td1.textContent = act.actividad || "";
          const td2 = document.createElement("td");
          td2.textContent = act.riesgo || "";
          const td3 = document.createElement("td");
          td3.textContent = act.medidas || "";
          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
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
          const td1 = document.createElement("td");
          td1.textContent = p.nombre || "";
          const td2 = document.createElement("td");
          td2.textContent = p.funcion || "";
          tr.appendChild(td1);
          tr.appendChild(td2);
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
          if (el) el.textContent = value || "-";
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
          setText("view-gancho-seguridad", general.gancho_seguridad);
          setText("view-pestillo-seguridad", general.pestillo_seguridad);
          setText("view-alambres-cable", general.alambres_cable);
          setText("view-eslingas-estrobos", general.eslingas_estrobos);
          setText("view-grilletes", general.grilletes);
          setText("view-aparejos", general.aparejos);
          setText("view-tablones", general.tablones);
          setText("view-senales-mano", general.senales_mano);
          setText("view-radio-comunicacion", general.radio_comunicacion);
          setText("view-banderillero", general.banderillero);
          setText("view-area-acordonada", general.area_acordonada);
          setText("view-cono-senales", general.cono_senales);
          setText("view-cinta-advertencia", general.cinta_advertencia);
          setText("view-peso-carga", general.peso_carga);
          setText("view-puntos-izaje", general.puntos_izaje);
          setText("view-centro-gravedad", general.centro_gravedad);
          setText("view-capacidad-grua", general.capacidad_grua);
          setText("view-radio-carga", general.radio_carga);
          setText("view-angulo-pluma", general.angulo_pluma);
          setText("view-porcentaje-capacidad", general.porcentaje_capacidad);
          setText("view-vientos", general.vientos);
          setText("view-lluvia", general.lluvia);
          setText("view-niebla", general.niebla);
          setText("view-temperatura", general.temperatura);
          setText("view-carga-suspendida", general.carga_suspendida);
          setText("view-lineas-energia", general.lineas_energia);
          setText("view-distancia-seguridad", general.distancia_seguridad);
          setText("view-voltaje-linea", general.voltaje_linea);
          setText("view-obstaculos-aereos", general.obstaculos_aereos);
          setText("view-descripcion-obstaculos", general.descripcion_obstaculos);
          setText("view-piso-firme", general.piso_firme);
          setText("view-piso-nivelado", general.piso_nivelado);
          setText("view-capacidad-piso", general.capacidad_piso);
          setText("view-estabilizadores", general.estabilizadores);
          setText("view-equipo-traccion", general.equipo_traccion);
          setText("view-bloqueos-ruedas", general.bloqueos_ruedas);
          setText("view-plan-izaje", general.plan_izaje);
          setText("view-personal-solo-necesario", general.personal_solo_necesario);
          setText("view-supervision-continua", general.supervision_continua);
          setText("view-prueba-izaje", general.prueba_izaje);
          setText("view-comunicacion-clara", general.comunicacion_clara);
        }

        // Usar la función centralizada para mostrar los datos
        if (data && data.general) {
          mostrarDatosImprimir(data.general);
          console.log(
            "Datos generales cargados desde /api/verformularios:",
            data.general
          );
        }

        // Campos generales PT2
        if (data && data.data) {
          // Usar los datos específicos del permiso si existen
          const permiso = data.data;
          function setText(id, value) {
            const el = document.getElementById(id);
            if (el) el.textContent = value || "-";
          }

          // Otros campos específicos del formulario
          setText(
            "special-tools-label",
            permiso.requiere_herramientas_especiales
          );
          setText(
            "special-tools-type-label",
            permiso.tipo_herramientas_especiales
          );
          setText("adequate-tools-label", permiso.herramientas_adecuadas);
          setText(
            "pre-verification-label",
            permiso.requiere_verificacion_previa
          );
          setText("risk-knowledge-label", permiso.requiere_conocer_riesgos);
          setText("final-observations-label", permiso.observaciones_medidas);

          // Requisitos de apertura de área
          setText("otro_permiso-label", permiso.requiere_otro_permiso);
          setText("cual_otro_permiso-label", permiso.cual_otro_permiso);
          setText(
            "barricadas_senalamientos-label",
            permiso.barricadas_senalamientos
          );
          setText(
            "suspension_trabajos_cercano-label",
            permiso.suspender_trabajos_cercanos
          );
          setText(
            "retiro_personal_ajeno-label",
            permiso.retirar_personal_ajeno
          );
          setText("placa_dosimetro-label", permiso.usar_dosimetro);
          setText("limite_exposicion-label", permiso.limite_exposicion);
          setText("letreros_advertencia-label", permiso.letreros_advertencia);
          setText("advirtio_personal-label", permiso.advirtio_personal);
          setText(
            "ubicacion_fuente_radioactiva-label",
            permiso.ubicacion_fuente
          );
          setText(
            "numero_personas_autorizadas-label",
            permiso.numero_personas_autorizadas
          );
          setText(
            "tiempo_exposicion_permisible-label",
            permiso.tiempo_exposicion_permitido
          );

          // Condiciones del proceso
          setText("fluid-label", permiso.fluido);
          setText("pressure-label", permiso.presion);
          setText("temperature-label", permiso.temperatura);

          console.log(
            "Datos específicos del permiso cargados desde data.data:",
            permiso
          );
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
      // Detectar la página actual y redirigir a la correspondiente
      if (window.location.pathname.includes("PT8imprimir2.html")) {
        window.location.href = "/Modules/Usuario/AutorizarPT.html";
      } else if (window.location.pathname.includes("PT8imprimirseg.html")) {
        window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (window.location.pathname.includes("PT8imprimirsup.html")) {
        window.location.href = "../../JefeSeguridad/JefeSeguridad.html";
      }
    });
  }

  // ============================
  // FUNCIONALIDAD DE PDF PROFESIONAL
  // ============================

  /**
   * Función para recolectar todos los datos del formulario PT8 (Izaje)
   */
  function recolectarDatosPT8() {
    // Solo los campos relevantes para PT8 (ajusta los IDs según tu HTML de Izaje)
    const datos = {
      tipo_izaje:
        document.getElementById("tipo-izaje-label")?.textContent || "-",
      equipo_a_izar:
        document.getElementById("equipo-a-izar-label")?.textContent || "-",
      capacidad: document.getElementById("capacidad-label")?.textContent || "-",
      operador: document.getElementById("operador-label")?.textContent || "-",
      supervisor:
        document.getElementById("supervisor-label")?.textContent || "-",
      fecha: document.getElementById("fecha-label")?.textContent || "-",
      hora_inicio:
        document.getElementById("start-time-label")?.textContent || "-",
      descripcion_trabajo:
        document.getElementById("descripcion-trabajo-label")?.textContent ||
        "-",
      // Agrega aquí todos los campos de seguridad, checklist, etc. propios de PT8
      // Ejemplo:
      checklist_gancho:
        document.getElementById("checklist-gancho-label")?.textContent || "-",
      checklist_eslinga:
        document.getElementById("checklist-eslinga-label")?.textContent || "-",
      observaciones:
        document.getElementById("observaciones-label")?.textContent || "-",
      // Participantes y AST
      ast_activities: window.astActivities || [],
      personal_involucrado: window.personalInvolucrado || [],
      epp_requerido: window.astData?.epp_requerido || "-",
      maquinaria_herramientas: window.astData?.maquinaria_herramientas || "-",
      material_accesorios: window.astData?.material_accesorios || "-",
    };
    return datos;
  }

  /**
   * Función para generar PDF profesional
   */
  async function generarPDFProfesional() {
    try {
      // Mostrar mensaje de carga
      const mensajeCarga = mostrarMensajeCarga("Generando PDF profesional...");

      // Recolectar datos del formulario de PT8 (Izaje)
      const datosPT8 = recolectarDatosPT8();

      // Hacer petición al servidor para generar PDF de PT8 (ajusta el endpoint si es necesario)
      const response = await fetch("/api/pt8/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosPT8),
      });

      if (!response.ok) {
        throw new Error("Error al generar PDF en el servidor");
      }

      // Obtener el PDF como blob
      const pdfBlob = await response.blob();

      // Crear URL para descargar
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Obtener nombre del archivo desde headers o usar por defecto
      const contentDisposition = response.headers.get("Content-Disposition");

      let filename = "PT8_Izaje.pdf";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Crear enlace temporal para descargar
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL temporal
      URL.revokeObjectURL(pdfUrl);

      // Remover mensaje de carga
      removerMensajeCarga(mensajeCarga);

      // Mostrar mensaje de éxito
      mostrarMensajeExito("PDF generado y descargado exitosamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);

      // Remover mensaje de carga si existe
      const mensajeCarga = document.getElementById("mensaje-carga");
      if (mensajeCarga) {
        removerMensajeCarga(mensajeCarga);
      }

      // Mostrar error al usuario
      mostrarMensajeError(
        "Error al generar el PDF. Intentando con impresión tradicional..."
      );

      // Fallback a impresión tradicional
      setTimeout(() => {
        imprimirPermisoTradicional();
      }, 2000);
    }
  }

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
          if (imagenesRestantes === 0) {
            resolve();
          }
        } else {
          img.onload = () => {
            imagenesRestantes--;
            if (imagenesRestantes === 0) {
              resolve();
            }
          };
          img.onerror = () => {
            imagenesRestantes--;
            if (imagenesRestantes === 0) {
              resolve();
            }
          };
        }
      });

      // Timeout de seguridad en caso de que las imágenes no carguen
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  }

  /**
   * Función de impresión tradicional (fallback)
   */
  async function imprimirPermisoTradicional() {
    try {
      // Esperar a que las imágenes se carguen completamente
      await esperarImagenes();

      // Ejecutar impresión tradicional del navegador
      window.print();
    } catch (error) {
      console.error("Error al imprimir:", error);
      alert(
        "Ocurrió un error al preparar la impresión. Por favor, inténtalo nuevamente."
      );
    }
  }

  /**
   * Función principal de impresión (directo sin ventanas emergentes)
   */
  function imprimirPermiso() {
    // Ir directo a impresión tradicional sin ventanas emergentes
    imprimirPermisoTradicional();
  }

  /**
   * Funciones auxiliares para mensajes
   */
  function mostrarMensajeCarga(mensaje) {
    const mensajeCarga = document.createElement("div");
    mensajeCarga.id = "mensaje-carga";
    mensajeCarga.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #003B5C;
      color: white;
      padding: 20px 30px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: 'Roboto', sans-serif;
      text-align: center;
    `;
    mensajeCarga.innerHTML = `
      <i class="ri-file-pdf-line" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
      ${mensaje}
      <div style="margin-top: 10px;">
        <div style="width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; margin: 0 auto; animation: spin 1s linear infinite;"></div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    document.body.appendChild(mensajeCarga);
    return mensajeCarga;
  }

  function removerMensajeCarga(mensaje) {
    if (mensaje && mensaje.parentNode) {
      mensaje.parentNode.removeChild(mensaje);
    }
  }

  function mostrarMensajeExito(mensaje) {
    const mensajeExito = document.createElement("div");
    mensajeExito.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10001;
      font-family: 'Roboto', sans-serif;
      animation: slideIn 0.3s ease-out;
    `;
    mensajeExito.innerHTML = `
      <i class="ri-check-line" style="margin-right: 8px;"></i>
      ${mensaje}
    `;

    document.body.appendChild(mensajeExito);

    setTimeout(() => {
      if (mensajeExito.parentNode) {
        mensajeExito.parentNode.removeChild(mensajeExito);
      }
    }, 3000);
  }

  function mostrarMensajeError(mensaje) {
    const mensajeError = document.createElement("div");
    mensajeError.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 15px 20px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10001;
      font-family: 'Roboto', sans-serif;
      animation: slideIn 0.3s ease-out;
    `;
    mensajeError.innerHTML = `
      <i class="ri-error-warning-line" style="margin-right: 8px;"></i>
      ${mensaje}
    `;

    document.body.appendChild(mensajeError);

    setTimeout(() => {
      if (mensajeError.parentNode) {
        mensajeError.parentNode.removeChild(mensajeError);
      }
    }, 5000);
  }

  // Event listener para el botón de imprimir
  // --- CONFIGURACIÓN DEFINITIVA PARA ELIMINAR ENCABEZADOS ---

  // Función que muestra las instrucciones exactas para eliminar encabezados

  // Interceptar Ctrl+P para mostrar instrucciones
  // Elimina o comenta este bloque para que Ctrl+P funcione normal
  // document.addEventListener("keydown", function (e) {
  //   if ((e.ctrlKey || e.metaKey) && e.key === "p") {
  //     e.preventDefault();
  //     mostrarInstruccionesImpresion();
  //   }
  // });

  // Modifica el botón de imprimir para que imprima directo sin instrucciones
  const btnImprimir = document.getElementById("btn-imprimir-permiso");
  if (btnImprimir) {
    btnImprimir.addEventListener("click", function (e) {
      e.preventDefault();
      imprimirPermiso(); // Imprime directo, sin confirmación ni instrucciones
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

  console.log("Funcionalidad de PDF PT8 (Izaje) inicializada correctamente");
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
        alert("Por favor, ingresa un comentario antes de cerrar el permiso.");
        return;
      }

      if (!tipoCierre) {
        alert("Por favor, selecciona un tipo de cierre.");
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
        const resp = await fetch(`/api/permisos/${idPermiso}`);
        const data = await resp.json();
        if (data && data.id_estatus) {
          idEstatus = data.id_estatus;
        }
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }
      if (!idEstatus) {
        alert("No se pudo obtener el estatus actual del permiso.");
        return;
      }

      // Mapear el tipo de cierre al endpoint correspondiente
      let endpoint;
      let mensajeExito;

      switch (tipoCierre) {
        case "finalizado":
          endpoint = `/api/estatus/${idEstatus}/finalizar`;
          mensajeExito = "Permiso finalizado con éxito";
          break;
        case "cancelado":
          endpoint = `/api/estatus/${idEstatus}/cancelar`;
          mensajeExito = "Permiso cancelado con éxito";
          break;
        case "terminado":
          endpoint = `/api/estatus/${idEstatus}/terminar`;
          mensajeExito = "Permiso terminado con éxito";
          break;
        default:
          alert("Tipo de cierre no válido.");
          return;
      }

      // Guardar el comentario y actualizar el estatus
      try {
        // 1. Guardar comentario
        const respComentario = await fetch(`/api/comentarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            comentario: comentario,
          }),
        });
        if (!respComentario.ok) {
          throw new Error("Error al guardar el comentario");
        }

        // 2. Actualizar el estatus
        const respEstatus = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!respEstatus.ok) {
          throw new Error("Error al actualizar el estatus");
        }

        alert(mensajeExito);
        modalCerrarPermiso.style.display = "none";

        // Redirigir según el tipo de permiso
        setTimeout(() => {
          if (window.location.pathname.includes("PT8imprimir2.html")) {
            window.location.href = "/Modules/Usuario/AutorizarPT.html";
          } else if (window.location.pathname.includes("PT8imprimirseg.html")) {
            window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
          } else if (window.location.pathname.includes("PT8imprimirsup.html")) {
            window.location.href = "../../JefeSeguridad/JefeSeguridad.html";
          }
        }, 1500);
      } catch (err) {
        console.error("Error en el proceso de cierre:", err);
        alert("Ocurrió un error al cerrar el permiso. Intenta nuevamente.");
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
          { nombre: data.nombre_supervisor, cargo: "Supervisor de Seguridad" },
        ];

        let hayAlMenosUno = false;
        filas.forEach((fila) => {
          if (fila.nombre && fila.nombre.trim() !== "") {
            hayAlMenosUno = true;
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${fila.nombre}</td>
              <td>${fila.cargo}</td>
            `;
            tbody.appendChild(tr);
          }
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
