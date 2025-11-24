// --- Funciones de impresión (estilo PT6) ---

// Variables para fusión de datos (permiso específico y verformularios)
let _permisoFetch = null;
let _verformulariosFetch = null;

// Helper: aplica valor según prioridad: permiso > verformularios.data > verformularios.general
function aplicarCampoFusionado(
  domId,
  propPermiso,
  propVerData,
  propVerGeneral
) {
  let val = null;
  if (
    _permisoFetch &&
    _permisoFetch[propPermiso] !== undefined &&
    _permisoFetch[propPermiso] !== null &&
    _permisoFetch[propPermiso] !== ""
  ) {
    val = _permisoFetch[propPermiso];
  } else if (
    _verformulariosFetch &&
    _verformulariosFetch.data &&
    _verformulariosFetch.data[propVerData] !== undefined &&
    _verformulariosFetch.data[propVerData] !== null &&
    _verformulariosFetch.data[propVerData] !== ""
  ) {
    val = _verformulariosFetch.data[propVerData];
  } else if (
    _verformulariosFetch &&
    _verformulariosFetch.general &&
    _verformulariosFetch.general[propVerGeneral] !== undefined &&
    _verformulariosFetch.general[propVerGeneral] !== null &&
    _verformulariosFetch.general[propVerGeneral] !== ""
  ) {
    val = _verformulariosFetch.general[propVerGeneral];
  }
  setText(domId, val || "-");
}

function actualizarCamposFusionados() {
  aplicarCampoFusionado("prefijo-label", "prefijo", "prefijo", "prefijo");
  aplicarCampoFusionado(
    "maintenance-type-label",
    "tipo_mantenimiento",
    "tipo_mantenimiento",
    "tipo_mantenimiento"
  );
  aplicarCampoFusionado(
    "start-time-label",
    "hora_inicio",
    "hora_inicio",
    "hora_inicio"
  );
  aplicarCampoFusionado("fecha-label", "fecha", "fecha", "fecha");
  aplicarCampoFusionado(
    "activity-type-label",
    "tipo_mantenimiento",
    "tipo_mantenimiento",
    "tipo_mantenimiento"
  );
  aplicarCampoFusionado("plant-label", "area", "area", "area");
  aplicarCampoFusionado(
    "descripcion-trabajo-label",
    "descripcion_equipo",
    "descripcion_trabajo",
    "descripcion_trabajo"
  );
  aplicarCampoFusionado(
    "equipment-description-label",
    "descripcion_equipo",
    "descripcion_trabajo",
    "descripcion_trabajo"
  );
  aplicarCampoFusionado(
    "equipment-label",
    "descripcion_equipo",
    "equipo_intervenir",
    "equipo_intervenir"
  );
  aplicarCampoFusionado("empresa-label", "empresa", "empresa", "empresa");
  aplicarCampoFusionado(
    "nombre-solicitante-label",
    "solicitante",
    "solicitante",
    "solicitante"
  );
  aplicarCampoFusionado("sucursal-label", "sucursal", "sucursal", "sucursal");
  aplicarCampoFusionado("contrato-label", "contrato", "contrato", "contrato");
  aplicarCampoFusionado(
    "work-order-label",
    "ot_numero",
    "ot_numero",
    "ot_numero"
  );

  aplicarCampoFusionado(
    "nombre_firma-label",
    "tecnico_radialogo",
    "tecnico_radialogo",
    "tecnico_radialogo"
  );

  aplicarCampoFusionado("tag-label", "tag", "tag", "tag");
  // Mapear técnico radiólogo
}

// Cambia el título de la pestaña para incluir el prefijo dinámicamente
document.addEventListener("DOMContentLoaded", function () {
  var prefijo = document.getElementById("prefijo-label");
  var title = document.getElementById("dynamic-title");
  if (prefijo && title) {
    var observer = new MutationObserver(function () {
      var valor = prefijo.textContent || prefijo.innerText || "-";
      title.textContent = "Permiso Energia Electrica " + valor;
      document.title = title.textContent;
    });
    observer.observe(prefijo, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    var valor = prefijo.textContent || prefijo.innerText || "-";
    title.textContent = "Permiso Energia Electrica " + valor;
    document.title = title.textContent;
  }

  // Mostrar comentario de rechazo si corresponde
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  const comentarioDiv = document.getElementById("comentarios-permiso");
  if (
    idPermiso &&
    comentarioDiv &&
    typeof mostrarComentarioSiCorresponde === "function"
  ) {
    mostrarComentarioSiCorresponde(idPermiso, comentarioDiv);
  }
});

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

async function imprimirPermisoTradicional() {
  try {
    await esperarImagenes();
    window.print();
  } catch (error) {
    console.error("Error al imprimir:", error);
    // No mostrar alert ni confirm, solo log
  }
}

// Event listener para el botón de imprimir
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

// Elimina o comenta la función mostrarInstruccionesImpresion si no la usas en otro lado
// --- Plantilla para agregar personas en el área (ajusta el endpoint y campos según tu backend) ---
async function agregarPersonaEnArea(idPermiso, persona) {
  // persona = { nombre, funcion, credencial, cargo }
  try {
    await fetch(`/api/pt2/personas_area/${idPermiso}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(persona),
    });
    // Puedes actualizar la UI aquí si lo necesitas
  } catch (err) {
    console.error("Error al agregar persona en área:", err);
  }
}
// Botón regresar funcional
const btnRegresar = document.getElementById("btn-regresar");
if (btnRegresar) {
  btnRegresar.addEventListener("click", function () {
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  });
}

// Obtener el id_permiso de la URL (ejemplo: ?id=123)
const params = new URLSearchParams(window.location.search);
const idPermiso = params.get("id");
if (idPermiso) {
  console.log("Consultando permiso de radiactivas con id:", idPermiso);
  fetch(`/api/pt-radiacion/${idPermiso}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Respuesta de la API:", data);
      if (data && data.success && data.data) {
        const permiso = data.data;
        // guardar permiso en caché para uso en la fusión de campos
        _permisoFetch = permiso;
        console.log("Valores del permiso recibidos:", permiso);
        setText("maintenance-type-label", permiso.tipo_mantenimiento || "-");
        setText("work-order-label", permiso.ot_numero || "-");
        setText("tag-label", permiso.tag || "-");
        setText("start-time-label", permiso.hora_inicio || "-");
        //setText("has-equipment-label", permiso.tiene_equipo_intervenir || "-");
        setText(
          "equipment-description-label",
          permiso.descripcion_equipo || "-"
        );
        setText(
          "special-tools-label",
          permiso.requiere_herramientas_especiales || "-"
        );
        setText(
          "special-tools-type-label",
          permiso.tipo_herramientas_especiales || "-"
        );
        setText("adequate-tools-label", permiso.herramientas_adecuadas || "-");
        setText(
          "pre-verification-label",
          permiso.requiere_verificacion_previa || "-"
        );
        setText(
          "risk-knowledge-label",
          permiso.requiere_conocer_riesgos || "-"
        );
        setText(
          "final-observations-label",
          permiso.observaciones_medidas || "-"
        );
        // Mostrar valores de requisitos de apertura de área (solo lectura)
        setText("otro_permiso-label", permiso.tipo_fuente_radiactiva || "-");
        setText("cual_otro_permiso-label", permiso.actividad_radiactiva || "-");
        setText(
          "barricadas_senalamientos-label",
          permiso.numero_serial_fuente || "-"
        );
        setText(
          "suspension_trabajos_cercano-label",
          permiso.distancia_trabajo || "-"
        );
        setText(
          "retiro_personal_ajeno-label",
          permiso.tiempo_exposicion || "-"
        );
        setText("placa_dosimetro-label", permiso.dosis_estimada || "-");
        setText(
          "limite_exposicion-label",
          permiso.equipo_proteccion_radiologica || "-"
        );
        setText(
          "letreros_advertencia-label",
          permiso.dosimetros_personales || "-"
        );
        setText(
          "advirtio_personal-label",
          permiso.monitores_radiacion_area || "-"
        );
        setText(
          "ubicacion_fuente_radioactiva-label",
          permiso.senalizacion_area || "-"
        );
        setText("numero_personas_autorizadas-label", permiso.barricadas || "-");
        setText(
          "tiempo_exposicion_permisible-label",
          permiso.protocolo_emergencia || "-"
        );

        // Mostrar valores de condiciones del proceso (solo lectura)
        setText("fluid-label", permiso.fluido || "-");
        setText("pressure-label", permiso.presion || "-");
        setText("temperature-label", permiso.temperatura || "-");
        // Radios de requisitos
        const radios = [
          "fuera_operacion",
          "despresurizado_purgado",
          "necesita_aislamiento",
          "con_valvulas",
          "con_juntas_ciegas",
          "producto_entrampado",
          "requiere_lavado",
          "requiere_neutralizado",
          "requiere_vaporizado",
          "suspender_trabajos_adyacentes",
          "acordonar_area",
          "prueba_gas_toxico_inflamable",
          "equipo_electrico_desenergizado",
          "tapar_purgas_drenajes",
        ];
        radios.forEach((name) => {
          if (permiso[name]) {
            const radio = document.querySelector(
              `input[name='${name}'][value='${permiso[name]}']`
            );
            if (radio) radio.checked = true;
          }
        });

        // --- Mostrar Identificación de la fuente (solo lectura) ---
        setText("marca_modelo-label", permiso.marca_modelo || "-");
        setText("marca_modelo_check-label", permiso.marca_modelo_check || "-");
        setText("tipo_isotopo-label", permiso.tipo_isotopo || "-");
        setText("tipo_isotopo_check-label", permiso.tipo_isotopo_check || "-");
        setText("numero_fuente-label", permiso.numero_fuente || "-");
        setText(
          "numero_fuente_check-label",
          permiso.numero_fuente_check || "-"
        );
        setText("actividad_fuente-label", permiso.actividad_fuente || "-");
        setText(
          "actividad_fuente_check-label",
          permiso.actividad_fuente_check || "-"
        );
        setText("fecha_dia-label", permiso.fecha_dia || "-");
        setText("fecha_mes-label", permiso.fecha_mes || "-");
        setText("fecha_anio-label", permiso.fecha_anio || "-");

        // Actualizar campos fusionados usando permiso específico
        try {
          actualizarCamposFusionados();
        } catch (e) {
          console.warn("actualizarCamposFusionados falló (permiso):", e);
        }
      } else {
        alert(
          "No se encontraron datos para este permiso o la API no respondió correctamente."
        );
      }
    })
    .catch((err) => {
      console.error("Error al obtener datos del permiso:", err);
      alert(
        "Error al obtener datos del permiso. Revisa la consola para más detalles."
      );
    });
}

// Utilidad para asignar texto
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.addEventListener("DOMContentLoaded", function () {
  // Guardar requisitos
  const btnGuardar = document.getElementById("btn-guardar-requisitos");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", async function () {
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id");
      if (!idPermiso) {
        alert("No se encontró el id del permiso en la URL");
        return;
      }
      // Utilidad para leer radios
      function getRadio(name) {
        const checked = document.querySelector(`input[name='${name}']:checked`);
        return checked ? checked.value : null;
      }
      // Construir payload
      const payload = {
        fuera_operacion: getRadio("fuera_operacion"),
        despresurizado_purgado: getRadio("despresurizado_purgado"),
        necesita_aislamiento: getRadio("necesita_aislamiento"),
        con_valvulas: getRadio("con_valvulas"),
        con_juntas_ciegas: getRadio("con_juntas_ciegas"),
        producto_entrampado: getRadio("producto_entrampado"),
        requiere_lavado: getRadio("requiere_lavado"),
        requiere_neutralizado: getRadio("requiere_neutralizado"),
        requiere_vaporizado: getRadio("requiere_vaporizado"),
        suspender_trabajos_adyacentes: getRadio(
          "suspender_trabajos_adyacentes"
        ),
        acordonar_area: getRadio("acordonar_area"),
        prueba_gas_toxico_inflamable: getRadio("prueba_gas_toxico_inflamable"),
        equipo_electrico_desenergizado: getRadio(
          "equipo_electrico_desenergizado"
        ),
        tapar_purgas_drenajes: getRadio("tapar_purgas_drenajes"),
      };
      try {
        const resp = await fetch(
          `/api/pt-radiacion/requisitos_area/${idPermiso}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        console.log("[PT7-IMP] payload (guardar requisitos):", payload);
        let respJson = {};
        try {
          respJson = await resp.json();
        } catch (e) {
          console.warn(
            "[PT7-IMP] no JSON en respuesta al guardar requisitos",
            e
          );
        }
        console.log(
          "[PT7-IMP] respuesta guardar requisitos:",
          resp.status,
          respJson
        );
        if (!resp.ok) throw new Error("Error al guardar los requisitos");
        alert("Requisitos guardados correctamente");
      } catch (err) {
        console.error("Error al guardar requisitos:", err);
        alert(
          "Error al guardar los requisitos. Revisa la consola para más detalles."
        );
      }
    });
  }

  // Salir: redirigir a AutorizarPT.html
  const btnSalirNuevo = document.getElementById("btn-salir-nuevo");

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

  // Leer el id del permiso de la URL
  const params2 = new URLSearchParams(window.location.search);
  const idPermiso2 = params2.get("id");
  if (idPermiso2) {
    // Llamar a la API para obtener los datos del permiso
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso2)}`)
      .then((resp) => resp.json())
      .then((data) => {
        // Guardar verformularios para fusión de campos
        _verformulariosFetch = data || {};
        // Llenar campos generales usando data.data
        if (data && data.data) {
          const detalles = data.data;

          console.log(
            "Valor de tecnico_radialogo:",
            detalles.tecnico_radialogo
          );
          if (document.getElementById("nombre_firma-label"))
            document.getElementById("nombre_firma-label").textContent =
              detalles.tecnico_radialogo || "-";

          if (document.getElementById("nombre_firma_check-label"))
            document.getElementById("nombre_firma_check-label").textContent =
              detalles.tecnico_radialogo || "-";

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
          if (document.getElementById("special-tools-type-label"))
            document.getElementById("special-tools-type-label").textContent =
              detalles.tipo_herramientas_especiales || "-";
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

          //****
          //  */

          // ...agrega aquí más campos generales de PT2 si los tienes...
        }
        // Rellenar AST y Participantes si existen en la respuesta
        if (data.ast) {
          mostrarAST(data.ast);
        } else {
          mostrarAST({}); // Limpia listas si no hay datos
        }
        if (data.actividades_ast) {
          mostrarActividadesAST(data.actividades_ast);
        } else {
          mostrarActividadesAST([]); // Limpia tabla si no hay datos
        }
        if (data.participantes_ast) {
          mostrarParticipantesAST(data.participantes_ast);
        } else {
          mostrarParticipantesAST([]); // Limpia tabla si no hay datos
        }
        let prefijo =
          (data.general && data.general.prefijo) ||
          (data.data && data.data.prefijo) ||
          data.prefijo ||
          "-";
        document.getElementById("prefijo-label").textContent = prefijo;

        try {
          actualizarCamposFusionados();
        } catch (e) {
          console.warn("actualizarCamposFusionados falló (verformularios):", e);
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });
    llenarTablaResponsables(idPermiso2);
  }
});

// Salir: redirigir a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function () {
    window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
  });
}

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
      } else {
        // Si no hay datos, muestra mensaje
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
        tbody.appendChild(tr);
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}
