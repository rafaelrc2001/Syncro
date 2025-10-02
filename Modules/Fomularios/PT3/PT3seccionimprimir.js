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

  // --- FUNCIÓN ESPECÍFICA PARA RELLENAR DATOS PT3 ---
  function rellenarDatosPT3(data) {
    console.log("Rellenando datos específicos de PT3:", data);

    // Datos generales básicos
    setText("prefijo-label", data.prefijo);
    setText("descripcion-trabajo-label", data.descripcion_trabajo);
    setText("maintenance-type-label", data.tipo_mantenimiento);
    setText("work-order-label", data.ot_numero);
    setText("tag-label", data.tag);
    setText("start-time-label", data.hora_inicio);
    setText("equipment-description-label", data.descripcion_equipo);

    // Condiciones del proceso
    setText("fluid", data.fluido);
    setText("pressure", data.presion);
    setText("temperature", data.temperatura);

    // Medidas/Requisitos específicos de PT3 (Espacio Confinado)
    setText("avisos_trabajos", data.avisos_trabajos);
    setText("iluminacion_prueba_explosion", data.iluminacion_prueba_explosion);
    setText("ventilacion_forzada", data.ventilacion_forzada);
    setText("evaluacion_medica_aptos", data.evaluacion_medica_aptos);
    setText("cable_vida_trabajadores", data.cable_vida_trabajadores);
    setText("vigilancia_exterior", data.vigilancia_exterior);
    setText("nombre_vigilante", data.nombre_vigilante);
    setText("personal_rescatista", data.personal_rescatista);
    setText("nombre_rescatista", data.nombre_rescatista);
    setText("instalar_barreras", data.instalar_barreras);
    setText("equipo_especial", data.equipo_especial);
    setText("tipo_equipo_especial", data.tipo_equipo_especial);
    setText("observaciones_adicionales", data.observaciones_adicionales);
    setText("numero_personas_autorizadas", data.numero_personas_autorizadas);
    setText("tiempo_permanencia_min", data.tiempo_permanencia_min);
    setText("tiempo_recuperacion_min", data.tiempo_recuperacion_min);
    setText("clase_espacio_confinado", data.clase_espacio_confinado);

    // Análisis de requisitos para efectuar el trabajo
    setText("verificar_explosividad", data.verificar_explosividad);
    setText("verificar_gas_toxico", data.verificar_gas_toxico);
    setText(
      "verificar_deficiencia_oxigeno",
      data.verificar_deficiencia_oxigeno
    );
    setText(
      "verificar_enriquecimiento_oxigeno",
      data.verificar_enriquecimiento_oxigeno
    );
    setText("verificar_polvo_humos_fibras", data.verificar_polvo_humos_fibras);
    setText("verificar_amoniaco", data.verificar_amoniaco);
    setText("verificar_material_piel", data.verificar_material_piel);
    setText("verificar_temperatura", data.verificar_temperatura);
    setText("verificar_lel", data.verificar_lel);
    setText(
      "suspender_trabajos_adyacentes",
      data.suspender_trabajos_adyacentes
    );
    setText("acordonar_area", data.acordonar_area);
    setText("prueba_gas_toxico_inflamable", data.prueba_gas_toxico_inflamable);
    setText("porcentaje_lel", data.porcentaje_lel);
    setText("nh3", data.nh3);
    setText("porcentaje_oxigeno", data.porcentaje_oxigeno);
    setText(
      "equipo_despresionado_fuera_operacion",
      data.equipo_despresionado_fuera_operacion
    );
    setText("equipo_aislado", data.equipo_aislado);
    setText("equipo_lavado", data.equipo_lavado);
    setText("equipo_neutralizado", data.equipo_neutralizado);
    setText("equipo_vaporizado", data.equipo_vaporizado);
    setText("aislar_purgas_drenaje_venteo", data.aislar_purgas_drenaje_venteo);
    setText("abrir_registros_necesarios", data.abrir_registros_necesarios);
    setText("observaciones_requisitos", data.observaciones_requisitos);

    // Requisitos para administrar los riesgos
    setText("proteccion_piel_cuerpo", data.proteccion_piel_cuerpo);
    setText(
      "detalle_proteccion_piel_cuerpo",
      data.proteccion_piel_detalle || data.detalle_proteccion_piel_cuerpo
    );
    setText("proteccion_respiratoria", data.proteccion_respiratoria);
    setText(
      "detalle_proteccion_respiratoria",
      data.proteccion_respiratoria_detalle ||
        data.detalle_proteccion_respiratoria
    );
    setText("proteccion_ocular", data.proteccion_ocular);
    setText(
      "detalle_proteccion_ocular",
      data.proteccion_ocular_detalle || data.detalle_proteccion_ocular
    );
    setText("arnes_seguridad", data.arnes_seguridad);
    setText("cable_vida", data.cable_vida);
    setText(
      "ventilacion_forzada_opcion",
      data.ventilacion_forzada_opcion || data.ventilacion_forzada
    );
    setText(
      "detalle_ventilacion_forzada",
      data.ventilacion_forzada_detalle || data.detalle_ventilacion_forzada
    );
    setText("iluminacion_explosion", data.iluminacion_explosion);
    setText(
      "vigilancia_exterior_opcion",
      data.vigilancia_exterior_opcion || data.vigilancia_exterior
    );

    // Prueba de gas - PT3 específico (usando los nuevos IDs del HTML)
    setText("param_co2", data.param_co2 || data.co2_aprobado);
    setText("valor_co2", data.valor_co2 || data.co2_valor);
    setText("param_amoniaco", data.param_amoniaco || data.amniaco_aprobado);
    setText("valor_amoniaco", data.valor_amoniaco || data.amniaco_valor);
    setText("param_oxigeno", data.param_oxigeno || data.oxigeno_aprobado);
    setText("valor_oxigeno", data.valor_oxigeno || data.oxigeno_valor);
    setText(
      "param_explosividad_lel",
      data.param_explosividad_lel || data.lel_aprobado
    );
    setText(
      "valor_explosividad_lel",
      data.valor_explosividad_lel || data.lel_valor
    );
    setText("param_otro", data.param_otro || data.otro_aprobado);
    setText("valor_otro", data.valor_otro || data.otro_valor);
    setText("observaciones_gas", data.observaciones || data.observaciones_gas);
  }

  // Leer el id del permiso de la URL
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");

  if (idPermiso) {
    console.log("Cargando permiso PT3 ID:", idPermiso);

    // 1. Primero obtener datos específicos de PT3
    fetch(`http://localhost:3000/api/pt-confinado/${idPermiso}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos específicos de PT3 recibidos:", data);

        if (data && data.data) {
          rellenarDatosPT3(data.data);
        } else if (data && !data.data) {
          rellenarDatosPT3(data);
        } else {
          console.warn("No se encontraron datos específicos de PT3");
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos específicos de PT3:", err);
      });

    // 2. Después obtener datos generales del permiso
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
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
            setText("maintenance-type-label", data.general.tipo_mantenimiento);
            setText("work-order-label", data.general.ot_numero);
            setText("tag-label", data.general.tag);
            setText("start-time-label", data.general.hora_inicio);
            setText(
              "equipment-description-label",
              data.general.descripcion_equipo
            );
            setText("fluid", data.general.fluido);
            setText("pressure", data.general.presion);
            setText("temperature", data.general.temperatura);
          }
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

  // --- LÓGICA DE BOTONES ---
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "../../Usuario/AutorizarPT.html";
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
  fetch(`http://localhost:3000/api/autorizaciones/personas/${idPermiso}`)
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
