// Rellenar la tabla de permisos en el dashboard
document.addEventListener("DOMContentLoaded", function () {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const id_departamento = usuario && usuario.id ? usuario.id : 1;
  const tbody = document.querySelector(".compact-table tbody");
  if (!tbody) return;

  let allPermisos = [];

  function renderTable(permisos) {
    tbody.innerHTML = "";
    permisos.forEach((p) => {
      let statusClass = "";
      switch ((p.estado || "").toLowerCase()) {
        case "activo":
          statusClass = "status-activo";
          break;
        case "terminado":
          statusClass = "status-terminado";
          break;
        case "cancelado":
          statusClass = "status-cancelado";
          break;
        case "no autorizado":
          statusClass = "status-noautorizado";
          break;
        case "espera seguridad":
          statusClass = "status-esperaseguridad";
          break;
        case "en espera del área":
          statusClass = "status-esperaarea";
          break;
        default:
          statusClass = "status-default";
      }
      tbody.innerHTML += `
        <tr>
          <td>${p.permiso || ""}</td>
          <td>${p.tipo || ""}</td>
          <td>${p.actividad || ""}</td>
          <td>${p.supervisor || ""}</td>
          <td><span class="status-badge ${statusClass}">${
        p.estado || ""
      }</span></td>
        </tr>
      `;
    });
  }

  fetch("http://localhost:3000/api/tabla-permisos/" + id_departamento)
    .then((res) => res.json())
    .then((data) => {
      allPermisos = data.permisos || [];
      renderTable(allPermisos);
    });

  const statusFilter = document.getElementById("status-filter");
  if (statusFilter) {
    statusFilter.addEventListener("change", function () {
      const value = statusFilter.value;
      let filtered = allPermisos;
      if (value !== "all") {
        filtered = allPermisos.filter((p) => {
          switch (value) {
            case "active":
              return (p.estado || "").toLowerCase() === "en espera del área";
            case "completed":
              return (p.estado || "").toLowerCase() === "espera seguridad";
            case "canceled":
              return (p.estado || "").toLowerCase() === "no autorizado";
            case "continua":
              return (p.estado || "").toLowerCase() === "activo";
            case "wait-area":
              return (p.estado || "").toLowerCase() === "continua";
            case "wait-security":
              return (
                (p.estado || "").toLowerCase() === "terminado" ||
                (p.estado || "").toLowerCase() === "cancelado"
              );
            default:
              return true;
          }
        });
      }
      renderTable(filtered);
    });
  }
});
