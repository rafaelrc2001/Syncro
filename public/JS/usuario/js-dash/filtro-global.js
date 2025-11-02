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
  }

  // Cargar todos los datos iniciales
  async loadAllData() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const id_departamento = usuario && usuario.id ? usuario.id : 1;

    try {
      // Cargar datos en paralelo
      const [permisosRes, areasRes, tiposRes, estatusRes] = await Promise.all([
        fetch(`/api/tabla-permisos/${id_departamento}`),
        fetch(`/api/grafica/${id_departamento}`),
        fetch(`/api/permisos-tipo/${id_departamento}`),
        fetch(`/api/grafica-estatus/${id_departamento}`),
      ]);

      const [permisosData, areasData, tiposData, estatusData] =
        await Promise.all([
          permisosRes.json(),
          areasRes.json(),
          tiposRes.json(),
          estatusRes.json(),
        ]);

      // Guardar datos originales
      this.originalData = {
        permisos: permisosData.permisos || [],
        areas: areasData.areas || [],
        tipos: tiposData.tipos || [],
        estatus: estatusData.estatus || [],
      };

      // Inicializar datos filtrados con todos los datos
      this.filteredData = JSON.parse(JSON.stringify(this.originalData));

      // Actualizar todas las visualizaciones
      this.updateAllVisualizations();

      console.log("✅ Datos cargados correctamente:", this.originalData);
      console.log(
        "📋 Estructura de permisos (primer elemento):",
        this.originalData.permisos[0]
      );

      // Debug: Verificar campos de área en permisos
      if (this.originalData.permisos.length > 0) {
        const samplePermiso = this.originalData.permisos[0];
        console.log(
          "🔍 Campos disponibles en permiso:",
          Object.keys(samplePermiso)
        );
        console.log("🏢 Campo Area:", samplePermiso.Area);
        console.log("🏢 Campo area:", samplePermiso.area);
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
        const estado = (permiso.Estado || permiso.estado || "").toLowerCase();
        switch (this.statusFilter) {
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
          default:
            return true;
        }
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
    // Si no hay filtros activos, usar datos originales
    if (!this.searchTerm && this.statusFilter === "all") {
      this.filteredData.areas = [...this.originalData.areas];
      this.filteredData.tipos = [...this.originalData.tipos];
      this.filteredData.estatus = [...this.originalData.estatus];
      return;
    }

    // Filtrar áreas basado en permisos filtrados
    const areasCounts = {};
    this.filteredData.permisos.forEach((permiso, index) => {
      // Mapeo robusto para área
      let area = "Sin área";
      if (
        permiso.Area &&
        typeof permiso.Area === "string" &&
        permiso.Area.trim() !== ""
      ) {
        area = permiso.Area.trim();
      } else if (
        permiso.area &&
        typeof permiso.area === "string" &&
        permiso.area.trim() !== ""
      ) {
        area = permiso.area.trim();
      } else if (
        permiso["area"] &&
        typeof permiso["area"] === "string" &&
        permiso["area"].trim() !== ""
      ) {
        area = permiso["area"].trim();
      }
      areasCounts[area] = (areasCounts[area] || 0) + 1;
      // Debug para los primeros 3 elementos
      if (index < 3) {
        console.log(`🔍 Permiso ${index + 1}:`, {
          Area: permiso.Area,
          area: permiso.area,
          areaFinal: area,
          todosLosCampos: Object.keys(permiso),
        });
      }
    });

    this.filteredData.areas = Object.entries(areasCounts).map(
      ([area, cantidad]) => ({
        area,
        cantidad_trabajos: cantidad,
      })
    );

    console.log("🏢 Áreas recalculadas:", this.filteredData.areas);
    console.log("📊 Conteos por área:", areasCounts);

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
  }

  // Actualizar tabla
  updateTable() {
    const tbody = document.querySelector(".compact-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    this.filteredData.permisos.forEach((p) => {
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

      tbody.innerHTML += `
        <tr>
          <td>${p.Permiso || p.permiso || ""}</td>
          <td>${p.Tipo || p.tipo || ""}</td>
          <td>${p.Actividad || p.actividad || ""}</td>
          <td>${p.Supervisor || p.supervisor || ""}</td>
          <td><span class="status-badge ${statusClass}">${
        p.Estado || p.estado || ""
      }</span></td>
        </tr>
      `;
    });
  }

  // Actualizar gráfica de áreas
  updateAreasChart() {
    if (window.areasChartInstance && this.filteredData.areas.length > 0) {
      const categories = this.filteredData.areas.map((a) => a.area);
      const values = this.filteredData.areas.map((a) =>
        Number(a.cantidad_trabajos)
      );
      const baseColors = [
        "#003B5C",
        "#FF6F00",
        "#00BFA5",
        "#B0BEC5",
        "#4A4A4A",
        "#D32F2F",
      ];
      const colors = categories.map(
        (_, i) => baseColors[i % baseColors.length]
      );

      console.log("🔄 Actualizando gráfica de áreas:", { categories, values });
      window.areasChartInstance.updateData({ categories, values, colors });
    }
  }

  // Actualizar gráfica de tipos
  updateTypesChart() {
    if (window.typesChartInstance && this.filteredData.tipos.length > 0) {
      const categories = this.filteredData.tipos.map((t) => t.tipo_permiso);
      const values = this.filteredData.tipos.map((t) =>
        Number(t.cantidad_trabajos)
      );
      const baseColors = [
        "#D32F2F",
        "#FF6F00",
        "#FFC107",
        "#003B5C",
        "#00BFA5",
        "#B0BEC5",
        "#4A4A4A",
        "#1976D2",
      ];
      const colors = categories.map(
        (_, i) => baseColors[i % baseColors.length]
      );

      const riskLevels = categories.map((category) => {
        const tipo = category.toLowerCase();
        if (
          tipo.includes("fuego") ||
          tipo.includes("radiacion") ||
          tipo.includes("electrico")
        ) {
          return "Alto";
        } else if (tipo.includes("confinado") || tipo.includes("altura")) {
          return "Medio";
        } else {
          return "Bajo";
        }
      });

      console.log("🔄 Actualizando gráfica de tipos:", { categories, values });
      window.typesChartInstance.updateData({
        categories,
        values,
        colors,
        riskLevels,
      });
    }
  }

  // Actualizar gráfica de estatus
  updateStatusChart() {
    if (window.statusChartInstance && this.filteredData.estatus.length > 0) {
      const categories = this.filteredData.estatus.map((e) => e.estatus);
      const values = this.filteredData.estatus.map((e) =>
        Number(e.cantidad_trabajos)
      );

      const colors = categories.map((status) => {
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
          return "#B0BEC5";
        }
      });

      const icons = categories.map((status) => {
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
          return "📋";
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
  }, 1500); // Aumenté el tiempo para asegurar que todo esté listo
});

// Exportar para uso global
window.dashboardFilter = dashboardFilter;
