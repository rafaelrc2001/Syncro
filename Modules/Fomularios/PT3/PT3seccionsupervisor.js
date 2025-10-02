// Mostrar nombres de responsable y operador del área en la sección de aprobaciones
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (!idPermiso) return;
  fetch(`http://localhost:3000/api/autorizaciones/personas/${idPermiso}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.success && data.data) {
        const responsable = document.getElementById("nombre-responsable-area");
        const operador = document.getElementById("nombre-operador-area");
        if (responsable)
          responsable.textContent = data.data.responsable_area || "-";
        if (operador) operador.textContent = data.data.operador_area || "-";
      }
    })
    .catch((err) => {
      console.error("Error al obtener responsables de área:", err);
    });
});

// Funciones para manejar el cambio de supervisor y categoría (evita error de referencia)
function actualizarAprobador(value) {
  // Puedes agregar lógica aquí si lo necesitas
}
function actualizarAprobador2(value) {
  // Puedes agregar lógica aquí si lo necesitas
}

// Utilidad para asignar texto
function setText(id, value) {
  const el = document.getElementById(id);
  console.log(`setText: id="${id}", value="${value}", element found:`, !!el);
  if (el) {
    el.textContent = value || "-";
    console.log(`setText: Asignado "${value || "-"}" a elemento "${id}"`);
  } else {
    console.warn(`setText: No se encontró elemento con ID "${id}"`);
  }
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

// Función para rellenar requisitos de trabajo con radios, checkboxes e inputs
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
      // Primero llenar los spans de solo lectura
      const span = document.getElementById(name);
      if (span) span.textContent = permiso[name] || "-";

      // Luego marcar los radios si existen
      const radio = document.querySelector(
        `input[name='${name}'][value='${permiso[name]}']`
      );
      if (radio) {
        radio.checked = true;
        console.log(`Radio ${name} marcado con valor: ${permiso[name]}`);
      }
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

  // Inputs tipo texto y spans de solo lectura
  if (permiso.porcentaje_lel !== null) {
    setText("porcentaje_lel", permiso.porcentaje_lel);
    const input = document.querySelector("input[name='porcentaje_lel']");
    if (input) input.value = permiso.porcentaje_lel;
  }
  if (permiso.nh3 !== null) {
    setText("nh3", permiso.nh3);
    const input = document.querySelector("input[name='nh3']");
    if (input) input.value = permiso.nh3;
  }
  if (permiso.porcentaje_oxigeno !== null) {
    setText("porcentaje_oxigeno", permiso.porcentaje_oxigeno);
    const input = document.querySelector("input[name='porcentaje_oxigeno']");
    if (input) input.value = permiso.porcentaje_oxigeno;
  }
  if (permiso.observaciones_requisitos !== null) {
    setText("observaciones_requisitos", permiso.observaciones_requisitos);
    const textarea = document.querySelector(
      "textarea[name='observaciones_requisitos']"
    );
    if (textarea) textarea.value = permiso.observaciones_requisitos;
  }
  // Condiciones del proceso
  if (permiso.fluido !== null) {
    setText("fluid", permiso.fluido);
    const input = document.getElementById("fluid");
    if (input) input.value = permiso.fluido;
  }
  if (permiso.presion !== null) {
    setText("pressure", permiso.presion);
    const input = document.getElementById("pressure");
    if (input) input.value = permiso.presion;
  }
  if (permiso.temperatura !== null) {
    setText("temperature", permiso.temperatura);
    const input = document.getElementById("temperature");
    if (input) input.value = permiso.temperatura;
  }
}

// FUNCIONES PARA RELLENAR AST Y PARTICIPANTES
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

// Lógica para rellenar supervisores y categorías en los select
function rellenarSupervisoresYCategorias() {
  // Ejemplo: consulta al backend para obtener supervisores y categorías
  fetch("http://localhost:3000/api/supervisores")
    .then((resp) => resp.json())
    .then((data) => {
      const selectSupervisor = document.getElementById("responsable-aprobador");
      if (selectSupervisor) {
        selectSupervisor.innerHTML =
          '<option value="" disabled selected>Seleccione un supervisor...</option>';
        // Si data es un array plano
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

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOMContentLoaded - Iniciando script PT3seccionsupervisor.js");

  // --- Lógica para el botón "Autorizar" ---
  const btnAutorizar = document.getElementById("btn-guardar-campos");
  if (btnAutorizar) {
    btnAutorizar.addEventListener("click", async function () {
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!supervisor) {
        alert("Debes seleccionar el supervisor.");
        return;
      }
      // 1. Actualizar supervisor y categoría en autorizaciones
      try {
        await fetch(
          "http://localhost:3000/api/autorizaciones/supervisor-categoria",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_permiso: idPermiso,
              supervisor,
              categoria,
            }),
          }
        );
      } catch (err) {
        console.error("Error al actualizar supervisor y categoría:", err);
      }

      // 1.5 Actualizar requisitos de riesgos y pruebas de gas
      // Obtener valores del formulario

      // 1.5 Actualizar requisitos de riesgos y pruebas de gas
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

      const proteccion_piel_cuerpo = getRadioValue("proteccion_piel_cuerpo");
      const proteccion_piel_detalle = getInputValue(
        "detalle_proteccion_piel_cuerpo"
      );

      const proteccion_respiratoria = getRadioValue("proteccion_respiratoria");
      const proteccion_respiratoria_detalle = getInputValue(
        "detalle_proteccion_respiratoria"
      );

      const proteccion_ocular = getRadioValue("proteccion_ocular");
      const proteccion_ocular_detalle = getInputValue(
        "detalle_proteccion_ocular"
      );

      const arnes_seguridad = getRadioValue("arnes_seguridad");
      const cable_vida = getRadioValue("cable_vida");

      const ventilacion_forzada_opcion = getRadioValue("ventilacion_forzada");
      const ventilacion_forzada_detalle = getInputValue(
        "detalle_ventilacion_forzada"
      );

      const iluminacion_explosion = getRadioValue("iluminacion_explosion");
      const vigilancia_exterior_opcion = getRadioValue("vigilancia_exterior");

      // Prueba de gas
      const prueba_gas_aprobado = ""; // Si tienes un radio general para esto, mapea aquí

      const param_co2 = getRadioValue("co2_aprobado");
      const valor_co2 = getInputValue("co2_valor");

      const param_amoniaco = getRadioValue("amniaco_aprobado");
      const valor_amoniaco = getInputValue("amniaco_valor");

      const param_oxigeno = getRadioValue("oxigeno_aprobado");
      const valor_oxigeno = getInputValue("oxigeno_valor");

      const param_explosividad_lel = getRadioValue("lel_aprobado");
      const valor_explosividad_lel = getInputValue("lel_valor");

      const param_otro = getRadioValue("otro_aprobado");
      const param_otro_detalle = ""; // Si tienes un input para detalle de otro parámetro
      const valor_otro = getInputValue("otro_valor");

      const observaciones = getInputValue("observaciones_gas");

      try {
        // --- DEBUG: Mostrar payload enviado al backend ---
        const payloadSupervisor = {
          proteccion_piel_cuerpo,
          proteccion_piel_detalle,
          proteccion_respiratoria,
          proteccion_respiratoria_detalle,
          proteccion_ocular,
          proteccion_ocular_detalle,
          arnes_seguridad,
          cable_vida,
          ventilacion_forzada_opcion,
          ventilacion_forzada_detalle,
          iluminacion_explosion,
          prueba_gas_aprobado,
          param_co2,
          valor_co2,
          param_amoniaco,
          valor_amoniaco,
          param_oxigeno,
          valor_oxigeno,
          param_explosividad_lel,
          valor_explosividad_lel,
          param_otro,
          param_otro_detalle,
          valor_otro,
          observaciones,
          vigilancia_exterior_opcion,
        };
        console.log(
          "Payload enviado a /pt-confinado/requisitos_supervisor:",
          payloadSupervisor
        );
        await fetch(
          `http://localhost:3000/api/requisitos_supervisor/${idPermiso}`,

          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadSupervisor),
          }
        );
      } catch (err) {
        console.error(
          "Error al actualizar requisitos supervisor y pruebas:",
          err
        );
      }

      // 2. Consultar el id_estatus desde permisos_trabajo
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
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }
      // 3. Actualizar el estatus a "activo"
      if (idEstatus) {
        try {
          await fetch("http://localhost:3000/api/estatus/activo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_estatus: idEstatus }),
          });
        } catch (err) {
          console.error("Error al actualizar estatus activo:", err);
        }
      }
      alert("Permiso autorizado correctamente");
      window.location.href = "/Modules/SupSeguridad/supseguridad.html";
    });
  }

  //
  //
  // ACA TERMINA LA LOGICA DEL BOTON AUTORIZAR
  //
  //

  // --- Lógica para el botón "Salir" ---
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/SupSeguridad/supseguridad.html";
    });
  }
  // --- Lógica para el botón "No Autorizar" ---
  const btnNoAutorizar = document.getElementById("btn-no-autorizar");
  if (btnNoAutorizar) {
    btnNoAutorizar.addEventListener("click", async function () {
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id") || window.idPermisoActual;
      const responsableInput = document.getElementById("responsable-aprobador");
      const operadorInput = document.getElementById("responsable-aprobador2");
      const supervisor = responsableInput ? responsableInput.value.trim() : "";
      const categoria = operadorInput ? operadorInput.value.trim() : "";
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      if (!supervisor) {
        alert("Debes seleccionar el supervisor antes de rechazar.");
        return;
      }
      // Mostrar el modal para capturar el comentario de rechazo
      const modal = document.getElementById("modalComentario");
      if (modal) {
        modal.style.display = "flex";
        document.getElementById("comentarioNoAutorizar").value = "";
      }

      // Lógica para guardar el comentario y actualizar estatus a No Autorizado
      const btnGuardarComentario = document.getElementById(
        "btnGuardarComentario"
      );
      if (btnGuardarComentario) {
        btnGuardarComentario.onclick = async function () {
          const comentario = document
            .getElementById("comentarioNoAutorizar")
            .value.trim();
          if (!comentario) {
            alert("Debes escribir un motivo de rechazo.");
            return;
          }
          // 1. Actualizar supervisor y categoría en autorizaciones
          try {
            await fetch(
              "http://localhost:3000/api/autorizaciones/supervisor-categoria",
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id_permiso: idPermiso,
                  supervisor,
                  categoria,
                  comentario_no_autorizar: comentario,
                }),
              }
            );
          } catch (err) {
            console.error("Error al actualizar supervisor y categoría:", err);
          }
          // 2. Consultar el id_estatus desde permisos_trabajo
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
          } catch (err) {
            console.error("Error al consultar id_estatus:", err);
          }
          // 3. Actualizar el estatus a "no autorizado" y guardar el comentario en la tabla estatus
          if (idEstatus) {
            try {
              await fetch("http://localhost:3000/api/estatus/no_autorizado", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_estatus: idEstatus }),
              });
              // Guardar el comentario en la tabla estatus
              await fetch("http://localhost:3000/api/estatus/comentario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_estatus: idEstatus, comentario }),
              });
            } catch (err) {
              console.error("Error al actualizar estatus no autorizado:", err);
            }
          }
          // 4. Cerrar el modal y mostrar mensaje de éxito
          const modal = document.getElementById("modalComentario");
          if (modal) modal.style.display = "none";
          alert("Permiso no autorizado correctamente");
          window.location.href = "/Modules/SupSeguridad/supseguridad.html";
        };
      }
      // Lógica para cerrar/cancelar el modal
      const btnCancelarComentario = document.getElementById(
        "btnCancelarComentario"
      );
      if (btnCancelarComentario) {
        btnCancelarComentario.onclick = function () {
          const modal = document.getElementById("modalComentario");
          if (modal) modal.style.display = "none";
        };
      }
    });
  }

  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");

  console.log("URL actual:", window.location.href);
  console.log("Parámetros de URL:", window.location.search);
  console.log("ID extraído:", idPermiso);

  if (idPermiso) {
    console.log("Consultando permiso con ID:", idPermiso);

    // Obtener datos generales del permiso
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Respuesta de verformularios:", data);

        // Prefijo en el título
        if (data && data.general && document.getElementById("prefijo-label")) {
          document.getElementById("prefijo-label").textContent =
            data.general.prefijo || "-";
        }

        // Rellenar datos generales si existen
        if (data && data.general) {
          console.log("📊 Rellenando datos generales:", data.general);
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
        } else {
          console.warn("⚠️ No se encontraron datos generales en la respuesta");
        }

        // Rellenar medidas/requisitos usando data.data
        if (data && data.data) {
          rellenarMedidasRequisitos(data.data);
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
      })
      .catch((err) => {
        console.error(
          "Error al obtener datos del permiso verformularios:",
          err
        );
      });

    // Obtener datos específicos del PT3 confinado
    fetch(`http://localhost:3000/api/pt-confinado/${idPermiso}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Respuesta de pt-confinado:", data);
        if (data && data.data) {
          const permiso = data.data;
          console.log("Datos del permiso PT3:", permiso);

          // Rellenar todos los campos de requisitos de trabajo
          rellenarRequisitosTrabajo(permiso);

          // Rellenar todos los campos específicos de medidas/requisitos
          const campos = [
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
          ];

          campos.forEach((campo) => {
            setText(campo, permiso[campo]);
          });

          console.log("Todos los campos han sido rellenados correctamente");
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso pt-confinado:", err);
      });
  }
  rellenarSupervisoresYCategorias();
});
