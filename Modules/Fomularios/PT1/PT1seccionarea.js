// Nuevo botón salir: vuelve a AutorizarPT.html
const btnSalirNuevo = document.getElementById("btn-salir-nuevo");
if (btnSalirNuevo) {
  btnSalirNuevo.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/Modules/Usuario/AutorizarPT.html";
  });
}
// Mostrar solo la sección 2 al cargar y ocultar las demás
document.addEventListener("DOMContentLoaded", function () {
  // --- FUNCIONES PARA RELLENAR AST Y PARTICIPANTES ---
  function mostrarAST(ast) {
    const eppList = document.getElementById("modal-epp-list");
    if (eppList) {
      eppList.innerHTML = "";
      if (ast.epp_requerido) {
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
      if (ast.maquinaria_herramientas) {
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
      if (ast.material_accesorios) {
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

  // Guardar datos del análisis previo y condiciones
  const btnGuardar = document.getElementById("btn-guardar-campos");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", async function () {
      // Leer el id del permiso de la URL
      const params = new URLSearchParams(window.location.search);
      const idPermiso = params.get("id");
      if (!idPermiso) {
        alert("No se encontró el id del permiso en la URL");
        return;
      }
      // Recolectar datos del formulario con los nombres esperados por el backend
      const fluido = document.getElementById("fluid").value;
      const presion = document.getElementById("pressure").value;
      const temperatura = document.getElementById("temperature").value;
      const observaciones_analisis_previo = document.getElementById(
        "pre-work-observations"
      ).value;
      function getRadio(name) {
        const checked = document.querySelector(`input[name='${name}']:checked`);
        return checked ? checked.value : null;
      }
      const trabajo_area_riesgo_controlado = getRadio("risk-area");
      const necesita_entrega_fisica = getRadio("physical-delivery");
      const necesita_ppe_adicional = getRadio("additional-ppe");
      const area_circundante_riesgo = getRadio("surrounding-risk");
      const necesita_supervision = getRadio("supervision-needed");
      // Construir payload
      const payload = {
        fluido,
        presion,
        temperatura,
        trabajo_area_riesgo_controlado,
        necesita_entrega_fisica,
        necesita_ppe_adicional,
        area_circundante_riesgo,
        necesita_supervision,
        observaciones_analisis_previo,
      };
      try {
        const resp = await fetch(
          `http://localhost:3000/api/pt-no-peligroso/requisitos_area/${idPermiso}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!resp.ok) throw new Error("Error al guardar los datos");
        alert("Datos guardados correctamente");
      } catch (err) {
        console.error("Error al guardar datos:", err);
        alert(
          "Error al guardar los datos. Revisa la consola para más detalles."
        );
      }
    });
  }
  document.querySelectorAll(".form-section").forEach(function (section) {
    if (section.getAttribute("data-section") === "2") {
      section.style.display = "";
      section.classList.add("active");
    } else {
      section.style.display = "none";
      section.classList.remove("active");
    }
  });

  // Botón regresar: vuelve a AutorizarPT.html
  const btnRegresar = document.getElementById("btn-regresar");
  if (btnRegresar) {
    btnRegresar.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    });
  }

  // Botón salir: vuelve a AutorizarPT.html
  const btnSalir = document.getElementById("btn-salir");
  if (btnSalir) {
    btnSalir.addEventListener("click", function () {
      window.location.href = "/Modules/Usuario/AutorizarPT.html";
    });
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
        if (data && data.detalles) {
          document.getElementById("work-order-label").textContent =
            data.detalles.ot || "-";
          // Usar 'horario' para Hora de inicio si existe, si no, hora_inicio
          document.getElementById("start-time-label").textContent =
            data.detalles.horario || data.detalles.hora_inicio || "-";
          document.getElementById("activity-type-label").textContent =
            data.detalles.tipo_actividad || "-";
          document.getElementById("plant-label").textContent =
            data.detalles.planta || "-";
          //Equipo a Intervenir
          document.getElementById("equipment-label").textContent =
            data.detalles.equipo || "-";
          // TAG
          document.getElementById("tag-label").textContent =
            data.detalles.tag || "-";
          // Condiciones actuales del equipo: mostrar fluido, presion, temperatura si existen
          let condiciones = [];
          if (data.detalles.fluido)
            condiciones.push(`Fluido: ${data.detalles.fluido}`);
          if (data.detalles.presion)
            condiciones.push(`Presión: ${data.detalles.presion}`);
          if (data.detalles.temperatura)
            condiciones.push(`Temperatura: ${data.detalles.temperatura}`);
          if (document.getElementById("equipment-conditions-label")) {
            document.getElementById("equipment-conditions-label").textContent =
              condiciones.length > 0
                ? condiciones.join(" | ")
                : data.detalles.condiciones_equipo || "-";
          }
          // Ahora agrega esto para rellenar AST y Participantes:
          mostrarAST(data.ast);
          mostrarActividadesAST(data.actividades_ast);
          mostrarParticipantesAST(data.participantes_ast);
        } else {
          alert(
            "No se encontraron datos para este permiso o el backend no responde con la estructura esperada."
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
});
