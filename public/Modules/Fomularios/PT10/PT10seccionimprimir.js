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
          // Encabezado y generales (mapeo igual que PT8/PT9)
          setText("prefijo-label", general.prefijo);
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

          // --- MAPEO DE DATOS DE EXCAVACIÓN (PT10) ---
          setText("vista-profundidad-media", general.profundidad_media);
          setText("vista-profundidad-maxima", general.profundidad_maxima);
          setText("vista-anchura", general.anchura);
          setText("vista-longitud", general.longitud);
          setText("vista-tipo-terreno", general.tipo_terreno);

          setText("vista-tuberia-gas", general.tuberia_gas);
          setText("vista-gas-tipo", general.tipo_gas);
          setText("vista-tuberia-gas-comprobado", general.comprobado_gas);
          setText("vista-permit-date-gas", general.fecha_gas);
          setText("vista-linea-electrica", general.linea_electrica);
          setText("vista-linea-electrica-voltaje", general.voltaje_linea);
          setText(
            "vista-linea-electrica-comprobado",
            general.comprobado_electrica
          );
          setText("vista-permit-date-electrica", general.fecha_electrica);
          setText("vista-tuberia-incendios", general.tuberia_incendios);
          setText("vista-tuberia-incendios-presion", general.presion_incendios);
          setText(
            "vista-tuberia-incendios-comprobado",
            general.comprobado_incendios
          );
          setText("vista-permit-date-incendios", general.fecha_incendios);
          setText("vista-alcantarillado", general.alcantarillado);
          setText(
            "vista-alcantarillado-diametro",
            general.diametro_alcantarillado
          );
          setText(
            "vista-alcantarillado-comprobado",
            general.comprobado_alcantarillado
          );
          setText(
            "vista-permit-date-alcantarillado",
            general.fecha_alcantarillado
          );
          setText("vista-otras-instalaciones", general.otras_instalaciones);
          setText(
            "vista-otras-instalaciones-tipo",
            general.especificacion_otras_instalaciones
          );
          setText(
            "vista-otras-instalaciones-comprobado",
            general.comprobado_otras
          );
          setText("vista-permit-date-otras", general.fecha_otras);

          setText("vista-requiere-talud", general.requiere_talud);
          setText("vista-angulo-talud", general.angulo_talud);
          setText("vista-requiere-bermas", general.requiere_bermas);
          setText("vista-longitud-meseta", general.longitud_meseta);
          setText("vista-alturas-contrameseta", general.altura_contrameseta);
          setText("vista-requiere-entibacion", general.requiere_entibacion);
          setText("vista-tipo-entibacion", general.tipo_entibacion);
          setText(
            "vista-especificacion-entibacion",
            general.condiciones_terreno_entibacion
          );
          setText("vista-otros-requerimientos", general.otros_requerimientos);
          setText(
            "vista-otros-requerimientos-detalle",
            general.especificacion_otros_requerimientos
          );
          setText(
            "vista-distancia-estatica",
            general.distancia_seguridad_estatica
          );
          setText(
            "vista-distancia-dinamica",
            general.distancia_seguridad_dinamica
          );

          setText("vista-requiere-balizamiento", general.requiere_balizamiento);
          setText(
            "vista-distancia-balizamiento",
            general.distancia_balizamiento
          );
          setText(
            "vista-requiere-proteccion-rigida",
            general.requiere_proteccion_rigida
          );
          setText(
            "vista-distancia-proteccion",
            general.distancia_proteccion_rigida
          );
          setText(
            "vista-requiere-senalizacion",
            general.requiere_senalizacion_especial
          );
          setText(
            "vista-tipo-senalizacion",
            general.especificacion_senalizacion
          );
          setText(
            "vista-requiere-proteccion-anticaida",
            general.requiere_proteccion_anticaida
          );
          setText(
            "vista-tipo-proteccion-anticaida",
            general.tipo_proteccion_anticaida
          );
          setText("vista-anclaje", general.tipo_anclaje);

          setText(
            "vista-espacio-confinado",
            general.excavacion_espacio_confinado
          );
          setText(
            "vista-numero-permiso-confinado",
            general.numero_permiso_confinado
          );

          setText(
            "vista-excavacion-manual",
            general.excavacion_manual_aproximacion
          );
          setText("vista-medidas-excavacion", general.medidas_aproximacion);
          setText(
            "vista-medida-herramienta-antichispa",
            general.herramienta_antichispa
          );
          setText(
            "vista-medida-guantes-dielectrico",
            general.guantes_calzado_dielectrico
          );
          setText("vista-medida-epp-especial", general.epp_especial);
          setText(
            "vista-medida-otros-lineas",
            general.otras_medidas_especiales
          );

          setText(
            "vista-medida-bloqueo-fisico",
            general.aplicar_bloqueo_fisico
          );
          setText(
            "vista-bloqueo-fisico-detalle",
            general.especificacion_bloqueo_fisico
          );
          setText("vista-medida-drenar-limpiar", general.drenar_limpiar_lavar);
          setText(
            "vista-medida-atmosfera-inerte",
            general.inundar_anegar_atmosfera_inerte
          );
          setText("vista-medida-vigilante", general.vigilante_continuo);
          setText(
            "vista-vigilante-detalle",
            general.especificacion_vigilante_continuo
          );
          setText(
            "vista-medida-otras-adicionales",
            general.otras_medidas_adicionales
          );
          setText(
            "vista-otras-adicionales-detalle",
            general.especificacion_otras_medidas_adicionales
          );

          setText(
            "vista-observaciones-generales",
            general.observaciones_generales_excavacion
          );
        }

        // Usar la función centralizada para mostrar los datos
        if (data && data.general) {
          mostrarDatosImprimir(data.general);
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          document.title =
            "Permiso de Trabajo excavacion." +
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
        throw new Error(`Error del servidor: ${response.status}`);
      }

      // Obtener el PDF como blob
      const pdfBlob = await response.blob();

      // Crear URL para descargar
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Obtener nombre del archivo desde headers o usar por defecto
      const contentDisposition = response.headers.get("Content-Disposition");

      let filename = "PT8_Izaje.pdf";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
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
