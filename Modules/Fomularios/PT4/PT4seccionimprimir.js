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

// Lógica para mostrar los datos en las etiquetas (igual que sección área)
function mostrarDatosSupervisor(permiso) {
  setText("prefijo-label", permiso.prefijo); // Nuevo: mapeo prefijo
  setText("descripcion-trabajo-label", permiso.descripcion_trabajo); // Nuevo: mapeo descripcion
  setText("maintenance-type-label", permiso.tipo_mantenimiento);
  setText("work-order-label", permiso.ot_numero);
  setText("tag-label", permiso.tag);
  setText("start-time-label", permiso.hora_inicio);
  setText("equipment-description-label", permiso.equipo_intervenir);
  setText("requiere-escalera-label", permiso.requiere_escalera);
  setText("tipo-escalera-label", permiso.tipo_escalera || "-");
  setText("requiere-canastilla-label", permiso.requiere_canastilla_grua);
  setText("aseguramiento-estrobo-label", permiso.aseguramiento_estrobo);
  setText("requiere-andamio-label", permiso.requiere_andamio_cama_completa);
  setText("requiere-otro-acceso-label", permiso.otro_tipo_acceso);
  setText("cual-acceso-label", permiso.cual_acceso || "-");
  setText("acceso-libre-obstaculos-label", permiso.acceso_libre_obstaculos);
  setText("canastilla-asegurada-label", permiso.canastilla_asegurada);
  setText("andamio-completo-label", permiso.andamio_completo);
  setText("andamio-seguros-zapatas-label", permiso.andamio_seguros_zapatas);
  setText("escaleras-buen-estado-label", permiso.escaleras_buen_estado);
  setText("linea-vida-segura-label", permiso.linea_vida_segura);
  setText(
    "arnes-completo-buen-estado-label",
    permiso.arnes_completo_buen_estado
  );
  setText(
    "suspender-trabajos-adyacentes-label",
    permiso.suspender_trabajos_adyacentes
  );
  setText(
    "numero-personas-autorizadas-label",
    permiso.numero_personas_autorizadas
  );
  setText(
    "trabajadores-aptos-evaluacion-label",
    permiso.trabajadores_aptos_evaluacion
  );
  setText("requiere-barreras-label", permiso.requiere_barreras);
  setText("observaciones-label", permiso.observaciones);

  // Mapeo de condiciones del proceso
  // Si existe 'fluido', úsalo; si no, busca en otros posibles campos
  setText(
    "fluid",
    permiso.fluido || permiso.fluido_proceso || permiso.fluido_area || "-"
  );
  setText("pressure", permiso.presion);
  setText("temperature", permiso.temperatura);
}

// Al cargar la página, obtener el id y mostrar los datos

document.addEventListener("DOMContentLoaded", function () {
  // Lógica para el botón "Salir" igual que PT3
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
        // Prefijo en el título
        if (data && data.general && document.getElementById("prefijo-label")) {
          document.getElementById("prefijo-label").textContent =
            data.general.prefijo || "-";
        }
        // Rellenar datos generales si existen
        if (data && data.general) {
          console.log("Datos generales:", data.general);
          // mostrarDatosSupervisor(data.general); // <--- Comentado para prueba
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
    // 2. Obtener datos específicos del permiso para otros campos (si necesitas más detalles)
    fetch(`http://localhost:3000/api/pt-altura/${idPermiso}`)
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
        console.error("Error al consultar la API de permiso de altura:", err);
      });
  }
  rellenarSupervisoresYCategorias();
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
    alert("Ocurrió un error al preparar la impresión. Por favor, inténtalo nuevamente.");
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

// --- Lógica para el botón "Autorizar" ---
