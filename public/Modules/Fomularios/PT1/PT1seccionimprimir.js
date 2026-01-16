//esta es la nueva funcion para mostrar
//esta es la nueva funcion para mostrar
//esta es la nueva funcion para mostrar
//esta es la nueva funcion para mostrar
//esta es la nueva funcion para mostrar


const usuarioObj = JSON.parse(localStorage.getItem("usuario"));
const usuario = usuarioObj && usuarioObj.usuario ? usuarioObj.usuario : "";


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
    // Eliminado: la tabla de responsables ahora solo la controla mostrar_autorizaciones.js
  }
});

// Función para mostrar/ocultar permisos según los valores columna_*_valor
function mostrarPermisosSegunValores(data) {
    // Depuración: mostrar valores de los campos de permisos
    console.log("Valores recibidos:", {
      columna_altura_valor: data.columna_altura_valor,
      columna_confinado_valor: data.columna_confinado_valor,
      columna_fuego_valor: data.columna_fuego_valor,
      columna_apertura_valor: data.columna_apertura_valor,
      columna_nopeligrosovalor_valor: data.columna_nopeligrosovalor_valor
    });
  // Mapeo de id de contenedor y campo de valor
  const permisos = [
    { id: "permiso-altura", valor: data.columna_altura_valor, nombre: "Permiso de Altura" },
    { id: "permiso-confinado", valor: data.columna_confinado_valor, nombre: "Permiso Espacio Confinado" },
    { id: "permiso-fuego", valor: data.columna_fuego_valor, nombre: "Permiso de Fuego" },
    { id: "permiso-apertura", valor: data.columna_apertura_valor, nombre: "Permiso de Apertura" },
    { id: "permiso-nopeligroso", valor: data.columna_nopeligrosovalor_valor, nombre: "Permiso No Peligroso" },
  ];
  const permisosMostrados = [];
  permisos.forEach((permiso) => {
    const contenedor = document.getElementById(permiso.id);
    if (contenedor) {
      if (
        typeof permiso.valor === "string" &&
        permiso.valor.trim().toUpperCase() === "SI"
      ) {
        contenedor.style.display = "";
        permisosMostrados.push(permiso.nombre);
      } else {
        contenedor.style.display = "none";
      }
    }
  });
  console.log("Permisos mostrados:", permisosMostrados.length > 0 ? permisosMostrados : "Ninguno");
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
    // Mostrar todos los valores del objeto d por consola
    console.log('[DEBUG][PT1seccionimprimir] Valores del permiso:', d);
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
    if(ubicacionLabel) ubicacionLabel.textContent = d.id_area  || "-";
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
//aca termina
//aca termina
//aca termina
//aca termina
//aca termina
//aca termina





// Ejemplo de uso:
// consultarTodoPermiso(512);
// Función para enviar los datos del permiso a N8N
/**
 * Función para enviar los datos del permiso a N8N.
 * Esta función toma el motivo de cierre y el id del permiso,
 * y (antes de eliminar mapeos) enviaba los datos a un webhook externo.
 * Actualmente, la lógica de envío está eliminada por solicitud.
 * Se puede restaurar para integraciones externas si es necesario.
 */
async function enviarDatosAN8N(motivoCierre) {
  const idPermiso =
    sessionStorage.getItem("id_tipo_permiso") ||
    new URLSearchParams(window.location.search).get("id");
  if (!idPermiso) {
    alert("No se pudo obtener el ID del permiso para enviar a N8N.");
    return;
  }
  // Mapeos de datos eliminados según solicitud
}
document.addEventListener("DOMContentLoaded", function () {
  /**
   * Evento principal DOMContentLoaded.
   * Inicializa los selects de supervisores y categorías desde la base de datos,
   * configura el botón de salir, y muestra/oculta el botón de trabajo finalizado
   * según el estatus del permiso. Es el punto de entrada para la lógica de la vista.
   * También maneja la visibilidad de botones según el estatus del permiso.
   */
  /**
   * Evento DOMContentLoaded para la lógica de cierre de permiso.
   * Maneja la apertura de modales de confirmación y cierre,
   * así como el guardado del comentario de cierre y actualización de estatus.
   * Incluye la lógica para cancelar o cerrar el permiso según la acción del usuario.
   * Esencial para el flujo de cierre/cancelación de permisos.
   */
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
      window.location.href = "/Modules/Usuario/CrearPT.html";
    });
  }
  
    // Mostrar/ocultar botón "Trabajo Finalizado" según estatus
    const btnTrabajoFinalizado = document.getElementById("btn-cerrar-permiso");
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get("id");
    if (btnTrabajoFinalizado && idPermiso) {
      fetch(`/api/estatus-solo/${idPermiso}`)
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.estatus && typeof data.estatus === "string") {
            if (data.estatus.trim().toLowerCase() === "validado por seguridad" ||
                data.estatus.trim().toLowerCase() === "espera liberacion del area") {
              btnTrabajoFinalizado.style.display = "";
            } else {
              btnTrabajoFinalizado.style.display = "none";
            }
          } else {
            btnTrabajoFinalizado.style.display = "none";
          }
        })
        .catch(() => {
          btnTrabajoFinalizado.style.display = "none";
        });
    }
});

// Lógica para mostrar el modal de cierre de permiso y guardar el comentario

// Lógica para mostrar el modal de confirmación antes del cierre
document.addEventListener("DOMContentLoaded", function () {
  var btnCerrarPermiso = document.getElementById("btn-cerrar-permiso");
  var modalConfirmar = document.getElementById("modalConfirmarCerrarPermiso");
  var modalCerrarPermiso = document.getElementById("modalCerrarPermiso");
  //var modalAlternativo = document.getElementById("modalCierreAlternativo");
  var modalAlternativo = document.getElementById("modalCancelarPermisoUnico");
  
  var btnSi = document.getElementById("btnConfirmarCerrarSi");
  var btnNo = document.getElementById("btnConfirmarCerrarNo");
  var btnCerrarAlternativo = document.getElementById("btnCerrarAlternativo");
  var btnCancelarCerrarPermiso = document.getElementById("btnCancelarCerrarPermiso");
  var btnGuardarCerrarPermiso = document.getElementById("btnGuardarCerrarPermiso");

  // Al hacer click en el botón principal, mostrar el modal de confirmación
  if (btnCerrarPermiso && modalConfirmar) {
    btnCerrarPermiso.addEventListener("click", function (e) {
      e.preventDefault();
        // Oculta el modal de cierre tradicional si está visible
        if (modalCerrarPermiso) modalCerrarPermiso.style.display = "none";
        modalConfirmar.style.display = "flex";
    });
  }
  // Si el usuario elige 'Sí', mostrar el modal de cierre tradicional
  if (btnSi && modalCerrarPermiso && modalConfirmar) {
    btnSi.addEventListener("click", function () {
      modalConfirmar.style.display = "none";
      modalCerrarPermiso.style.display = "flex";
    });
  }
  // Si el usuario elige 'No', mostrar el modal alternativo
  if (btnNo && modalAlternativo && modalConfirmar) {
    btnNo.addEventListener("click", function () {
      modalConfirmar.style.display = "none";
      modalAlternativo.style.display = "flex";
    });
  }
  // Cerrar el modal alternativo
  if (btnCerrarAlternativo && modalAlternativo) {
    btnCerrarAlternativo.addEventListener("click", function () {
      modalAlternativo.style.display = "none";
    });
  }
  // Cerrar el modal de cierre tradicional
  if (btnCancelarCerrarPermiso && modalCerrarPermiso) {
    btnCancelarCerrarPermiso.addEventListener("click", function () {
      modalCerrarPermiso.style.display = "none";
    });
  }
  // Guardar comentario de cierre en la base de datos
  if (btnGuardarCerrarPermiso && modalCerrarPermiso) {
    btnGuardarCerrarPermiso.addEventListener("click", async function () {
      var comentario = document.getElementById("comentarioCerrarPermiso").value.trim();
      var tipoCierre = document.getElementById("tipoCierrePermiso").value;

      if (!comentario) {
        alert("Debes escribir el motivo del cierre.");
        return;
      }
      if (!tipoCierre) {
        alert("Debes seleccionar el tipo de cierre.");
        return;
      }
      var params = new URLSearchParams(window.location.search);
      var idPermiso = params.get("id") || window.idPermisoActual;
      console.log("Permiso de trabajo a cerrar:", idPermiso);
      if (!idPermiso) {
        alert("No se pudo obtener el ID del permiso.");
        return;
      }
      let idEstatus = null;
      try {
        const respEstatus = await fetch(`/api/estatus/permiso/${idPermiso}`);
        if (respEstatus.ok) {
          const permisoData = await respEstatus.json();
          idEstatus = permisoData.id_estatus || (permisoData.data && permisoData.data.id_estatus);
        }
      } catch (err) {
        console.error("Error al consultar id_estatus:", err);
      }
      if (!idEstatus) {
      
        return;
      }
      let endpoint;
      let mensajeExito;
      switch (tipoCierre) {
        case "cierre-sin-incidentes":
          endpoint = "/api/estatus/cierre_sin_incidentes";
          mensajeExito = "Permiso cerrado sin incidentes exitosamente.";
          break;
        case "cierre-con-incidentes":
          endpoint = "/api/estatus/cierre_con_incidentes";
          mensajeExito = "Permiso cerrado con incidentes registrado exitosamente.";
          break;
        case "cierre-con-accidentes":
          endpoint = "/api/estatus/cierre_con_accidentes";
          mensajeExito = "Permiso cerrado con accidentes registrado exitosamente.";
          break;
        case "cancelado":
          endpoint = "/api/estatus/cancelado";
          mensajeExito = "Permiso cancelado exitosamente.";
          break;
        default:
          alert("Tipo de cierre no válido.");
          return;
      }
      try {
        const respComentario = await fetch("/api/estatus/comentario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_estatus: idEstatus, comentario }),
        });
        let dataComentario = {};
        try {
          dataComentario = await respComentario.json();
        } catch (e) {}
        if (!dataComentario.success) {
          alert("No se pudo guardar el comentario de cierre.");
          return;
        }



         // --- Cierre de usuario: enviar nombre completo y fecha/hora actual ---
        // Obtener el usuario desde localStorage como en tabla-crearpt.js
        const usuarioObj = JSON.parse(localStorage.getItem("usuario"));
        const usuario = usuarioObj && usuarioObj.usuario ? usuarioObj.usuario : "";
        // Fecha/hora actual en formato ISO
        const fechaHoraCierre = new Date().toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' }).replace(' ', 'T');
        // Mostrar por consola el usuario que se enviará
        console.log('[Cierre usuario] Valor enviado:', usuario);
        // Llamar al endpoint de cierre_usuario
        const respCierreUsuario = await fetch("/api/autorizaciones/cierre-usuario", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_permiso: idPermiso,
            cierre_usuario: usuario,
            fecha_hora_cierre_usuario: fechaHoraCierre
          })
        });
        let dataCierreUsuario = {};
        try {
          dataCierreUsuario = await respCierreUsuario.json();
        } catch (e) {}
        if (!respCierreUsuario.ok || !dataCierreUsuario.success) {
          alert("No se pudo guardar el cierre de usuario.");
          return;
        }

        
        const payloadEstatus = { id_estatus: idEstatus };
        const respEstatus = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadEstatus),
        });
        let dataEstatus = {};
        try {
          dataEstatus = await respEstatus.json();
        } catch (e) {}
        if (!respEstatus.ok || !dataEstatus.success) {
          alert(`No se pudo actualizar el estatus. Error: ${dataEstatus.error || "Desconocido"}`);
          return;
        }
        if (window.n8nFormHandler) {
          await window.n8nFormHandler();
        }
        modalCerrarPermiso.style.display = "none";
        alert(mensajeExito);
        window.location.href = "/Modules/Usuario/CrearPT.html";
      } catch (err) {
        console.error("Error completo:", err);
        alert("Error al guardar el comentario de cierre o actualizar estatus.");
      }
    });
  }
});






// Función para aplicar estilos específicos de PT1
function aplicarEstilosPT1() {
  /**
   * Función para aplicar estilos específicos de PT1.
   * Recorre ciertos elementos de respuesta y les asigna clases
   * según su valor (sí/no), para resaltar visualmente las respuestas.
   * Mejora la legibilidad y el feedback visual en la interfaz.
   * Se puede ampliar para más respuestas o estilos.
   */
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
  /**
   * Función para consultar las personas que han autorizado el permiso.
   * Realiza una petición a la API para obtener los responsables,
   * y actualiza el DOM con los nombres y cargos de cada responsable.
   * Si no hay datos, deja los campos con valores por defecto.
   * Útil para mostrar la cadena de autorización del permiso.
   */
  /**
   * Evento para el botón salir nuevo (regresa a AutorizarPT.html).
   * Permite al usuario volver a la pantalla principal de supervisión de seguridad.
   * Previene el comportamiento por defecto del botón y redirige manualmente.
   * Mejora la navegación entre módulos.
   * Se puede reutilizar para otros botones de navegación.
   */
  /**
   * Evento DOMContentLoaded para mostrar solo la sección 2 al cargar.
   * Incluye funciones para rellenar AST y participantes,
   * y para manejar la navegación entre secciones y botones de regreso/salir.
   * También carga los datos del permiso si hay un id en la URL.
   * Esencial para la experiencia de usuario en la vista de impresión.
   */
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
        // Los elementos ya tienen "-" por defecto, no necesitamos cambiar nada
      }
    })
    .catch((err) => {
      console.error("Error al consultar personas de autorización:", err);
      // Los elementos ya tienen "-" por defecto en caso de error
    });
}


















/**
 * Función de impresión tradicional (fallback)
 */
async function imprimirPermisoTradicional() {
  /**
   * Función de impresión tradicional (fallback).
   * Llama a window.print() para imprimir la vista actual del permiso.
   * Puede esperar a que se carguen imágenes si es necesario.
   * Muestra alertas en caso de error durante la impresión.
   * Útil como respaldo si no hay lógica de impresión personalizada.
   */
  try {


    // Ejecutar impresión tradicional del navegador
    window.print();
  } catch (error) {
    console.error("Error al imprimir:", error);
    alert(
      "Ocurrió un error al preparar la impresión. Por favor, inténtalo nuevamente."
    );
  }
}



const botonImprimir = document.getElementById("btn-imprimir-permiso");
/**
 * Inicialización del botón de impresión.
 * Asigna eventos visuales y funcionales al botón de imprimir,
 * como animaciones al pasar el mouse y la acción de imprimir.
 * Mejora la experiencia de usuario al imprimir el permiso.
 * Se puede extender para mostrar instrucciones personalizadas.
 */
if (botonImprimir) {
  botonImprimir.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      window.print(); // Imprime directamente sin mostrar instrucciones
    },
    true
  ); // true para capturar el evento antes que otros listeners

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




document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const idPermiso = params.get('id');
    if (idPermiso) {
        // ...existing code...

        // Verificar firma de creación y mostrar/ocultar área de firma y modal
        fetch(`/permiso/obtener-firma-creacion/${idPermiso}`)
          .then(res => res.json())
          .then(data => {
            console.log('[DEBUG][firma_creacion] Respuesta del API:', data);
            if (data.success && (!data.firma_creacion || data.firma_creacion === "")) {
              // No hay firma: mostrar modal y área de firma
              document.getElementById("modalAgregarFirmaCreacion").style.display = "block";
              document.getElementById("firma-area").style.display = "block";
            } else {
              // Ya hay firma: ocultar área de firma
              document.getElementById("firma-area").style.display = "none";
            }
          })
          .catch(err => {
            console.error("Error al verificar firma de creación:", err);
          });
    }
    // ...existing code...
});


// Llama a esta función cuando cargues el permiso, pasando el id_permiso correspondiente
// verificarFirmaCreacion(id_permiso);
// Eliminado: la tabla de responsables ahora solo la controla mostrar_autorizaciones.js
