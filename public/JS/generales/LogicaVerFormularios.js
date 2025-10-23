// Agrega la función mostrarInformacionGeneral para evitar el ReferenceError
function mostrarInformacionGeneral(general) {
  // Ejemplo de llenado de campos generales en el modal
  document.getElementById("modal-tipo-permiso").textContent =
    general.tipo_permiso || "";
  document.getElementById("modal-prefijo").textContent = general.prefijo || "";
  if (document.getElementById("info-fecha")) {
    document.getElementById("info-fecha").textContent = general.fecha || "";
  }
  if (document.getElementById("info-empresa")) {
    document.getElementById("info-empresa").textContent = general.empresa || "";
  }
  if (document.getElementById("info-sucursal")) {
    document.getElementById("info-sucursal").textContent =
      general.sucursal || "";
  }
  if (document.getElementById("ver-departamento")) {
    document.getElementById("ver-departamento").textContent =
      general.departamento || "";
  }
  if (document.getElementById("info-solicitante")) {
    document.getElementById("info-solicitante").textContent =
      general.solicitante || "";
  }
  if (document.getElementById("info-descripcion")) {
    document.getElementById("info-descripcion").textContent =
      general.descripcion_trabajo || general.descripcion || "";
  }
  // Mostrar el número de contrato si existe
  if (document.getElementById("info-contrato")) {
    document.getElementById("info-contrato").textContent =
      general.contrato && general.contrato.trim() !== ""
        ? general.contrato
        : "sin contrato especial";
  }
  // Agrega los demás campos según sus IDs:
  document.querySelector(".executive-item .highlight").textContent =
    general.fecha || "";
  // Y así para empresa, sucursal, solicitante, descripción, etc.
}

// Lógica reutilizable para ver formularios

function mostrarDetallesTecnicos(detalles) {
  document.getElementById("modal-planta").textContent = detalles.planta || "";
  document.getElementById("modal-tipo-actividad").textContent =
    detalles.tipo_actividad || "";
  document.getElementById("modal-ot").textContent = detalles.ot || "";
  document.getElementById("modal-equipo").textContent = detalles.equipo || "";
  document.getElementById("modal-tag").textContent = detalles.tag || "";
  document.getElementById("modal-horario").textContent = detalles.horario || "";
  //  document.getElementById("modal-fluido").textContent = detalles.fluido || "";
  //  document.getElementById("modal-presion").textContent = detalles.presion || "";
  // document.getElementById("modal-temperatura").textContent =
  //detalles.temperatura || "";
  //  document.getElementById("modal-trabajo-area-riesgo-controlado").textContent =
  //  detalles.trabajo_area_riesgo_controlado || "";
  //  document.getElementById("modal-necesita-entrega-fisica").textContent =
  //  detalles.necesita_entrega_fisica || "";
  //document.getElementById("modal-necesita-ppe-adicional").textContent =
  //  detalles.necesita_ppe_adicional || "";
  // document.getElementById("modal-area-circundante-riesgo").textContent =
  // detalles.area_circundante_riesgo || "";
  //document.getElementById("modal-necesita-supervision").textContent =
  // detalles.necesita_supervision || "";
  //document.getElementById("modal-observaciones-analisis-previo").textContent =
  //  detalles.observaciones_analisis_previo || "";
}

function mostrarAST(ast) {
  // EPP
  const eppList = document.getElementById("modal-epp-list");
  eppList.innerHTML = "";
  if (ast.epp_requerido) {
    ast.epp_requerido.split(",").forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.trim();
      eppList.appendChild(li);
    });
  }
  // Maquinaria
  const maqList = document.getElementById("modal-maquinaria-list");
  maqList.innerHTML = "";
  if (ast.maquinaria_herramientas) {
    ast.maquinaria_herramientas.split(",").forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.trim();
      maqList.appendChild(li);
    });
  }
  // Materiales
  const matList = document.getElementById("modal-materiales-list");
  matList.innerHTML = "";
  if (ast.material_accesorios) {
    ast.material_accesorios.split(",").forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.trim();
      matList.appendChild(li);
    });
  }
}

function mostrarActividadesAST(actividades) {
  const tbody = document.getElementById("modal-ast-actividades-body");
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

function mostrarParticipantesAST(participantes) {
  const tbody = document.getElementById("modal-ast-participantes-body");
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

// --- Tabla de permisos ---
function asignarEventosVer() {
  document.querySelectorAll(".action-btn.view").forEach((btn) => {
    btn.addEventListener("click", async function () {
      document.getElementById("modalVer").classList.add("active");
      // Obtener el id_permiso del atributo data-idpermiso
      const id_permiso = this.getAttribute("data-idpermiso");
      window.idPermisoActual = id_permiso;
      console.log("ID del permiso:", id_permiso);
      try {
        // Llamar al endpoint para obtener los datos de la sección 1, 2, AST, actividades AST y participantes AST
        const response = await fetch(
          `/api/verformularios?id=${encodeURIComponent(
            id_permiso
          )}`
        );
        if (!response.ok) throw new Error("Error al obtener datos del permiso");
        const data = await response.json();
        // Mostrar los datos en consola
        console.log("Datos sección 1:", data.general);
        console.log("Datos sección 2:", data.detalles);
        console.log("Datos AST:", data.ast);
        console.log("Actividades AST:", data.actividades_ast);
        console.log("Participantes AST:", data.participantes_ast);
        console.log("Respuesta completa del backend:", data);
        mostrarInformacionGeneral(data.general);
        // Si es PT No Peligroso, solo mostrar el render personalizado y limpiar detalles
        if (data.general.tipo_permiso === "PT No Peligroso") {
          document.getElementById("modal-especifica").innerHTML =
            window.renderNoPeligroso
              ? window.renderNoPeligroso(data.general)
              : "";
          // Limpiar detalles técnicos y otros contenedores si existen
          if (document.getElementById("modal-apertura-area-visual"))
            document.getElementById("modal-apertura-area-visual").innerHTML =
              "";
          if (document.getElementById("contenedor-apertura-supervisor"))
            document.getElementById(
              "contenedor-apertura-supervisor"
            ).innerHTML = "";
        } else {
          mostrarDetallesTecnicos(data.detalles);
          setTimeout(() => {
            mostrarAST(data.ast);
            mostrarActividadesAST(data.actividades_ast);
            mostrarParticipantesAST(data.participantes_ast);
          }, 100);
          // Renderizar apertura si corresponde
          if (data.general.tipo_permiso === "PT para Apertura Equipo Línea") {
            document.getElementById("modal-especifica").innerHTML =
              renderApertura(data.general);
            document.getElementById("modal-apertura-area-visual").innerHTML =
              renderAperturaAreaVisual(data.general);
            document.getElementById(
              "contenedor-apertura-supervisor"
            ).innerHTML = renderAperturaSupervisorVisual(
              mapSupervisorFields(data.general)
            );
          } else {
            document.getElementById("modal-especifica").innerHTML = "";
            if (document.getElementById("modal-apertura-area-visual"))
              document.getElementById("modal-apertura-area-visual").innerHTML =
                "";
            if (document.getElementById("contenedor-apertura-supervisor"))
              document.getElementById(
                "contenedor-apertura-supervisor"
              ).innerHTML = "";
          }
        }
        // Render del comentario SIEMPRE, para cualquier tipo de permiso
        document.getElementById("contenedor-comentario").innerHTML =
          renderComentario(data.general.comentario);
      } catch (err) {
        console.error(
          "Error al obtener datos de la sección 1, 2, AST, actividades AST y participantes AST:",
          err
        );
      }
    });
  });
}

import {
  renderApertura,
  renderAperturaAreaVisual,
  renderAperturaSupervisorVisual,
} from "./render_pt_apertura.js";
import { renderComentario } from "./render_comentario_firmas.js";
export {
  mostrarDetallesTecnicos,
  mostrarAST,
  mostrarActividadesAST,
  mostrarParticipantesAST,
  mostrarInformacionGeneral,
  asignarEventosVer,
  renderApertura,
};

function mapSupervisorFields(general) {
  return {
    "special-protection": general.proteccion_especial_recomendada,
    "skin-protection": general.proteccion_piel_cuerpo,
    "respiratory-protection": general.proteccion_respiratoria,
    "eye-protection": general.proteccion_ocular,
    "fire-protection": general.proteccion_contraincendio,
    "fire-protection-type": general.tipo_proteccion_contraincendio,
    "barriers-required": general.instalacion_barreras,
    observations: general.observaciones_riesgos,
    "co2-level": general.co2_nivel,
    "nh3-level": general.nh3_nivel,
    "oxygen-level": general.oxigeno_nivel,
    "lel-level": general.lel_nivel,
  };
}

// Debugging: Verificar elementos del DOM
console.log("eppList:", document.getElementById("modal-epp-list"));
console.log("maqList:", document.getElementById("modal-maquinaria-list"));
console.log("matList:", document.getElementById("modal-materiales-list"));
console.log(
  "tbody actividades:",
  document.getElementById("modal-ast-actividades-body")
);
console.log(
  "tbody participantes:",
  document.getElementById("modal-ast-participantes-body")
);
