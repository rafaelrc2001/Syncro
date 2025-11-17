// --- Lógica para el botón "No Autorizar" (idéntica a PT8) ---
document.addEventListener("DOMContentLoaded", function () {
  const btnNoAutorizar = document.getElementById("btn-no-autorizar");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", function () {
      const responsableInput = document.getElementById("responsable-aprobador");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";
      if (!responsable_area) {
        alert("Debes ingresar el nombre del responsable antes de rechazar.");
        return;
      }
      const noModal = document.getElementById("modalConfirmarNoAutorizar");
      if (noModal) {
        noModal.style.display = "flex";
      } else {
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
      const btnCancelarConfirmarNo = modalConfirmarNoAutorizar.querySelector(
        "#btnCancelarConfirmarNo"
      );
      if (btnCancelarConfirmarNo) {
        btnCancelarConfirmarNo.addEventListener("click", function () {
          modalConfirmarNoAutorizar.style.display = "none";
        });
      }
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

    // Lógica para cerrar/cancelar el modal de comentario
    const btnCancelarComentario = document.getElementById(
      "btnCancelarComentario"
    );
    if (btnCancelarComentario) {
      btnCancelarComentario.addEventListener("click", function () {
        const modal = document.getElementById("modalComentario");
        if (modal) modal.style.display = "none";
      });
    }

    // Lógica para guardar el comentario y actualizar estatus a No Autorizado
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
          // Generar timestamp para rechazo (hora local)
          const nowRechazo = new Date();
          const year = nowRechazo.getFullYear();
          const month = String(nowRechazo.getMonth() + 1).padStart(2, "0");
          const day = String(nowRechazo.getDate()).padStart(2, "0");
          const hours = String(nowRechazo.getHours()).padStart(2, "0");
          const minutes = String(nowRechazo.getMinutes()).padStart(2, "0");
          const seconds = String(nowRechazo.getSeconds()).padStart(2, "0");
          const milliseconds = String(nowRechazo.getMilliseconds()).padStart(3, "0");
          const fechaHoraRechazo = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

          console.log("[NO AUTORIZAR PT9] Timestamp generado:", fechaHoraRechazo);

          // Obtener id_estatus primero
          let idEstatus = null;
          const respEstatus = await fetch(`/api/permisos-trabajo/${idPermiso}`);
          if (respEstatus.ok) {
            const permisoData = await respEstatus.json();
            idEstatus =
              permisoData.id_estatus ||
              (permisoData.data && permisoData.data.id_estatus);
          }

          if (idEstatus) {
            // 1. Actualizar estatus a "no_autorizado"
            await fetch("/api/estatus/no_autorizado", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_estatus: idEstatus }),
            });

            // 2. Guardar comentario de rechazo
            await fetch("/api/estatus/comentario", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_estatus: idEstatus, comentario }),
            });

            // 3. Insertar en autorizaciones con el comentario
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

            const modal = document.getElementById("modalComentario");
            if (modal) modal.style.display = "none";
            alert("Permiso rechazado correctamente.");
            window.location.href = "/Modules/Usuario/AutorizarPT.html";
          } else {
            alert("No se pudo obtener el estatus del permiso.");
          }
        } catch (err) {
          alert("Error al rechazar el permiso.");
          console.error("Error al rechazar PT9:", err);
        }
      });
    }
  }
});

// --- Lógica para el botón "Autorizar" (corregida siguiendo patrón de PT7/PT8) ---
document.addEventListener("DOMContentLoaded", function () {
  const btnAutorizar = document.getElementById("btn-guardar-campos");
  if (btnAutorizar) {
    btnAutorizar.addEventListener("click", async function () {
      // 1. Obtener datos necesarios
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";
      const operador_area = operadorInput ? operadorInput.value.trim() : "";

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

      // 3. Obtener id_estatus y autorizar
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
          // Actualizar estatus a "seguridad" (esperando autorización de supervisor)
          await fetch("/api/estatus/seguridad", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });

          // Generar timestamp para autorización de área (hora local)
          const nowArea = new Date();
          const year = nowArea.getFullYear();
          const month = String(nowArea.getMonth() + 1).padStart(2, "0");
          const day = String(nowArea.getDate()).padStart(2, "0");
          const hours = String(nowArea.getHours()).padStart(2, "0");
          const minutes = String(nowArea.getMinutes()).padStart(2, "0");
          const seconds = String(nowArea.getSeconds()).padStart(2, "0");
          const milliseconds = String(nowArea.getMilliseconds()).padStart(3, "0");
          const fechaHoraAutorizacionArea = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;

          console.log("[AUTORIZAR PT9] Timestamp generado:", fechaHoraAutorizacionArea);

          // Insertar en tabla autorizaciones
          await fetch("/api/autorizaciones/area", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              responsable_area,
              encargado_area: operador_area,
              fecha_hora_area: fechaHoraAutorizacionArea,
            }),
          });

          alert("Permiso autorizado correctamente.");
          window.location.href = "/Modules/Usuario/AutorizarPT.html";
        } else {
          alert("No se pudo obtener el estatus del permiso.");
        }
      } catch (err) {
        alert("Error al autorizar el permiso.");
        console.error("Error al autorizar PT9:", err);
      }
    });
  }
});
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
    setText("view-ext-gatos", general.especificacion_ext_gatos);
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
        // Prefijo en el título
        if (data && data.general) {
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          document.title =
            "Permiso Cesta Izada" +
            (data.general.prefijo ? " - " + data.general.prefijo : "");
          mostrarDatosImprimirPT9(data.general);
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
