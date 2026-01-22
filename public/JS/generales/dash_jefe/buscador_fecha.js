// Buscador por fecha para dashboard de supervisor/jefe
// Filtra todas las gráficas y tarjetas solo por rango de fechas

class DashboardDateFilter {
  constructor() {
    this.originalData = null;
    this.filteredData = null;
    this.fechaInicio = null;
    this.fechaFinal = null;
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupFilter());
    } else {
      this.setupFilter();
    }
  }

  setupFilter() {
    this.fechaInicioInput = document.getElementById("fecha-inicio");
    this.fechaFinalInput = document.getElementById("fecha-final");
    this.loadOriginalData();

    if (this.fechaInicioInput) {
      this.fechaInicioInput.addEventListener("change", (e) => {
        this.fechaInicio = e.target.value ? e.target.value : null;
        this.handleFilter();
      });
    }
    if (this.fechaFinalInput) {
      this.fechaFinalInput.addEventListener("change", (e) => {
        this.fechaFinal = e.target.value ? e.target.value : null;
        this.handleFilter();
      });
    }
  }

  async loadOriginalData() {
    try {
      const response = await fetch("/api/graficas_jefes/permisos-jefes");
      this.originalData = await response.json();
      this.filteredData = [...this.originalData];
      window.permisosJefeFiltrados = this.filteredData;
      window.permisosSupervisorFiltrados = this.filteredData;
      // Log de datos originales
      console.log("Datos originales cargados:", this.originalData.length, this.originalData);
      // Log de filtro inicial (sin fechas)
      console.log(`Filtro de fecha aplicado: inicio=${this.fechaInicio}, final=${this.fechaFinal}`);
      console.log(`Permisos filtrados: ${this.filteredData.length}/${this.originalData ? this.originalData.length : 0}`);
      if (window.actualizarTarjetasSupervisor) window.actualizarTarjetasSupervisor();
      if (window.actualizarTarjetasJefe) window.actualizarTarjetasJefe();
      setTimeout(() => {
        this.updateAllCharts();
      }, 1500);
    } catch (error) {
      console.error("Error al cargar datos originales:", error);
    }
  }

  handleFilter() {
    if (!this.originalData) return;
    this.filteredData = Array.isArray(this.originalData)
      ? this.originalData.filter((permiso) => {
          let fechaPermiso = permiso.fecha_hora;
          if (!fechaPermiso) return false;
          let fechaStr = fechaPermiso.split("T")[0];
          if (this.fechaInicio && fechaStr < this.fechaInicio) return false;
          if (this.fechaFinal && fechaStr > this.fechaFinal) return false;
          return true;
        })
      : [];
    window.permisosJefeFiltrados = Array.isArray(this.filteredData) ? this.filteredData : [];
    window.permisosSupervisorFiltrados = Array.isArray(this.filteredData) ? this.filteredData : [];
    // Log para depuración
    console.log(`Filtro de fecha aplicado: inicio=${this.fechaInicio}, final=${this.fechaFinal}`);
    console.log(`Permisos filtrados: ${this.filteredData.length}/${this.originalData ? this.originalData.length : 0}`);
    this.updateAllCharts();
    this.updateCards();
  }

  updateAllCharts() {
    const data = window.permisosJefeFiltrados || this.filteredData || [];
    if (window.permisosAreaChartInstance && window.permisosAreaChartInstance.updateData) {
      const processed = (typeof processPermisosAreaData === 'function') ? processPermisosAreaData(data) : (window.processPermisosAreaData ? window.processPermisosAreaData(data) : null);
      if (processed) window.permisosAreaChartInstance.updateData(processed);
    }
    if (window.permisosMesEstadoChartInstance && window.permisosMesEstadoChartInstance.updateData) {
      const processed = (typeof processPermisosMesEstadoData === 'function') ? processPermisosMesEstadoData(data) : (window.processPermisosMesEstadoData ? window.processPermisosMesEstadoData(data) : null);
      if (processed) window.permisosMesEstadoChartInstance.updateData(processed);
    }
    if (window.statusChartInstance && window.statusChartInstance.updateData) {
      const processed = (typeof processStatusData === 'function') ? processStatusData(data) : (window.processStatusData ? window.processStatusData(data) : null);
      if (processed) window.statusChartInstance.updateData(processed);
    }
    if (window.supervisoresStatusChartInstance && window.supervisoresStatusChartInstance.updateData) {
      const processed = (typeof processSupervisoresData === 'function') ? processSupervisoresData(data) : (window.processSupervisoresData ? window.processSupervisoresData(data) : null);
      if (processed) window.supervisoresStatusChartInstance.updateData(processed);
    }
    if (window.sucursalesStatusChartInstance && window.sucursalesStatusChartInstance.updateData) {
      const processed = (typeof processSucursalesData === 'function') ? processSucursalesData(data) : (window.processSucursalesData ? window.processSucursalesData(data) : null);
      if (processed) window.sucursalesStatusChartInstance.updateData(processed);
    }
    if (window.tiemposAutorizacionTableInstance && window.tiemposAutorizacionTableInstance.updateData) {
      window.tiemposAutorizacionTableInstance.updateData(data);
    } else if (typeof renderTablaTiemposAutorizacion === 'function') {
      renderTablaTiemposAutorizacion(data);
    }
    this.updateTiemposChart();
  }

  updateTiemposChart() {
    const tiemposContainer = document.getElementById("tiempos-chart");
    if (!tiemposContainer) return;
    if (!window.tiemposChartInstance || !window.tiemposChartInstance.chart) return;
    if (!this.filteredData) return;
    if (typeof processTiemposData !== 'function' && !window.processTiemposData) return;
    const processed = (typeof processTiemposData === 'function') ? processTiemposData(this.filteredData) : window.processTiemposData(this.filteredData);
    const tiemposChart = window.tiemposChartInstance.chart;
    const updatedOption = {
      xAxis: { data: processed.permisos },
      series: [
        { data: processed.tiemposCreacionArea },
        { data: processed.tiemposAreaSupervisor },
        { data: processed.tiemposTotales },
      ],
    };
    tiemposChart.setOption(updatedOption, false, true);
  }

  updateCards() {
    if (window.actualizarTarjetasSupervisor) window.actualizarTarjetasSupervisor();
    if (window.actualizarTarjetasJefe) window.actualizarTarjetasJefe();
  }
}

// Inicializar el filtro por fecha cuando el DOM esté listo
let dashboardDateFilter;
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    dashboardDateFilter = new DashboardDateFilter();
    window.dashboardDateFilter = dashboardDateFilter;
    console.log("Buscador por fecha del dashboard inicializado");
  }, 1000);
});

// Exportar para uso global
window.DashboardDateFilter = DashboardDateFilter;
