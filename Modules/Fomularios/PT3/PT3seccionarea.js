// --- Lógica fusionada para guardar campos y autorizar ---
const btnGuardarCampos = document.getElementById("btn-guardar-campos");
if (btnGuardarCampos) {
  btnGuardarCampos.addEventListener("click", async function () {
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
      alert("Debes ingresar el nombre del responsable.");
      return;
    }

    // 3. Guardar los campos/requisitos primero
    // Utilidad para leer radios
    function getRadio(name) {
      const checked = document.querySelector(`input[name='${name}']:checked`);
      return checked ? checked.value : null;
    }
    // Construir payload con todos los campos requeridos por el backend
    const payload = {
      verificar_explosividad: getRadio("verificar_explosividad"),
      verificar_gas_toxico: getRadio("verificar_gas_toxico"),
      verificar_deficiencia_oxigeno: getRadio("verificar_deficiencia_oxigeno"),
      verificar_enriquecimiento_oxigeno: getRadio(
        "verificar_enriquecimiento_oxigeno"
      ),
      verificar_polvo_humos_fibras: getRadio("verificar_polvo_humos_fibras"),
      verificar_amoniaco: getRadio("verificar_amoniaco"),
      verificar_material_piel: getRadio("verificar_material_piel"),
      verificar_temperatura: getRadio("verificar_temperatura"),
      verificar_lel: getRadio("verificar_lel"),
      suspender_trabajos_adyacentes: getRadio("suspender_trabajos_adyacentes"),
      acordonar_area: getRadio("acordonar_area"),
      prueba_gas_toxico_inflamable: getRadio("prueba_gas_toxico_inflamable"),
      porcentaje_lel:
        document.querySelector("input[name='porcentaje_lel']")?.value || null,
      nh3: document.querySelector("input[name='nh3']")?.value || null,
      porcentaje_oxigeno:
        document.querySelector("input[name='porcentaje_oxigeno']")?.value ||
        null,
      equipo_despresionado_fuera_operacion: getRadio(
        "equipo_despresionado_fuera_operacion"
      ),
      equipo_aislado: getRadio("equipo_aislado"),
      equipo_aislado_valvula:
        document.querySelector("input[name='equipo_aislado_valvula']")
          ?.checked || false,
      equipo_aislado_junta_ciega:
        document.querySelector("input[name='equipo_aislado_junta_ciega']")
          ?.checked || false,
      equipo_lavado: getRadio("equipo_lavado"),
      equipo_neutralizado: getRadio("equipo_neutralizado"),
      equipo_vaporizado: getRadio("equipo_vaporizado"),
      aislar_purgas_drenaje_venteo: getRadio("aislar_purgas_drenaje_venteo"),
      abrir_registros_necesarios: getRadio("abrir_registros_necesarios"),
      observaciones_requisitos:
        document.querySelector("textarea[name='observaciones_requisitos']")
          ?.value || null,
      fluido: document.getElementById("fluid").value,
      presion: document.getElementById("pressure").value,
      temperatura: document.getElementById("temperature").value,
    };
    try {
      const resp = await fetch(
        `http://localhost:3000/api/requisitos_area/${idPermiso}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const respText = await resp.text();
      console.error("Respuesta del backend:", resp.status, respText);
      if (!resp.ok) throw new Error("Error al guardar los requisitos");
    } catch (err) {
      alert("Error al guardar los campos/requisitos. No se puede autorizar.");
      console.error("Error al guardar requisitos:", err);
      return;
    }

    // 4. Autorizar (igual que PT1)
    try {
      let idEstatus = null;
      try {
        const respEstatus = await fetch(
          `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
        );
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus =
            permisoData.id_estatus ||
            (permisoData.data && permisoData.data.id_estatus);
        } else {
          console.error(
            "[DEPURACIÓN] Error al obtener id_estatus. Status:",
            respEstatus.status
          );
        }
      } catch (err) {
        console.error("[DEPURACIÓN] Error al consultar id_estatus:", err);
      }

      if (idEstatus) {
        try {
          const payloadEstatus = { id_estatus: idEstatus };
          const respEstatus = await fetch(
            "http://localhost:3000/api/estatus/seguridad",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadEstatus),
            }
          );
          let data = {};
          try {
            data = await respEstatus.json();
          } catch (e) {}
          if (!respEstatus.ok) {
            console.error(
              "[DEPURACIÓN] Error en respuesta de estatus/seguridad:",
              data
            );
          }
        } catch (err) {
          console.error(
            "[DEPURACIÓN] Excepción al actualizar estatus de seguridad:",
            err
          );
        }
      } else {
        console.warn(
          "[DEPURACIÓN] No se obtuvo id_estatus para actualizar estatus."
        );
      }

      await fetch("http://localhost:3000/api/autorizaciones/area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_permiso: idPermiso,
          responsable_area,
          encargado_area: operador_area,
        }),
      });
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    } catch (err) {
      alert(
        "Error al autorizar el permiso. Revisa la consola para más detalles."
      );
      console.error(
        "[DEPURACIÓN] Error al insertar autorización de área:",
        err
      );
    }
  });
}

// --- Lógica para el botón "No Autorizar" (abrir modal) ---
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
    const modal = document.getElementById("modalComentario");
    if (modal) {
      modal.style.display = "flex";
      document.getElementById("comentarioNoAutorizar").value = "";
    }
  });

  // Lógica para cerrar/cancelar el modal
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
  const btnGuardarComentario = document.getElementById("btnGuardarComentario");
  if (btnGuardarComentario) {
    btnGuardarComentario.addEventListener("click", async function () {
      const comentario = document
        .getElementById("comentarioNoAutorizar")
        .value.trim();
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const responsable_area = responsableInput
        ? responsableInput.value.trim()
        : "";
      const operador_area = operadorInput ? operadorInput.value.trim() : "";
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      if (!comentario || !idPermiso || !responsable_area) {
        return;
      }
      try {
        // Guardar comentario y responsable en la tabla de autorizaciones
        await fetch("http://localhost:3000/api/autorizaciones/area", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            responsable_area,
            encargado_area: operador_area,
            comentario_no_autorizar: comentario,
          }),
        });
        // Consultar el id_estatus desde permisos_trabajo
        let idEstatus = null;
        try {
          const respEstatus = await fetch(
            `http://localhost:3000/api/permisos-trabajo/${idPermiso}`
          );
          if (respEstatus.ok) {
            const permisoData = await respEstatus.json();
            idEstatus =
              permisoData.id_estatus ||
              (permisoData.data && permisoData.data.id_estatus);
          }
        } catch (err) {}
        // Actualizar el estatus a 'no autorizado' y guardar el comentario en la tabla estatus
        if (idEstatus) {
          try {
            const payloadEstatus = { id_estatus: idEstatus };
            await fetch("http://localhost:3000/api/estatus/no_autorizado", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payloadEstatus),
            });
            // Guardar el comentario en la tabla estatus
            await fetch("http://localhost:3000/api/estatus/comentario", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_estatus: idEstatus, comentario }),
            });
          } catch (err) {}
        }
        // Cerrar el modal y redirigir
        const modal = document.getElementById("modalComentario");
        if (modal) modal.style.display = "none";
        window.location.href = "/Modules/Usuario/AutorizarPT.html";
      } catch (err) {}
    });
  }
}

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
    window.location.href = "/Modules/Usuario/AutorizarPT.html";
  });
}

// Obtener el id_permiso de la URL (ejemplo: ?id=123)
const params = new URLSearchParams(window.location.search);
const idPermiso = params.get("id");
if (idPermiso) {
  console.log("Consultando permiso de apertura con id:", idPermiso);
  fetch(`http://localhost:3000/api/pt-confinado/${idPermiso}`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Respuesta de la API:", data);
      if (data && data.success && data.data) {
        const permiso = data.data;
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

// Función para rellenar los campos de "MEDIDAS / REQUISITOS PARA ADMINISTRAR LOS RIESGOS"
function rellenarMedidasRequisitos(data) {
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "-";
  };

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
}

// Lógica para obtener los datos del permiso y rellenar los campos
const params2 = new URLSearchParams(window.location.search);
const idPermiso2 = params2.get("id");
if (idPermiso2) {
  fetch(
    `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
      idPermiso2
    )}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      if (data && data.data) {
        rellenarMedidasRequisitos(data.data);
      } else {
        console.warn(
          "No se encontraron datos para rellenar las medidas/requisitos."
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
          `http://localhost:3000/api/pt-confinado/requisitos_area/${idPermiso}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const respText = await resp.text();
        console.error("Respuesta del backend:", resp.status, respText);
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
  if (btnSalirNuevo) {
    btnSalirNuevo.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    });
  }
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
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          document.getElementById("descripcion-trabajo-label").textContent =
            data.general.descripcion_trabajo || "-";
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
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    fetch(`http://localhost:3000/api/pt-confinado/${idPermiso}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data && data.data) {
          const d = data.data;
          // Asigna todos los campos
          [
            "avisos_trabajos",
            "iluminacion_prueba_explosion",
            "ventilacion_forzada",
            "evaluacion_medica_aptos",
            "cable_vida_trabajadores",
            "vigilancia_exterior",
            "nombre_vigilante",
            "personal_rescatista",
            "nombre_rescatista",
            "instalar_barreras",
            "equipo_especial",
            "tipo_equipo_especial",
            "observaciones_adicionales",
            "numero_personas_autorizadas",
            "tiempo_permanencia_min",
            "tiempo_recuperacion_min",
            "clase_espacio_confinado",
          ].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.textContent = d[id] || "-";
          });
        }
      });
  }
});

function rellenarRequisitosTrabajo(permiso) {
  // Radios
  [
    "verificar_explosividad",
    "verificar_gas_toxico",
    "verificar_deficiencia_oxigeno",
    "verificar_enriquecimiento_oxigeno",
    "verificar_polvo_humos_fibras",
    "verificar_amoniaco",
    "verificar_material_piel",
    "verificar_temperatura",
    "verificar_lel",
    "suspender_trabajos_adyacentes",
    "acordonar_area",
    "prueba_gas_toxico_inflamable",
    "equipo_despresionado_fuera_operacion",
    "equipo_aislado",
    "equipo_lavado",
    "equipo_neutralizado",
    "equipo_vaporizado",
    "aislar_purgas_drenaje_venteo",
    "abrir_registros_necesarios",
  ].forEach((name) => {
    if (permiso[name]) {
      const radio = document.querySelector(
        `input[name='${name}'][value='${permiso[name]}']`
      );
      if (radio) radio.checked = true;
    }
  });

  // Checkboxes
  if (typeof permiso.equipo_aislado_valvula !== "undefined") {
    const cb = document.querySelector("input[name='equipo_aislado_valvula']");
    if (cb) cb.checked = !!permiso.equipo_aislado_valvula;
  }
  if (typeof permiso.equipo_aislado_junta_ciega !== "undefined") {
    const cb = document.querySelector(
      "input[name='equipo_aislado_junta_ciega']"
    );
    if (cb) cb.checked = !!permiso.equipo_aislado_junta_ciega;
  }

  // Inputs tipo texto
  if (permiso.porcentaje_lel !== null) {
    const input = document.querySelector("input[name='porcentaje_lel']");
    if (input) input.value = permiso.porcentaje_lel;
  }
  if (permiso.nh3 !== null) {
    const input = document.querySelector("input[name='nh3']");
    if (input) input.value = permiso.nh3;
  }
  if (permiso.porcentaje_oxigeno !== null) {
    const input = document.querySelector("input[name='porcentaje_oxigeno']");
    if (input) input.value = permiso.porcentaje_oxigeno;
  }
  if (permiso.observaciones_requisitos !== null) {
    const textarea = document.querySelector(
      "textarea[name='observaciones_requisitos']"
    );
    if (textarea) textarea.value = permiso.observaciones_requisitos;
  }
  // Condiciones del proceso
  if (permiso.fluido !== null) {
    const input = document.getElementById("fluid");
    if (input) input.value = permiso.fluido;
  }
  if (permiso.presion !== null) {
    const input = document.getElementById("pressure");
    if (input) input.value = permiso.presion;
  }
  if (permiso.temperatura !== null) {
    const input = document.getElementById("temperature");
    if (input) input.value = permiso.temperatura;
  }
}

// Cuando recibas el objeto permiso:
fetch(`http://localhost:3000/api/pt-confinado/${idPermiso}`)
  .then((resp) => resp.json())
  .then((data) => {
    if (data && data.data) {
      rellenarRequisitosTrabajo(data.data);
      // ...otros rellenos...
    }
  });
