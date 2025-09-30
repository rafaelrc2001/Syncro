// --- Funciones de impresión (traídas de PT5) ---
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
    alert(
      "Ocurrió un error al preparar la impresión. Por favor, inténtalo nuevamente."
    );
  }
}

function mostrarInstruccionesImpresion() {
  const mensaje = `🖨️ PARA ELIMINAR ENCABEZADOS Y PIES DE PÁGINA:\n\n📌 CHROME/EDGE:\n1. Presiona Ctrl+P\n2. Busca \"Más configuraciones\" y haz clic\n3. DESMARCA la casilla \"Encabezados y pies de página\"\n4. Haz clic en \"Imprimir\"\n\n📌 FIREFOX:\n1. Presiona Ctrl+P  \n2. Haz clic en \"Configurar página\"\n3. En \"Encabezados y pies\", selecciona \"Vacío\" en TODOS\n4. Haz clic en \"Imprimir\"\n\n⚠️ Esta configuración se debe hacer UNA SOLA VEZ por navegador.\n¿Quieres que te abra el diálogo de impresión ahora?`;

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
// --- Plantilla para agregar personas en el área (ajusta el endpoint y campos según tu backend) ---
async function agregarPersonaEnArea(idPermiso, persona) {
  // persona = { nombre, funcion, credencial, cargo }
  try {
    await fetch(`http://localhost:3000/api/pt2/personas_area/${idPermiso}`, {
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
    window.location.href = "SupSeguridad/SupSeguridad.html";
  });
}

// Obtener el id_permiso de la URL (ejemplo: ?id=123)
const params = new URLSearchParams(window.location.search);
const idPermiso = params.get("id");
if (idPermiso) {
  console.log("Consultando permiso de electrico con id:", idPermiso);
  fetch(`http://localhost:3000/api/pt-electrico/${idPermiso}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Respuesta de la API:", data);
      // Mapear datos generales correctamente
      if (data && data.success && data.data) {
        const permiso = data.data;
        console.log("Valores del permiso recibidos:", permiso);

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
          if (valor === "SI") return "si";
          if (valor === "NO") return "no";
          if (valor === "NA") return "n/a";
          return "";
        }
        setText(
          "identifico_equipo_respuesta",
          respuestaTexto(permiso.identifico_equipo)
        );
        setText(
          "verifico_identifico_equipo",
          permiso.verifico_identifico_equipo === "SI" ? "si" : "no"
        );

        setText(
          "fuera_operacion_desenergizado_respuesta",
          respuestaTexto(permiso.fuera_operacion_desenergizado)
        );
        setText(
          "verifico_fuera_operacion_desenergizado",
          permiso.verifico_fuera_operacion_desenergizado === "SI" ? "si" : "no"
        );

        setText(
          "candado_etiqueta_respuesta",
          respuestaTexto(permiso.candado_etiqueta)
        );
        setText(
          "verifico_candado_etiqueta",
          permiso.verifico_candado_etiqueta === "SI" ? "si" : "no"
        );

        setText(
          "suspender_adyacentes_respuesta",
          respuestaTexto(permiso.suspender_adyacentes)
        );
        setText(
          "verifico_suspender_adyacentes",
          permiso.verifico_suspender_adyacentes === "SI" ? "si" : "no"
        );

        setText(
          "area_limpia_libre_obstaculos_respuesta",
          respuestaTexto(permiso.area_limpia_libre_obstaculos)
        );
        setText(
          "verifico_area_limpia_libre_obstaculos",
          permiso.verifico_area_limpia_libre_obstaculos === "SI" ? "si" : "no"
        );

        setText(
          "libranza_electrica_respuesta",
          respuestaTexto(permiso.libranza_electrica)
        );
        setText(
          "verifico_libranza_electrica",
          permiso.verifico_libranza_electrica === "SI" ? "si" : "no"
        );

        // CONDICIONES ACTUALES DEL EQUIPO
        setText("nivel_tension", permiso.nivel_tension || "-");
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
      // Utilidad para leer checkboxes (devuelve "SI" o "NO")
      function getCheckbox(name) {
        const checkbox = document.querySelector(`input[name='${name}']`);
        return checkbox && checkbox.checked ? "SI" : "NO";
      }
      // Utilidad para leer input text
      function getInputValue(id) {
        const input = document.getElementById(id);
        return input ? input.value : null;
      }
      // Construir payload con los nombres correctos del backend
      const payload = {
        identifico_equipo: getRadio("identifico_equipo"),
        verifico_identifico_equipo: getCheckbox("verifico_identifico_equipo"),
        fuera_operacion_desenergizado: getRadio(
          "fuera_operacion_desenergizado"
        ),
        verifico_fuera_operacion_desenergizado: getCheckbox(
          "verifico_fuera_operacion_desenergizado"
        ),
        candado_etiqueta: getRadio("candado_etiqueta"),
        verifico_candado_etiqueta: getCheckbox("verifico_candado_etiqueta"),
        suspender_adyacentes: getRadio("suspender_adyacentes"),
        verifico_suspender_adyacentes: getCheckbox(
          "verifico_suspender_adyacentes"
        ),
        area_limpia_libre_obstaculos: getRadio("area_limpia_libre_obstaculos"),
        verifico_area_limpia_libre_obstaculos: getCheckbox(
          "verifico_area_limpia_libre_obstaculos"
        ),
        libranza_electrica: getRadio("libranza_electrica"),
        verifico_libranza_electrica: getCheckbox("verifico_libranza_electrica"),
        nivel_tension: getInputValue("nivel_tension"),
      };
      try {
        const resp = await fetch(
          `http://localhost:3000/api/pt-electrico/requisitos_area/${idPermiso}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
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
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso2
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
        // Llenar campos generales usando data.data
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
              detalles.equipo_intervenir || "-";
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
          // También mapear equipo_intervenir correctamente
          if (document.getElementById("descripcion-trabajo-label"))
            document.getElementById("descripcion-trabajo-label").textContent =
              detalles.descripcion_trabajo || "-";
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
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });
  }
});

// --- Botón Salir (igual que PT5) ---
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function () {
    window.location.href = "/Modules/Usuario/AutorizarPT.html";
  });
}
