document.addEventListener("DOMContentLoaded", function () {
  // --- FUNCION DE MAPEADO PARA VISTA-PT9 (Cesta) ---
  function mostrarDatosImprimirPT9(general) {
    // Bloque: Datos Generales (encabezado del formulario) usando los mismos IDs que el HTML (como en PT8)
    setText("start-time-label", general.hora_inicio);
    setText("fecha-label", general.fecha);
    setText("activity-type-label", general.tipo_mantenimiento);
    setText("plant-label", general.area);
    setText("descripcion-trabajo-label", general.descripcion_trabajo);
    setText("empresa-label", general.empresa);
    setText("nombre-solicitante-label", general.nombre_solicitante);
    setText("sucursal-label", general.sucursal);
    setText("contrato-label", general.contrato);
    setText("work-order-label", general.ot_numero);
    setText("equipment-label", general.equipo_intervenir);
    setText("tag-label", general.tag);

    // Bloque: Datos de la Grúa y Cesta
    setText("view-identificacion-grua", general.identificacion_grua_cesta);
    setText("view-perteneciente-empresa-grua", general.empresa_grua_cesta);
    setText("view-identificacion-cesta", general.identificacion_cesta);
    setText("view-perteneciente-empresa-cesta", general.empresa_cesta);
    setText("view-peso-cesta", general.peso_cesta);
    setText("view-carga-maxima-cesta", general.carga_maxima_cesta);
    setText("view-ultima-revision-cesta", general.ultima_revision_cesta);

    // Bloque: Condiciones de Elevación
    setText("view-asentamiento", general.asentamiento);
    setText("view-calzado", general.calzado);
    setText("view-nivelacion", general.nivelacion);
    setText("view-ext-gatos", general.ext_gatos);
    setText("view-especificar-gatos", general.especificacion_ext_gatos);
    setText("view-utiliza-plumin", general.utiliza_plumin_cesta);
    setText("view-especificar-plumin", general.especificacion_plumin_cesta);
    setText("view-longitud-pluma", general.longitud_pluma_cesta);
    setText("view-radio-trabajo", general.radio_trabajo_cesta);
    setText("view-carga-segura", general.carga_segura_cesta);
    setText("view-peso-carga", general.peso_carga_cesta);
    setText("view-peso-gancho-elementos", general.peso_gancho_elementos);
    setText("view-carga-de-trabajo", general.carga_trabajo_cesta);
    setText("view-relacion-carga-segura", general.relacion_carga_segura_cesta);

    // Bloque: Prueba Previa a Suspensión
    setText("view-carga-prueba", general.carga_prueba);
    setText("view-prueba-realizada", general.prueba_realizada);
    setText("view-prueba-presenciada-por", general.prueba_presenciada_por);
    setText("view-firma", general.firma_prueba);
    setText("view-fecha-prueba", general.fecha_prueba);

    // Bloque: Medidas de Seguridad Previas
    setText("view-mascaras-escape", general.mascaras_escape_cesta);
    setText("view-equipo-proteccion", general.equipo_proteccion_cesta);
    setText(
      "view-equipo-contra-incendios",
      general.equipo_contra_incendios_cesta
    );
    setText("view-final-carrera", general.final_carrera_cesta);
    setText("view-otras-medidas", general.otras_medidas_cesta);

    // Bloque: Observaciones Generales
    setText(
      "view-observaciones-generales",
      general.observaciones_generales_cesta
    );
  }

  // Utilidad para setear texto
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value != null && value !== "" ? value : "-";
  }
  // --- INICIALIZACIÓN DE LOGOS ---
  function inicializarLogos() {
    const companyHeader = document.querySelector(".company-header");
    if (companyHeader) {
      const imagenes = companyHeader.querySelectorAll("img");
      imagenes.forEach((img) => {
        img.onerror = function () {
          console.warn("Error al cargar imagen:", this.src);
          this.style.display = "none"; // Ocultar imagen si falla
        };
        img.onload = function () {
          console.log("Imagen cargada exitosamente:", this.src);
        };
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
        const items = ast.epp_requerido.split(",");
        items.forEach((item) => {
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
        const items = ast.maquinaria_herramientas.split(",");
        items.forEach((item) => {
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
        const items = ast.material_accesorios.split(",");
        items.forEach((item) => {
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
            <td>${act.actividad_secuencial || "-"}</td>
            <td>${act.peligros_potenciales || "-"}</td>
            <td>${act.controles_implementados || "-"}</td>
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
            <td>${p.nombre_completo || "-"}</td>
            <td>${p.rut || "-"}</td>
            <td>${p.empresa || "-"}</td>
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
        // Prefijo en el título
        if (data && data.general) {
          mostrarDatosImprimirPT9(data.general);
          const titulo = document.getElementById("titulo-permiso");
          if (titulo && data.general.prefijo_folio) {
            titulo.textContent = `Permiso de Trabajo N° ${data.general.prefijo_folio}`;
          }
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
  
  // --- CONFIGURACIÓN DE REDIRECCIÓN DINÁMICA SEGÚN LA PÁGINA ---
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      // Detectar qué página está activa
      if (window.location.pathname.includes("PT9imprimir2.html")) {
        window.location.href = "/Modules/Usuario/AutorizarPT.html";
      } else if (window.location.pathname.includes("PT9imprimirseg.html")) {
        window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (window.location.pathname.includes("PT9imprimirsup.html")) {
        window.location.href = "../../JefeSeguridad/JefeSeguridad.html";
      }
    });
  }

  // ============================
  // FUNCIONALIDAD DE PDF PROFESIONAL
  // ============================

  /**
   * Función para recolectar todos los datos del formulario PT9 (Cesta)
   */
  function recolectarDatosPT9() {
    const datos = {
      // Datos generales
      hora_inicio:
        document.getElementById("start-time-label")?.textContent || "-",
      fecha: document.getElementById("fecha-label")?.textContent || "-",
      tipo_mantenimiento:
        document.getElementById("activity-type-label")?.textContent || "-",
      area: document.getElementById("plant-label")?.textContent || "-",
      descripcion_trabajo:
        document.getElementById("descripcion-trabajo-label")?.textContent ||
        "-",
      empresa: document.getElementById("empresa-label")?.textContent || "-",
      nombre_solicitante:
        document.getElementById("nombre-solicitante-label")?.textContent || "-",
      sucursal: document.getElementById("sucursal-label")?.textContent || "-",
      contrato: document.getElementById("contrato-label")?.textContent || "-",
      ot_numero:
        document.getElementById("work-order-label")?.textContent || "-",
      equipo_intervenir:
        document.getElementById("equipment-label")?.textContent || "-",
      tag: document.getElementById("tag-label")?.textContent || "-",

      // Datos de la Grúa y Cesta
      identificacion_grua_cesta:
        document.getElementById("view-identificacion-grua")?.textContent || "-",
      empresa_grua_cesta:
        document.getElementById("view-perteneciente-empresa-grua")
          ?.textContent || "-",
      identificacion_cesta:
        document.getElementById("view-identificacion-cesta")?.textContent ||
        "-",
      empresa_cesta:
        document.getElementById("view-perteneciente-empresa-cesta")
          ?.textContent || "-",
      peso_cesta:
        document.getElementById("view-peso-cesta")?.textContent || "-",
      carga_maxima_cesta:
        document.getElementById("view-carga-maxima-cesta")?.textContent || "-",
      ultima_revision_cesta:
        document.getElementById("view-ultima-revision-cesta")?.textContent ||
        "-",

      // Condiciones de Elevación
      asentamiento:
        document.getElementById("view-asentamiento")?.textContent || "-",
      calzado: document.getElementById("view-calzado")?.textContent || "-",
      nivelacion:
        document.getElementById("view-nivelacion")?.textContent || "-",
      ext_gatos:
        document.getElementById("view-ext-gatos")?.textContent || "-",
      especificacion_ext_gatos:
        document.getElementById("view-especificar-gatos")?.textContent || "-",
      utiliza_plumin_cesta:
        document.getElementById("view-utiliza-plumin")?.textContent || "-",
      especificacion_plumin_cesta:
        document.getElementById("view-especificar-plumin")?.textContent || "-",
      longitud_pluma_cesta:
        document.getElementById("view-longitud-pluma")?.textContent || "-",
      radio_trabajo_cesta:
        document.getElementById("view-radio-trabajo")?.textContent || "-",
      carga_segura_cesta:
        document.getElementById("view-carga-segura")?.textContent || "-",
      peso_carga_cesta:
        document.getElementById("view-peso-carga")?.textContent || "-",
      peso_gancho_elementos:
        document.getElementById("view-peso-gancho-elementos")?.textContent ||
        "-",
      carga_trabajo_cesta:
        document.getElementById("view-carga-de-trabajo")?.textContent || "-",
      relacion_carga_segura_cesta:
        document.getElementById("view-relacion-carga-segura")?.textContent ||
        "-",

      // Prueba Previa a Suspensión
      carga_prueba:
        document.getElementById("view-carga-prueba")?.textContent || "-",
      prueba_realizada:
        document.getElementById("view-prueba-realizada")?.textContent || "-",
      prueba_presenciada_por:
        document.getElementById("view-prueba-presenciada-por")?.textContent ||
        "-",
      firma_prueba:
        document.getElementById("view-firma")?.textContent || "-",
      fecha_prueba:
        document.getElementById("view-fecha-prueba")?.textContent || "-",

      // Medidas de Seguridad Previas
      mascaras_escape_cesta:
        document.getElementById("view-mascaras-escape")?.textContent || "-",
      equipo_proteccion_cesta:
        document.getElementById("view-equipo-proteccion")?.textContent || "-",
      equipo_contra_incendios_cesta:
        document.getElementById("view-equipo-contra-incendios")?.textContent ||
        "-",
      final_carrera_cesta:
        document.getElementById("view-final-carrera")?.textContent || "-",
      otras_medidas_cesta:
        document.getElementById("view-otras-medidas")?.textContent || "-",

      // Observaciones Generales
      observaciones_generales_cesta:
        document.getElementById("view-observaciones-generales")?.textContent ||
        "-",

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

      // Recolectar datos del formulario de PT9 (Cesta)
      const datosPT9 = recolectarDatosPT9();

      // Hacer petición al servidor para generar PDF de PT9
      const response = await fetch("/api/pt9/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosPT9),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // Obtener el PDF como blob
      const pdfBlob = await response.blob();

      // Crear URL para descargar
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Obtener nombre del archivo desde headers o usar por defecto
      const contentDisposition = response.headers.get("Content-Disposition");

      let filename = "PT9_Cesta.pdf";

      if (contentDisposition) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
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
        if (img.complete) {
          imagenesRestantes--;
          if (imagenesRestantes === 0) {
            resolve();
          }
        } else {
          img.addEventListener("load", () => {
            imagenesRestantes--;
            if (imagenesRestantes === 0) {
              resolve();
            }
          });

          img.addEventListener("error", () => {
            imagenesRestantes--;
            if (imagenesRestantes === 0) {
              resolve();
            }
          });
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

  console.log("Funcionalidad de PDF PT9 (Cesta) inicializada correctamente");
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
        alert("Por favor ingresa un comentario para cerrar el permiso.");
        return;
      }

      if (!tipoCierre) {
        alert("Por favor selecciona un tipo de cierre.");
        return;
      }

      // Obtener el id del permiso desde la URL o variable global
      var params = new URLSearchParams(window.location.search);
      var idPermiso = params.get("id") || window.idPermisoActual;
      console.log("Permiso de trabajo a cerrar:", idPermiso);
      if (!idPermiso) {
        alert("No se pudo identificar el permiso a cerrar.");
        return;
      }

      // Consultar el id_estatus desde permisos_trabajo
      let idEstatus = null;
      try {
        const respPermiso = await fetch(`/api/permisos/${idPermiso}`);
        const dataPermiso = await respPermiso.json();
        if (dataPermiso && dataPermiso.id_estatus) {
          idEstatus = dataPermiso.id_estatus;
        }
      } catch (err) {
        console.error("Error al obtener id_estatus del permiso:", err);
      }
      if (!idEstatus) {
        alert("No se pudo obtener el estatus del permiso.");
        return;
      }

      // Mapear el tipo de cierre al endpoint correspondiente
      let endpoint;
      if (tipoCierre === "finalizado") {
        endpoint = "/api/estatus/finalizar";
      } else if (tipoCierre === "cancelado") {
        endpoint = "/api/estatus/cancelar";
      } else if (tipoCierre === "terminado") {
        endpoint = "/api/estatus/terminar";
      } else {
        alert("Tipo de cierre no válido.");
        return;
      }

      try {
        // 1. Guardar comentario
        const respComentario = await fetch("/api/comentarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            comentario: comentario,
            tipo_comentario: "cierre",
          }),
        });
        const resultComentario = await respComentario.json();
        console.log("Respuesta guardar comentario:", resultComentario);

        // 2. Cerrar el permiso
        const respCerrar = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus }),
        });
        const resultCerrar = await respCerrar.json();
        console.log("Respuesta cerrar permiso:", resultCerrar);

        if (resultCerrar.success) {
          alert("Permiso cerrado exitosamente.");
          modalCerrarPermiso.style.display = "none";
          // Opcional: redirigir o recargar
          // window.location.href = '/Modules/Usuario/AutorizarPT.html';
        } else {
          alert(
            "Error al cerrar el permiso: " +
              (resultCerrar.message || "Desconocido")
          );
        }
      } catch (error) {
        console.error("Error al cerrar permiso:", error);
        alert("Ocurrió un error al cerrar el permiso.");
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
        const personas = result.data;

        personas.forEach((persona) => {
          const tr = document.createElement("tr");

          const tdResponsableArea = document.createElement("td");
          tdResponsableArea.textContent = persona.responsable_area || "-";
          tr.appendChild(tdResponsableArea);

          const tdOperadorArea = document.createElement("td");
          tdOperadorArea.textContent = persona.operador_area || "-";
          tr.appendChild(tdOperadorArea);

          const tdNombreSupervisor = document.createElement("td");
          tdNombreSupervisor.textContent = persona.nombre_supervisor || "-";
          tr.appendChild(tdNombreSupervisor);

          tbody.appendChild(tr);
        });
      } else {
        console.error("No se encontraron personas autorizadas.");
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}
