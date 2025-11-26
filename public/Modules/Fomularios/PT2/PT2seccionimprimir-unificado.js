document.addEventListener("DOMContentLoaded", function () {
  // --- INICIALIZACIÓN DE LOGOS ---
  function inicializarLogos() {
    const companyHeader = document.querySelector(".company-header");
    if (companyHeader) {
      const imagenes = companyHeader.querySelectorAll("img");
      imagenes.forEach((img) => {
        img.addEventListener("load", () => {
          console.log(`Logo cargado correctamente: ${img.src}`);
        });
        img.addEventListener("error", () => {
          console.warn(`Error al cargar logo: ${img.src}`);
          img.style.display = "none";
        });
      });
    }
  }

  inicializarLogos();

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
                <td>    </td>
            `;
          tbody.appendChild(tr);
        });
      }
    }
  }

  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");

  const comentarioDiv = document.getElementById("comentarios-permiso");
  if (comentarioDiv && idPermiso) {
    mostrarComentarioSiCorresponde(idPermiso, comentarioDiv);
  }

  if (idPermiso) {
    fetch(`/api/verformularios?id=${encodeURIComponent(idPermiso)}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log("Datos recibidos para el permiso:", data);

        if (data && data.general) {
          document.querySelector(".section-header h3").textContent =
            data.general.prefijo || "NP-XXXXXX";
          document.title =
            "Permiso  Apertura Equipo Línea" +
            (data.general.prefijo ? " - " + data.general.prefijo : "");

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
          if (document.getElementById("what-special-tools-label"))
            document.getElementById("what-special-tools-label").textContent =
              data.general.tipo_herramientas_especiales || "-";
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

          // Datos generales adicionales
          if (document.getElementById("fecha-label"))
            document.getElementById("fecha-label").textContent =
              data.general.fecha || "-";
          if (document.getElementById("activity-type-label"))
            document.getElementById("activity-type-label").textContent =
              data.general.tipo_mantenimiento || "-";
          if (document.getElementById("plant-label"))
            document.getElementById("plant-label").textContent =
              data.general.area || "-";
          if (document.getElementById("empresa-label"))
            document.getElementById("empresa-label").textContent =
              data.general.empresa || "-";
          if (document.getElementById("nombre-solicitante-label"))
            document.getElementById("nombre-solicitante-label").textContent =
              data.general.solicitante || "-";
          if (document.getElementById("sucursal-label"))
            document.getElementById("sucursal-label").textContent =
              data.general.sucursal || "-";
          if (document.getElementById("contrato-label"))
            document.getElementById("contrato-label").textContent =
              data.general.contrato || "-";

          // Sección Equipo
          if (document.getElementById("equipment-intervene-label"))
            document.getElementById("equipment-intervene-label").textContent =
              data.general.tiene_equipo_intervenir ? "SI" : "NO";
          if (document.getElementById("equipment-label"))
            document.getElementById("equipment-label").textContent =
              data.general.tiene_equipo_intervenir || "-";

          // Requisitos de apertura
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

          if (document.getElementById("valor-gas-lel"))
            document.getElementById("valor-gas-lel").textContent =
              data.general.gas_lel || "-";
          if (document.getElementById("valor-gas-co2"))
            document.getElementById("valor-gas-co2").textContent =
              data.general.gas_co2 || "-";
          if (document.getElementById("valor-gas-nh3"))
            document.getElementById("valor-gas-nh3").textContent =
              data.general.gas_nh3 || "-";
          if (document.getElementById("valor-gas-oxigeno"))
            document.getElementById("valor-gas-oxigeno").textContent =
              data.general.gas_oxigeno || "-";

          // Mapeo de los nuevos campos *_nombre para requisitos de apertura
          if (document.getElementById("fuera-operacion-nombre"))
            document.getElementById("fuera-operacion-nombre").textContent =
              data.general.fuera_operacion_nombre || "-";
          if (document.getElementById("despresurizado-purgado-nombre"))
            document.getElementById(
              "despresurizado-purgado-nombre"
            ).textContent = data.general.despresurizado_purgado_nombre || "-";
          if (document.getElementById("necesita-aislamiento-nombre"))
            document.getElementById("necesita-aislamiento-nombre").textContent =
              data.general.necesita_aislamiento_nombre || "-";
          if (document.getElementById("con-valvulas-nombre"))
            document.getElementById("con-valvulas-nombre").textContent =
              data.general.con_valvulas_nombre || "-";
          if (document.getElementById("con-juntas-ciegas-nombre"))
            document.getElementById("con-juntas-ciegas-nombre").textContent =
              data.general.con_juntas_ciegas_nombre || "-";
          if (document.getElementById("producto-entrampado-nombre"))
            document.getElementById("producto-entrampado-nombre").textContent =
              data.general.producto_entrampado_nombre || "-";
          if (document.getElementById("requiere-lavado-nombre"))
            document.getElementById("requiere-lavado-nombre").textContent =
              data.general.requiere_lavado_nombre || "-";
          if (document.getElementById("requiere-neutralizado-nombre"))
            document.getElementById(
              "requiere-neutralizado-nombre"
            ).textContent = data.general.requiere_neutralizado_nombre || "-";
          if (document.getElementById("requiere-vaporizado-nombre"))
            document.getElementById("requiere-vaporizado-nombre").textContent =
              data.general.requiere_vaporizado_nombre || "-";
          if (document.getElementById("suspender-trabajos-adyacentes-nombre"))
            document.getElementById(
              "suspender-trabajos-adyacentes-nombre"
            ).textContent =
              data.general.suspender_trabajos_adyacentes_nombre || "-";
          if (document.getElementById("acordonar-area-nombre"))
            document.getElementById("acordonar-area-nombre").textContent =
              data.general.acordonar_area_nombre || "-";
          if (document.getElementById("prueba-gas-toxico-inflamable-nombre"))
            document.getElementById(
              "prueba-gas-toxico-inflamable-nombre"
            ).textContent =
              data.general.prueba_gas_toxico_inflamable_nombre || "-";
          if (document.getElementById("equipo-electrico-desenergizado-nombre"))
            document.getElementById(
              "equipo-electrico-desenergizado-nombre"
            ).textContent =
              data.general.equipo_electrico_desenergizado_nombre || "-";
          if (document.getElementById("tapar-purgas-drenajes-nombre"))
            document.getElementById(
              "tapar-purgas-drenajes-nombre"
            ).textContent = data.general.tapar_purgas_drenajes_nombre || "-";

          // Administrar riesgos
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

          // Registro de pruebas
          document.getElementById("valor-co2").textContent =
            data.general.co2_nivel || "-";
          document.getElementById("aprobado-co2").textContent =
            data.general.aprobado_co2 || "-";
          document.getElementById("valor-amonico").textContent =
            data.general.nh3_nivel || "-";
          document.getElementById("aprobado-amonico").textContent =
            data.general.aprobado_nh3 || "-";
          document.getElementById("valor-oxigeno").textContent =
            data.general.oxigeno_nivel || "-";
          document.getElementById("aprobado-oxigeno").textContent =
            data.general.aprobado_oxigeno || "-";
          document.getElementById("valor-lel").textContent =
            data.general.lel_nivel || "-";
          document.getElementById("aprobado-lel").textContent =
            data.general.aprobado_lel || "-";

          document.getElementById("nombre-fuera-operacion").textContent =
            data.general.fuera_operacion_nombre || "-";
          document.getElementById("nombre-despresurizado-purgado").textContent =
            data.general.despresurizado_purgado_nombre || "-";
          document.getElementById("nombre-necesita-aislamiento").textContent =
            data.general.necesita_aislamiento_nombre || "-";
          document.getElementById("nombre-con-valvulas").textContent =
            data.general.con_valvulas_nombre || "-";
          document.getElementById("nombre-con-juntas-ciegas").textContent =
            data.general.con_juntas_ciegas_nombre || "-";
          document.getElementById("nombre-producto-entrampado").textContent =
            data.general.producto_entrampado_nombre || "-";
          document.getElementById("nombre-requiere-lavado").textContent =
            data.general.requiere_lavado_nombre || "-";
          document.getElementById("nombre-requiere-neutralizado").textContent =
            data.general.requiere_neutralizado_nombre || "-";
          document.getElementById("nombre-requiere-vaporizado").textContent =
            data.general.requiere_vaporizado_nombre || "-";
          document.getElementById(
            "nombre-suspender-trabajos-adyacentes"
          ).textContent =
            data.general.suspender_trabajos_adyacentes_nombre || "-";
          document.getElementById("nombre-acordonar-area").textContent =
            data.general.acordonar_area_nombre || "-";
          document.getElementById(
            "nombre-prueba-gas-toxico-inflamable"
          ).textContent =
            data.general.prueba_gas_toxico_inflamable_nombre || "-";
          document.getElementById(
            "nombre-equipo-electrico-desenergizado"
          ).textContent =
            data.general.equipo_electrico_desenergizado_nombre || "-";
          document.getElementById("nombre-tapar-purgas-drenajes").textContent =
            data.general.tapar_purgas_drenajes_nombre || "-";

          document.getElementById("valor-gas-lel").textContent =
            data.general.gas_lel || "-";
          document.getElementById("valor-gas-co2").textContent =
            data.general.gas_co2 || "-";
          document.getElementById("valor-gas-nh3").textContent =
            data.general.gas_nh3 || "-";
          document.getElementById("valor-gas-oxigeno").textContent =
            data.general.gas_oxigeno || "-";
        }

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
          if (document.getElementById("what-special-tools-label"))
            document.getElementById("what-special-tools-label").textContent =
              data.general.tipo_herramientas_especiales || "-";
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

    llenarTablaResponsables(idPermiso);
  }

  // Botón salir con detección de página
  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      const currentPage = window.location.pathname;
      let redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";

      if (currentPage.includes("PT2imprimir2.html")) {
        redirectUrl = "/Modules/Usuario/AutorizarPT.html";
      } else if (currentPage.includes("PT2imprimirsup.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (currentPage.includes("PT2imprimirseg.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      }

      window.location.href = redirectUrl;
    });
  }

  // Botón imprimir
  const btnImprimir = document.getElementById("btn-imprimir-permiso");
  if (btnImprimir) {
    btnImprimir.addEventListener("click", function (e) {
      e.preventDefault();
      window.print();
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

  console.log("Funcionalidad de PT2 inicializada correctamente");
});

function llenarTablaResponsables(idPermiso) {
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((response) => response.json())
    .then((result) => {
      const tbody = document.getElementById("modal-ast-responsable-body");
      if (!tbody) return;

      tbody.innerHTML = "";

      if (result.success && result.data) {
        const data = result.data;
        const filas = [
          { nombre: data.responsable_area, cargo: "Responsable de área" },
          { nombre: data.operador_area, cargo: "Operador del área" },
          { nombre: data.nombre_supervisor, cargo: "Supervisor de Seguridad" },
        ];

        let hayAlMenosUno = false;
        filas.forEach((fila) => {
          const nombre =
            fila.nombre && fila.nombre.trim() !== "" ? fila.nombre : "N/A";
          if (nombre !== "N/A") hayAlMenosUno = true;
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${nombre}</td>
            <td>${fila.cargo}</td>
            <td></td>
          `;
          tbody.appendChild(tr);
        });

        if (!hayAlMenosUno) {
          tbody.innerHTML = `<tr><td colspan="3">Sin responsables registrados</td></tr>`;
        }
      } else {
        tbody.innerHTML = `<tr><td colspan="3">Sin responsables registrados</td></tr>`;
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}
