// Buscador global para dashboard de supervisor
// Filtra todas las gráficas y tarjetas en tiempo real

class DashboardSearcher {
  constructor() {
    this.originalData = null;
    this.filteredData = null;
    this.searchInput = null;
    this.fechaInicio = null;
    this.fechaFinal = null;
    this.init();
  }

  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupSearcher());
    } else {
      this.setupSearcher();
    }
  }

  setupSearcher() {
    // Obtener el input de búsqueda
    this.searchInput = document.querySelector(".search-bar input");
    if (!this.searchInput) {
      console.warn("Input de búsqueda no encontrado");
      return;
    }

    // Inputs de fecha
    this.fechaInicioInput = document.getElementById("fecha-inicio");
    this.fechaFinalInput = document.getElementById("fecha-final");

    // Cargar datos originales
    this.loadOriginalData();

    // Mejorar placeholder dinámico
    this.setupDynamicPlaceholder();

    // Configurar eventos de búsqueda con debounce
    let searchTimeout;
    this.searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, 300); // Debounce de 300ms
    });

    // Limpiar búsqueda con Escape
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.target.value = "";
        this.handleSearch("");
      }
    });

    // Enfocar con Ctrl+F
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        this.searchInput.focus();
      }
    });

    // Eventos de filtro de fecha
    if (this.fechaInicioInput) {
      this.fechaInicioInput.addEventListener("change", (e) => {
        this.fechaInicio = e.target.value ? e.target.value : null;
        this.handleSearch(this.searchInput.value);
      });
    }
    if (this.fechaFinalInput) {
      this.fechaFinalInput.addEventListener("change", (e) => {
        this.fechaFinal = e.target.value ? e.target.value : null;
        this.handleSearch(this.searchInput.value);
      });
    }
  }

  setupDynamicPlaceholder() {
    const placeholders = [
      "Buscar por folio, tipo...",
      "Ej: PT-001, Altura, Activo...",
      "Buscar área, estatus...",
      "Ej: Producción, Terminado...",
      "Buscar solicitante, ubicación...",
      "Buscar contrato, departamento...",
      "Ej: CONTR-001, Mantenimiento...",
    ];

    let currentIndex = 0;

    const changePlaceholder = () => {
      if (this.searchInput && document.activeElement !== this.searchInput) {
        this.searchInput.placeholder = placeholders[currentIndex];
        currentIndex = (currentIndex + 1) % placeholders.length;
      }
    };

    // Cambiar placeholder cada 3 segundos
    setInterval(changePlaceholder, 3000);
  }

  async loadOriginalData() {
    try {
      const response = await fetch("/api/graficas_jefes/permisos-jefes");
      this.originalData = await response.json();
      this.filteredData = [...this.originalData];

      console.log(
        "Datos originales cargados:",
        this.originalData.length,
        "permisos"
      );

      // Verificar que las gráficas estén disponibles después de cargar los datos
      setTimeout(() => {
        this.verifyChartInstances();
      }, 1500);
    } catch (error) {
      console.error("Error al cargar datos originales:", error);
    }
  }

  verifyChartInstances() {
    console.log("Verificando instancias de gráficas:");
    console.log("- Áreas:", !!window.areasChartInstance);
    console.log("- Tipos:", !!window.typesChartInstance);
    console.log("- Estatus:", !!window.statusChartInstance);
    console.log("- Tiempos:", !!window.tiemposChartInstance);

    if (!window.tiemposChartInstance) {
      console.warn(
        "Instancia de gráfica de tiempos no encontrada, intentando crear..."
      );
      const container = document.getElementById("tiempos-chart");
      if (container && this.filteredData) {
        const processed = this.processTiemposData(this.filteredData);
        this.createTiemposChart(container, processed);
      }
    }
  }

  handleSearch(searchTerm) {
    if (!this.originalData) {
      console.warn("Datos originales no disponibles");
      return;
    }

    const term = searchTerm.toLowerCase().trim();

    // Agregar feedback visual
    this.addSearchFeedback(true);

    // Filtrar por texto y por rango de fechas
    this.filteredData = this.originalData.filter((permiso) => {
      // Filtrado por texto
      let coincideBusqueda = true;
      if (term) {
        coincideBusqueda = this.matchesSearchTerm(permiso, term);
      }

      // Filtrado por fechas (usa campo fecha_hora)
      let coincideFecha = true;
      if (this.fechaInicio || this.fechaFinal) {
        let fechaPermiso = permiso.fecha_hora;
        if (!fechaPermiso) return false;
        let fechaStr = fechaPermiso.split("T")[0];
        if (this.fechaInicio && fechaStr < this.fechaInicio) return false;
        if (this.fechaFinal && fechaStr > this.fechaFinal) return false;
      }

      return coincideBusqueda && coincideFecha;
    });

    // Indicador de resultados
    if (term || this.fechaInicio || this.fechaFinal) {
      this.showSearchResults(
        this.filteredData.length,
        this.originalData.length
      );
    } else {
      this.removeSearchIndicator();
    }

    console.log(
      `Búsqueda: "${searchTerm}" - Resultados: ${this.filteredData.length}/${this.originalData.length}`
    );

    // Actualizar todas las gráficas y tarjetas con animación
    setTimeout(() => {
      try {
        this.updateAllCharts();
        this.updateCards();
        console.log("Gráficas actualizadas correctamente");
      } catch (error) {
        console.error("Error al actualizar gráficas:", error);
      }

      this.addSearchFeedback(false);

      // Mostrar mensaje si no hay resultados
      if (
        this.filteredData.length === 0 &&
        (term || this.fechaInicio || this.fechaFinal)
      ) {
        this.showNoResultsMessage(term);
      } else {
        this.hideNoResultsMessage();
      }
    }, 300);
  }

  matchesSearchTerm(permiso, term) {
    const searchableFields = [
      permiso.prefijo,
      permiso.id_permiso,
      permiso.folio,
      permiso.tipo_permiso,
      permiso.estatus,
      permiso.area,
      permiso.departamento,
      permiso.categoria,
      permiso.sucursal,
      permiso.nombre_solicitante,
      permiso.descripcion_trabajo,
      permiso.ubicacion,
      permiso.contrato,
    ];

    return searchableFields.some((field) => {
      if (!field) return false;
      return field.toString().toLowerCase().includes(term);
    });
  }

  updateAllCharts() {
    // Actualizar gráfica de áreas
    if (window.areasChartInstance && window.areasChartInstance.updateData) {
      const areasData = this.processAreasData(this.filteredData);
      window.areasChartInstance.updateData(areasData);
    }

    // Actualizar gráfica de tipos
    if (window.typesChartInstance && window.typesChartInstance.updateData) {
      const typesData = this.processTypesData(this.filteredData);
      window.typesChartInstance.updateData(typesData);
    }

    // Actualizar gráfica de estatus
    if (window.statusChartInstance && window.statusChartInstance.updateData) {
      const statusData = this.processStatusData(this.filteredData);
      window.statusChartInstance.updateData(statusData);
    }

    // Actualizar gráfica de tiempos
    this.updateTiemposChart();
  }

  updateTiemposChart() {
    const tiemposContainer = document.getElementById("tiempos-chart");
    if (!tiemposContainer) return;

    // Procesar datos de tiempos con datos filtrados
    const processed = this.processTiemposData(this.filteredData);

    // Si no hay instancia existente o si la gráfica no existe, crearla
    if (!window.tiemposChartInstance || !window.tiemposChartInstance.chart) {
      this.createTiemposChart(tiemposContainer, processed);
      return;
    }

    // Actualizar la gráfica existente
    const tiemposChart = window.tiemposChartInstance.chart;

    const updatedOption = {
      title: {
        text: this.calculateTiemposAverages(processed),
      },
      xAxis: {
        data: processed.permisos,
      },
      dataZoom: [
        {
          type: "slider",
          start: 0,
          end: Math.min(
            100,
            (8 / Math.max(processed.permisos.length, 1)) * 100
          ),
        },
        {
          type: "inside",
          start: 0,
          end: Math.min(
            100,
            (8 / Math.max(processed.permisos.length, 1)) * 100
          ),
        },
      ],
      series: [
        {
          name: "Creación → Área",
          data: processed.tiemposCreacionArea,
        },
        {
          name: "Área → Supervisor",
          data: processed.tiemposAreaSupervisor,
        },
        {
          name: "Tiempo Total",
          data: processed.tiemposTotales,
        },
      ],
    };

    tiemposChart.setOption(updatedOption, false, true);
  }

  createTiemposChart(container, processed) {
    // Limpiar el contenedor
    container.innerHTML = "";

    // Crear nueva instancia
    const tiemposChart = echarts.init(container);

    const tiemposOption = {
      title: {
        text: this.calculateTiemposAverages(processed),
        left: "center",
        top: 5,
        textStyle: {
          fontSize: 12,
          color: "#4A4A4A",
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params) {
          let result = `<div style="font-weight: 600; margin-bottom: 8px; font-size: 12px;">${params[0].name}</div>`;
          params.forEach((param) => {
            result += `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 12px; margin: 4px 0;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%;"></span>
                  ${param.seriesName}:
                </div>
                <strong>${param.value}h</strong>
              </div>
            `;
          });
          return result;
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#003B5C",
        borderWidth: 1,
        textStyle: { color: "#1C1C1C", fontSize: 12 },
        padding: [10, 12],
      },
      legend: {
        data: ["Creación → Área", "Área → Supervisor", "Tiempo Total"],
        bottom: 35,
        left: "center",
        itemGap: 20,
        textStyle: {
          fontSize: 11,
          color: "#4A4A4A",
        },
        icon: "rect",
        itemWidth: 12,
        itemHeight: 8,
      },
      grid: {
        left: 50,
        right: 20,
        bottom: 80,
        top: 40,
      },
      xAxis: {
        type: "category",
        data: processed.permisos,
        axisLabel: {
          rotate: 0,
          fontSize: 9,
          interval: 0,
          color: "#4A4A4A",
        },
        axisLine: { lineStyle: { color: "#B0BEC5", width: 1 } },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        name: "Horas",
        nameTextStyle: {
          color: "#4A4A4A",
          fontSize: 11,
          fontWeight: 500,
          padding: [0, 0, 0, 10],
        },
        axisLabel: { color: "#4A4A4A", fontSize: 10, formatter: "{value}h" },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "#F5F5F5", width: 1, type: "solid" } },
      },
      dataZoom: [
        {
          type: "slider",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: Math.min(
            100,
            (8 / Math.max(processed.permisos.length, 1)) * 100
          ),
          bottom: 5,
          height: 18,
          borderColor: "#B0BEC5",
          fillerColor: "rgba(0, 59, 92, 0.2)",
          handleStyle: {
            color: "#003B5C",
          },
        },
        {
          type: "inside",
          xAxisIndex: [0],
          start: 0,
          end: Math.min(
            100,
            (8 / Math.max(processed.permisos.length, 1)) * 100
          ),
        },
      ],
      series: [
        {
          name: "Creación → Área",
          type: "bar",
          stack: "tiempos",
          data: processed.tiemposCreacionArea,
          barWidth: "70%",
          itemStyle: {
            color: "#003B5C",
            borderRadius: [4, 4, 0, 0],
            shadowColor: "#003B5C40",
            shadowBlur: 4,
            shadowOffsetY: 3,
          },
        },
        {
          name: "Área → Supervisor",
          type: "bar",
          stack: "tiempos",
          data: processed.tiemposAreaSupervisor,
          barWidth: "70%",
          itemStyle: {
            color: "#FF6F00",
            borderRadius: [0, 0, 0, 0],
            shadowColor: "#FF6F0040",
            shadowBlur: 4,
            shadowOffsetY: 3,
          },
        },
        {
          name: "Tiempo Total",
          type: "line",
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { color: "#00BFA5", width: 3 },
          itemStyle: {
            color: "#00BFA5",
            borderColor: "#FFFFFF",
            borderWidth: 2,
          },
          data: processed.tiemposTotales,
          z: 10,
        },
      ],
      animationEasing: "elasticOut",
      animationDelay: function (idx) {
        return idx * 60;
      },
    };

    tiemposChart.setOption(tiemposOption);

    // Hacer responsive
    const resizeHandler = () => tiemposChart.resize();
    window.removeEventListener("resize", resizeHandler);
    window.addEventListener("resize", resizeHandler);

    // Guardar instancia
    window.tiemposChartInstance = {
      chart: tiemposChart,
      resize: resizeHandler,
      updateData: (newProcessed) => {
        const updateOption = {
          title: { text: this.calculateTiemposAverages(newProcessed) },
          xAxis: { data: newProcessed.permisos },
          series: [
            { data: newProcessed.tiemposCreacionArea },
            { data: newProcessed.tiemposAreaSupervisor },
            { data: newProcessed.tiemposTotales },
          ],
        };
        tiemposChart.setOption(updateOption, false, true);
      },
    };
  }

  calculateTiemposAverages(processed) {
    const promedioCreacionArea =
      processed.tiemposCreacionArea.length > 0
        ? (
            processed.tiemposCreacionArea.reduce((a, b) => a + b, 0) /
            processed.tiemposCreacionArea.length
          ).toFixed(1)
        : 0;

    const promedioAreaSupervisor =
      processed.tiemposAreaSupervisor.length > 0
        ? (
            processed.tiemposAreaSupervisor.reduce((a, b) => a + b, 0) /
            processed.tiemposAreaSupervisor.length
          ).toFixed(1)
        : 0;

    const promedioTotal =
      processed.tiemposTotales.length > 0
        ? (
            processed.tiemposTotales.reduce((a, b) => a + b, 0) /
            processed.tiemposTotales.length
          ).toFixed(1)
        : 0;

    return `Promedios: Creación→Área: ${promedioCreacionArea}h | Área→Supervisor: ${promedioAreaSupervisor}h | Total: ${promedioTotal}h`;
  }

  updateCards() {
    // Agregar pequeño delay para mejor experiencia visual
    setTimeout(() => {
      this.cargarTarjetasFiltradas();
    }, 200);
  }

  // Métodos de procesamiento de datos (copiados de los archivos originales)
  processAreasData(data) {
    const areaCounts = {};
    data.forEach((item) => {
      if (item.area) {
        areaCounts[item.area] = (areaCounts[item.area] || 0) + 1;
      }
    });
    const categories = Object.keys(areaCounts);
    const values = categories.map((area) => areaCounts[area]);
    const colors = [
      "#003B5C",
      "#FF6F00",
      "#00BFA5",
      "#B0BEC5",
      "#4A4A4A",
      "#D32F2F",
    ];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
    };
  }

  processTypesData(data) {
    const typeCounts = {};
    data.forEach((item) => {
      if (item.tipo_permiso) {
        typeCounts[item.tipo_permiso] =
          (typeCounts[item.tipo_permiso] || 0) + 1;
      }
    });
    const categories = Object.keys(typeCounts);
    const values = categories.map((tipo) => typeCounts[tipo]);
    const colors = [
      "#D32F2F",
      "#FF6F00",
      "#FFC107",
      "#003B5C",
      "#00BFA5",
      "#7B1FA2",
      "#388E3C",
      "#1976D2",
      "#C2185B",
    ];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
    };
  }

  processStatusData(data) {
    const statusCounts = {};
    const statusLabels = {};
    data.forEach((item) => {
      if (item.estatus) {
        const normalized = item.estatus
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
        statusCounts[normalized] = (statusCounts[normalized] || 0) + 1;
        if (!statusLabels[normalized]) {
          statusLabels[normalized] = item.estatus;
        }
      }
    });
    const categories = Object.values(statusLabels);
    const values = Object.keys(statusLabels).map((key) => statusCounts[key]);
    const colors = [
      "#00BFA5",
      "#FF6F00",
      "#FFC107",
      "#D32F2F",
      "#003B5C",
      "#7B1FA2",
    ];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
    };
  }

  processTiemposData(data) {
    const permisos = [];
    const tiemposCreacionArea = [];
    const tiemposAreaSupervisor = [];
    const tiemposTotales = [];

    data.forEach((item) => {
      if (!item.fecha_hora) return;

      const creacion = new Date(item.fecha_hora);
      let area = item.fecha_hora_area ? new Date(item.fecha_hora_area) : null;
      let supervisor = item.fecha_hora_supervisor
        ? new Date(item.fecha_hora_supervisor)
        : null;

      let diffCreacionArea = null;
      let diffAreaSupervisor = null;
      let diffTotal = null;

      if (area && supervisor) {
        diffCreacionArea = (area - creacion) / (1000 * 60 * 60);
        diffAreaSupervisor = (supervisor - area) / (1000 * 60 * 60);
        diffTotal = (supervisor - creacion) / (1000 * 60 * 60);
      } else if (area) {
        diffCreacionArea = (area - creacion) / (1000 * 60 * 60);
        diffAreaSupervisor = 0;
        diffTotal = (area - creacion) / (1000 * 60 * 60);
      } else {
        return;
      }

      if (isNaN(diffCreacionArea) || diffCreacionArea < 0) diffCreacionArea = 0;
      if (isNaN(diffAreaSupervisor) || diffAreaSupervisor < 0)
        diffAreaSupervisor = 0;
      if (isNaN(diffTotal) || diffTotal < 0) return;

      permisos.push(item.prefijo || item.id_permiso);
      tiemposCreacionArea.push(Number(diffCreacionArea.toFixed(2)));
      tiemposAreaSupervisor.push(Number(diffAreaSupervisor.toFixed(2)));
      tiemposTotales.push(Number(diffTotal.toFixed(2)));
    });

    return {
      permisos,
      tiemposCreacionArea,
      tiemposAreaSupervisor,
      tiemposTotales,
    };
  }

  async cargarTarjetasFiltradas() {
    function normalizar(str) {
      return (str || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    }

    try {
      const data = this.filteredData;

      let total = 0;
      let activos = 0;
      let noAutorizados = 0;
      let porAutorizar = 0;
      let terminados = 0;

      const desglose = {
        activos: {},
        noAutorizados: {},
        porAutorizar: {},
        terminados: {},
      };

      data.forEach((permiso) => {
        total++;
        const estatus = normalizar(permiso.estatus);

        if (estatus === "activo") {
          activos++;
          desglose.activos[estatus] = (desglose.activos[estatus] || 0) + 1;
        } else if (estatus === "no autorizado") {
          noAutorizados++;
          desglose.noAutorizados[estatus] =
            (desglose.noAutorizados[estatus] || 0) + 1;
        } else if (
          estatus === "en espera del area" ||
          estatus === "espera seguridad"
        ) {
          porAutorizar++;
          desglose.porAutorizar[estatus] =
            (desglose.porAutorizar[estatus] || 0) + 1;
        } else if (
          estatus === "cancelado" ||
          estatus === "cierre con incidentes" ||
          estatus === "cierre con accidentes" ||
          estatus === "cierre sin incidentes" ||
          estatus === "terminado"
        ) {
          terminados++;
          desglose.terminados[estatus] =
            (desglose.terminados[estatus] || 0) + 1;
        }
      });

      // Actualizar las tarjetas
      const counts = document.querySelectorAll(".cards-section .card .count");
      if (counts.length >= 5) {
        counts[0].textContent = total;
        counts[1].textContent = porAutorizar;
        counts[2].textContent = activos;
        counts[3].textContent = terminados;
        counts[4].textContent = noAutorizados;
      }
    } catch (err) {
      console.error("Error al cargar tarjetas filtradas:", err);
    }
  }

  // Método público para limpiar búsqueda
  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = "";
      this.handleSearch("");
    }
  }

  // Método público para establecer término de búsqueda
  setSearchTerm(term) {
    if (this.searchInput) {
      this.searchInput.value = term;
      this.handleSearch(term);
    }
  }

  // Métodos de feedback visual
  addSearchFeedback(isSearching) {
    const searchBar = document.querySelector(".search-bar");
    if (!searchBar) return;

    if (isSearching) {
      searchBar.classList.add("searching");
      // Agregar animación a las tarjetas
      document.querySelectorAll(".card").forEach((card) => {
        card.classList.add("updating");
      });
      // Agregar animación a las gráficas
      document.querySelectorAll(".chart-card").forEach((chart) => {
        chart.classList.add("updating");
      });
    } else {
      searchBar.classList.remove("searching");
      // Remover animaciones después de un tiempo
      setTimeout(() => {
        document.querySelectorAll(".card").forEach((card) => {
          card.classList.remove("updating");
        });
        document.querySelectorAll(".chart-card").forEach((chart) => {
          chart.classList.remove("updating");
        });
      }, 600);
    }
  }

  showSearchResults(resultCount, totalCount) {
    let indicator = document.querySelector(".search-results-indicator");
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.className = "search-results-indicator";
      document.querySelector(".search-bar").appendChild(indicator);
    }

    indicator.textContent = `${resultCount}/${totalCount} resultados`;
    indicator.classList.remove("no-results");

    if (resultCount === 0) {
      indicator.classList.add("no-results");
      indicator.textContent = "Sin resultados";
    }

    indicator.classList.add("show");
  }

  removeSearchIndicator() {
    const indicator = document.querySelector(".search-results-indicator");
    if (indicator) {
      indicator.classList.remove("show");
    }
  }

  showNoResultsMessage(searchTerm) {
    let overlay = document.querySelector(".no-results-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "no-results-overlay";
      overlay.innerHTML = `
        <div class="no-results-message">
          <h3><i class="ri-search-line"></i>Sin resultados encontrados</h3>
          <p>No se encontraron permisos que coincidan con: "<strong id="search-term"></strong>"</p>
          <p>Intenta con otros términos como folio, tipo de permiso, área, estatus, contrato, solicitante, etc.</p>
          <button onclick="window.dashboardSearcher.clearSearch()">
            <i class="ri-refresh-line"></i> Limpiar búsqueda
          </button>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    document.getElementById("search-term").textContent = searchTerm;
    overlay.classList.add("show");

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      this.hideNoResultsMessage();
    }, 1500);
  }

  hideNoResultsMessage() {
    const overlay = document.querySelector(".no-results-overlay");
    if (overlay) {
      overlay.classList.remove("show");
    }
  }
}

// Inicializar el buscador cuando el DOM esté listo
let dashboardSearcher;

document.addEventListener("DOMContentLoaded", function () {
  // Esperar un poco para que se inicialicen las gráficas
  setTimeout(() => {
    dashboardSearcher = new DashboardSearcher();

    // Hacer disponible globalmente
    window.dashboardSearcher = dashboardSearcher;

    console.log("Buscador del dashboard inicializado");
  }, 1000);
});

// Exportar para uso global
window.DashboardSearcher = DashboardSearcher;
