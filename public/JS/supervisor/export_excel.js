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
        const url = `/api/exportar-supervisor?${params.toString()}`;
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
      // Procesar los datos para dividir fecha_hora en fecha y hora
      const processed = data.map((row) => {
        let fecha = "";
        let hora = "";
        if (row.fecha_hora) {
          try {
            const d = new Date(row.fecha_hora);
            if (!isNaN(d.getTime())) {
              fecha = d.toISOString().slice(0, 10);
              hora = d.toTimeString().slice(0, 5);
            }
          } catch {}
        }
        // Eliminar fecha_hora y agregar fecha y hora
        const { fecha_hora, ...rest } = row;
        return { ...rest, fecha, hora };
      });
      // Ordenar columnas: poner fecha y hora al final
      const columns = [
        "prefijo",
        "fecha",
        "hora",
        "hora_inicio",
        "id_departamento",
        "id_area",
        "id_sucursal",
        "descripcion_trabajo",
        "estatus",
        "subestatus",
        "empresa"
      ];
      // Agregar el resto de columnas que existan y no estén en la lista
      const extraCols = Object.keys(processed[0] || {}).filter(
        (c) => !columns.includes(c)
      );
      // Finalmente, agregar las columnas extra después de empresa y antes de hora
      const finalColumns = [
        ...columns.slice(0, 10), // hasta empresa
        ...extraCols,
        columns[10] // hora
      ];
      const worksheet = XLSX.utils.json_to_sheet(processed, { header: finalColumns });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "ExportarSupervisor");

      // Generar archivo y forzar descarga
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const now = new Date();
      const pad = n => n.toString().padStart(2, '0');
      const fecha = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const hora = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
      a.download = `exportar_supervisor_${fecha}_${hora}.xlsx`;
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
