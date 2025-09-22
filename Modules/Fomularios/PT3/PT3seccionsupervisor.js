// Funciones para manejar el cambio de supervisor y categoría (evita error de referencia)
function actualizarAprobador(value) {
  // Puedes agregar lógica aquí si lo necesitas
}
function actualizarAprobador2(value) {
  // Puedes agregar lógica aquí si lo necesitas
}
// Utilidad para asignar texto en un elemento por id
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "-";
}

// Rellenar datos generales y medidas/requisitos
function rellenarDatosGenerales(data) {
  setText("prefijo-label", data.prefijo);
  setText("descripcion-trabajo-label", data.descripcion_trabajo);
  setText("maintenance-type-label", data.tipo_mantenimiento);
  setText("work-order-label", data.ot_numero);
  setText("tag-label", data.tag);
  setText("start-time-label", data.hora_inicio);
  setText("equipment-description-label", data.descripcion_equipo);
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

// Rellenar requisitos de trabajo (tabla de análisis de requisitos)
function rellenarRequisitosTrabajo(permiso) {
  setText("verificar_explosividad", permiso.verificar_explosividad);
  setText("verificar_gas_toxico", permiso.verificar_gas_toxico);
  setText(
    "verificar_deficiencia_oxigeno",
    permiso.verificar_deficiencia_oxigeno
  );
  setText(
    "verificar_enriquecimiento_oxigeno",
    permiso.verificar_enriquecimiento_oxigeno
  );
  setText("verificar_polvo_humos_fibras", permiso.verificar_polvo_humos_fibras);
  setText("verificar_amoniaco", permiso.verificar_amoniaco);
  setText("verificar_material_piel", permiso.verificar_material_piel);
  setText("verificar_temperatura", permiso.verificar_temperatura);
  setText("verificar_lel", permiso.verificar_lel);
  setText(
    "suspender_trabajos_adyacentes",
    permiso.suspender_trabajos_adyacentes
  );
  setText("acordonar_area", permiso.acordonar_area);
  setText("prueba_gas_toxico_inflamable", permiso.prueba_gas_toxico_inflamable);
  setText("porcentaje_lel", permiso.porcentaje_lel);
  setText("nh3", permiso.nh3);
  setText("porcentaje_oxigeno", permiso.porcentaje_oxigeno);
  setText(
    "equipo_despresionado_fuera_operacion",
    permiso.equipo_despresionado_fuera_operacion
  );
  setText("equipo_aislado", permiso.equipo_aislado);
  setText("equipo_lavado", permiso.equipo_lavado);
  setText("equipo_neutralizado", permiso.equipo_neutralizado);
  setText("equipo_vaporizado", permiso.equipo_vaporizado);
  setText("aislar_purgas_drenaje_venteo", permiso.aislar_purgas_drenaje_venteo);
  setText("abrir_registros_necesarios", permiso.abrir_registros_necesarios);
  setText("observaciones_requisitos", permiso.observaciones_requisitos);
  // Condiciones del proceso
  setText("fluid", permiso.fluido);
  setText("pressure", permiso.presion);
  setText("temperature", permiso.temperatura);
}

// Rellenar AST (Análisis de Seguridad en el Trabajo)
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

// Rellenar actividades AST
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

// Rellenar participantes AST
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

// Rellenar requisitos y condiciones del proceso
function rellenarRequisitosYCondiciones(permiso) {
  setText("verificar_explosividad", permiso.verificar_explosividad);
  setText("verificar_gas_toxico", permiso.verificar_gas_toxico);
  setText(
    "verificar_deficiencia_oxigeno",
    permiso.verificar_deficiencia_oxigeno
  );
  setText(
    "verificar_enriquecimiento_oxigeno",
    permiso.verificar_enriquecimiento_oxigeno
  );
  setText("verificar_polvo_humos_fibras", permiso.verificar_polvo_humos_fibras);
  setText("verificar_amoniaco", permiso.verificar_amoniaco);
  setText("verificar_material_piel", permiso.verificar_material_piel);
  setText("verificar_temperatura", permiso.verificar_temperatura);
  setText("verificar_lel", permiso.verificar_lel);
  setText(
    "suspender_trabajos_adyacentes",
    permiso.suspender_trabajos_adyacentes
  );
  setText("acordonar_area", permiso.acordonar_area);
  setText("prueba_gas_toxico_inflamable", permiso.prueba_gas_toxico_inflamable);
  setText("porcentaje_lel", permiso.porcentaje_lel);
  setText("nh3", permiso.nh3);
  setText("porcentaje_oxigeno", permiso.porcentaje_oxigeno);
  setText(
    "equipo_despresionado_fuera_operacion",
    permiso.equipo_despresionado_fuera_operacion
  );
  setText("equipo_aislado", permiso.equipo_aislado);
  setText("equipo_lavado", permiso.equipo_lavado);
  setText("equipo_neutralizado", permiso.equipo_neutralizado);
  setText("equipo_vaporizado", permiso.equipo_vaporizado);
  setText("aislar_purgas_drenaje_venteo", permiso.aislar_purgas_drenaje_venteo);
  setText("abrir_registros_necesarios", permiso.abrir_registros_necesarios);
  setText("observaciones_requisitos", permiso.observaciones_requisitos);
  setText("fluid", permiso.fluido);
  setText("pressure", permiso.presion);
  setText("temperature", permiso.temperatura);
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
  // --- Lógica para el botón "Autorizar" ---
  // --- Lógica para el botón "Autorizar" ---
  // --- Lógica para el botón "Autorizar" ---
  // --- Lógica para el botón "Autorizar" ---
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
  if (idPermiso) {
    // Obtener datos generales y prefijo
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
          rellenarDatosGenerales(data.general);
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

    // Obtener datos específicos del permiso para otros campos
    fetch(`http://localhost:3000/api/pt-confinado/${idPermiso}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data && data.data) {
          rellenarDatosGenerales(data.data);
          rellenarRequisitosTrabajo(data.data);
          rellenarRequisitosYCondiciones(data.data);
        }
      });
  }
  rellenarSupervisoresYCategorias();
});
