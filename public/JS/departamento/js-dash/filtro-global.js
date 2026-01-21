// Filtro Global para Dashboard - Afecta gráficas y tabla
// filtro-global.js

class DashboardFilter {
  constructor() {
    this.originalData = {
      permisos: [],
      areas: [],
      tipos: [],
      estatus: [],
    };
    this.filteredData = {
      permisos: [],
      areas: [],
      tipos: [],
      estatus: [],
    };
    this.searchTerm = "";
    this.statusFilter = "all";
    this.fechaInicio = null;
    this.fechaFinal = null;

    this.initEventListeners();
  }

  initEventListeners() {
    // Listener para el input de búsqueda global con debounce
    const globalSearch = document.getElementById("global-search");
    if (globalSearch) {
      let debounceTimeout;
      globalSearch.addEventListener("input", (e) => {
        this.searchTerm = e.target.value.toLowerCase().trim();

        // Limpiar timeout anterior
        clearTimeout(debounceTimeout);

        // Aplicar filtros con delay para mejor UX
        debounceTimeout = setTimeout(() => {
          this.applyFilters();
        }, 300);
      });
    }

    // Listener para el filtro de estado
    const statusFilter = document.getElementById("status-filter");
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => {
        this.statusFilter = e.target.value;
        this.applyFilters();
      });
    }

    // Listeners para los inputs de fecha
    const fechaInicioInput = document.getElementById("fecha-inicio");
    const fechaFinalInput = document.getElementById("fecha-final");
    if (fechaInicioInput) {
      fechaInicioInput.addEventListener("change", (e) => {
        this.fechaInicio = e.target.value ? e.target.value : null;
        this.applyFilters();
      });
    }
    if (fechaFinalInput) {
      fechaFinalInput.addEventListener("change", (e) => {
        this.fechaFinal = e.target.value ? e.target.value : null;
        this.applyFilters();
      });
    }
  }

  // Cargar todos los datos iniciales
  async loadAllData() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id_usuario = usuario && usuario.id_usuario ? usuario.id_usuario : null;
    if (!id_usuario) {
      console.error("❌ No se encontró id_usuario en localStorage.usuario");
      return;
    }

    try {
      // Cargar datos en paralelo, pero ahora sub-estatus reemplaza áreas
      const [permisosRes, subEstatusRes, tiposRes, estatusRes] = await Promise.all([
        fetch(`/api/tabla-permisos-departamentos/${id_usuario}`),
        fetch(`/api/grafica-sub-estatus-departamento/${id_usuario}`),
        fetch(`/api/permisos-tipo-departamento/${id_usuario}`),
        fetch(`/api/grafica-estatus-departamento/${id_usuario}`),
      ]);

      const [permisosData, subEstatusData, tiposData, estatusData] = await Promise.all([
        permisosRes.json(),
        subEstatusRes.json(),
        tiposRes.json(),
        estatusRes.json(),
      ]);

      // Agrupar sub-estatus para la gráfica principal
      const subEstatusCounts = {};
      (subEstatusData.estatus || []).forEach((e) => {
        const key = e.sub_estatus || e.subestatus || e.estatus || "Sin sub-estatus";
        subEstatusCounts[key] = (subEstatusCounts[key] || 0) + 1;
      });
      const subEstatusArray = Object.entries(subEstatusCounts).map(([subestatus, cantidad]) => ({
        subestatus,
        cantidad_trabajos: cantidad,
      }));

      // Guardar datos originales
      this.originalData = {
        permisos: permisosData.permisos || [],
        subestatus: subEstatusArray,
        tipos: tiposData.tipos || [],
        estatus: estatusData.estatus || [],
      };

      // Inicializar datos filtrados con todos los datos
      this.filteredData = JSON.parse(JSON.stringify(this.originalData));

      // Actualizar todas las visualizaciones
      this.updateAllVisualizations();

      console.log("✅ Datos cargados correctamente:", this.originalData);
      if (this.originalData.permisos.length > 0) {
        const samplePermiso = this.originalData.permisos[0];
        console.log("🔍 Campos disponibles en permiso:", Object.keys(samplePermiso));
      }
      if (this.originalData.subestatus.length > 0) {
        console.log("🔍 Sub-estatus disponibles:", this.originalData.subestatus.map(s => s.subestatus));
      }
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  }

  // Aplicar filtros basados en búsqueda y estado
  applyFilters() {
    // Filtrar permisos
    let filteredPermisos = [...this.originalData.permisos];

    // Aplicar búsqueda por texto
    if (this.searchTerm) {
      filteredPermisos = filteredPermisos.filter(
        (permiso) =>
          (permiso.Permiso || permiso.permiso || "")
            .toLowerCase()
            .includes(this.searchTerm) ||
          (permiso.Tipo || permiso.tipo || "")
            .toLowerCase()
            .includes(this.searchTerm) ||
          (permiso.Actividad || permiso.actividad || "")
            .toLowerCase()
            .includes(this.searchTerm) ||
          (permiso.Supervisor || permiso.supervisor || "")
            .toLowerCase()
            .includes(this.searchTerm) ||
          (permiso.Area || permiso.area || "")
            .toLowerCase()
            .includes(this.searchTerm) ||
          // Nuevo: permitir búsqueda por contrato (Contrato / contrato)
          (permiso.Contrato || permiso.contrato || "")
            .toLowerCase()
            .includes(this.searchTerm)
      );
    }

    // Aplicar filtro de estado
    if (this.statusFilter !== "all") {
      filteredPermisos = filteredPermisos.filter((permiso) => {
        const estado = (permiso.Estado || permiso.estado || "")
          .toLowerCase()
          .trim();
        const filtro = this.statusFilter.toLowerCase().trim();
        switch (filtro) {
          case "active":
            return estado === "en espera del área";
          case "completed":
            return estado === "espera seguridad";
          case "canceled":
            return estado === "no autorizado";
          case "continua":
            return estado === "activo";
          case "wait-area":
            return estado === "continua";
          case "wait-security":
            return estado === "terminado" || estado === "cancelado";
          case "cierre sin incidentes":
            return estado === "cierre sin incidentes";
          case "cierre con incidentes":
            return estado === "cierre con incidentes";
          case "cierre con accidentes":
            return estado === "cierre con accidentes";
          default:
            // Si el filtro es un texto personalizado, comparar normalizado
            return estado === filtro;
        }
      });
    }

    // Filtrar por rango de fechas (asegura que se use 'fecha' y afecte todas las visualizaciones)
    if (this.fechaInicio || this.fechaFinal) {
      filteredPermisos = filteredPermisos.filter((permiso) => {
        let fechaPermiso = permiso.fecha; // usa 'fecha' en minúsculas
        if (!fechaPermiso) return false;
        let fechaStr = fechaPermiso.split("T")[0];
        if (this.fechaInicio && fechaStr < this.fechaInicio) return false;
        if (this.fechaFinal && fechaStr > this.fechaFinal) return false;
        return true;
      });
    }

    this.filteredData.permisos = filteredPermisos;

    // Recalcular datos de gráficas basados en permisos filtrados
    this.recalculateChartData();

    // Actualizar visualizaciones
    this.updateAllVisualizations();
  }

  // Recalcular datos de gráficas basados en permisos filtrados
  recalculateChartData() {
    // Si no hay ningún filtro activo (búsqueda, estado o fecha), usar datos originales
    if (
      !this.searchTerm &&
      this.statusFilter === "all" &&
      !this.fechaInicio &&
      !this.fechaFinal
    ) {
      // Agrupar subestatus originales en dos categorías
      let accidentes = 0;
      let sinAccidentes = 0;
      (this.originalData.subestatus || []).forEach((s) => {
        const sub = (s.subestatus || "").toLowerCase();
        if (sub.includes("cierre con accidente") || sub.includes("cierre con incidente")) {
          accidentes += s.cantidad_trabajos;
        } else if (sub.includes("cierre sin incidentes")) {
          sinAccidentes += s.cantidad_trabajos;
        }
      });
      this.filteredData.subestatus = [
        { subestatus: "Accidentes", cantidad_trabajos: accidentes },
        { subestatus: "Sin accidentes", cantidad_trabajos: sinAccidentes },
      ];
      this.filteredData.tipos = [...this.originalData.tipos];
      this.filteredData.estatus = [...this.originalData.estatus];
      return;
    }

    // Filtrar sub-estatus basado en permisos filtrados y agrupar en dos categorías
    let accidentes = 0;
    let sinAccidentes = 0;
    this.filteredData.permisos.forEach((permiso) => {
      const sub = (permiso.sub_estatus || permiso.subestatus || permiso.estatus || "").toLowerCase();
      if (sub.includes("cierre con accidente") || sub.includes("cierre con incidente")) {
        accidentes++;
      } else if (sub.includes("cierre sin incidentes")) {
        sinAccidentes++;
      }
    });
    this.filteredData.subestatus = [
      { subestatus: "Accidentes", cantidad_trabajos: accidentes },
      { subestatus: "Sin accidentes", cantidad_trabajos: sinAccidentes },
    ];

    // Filtrar tipos basado en permisos filtrados
    this.filteredData.tipos = this.originalData.tipos
      .map((tipo) => {
        const permisosDelTipo = this.filteredData.permisos.filter((p) =>
          (p.Tipo || p.tipo || "")
            .toLowerCase()
            .includes(tipo.tipo_permiso.toLowerCase())
        );
        return {
          ...tipo,
          cantidad_trabajos: permisosDelTipo.length,
        };
      })
      .filter((tipo) => tipo.cantidad_trabajos > 0);

    // Filtrar estatus basado en permisos filtrados
    const estatusCounts = {};
    this.filteredData.permisos.forEach((permiso) => {
      const estado = permiso.Estado || permiso.estado || "Sin estado";
      estatusCounts[estado] = (estatusCounts[estado] || 0) + 1;
    });

    this.filteredData.estatus = Object.entries(estatusCounts).map(
      ([estatus, cantidad]) => ({
        estatus,
        cantidad_trabajos: cantidad,
      })
    );
  }

  // Actualizar todas las visualizaciones
  updateAllVisualizations() {
    this.updateTable();
    this.updateAreasChart();
    this.updateTypesChart();
    this.updateStatusChart();
    this.updateFilterResults();
    this.updateCards();
  }

  // Actualizar tarjetas del dashboard
  updateCards() {
    // Selecciona todas las tarjetas por orden
    const cards = document.querySelectorAll(".cards-section .card .count");
    if (!cards || cards.length < 5) return;

    // Total de permisos filtrados
    cards[0].textContent = this.filteredData.permisos.length;

    // Por Autorizar: estados "en espera del área" y "espera seguridad"
    const porAutorizar = this.filteredData.permisos.filter((p) => {
      const estado = (p.Estado || p.estado || "").toLowerCase();
      return estado === "en espera del área" || estado === "espera seguridad";
    }).length;
    cards[1].textContent = porAutorizar;

    // Activos: estado "activo"
    const activos = this.filteredData.permisos.filter((p) => {
      const estado = (p.Estado || p.estado || "").toLowerCase();
      return( estado === "activo" ||
              estado === "validado por seguridad" ||
              estado === "trabajo finalizado" ||
              estado === "espera liberacion del area"
      );
    }).length;
    cards[2].textContent = activos;

    // Terminados: estados "terminado", "cancelado", "cierre con accidentes", "cierre con incidentes", "cierre sin incidentes"
    const terminados = this.filteredData.permisos.filter((p) => {
      const estado = (p.Estado || p.estado || "").toLowerCase();
      const subestatus = (p.Subestatus || p.subestatus || "").toLowerCase();
      return estado === "cierre" && (subestatus === "cierre con incidentes" || subestatus === "cierre sin incidentes" || subestatus === "cierre con accidentes" );
    }).length;
    cards[3].textContent = terminados;

    // No Autorizados: estatus 'cierre' y subestatus 'no autorizado' o 'cancelado' (literal)
    const noAutorizados = this.filteredData.permisos.filter((p) => {
      const estado = (p.Estado || p.estado || "").toLowerCase();
      const subestatus = (p.Subestatus || p.subestatus || "").toLowerCase();
      return estado === "cierre" && (subestatus === "no autorizado" || subestatus === "cancelado");
    }).length;
    cards[4].textContent = noAutorizados;
  }

  // Actualizar tabla
  updateTable() {
    const tbody = document.querySelector(".compact-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    this.filteredData.permisos.forEach((p) => {
      // Solo mostrar Permiso, Descripción del Trabajo y Estado
      let statusClass = "";
      switch ((p.Estado || p.estado || "").toLowerCase()) {
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
      // Determinar clase de color para subestatus
      let substatusText = (p.Subestatus || p.subestatus || "").toLowerCase();
      let substatusClass = "";
      if (substatusText.includes("cierre con accidentes")) {
        substatusClass = "cierre-accidentes";
      } else if (substatusText.includes("cierre con incidentes")) {
        substatusClass = "cierre-incidentes";
      } else if (substatusText.includes("cierre sin incidentes")) {
        substatusClass = "cierre-sin-incidentes";
      } else if (substatusText.includes("no autorizado")) {
        substatusClass = "no-autorizado";
      } else if (substatusText.includes("cancelado")) {
        substatusClass = "cancelado";
      }
      const substatusValue = (p.Subestatus || p.subestatus || "").trim() || "...";
      tbody.innerHTML += `
        <tr>
          <td>${p.Permiso || p.permiso || ""}</td>
          <td style="width:60%;">${p.descripcion || p.Descripcion || p.descripcion_trabajo || ""}</td>
          <td>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span class="status-badge ${statusClass}">${p.Estado || p.estado || ""}</span>
              <span class="substatus-badge${substatusClass ? ' ' + substatusClass : ''}">${substatusValue}</span>
            </div>
          </td>
        </tr>
      `;
    });
  }

  // Actualizar gráfica principal con sub-estatus
  updateAreasChart() {
    if (!window.areasChartInstance) return;
    // Generar los subestatus literales a partir de los permisos filtrados
    const subestatusCounts = {};
    this.filteredData.permisos.forEach((p) => {
      const sub = (p.sub_estatus || p.subestatus || p.estatus || "Sin sub-estatus");
      subestatusCounts[sub] = (subestatusCounts[sub] || 0) + 1;
    });
    const categories = Object.keys(subestatusCounts);
    const values = Object.values(subestatusCounts);
    const baseColors = [
      "#003B5C", "#FF6F00", "#00BFA5", "#B0BEC5", "#4A4A4A",
      "#D32F2F", "#1976D2", "#FBC02D", "#00BCD4", "#D81B60", "#455A64"
    ];
    const colors = categories.map((_, i) => baseColors[i % baseColors.length]);
    window.areasChartInstance.updateData({ categories, values, colors });
  }

  // Actualizar gráfica de tipos
  updateTypesChart() {
    if (window.typesChartInstance) {
      // Para la gráfica de permisos por mes, pasar el array de permisos filtrados
      window.typesChartInstance.updateData(this.filteredData.permisos);
    }
  }

  // Actualizar gráfica de estatus
  updateStatusChart() {
    if (window.statusChartInstance) {
      if (this.filteredData.estatus.length > 0) {
        const categories = this.filteredData.estatus.map((e) => e.estatus);
        const values = this.filteredData.estatus.map((e) => Number(e.cantidad_trabajos));
        // Colores e íconos por defecto para estatus desconocidos
        const baseColors = [
          "#00BFA5", "#FF6F00", "#FFC107", "#D32F2F", "#003B5C", "#B0BEC5", "#4A4A4A"
        ];
        const baseIcons = ["✓", "⚡", "⏱️", "✗", "⚠️", "🔒", "🛑"];
        const colors = categories.map((status, i) => {
          const estado = status.toLowerCase();
          if (estado.includes("activo") || estado.includes("terminado")) {
            return "#00BFA5";
          } else if (estado.includes("cancelado")) {
            return "#D32F2F";
          } else if (estado.includes("espera")) {
            return "#FF6F00";
          } else if (estado.includes("no autorizado")) {
            return "#FFC107";
          } else {
            // Color por defecto, pero alternando para que no todos sean iguales
            return baseColors[i % baseColors.length];
          }
        });
        const icons = categories.map((status, i) => {
          const estado = status.toLowerCase();
          if (estado.includes("activo")) {
            return "✓";
          } else if (estado.includes("terminado")) {
            return "🏁";
          } else if (estado.includes("cancelado")) {
            return "✗";
          } else if (estado.includes("espera")) {
            return "⏱️";
          } else if (estado.includes("no autorizado")) {
            return "⚠️";
          } else {
            // Ícono por defecto, pero alternando
            return baseIcons[i % baseIcons.length];
          }
        });
        console.log("🔄 Actualizando gráfica de estatus:", {
          categories,
          values,
        });
        window.statusChartInstance.updateData({
          categories,
          values,
          colors,
          icons,
        });
      } else {
        // Limpiar gráfica si no hay datos
        window.statusChartInstance.updateData({
          categories: [],
          values: [],
          colors: [],
          icons: [],
        });
      }
    }
  }

  // Actualizar indicador de resultados filtrados
  updateFilterResults() {
    const filterResultsElement = document.getElementById("filter-results");
    if (!filterResultsElement) return;

    // Usar el mismo total que las gráficas y tarjetas
    const totalFiltrados = this.filteredData.permisos.length;
    const totalOriginal = this.originalData.permisos.length;
    let message = "";

    if (this.searchTerm || this.statusFilter !== "all") {
      message = `Mostrando ${totalFiltrados} de ${totalOriginal} registros`;
      if (this.searchTerm) {
        message += ` (búsqueda: "${this.searchTerm}")`;
      }
      filterResultsElement.style.color = "var(--verde-tecnico)";
    } else {
      message = `Mostrando todos los registros (${totalOriginal})`;
      filterResultsElement.style.color = "var(--gris-acero)";
    }

    filterResultsElement.textContent = message;
  }

  // Método público para obtener estadísticas filtradas
  getFilteredStats() {
    return {
      totalPermisos: this.filteredData.permisos.length,
      totalOriginal: this.originalData.permisos.length,
      porcentajeFiltrado:
        this.originalData.permisos.length > 0
          ? (
              (this.filteredData.permisos.length /
                this.originalData.permisos.length) *
              100
            ).toFixed(1)
          : 0,
    };
  }
}

// Inicializar el filtro global cuando el DOM esté listo
let dashboardFilter;

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Inicializando filtro global del dashboard...");

  // Esperar un poco para que se inicialicen las gráficas
  setTimeout(() => {
    dashboardFilter = new DashboardFilter();
    dashboardFilter.loadAllData();
    window.dashboardFilter = dashboardFilter;
    // Log automático para depuración
    setTimeout(() => {
      console.log("🔍 Estado de dashboardFilter:", window.dashboardFilter);
      if (window.dashboardFilter && window.dashboardFilter.originalData) {
        console.log("📋 Permisos cargados:", window.dashboardFilter.originalData.permisos);
      } else {
        console.warn("⚠️ dashboardFilter o permisos no disponibles");
      }
    }, 2000);
  }, 1500); // Aumenté el tiempo para asegurar que todo esté listo
});

// Exportar para uso global
window.dashboardFilter = dashboardFilter;
