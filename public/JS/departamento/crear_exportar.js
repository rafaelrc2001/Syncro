// crear_exportar.js - VERSIÓN CORREGIDA
(function () {
  function formatStamp() {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function toCsvAndDownload(rows, columns, filename) {
    if (!rows || !rows.length) {
      alert("No hay registros para exportar.");
      return;
    }
    const keys = columns;
    const lines = [keys.join(",")];
    rows.forEach((r) => {
      const vals = keys.map((k) => {
        const v = r[k] == null ? "" : String(r[k]);
        return '"' + v.replace(/"/g, '""') + '"';
      });
      lines.push(vals.join(","));
    });
    const csv = lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, filename.replace(/\.xlsx$|\.csv$/i, "") + ".csv");
  }

  async function exportCrear() {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
      // Usar id_usuario si existe, luego id_departamento, luego id
      const id_para_exportar = usuario.id_usuario || usuario.id_departamento || usuario.id;
      if (!id_para_exportar) {
        console.error("No se encontró id_usuario, id_departamento ni id en el objeto usuario:", usuario);
        throw new Error("No se encontró id_usuario, id_departamento ni id en el usuario. Por favor, vuelve a iniciar sesión o revisa el almacenamiento local.");
      }

      const status = document.getElementById("status-filter")?.value || "all";
      const searchInput = document.querySelector(".search-bar input");
      const q = (searchInput ? searchInput.value.trim() : "").trim();

      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (status && status !== "all") params.append("status", status);

      // Si filtro es 'Todos' y búsqueda vacía, incluir include_all=1
      if ((status === "all" || !status) && !q) {
        params.append("include_all", "1");
      }

      // Usar la URL pública en producción y localhost en desarrollo
      const apiOrigin =
        window.location.hostname === "localhost"
          ? "http://localhost:3000"
          : "https://syncro-production-30a.up.railway.app"; // Reemplaza por tu URL real de Railway
      const url = `${apiOrigin}/api/exportar-autorizar-departamento/${encodeURIComponent(
        id_para_exportar
      )}?${params.toString()}`;

      console.log("Exportando Crear-PT desde (encoded):", url);
      console.log(
        "Exportando Crear-PT desde (decoded):",
        decodeURIComponent(url)
      );
      console.log("Params enviados:", params.toString());

      let data = [];
      try {
        const resp = await fetch(url);
        console.log("Fetch response URL:", resp.url);
        console.log("Fetch response status:", resp.status, resp.statusText);
        if (!resp.ok)
          throw new Error(
            `Error del servidor: ${resp.status} - ${resp.statusText}`
          );
        data = await resp.json();
      } catch (err) {
        console.warn(
          "Fallo la exportación server-side, usando datos client-side:",
          err
        );
        if (typeof window.getPermisosFiltrados === "function") {
          data = window.getPermisosFiltrados() || [];
        } else {
          data = [];
        }
      }

      if (!Array.isArray(data)) {
        console.error("Datos recibidos no son un array:", data);
        data = [];
      }

      console.log(`Datos recibidos para exportar: ${data.length} registros`);

      if (data.length === 0) {
        alert("No hay datos para exportar con los filtros aplicados");
        return;
      }

      // Exportar todas las columnas devueltas por el endpoint
      if (!data.length) {
        alert("No hay datos para exportar con los filtros aplicados");
        return;
      }
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
      const columns = Object.keys(processed[0] || {}).filter(c => c !== "fecha" && c !== "hora");
      const finalColumns = [...columns, "fecha", "hora"];
      const rowsForExport = processed;
      console.log("Exportando todas las columnas:", finalColumns);
      const stamp = formatStamp();
      if (window.XLSX && typeof window.XLSX.utils !== "undefined") {
        try {
          const worksheet = window.XLSX.utils.json_to_sheet(rowsForExport, {
            header: finalColumns,
          });
          const workbook = window.XLSX.utils.book_new();
          window.XLSX.utils.book_append_sheet(workbook, worksheet, "CrearPT");
          window.XLSX.writeFile(workbook, `crear-permisos-${stamp}.xlsx`);
          console.log(`Exportación exitosa: crear-permisos-${stamp}.xlsx`);
        } catch (err) {
          console.error("Error al generar Excel:", err);
          toCsvAndDownload(
            rowsForExport,
            finalColumns,
            `crear-permisos-${stamp}.xlsx`
          );
        }
      } else {
        toCsvAndDownload(
          rowsForExport,
          finalColumns,
          `crear-permisos-${stamp}.xlsx`
        );
      }
    } catch (err) {
      console.error("Error en exportCrear:", err);
      alert(
        `No se pudo exportar: ${err.message}\n\nVerifica que el servidor esté ejecutándose en http://localhost:3000`
      );
    }
  }

  function attachExportButtons() {
    console.log("Buscando botones de exportación...");

    // Buscar por ID específico
    const btn = document.getElementById("export-excel-crear");
    console.log("Botón encontrado por ID:", btn);

    // Buscar por clase
    const btnByClass = document.querySelector(".export-excel-crear");
    console.log("Botón encontrado por clase:", btnByClass);

    // Buscar cualquier botón con texto relacionado
    const buttons = document.querySelectorAll("button");
    let exportButton = null;

    buttons.forEach((button) => {
      const text = button.textContent || button.innerText;
      if (
        text.includes("Exportar") ||
        text.includes("exportar") ||
        (button.id && button.id.includes("export")) ||
        (button.className && button.className.includes("export"))
      ) {
        console.log("Botón potencial encontrado:", button);
        exportButton = button;
      }
    });

    // Asignar evento al botón principal
    if (btn) {
      console.log("Asignando evento al botón por ID");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        exportCrear();
      });
      return true;
    }

    // Fallback: asignar por clase
    if (btnByClass) {
      console.log("Asignando evento al botón por clase");
      btnByClass.addEventListener("click", (e) => {
        e.preventDefault();
        exportCrear();
      });
      return true;
    }

    // Fallback final
    if (exportButton) {
      console.log("Asignando evento al botón encontrado por texto");
      exportButton.addEventListener("click", (e) => {
        e.preventDefault();
        exportCrear();
      });
      return true;
    }

    console.warn("No se encontró ningún botón de exportación");
    return false;
  }

  // Intentar asignar inmediatamente y en DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM cargado, asignando botones...");
      if (!attachExportButtons()) {
        // Reintentar después de un breve delay por si los botones se cargan dinámicamente
        setTimeout(attachExportButtons, 1000);
      }
    });
  } else {
    console.log("DOM ya listo, asignando botones...");
    attachExportButtons();
  }

  // También exponer la función globalmente para debugging
  window.exportCrear = exportCrear;
  console.log("Función exportCrear disponible globalmente");
})();
