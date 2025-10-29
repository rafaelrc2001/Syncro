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
      const id_departamento = usuario.id;
      if (!id_departamento) throw new Error("No se encontró id_departamento");

      const status = document.getElementById("status-filter")?.value || "all";
      const searchInput = document.querySelector(".search-bar input");
      const q = (searchInput ? searchInput.value.trim() : "").trim();

      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (status && status !== "all") params.append("status", status);

      // USAR LOCALHOST:3000 - NO 127.0.0.1:5501
      const apiOrigin = "http://localhost:3000";
      const url = `${apiOrigin}/api/exportar-crear/${encodeURIComponent(
        id_departamento
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
        console.warn("Fallo la exportación server-side, usando datos client-side:", err);
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

      // DEBUG: Mostrar estructura de datos
      console.log("Primer registro completo:", data[0]);
      console.log("Todos los campos disponibles:", Object.keys(data[0] || {}));

      const columns = [
        "id_permiso",
        "prefijo",
        "tipo_permiso",
        "fecha",
        "hora_inicio",
        "tipo_actividad",
        "planta_lugar_trabajo",
        "descripcion_trabajo",
        "empresa",
        "nombre_solicitante",
        "sucursal",
        "contrato",
        "ot_numero",
        "equipo_intervenir",
        "tag",
        "responsable_area",
        "responsable_seguridad",
        "operador_responsable",
        "area",
        "estatus",
        "fecha_hora",
      ];

      // Mapeo directo y seguro
      const rowsForExport = data.map((r) => {
        return {
          id_permiso: r.id_permiso || "",
          prefijo: r.prefijo || "",
          tipo_permiso: r.tipo_permiso || "",
          fecha: r.fecha || "",
          hora_inicio: r.hora_inicio || "",
          tipo_actividad: r.tipo_actividad || "",
          planta_lugar_trabajo: r.planta_lugar_trabajo || "",
          descripcion_trabajo: r.descripcion_trabajo || "",
          empresa: r.empresa || "",
          nombre_solicitante: r.nombre_solicitante || "",
          sucursal: r.sucursal || "",
          contrato: r.contrato || "",
          ot_numero: r.ot_numero || "",
          equipo_intervenir: r.equipo_intervenir || "",
          tag: r.tag || "",
          responsable_area: r.responsable_area || "",
          responsable_seguridad: r.responsable_seguridad || "",
          operador_responsable: r.operador_responsable || "",
          area: r.area || "",
          estatus: r.estatus || "",
          fecha_hora: r.fecha_hora || "",
        };
      });

      console.log("Datos mapeados para exportar:", rowsForExport.slice(0, 3));

      const stamp = formatStamp();

      if (window.XLSX && typeof window.XLSX.utils !== "undefined") {
        try {
          const worksheet = window.XLSX.utils.json_to_sheet(rowsForExport, {
            header: columns,
          });
          const workbook = window.XLSX.utils.book_new();
          window.XLSX.utils.book_append_sheet(workbook, worksheet, "CrearPT");
          window.XLSX.writeFile(workbook, `crear-permisos-${stamp}.xlsx`);
          console.log(`Exportación exitosa: crear-permisos-${stamp}.xlsx`);
        } catch (err) {
          console.error("Error al generar Excel:", err);
          toCsvAndDownload(
            rowsForExport,
            columns,
            `crear-permisos-${stamp}.xlsx`
          );
        }
      } else {
        toCsvAndDownload(
          rowsForExport,
          columns,
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
