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
  if (idPermiso) {
    // Llamar a la API para obtener los datos del permiso
    fetch(
      `/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos recibidos para el permiso:", data);
        // Prefijo en el título
        if (data && data.general) {
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          document.title =
            "Permiso  Apertura Equipo Línea" +
            (data.general.prefijo ? " - " + data.general.prefijo : "");
          if (document.getElementById("descripcion-trabajo-label"))
            document.getElementById("descripcion-trabajo-label").textContent =
              data.general.descripcion_trabajo || "-";
          if (document.getElementById("maintenance-type-label"))
            document.getElementById("maintenance-type-label").textContent =
              data.general.tipo_mantenimiento || "-";
          if (document.getElementById("work-order-label"))
            document.getElementById("work-order-label").textContent =
              data.general.ot_numero || "-";
          if (document.getElementById("tag-label"))
            document.getElementById("tag-label").textContent =
              data.general.tag || "-";
          if (document.getElementById("start-time-label"))
            document.getElementById("start-time-label").textContent =
              data.general.hora_inicio || "-";
          if (document.getElementById("equipment-description-label"))
            document.getElementById("equipment-description-label").textContent =
              data.general.descripcion_equipo || "-";
          if (document.getElementById("special-tools-label"))
            document.getElementById("special-tools-label").textContent =
              data.general.requiere_herramientas_especiales || "-";
          if (document.getElementById("adequate-tools-label"))
            document.getElementById("adequate-tools-label").textContent =
              data.general.herramientas_adecuadas || "-";
          if (document.getElementById("pre-verification-label"))
            document.getElementById("pre-verification-label").textContent =
              data.general.requiere_verificacion_previa || "-";
          if (document.getElementById("risk-knowledge-label"))
            document.getElementById("risk-knowledge-label").textContent =
              data.general.requiere_conocer_riesgos || "-";
          if (document.getElementById("final-observations-label"))
            document.getElementById("final-observations-label").textContent =
              data.general.observaciones_medidas || "-";
          // ...agrega aquí más campos si los necesitas...
          // Mapeo de datos generales y equipo para imprimirseg
          if (data && data.general) {
            if (document.getElementById("start-time-label"))
              document.getElementById("start-time-label").textContent =
                data.general.hora_inicio || "-";
            if (document.getElementById("fecha-label"))
              document.getElementById("fecha-label").textContent =
                data.general.fecha || "-";
            if (document.getElementById("activity-type-label"))
              document.getElementById("activity-type-label").textContent =
                data.general.tipo_mantenimiento || "-";
            if (document.getElementById("plant-label"))
              document.getElementById("plant-label").textContent =
                data.general.area || "-";
            if (document.getElementById("descripcion-trabajo-label"))
              document.getElementById("descripcion-trabajo-label").textContent =
                data.general.descripcion_trabajo || "-";
            if (document.getElementById("empresa-label"))
              document.getElementById("empresa-label").textContent =
                data.general.empresa || "-";
            if (document.getElementById("nombre-solicitante-label"))
              document.getElementById("nombre-solicitante-label").textContent =
                data.general.solicitante || "-";
            if (document.getElementById("sucursal-label"))
              document.getElementById("sucursal-label").textContent =
                data.general.sucursal || "-";
            if (document.getElementById("contrato-label"))
              document.getElementById("contrato-label").textContent =
                data.general.contrato || "-";
            if (document.getElementById("work-order-label"))
              document.getElementById("work-order-label").textContent =
                data.general.ot_numero || "-";
            // Sección Equipo
            if (document.getElementById("equipment-intervene-label"))
              document.getElementById("equipment-intervene-label").textContent =
                data.general.tiene_equipo_intervenir ? "SI" : "NO";
            if (document.getElementById("equipment-label"))
              document.getElementById("equipment-label").textContent =
                data.general.tiene_equipo_intervenir || "-";
            if (document.getElementById("tag-label"))
              document.getElementById("tag-label").textContent =
                data.general.tag || "-";
          }
          // Rellenar requisitos y condiciones del proceso
          if (data && data.general) {
            document.getElementById("resp-fuera-operacion").textContent =
              data.general.fuera_operacion || "-";
            document.getElementById("resp-despresurizado-purgado").textContent =
              data.general.despresurizado_purgado || "-";
            document.getElementById("resp-necesita-aislamiento").textContent =
              data.general.necesita_aislamiento || "-";
            document.getElementById("resp-con-valvulas").textContent =
              data.general.con_valvulas || "-";
            document.getElementById("resp-con-juntas-ciegas").textContent =
              data.general.con_juntas_ciegas || "-";
            document.getElementById("resp-producto-entrampado").textContent =
              data.general.producto_entrampado || "-";
            document.getElementById("resp-requiere-lavado").textContent =
              data.general.requiere_lavado || "-";
            document.getElementById("resp-requiere-neutralizado").textContent =
              data.general.requiere_neutralizado || "-";
            document.getElementById("resp-requiere-vaporizado").textContent =
              data.general.requiere_vaporizado || "-";
            document.getElementById(
              "resp-suspender-trabajos-adyacentes"
            ).textContent = data.general.suspender_trabajos_adyacentes || "-";
            document.getElementById("resp-acordonar-area").textContent =
              data.general.acordonar_area || "-";
            document.getElementById(
              "resp-prueba-gas-toxico-inflamable"
            ).textContent = data.general.prueba_gas_toxico_inflamable || "-";
            document.getElementById(
              "resp-equipo-electrico-desenergizado"
            ).textContent = data.general.equipo_electrico_desenergizado || "-";
            document.getElementById("resp-tapar-purgas-drenajes").textContent =
              data.general.tapar_purgas_drenajes || "-";
            // Condiciones del proceso
            document.getElementById("fluid").textContent =
              data.general.fluido || "-";
            document.getElementById("pressure").textContent =
              data.general.presion || "-";
            document.getElementById("temperature").textContent =
              data.general.temperatura || "-";

            // Requisitos para Administrar los Riesgos
            document.getElementById("resp-special-protection").textContent =
              data.general.proteccion_especial_recomendada || "-";
            document.getElementById("resp-skin-protection").textContent =
              data.general.proteccion_piel_cuerpo || "-";
            document.getElementById("resp-respiratory-protection").textContent =
              data.general.proteccion_respiratoria || "-";
            document.getElementById("resp-eye-protection").textContent =
              data.general.proteccion_ocular || "-";
            document.getElementById("resp-fire-protection").textContent =
              data.general.proteccion_contraincendio || "-";
            document.getElementById("fire-protection-type").textContent =
              data.general.tipo_proteccion_contraincendio || "-";
            document.getElementById("resp-barriers-required").textContent =
              data.general.instalacion_barreras || "-";
            document.getElementById("observations").textContent =
              data.general.observaciones_riesgos || "-";

            // Registro de Pruebas Requeridas
            // Registro de Pruebas Requeridas
            document.getElementById("valor-co2").textContent =
              data.general.co2_nivel || "-";
            document.getElementById("aprobado-co2").textContent =
              data.general.aprobado_co2 || "-";
            document.getElementById("valor-amonico").textContent =
              data.general.nh3_nivel || "-";
            document.getElementById("aprobado-amonico").textContent =
              data.general.aprobado_nh3 || "-";
            document.getElementById("valor-oxigeno").textContent =
              data.general.oxigeno_nivel || "-";
            document.getElementById("aprobado-oxigeno").textContent =
              data.general.aprobado_oxigeno || "-";
            document.getElementById("valor-lel").textContent =
              data.general.lel_nivel || "-";
            document.getElementById("aprobado-lel").textContent =
              data.general.aprobado_lel || "-";
          }
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
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    });
  }

  // ============================
  // FUNCIONALIDAD DE PDF PROFESIONAL
  // ============================

  /**
   * Función para recolectar todos los datos del formulario PT2
   */
  function recolectarDatosPT2() {
    // Datos generales
    const datos = {
      maintenance_type:
        document.getElementById("maintenance-type-label")?.textContent || "-",
      work_order:
        document.getElementById("work-order-label")?.textContent || "-",
      tag: document.getElementById("tag-label")?.textContent || "-",
      start_time:
        document.getElementById("start-time-label")?.textContent || "-",
      equipment_description:
        document.getElementById("equipment-description-label")?.textContent ||
        "-",
      work_description:
        document.getElementById("descripcion-trabajo-label")?.textContent ||
        "-",

      // Medidas para administrar riesgos
      special_tools:
        document.getElementById("special-tools-label")?.textContent || "-",
      adequate_tools:
        document.getElementById("adequate-tools-label")?.textContent || "-",
      pre_verification:
        document.getElementById("pre-verification-label")?.textContent || "-",
      risk_knowledge:
        document.getElementById("risk-knowledge-label")?.textContent || "-",
      final_observations:
        document.getElementById("final-observations-label")?.textContent || "-",

      // Requisitos de apertura
      fuera_operacion:
        document.getElementById("resp-fuera-operacion")?.textContent || "-",
      despresurizado_purgado:
        document.getElementById("resp-despresurizado-purgado")?.textContent ||
        "-",
      necesita_aislamiento:
        document.getElementById("resp-necesita-aislamiento")?.textContent ||
        "-",
      con_valvulas:
        document.getElementById("resp-con-valvulas")?.textContent || "-",
      con_juntas_ciegas:
        document.getElementById("resp-con-juntas-ciegas")?.textContent || "-",
      producto_entrampado:
        document.getElementById("resp-producto-entrampado")?.textContent || "-",
      requiere_lavado:
        document.getElementById("resp-requiere-lavado")?.textContent || "-",
      requiere_neutralizado:
        document.getElementById("resp-requiere-neutralizado")?.textContent ||
        "-",
      requiere_vaporizado:
        document.getElementById("resp-requiere-vaporizado")?.textContent || "-",
      suspender_trabajos_adyacentes:
        document.getElementById("resp-suspender-trabajos-adyacentes")
          ?.textContent || "-",
      acordonar_area:
        document.getElementById("resp-acordonar-area")?.textContent || "-",
      prueba_gas_toxico_inflamable:
        document.getElementById("resp-prueba-gas-toxico-inflamable")
          ?.textContent || "-",
      equipo_electrico_desenergizado:
        document.getElementById("resp-equipo-electrico-desenergizado")
          ?.textContent || "-",
      tapar_purgas_drenajes:
        document.getElementById("resp-tapar-purgas-drenajes")?.textContent ||
        "-",

      // Condiciones del proceso
      fluid: document.getElementById("fluid")?.textContent || "-",
      pressure: document.getElementById("pressure")?.textContent || "-",
      temperature: document.getElementById("temperature")?.textContent || "-",

      // Requisitos para administrar riesgos
      special_protection:
        document.getElementById("resp-special-protection")?.textContent || "-",
      skin_protection:
        document.getElementById("resp-skin-protection")?.textContent || "-",
      respiratory_protection:
        document.getElementById("resp-respiratory-protection")?.textContent ||
        "-",
      eye_protection:
        document.getElementById("resp-eye-protection")?.textContent || "-",
      fire_protection:
        document.getElementById("resp-fire-protection")?.textContent || "-",
      fire_protection_type:
        document.getElementById("fire-protection-type")?.textContent || "-",
      barriers_required:
        document.getElementById("resp-barriers-required")?.textContent || "-",
      observations: document.getElementById("observations")?.textContent || "-",

      // Registro de pruebas
      valor_co2: document.getElementById("valor-co2")?.textContent || "-",
      aprobado_co2: document.getElementById("aprobado-co2")?.textContent || "-",
      valor_amonico:
        document.getElementById("valor-amonico")?.textContent || "-",
      aprobado_amonico:
        document.getElementById("aprobado-amonico")?.textContent || "-",
      valor_oxigeno:
        document.getElementById("valor-oxigeno")?.textContent || "-",
      aprobado_oxigeno:
        document.getElementById("aprobado-oxigeno")?.textContent || "-",
      valor_lel: document.getElementById("valor-lel")?.textContent || "-",
      aprobado_lel: document.getElementById("aprobado-lel")?.textContent || "-",

      // Aprobaciones
      responsable_area_nombre:
        document.getElementById("responsable-area-nombre")?.textContent || "-",
      operador_area_nombre:
        document.getElementById("operador-area-nombre")?.textContent || "-",
      supervisor_nombre:
        document.getElementById("supervisor-nombre")?.textContent || "-",

      // AST y Personal (se llenarán desde las variables globales si están disponibles)
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

      // Recolectar datos del formulario
      const datosPT2 = recolectarDatosPT2();

      // Hacer petición al servidor para generar PDF
      const response = await fetch("/api/pt2/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosPT2),
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
      let filename = "PT2_Apertura_Equipo.pdf";

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
  function mostrarInstruccionesImpresion() {
    const mensaje = `🖨️ PARA ELIMINAR ENCABEZADOS Y PIES DE PÁGINA:

📌 CHROME/EDGE:
1. Presiona Ctrl+P
2. Busca "Más configuraciones" y haz clic
3. DESMARCA la casilla "Encabezados y pies de página"
4. Haz clic en "Imprimir"

📌 FIREFOX:
1. Presiona Ctrl+P  
2. Haz clic en "Configurar página"
3. En "Encabezados y pies", selecciona "Vacío" en TODOS
4. Haz clic en "Imprimir"

⚠️ Esta configuración se debe hacer UNA SOLA VEZ por navegador.
¿Quieres que te abra el diálogo de impresión ahora?`;

    if (confirm(mensaje)) {
      // Limpiar título antes de imprimir
      const originalTitle = document.title;
      document.title = "";

      // Abrir diálogo de impresión
      window.print();

      // Restaurar título después
      setTimeout(() => {
        document.title = originalTitle;
      }, 1000);
    }
  }

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

  console.log("Funcionalidad de PDF PT2 inicializada correctamente");
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
  // Eliminada la función que activa el botón de guardar cierre de permiso
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
