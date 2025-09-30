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

/**
 * Función que muestra las instrucciones exactas para eliminar encabezados
 */
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
    const originalTitle = document.title;
    document.title = "";
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }
}

// Event listener para el botón de imprimir
const btnImprimir = document.getElementById("btn-imprimir-permiso");
if (btnImprimir) {
  btnImprimir.addEventListener("click", function (e) {
    e.preventDefault();
    mostrarInstruccionesImpresion();
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

// Interceptar Ctrl+P para mostrar instrucciones
document.addEventListener("keydown", function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "p") {
    e.preventDefault();
    mostrarInstruccionesImpresion();
  }
});
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
  fetch("http://localhost:3000/api/supervisores")
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

  fetch("http://localhost:3000/api/categorias")
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

// Lógica para mostrar los datos en las etiquetas
function mostrarDatosSupervisor(permiso) {
  // --- Medidas/Requisitos para administrar los riesgos por parte del ejecutor de la actividad ---

  setText(
    "prefijo-label",
    permiso.prefijo || permiso.id_permiso || permiso.id || "-"
  );

  setText("ventilacion_forzada-label", permiso.ventilacion_forzada);
  setText("limpieza_interior-label", permiso.limpieza_interior);
  setText(
    "instalo_ventilacion_forzada-label",
    permiso.instalo_ventilacion_forzada
  );
  setText("equipo_conectado_tierra-label", permiso.equipo_conectado_tierra);
  setText("cables_pasan_drenajes-label", permiso.cables_pasan_drenajes);
  setText(
    "cables_uniones_intermedias-label",
    permiso.cables_uniones_intermedias
  );
  setText(
    "equipo_proteccion_personal-label",
    permiso.equipo_proteccion_personal
  );

  // --- Verificación para administrar los riesgos ---
  setText("explosividad_interior-label", permiso.explosividad_interior);
  setText("explosividad_exterior-label", permiso.explosividad_exterior);
  setText("vigia_contraincendio-label", permiso.vigia_contraincendio);
  setText("manguera_contraincendio-label", permiso.manguera_contraincendio);
  setText("cortina_agua-label", permiso.cortina_agua);
  setText("extintor_contraincendio-label", permiso.extintor_contraincendio);
  setText("cubrieron_drenajes-label", permiso.cubrieron_drenajes);

  // --- Prueba de gas ---
  setText("co2-label", permiso.co2);
  setText("amoniaco-label", permiso.amoniaco);
  setText("oxigeno-label", permiso.oxigeno);
  setText("explosividad_lel-label", permiso.explosividad_lel);
  setText("otro_gas_cual-label", permiso.otro_gas_cual);
  setText("observaciones_gas-label", permiso.observaciones_gas);
  // Depuración: ver los datos reales que llegan
  console.log("permiso fuego:", permiso);
  setText(
    "prefijo-label",
    permiso.prefijo || permiso.id_permiso || permiso.id || "-"
  );
  setText("descripcion-trabajo-label", permiso.descripcion_trabajo);
  setText("maintenance-type-label", permiso.tipo_mantenimiento);
  setText("work-order-label", permiso.ot_numero);
  setText("tag-label", permiso.tag);
  setText("start-time-label", permiso.hora_inicio);
  setText("equipment-description-label", permiso.equipo_intervenir);
  setText("special-tools-label", permiso.requiere_herramientas_especiales);
  setText("special-tools-type-label", permiso.tipo_herramientas_especiales);
  setText("adequate-tools-label", permiso.herramientas_adecuadas);
  setText("pre-verification-label", permiso.requiere_verificacion_previa);
  setText("risk-knowledge-label", permiso.requiere_conocer_riesgos);
  setText("final-observations-label", permiso.observaciones_medidas);

  // Mapeo de condiciones del proceso
  setText("fluid-label", permiso.fluido);
  setText("pressure-label", permiso.presion);
  setText("temperature-label", permiso.temperatura);

  // Mapeo de requisitos para efectuar el trabajo
  setText("fuera_operacion-label", permiso.fuera_operacion);
  setText("despresurizado_purgado-label", permiso.despresurizado_purgado);
  setText("producto_entrampado-label", permiso.producto_entrampado);
  setText("necesita_aislamiento-label", permiso.necesita_aislamiento);
  setText("con_valvulas-label", permiso.con_valvulas);
  setText("con_juntas_ciegas-label", permiso.con_juntas_ciegas);
  setText("requiere_lavado-label", permiso.requiere_lavado);
  setText("requiere_neutralizado-label", permiso.requiere_neutralizado);
  setText("requiere_vaporizado-label", permiso.requiere_vaporizado);
  setText(
    "suspender_trabajos_adyacentes-label",
    permiso.suspender_trabajos_adyacentes
  );
  setText("acordonar_area-label", permiso.acordonar_area);
  setText(
    "prueba_gas_toxico_inflamable-label",
    permiso.prueba_gas_toxico_inflamable
  );
  setText(
    "equipo_electrico_desenergizado-label",
    permiso.equipo_electrico_desenergizado
  );
  setText("tapar_purgas_drenajes-label", permiso.tapar_purgas_drenajes);

  // Mapeo de medidas/requisitos para administrar riesgos por parte del ejecutor de la actividad
  setText(
    "ventilacion_forzada-label",
    permiso.ventilacion_forzada || permiso.medida_ventilacion_forzada
  );
  setText(
    "limpieza_interior-label",
    permiso.limpieza_interior || permiso.medida_limpieza_interior
  );
  setText(
    "instalo_ventilacion_forzada-label",
    permiso.instalo_ventilacion_forzada ||
      permiso.medida_instalo_ventilacion_forzada
  );
  setText(
    "equipo_conectado_tierra-label",
    permiso.equipo_conectado_tierra || permiso.medida_equipo_conectado_tierra
  );
  setText(
    "cables_pasan_drenajes-label",
    permiso.cables_pasan_drenajes || permiso.medida_cables_pasan_drenajes
  );
  setText(
    "cables_uniones_intermedias-label",
    permiso.cables_uniones_intermedias ||
      permiso.medida_cables_uniones_intermedias
  );
  setText(
    "equipo_proteccion_personal-label",
    permiso.equipo_proteccion_personal ||
      permiso.medida_equipo_proteccion_personal
  );
}

// Al cargar la página, obtener el id y mostrar los datos
document.addEventListener("DOMContentLoaded", function () {
  // Lógica para el botón "Salir"
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    });
  }

  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");

  if (idPermiso) {
    // 1. Obtener datos generales y AST
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        // Prefijo en el título y descripción del trabajo
        if (data && data.general) {
          if (document.getElementById("prefijo-label")) {
            document.getElementById("prefijo-label").textContent =
              data.general.prefijo || "-";
          }
          if (document.getElementById("descripcion-trabajo-label")) {
            document.getElementById("descripcion-trabajo-label").textContent =
              data.general.descripcion_trabajo || "-";
          }
        }

        // Rellenar datos generales usando data.data
        if (data && data.data) {
          const detalles = data.data;
          setText("maintenance-type-label", detalles.tipo_mantenimiento);
          setText("work-order-label", detalles.ot_numero);
          setText("tag-label", detalles.tag);
          setText("start-time-label", detalles.hora_inicio);
          setText("equipment-description-label", detalles.equipo_intervenir);
          setText(
            "special-tools-label",
            detalles.requiere_herramientas_especiales
          );
          setText(
            "special-tools-type-label",
            detalles.tipo_herramientas_especiales
          );
          setText("adequate-tools-label", detalles.herramientas_adecuadas);
          setText(
            "pre-verification-label",
            detalles.requiere_verificacion_previa
          );
          setText("risk-knowledge-label", detalles.requiere_conocer_riesgos);
          setText("final-observations-label", detalles.observaciones_medidas);
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

    // 2. Obtener datos específicos del permiso de fuego
    fetch(`http://localhost:3000/api/pt-fuego/${idPermiso}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.data) {
          mostrarDatosSupervisor(data.data);
        } else {
          console.warn(
            "Estructura de datos inesperada o datos faltantes:",
            data
          );
        }
      })
      .catch((err) => {
        console.error("Error al consultar la API de permiso de fuego:", err);
      });
  }

  rellenarSupervisoresYCategorias();
});
