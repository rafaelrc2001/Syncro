// Script de verificación del filtro global
// Ejecutar en la consola del navegador para debuggear

// Función para probar el endpoint directamente
window.probarEndpoint = async function () {
  console.log("🧪 Probando endpoint directamente...");
  try {
    const response = await fetch("/api/tabla-permisos/1");
    const data = await response.json();

    console.log("📊 Total de permisos:", data.permisos.length);

    if (data.permisos.length > 0) {
      const sample = data.permisos[0];
      console.log("📋 Primer permiso:", sample);
      console.log("🔍 Campos disponibles:", Object.keys(sample));
      console.log("🏢 Campo Area:", sample.Area);

      // Verificar todas las áreas
      const areas = [
        ...new Set(data.permisos.map((p) => p.Area || p.area || "Sin área")),
      ];
      console.log("🏢 Áreas únicas encontradas:", areas);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

function verificarFiltroGlobal() {
  console.log("🔍 Verificando sistema de filtro global...");

  // Verificar que existan las instancias de gráficas
  console.log("📊 Instancias de gráficas:");
  console.log("- Áreas:", window.areasChartInstance ? "✅" : "❌");
  console.log("- Tipos:", window.typesChartInstance ? "✅" : "❌");
  console.log("- Estatus:", window.statusChartInstance ? "✅" : "❌");

  // Verificar que exista el filtro global
  console.log("🌐 Filtro global:", window.dashboardFilter ? "✅" : "❌");

  // Verificar elementos del DOM
  console.log("🎨 Elementos DOM:");
  console.log(
    "- Búsqueda:",
    document.getElementById("global-search") ? "✅" : "❌"
  );
  console.log(
    "- Filtro estado:",
    document.getElementById("status-filter") ? "✅" : "❌"
  );
  console.log(
    "- Tabla:",
    document.querySelector(".compact-table tbody") ? "✅" : "❌"
  );

  // Verificar datos
  if (window.dashboardFilter) {
    const stats = window.dashboardFilter.getFilteredStats();
    console.log("📈 Estadísticas:");
    console.log(`- Total original: ${stats.totalOriginal}`);
    console.log(`- Total filtrado: ${stats.totalPermisos}`);
    console.log(`- Porcentaje: ${stats.porcentajeFiltrado}%`);
  }

  console.log("✅ Verificación completada");
}

// Función para probar el filtro
function probarFiltro(termino) {
  console.log(`🧪 Probando filtro con término: "${termino}"`);

  const searchInput = document.getElementById("global-search");
  if (searchInput) {
    searchInput.value = termino;
    searchInput.dispatchEvent(new Event("input"));
    console.log("✅ Filtro aplicado");
  } else {
    console.log("❌ No se encontró el input de búsqueda");
  }
}

// Función para limpiar filtros
function limpiarFiltros() {
  console.log("🧹 Limpiando filtros...");

  const searchInput = document.getElementById("global-search");
  const statusSelect = document.getElementById("status-filter");

  if (searchInput) {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
  }

  if (statusSelect) {
    statusSelect.value = "all";
    statusSelect.dispatchEvent(new Event("change"));
  }

  console.log("✅ Filtros limpiados");
}

// Auto-ejecutar verificación cuando se carga el script
setTimeout(() => {
  verificarFiltroGlobal();
}, 2000);

// Función para ver datos de áreas en detalle
window.debugAreas = function () {
  console.log("🔍 Debug de datos de áreas...");
  if (window.dashboardFilter) {
    console.log(
      "📊 Datos originales de áreas:",
      window.dashboardFilter.originalData.areas
    );
    console.log(
      "📊 Datos filtrados de áreas:",
      window.dashboardFilter.filteredData.areas
    );
    console.log(
      "📊 Permisos filtrados (primeros 3):",
      window.dashboardFilter.filteredData.permisos.slice(0, 3)
    );
  } else {
    console.error("❌ Dashboard filter no disponible");
  }
};

// Hacer funciones disponibles globalmente
window.verificarFiltroGlobal = verificarFiltroGlobal;
window.probarFiltro = probarFiltro;
window.limpiarFiltros = limpiarFiltros;

// Formato de datos para gráficas
window.formatter = function (params) {
  let total = 0;
  if (params && params.series && Array.isArray(params.series.data)) {
    total = params.series.data.reduce((acc, item) => acc + item.value, 0);
  } else {
    total = statusData.values.reduce((a, b) => a + b, 0);
  }
  console.log("DEBUG:", {
    value: params.value,
    total,
    data: params.series.data,
  });
  const percentage =
    total > 0 ? ((params.value / total) * 100).toFixed(1) : "0";
  return `...`;
};
