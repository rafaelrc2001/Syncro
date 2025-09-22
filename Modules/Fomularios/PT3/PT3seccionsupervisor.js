// Utilidad para asignar texto en un elemento por id
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "-";
}

// Rellenar datos generales y medidas/requisitos
function rellenarDatosGenerales(data) {
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

// Lógica principal para obtener y rellenar todos los datos
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    fetch(`http://localhost:3000/api/pt-confinado/${idPermiso}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data && data.data) {
          rellenarDatosGenerales(data.data);
          rellenarRequisitosTrabajo(data.data);
          rellenarRequisitosYCondiciones(data.data);
        }
      });

    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
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
  }
});
