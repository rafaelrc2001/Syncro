document.addEventListener("DOMContentLoaded", function () {
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
                <td>${act.acciones_preventivas || act.descripcion || ""}</td>
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
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    // Llamar a la API para obtener los datos del permiso
    fetch(
      `http://localhost:3000/api/verformularios?id=${encodeURIComponent(
        idPermiso
      )}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos recibidos para el permiso:", data);
        // Prefijo en el título
        if (data && data.general) {
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          if (document.getElementById("descripcion-trabajo-label"))
            document.getElementById("descripcion-trabajo-label").textContent =
              data.general.descripcion_trabajo || "-";
          if (document.getElementById("maintenance-type-label"))
            document.getElementById("maintenance-type-label").textContent =
              data.general.tipo_mantenimiento || "-";
          if (document.getElementById("work-order-label"))
            document.getElementById("work-order-label").textContent =
              data.general.ot_numero || "-";
          if (document.getElementById("tag-label"))
            document.getElementById("tag-label").textContent =
              data.general.tag || "-";
          if (document.getElementById("start-time-label"))
            document.getElementById("start-time-label").textContent =
              data.general.hora_inicio || "-";
          if (document.getElementById("equipment-description-label"))
            document.getElementById("equipment-description-label").textContent =
              data.general.descripcion_equipo || "-";
          if (document.getElementById("special-tools-label"))
            document.getElementById("special-tools-label").textContent =
              data.general.requiere_herramientas_especiales || "-";
          if (document.getElementById("adequate-tools-label"))
            document.getElementById("adequate-tools-label").textContent =
              data.general.herramientas_adecuadas || "-";
          if (document.getElementById("pre-verification-label"))
            document.getElementById("pre-verification-label").textContent =
              data.general.requiere_verificacion_previa || "-";
          if (document.getElementById("risk-knowledge-label"))
            document.getElementById("risk-knowledge-label").textContent =
              data.general.requiere_conocer_riesgos || "-";
          if (document.getElementById("final-observations-label"))
            document.getElementById("final-observations-label").textContent =
              data.general.observaciones_medidas || "-";
          // ...agrega aquí más campos si los necesitas...
          // Rellenar requisitos y condiciones del proceso
          if (data && data.general) {
            document.getElementById("resp-fuera-operacion").textContent =
              data.general.fuera_operacion || "-";
            document.getElementById("resp-despresurizado-purgado").textContent =
              data.general.despresurizado_purgado || "-";
            document.getElementById("resp-necesita-aislamiento").textContent =
              data.general.necesita_aislamiento || "-";
            document.getElementById("resp-con-valvulas").textContent =
              data.general.con_valvulas || "-";
            document.getElementById("resp-con-juntas-ciegas").textContent =
              data.general.con_juntas_ciegas || "-";
            document.getElementById("resp-producto-entrampado").textContent =
              data.general.producto_entrampado || "-";
            document.getElementById("resp-requiere-lavado").textContent =
              data.general.requiere_lavado || "-";
            document.getElementById("resp-requiere-neutralizado").textContent =
              data.general.requiere_neutralizado || "-";
            document.getElementById("resp-requiere-vaporizado").textContent =
              data.general.requiere_vaporizado || "-";
            document.getElementById(
              "resp-suspender-trabajos-adyacentes"
            ).textContent = data.general.suspender_trabajos_adyacentes || "-";
            document.getElementById("resp-acordonar-area").textContent =
              data.general.acordonar_area || "-";
            document.getElementById(
              "resp-prueba-gas-toxico-inflamable"
            ).textContent = data.general.prueba_gas_toxico_inflamable || "-";
            document.getElementById(
              "resp-equipo-electrico-desenergizado"
            ).textContent = data.general.equipo_electrico_desenergizado || "-";
            document.getElementById("resp-tapar-purgas-drenajes").textContent =
              data.general.tapar_purgas_drenajes || "-";
            // Condiciones del proceso
            document.getElementById("fluid").textContent =
              data.general.fluido || "-";
            document.getElementById("pressure").textContent =
              data.general.presion || "-";
            document.getElementById("temperature").textContent =
              data.general.temperatura || "-";

            // Requisitos para Administrar los Riesgos
            document.getElementById("resp-special-protection").textContent =
              data.general.proteccion_especial_recomendada || "-";
            document.getElementById("resp-skin-protection").textContent =
              data.general.proteccion_piel_cuerpo || "-";
            document.getElementById("resp-respiratory-protection").textContent =
              data.general.proteccion_respiratoria || "-";
            document.getElementById("resp-eye-protection").textContent =
              data.general.proteccion_ocular || "-";
            document.getElementById("resp-fire-protection").textContent =
              data.general.proteccion_contraincendio || "-";
            document.getElementById("fire-protection-type").textContent =
              data.general.tipo_proteccion_contraincendio || "-";
            document.getElementById("resp-barriers-required").textContent =
              data.general.instalacion_barreras || "-";
            document.getElementById("observations").textContent =
              data.general.observaciones_riesgos || "-";

            // Registro de Pruebas Requeridas
            document.getElementById("valor-co2").textContent =
              data.general.co2_nivel || "-";
            document.getElementById("aprobado-co2").textContent =
              data.general.co2_aprobado || "-";
            document.getElementById("valor-amonico").textContent =
              data.general.nh3_nivel || "-";
            document.getElementById("aprobado-amonico").textContent =
              data.general.nh3_aprobado || "-";
            document.getElementById("valor-oxigeno").textContent =
              data.general.oxigeno_nivel || "-";
            document.getElementById("aprobado-oxigeno").textContent =
              data.general.oxigeno_aprobado || "-";
            document.getElementById("valor-lel").textContent =
              data.general.lel_nivel || "-";
            document.getElementById("aprobado-lel").textContent =
              data.general.lel_aprobado || "-";
          }
        }
        // Campos generales PT2
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

          // Requisitos para Administrar los Riesgos desde data.data
          if (document.getElementById("resp-special-protection"))
            document.getElementById("resp-special-protection").textContent =
              detalles.proteccion_especial_recomendada || "-";
          if (document.getElementById("resp-skin-protection"))
            document.getElementById("resp-skin-protection").textContent =
              detalles.proteccion_piel_cuerpo || "-";
          if (document.getElementById("resp-respiratory-protection"))
            document.getElementById("resp-respiratory-protection").textContent =
              detalles.proteccion_respiratoria || "-";
          if (document.getElementById("resp-eye-protection"))
            document.getElementById("resp-eye-protection").textContent =
              detalles.proteccion_ocular || "-";
          if (document.getElementById("resp-fire-protection"))
            document.getElementById("resp-fire-protection").textContent =
              detalles.proteccion_contraincendio || "-";
          if (document.getElementById("fire-protection-type"))
            document.getElementById("fire-protection-type").textContent =
              detalles.tipo_proteccion_contraincendio || "-";
          if (document.getElementById("resp-barriers-required"))
            document.getElementById("resp-barriers-required").textContent =
              detalles.instalacion_barreras || "-";
          if (document.getElementById("observations"))
            document.getElementById("observations").textContent =
              detalles.observaciones_riesgos || "-";

          // Registro de Pruebas Requeridas desde data.data
          if (document.getElementById("valor-co2"))
            document.getElementById("valor-co2").textContent =
              detalles.co2_nivel || "-";
          if (document.getElementById("valor-amonico"))
            document.getElementById("valor-amonico").textContent =
              detalles.nh3_nivel || "-";
          if (document.getElementById("valor-oxigeno"))
            document.getElementById("valor-oxigeno").textContent =
              detalles.oxigeno_nivel || "-";
          if (document.getElementById("valor-lel"))
            document.getElementById("valor-lel").textContent =
              detalles.lel_nivel || "-";
        }
        // Rellenar AST y Participantes igual que PT1
        if (data && data.ast) {
          mostrarAST(data.ast);
        }
        if (data && data.actividades_ast) {
          mostrarActividadesAST(data.actividades_ast);
        }
        if (data && data.participantes_ast) {
          mostrarParticipantesAST(data.participantes_ast);
        }
      })
      .catch((err) => {
        console.error("Error al obtener datos del permiso:", err);
        alert(
          "Error al obtener datos del permiso. Revisa la consola para más detalles."
        );
      });
  }
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "../../supseguridad/supseguridad.html";
    });
  }
});
