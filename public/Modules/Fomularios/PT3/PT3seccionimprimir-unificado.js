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

  // --- FUNCIÓN AUXILIAR PARA LLENAR CAMPOS ---
  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value || "-";
      // Si es el prefijo, actualiza el título de la pestaña
      if (id === "prefijo-label") {
        document.title =
          "Permiso Espacio Confinado" + (value ? " - " + value : "");
      }
    } else {
      console.warn(`Elemento con ID '${id}' no encontrado`);
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
    console.log("Cargando permiso PT3 ID:", idPermiso);

    // 1. Primero obtener datos específicos de PT3

    // 2. Después obtener datos generales del permiso
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos generales recibidos:", data);

        // Actualizar prefijo y datos generales básicos
        if (data && data.general) {
          setText("prefijo-label", data.general.prefijo);

          // Solo llenar estos campos si no se llenaron antes
          const descripcionElement = document.getElementById(
            "descripcion-trabajo-label"
          );
          if (
            !descripcionElement.textContent ||
            descripcionElement.textContent === "-"
          ) {
            setText(
              "descripcion-trabajo-label",
              data.general.descripcion_trabajo
            );

            setText("work-order-label", data.general.ot_numero);
            setText("tag-label", data.general.tag);
            setText("start-time-label", data.general.hora_inicio);

            setText("fecha-label", data.general.fecha);
            setText("activity-type-label", data.general.tipo_mantenimiento);
            setText("plant-label", data.general.area);
            setText("empresa-label", data.general.empresa);
            setText(
              "nombre-solicitante-label",
              data.general.nombre_solicitante
            );
            setText("sucursal-label", data.general.sucursal);
            setText("contrato-label", data.general.contrato);
            setText(
              "equipment-intervene-label",
              data.general.equipo_intervenir
            );

            setText("fluid", data.general.fluido);
            setText("pressure", data.general.presion);
            setText("temperature", data.general.temperatura);
          }

          setText("avisos_trabajos", data.general.avisos_trabajos);
          setText(
            "iluminacion_prueba_explosion",
            data.general.iluminacion_prueba_explosion
          );
          setText("ventilacion_forzada", data.general.ventilacion_forzada);
          setText(
            "evaluacion_medica_aptos",
            data.general.evaluacion_medica_aptos
          );
          setText(
            "cable_vida_trabajadores",
            data.general.cable_vida_trabajadores
          );
          setText("vigilancia_exterior", data.general.vigilancia_exterior);
          setText("nombre_vigilante", data.general.nombre_vigilante);
          setText("personal_rescatista", data.general.personal_rescatista);
          setText("nombre_rescatista", data.general.nombre_rescatista);
          setText("instalar_barreras", data.general.instalar_barreras);

          // Nuevos campos de aislamiento
          setText(
            "equipo_aislado_valvula",
            data.general.equipo_aislado_valvula || "-"
          );
          setText(
            "equipo_aislado_junta_ciega",
            data.general.equipo_aislado_junta_ciega || "-"
          );
          setText("equipo_especial", data.general.equipo_especial);
          setText("tipo_equipo_especial", data.general.tipo_equipo_especial);
          setText(
            "observaciones_adicionales",
            data.general.observaciones_adicionales
          );

          setText(
            "numero_personas_autorizadas",
            data.general.numero_personas_autorizadas
          );
          setText(
            "tiempo_permanencia_min",
            data.general.tiempo_permanencia_min
          );
          setText(
            "clase_espacio_confinado",
            data.general.clase_espacio_confinado
          );
          setText(
            "tiempo_recuperacion_min",
            data.general.tiempo_recuperacion_min
          );

          // Rellenar los datos del responsable del area

          setText(
            "verificar_explosividad",
            data.general.verificar_explosividad
          );
          setText("verificar_gas_toxico", data.general.verificar_gas_toxico);
          setText(
            "verificar_deficiencia_oxigeno",
            data.general.verificar_deficiencia_oxigeno
          );
          setText(
            "verificar_enriquecimiento_oxigeno",
            data.general.verificar_enriquecimiento_oxigeno
          );
          setText(
            "verificar_polvo_humos_fibras",
            data.general.verificar_polvo_humos_fibras
          );
          setText("verificar_amoniaco", data.general.verificar_amoniaco);
          setText(
            "verificar_material_piel",
            data.general.verificar_material_piel
          );
          setText("verificar_temperatura", data.general.verificar_temperatura);
          setText("verificar_lel", data.general.verificar_lel);
          setText(
            "suspender_trabajos_adyacentes",
            data.general.suspender_trabajos_adyacentes
          );
          setText("acordonar_area", data.general.acordonar_area);
          setText(
            "prueba_gas_toxico_inflamable",
            data.general.prueba_gas_toxico_inflamable
          );
          setText("porcentaje_lel", data.general.porcentaje_lel);
          setText("nh3", data.general.nh3);
          setText("porcentaje_oxigeno", data.general.porcentaje_oxigeno);
          setText(
            "equipo_despresionado_fuera_operacion",
            data.general.equipo_despresionado_fuera_operacion
          );
          setText("equipo_aislado", data.general.equipo_aislado);
          setText("equipo_lavado", data.general.equipo_lavado);
          setText("equipo_neutralizado", data.general.equipo_neutralizado);
          setText("equipo_vaporizado", data.general.equipo_vaporizado);
          setText(
            "aislar_purgas_drenaje_venteo",
            data.general.aislar_purgas_drenaje_venteo
          );
          setText(
            "abrir_registros_necesarios",
            data.general.abrir_registros_necesarios
          );
          setText(
            "observaciones_requisitos",
            data.general.observaciones_requisitos
          );

          // Rellenar supervisores
          // Rellenar supervisores
          // Requisitos para administrar los riesgos
          setText(
            "proteccion_piel_cuerpo",
            data.general.proteccion_piel_cuerpo
          );
          setText(
            "detalle_proteccion_piel_cuerpo",
            data.general.proteccion_piel_detalle
          );
          setText(
            "proteccion_respiratoria",
            data.general.proteccion_respiratoria
          );
          setText(
            "detalle_proteccion_respiratoria",
            data.general.proteccion_respiratoria_detalle
          );
          setText("proteccion_ocular", data.general.proteccion_ocular);
          setText(
            "detalle_proteccion_ocular",
            data.general.proteccion_ocular_detalle
          );
          setText("arnes_seguridad", data.general.arnes_seguridad);
          setText("cable_vida", data.general.cable_vida);
          setText(
            "ventilacion_forzada_opcion",
            data.general.ventilacion_forzada_opcion
          );
          setText(
            "detalle_ventilacion_forzada",
            data.general.ventilacion_forzada_detalle
          );
          setText("iluminacion_explosion", data.general.iluminacion_explosion);
          setText(
            "vigilancia_exterior_opcion",
            data.general.vigilancia_exterior_opcion
          );

          // Prueba de gas
          setText("param_co2", data.general.param_co2);
          setText("valor_co2", data.general.valor_co2);
          setText("param_amoniaco", data.general.param_amoniaco);
          setText("valor_amoniaco", data.general.valor_amoniaco);
          setText("param_oxigeno", data.general.param_oxigeno);
          setText("valor_oxigeno", data.general.valor_oxigeno);
          setText(
            "param_explosividad_lel",
            data.general.param_explosividad_lel
          );
          setText(
            "valor_explosividad_lel",
            data.general.valor_explosividad_lel
          );
          setText("param_otro", data.general.param_otro);
          setText("valor_otro", data.general.valor_otro);
          setText("observaciones_gas", data.general.observaciones);

          //verifcicacion de campo
          //
          //
          setText(
            "nombre_verificar_explosividad",
            data.general.nombre_verificar_explosividad
          );
          setText(
            "nombre_verificar_gas_toxico",
            data.general.nombre_verificar_gas_toxico
          );
          setText(
            "nombre_verificar_deficiencia",
            data.general.nombre_verificar_deficiencia_oxigeno
          );
          setText(
            "nombre_verificar_enriquecimiento",
            data.general.nombre_verificar_enriquecimiento_oxigeno
          );
          setText(
            "nombre_verificar_polvo",
            data.general.nombre_verificar_polvo_humos_fibras
          );
          setText(
            "nombre_verificar_amoniaco",
            data.general.nombre_verificar_amoniaco
          );
          setText(
            "nombre_verificar_material",
            data.general.nombre_verificar_material_piel
          );
          setText(
            "nombre_verificar_temperatura",
            data.general.nombre_verificar_temperatura
          );
          setText("nombre_verificar_lel", data.general.nombre_verificar_lel);
          setText(
            "nombre_suspeder_trabajos",
            data.general.nombre_suspender_trabajos_adyacentes
          );
          setText("nombre_acordonar_area", data.general.nombre_acordonar_area);
          setText(
            "nombre_prueba_gas",
            data.general.nombre_prueba_gas_toxico_inflamable
          );
          setText("nombre_porcentaje_lel", data.general.nombre_porcentaje_lel);
          setText("nombre_nh3", data.general.nombre_nh3);
          setText(
            "nombre_porcentaje_oxigeno",
            data.general.nombre_porcentaje_oxigeno
          );
          setText(
            "nombre_equipo_despresionado_fuera_operacion",
            data.general.nombre_equipo_despresionado_fuera_operacion
          );
          setText("nombre_equipo_aislado", data.general.nombre_equipo_aislado);
          setText("nombre_equipo_lavado", data.general.nombre_equipo_lavado);
          setText(
            "nombre_equipo_neutralizado",
            data.general.nombre_equipo_neutralizado
          );
          setText(
            "nombre_equipo_vaporizado",
            data.general.nombre_equipo_vaporizado
          );
          setText(
            "nombre_aislar_purgas",
            data.general.nombre_aislar_purgas_drenaje_venteo
          );
          setText(
            "nombre_abrir_registros_necesarios",
            data.general.nombre_abrir_registros_necesarios
          );
          setText(
            "nombre_observaciones_requisitos",
            data.general.nombre_observaciones_requisitos
          );
        }

        // Rellenar AST y Participantes
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
        console.error("Error al obtener datos generales del permiso:", err);
      });

    // === AGREGA ESTA LÍNEA PARA LLENAR LA TABLA DE RESPONSABLES ===
    llenarTablaResponsables(idPermiso);
  } else {
    console.error("No se encontró ID de permiso en la URL");
    alert("No se pudo obtener el ID del permiso desde la URL");
  }

  // --- LÓGICA DE BOTONES CON DETECCIÓN DINÁMICA DE PÁGINA ---
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      // Detectar la página actual y redirigir según corresponda
      if (window.location.pathname.includes("PT3imprimir2.html")) {
        window.location.href = "../../Usuario/AutorizarPT.html";
      } else if (window.location.pathname.includes("PT3imprimirseg.html")) {
        window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (window.location.pathname.includes("PT3imprimirsup.html")) {
        window.location.href = "../../JefeSeguridad/JefeSeguridad.html";
      } else {
        // Fallback por defecto
        window.location.href = "../../Usuario/AutorizarPT.html";
      }
    });
  }

  // --- FUNCIONALIDAD DE IMPRESIÓN ---
  // Función para asegurar que todas las imágenes estén cargadas
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

  // Función de impresión tradicional (sin alertas ni confirm)
  async function imprimirPermisoTradicional() {
    try {
      await esperarImagenes();
      window.print();
    } catch (error) {
      console.error("Error al imprimir:", error);
      // No mostrar alert ni confirm, solo log
    }
  }

  // Función principal de impresión (directo sin ventanas emergentes)
  function imprimirPermiso() {
    imprimirPermisoTradicional();
  }

  // Event listener para el botón de imprimir
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

  console.log("Funcionalidad de PT3 Impresión inicializada correctamente");
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
