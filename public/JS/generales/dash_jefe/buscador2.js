// Buscador global para dashboard de supervisor 2
// Filtra todas las gráficas y tarjetas en tiempo real
// Gráficas: Supervisores, Categorías, Solicitantes (Departamentos), Sucursales

class DashboardSearcher2 {
  constructor() {
    this.originalData = null;
    this.filteredData = null;
    this.searchInput = null;
    this.fechaInicioInput = null;
    this.fechaFinalInput = null;
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
    this.searchInput = document.querySelector('.search-bar input[type="text"]');
    this.fechaInicioInput = document.getElementById("fecha-inicio");
    this.fechaFinalInput = document.getElementById("fecha-final");
    if (this.searchInput) {
      this.searchInput.value = "";
      this.handleSearch("");
    }
    this.hideNoResultsMessage();

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
      "Buscar por supervisor, categoría...",
      "Ej: Juan Pérez, Mantenimiento...",
      "Buscar departamento, sucursal...",
      "Ej: Operaciones, Planta Norte...",
      "Buscar contrato, área...",
      "Ej: CONTR-001, Producción...",
      "Buscar folio, tipo de permiso...",
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
    console.log("Verificando instancias de gráficas Dashboard 2:");
    console.log("- Supervisores:", !!window.supervisoresChartInstance);
    console.log("- Categorías:", !!window.categoriasChartInstance);
    console.log("- Solicitantes:", !!window.solicitantesChartInstance);
    console.log("- Sucursales:", !!window.sucursalesChartInstance);
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

      // Filtrado por fechas (usa campo fecha_permiso, fecha_solicitud o fecha_hora)
      let coincideFecha = true;
      let fechaPermiso =
        permiso.fecha_permiso || permiso.fecha_solicitud || permiso.fecha_hora;
      if ((this.fechaInicio || this.fechaFinal) && fechaPermiso) {
        let fechaStr = fechaPermiso.split("T")[0];
        if (this.fechaInicio && fechaStr < this.fechaInicio) return false;
        if (this.fechaFinal && fechaStr > this.fechaFinal) return false;
      } else if ((this.fechaInicio || this.fechaFinal) && !fechaPermiso) {
        return false;
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
      `Búsqueda Dashboard 2: "${searchTerm}" - Resultados: ${this.filteredData.length}/${this.originalData.length}`
    );

    // Actualizar todas las gráficas y tarjetas con animación
    setTimeout(() => {
      try {
        this.updateAllCharts();
        this.updateCards();
        console.log("Gráficas Dashboard 2 actualizadas correctamente");
      } catch (error) {
        console.error("Error al actualizar gráficas Dashboard 2:", error);
      }

      this.addSearchFeedback(false);

      // Mostrar mensaje si no hay resultados SOLO si hay búsqueda o fechas
      if (
        this.filteredData.length === 0 &&
        (term || this.fechaInicio || this.fechaFinal) &&
        (term.trim() !== "" || this.fechaInicio || this.fechaFinal)
      ) {
        this.showNoResultsMessage(
          term || `${this.fechaInicio || ""} a ${this.fechaFinal || ""}`
        );
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
      permiso.supervisor,
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
    // Actualizar gráfica de supervisores
    if (
      window.supervisoresChartInstance &&
      window.supervisoresChartInstance.updateData
    ) {
      const supervisoresData = this.processSupervisoresData(this.filteredData);
      window.supervisoresChartInstance.updateData(supervisoresData);
    }

    // Actualizar gráfica de categorías
    if (
      window.categoriasChartInstance &&
      window.categoriasChartInstance.updateData
    ) {
      const categoriasData = this.processCategoriasData(this.filteredData);
      window.categoriasChartInstance.updateData(categoriasData);
    }

    // Actualizar gráfica de solicitantes (departamentos)
    if (
      window.solicitantesChartInstance &&
      window.solicitantesChartInstance.updateData
    ) {
      const solicitantesData = this.processSolicitantesData(this.filteredData);
      window.solicitantesChartInstance.updateData(solicitantesData);
    }

    // Actualizar gráfica de sucursales
    if (
      window.sucursalesChartInstance &&
      window.sucursalesChartInstance.updateData
    ) {
      const sucursalesData = this.processSucursalesData(this.filteredData);
      window.sucursalesChartInstance.updateData(sucursalesData);
    }
  }

  updateCards() {
    // Agregar pequeño delay para mejor experiencia visual
    setTimeout(() => {
      this.cargarTarjetasFiltradas();
    }, 200);
  }

  // Métodos de procesamiento de datos (copiados de los archivos originales)
  processSupervisoresData(data) {
    const supCounts = {};
    const supLabels = {};
    data.forEach((item) => {
      if (item.supervisor) {
        const normalized = item.supervisor
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
        supCounts[normalized] = (supCounts[normalized] || 0) + 1;
        if (!supLabels[normalized]) {
          supLabels[normalized] = item.supervisor;
        }
      }
    });
    const categories = Object.values(supLabels);
    const values = Object.keys(supLabels).map((key) => supCounts[key]);
    const colors = [
      "#D32F2F",
      "#FF6F00",
      "#FFC107",
      "#003B5C",
      "#00BFA5",
      "#7B1FA2",
      "#0097A7",
      "#C51162",
      "#43A047",
      "#F4511E",
    ];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
    };
  }

  processCategoriasData(data) {
    const catCounts = {};
    const catLabels = {};
    data.forEach((item) => {
      if (item.categoria) {
        const normalized = item.categoria
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
        catCounts[normalized] = (catCounts[normalized] || 0) + 1;
        if (!catLabels[normalized]) {
          catLabels[normalized] = item.categoria;
        }
      }
    });
    const categories = Object.values(catLabels);
    const values = Object.keys(catLabels).map((key) => catCounts[key]);
    const colors = [
      "#00BFA5",
      "#FF6F00",
      "#D32F2F",
      "#003B5C",
      "#7B1FA2",
      "#FFC107",
      "#0097A7",
      "#C51162",
      "#43A047",
      "#F4511E",
    ];
    const icons = ["🔧", "⚡", "🧪", "🏭", "📦", "🛠️", "🚧", "🔬", "🧰", "🏗️"];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
      icons: categories.map((_, i) => icons[i % icons.length]),
    };
  }

  processSolicitantesData(data) {
    const deptCounts = {};
    const deptLabels = {};
    data.forEach((item) => {
      if (item.departamento) {
        const normalized = item.departamento
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
        deptCounts[normalized] = (deptCounts[normalized] || 0) + 1;
        if (!deptLabels[normalized]) {
          deptLabels[normalized] = item.departamento;
        }
      }
    });
    const categories = Object.values(deptLabels);
    const values = Object.keys(deptLabels).map((key) => deptCounts[key]);
    const colors = [
      "#003B5C",
      "#00BFA5",
      "#FF6F00",
      "#D32F2F",
      "#FFC107",
      "#7B1FA2",
      "#0097A7",
      "#C51162",
      "#43A047",
      "#F4511E",
    ];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
    };
  }

  processSucursalesData(data) {
    const sucCounts = {};
    const sucLabels = {};
    data.forEach((item) => {
      if (item.sucursal) {
        const normalized = item.sucursal
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .toLowerCase();
        sucCounts[normalized] = (sucCounts[normalized] || 0) + 1;
        if (!sucLabels[normalized]) {
          sucLabels[normalized] = item.sucursal;
        }
      }
    });
    const categories = Object.values(sucLabels);
    const values = Object.keys(sucLabels).map((key) => sucCounts[key]);
    const colors = [
      "#003B5C",
      "#FF6F00",
      "#00BFA5",
      "#D32F2F",
      "#7B1FA2",
      "#FFC107",
      "#0097A7",
      "#C51162",
      "#43A047",
      "#F4511E",
    ];
    const icons = ["🏭", "🔧", "🏢", "🏬", "🏠", "🏣", "🏨", "🏦", "🏥", "🏛️"];
    return {
      categories,
      values,
      colors: categories.map((_, i) => colors[i % colors.length]),
      icons: categories.map((_, i) => icons[i % icons.length]),
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
      console.error("Error al cargar tarjetas filtradas Dashboard 2:", err);
    }
  }

  // Métodos públicos
  clearSearch() {
    this.hideNoResultsMessage();
    if (this.searchInput) {
      this.searchInput.value = "";
      this.handleSearch("");
    }
  }

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
          <p>Intenta con otros términos como supervisor, categoría, departamento, sucursal, etc.</p>
          <button onclick="window.dashboardSearcher2.clearSearch()">
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
let dashboardSearcher2;

document.addEventListener("DOMContentLoaded", function () {
  // Esperar un poco para que se inicialicen las gráficas
  setTimeout(() => {
    dashboardSearcher2 = new DashboardSearcher2();

    // Hacer disponible globalmente
    window.dashboardSearcher2 = dashboardSearcher2;

    console.log("Buscador del dashboard 2 inicializado");
  }, 1000);
});

// Exportar para uso global
window.DashboardSearcher2 = DashboardSearcher2;
