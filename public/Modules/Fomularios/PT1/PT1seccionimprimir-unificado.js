// Ejecutar consulta automática al cargar si hay id en la URL
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idPermiso = params.get("id");
  if (idPermiso) {
    consultarTodoPermiso(idPermiso).then((resultado) => {
      // Mostrar permisos según los valores columna_*_valor
      if (resultado && resultado.permiso && resultado.permiso.data) {
        mostrarPermisosSegunValores(resultado.permiso.data);
      }
    });
    // Llenar la tabla de responsables
    llenarTablaResponsables(idPermiso);
  }
});

// Función para mostrar/ocultar permisos según los valores columna_*_valor
function mostrarPermisosSegunValores(data) {
  // Mapeo de id de contenedor y campo de valor
   const permisos = [
    { id: "permiso-altura", valor: data.columna_altura_valor, nombre: "Permiso de Altura" },
    { id: "permiso-confinado", valor: data.columna_confinado_valor, nombre: "Permiso Espacio Confinado" },
    { id: "permiso-fuego", valor: data.columna_fuego_valor, nombre: "Permiso de Fuego" },
    { id: "permiso-apertura", valor: data.columna_apertura_valor, nombre: "Permiso de Apertura" },
    { id: "permiso-nopeligroso", valor: data.columna_nopeligrosovalor_valor, nombre: "Permiso No Peligroso" },
  ];
  permisos.forEach((permiso) => {
    const contenedor = document.getElementById(permiso.id);
    if (contenedor) {
      if (permiso.valor === "SI") {
        contenedor.style.display = "";
      } else {
        contenedor.style.display = "none";
      }
    }
  });
}
// Consulta todos los datos de un permiso y relacionados por id_permiso
async function consultarTodoPermiso(id_permiso) {
    // Mapear prefijo al encabezado NP-XXXXXX
  
  const permiso = await fetch(`/api/permiso?id_permiso=${id_permiso}`).then(r => r.json()).catch(() => null);
  const participan = await fetch(`/api/ast_participan?id_permiso=${id_permiso}`).then(r => r.json()).catch(() => null);
  const actividades = await fetch(`/api/ast_actividades?id_permiso=${id_permiso}`).then(r => r.json()).catch(() => null);
  const autorizaciones = await fetch(`/api/autorizaciones?id_permiso=${id_permiso}`).then(r => r.json()).catch(() => null);
  const resultado = { permiso, participan, actividades, autorizaciones };
  // Mapeo de datos al HTML
  console.log('OBJETO DEVUELTO POR LA CONSULTA:', permiso);
  if (permiso && permiso.data) {
    const d = permiso.data;
    // Fecha (formato legible)
    const fechaLabel = document.getElementById("fecha-label");
    if(fechaLabel) {
      let fecha = "-";
      if (d.fecha_hora) {
        const f = new Date(d.fecha_hora);
        if (!isNaN(f.getTime())) {
          fecha = f.toLocaleDateString('es-MX');
        }
      }
      fechaLabel.textContent = fecha;
    }
    
    

      const npHeader = document.getElementById("np-header");
    if (npHeader && d.prefijo) {
      npHeader.textContent = d.prefijo;
    }

    const startTimeLabel = document.getElementById("start-time-label");
    if(startTimeLabel) startTimeLabel.textContent = d.hora_inicio || "-";
    const empresaLabel = document.getElementById("empresa-label");
    if(empresaLabel) empresaLabel.textContent = d.empresa || "-";
    const sucursalLabel = document.getElementById("sucursal-label");
    if(sucursalLabel) sucursalLabel.textContent = d.nombre_sucursal_id  || "-";
    const dptoContrato = document.getElementById("dpto-contrato");
    if(dptoContrato) dptoContrato.textContent = d.nombre_departamento || d.contratista || d.id_departamento || "-";
    const plantLabel = document.getElementById("plant-label");
    if(plantLabel) plantLabel.textContent =  d.nombre_departamento_id ||   "-";
    const ubicacionLabel = document.getElementById("ubicacion");
    if(ubicacionLabel) ubicacionLabel.textContent = d.nombre_area_id  || "-";
    const responsableTrabajoLabel = document.getElementById("responsable-trabajo-label");
    if(responsableTrabajoLabel) responsableTrabajoLabel.textContent = d.nombre_solicitante || "-";
    const descripcionTrabajoLabel = document.getElementById("descripcion-trabajo-label");
    if(descripcionTrabajoLabel) descripcionTrabajoLabel.textContent = d.descripcion_trabajo || "-";
    const activityTypeLabel = document.getElementById("activity-type-label");
    if(activityTypeLabel) activityTypeLabel.textContent = d.tipo_mantenimiento || "-";
    const workOrderLabel = document.getElementById("work-order-label");
    if(workOrderLabel) workOrderLabel.textContent = d.ot_numero || "-";
    const contratoLabel = document.getElementById("contrato-label");
    if(contratoLabel) contratoLabel.textContent = d.contrato || "-";
    const tagLabel = document.getElementById("tag-label");
    if(tagLabel) tagLabel.textContent = d.tag || "-";
    const equipmentLabel = document.getElementById("equipment-label");
    if(equipmentLabel) equipmentLabel.textContent = d.equipo_intervenir || "-";

    // Mapeo explícito de campos especiales por id
    const pal_cr_1 = document.getElementById("pal_cr_1");
    if(pal_cr_1) pal_cr_1.textContent = d.pal_cr_1 || "-";
    const pal_epc_1 = document.getElementById("pal_epc_1");
    if(pal_epc_1) pal_epc_1.textContent = d.pal_epc_1 || "-";
    const pal_epc_2 = document.getElementById("pal_epc_2");
    if(pal_epc_2) pal_epc_2.textContent = d.pal_epc_2 || "-";
    const pal_epp_1 = document.getElementById("pal_epp_1");
    if(pal_epp_1) pal_epp_1.textContent = d.pal_epp_1 || "-";
    const pal_epp_2 = document.getElementById("pal_epp_2");
    if(pal_epp_2) pal_epp_2.textContent = d.pal_epp_2 || "-";
    const pal_fa_1 = document.getElementById("pal_fa_1");
    if(pal_fa_1) pal_fa_1.textContent = d.pal_fa_1 || "-";
    const pal_fa_2 = document.getElementById("pal_fa_2");
    if(pal_fa_2) pal_fa_2.textContent = d.pal_fa_2 || "-";
    const pap_ce_1 = document.getElementById("pap_ce_1");
    if(pap_ce_1) pap_ce_1.textContent = d.pap_ce_1 || "-";
    const pap_ce_2 = document.getElementById("pap_ce_2");
    if(pap_ce_2) pap_ce_2.textContent = d.pap_ce_2 || "-";
    const pap_epe_1 = document.getElementById("pap_epe_1");
    if(pap_epe_1) pap_epe_1.textContent = d.pap_epe_1 || "-";
    const pco_eh_1 = document.getElementById("pco_eh_1");
    if(pco_eh_1) pco_eh_1.textContent = d.pco_eh_1 || "-";
    const pco_era_1 = document.getElementById("pco_era_1");
    if(pco_era_1) pco_era_1.textContent = d.pco_era_1 || "-";
    const pco_ma_1 = document.getElementById("pco_ma_1");
    if(pco_ma_1) pco_ma_1.textContent = d.pco_ma_1 || "-";
    const pco_ma_2 = document.getElementById("pco_ma_2");
    if(pco_ma_2) pco_ma_2.textContent = d.pco_ma_2 || "-";
    const pco_ma_3 = document.getElementById("pco_ma_3");
    if(pco_ma_3) pco_ma_3.textContent = d.pco_ma_3 || "-";
    const pco_ma_4 = document.getElementById("pco_ma_4");
    if(pco_ma_4) pco_ma_4.textContent = d.pco_ma_4 || "-";
    const pco_ma_5 = document.getElementById("pco_ma_5");
    if(pco_ma_5) pco_ma_5.textContent = d.pco_ma_5 || "-";
    const pfg_cr_1 = document.getElementById("pfg_cr_1");
    if(pfg_cr_1) pfg_cr_1.textContent = d.pfg_cr_1 || "-";
    const pfg_cr_1a = document.getElementById("pfg_cr_1a");
    if(pfg_cr_1a) pfg_cr_1a.textContent = d.pfg_cr_1a || "N/A";
    const pfg_eppe_1 = document.getElementById("pfg_eppe_1");
    if(pfg_eppe_1) pfg_eppe_1.textContent = d.pfg_eppe_1 || "-";
    const pfg_eppe_2 = document.getElementById("pfg_eppe_2");
    if(pfg_eppe_2) pfg_eppe_2.textContent = d.pfg_eppe_2 || "-";
    const pfg_ma_1 = document.getElementById("pfg_ma_1");
    if(pfg_ma_1) pfg_ma_1.textContent = d.pfg_ma_1 || "-";
    const pfg_ma_2 = document.getElementById("pfg_ma_2");
    if(pfg_ma_2) pfg_ma_2.textContent = d.pfg_ma_2 || "-";
    const pfg_ma_3 = document.getElementById("pfg_ma_3");
    if(pfg_ma_3) pfg_ma_3.textContent = d.pfg_ma_3 || "-";


        const pno_cr_1 = document.getElementById("pno_cr_1");
if(pno_cr_1) pno_cr_1.textContent = d.pno_cr_1 || "-";
const pno_cr_2 = document.getElementById("pno_cr_2");
if(pno_cr_2) pno_cr_2.textContent = d.pno_cr_2 || "-";
const pno_cr_3 = document.getElementById("pno_cr_3");
if(pno_cr_3) pno_cr_3.textContent = d.pno_cr_3 || "-";
const pno_cr_4 = document.getElementById("pno_cr_4");
if(pno_cr_4) pno_cr_4.textContent = d.pno_cr_4 || "-";
const pno_cr_5 = document.getElementById("pno_cr_5");
if(pno_cr_5) pno_cr_5.textContent = d.pno_cr_5 || "-";
const pno_cr_6 = document.getElementById("pno_cr_6");
if(pno_cr_6) pno_cr_6.textContent = d.pno_cr_6 || "-";
const pno_cr_7 = document.getElementById("pno_cr_7");
if(pno_cr_7) pno_cr_7.textContent = d.pno_cr_7 || "-";
const pno_cr_8 = document.getElementById("pno_cr_8");
if(pno_cr_8) pno_cr_8.textContent = d.pno_cr_8 || "-";
const pno_cr_9 = document.getElementById("pno_cr_9");
if(pno_cr_9) pno_cr_9.textContent = d.pno_cr_9 || "-";
const pno_cr_10 = document.getElementById("pno_cr_10");
if(pno_cr_10) pno_cr_10.textContent = d.pno_cr_10 || "-";
const pno_cr_11 = document.getElementById("pno_cr_11");
if(pno_cr_11) pno_cr_11.textContent = d.pno_cr_11 || "-";
const pno_cr_12 = document.getElementById("pno_cr_12");
if(pno_cr_12) pno_cr_12.textContent = d.pno_cr_12 || "-";
const pno_cr_13 = document.getElementById("pno_cr_13");
if(pno_cr_13) pno_cr_13.textContent = d.pno_cr_13 || "-";

const pno_epe_1 = document.getElementById("pno_epe_1");
if(pno_epe_1) pno_epe_1.textContent = d.pno_epe_1 || "-";
const pno_epe_2 = document.getElementById("pno_epe_2");
if(pno_epe_2) pno_epe_2.textContent = d.pno_epe_2 || "-";
const pno_epe_3 = document.getElementById("pno_epe_3");
if(pno_epe_3) pno_epe_3.textContent = d.pno_epe_3 || "-";
const pno_epe_4 = document.getElementById("pno_epe_4");
if(pno_epe_4) pno_epe_4.textContent = d.pno_epe_4 || "-";
const pno_epe_5 = document.getElementById("pno_epe_5");
if(pno_epe_5) pno_epe_5.textContent = d.pno_epe_5 || "-";
const pno_epe_6 = document.getElementById("pno_epe_6");
if(pno_epe_6) pno_epe_6.textContent = d.pno_epe_6 || "-";
const pno_epe_7 = document.getElementById("pno_epe_7");
if(pno_epe_7) pno_epe_7.textContent = d.pno_epe_7 || "-";
const pno_epe_8 = document.getElementById("pno_epe_8");
if(pno_epe_8) pno_epe_8.textContent = d.pno_epe_8 || "-";
const pno_epe_9 = document.getElementById("pno_epe_9");
if(pno_epe_9) pno_epe_9.textContent = d.pno_epe_9 || "-";





//estos son los de atosfera

const temp_fuego = document.getElementById("temp_fuego");
if (temp_fuego) temp_fuego.textContent = d.temp_fuego || "-";

const fluido_fuego = document.getElementById("fluido_fuego");
if (fluido_fuego) fluido_fuego.textContent = d.fluido_fuego || "-";

const presion_fuego = document.getElementById("presion_fuego");
if (presion_fuego) presion_fuego.textContent = d.presion_fuego || "-";

const temp_apertura = document.getElementById("temp_apertura");
if (temp_apertura) temp_apertura.textContent = d.temp_apertura || "-";

const fluido_apertura = document.getElementById("fluido_apertura");
if (fluido_apertura) fluido_apertura.textContent = d.fluido_apertura || "-";

const presion_apertura = document.getElementById("presion_apertura");
if (presion_apertura) presion_apertura.textContent = d.presion_apertura || "-";

const temp_confinado = document.getElementById("temp_confinado");
if (temp_confinado) temp_confinado.textContent = d.temp_confinado || "-";

const fluido_confinado = document.getElementById("fluido_confinado");
if (fluido_confinado) fluido_confinado.textContent = d.fluido_confinado || "-";

const presion_confinado = document.getElementById("presion_confinado");
if (presion_confinado) presion_confinado.textContent = d.presion_confinado || "-";

const temp_no_peligroso = document.getElementById("temp_no_peligroso");
if (temp_no_peligroso) temp_no_peligroso.textContent = d.temp_no_peligroso || "-";

const fluido_no_peligroso = document.getElementById("fluido_no_peligroso");
if (fluido_no_peligroso) fluido_no_peligroso.textContent = d.fluido_no_peligroso || "-";

const presion_no_peligroso = document.getElementById("presion_no_peligroso");
if (presion_no_peligroso) presion_no_peligroso.textContent = d.presion_no_peligroso || "-";






  }

  // Participantes (tabla)
  if (participan && participan.data) {
    const tbody = document.getElementById("modal-ast-participantes-body");
    if (tbody) {
      tbody.innerHTML = "";
      participan.data.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${p.nombre || "-"}</td><td>${p.credencial || "-"}</td><td>${p.cargo || "-"}</td><td>${p.funcion || "-"}</td><td></td>`;
        tbody.appendChild(tr);
      });
    }
  }

  // Actividades AST (tabla)
  if (actividades && actividades.data) {
    const tbody = document.getElementById("modal-ast-actividades-body");
    if (tbody) {
      tbody.innerHTML = "";
      actividades.data.forEach((a, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${a.num_actividad || idx + 1}</td>
          <td>${a.secuencia_actividad || "-"}</td>
          
          <td>${a.peligros_potenciales || "-"}</td>
          <td>${a.acciones_preventivas || "-"}</td>
        
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // Autorizaciones (tabla de responsables)
  if (autorizaciones && autorizaciones.data) {
    const tbody = document.getElementById("modal-ast-responsable-body");
    if (tbody) {
      tbody.innerHTML = "";
      autorizaciones.data.forEach(a => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${a.nombre || "-"}</td><td>${a.cargo || "-"}</td><td>${a.fecha || "-"}</td><td></td>`;
        tbody.appendChild(tr);
      });
    }
  }

  return resultado;
}








document.addEventListener("DOMContentLoaded", function () {
  // Llenar select de supervisores desde la base de datos
  fetch("/api/supervisores")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador");
      if (select) {
        select.innerHTML =
          '<option value="" disabled selected>Seleccione un supervisor...</option>';
        data.forEach((sup) => {
          const option = document.createElement("option");
          option.value = sup.nombre;
          option.textContent = sup.nombre;
          select.appendChild(option);
        });
      }
    });

  // Llenar select de categorías desde la base de datos
  fetch("/api/categorias")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("responsable-aprobador2");
      if (select) {
        select.innerHTML =
          '<option value="" disabled selected>Seleccione una categoria...</option>';
        data.forEach((cat) => {
          const option = document.createElement("option");
          option.value = cat.nombre;
          option.textContent = cat.nombre;
          select.appendChild(option);
        });
      }
    });

  const btnSalir = document.getElementById("btn-salir-nuevo");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      // Detectar la ruta de redirección según el archivo HTML actual
      const currentPage = window.location.pathname;
      let redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html"; // Por defecto

      if (currentPage.includes("PT1imprimir3.html")) {
        redirectUrl = "/Modules/Departamentos/CrearPT.html";
      } else if (currentPage.includes("PT1imprimirsup.html")) {
        redirectUrl = "/Modules/JefeSeguridad/JefeSeguridad.html";
      } else if (currentPage.includes("PT1imprimirseg.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (currentPage.includes("PT1imprimir4.html")) {
        redirectUrl = "/Modules/Departamentos/AutorizarPT.html";
      }

      window.location.href = redirectUrl;
    });
  }
});

// Función para aplicar estilos específicos de PT1
function aplicarEstilosPT1() {
  // Aplicar clases dinámicas a las respuestas según su valor
  const respuestas = [
    "resp-risk-area",
    "resp-physical-delivery",
    "resp-additional-ppe",
    "resp-surrounding-risk",
    "resp-supervision-needed",
  ];

  respuestas.forEach((id) => {
    const elemento = document.getElementById(id);
    if (elemento && elemento.textContent.trim() !== "-") {
      const respuesta = elemento.textContent.toLowerCase().trim();

      // Remover clases anteriores
      elemento.classList.remove("pt1-response-si", "pt1-response-no");

      // Agregar clase según la respuesta
      if (respuesta === "si" || respuesta === "sí") {
        elemento.classList.add("pt1-response-si");
      } else if (respuesta === "no") {
        elemento.classList.add("pt1-response-no");
      }
    }
  });
}

// Función para consultar las personas que han autorizado el permiso
function consultarPersonasAutorizacion(idPermiso) {
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((response) => response.json())
    .then((result) => {
      if (result.success && result.data) {
        const data = result.data;

        // Rellenar responsable del área
        const responsableAreaElement = document.getElementById(
          "responsable-area-nombre"
        );
        if (responsableAreaElement) {
          responsableAreaElement.textContent = data.responsable_area || "-";
        }

        // Rellenar operador del área
        const operadorAreaElement = document.getElementById(
          "operador-area-nombre"
        );
        if (operadorAreaElement) {
          operadorAreaElement.textContent = data.operador_area || "-";
        }

        // Rellenar supervisor de seguridad
        const supervisorElement = document.getElementById("supervisor-nombre");
        if (supervisorElement) {
          supervisorElement.textContent = data.nombre_supervisor || "-";
        }

        console.log("Datos de autorización cargados:", data);
      } else {
        console.log("No se encontraron autorizaciones para este permiso");
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}

// Nuevo botón salir: detecta la página actual y redirige apropiadamente
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function (e) {
    e.preventDefault();

    // Detectar la ruta de redirección según el archivo HTML actual
    const currentPage = window.location.pathname;
    let redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html"; // Por defecto

   if (currentPage.includes("PT1imprimir3.html")) {
        redirectUrl = "/Modules/Departamentos/CrearPT.html";
      } else if (currentPage.includes("PT1imprimirsup.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (currentPage.includes("PT1imprimirseg.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      }else if (currentPage.includes("PT1imprimir4.html")){
        redirectUrl = "/Modules/Departamentos/AutorizarPT.html";
      }

    window.location.href = redirectUrl;
  });
}







  // Botón regresar: detecta la página actual y redirige apropiadamente
  const btnRegresar = document.getElementById("btn-regresar");
  if (btnRegresar) {
    btnRegresar.addEventListener("click", function () {
      const currentPage = window.location.pathname;
      let redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html"; // Por defecto

      if (currentPage.includes("PT1imprimir3.html")) {
        redirectUrl = "/Modules/Departamentos/CrearPT.html";
      } else if (currentPage.includes("PT1imprimirsup.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (currentPage.includes("PT1imprimirseg.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      }else if (currentPage.includes("PT1imprimir4.html")){
        redirectUrl = "/Modules/Departamentos/AutorizarPT.html";
      }

      window.location.href = redirectUrl;
    });
  }

  // Botón salir: detecta la página actual y redirige apropiadamente
  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      const currentPage = window.location.pathname;
      let redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html"; // Por defecto
if (currentPage.includes("PT1imprimir3.html")) {
        redirectUrl = "/Modules/Departamentos/CrearPT.html";
      } else if (currentPage.includes("PT1imprimirsup.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      } else if (currentPage.includes("PT1imprimirseg.html")) {
        redirectUrl = "/Modules/SupSeguridad/SupSeguridad.html";
      }else if (currentPage.includes("PT1imprimir4.html")){
        redirectUrl = "/Modules/Departamentos/AutorizarPT.html";
      }

      window.location.href = redirectUrl;
    });
  }


















/**
 * Función de impresión tradicional (fallback)
 */
async function imprimirPermisoTradicional() {
  try {
    window.print();
  } catch (error) {
    console.error("Error al imprimir:", error);
    alert(
      "Ocurrió un error al preparar la impresión. Por favor, inténtalo nuevamente."
    );
  }
}

const botonImprimir = document.getElementById("btn-imprimir-permiso");
if (botonImprimir) {
  botonImprimir.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.print();
    },
    true
  );

  // Indicador visual al botón
  botonImprimir.style.transition = "all 0.3s ease";
  botonImprimir.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 6px 20px rgba(0,59,92,0.3)";
  });

  botonImprimir.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "";
  });
}

console.log("Funcionalidad de impresión PT1 inicializada correctamente");

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

        if (!hayResponsables) {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
          tbody.appendChild(tr);
        }
      } else {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="3">Sin responsables registrados</td>`;
        tbody.appendChild(tr);
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
    });
}



function llenarTablaResponsables(idPermiso) {
  /**
   * Función para llenar la tabla de responsables en el modal AST.
   * Consulta la API para obtener los responsables y sus datos,
   * y los muestra en una tabla dentro del modal.
   * Si no hay responsables, muestra un mensaje adecuado.
   * Mejora la trazabilidad y visualización de responsables en el permiso.
   */
  fetch(`/api/autorizaciones/personas/${idPermiso}`)
    .then((response) => response.json())
    .then((result) => {
      const tbody = document.getElementById("modal-ast-responsable-body");
      if (!tbody) return;

      tbody.innerHTML = ""; // Limpia la tabla antes de llenarla

      function formatearFecha(fechaString) {
        if (!fechaString) return "Pendiente";
        // Si la fecha viene en formato SQL (YYYY-MM-DD HH:mm:ss), mostrar tal cual
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(fechaString)) {
          const [fecha, hora] = fechaString.split(" ");
          const [h, m] = hora.split(":");
          return `${fecha.replace(/-/g, "/")}, ${h}:${m}`;
        }
        // Si viene en formato ISO con Z (UTC), mostrar en UTC
        try {
          const fecha = new Date(fechaString);
          if (isNaN(fecha.getTime())) {
            return "Fecha inválida";
          }
          // Formatear en UTC
          const year = fecha.getUTCFullYear();
          const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
          const day = String(fecha.getUTCDate()).padStart(2, "0");
          const hour = String(fecha.getUTCHours()).padStart(2, "0");
          const minute = String(fecha.getUTCMinutes()).padStart(2, "0");
          return `${day}/${month}/${year}, ${hour}:${minute}`;
        } catch (error) {
          return "Error en fecha";
        }
      }

      if (result.success && result.data) {
        const data = result.data;
        const { ip_area, localizacion_area } = data;
        const filas = [
          {
            nombre: data.responsable_area,
            cargo: "Responsable de área",
            fecha: formatearFecha(data.fecha_hora_area),
          },
          {
            nombre: data.operador_area,
            cargo: "Operador del área",
            fecha: formatearFecha(data.fecha_hora_area),
          },
          {
            nombre: data.nombre_supervisor,
            cargo: "Supervisor de Seguridad",
            fecha: formatearFecha(data.fecha_hora_supervisor),
          },
        ];

        let hayResponsables = false;
        filas.forEach((fila) => {
          if (fila.nombre && fila.nombre.trim() !== "") {
            hayResponsables = true;
            const tr = document.createElement("tr");
            tr.innerHTML = `
  <td>${fila.nombre}</td>
  <td>${fila.cargo}</td>
  <td>
    ${fila.fecha || ""}<br>
     ${ip_area || "-"}<br>
     ${localizacion_area || "-"}
  </td>
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

