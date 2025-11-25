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
});
// --- Funciones de impresión (ajustadas para impresión directa) ---
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
    // Detectar la página actual y redirigir a la correspondiente
    if (window.location.pathname.includes("PT6imprimir2.html")) {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    } else if (window.location.pathname.includes("PT6imprimirseg.html")) {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    } else if (window.location.pathname.includes("PT6imprimirsup.html")) {
      window.location.href = "../../JefeSeguridad/JefeSeguridad.html";
    }
  });
}

// Obtener el id_permiso de la URL (ejemplo: ?id=123)
const params = new URLSearchParams(window.location.search);
const idPermiso = params.get("id");

const comentarioDiv = document.getElementById("comentarios-permiso");
if (comentarioDiv && idPermiso) {
  mostrarComentarioSiCorresponde(idPermiso, comentarioDiv);
}

let _permisoFetch = null;
let _verformulariosFetch = null;

function actualizarNivelTensionDesdeFuentes() {
  // prioridad: pt-electrico (permiso) > verformularios.data > verformularios.general > '-'
  const nivelDesdePermiso = _permisoFetch && _permisoFetch.nivel_tension;
  const nivelDesdeVer =
    _verformulariosFetch &&
    ((_verformulariosFetch.data && _verformulariosFetch.data.nivel_tension) ||
      (_verformulariosFetch.general &&
        _verformulariosFetch.general.nivel_tension));

  const valor = nivelDesdePermiso ?? nivelDesdeVer ?? "-";
  console.log("[DEBUG] Nivel de tensión resuelto para impresión:", {
    nivelDesdePermiso,
    nivelDesdeVer,
    valor,
  });
  setText("nivel_tension", valor);
}

// Helper reutilizable para mapear un campo desde varias fuentes
function aplicarCampoFusionado(
  domId,
  propPermiso,
  propVerData,
  propVerGeneral
) {
  const vPerm = _permisoFetch && _permisoFetch[propPermiso];
  const vVer =
    _verformulariosFetch &&
    ((_verformulariosFetch.data && _verformulariosFetch.data[propVerData]) ||
      (_verformulariosFetch.general &&
        _verformulariosFetch.general[propVerGeneral]));
  const valor = vPerm ?? vVer ?? "-";
  setText(domId, valor);
}

// Actualizar un conjunto de campos comunes en la impresión
function actualizarCamposFusionados() {
  // identificadores DOM vs propiedades en permiso/verformularios
  aplicarCampoFusionado("prefijo-label", "prefijo", "prefijo", "prefijo");
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
    "descripcion_trabajo",
    "descripcion_trabajo",
    "descripcion_trabajo"
  );
  aplicarCampoFusionado(
    "equipment-description-label",
    "equipo_intervenir",
    "equipo_intervenir",
    "equipo_intervenir"
  );
  aplicarCampoFusionado("empresa-label", "empresa", "empresa", "empresa");
  // solicitante puede estar en distintos nombres
  const solicitantePerm =
    _permisoFetch &&
    (_permisoFetch.solicitante || _permisoFetch.nombre_solicitante);
  const solicitanteVer =
    _verformulariosFetch &&
    ((_verformulariosFetch.data &&
      (_verformulariosFetch.data.solicitante ||
        _verformulariosFetch.data.nombre_solicitante)) ||
      (_verformulariosFetch.general &&
        (_verformulariosFetch.general.solicitante ||
          _verformulariosFetch.general.nombre_solicitante)));
  setText("nombre-solicitante-label", solicitantePerm ?? solicitanteVer ?? "-");
  aplicarCampoFusionado("sucursal-label", "sucursal", "sucursal", "sucursal");
  aplicarCampoFusionado("contrato-label", "contrato", "contrato", "contrato");
  aplicarCampoFusionado(
    "work-order-label",
    "ot_numero",
    "ot_numero",
    "ot_numero"
  );
  aplicarCampoFusionado("tag-label", "tag", "tag", "tag");
  // medidas / checks que ya estamos seteando desde permiso, asegurar fallback
  aplicarCampoFusionado(
    "equipo_desenergizado",
    "equipo_desenergizado",
    "equipo_desenergizado",
    "equipo_desenergizado"
  );
  aplicarCampoFusionado(
    "interruptores_abiertos",
    "interruptores_abiertos",
    "interruptores_abiertos",
    "interruptores_abiertos"
  );
  aplicarCampoFusionado(
    "ausencia_voltaje",
    "verificar_ausencia_voltaje",
    "verificar_ausencia_voltaje",
    "verificar_ausencia_voltaje"
  );
  aplicarCampoFusionado(
    "candados_intervencion",
    "candados_equipo",
    "candados_equipo",
    "candados_equipo"
  );
  aplicarCampoFusionado(
    "tarjetas_alerta_notificacion",
    "tarjetas_alerta",
    "tarjetas_alerta",
    "tarjetas_alerta"
  );
  aplicarCampoFusionado(
    "aviso_personal_area",
    "aviso_personal_area",
    "aviso_personal_area",
    "aviso_personal_area"
  );
  aplicarCampoFusionado(
    "tapetes_dielelectricos",
    "tapetes_dielectricos",
    "tapetes_dielectricos",
    "tapetes_dielectricos"
  );
  aplicarCampoFusionado(
    "herramienta_aislante",
    "herramienta_aislante",
    "herramienta_aislante",
    "herramienta_aislante"
  );
  aplicarCampoFusionado(
    "pertiga_telescopica",
    "pertiga_telescopica",
    "pertiga_telescopica",
    "pertiga_telescopica"
  );
  aplicarCampoFusionado(
    "equipo_proteccion_especial",
    "equipo_proteccion_especial",
    "equipo_proteccion_especial",
    "equipo_proteccion_especial"
  );
  aplicarCampoFusionado(
    "cual_equipo_proteccion",
    "tipo_equipo_proteccion",
    "tipo_equipo_proteccion",
    "tipo_equipo_proteccion"
  );
  aplicarCampoFusionado(
    "aterrizar_equipo_circuito",
    "aterrizar_equipo",
    "aterrizar_equipo",
    "aterrizar_equipo"
  );
  aplicarCampoFusionado(
    "instalar_barricadas_area",
    "barricadas_area",
    "barricadas_area",
    "barricadas_area"
  );
  aplicarCampoFusionado(
    "observaciones_medidas",
    "observaciones_adicionales",
    "observaciones_adicionales",
    "observaciones_adicionales"
  );
  // nivel tensión (usa la función ya existente también)
  actualizarNivelTensionDesdeFuentes();
}

if (idPermiso) {
  console.log("Consultando permiso de electrico con id:", idPermiso);
  fetch(`/api/pt-electrico/${idPermiso}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Respuesta de la API (pt-electrico):", data);
      // Mapear datos generales correctamente
      if (data && data.success && data.data) {
        const permiso = data.data;
        _permisoFetch = permiso;
        console.log("Valores del permiso recibidos (pt-electrico):", permiso);

        // Datos generales
        setText("maintenance-type-label", permiso.tipo_mantenimiento || "-");
        setText("work-order-label", permiso.ot_numero || "-");
        setText("tag-label", permiso.tag || "-");
        setText("start-time-label", permiso.hora_inicio || "-");
        setText(
          "descripcion-trabajo-label",
          permiso.descripcion_trabajo || "-"
        );
        setText(
          "equipment-description-label",
          permiso.equipo_intervenir || "-"
        );

        // Mapear campos de "Medidas para administrar los riesgos"
        setText("equipo_desenergizado", permiso.equipo_desenergizado || "-");
        setText(
          "interruptores_abiertos",
          permiso.interruptores_abiertos || "-"
        );
        setText("ausencia_voltaje", permiso.verificar_ausencia_voltaje || "-");
        setText("candados_intervencion", permiso.candados_equipo || "-");
        setText("tarjetas_alerta_notificacion", permiso.tarjetas_alerta || "-");
        setText("aviso_personal_area", permiso.aviso_personal_area || "-");
        setText("tapetes_dielelectricos", permiso.tapetes_dielectricos || "-");
        setText("herramienta_aislante", permiso.herramienta_aislante || "-");
        setText("pertiga_telescopica", permiso.pertiga_telescopica || "-");
        setText(
          "equipo_proteccion_especial",
          permiso.equipo_proteccion_especial || "-"
        );
        setText(
          "cual_equipo_proteccion",
          permiso.tipo_equipo_proteccion || "-"
        );
        setText("aterrizar_equipo_circuito", permiso.aterrizar_equipo || "-");
        setText("instalar_barricadas_area", permiso.barricadas_area || "-");
        setText(
          "observaciones_medidas",
          permiso.observaciones_adicionales || "-"
        );

        // Mapear campos de MEDIDAS / REQUISITOS PARA ADMINISTRAR LOS RIESGOS (SUPERVISOR)
        setText(
          "equipo_proteccion_especial_respuesta",
          permiso.equipo_proteccion_especial_supervisor || "-"
        );
        setText(
          "cual_equipo_proteccion_mostrar",
          permiso.cual_equipo_proteccion || "-"
        );
        setText(
          "observaciones_medidas_mostrar",
          permiso.observaciones_medidas || "-"
        );

        // Otros campos específicos del formulario eléctrico
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

        // ANÁLISIS DE REQUISITOS PARA EFECTUAR EL TRABAJO (nuevo formato)
        function respuestaTexto(valor) {
          if (valor === "SI") return "SI";
          if (valor === "NO") return "NO";
          return "N/A";
        }
        setText(
          "identifico_equipo_respuesta",
          respuestaTexto(permiso.identifico_equipo)
        );

        function mostrarVerificacion(valor) {
          if (valor === "SI") return "si";
          return "no";
        }
        setText(
          "verifico_identifico_equipo",
          mostrarVerificacion(permiso.verifico_identifico_equipo)
        );

        setText(
          "fuera_operacion_desenergizado_respuesta",
          respuestaTexto(permiso.fuera_operacion_desenergizado)
        );
        setText(
          "verifico_fuera_operacion_desenergizado",
          mostrarVerificacion(permiso.verifico_fuera_operacion_desenergizado)
        );

        setText(
          "candado_etiqueta_respuesta",
          respuestaTexto(permiso.candado_etiqueta)
        );
        setText(
          "verifico_candado_etiqueta",
          mostrarVerificacion(permiso.verifico_candado_etiqueta)
        );

        setText(
          "suspender_adyacentes_respuesta",
          respuestaTexto(permiso.suspender_adyacentes)
        );
        setText(
          "verifico_suspender_adyacentes",
          mostrarVerificacion(permiso.verifico_suspender_adyacentes)
        );

        setText(
          "area_limpia_libre_obstaculos_respuesta",
          respuestaTexto(permiso.area_limpia_libre_obstaculos)
        );
        setText(
          "verifico_area_limpia_libre_obstaculos",
          mostrarVerificacion(permiso.verifico_area_limpia_libre_obstaculos)
        );

        setText(
          "libranza_electrica_respuesta",
          respuestaTexto(permiso.libranza_electrica)
        );
        setText(
          "verifico_libranza_electrica",
          mostrarVerificacion(permiso.verifico_libranza_electrica)
        );

        // --- Mapear explícitamente los mismos campos que en supervisor ---
        setText("prefijo-label", permiso.prefijo || "-");
        setText("empresa-label", permiso.empresa || "-");
        setText(
          "nombre-solicitante-label",
          permiso.solicitante || permiso.nombre_solicitante || "-"
        );
        setText("sucursal-label", permiso.sucursal || "-");
        setText("contrato-label", permiso.contrato || "-");
        setText("plant-label", permiso.area || "-");
        setText("start-time-label", permiso.hora_inicio || "-");
        setText("fecha-label", permiso.fecha || "-");
        setText("work-order-label", permiso.ot_numero || "-");
        setText("tag-label", permiso.tag || "-");
        setText(
          "descripcion-trabajo-label",
          permiso.descripcion_trabajo || "-"
        );
        setText(
          "equipment-description-label",
          permiso.equipo_intervenir || "-"
        );
        setText("nivel_tension", permiso.nivel_tension || "-");

        // Después de poblar desde la respuesta de pt-electrico, sincronizar todos
        // los campos comunes con la lógica de supervisor para evitar discrepancias
        // entre la vista supervisor y la de impresión.
        actualizarCamposFusionados();
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
        alert("No se encontró el ID del permiso.");
        return;
      }
      const requisitosVerificados = {
        verifico_identifico_equipo: document.querySelector(
          'input[name="verifico_identifico_equipo"]:checked'
        )?.value,
        verifico_fuera_operacion_desenergizado: document.querySelector(
          'input[name="verifico_fuera_operacion_desenergizado"]:checked'
        )?.value,
        verifico_candado_etiqueta: document.querySelector(
          'input[name="verifico_candado_etiqueta"]:checked'
        )?.value,
        verifico_suspender_adyacentes: document.querySelector(
          'input[name="verifico_suspender_adyacentes"]:checked'
        )?.value,
        verifico_area_limpia_libre_obstaculos: document.querySelector(
          'input[name="verifico_area_limpia_libre_obstaculos"]:checked'
        )?.value,
        verifico_libranza_electrica: document.querySelector(
          'input[name="verifico_libranza_electrica"]:checked'
        )?.value,
      };
      try {
        const response = await fetch(`/api/pt-electrico/${idPermiso}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requisitosVerificados),
        });
        if (response.ok) {
          alert("Requisitos guardados exitosamente.");
        } else {
          alert("Error al guardar los requisitos.");
        }
      } catch (error) {
        console.error("Error al guardar requisitos:", error);
        alert("Error al guardar los requisitos.");
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
      (ast.epp || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        eppList.appendChild(li);
      });
    }
    const maqList = document.getElementById("modal-maquinaria-list");
    if (maqList) {
      maqList.innerHTML = "";
      (ast.maquinaria || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        maqList.appendChild(li);
      });
    }
    const matList = document.getElementById("modal-materiales-list");
    if (matList) {
      matList.innerHTML = "";
      (ast.materiales || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        matList.appendChild(li);
      });
    }
  }

  function mostrarActividadesAST(actividades) {
    const tbody = document.getElementById("modal-ast-actividades-body");
    if (tbody) {
      tbody.innerHTML = "";
      (actividades || []).forEach((act) => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.textContent = act.actividad || "";
        const td2 = document.createElement("td");
        td2.textContent = act.riesgo || "";
        const td3 = document.createElement("td");
        td3.textContent = act.medidas || "";
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tbody.appendChild(tr);
      });
    }
  }

  function mostrarParticipantesAST(participantes) {
    const tbody = document.getElementById("modal-ast-participantes-body");
    if (tbody) {
      tbody.innerHTML = "";
      (participantes || []).forEach((p) => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.textContent = p.nombre || "";
        const td2 = document.createElement("td");
        td2.textContent = p.funcion || "";
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
      });
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
        if (data.success && data.data) {
          _verformulariosFetch = data.data;
          const permiso = data.data;
          console.log("Respuesta de /api/verformularios:", permiso);

          // Mapear datos generales
          setText("prefijo-label", permiso.general?.prefijo || "-");
          setText("empresa-label", permiso.general?.empresa || "-");
          setText(
            "nombre-solicitante-label",
            permiso.general?.solicitante ||
              permiso.general?.nombre_solicitante ||
              "-"
          );
          setText("sucursal-label", permiso.general?.sucursal || "-");
          setText("contrato-label", permiso.general?.contrato || "-");
          setText("plant-label", permiso.general?.area || "-");
          setText("start-time-label", permiso.general?.hora_inicio || "-");
          setText("fecha-label", permiso.general?.fecha || "-");
          setText("work-order-label", permiso.general?.ot_numero || "-");
          setText("tag-label", permiso.general?.tag || "-");
          setText(
            "descripcion-trabajo-label",
            permiso.general?.descripcion_trabajo || "-"
          );
          setText(
            "equipment-description-label",
            permiso.general?.equipo_intervener || "-"
          );
          setText(
            "maintenance-type-label",
            permiso.general?.tipo_mantenimiento || "-"
          );

          // Otros campos del backend
          setText(
            "special-tools-label",
            permiso.data?.requiere_herramientas_especiales || "-"
          );
          setText(
            "special-tools-type-label",
            permiso.data?.tipo_herramientas_especiales || "-"
          );
          setText(
            "adequate-tools-label",
            permiso.data?.herramientas_adecuadas || "-"
          );
          setText(
            "pre-verification-label",
            permiso.data?.requiere_verificacion_previa || "-"
          );
          setText(
            "risk-knowledge-label",
            permiso.data?.requiere_conocer_riesgos || "-"
          );
          setText(
            "final-observations-label",
            permiso.data?.observaciones_medidas || "-"
          );

          // AST
          if (permiso.ast) {
            mostrarAST(permiso.ast);
          }
          if (permiso.ast_actividades) {
            mostrarActividadesAST(permiso.ast_actividades);
          }
          if (permiso.ast_participantes) {
            mostrarParticipantesAST(permiso.ast_participantes);
          }

          // Actualizar campos fusionados después
          actualizarCamposFusionados();
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos generales del permiso:", err);
        alert(
          "Error al obtener datos generales del permiso. Revisa la consola para más detalles."
        );
      });

    // === AGREGA ESTA LÍNEA AQUÍ ===
    llenarTablaResponsables(idPermiso2);
  }
});

// --- Botón Salir ---
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function () {
    // Detectar la página actual y redirigir a la correspondiente
    if (window.location.pathname.includes("PT6imprimir2.html")) {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    } else if (window.location.pathname.includes("PT6imprimirseg.html")) {
      window.location.href = "/Modules/SupSeguridad/SupSeguridad.html";
    } else if (window.location.pathname.includes("PT6imprimirsup.html")) {
      window.location.href = "../../JefeSeguridad/JefeSeguridad.html";
    }
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
        result.data.forEach((persona) => {
          const tr = document.createElement("tr");

          const tdNombre = document.createElement("td");
          tdNombre.textContent = persona.nombre || "-";
          tr.appendChild(tdNombre);

          const tdFuncion = document.createElement("td");
          tdFuncion.textContent = persona.funcion || "-";
          tr.appendChild(tdFuncion);

          const tdCredencial = document.createElement("td");
          tdCredencial.textContent = persona.credencial || "-";
          tr.appendChild(tdCredencial);

          const tdFirma = document.createElement("td");
          if (persona.firma_base64) {
            const img = document.createElement("img");
            img.src = `data:image/png;base64,${persona.firma_base64}`;
            img.alt = `Firma de ${persona.nombre}`;
            img.style.maxWidth = "120px";
            img.style.height = "auto";
            tdFirma.appendChild(img);
          } else {
            tdFirma.textContent = "Sin firma";
          }
          tr.appendChild(tdFirma);

          const tdCargo = document.createElement("td");
          tdCargo.textContent = persona.cargo || "-";
          tr.appendChild(tdCargo);

          tbody.appendChild(tr);
        });
      } else {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.textContent = "No hay responsables registrados.";
        tr.appendChild(td);
        tbody.appendChild(tr);
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}
