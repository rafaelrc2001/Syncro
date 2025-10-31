// Cambia el título de la pestaña para incluir el prefijo dinámicamente
document.addEventListener("DOMContentLoaded", function () {
  var prefijo = document.getElementById("prefijo-label");
  var title = document.getElementById("dynamic-title");
  if (prefijo && title) {
    // Si el prefijo aún no está, espera a que se actualice
    var observer = new MutationObserver(function () {
      var valor = prefijo.textContent || prefijo.innerText || "-";
      title.textContent = "Permiso Fuego " + valor;
      document.title = title.textContent;
    });
    observer.observe(prefijo, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    // Inicializa el título si ya hay valor
    var valor = prefijo.textContent || prefijo.innerText || "-";
    title.textContent = "Permiso Fuego " + valor;
    document.title = title.textContent;
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
    // Ya no mostrar alert ni confirm, solo log
  }
}

// Event listener para el botón de imprimir
// Nota: el mapeo de datos se realiza cuando llegan las respuestas de las APIs (ver fetch() más abajo).
// Registramos el botón de imprimir de forma segura sin leer variables globales no definidas.
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

// Elimina o comenta el listener de Ctrl+P para instrucciones
// document.addEventListener("keydown", function (e) {
//   if ((e.ctrlKey || e.metaKey) && e.key === "p") {
//     e.preventDefault();
//     mostrarInstruccionesImpresion();
//   }
// });
// --- Funciones de utilidad ---
function getRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (let r of radios) {
    if (r.checked) return r.value;
  }
  return "";
}

function getInputValue(name) {
  const byName = document.querySelector(`[name="${name}"]`);
  if (byName) return byName.value || "";
  const byId = document.getElementById(name);
  if (byId) {
    // Inputs, textareas
    if (byId.value !== undefined) return byId.value || "";
    // Other elements
    return byId.textContent || byId.innerText || "";
  }
  return "";
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

// Estado temporal que junta las distintas fuentes para construir la estructura final
const printSources = {
  general: null,
  detalles: null,
  fuego: null,
  ast: null,
  actividades_ast: null,
  participantes_ast: null,
  responsables_area: null,
};

function formatDateIsoToDDMMYYYY(iso) {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d)) return null;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch (err) {
    return null;
  }
}

/**
 * Construye la estructura final para impresión siguiendo el ejemplo proporcionado.
 * Devuelve un objeto con: tipo_permiso, general, detalles, ast, actividades_ast, participantes_ast, responsables_area
 */
function construirEstructuraImpresion(sources) {
  const {
    general = {},
    detalles = {},
    fuego = {},
    ast = null,
    actividades_ast = null,
    participantes_ast = null,
    responsables_area = null,
  } = sources || {};

  // Prioridad: fuego > detalles > general
  const pick = (key) => {
    if (
      fuego &&
      fuego[key] !== undefined &&
      fuego[key] !== null &&
      fuego[key] !== ""
    )
      return fuego[key];
    if (
      detalles &&
      detalles[key] !== undefined &&
      detalles[key] !== null &&
      detalles[key] !== ""
    )
      return detalles[key];
    if (
      general &&
      general[key] !== undefined &&
      general[key] !== null &&
      general[key] !== ""
    )
      return general[key];
    return null;
  };

  const gen = {
    id_permiso:
      pick("id_permiso") ||
      pick("id") ||
      pick("idPermiso") ||
      general.id ||
      null,
    fecha:
      formatDateIsoToDDMMYYYY(
        pick("fecha") || pick("fecha_creacion") || general.fecha_creacion
      ) || null,
    prefijo: pick("prefijo") || null,
    tipo_permiso:
      pick("tipo_permiso") || pick("tipo_mantenimiento") || "Permiso Fuego",
    contrato: pick("contrato") || null,
    empresa: pick("empresa") || null,
    sucursal: pick("sucursal") || null,
    area: pick("area") || null,
    departamento: pick("departamento") || null,
    solicitante: pick("solicitante") || pick("nombre_solicitante") || null,
    descripcion_trabajo: pick("descripcion_trabajo") || null,
    tipo_mantenimiento: pick("tipo_mantenimiento") || null,
    ot_numero: pick("ot_numero") || null,
    tag: pick("tag") || null,
    hora_inicio: pick("hora_inicio") || null,
    equipo_intervenir: pick("equipo_intervenir") || null,
    fluido: pick("fluido") || null,
    presion: pick("presion") || pick("pressure") || null,
    temperatura: pick("temperatura") || pick("temperature") || null,
    // campos de medidas/requisitos opcionales que pueden venir en fuego o detalles
    requiere_escalera: pick("requiere_escalera") || null,
    requiere_canastilla_grua:
      pick("requiere_canastilla_grua") || pick("requiere_canastilla") || null,
    aseguramiento_estrobo: pick("aseguramiento_estrobo") || null,
    requiere_andamio_cama_completa:
      pick("requiere_andamio_cama_completa") || null,
    otro_tipo_acceso: pick("otro_tipo_acceso") || null,
    acceso_libre_obstaculos: pick("acceso_libre_obstaculos") || null,
    canastilla_asegurada: pick("canastilla_asegurada") || null,
    andamio_completo: pick("andamio_completo") || null,
    andamio_seguros_zapatas: pick("andamio_seguros_zapatas") || null,
    escaleras_buen_estado: pick("escaleras_buen_estado") || null,
    linea_vida_segura: pick("linea_vida_segura") || null,
    arnes_completo_buen_estado: pick("arnes_completo_buen_estado") || null,
    suspender_trabajos_adyacentes:
      pick("suspender_trabajos_adyacentes") || null,
    numero_personas_autorizadas: pick("numero_personas_autorizadas") || null,
    trabajadores_aptos_evaluacion:
      pick("trabajadores_aptos_evaluacion") || null,
    requiere_barreras: pick("requiere_barreras") || null,
    observaciones: pick("observaciones") || null,
    fecha_creacion:
      formatDateIsoToDDMMYYYY(
        pick("fecha_creacion") || general.fecha_creacion
      ) || null,
    fecha_actualizacion:
      formatDateIsoToDDMMYYYY(
        pick("fecha_actualizacion") || general.fecha_actualizacion
      ) || null,
  };

  return {
    tipo_permiso: gen.tipo_permiso || "Permiso Fuego",
    general: gen,
    detalles: detalles || {},
    ast: ast || {},
    actividades_ast: actividades_ast || [],
    participantes_ast: participantes_ast || [],
    responsables_area: responsables_area || {},
  };
}

function updateImpresion() {
  try {
    const estructura = construirEstructuraImpresion(printSources);
    // Exponer para depuración
    window.printPayload = estructura;
    // Llamar a la función existente de mapeo usando las fuentes originales para mantener compatibilidad
    mostrarDatosImprimir({
      general: estructura.general || {},
      detalles: estructura.detalles || {},
      fuego: printSources.fuego || {},
      ast: estructura.ast,
      actividades_ast: estructura.actividades_ast,
      participantes_ast: estructura.participantes_ast,
    });
  } catch (err) {
    console.error("Error al construir/actualizar payload de impresión:", err);
  }
}

/**
 * Mapea los datos combinados (general, detalles, fuego) a los labels de la vista de impresión.
 * Prioridad de fuentes: fuego > detalles > general
 */
function mostrarDatosImprimir(sources = {}) {
  const { fuego = {}, detalles = {}, general = {} } = sources;

  function pick(...keys) {
    for (const k of keys) {
      if (fuego && fuego[k] !== undefined && fuego[k] !== null) return fuego[k];
      if (detalles && detalles[k] !== undefined && detalles[k] !== null)
        return detalles[k];
      if (general && general[k] !== undefined && general[k] !== null)
        return general[k];
    }
    return "-";
  }

  // General / encabezados
  setText("prefijo-label", pick("prefijo", "id_permiso", "id"));
  setText("start-time-label", pick("hora_inicio", "start_time", "hora"));
  setText("fecha-label", pick("fecha", "fecha_creacion"));
  setText(
    "activity-type-label",
    pick("tipo_mantenimiento", "maintenance_type")
  );
  setText("plant-label", pick("area", "plant"));
  setText(
    "descripcion-trabajo-label",
    pick("descripcion_trabajo", "descripcion")
  );
  setText("empresa-label", pick("empresa"));
  setText(
    "nombre-solicitante-label",
    pick("solicitante", "nombre_solicitante")
  );
  setText("sucursal-label", pick("sucursal"));
  setText("contrato-label", pick("contrato"));
  setText("work-order-label", pick("ot_numero", "ot"));
  setText("equipment-label", pick("equipo_intervenir", "equipo"));
  setText("tag-label", pick("tag"));

  // Condiciones del proceso
  setText("fluid-label", pick("fluido"));
  setText("pressure-label", pick("presion", "pressure"));
  setText("temperature-label", pick("temperatura", "temperature"));

  // Requisitos para efectuar el trabajo
  const requisitos = [
    "fuera_operacion",
    "despresurizado_purgado",
    "producto_entrampado",
    "necesita_aislamiento",
    "con_valvulas",
    "con_juntas_ciegas",
    "requiere_lavado",
    "requiere_neutralizado",
    "requiere_vaporizado",
    "suspender_trabajos_adyacentes",
    "acordonar_area",
    "prueba_gas_toxico_inflamable",
    "equipo_electrico_desenergizado",
    "tapar_purgas_drenajes",
  ];
  requisitos.forEach((r) => setText(`${r}-label`, pick(r)));

  // Medidas/requisitos para administrar riesgos por parte del ejecutor
  const medidas = [
    "ventilacion_forzada",
    "limpieza_interior",
    "instalo_ventilacion_forzada",
    "equipo_conectado_tierra",
    "cables_pasan_drenajes",
    "cables_uniones_intermedias",
    "equipo_proteccion_personal",
  ];
  medidas.forEach((m) => setText(`${m}-label`, pick(m)));

  // Prueba de gas específica
  setText("co2-label", pick("co2"));
  setText("amoniaco-label", pick("amoniaco"));
  setText("oxigeno-label", pick("oxigeno"));
  setText("explosividad_lel-label", pick("explosividad_lel"));
  setText("otro_gas_cual-label", pick("otro_gas_cual"));
  setText("observaciones_gas-label", pick("observaciones_gas"));

  // --- Verificación para administrar los riesgos (campos del supervisor) ---
  setText("explosividad_interior-label", pick("explosividad_interior"));
  setText("explosividad_exterior-label", pick("explosividad_exterior"));
  setText("vigia_contraincendio-label", pick("vigia_contraincendio"));
  setText("manguera_contraincendio-label", pick("manguera_contraincendio"));
  setText("cortina_agua-label", pick("cortina_agua"));
  setText("extintor_contraincendio-label", pick("extintor_contraincendio"));
  setText("cubrieron_drenajes-label", pick("cubrieron_drenajes"));

  // Asegurar también que condiciones del proceso están mapeadas (alternativas)
  setText("fluid-label", pick("fluido", "fluid"));
  setText("pressure-label", pick("presion", "pressure"));
  setText("temperature-label", pick("temperatura", "temperature"));

  // AST y participantes si vinieron en sources
  if (sources.ast) mostrarAST(sources.ast);
  if (sources.actividades_ast) mostrarActividadesAST(sources.actividades_ast);
  if (sources.participantes_ast)
    mostrarParticipantesAST(sources.participantes_ast);
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
      window.location.href = "../../Usuario/AutorizarPT.html";
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
        // Guardar fuentes y actualizar la estructura para impresión
        try {
          printSources.general = data.general || {};
          printSources.detalles = data.data || {};
          printSources.ast = data.ast || {};
          printSources.actividades_ast = data.actividades_ast || [];
          printSources.participantes_ast = data.participantes_ast || [];
          updateImpresion();
        } catch (err) {
          console.error("Error al almacenar fuentes (verformularios):", err);
        }
      });

    // 2. Obtener datos específicos del permiso de fuego
    fetch(`/api/pt-fuego/${idPermiso}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.data) {
          mostrarDatosSupervisor(data.data);
          // Guardar fuentes fuego y actualizar la estructura para impresión
          try {
            printSources.fuego = data.data || {};
            updateImpresion();
          } catch (err) {
            console.error("Error al almacenar fuentes (pt-fuego):", err);
          }
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

    llenarTablaResponsables(idPermiso);
  }

  rellenarSupervisoresYCategorias();
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
        // Guardar responsables para la estructura de impresión
        try {
          printSources.responsables_area = {
            responsable_area: data.responsable_area || null,
            operador_area: data.operador_area || null,
            nombre_supervisor: data.nombre_supervisor || null,
          };
        } catch (err) {
          console.error("Error guardando responsables en printSources:", err);
        }

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
        // Actualizar la estructura de impresión ahora que tenemos responsables
        try {
          updateImpresion();
        } catch (err) {
          console.error(
            "Error al actualizar impresion luego de responsables:",
            err
          );
        }
      } else {
        // Si no hay datos, muestra mensaje
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
        tbody.appendChild(tr);
        // Asegurar que printSources.responsables_area esté definido
        printSources.responsables_area = {};
        try {
          updateImpresion();
        } catch (err) {
          console.error(
            "Error al actualizar impresion (sin responsables):",
            err
          );
        }
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}
