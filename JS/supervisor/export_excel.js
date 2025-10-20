// export_excel.js
// Llama al endpoint /api/exportar-supervisor y descarga un archivo Excel (.xlsx)
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("export-excel-btn");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    try {
      // Obtener filtros actuales de la UI
      const statusSelect = document.getElementById("status-filter");
      const status = statusSelect ? statusSelect.value : "all";
      const searchInput = document.querySelector(".search-bar input");
      const q = searchInput ? searchInput.value.trim() : "";

      // Llamar al endpoint server-side que devuelve los registros detallados
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (status) params.append("status", status);

      let data = [];
      try {
        const url = `http://localhost:3000/api/exportar-supervisor?${params.toString()}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Error al obtener datos para exportar");
        data = await resp.json();
      } catch (serverErr) {
        console.warn(
          "Fallo la exportación server-side, usando datos client-side si están disponibles:",
          serverErr
        );
        // Fallback: usar datos filtrados del cliente si existen
        if (window.getPermisosFiltrados) data = window.getPermisosFiltrados();
      }

      // Transformar los objetos en una hoja de cálculo
      // Asegurarse de que SheetJS (XLSX) esté cargado en la página
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ExportarSupervisor");

      // Generar archivo y forzar descarga
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `exportar_supervisor_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exportando a Excel:", err);
      alert(
        "No se pudo exportar a Excel. Revisa la consola para más detalles."
      );
    }
  });
});
